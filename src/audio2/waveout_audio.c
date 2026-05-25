#include <windows.h>
#include <mmsystem.h>
#include <unistd.h>

#include "main.h"
#include "audio2/audio.h"
#include "media/media.h"


typedef struct decoder {
  audio_decoder_t ad;
  HWAVEOUT hwo;
  WAVEHDR *headers;
  int num_headers;
  int current_header;
} decoder_t;

static void waveout_audio_fini(audio_decoder_t *ad) {
  decoder_t *d = (decoder_t *)ad;
  if (d->hwo) {
    waveOutReset(d->hwo);
    for (int i = 0; i < d->num_headers; i++) {
      waveOutUnprepareHeader(d->hwo, &d->headers[i], sizeof(WAVEHDR));
      free(d->headers[i].lpData);
    }
    free(d->headers);
    waveOutClose(d->hwo);
    d->hwo = NULL;
  }
}

static int waveout_audio_reconfig(audio_decoder_t *ad) {
  decoder_t *d = (decoder_t *)ad;
  waveout_audio_fini(ad);

  ad->ad_out_sample_format = AV_SAMPLE_FMT_S16;
  ad->ad_out_sample_rate = 48000;
  ad->ad_out_channel_layout = AV_CH_LAYOUT_STEREO;
  ad->ad_tile_size = 1024; // Samples

  WAVEFORMATEX wfx;
  memset(&wfx, 0, sizeof(wfx));
  wfx.wFormatTag = WAVE_FORMAT_PCM;
  wfx.nChannels = 2;
  wfx.nSamplesPerSec = 48000;
  wfx.wBitsPerSample = 16;
  wfx.nBlockAlign = (wfx.nChannels * wfx.wBitsPerSample) / 8;
  wfx.nAvgBytesPerSec = wfx.nSamplesPerSec * wfx.nBlockAlign;

  if (waveOutOpen(&d->hwo, WAVE_MAPPER, &wfx, 0, 0, CALLBACK_NULL) != MMSYSERR_NOERROR) {
      return -1;
  }

  d->num_headers = 8;
  d->headers = calloc(d->num_headers, sizeof(WAVEHDR));
  for (int i = 0; i < d->num_headers; i++) {
      d->headers[i].dwBufferLength = ad->ad_tile_size * wfx.nBlockAlign;
      d->headers[i].lpData = malloc(d->headers[i].dwBufferLength);
      waveOutPrepareHeader(d->hwo, &d->headers[i], sizeof(WAVEHDR));
      d->headers[i].dwFlags |= WHDR_DONE;
  }
  d->current_header = 0;
  return 0;
}

static int waveout_audio_deliver(audio_decoder_t *ad, int samples, int64_t pts, int epoch) {
  decoder_t *d = (decoder_t *)ad;
  if (!d->hwo) return 0;
  
  // Wait for a free buffer
  while (!(d->headers[d->current_header].dwFlags & WHDR_DONE)) {
      usleep(1000);
      if (!d->hwo) return 0;
  }

  int bytes = samples * 4; // 2 channels * 16 bits
  if (bytes > d->headers[d->current_header].dwBufferLength)
      bytes = d->headers[d->current_header].dwBufferLength;

    uint8_t *planes[1] = { (uint8_t *)d->headers[d->current_header].lpData };
  swr_convert(ad->ad_avr, planes, samples, NULL, 0);
  
  waveOutWrite(d->hwo, &d->headers[d->current_header], sizeof(WAVEHDR));
  
  d->current_header = (d->current_header + 1) % d->num_headers;
  return 0;
}

static void waveout_audio_pause(audio_decoder_t *ad) {
  decoder_t *d = (decoder_t *)ad;
  if (d->hwo) waveOutPause(d->hwo);
}

static void waveout_audio_play(audio_decoder_t *ad) {
  decoder_t *d = (decoder_t *)ad;
  if (d->hwo) waveOutRestart(d->hwo);
}

static void waveout_audio_flush(audio_decoder_t *ad) {
  decoder_t *d = (decoder_t *)ad;
  if (d->hwo) waveOutReset(d->hwo);
}

static audio_class_t waveout_audio_class = {
  .ac_alloc_size       = sizeof(decoder_t),
  .ac_fini             = waveout_audio_fini,
  .ac_reconfig         = waveout_audio_reconfig,
  .ac_deliver_unlocked = waveout_audio_deliver,
  .ac_pause            = waveout_audio_pause,
  .ac_play             = waveout_audio_play,
  .ac_flush            = waveout_audio_flush,
};

audio_class_t *audio_driver_init(struct prop *asettings) {
  return &waveout_audio_class;
}
