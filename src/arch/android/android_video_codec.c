/*
 *  Copyright (C) 2007-2015 Lonelycoder AB
 *  Reimplemented for NDK MediaCodec
 */
#include <stdio.h>
#include <assert.h>
#include <unistd.h>

#include <jni.h>
#include <android/native_window.h>
#include <android/native_window_jni.h>
#include <media/NdkMediaCodec.h>
#include <media/NdkMediaFormat.h>

#include <libavutil/mem.h>
#include <libavcodec/bsf.h>

#include "main.h"
#include "video/video_decoder.h"
#include "video/video_settings.h"

extern JavaVM *JVM;

#define AVC_TRACE(x, ...) do {                                          \
    if(gconf.enable_MediaCodec_debug)                                   \
      TRACE(TRACE_DEBUG, "MediaCodec", x, ##__VA_ARGS__);		\
  } while(0)

typedef struct android_video_codec {
  AMediaCodec *codec;
  ANativeWindow *window;

  const char *mime;
  int width;
  int height;

  int out_width;
  int out_height;

  AVBSFContext *bsf;
  prop_t *codec_info;

} android_video_codec_t;


static int64_t
store_metadata(video_decoder_t *vd, struct media_buf *mb,
               android_video_codec_t *avc, media_codec_t *mc,
               const void *data, int size)
{
  media_buf_meta_t *mbm = &vd->vd_reorder[vd->vd_reorder_ptr];
  copy_mbm_from_mb(mbm, mb);
  AVC_TRACE("Enqueue buffer reorderslot:%d PTS=%"PRId64,
            vd->vd_reorder_ptr, mbm->mbm_pts);
  vd->vd_reorder_ptr = (vd->vd_reorder_ptr + 1) & VIDEO_DECODER_REORDER_MASK;
  int is_bframe = 0;

  switch(mc->codec_id) {
  case AV_CODEC_ID_MPEG4:
    if(size > 2 && ((const uint8_t *)data)[2] == 0x01) {
      // VOP
      int type = ((const uint8_t *)data)[4] >> 6;
      if(type == 2)
        is_bframe = 1;
    }
    break;
  case AV_CODEC_ID_H264:
    // if(mb->mb_flags & MB_H264_B_FRAME)
    //   is_bframe = 1;
    break;
  }

  mbm->mbm_pts = video_decoder_infer_pts(mbm, vd, is_bframe);
  return mbm->mbm_pts;
}

static void
update_output_format(android_video_codec_t *avc)
{
  AMediaFormat *format = AMediaCodec_getOutputFormat(avc->codec);
  if (format) {
    AMediaFormat_getInt32(format, AMEDIAFORMAT_KEY_WIDTH, &avc->out_width);
    AMediaFormat_getInt32(format, AMEDIAFORMAT_KEY_HEIGHT, &avc->out_height);
    
    TRACE(TRACE_DEBUG, "VIDEO", "Output format changed to %d x %d",
          avc->out_width, avc->out_height);

    char codec_info[64];
    snprintf(codec_info, sizeof(codec_info), "%s %dx%d (Accelerated)",
             avc->mime ? avc->mime : "Unknown", avc->out_width, avc->out_height);
    prop_set_string(avc->codec_info, codec_info);
    
    AMediaFormat_delete(format);
  }
}

static int
fill_frame_info_from_pts(frame_info_t *fi,
                         video_decoder_t *vd,
                         android_video_codec_t *avc,
                         int64_t pts)
{
  fi->fi_dar_num = avc->width;
  fi->fi_dar_den = avc->height;
  fi->fi_pts = pts;

  for(int i = 0; i < VIDEO_DECODER_REORDER_SIZE; i++) {
    media_buf_meta_t *mbm = &vd->vd_reorder[i];
    if(mbm->mbm_pts == pts) {
      fi->fi_epoch = mbm->mbm_epoch;
      fi->fi_duration = mbm->mbm_duration;
      // fi->fi_pos = mbm->mbm_pos;
      return 0;
    }
  }
  // Fallback if not found in reorder buffer
  fi->fi_epoch = vd->vd_mp->mp_audio_clock_epoch; 
  return 0;
}

static void
drain_output(android_video_codec_t *avc, video_decoder_t *vd)
{
  AMediaCodecBufferInfo info;
  while (1) {
    ssize_t idx = AMediaCodec_dequeueOutputBuffer(avc->codec, &info, 0);
    if (idx >= 0) {
      int64_t pts = info.presentationTimeUs;
      
      frame_info_t fi = {};
      fill_frame_info_from_pts(&fi, vd, avc, pts);

      int64_t now = arch_get_avtime();
      media_pipe_t *mp = vd->vd_mp;
      hts_mutex_lock(&mp->mp_clock_mutex);
      int64_t rtd = mp->mp_realtime_delta + mp->mp_avdelta;
      int epoch = mp->mp_audio_clock_epoch;
      hts_mutex_unlock(&mp->mp_clock_mutex);

      int64_t wt = fi.fi_pts + rtd;
      
      if(epoch == fi.fi_epoch && (wt - now) > 10000LL) {
        AVC_TRACE("Display buffer %zd @ %10lld in %16lld rtd=%lld",
                  idx, fi.fi_pts, wt - now, rtd);
        
        AMediaCodec_releaseOutputBufferAtTime(avc->codec, idx, wt * 1000LL);
        
        fi.fi_update_pts_only = 1;
        fi.fi_type = 'SURF';
        fi.fi_dar_num = avc->width;
        fi.fi_dar_den = avc->height;
        fi.fi_height = avc->height;
        video_deliver_frame(vd, &fi);
      } else {
        AVC_TRACE("   Skip buffer %zd @ %10lld in %16lld rtd=%lld",
                  idx, fi.fi_pts, wt - now, rtd);
        AMediaCodec_releaseOutputBuffer(avc->codec, idx, 0);
      }

    } else if (idx == AMEDIACODEC_INFO_OUTPUT_FORMAT_CHANGED) {
      update_output_format(avc);
    } else if (idx == AMEDIACODEC_INFO_TRY_AGAIN_LATER) {
      break;
    } else {
      break;
    }
  }
}

static void
android_codec_decode(struct media_codec *mc, struct video_decoder *vd,
                     struct media_queue *mq, struct media_buf *mb, int reqsize)
{
  android_video_codec_t *avc = mc->opaque;
  uint8_t *data = mb->mb_data;
  int size = mb->mb_size;
  uint8_t *converted = NULL;

  if(avc->bsf) {
    AVPacket *pkt_in = av_packet_alloc();
    AVPacket *pkt_out = av_packet_alloc();
    pkt_in->data = data;
    pkt_in->size = size;
    
    int ret = av_bsf_send_packet(avc->bsf, pkt_in);
    if (ret == 0) {
        ret = av_bsf_receive_packet(avc->bsf, pkt_out);
        if (ret == 0) {
             av_freep(&converted);
             converted = malloc(pkt_out->size);
             memcpy(converted, pkt_out->data, pkt_out->size);
             data = converted;
             size = pkt_out->size;
        }
    }
    av_packet_free(&pkt_in);
    av_packet_free(&pkt_out);
  }

  int64_t pts = store_metadata(vd, mb, avc, mc, data, size);
  uint32_t flags = mb->mb_keyframe ? AMEDIACODEC_BUFFER_FLAG_KEY_FRAME : 0;

  while (1) {
    ssize_t idx = AMediaCodec_dequeueInputBuffer(avc->codec, 2000); // 2ms timeout
    if (idx >= 0) {
      size_t bufsize;
      uint8_t *buf = AMediaCodec_getInputBuffer(avc->codec, idx, &bufsize);
      if (buf) {
        if (size > bufsize) {
           TRACE(TRACE_ERROR, "MediaCodec", "Input buffer too small: %d < %d", bufsize, size);
           size = bufsize;
        }
        memcpy(buf, data, size);
        AMediaCodec_queueInputBuffer(avc->codec, idx, 0, size, pts, flags);
      }
      break;
    } else {
      drain_output(avc, vd);
    }
  }
  
  drain_output(avc, vd);

  av_freep(&converted);
}

static void
android_codec_flush(struct media_codec *mc, struct video_decoder *vd)
{
  android_video_codec_t *avc = mc->opaque;
  if (avc->codec) {
    AMediaCodec_flush(avc->codec);
  }
}

static void
android_codec_close(struct media_codec *mc)
{
  android_video_codec_t *avc = mc->opaque;
  
  if (avc->codec) {
    AMediaCodec_stop(avc->codec);
    AMediaCodec_delete(avc->codec);
  }
  
  if (avc->window) {
    ANativeWindow_release(avc->window);
  }

  prop_ref_dec(avc->codec_info);

  if(avc->bsf)
    av_bsf_free(&avc->bsf);
    
  free(avc);
}

static int
android_codec_create(media_codec_t *mc, const media_codec_params_t *mcp,
                     media_pipe_t *mp)
{
  const char *mime = NULL;
  
  if(!video_settings.video_accel)
    return -1;

  switch(mc->codec_id) {
  case AV_CODEC_ID_H264:       mime = "video/avc"; break;
  case AV_CODEC_ID_HEVC:       mime = "video/hevc"; break;
  case AV_CODEC_ID_MPEG4:      mime = "video/mp4v-es"; break;
  case AV_CODEC_ID_MPEG2VIDEO: mime = "video/mpeg2"; break;
  case AV_CODEC_ID_VP8:        mime = "video/x-vnd.on2.vp8"; break;
  case AV_CODEC_ID_VP9:        mime = "video/x-vnd.on2.vp9"; break;
  default: return -1;
  }

  TRACE(TRACE_DEBUG, "Video", "Creating NDK MediaCodec for %s", mime);

  AMediaCodec *codec = AMediaCodec_createDecoderByType(mime);
  if (!codec) {
    TRACE(TRACE_ERROR, "Video", "Failed to create MediaCodec for %s", mime);
    return -1;
  }

  android_video_codec_t *avc = calloc(1, sizeof(android_video_codec_t));
  avc->codec = codec;
  avc->mime = mime;
  avc->codec_info = prop_ref_inc(mp->mp_video.mq_prop_codec);
  
  const frame_info_t fi = {
      .fi_dar_num = 0,
      .fi_dar_den = 0,
      .fi_height = 0,
  };
  
  int surface_int = mp->mp_set_video_codec('SURF', mc, mp->mp_video_frame_opaque, &fi);
  jobject surface = (jobject)surface_int;
  
  if (!surface) {
     TRACE(TRACE_ERROR, "Video", "Failed to get surface");
     AMediaCodec_delete(codec);
     free(avc);
     return -1;
  }

  JNIEnv *env;
  (*JVM)->GetEnv(JVM, (void **)&env, JNI_VERSION_1_6);
  avc->window = ANativeWindow_fromSurface(env, surface);
  
  if (!avc->window) {
     TRACE(TRACE_ERROR, "Video", "Failed to get ANativeWindow");
     AMediaCodec_delete(codec);
     free(avc);
     return -1;
  }

  AMediaFormat *format = AMediaFormat_new();
  AMediaFormat_setString(format, AMEDIAFORMAT_KEY_MIME, mime);
  
  if (mcp && mcp->extradata_size > 0) {
     AMediaFormat_setBuffer(format, "csd-0", mcp->extradata, mcp->extradata_size);
  }
  
  media_status_t status = AMediaCodec_configure(codec, format, avc->window, NULL, 0);
  AMediaFormat_delete(format);
  
  if (status != AMEDIA_OK) {
     TRACE(TRACE_ERROR, "Video", "AMediaCodec_configure failed: %d", status);
     ANativeWindow_release(avc->window);
     AMediaCodec_delete(codec);
     free(avc);
     return -1;
  }
  
  status = AMediaCodec_start(codec);
  if (status != AMEDIA_OK) {
     TRACE(TRACE_ERROR, "Video", "AMediaCodec_start failed: %d", status);
     ANativeWindow_release(avc->window);
     AMediaCodec_delete(codec);
     free(avc);
     return -1;
  }

  if(mc->codec_id == AV_CODEC_ID_H264) {
    const AVBitStreamFilter *filter = av_bsf_get_by_name("h264_mp4toannexb");
    if(filter) {
      av_bsf_alloc(filter, &avc->bsf);
    }
  }

  mc->opaque = avc;
  mc->close  = android_codec_close;
  mc->flush  = android_codec_flush;
  mc->decode = android_codec_decode;
  
  return 0;
}

static void
android_codec_init(void)
{
}

REGISTER_CODEC(android_codec_init, android_codec_create, 100);
