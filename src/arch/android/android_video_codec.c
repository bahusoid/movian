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
#include <libavcodec/avcodec.h>

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
  jobject surface_ref;
  int is_attached;

  const char *mime;
  int width;
  int height;

  int out_width;
  int out_height;

  AVBSFContext *bsf;
  prop_t *codec_info;

} android_video_codec_t;

static int configure_media_codec(android_video_codec_t *avc, media_codec_t *mc, const media_codec_params_t *mcp);

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
    int32_t width = 0, height = 0;
    AMediaFormat_getInt32(format, AMEDIAFORMAT_KEY_WIDTH, &width);
    AMediaFormat_getInt32(format, AMEDIAFORMAT_KEY_HEIGHT, &height);

    int32_t left = 0, top = 0, right = width - 1, bottom = height - 1;
    int32_t l = 0, t = 0, r = 0, b = 0;
    
    int has_l = AMediaFormat_getInt32(format, "crop-left", &l);
    int has_t = AMediaFormat_getInt32(format, "crop-top", &t);
    int has_r = AMediaFormat_getInt32(format, "crop-right", &r);
    int has_b = AMediaFormat_getInt32(format, "crop-bottom", &b);
    
    if (has_l) left = l;
    if (has_t) top = t;
    if (has_r) right = r;
    if (has_b) bottom = b;

    avc->out_width = right - left + 1;
    avc->out_height = bottom - top + 1;

    TRACE(TRACE_DEBUG, "VIDEO", "Format: %dx%d Crop: %d,%d-%d,%d (%d%d%d%d) -> %dx%d",
          width, height, left, top, right, bottom, has_l, has_t, has_r, has_b, avc->out_width, avc->out_height);

    char codec_info[64];
    snprintf(codec_info, sizeof(codec_info), "%s %dx%d (HW)",
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
  if (avc->out_width > 0 && avc->out_height > 0) {
    fi->fi_dar_num = avc->out_width;
    fi->fi_dar_den = avc->out_height;
  } else {
    fi->fi_dar_num = avc->width;
    fi->fi_dar_den = avc->height;
  }
  fi->fi_pts = pts;

  for(int i = 0; i < VIDEO_DECODER_REORDER_SIZE; i++) {
    media_buf_meta_t *mbm = &vd->vd_reorder[i];
    if(mbm->mbm_pts == pts) {
      fi->fi_epoch = mbm->mbm_epoch;
      fi->fi_duration = mbm->mbm_duration;
      fi->fi_user_time = mbm->mbm_user_time;
      fi->fi_drive_clock = mbm->mbm_drive_clock;
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
      if(mp->mp_realtime_delta == 0) 
      {
        mp->mp_realtime_delta = now - fi.fi_pts;
        if(mp->mp_audio_clock_epoch == 0)
          mp->mp_audio_clock_epoch = fi.fi_epoch;
      }
      int64_t rtd = mp->mp_realtime_delta + mp->mp_avdelta;
      int epoch = mp->mp_audio_clock_epoch;
      hts_mutex_unlock(&mp->mp_clock_mutex);

      int64_t wt = fi.fi_pts + rtd;

      if(epoch == fi.fi_epoch) {
        if((wt - now) > 10000LL) {
          while((wt - arch_get_avtime()) > 5000LL) {
            hts_mutex_lock(&mp->mp_clock_mutex);
            int current_epoch = mp->mp_audio_clock_epoch;
            hts_mutex_unlock(&mp->mp_clock_mutex);
            if (current_epoch != epoch) break;

            usleep(2000);
          }
        }
        AMediaCodec_releaseOutputBuffer(avc->codec, idx, 1);
        //fi->fi_update_pts_only = 0; //Can we skip syncing?
        fi.fi_type = 'SURF';
        if (avc->out_width > 0 && avc->out_height > 0) {
            fi.fi_dar_num = avc->out_width;
            fi.fi_dar_den = avc->out_height;
            fi.fi_height = avc->out_height;
        } else {
            fi.fi_dar_num = avc->width;
            fi.fi_dar_den = avc->height;
            fi.fi_height = avc->height;
        }
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
      TRACE(TRACE_ERROR, "MediaCodec", "dequeueOutputBuffer failed: %zd", idx);
      break;
    }
  }
}

static void
android_codec_decode(struct media_codec *mc, struct video_decoder *vd,
                     struct media_queue *mq, struct media_buf *mb, int reqsize)
{
  android_video_codec_t *avc = mc->opaque;
  
  if (!avc->codec) {
      if (mc->parser_ctx && mc->parser_ctx->width > 0 && mc->parser_ctx->height > 0) {
          avc->width = mc->parser_ctx->width;
          avc->height = mc->parser_ctx->height;
          TRACE(TRACE_INFO, "Video", "Found resolution from parser: %dx%d", avc->width, avc->height);
          if (configure_media_codec(avc, mc, NULL) < 0) {
              TRACE(TRACE_ERROR, "Video", "Deferred configuration failed");
              return;
          }
      } else if (mc->fmt_ctx && mc->fmt_ctx->width > 0 && mc->fmt_ctx->height > 0) {
           avc->width = mc->fmt_ctx->width;
           avc->height = mc->fmt_ctx->height;
           TRACE(TRACE_INFO, "Video", "Found resolution from fmt_ctx: %dx%d", avc->width, avc->height);
           if (configure_media_codec(avc, mc, NULL) < 0) {
              TRACE(TRACE_ERROR, "Video", "Deferred configuration failed");
              return;
           }
      } else {
           TRACE(TRACE_ERROR, "Video", "Resolution still unknown, dropping frame");
           return;
      }
  }
  mq_update_video_meta(mq, avc->width, avc->height);

  uint8_t *data = mb->mb_data;
  int size = mb->mb_size;
  uint8_t *converted = NULL;

  if(avc->bsf) {
    AVPacket *pkt_in = av_packet_alloc();
    AVPacket *pkt_out = av_packet_alloc();
    if (pkt_in && pkt_out) {
      pkt_in->data = data;
      pkt_in->size = size;
      
      int ret = av_bsf_send_packet(avc->bsf, pkt_in);
      if (ret == 0) {
        ret = av_bsf_receive_packet(avc->bsf, pkt_out);
        if (ret == 0) {
             av_freep(&converted);
             converted = malloc(pkt_out->size);
             if (converted) {
               memcpy(converted, pkt_out->data, pkt_out->size);
               data = converted;
               size = pkt_out->size;
             }
        } else if (ret != AVERROR(EAGAIN)) {
             TRACE(TRACE_ERROR, "Video", "BSF receive packet failed: %d", ret);
        }
      } else {
         TRACE(TRACE_ERROR, "Video", "BSF send packet failed: %d", ret);
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
           TRACE(TRACE_ERROR, "MediaCodec", "Input buffer too small: %zu < %d", bufsize, size);
           size = bufsize;
        }
        memcpy(buf, data, size);
        AMediaCodec_queueInputBuffer(avc->codec, idx, 0, size, pts, flags);
      }
      break;
    } else if (idx == AMEDIACODEC_INFO_TRY_AGAIN_LATER) {
      drain_output(avc, vd);
    } else {
      TRACE(TRACE_ERROR, "MediaCodec", "dequeueInputBuffer failed: %zd", idx);
      break;
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

  if (avc->bsf) {
    av_bsf_flush(avc->bsf);
  }

  for(int i=0; i<VIDEO_DECODER_REORDER_SIZE; i++)
    vd->vd_reorder[i].mbm_pts = AV_NOPTS_VALUE;
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

  if (avc->surface_ref) {
    JNIEnv *env;
    int status = (*JVM)->GetEnv(JVM, (void **)&env, JNI_VERSION_1_6);
    if (status == JNI_EDETACHED) {
        if ((*JVM)->AttachCurrentThread(JVM, &env, NULL) == 0) {
            (*env)->DeleteGlobalRef(env, avc->surface_ref);
            (*JVM)->DetachCurrentThread(JVM);
        }
    } else if (status == JNI_OK) {
        (*env)->DeleteGlobalRef(env, avc->surface_ref);
    }
  }

  if (avc->is_attached) {
    (*JVM)->DetachCurrentThread(JVM);
  }

  prop_ref_dec(avc->codec_info);

  if(avc->bsf)
    av_bsf_free(&avc->bsf);
    
  free(avc);
}

static int
configure_media_codec(android_video_codec_t *avc, media_codec_t *mc, const media_codec_params_t *mcp)
{
  media_pipe_t *mp = mc->mp;
  const char *mime = avc->mime;

  // Attach thread FIRST
  JNIEnv *env;
  int jni_status = (*JVM)->GetEnv(JVM, (void **)&env, JNI_VERSION_1_6);
  if (jni_status == JNI_EDETACHED) {
    if ((*JVM)->AttachCurrentThread(JVM, &env, NULL) != 0) {
       TRACE(TRACE_ERROR, "Video", "Failed to attach to JVM");
       return -1;
    }
    avc->is_attached = 1;
  }

  AMediaCodec *codec = AMediaCodec_createDecoderByType(mime);
  if (!codec) {
    TRACE(TRACE_ERROR, "Video", "Failed to create MediaCodec for %s", mime);
    if (avc->is_attached) (*JVM)->DetachCurrentThread(JVM);
    avc->is_attached = 0;
    return -1;
  }
  avc->codec = codec;
  
  const frame_info_t fi = {
      .fi_dar_num = avc->width,
      .fi_dar_den = avc->height,
      .fi_height = avc->height,
  };
  
  intptr_t surface_ptr = mp->mp_set_video_codec('SURF', mc, mp->mp_video_frame_opaque, &fi);
  jobject surface = (jobject)surface_ptr;
  
  if (!surface) {
     TRACE(TRACE_ERROR, "Video", "Failed to get surface");
     AMediaCodec_delete(codec);
     avc->codec = NULL;
     if (avc->is_attached) (*JVM)->DetachCurrentThread(JVM);
     avc->is_attached = 0;
     return -1;
  }

  avc->surface_ref = surface;
  avc->window = ANativeWindow_fromSurface(env, surface);
  
  if (!avc->window) {
     TRACE(TRACE_ERROR, "Video", "Failed to get ANativeWindow");
     (*env)->DeleteGlobalRef(env, avc->surface_ref);
     avc->surface_ref = NULL;
     AMediaCodec_delete(codec);
     avc->codec = NULL;
     if (avc->is_attached) (*JVM)->DetachCurrentThread(JVM);
     avc->is_attached = 0;
     return -1;
  }

  AMediaFormat *format = AMediaFormat_new();
  AMediaFormat_setString(format, AMEDIAFORMAT_KEY_MIME, mime);
  
  AMediaFormat_setInt32(format, AMEDIAFORMAT_KEY_WIDTH, avc->width);
  AMediaFormat_setInt32(format, AMEDIAFORMAT_KEY_HEIGHT, avc->height);

  const char* filter_name;
  switch (mc->codec_id)
  {
  case AV_CODEC_ID_H264:
    filter_name = "h264_mp4toannexb";
    break;
  case AV_CODEC_ID_HEVC:
    filter_name = "hevc_mp4toannexb";
    break;
  
  default:
    filter_name = NULL;
    break;
  }
  if (filter_name == NULL) {
      if (mcp && mcp->extradata && mcp->extradata_size > 0) {
          TRACE(TRACE_DEBUG, "Video", "Setting csd-0 of size %d", mcp->extradata_size);
          AMediaFormat_setBuffer(format, "csd-0", mcp->extradata, mcp->extradata_size);
      }
  }
  
  TRACE(TRACE_DEBUG, "Video", "Configure MediaCodec: %dx%d", avc->width, avc->height);
  
  media_status_t status = AMediaCodec_configure(codec, format, avc->window, NULL, 0);
  AMediaFormat_delete(format);
  
  if (status != AMEDIA_OK) {
     TRACE(TRACE_ERROR, "Video", "AMediaCodec_configure failed: %d", status);
     ANativeWindow_release(avc->window);
     avc->window = NULL;
     (*env)->DeleteGlobalRef(env, avc->surface_ref);
     avc->surface_ref = NULL;
     AMediaCodec_delete(codec);
     avc->codec = NULL;
     if (avc->is_attached) (*JVM)->DetachCurrentThread(JVM);
     avc->is_attached = 0;
     return -1;
  }
  
  TRACE(TRACE_INFO, "Video", "AMediaCodec configured successfully. Surface: %p Window: %p", surface, avc->window);

  status = AMediaCodec_start(codec);
  if (status != AMEDIA_OK) {
     TRACE(TRACE_ERROR, "Video", "AMediaCodec_start failed: %d", status);
     ANativeWindow_release(avc->window);
     avc->window = NULL;
     (*env)->DeleteGlobalRef(env, avc->surface_ref);
     avc->surface_ref = NULL;
     AMediaCodec_delete(codec);
     avc->codec = NULL;
     if (avc->is_attached) (*JVM)->DetachCurrentThread(JVM);
     avc->is_attached = 0;
     return -1;
  }

  const AVBitStreamFilter *filter;

  filter = filter_name ? av_bsf_get_by_name(filter_name) : NULL;
  if(filter) {
    int ret = av_bsf_alloc(filter, &avc->bsf);
    if (ret < 0) {
      TRACE(TRACE_ERROR, "Video", "Failed to allocate BSF: %d", ret);
      avc->bsf = NULL;
    } else {
      avc->bsf->par_in->codec_type = AVMEDIA_TYPE_VIDEO;
      avc->bsf->par_in->codec_id = mc->codec_id;
      avc->bsf->par_in->width = avc->width;
      avc->bsf->par_in->height = avc->height;

      if (mcp && mcp->extradata && mcp->extradata_size > 0) {
        avc->bsf->par_in->extradata = av_malloc(mcp->extradata_size + AV_INPUT_BUFFER_PADDING_SIZE);
        if (avc->bsf->par_in->extradata) {
          memcpy(avc->bsf->par_in->extradata, mcp->extradata, mcp->extradata_size);
          avc->bsf->par_in->extradata_size = mcp->extradata_size;
          memset(avc->bsf->par_in->extradata + mcp->extradata_size, 0, AV_INPUT_BUFFER_PADDING_SIZE);
        }
      }

      ret = av_bsf_init(avc->bsf);
      if (ret < 0) {
        TRACE(TRACE_ERROR, "Video", "Failed to init BSF: %d", ret);
        av_bsf_free(&avc->bsf);
        avc->bsf = NULL;
      } else {
        TRACE(TRACE_INFO, "Video", "BSF %s initialized", filter_name);
      }
    }
  } else if (filter_name) {
    TRACE(TRACE_ERROR, "Video", "BSF %s not found", filter_name);
  }

  return 0;
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

  android_video_codec_t *avc = calloc(1, sizeof(android_video_codec_t));
  avc->mime = mime;
  if (mcp) {
    avc->width = mcp->width;
    avc->height = mcp->height;
  }

  if (avc->width > 0 && avc->height > 0) {
      if (configure_media_codec(avc, mc, mcp) < 0) {
          free(avc);
          return -1;
      }
  } else {
      TRACE(TRACE_INFO, "Video", "Resolution unknown, deferring MediaCodec configuration");
  }

  avc->codec_info = prop_ref_inc(mp->mp_video.mq_prop_codec);
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
