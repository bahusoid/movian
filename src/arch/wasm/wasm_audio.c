/*
 *  Copyright (C) 2007-2015 Lonelycoder AB
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  This program is also available under a commercial proprietary license.
 *  For more information, contact andreas@lonelycoder.com
 */
#include <unistd.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/html5.h>
#endif

#include "main.h"
#include "audio2/audio.h"
#include "media/media.h"

#define SLOTS 4
#define SLOTMASK (SLOTS - 1)

typedef struct decoder {
  audio_decoder_t ad;

  pthread_mutex_t mutex;
  pthread_cond_t cond;

  float *samples;  // SLOTS * channels * sizeof(float) * ad_tile_size

  int rdptr;
  int wrptr;

  double nacl_latency;
  int64_t fifo_latency;

} decoder_t;

/**
 * Wasm C-side callback
 */
EMSCRIPTEN_KEEPALIVE
void wasm_audio_process(void *user_data, float *wasm_buf_l, float *wasm_buf_r, int frames) {
  decoder_t *d = user_data;

  pthread_mutex_lock(&d->mutex);

  int off = (d->rdptr & SLOTMASK) * 2 * d->ad.ad_tile_size;
  const float *src = d->samples + off;

  float s = audio_master_mute ? 0 : audio_master_volume * d->ad.ad_vol_scale;

  for(int i = 0; i < frames; i++) {
    wasm_buf_l[i] = src[i * 2 + 0] * s;
    wasm_buf_r[i] = src[i * 2 + 1] * s;
  }

  d->rdptr++;

  // Note: we can map the ScriptProcessor's latency if needed. For now 0.
  d->nacl_latency = 0;

  pthread_cond_signal(&d->cond);
  pthread_mutex_unlock(&d->mutex);
}

EM_JS(int, init_web_audio, (int sample_rate, int buffer_size, void* userdata, float* wasm_buf_l, float* wasm_buf_r), {
    if (typeof window.audioCtx === 'undefined') {
        window.audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: sample_rate});
    }
    var ctx = window.audioCtx;
    if(ctx.state === 'suspended') {
        ctx.resume();
    }

    var spr = ctx.createScriptProcessor(buffer_size, 0, 2);

    spr.onaudioprocess = function(e) {
        var outL = e.outputBuffer.getChannelData(0);
        var outR = e.outputBuffer.getChannelData(1);

        // Pass to C using exported wasm_audio_process
        _wasm_audio_process(userdata, wasm_buf_l, wasm_buf_r, buffer_size);

        // Copy audio data from the WebAssembly buffer into the Web Audio API buffer
        outL.set(HEAPF32.subarray(wasm_buf_l >> 2, (wasm_buf_l >> 2) + buffer_size));
        outR.set(HEAPF32.subarray(wasm_buf_r >> 2, (wasm_buf_r >> 2) + buffer_size));
    };

    spr.connect(ctx.destination);
    window.audioSpr = spr;

    return ctx.sampleRate;
});

EM_JS(void, pause_web_audio, (), {
    if (typeof window.audioCtx !== 'undefined') {
        if (window.audioSpr) {
            window.audioSpr.disconnect();
        }
        window.audioCtx.suspend();
    }
});

EM_JS(void, play_web_audio, (), {
    if (typeof window.audioCtx !== 'undefined') {
         if (window.audioSpr) {
             window.audioSpr.connect(window.audioCtx.destination);
         }
         window.audioCtx.resume();
    }
});

EM_JS(void, finish_web_audio, (), {
    if (window.audioSpr) {
        window.audioSpr.disconnect();
        window.audioSpr.onaudioprocess = null;
        window.audioSpr = null;
    }
});


/**
 *
 */
static void
nacl_audio_fini(audio_decoder_t *ad)
{
  decoder_t *d = (decoder_t *)ad;

  finish_web_audio();

  free(d->samples);
  d->samples = NULL;

  pthread_mutex_destroy(&d->mutex);
  pthread_cond_destroy(&d->cond);
}


/**
 *
 */
static int
nacl_audio_reconfig(audio_decoder_t *ad)
{
  decoder_t *d = (decoder_t *)ad;

  nacl_audio_fini(ad);

  pthread_mutex_init(&d->mutex, NULL);
  pthread_cond_init(&d->cond, NULL);

  int sample_rate = ad->ad_in_sample_rate;
  if(sample_rate <= 0)
    sample_rate = 48000;

  int tile_size = 1024; // typical ScriptProcessor node size

  ad->ad_out_sample_format = AV_SAMPLE_FMT_FLT;
  ad->ad_out_channel_layout = AV_CH_LAYOUT_STEREO;
  ad->ad_tile_size = tile_size;

  // We need to pass float buffers allocated in C for L and R channels
  float* pass_buf_l = malloc(sizeof(float) * tile_size);
  float* pass_buf_r = malloc(sizeof(float) * tile_size);

  sample_rate = init_web_audio(sample_rate, tile_size, d, pass_buf_l, pass_buf_r);
  ad->ad_out_sample_rate = sample_rate;

  d->samples = calloc(1, SLOTS * 2 * sizeof(float) * ad->ad_tile_size);

  TRACE(TRACE_DEBUG, "AUDIO", "Audio playback started (WebAudio API)");

  d->fifo_latency = 1000000LL * ad->ad_tile_size * SLOTS / sample_rate;
  TRACE(TRACE_DEBUG, "AUDIO", "Fifo latency: %d", (int)d->fifo_latency);

  return 0;
}


/**
 *
 */
static int
nacl_audio_deliver(audio_decoder_t *ad, int samples, int64_t pts, int epoch)
{
  decoder_t *d = (decoder_t *)ad;

  pthread_mutex_lock(&d->mutex);

  while((d->rdptr & SLOTMASK) == (d->wrptr & SLOTMASK) &&
        d->wrptr != d->rdptr)
    pthread_cond_wait(&d->cond, &d->mutex);

  pthread_mutex_unlock(&d->mutex);

  int off = (d->wrptr & SLOTMASK) * 2 /* channels */ * d->ad.ad_tile_size;

  uint8_t *data[8] = {0};
  data[0] = (uint8_t *)(d->samples + off);
  swr_convert(ad->ad_avr, data, samples, NULL, 0);
  d->wrptr++;

  if(pts != AV_NOPTS_VALUE) {

    int64_t delay = d->fifo_latency + d->nacl_latency * 1000000.0;
    ad->ad_delay = delay;

    media_pipe_t *mp = ad->ad_mp;

    hts_mutex_lock(&mp->mp_clock_mutex);
    mp->mp_audio_clock_avtime = arch_get_avtime();
    mp->mp_audio_clock_epoch = epoch;
    mp->mp_audio_clock = pts - delay;
    hts_mutex_unlock(&mp->mp_clock_mutex);
  }

  return 0;
}


/**
 *
 */
static void
nacl_audio_pause(audio_decoder_t *ad)
{
  pause_web_audio();
}


/**
 *
 */
static void
nacl_audio_play(audio_decoder_t *ad)
{
  play_web_audio();
}


/**
 *
 */
static void
nacl_audio_flush(audio_decoder_t *ad)
{
}


/**
 *
 */
static audio_class_t nacl_audio_class = {
  .ac_alloc_size       = sizeof(decoder_t),
  .ac_fini             = nacl_audio_fini,
  .ac_reconfig         = nacl_audio_reconfig,
  .ac_deliver_unlocked = nacl_audio_deliver,
  .ac_pause            = nacl_audio_pause,
  .ac_play             = nacl_audio_play,
  .ac_flush            = nacl_audio_flush,
};



/**
 *
 */
audio_class_t *
audio_driver_init(struct prop *asettings)
{
  return &nacl_audio_class;
}


