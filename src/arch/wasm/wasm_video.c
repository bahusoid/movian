/*
 *  Copyright (C) 2007-2015 Lonelycoder AB
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 */
#include <unistd.h>

#include "video/h264_annexb.h"
#include "media/media.h"
#include "video/video_decoder.h"
#include "misc/minmax.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/html5.h>
#endif

// We implement WebCodecs based video decoder here.

#define PICINFO_SIZE 128
typedef struct wasm_video_codec {
  h264_annexb_ctx_t nvc_annexb;
  media_pipe_t *nvc_mp;
  int nvc_run;

  int nvc_picinfo_ptr;
  media_buf_meta_t nvc_picinfo[PICINFO_SIZE];

  hts_cond_t nvc_cond;
  const void *nvc_data;
  size_t nvc_size;
  int nvc_cur_picinfo;
  int decoder_id;
} wasm_video_codec_t;


EM_JS(int, js_video_create, (int codec_id, void *opaque), {
    if (typeof VideoDecoder === 'undefined') {
        return 0;
    }
    if(!window.movianDecoders) window.movianDecoders = {};
    const id = Object.keys(window.movianDecoders).length + 1;
    let candidates = ['avc1.4d401e', 'avc1.42E01E', 'avc3.4d401e'];

    if (codec_id === /* AV_CODEC_ID_HEVC */ 173) {
        candidates = ['hev1.1.6.L93.B0', 'hvc1.1.6.L93.B0', 'hev1.1.6.L120.B0'];
    } else if (codec_id === /* AV_CODEC_ID_VP9 */ 167) {
        candidates = ['vp09.00.10.08', 'vp09.00.41.08'];
    }
    
    const init = {
        output: (chunk) => {
            // Note: Frame returned, queue to rendering
            window.movianDecoders[id].readyFrames.push(chunk);
        },
        error: (e) => {
            console.error(e.message);
        }
    };
    
    let decoder = new VideoDecoder(init);
    let configuredCodec = null;
    for (let i = 0; i < candidates.length; i++) {
        try {
            decoder.configure({
                codec: candidates[i],
                hardwareAcceleration: "prefer-hardware"
            });
            configuredCodec = candidates[i];
            break;
        } catch (e) {
        }
    }

    if (configuredCodec === null) {
        try {
            decoder.close();
        } catch (e) {
        }
        return 0;
    }
    
    window.movianDecoders[id] = {
        decoder: decoder,
        readyFrames: [],
        opaque: opaque,
        codec: configuredCodec
    };
    return id;
});

EM_JS(void, js_video_decode, (int id, const void *ptr, int size, int is_keyframe, double pts), {
    const dec = window.movianDecoders[id];
    if(!dec) return;
    const chunk = new EncodedVideoChunk({
        type: is_keyframe ? 'key' : 'delta',
        timestamp: pts === -1 ? 0 : pts,
        data: HEAPU8.subarray(ptr, ptr + size)
    });
    dec.decoder.decode(chunk);
});

EM_JS(void, js_video_flush, (int id), {
    const dec = window.movianDecoders[id];
    if(dec) dec.decoder.flush();
});

EM_JS(void, js_video_close, (int id), {
    const dec = window.movianDecoders[id];
    if(dec) {
        dec.decoder.close();
        delete window.movianDecoders[id];
    }
});


static int wasm_codec_decode(struct media_codec *mc, struct video_decoder *vd, struct media_queue *mq, struct media_buf *mb) {
    (void)vd;
    (void)mq;
  wasm_video_codec_t *nvc = mc->opaque;
  int is_keyframe = !!(mb->mb_pkt.flags & AV_PKT_FLAG_KEY) ? 1 : 0;
  
  if(nvc->nvc_annexb.extradata != NULL && nvc->nvc_annexb.extradata_injected == 0) {
      js_video_decode(nvc->decoder_id, nvc->nvc_annexb.extradata, nvc->nvc_annexb.extradata_size, 1, -1);
      nvc->nvc_annexb.extradata_injected = 1;
  }
  
  uint8_t *data = mb->mb_data;
  size_t size = mb->mb_size;
  h264_to_annexb(&nvc->nvc_annexb, &data, &size);
  
  js_video_decode(nvc->decoder_id, data, size, is_keyframe, mb->mb_pts);
  
  return 0;
}

static void wasm_codec_flush(struct media_codec *mc, struct video_decoder *vd) {
    (void)vd;
  wasm_video_codec_t *nvc = mc->opaque;
  nvc->nvc_annexb.extradata_injected = 0;
  js_video_flush(nvc->decoder_id);
}

static void wasm_codec_close(struct media_codec *mc) {
  wasm_video_codec_t *nvc = mc->opaque;
  js_video_close(nvc->decoder_id);
  h264_to_annexb_cleanup(&nvc->nvc_annexb);
  free(nvc);
}

static int wasm_codec_create(media_codec_t *mc, const media_codec_params_t *mcp, media_pipe_t *mp) {
  
  wasm_video_codec_t *nvc = calloc(1, sizeof(wasm_video_codec_t));
  nvc->decoder_id = js_video_create(mc->codec_id, nvc);
  
  if(nvc->decoder_id <= 0) {
      free(nvc);
      return 1;
  }
  
  hts_cond_init(&nvc->nvc_cond, &mp->mp_mutex);

  if(mc->codec_id == AV_CODEC_ID_H264 && mcp != NULL && mcp->extradata_size)
    h264_to_annexb_init(&nvc->nvc_annexb, mcp->extradata, mcp->extradata_size);

  nvc->nvc_mp = mp;

  mc->opaque = nvc;
  mc->close  = wasm_codec_close;
  mc->decode_locked = wasm_codec_decode;
  mc->flush  = wasm_codec_flush;
  return 0;
}

REGISTER_CODEC(NULL, wasm_codec_create, 100);
