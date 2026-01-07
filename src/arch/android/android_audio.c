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
#include <assert.h>
#include <string.h>
#include <jni.h>

#include <SLES/OpenSLES.h>
#include <SLES/OpenSLES_Android.h>

#include "audio2/audio.h"
#include "misc/minmax.h"
#include "settings.h"
#include "htsmsg/htsmsg_store.h"

#include <libavcodec/avcodec.h>

#define PCM_RING_SIZE 8
#define PCM_RING_MASK (PCM_RING_SIZE - 1)

// Passthrough codec type constants (matching AudioPassthrough.java)
#define PT_CODEC_AC3    1
#define PT_CODEC_EAC3   2
#define PT_CODEC_DTS    3
#define PT_CODEC_DTS_HD 4
#define PT_CODEC_TRUEHD 5

// Passthrough settings (user configurable per-format)
static int passthrough_ac3_mode = 0;    // 0=Off, 1=On
static int passthrough_eac3_mode = 0;   // 0=Off, 1=On
static int passthrough_dts_mode = 0;    // 0=Off, 1=On
static int passthrough_dtshd_mode = 0;  // 0=Off, 1=On
static int passthrough_truehd_mode = 0; // 0=Off, 1=On

// Device passthrough capabilities (set from Java via JNI)
static int cap_ac3_supported = 0;
static int cap_eac3_supported = 0;
static int cap_dts_supported = 0;
static int cap_dtshd_supported = 0;
static int cap_truehd_supported = 0;
static int cap_iec61937_supported = 0;
static int cap_legacy_iec_supported = 0;  // Android 5.0 PCM16 IEC hack

// JNI references for AudioPassthrough class
static jclass audioPassthroughClass = NULL;
static jmethodID probeCapabilitiesMethod = NULL;
static jmethodID createMethod = NULL;
static jmethodID writeMethod = NULL;
static jmethodID writeShortsMethod = NULL;
static jmethodID playMethod = NULL;
static jmethodID pauseMethod = NULL;
static jmethodID stopMethod = NULL;
static jmethodID flushMethod = NULL;
static jmethodID releaseMethod = NULL;
static jmethodID getPlaybackHeadPositionMethod = NULL;
static jmethodID getMinBufferSizeMethod = NULL;
static jmethodID getEncodingForCodecMethod = NULL;

// External JNI environment access
extern JavaVM *JVM;


typedef struct decoder {
  audio_decoder_t ad;
  SLObjectItf d_engine;
  SLObjectItf d_mixer;
  SLObjectItf d_player;

  // Interfaces

  SLEngineItf d_eif;
  SLPlayItf d_pif;
  SLVolumeItf d_vif;
  SLAndroidSimpleBufferQueueItf d_bif;


  int d_framesize;
  void *d_pcmbuf;

  int d_pcmbuf_offset;
  int d_pcmbuf_size;

  int d_avail_buffers;

  int d_write_ptr;
  int d_read_ptr;

  float d_gain;
  float d_last_set_vol;

  int d_sleeptime;

  int d_samples_sent;

  int64_t d_timestamp[PCM_RING_SIZE];
  int d_epoch[PCM_RING_SIZE];

  int d_mark_epoch;
  int64_t d_mark_ts;
  int64_t d_mark_samples;

  int d_paused;

  int d_partial_samples;

  // Passthrough support
  int d_passthrough_mode;       // 0=PCM, 1=passthrough active
  int d_passthrough_codec;      // PT_CODEC_* constant
  int d_passthrough_use_iec;    // Using IEC61937 mode (vs raw encoding)
  jobject d_pt_instance;        // AudioPassthrough Java object instance
  int d_pt_sample_rate;
  int d_pt_encoding;
  int d_pt_buffer_size;
  int64_t d_pt_samples_written;

} decoder_t;

extern float audio_master_volume;
extern int   audio_master_mute;

int android_system_audio_sample_rate;
int android_system_audio_frames_per_buffer;


static void buffer_callback(SLAndroidSimpleBufferQueueItf bq, void *context);

/**
 * Get JNI environment for current thread
 */
static JNIEnv *
get_jni_env(void)
{
  JNIEnv *env;
  if ((*JVM)->GetEnv(JVM, (void **)&env, JNI_VERSION_1_6) != JNI_OK) {
    if ((*JVM)->AttachCurrentThread(JVM, &env, NULL) != JNI_OK) {
      TRACE(TRACE_ERROR, "Android Audio", "Failed to attach thread to JVM");
      return NULL;
    }
  }
  return env;
}

/**
 * JNI callback from Java to report passthrough capabilities
 */
JNIEXPORT void JNICALL
Java_com_lonelycoder_mediaplayer_AudioPassthrough_reportCapabilities(
    JNIEnv *env, jclass cls,
    jboolean ac3, jboolean eac3, jboolean dts, 
    jboolean dtsHd, jboolean trueHd, jboolean iec61937, jboolean legacyIec)
{
  cap_ac3_supported = ac3;
  cap_eac3_supported = eac3;
  cap_dts_supported = dts;
  cap_dtshd_supported = dtsHd;
  cap_truehd_supported = trueHd;
  cap_iec61937_supported = iec61937;
  cap_legacy_iec_supported = legacyIec;
  
  TRACE(TRACE_INFO, "Android Audio", 
        "Passthrough capabilities - AC3:%d E-AC3:%d DTS:%d DTS-HD:%d TrueHD:%d IEC:%d Legacy:%d",
        ac3, eac3, dts, dtsHd, trueHd, iec61937, legacyIec);
}

/**
 * Initialize JNI references for AudioPassthrough class
 */
static int
init_passthrough_jni(JNIEnv *env)
{
  if (audioPassthroughClass != NULL)
    return 0;  // Already initialized
  
  jclass localClass = (*env)->FindClass(env, 
      "com/lonelycoder/mediaplayer/AudioPassthrough");
  if (localClass == NULL) {
    TRACE(TRACE_ERROR, "Android Audio", "Failed to find AudioPassthrough class");
    return -1;
  }
  
  audioPassthroughClass = (*env)->NewGlobalRef(env, localClass);
  (*env)->DeleteLocalRef(env, localClass);
  
  // Get static methods
  probeCapabilitiesMethod = (*env)->GetStaticMethodID(env, 
      audioPassthroughClass, "probeCapabilities", "()V");
  getMinBufferSizeMethod = (*env)->GetStaticMethodID(env,
      audioPassthroughClass, "getMinBufferSize", "(III)I");
  getEncodingForCodecMethod = (*env)->GetStaticMethodID(env,
      audioPassthroughClass, "getEncodingForCodec", "(IZ)I");
  
  // Get instance methods
  createMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "create", "(Landroid/content/Context;IIII)Z");
  writeMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "write", "([BII)I");
  writeShortsMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "writeShorts", "([SII)I");
  playMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "play", "()V");
  pauseMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "pause", "()V");
  stopMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "stop", "()V");
  flushMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "flush", "()V");
  releaseMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "release", "()V");
  getPlaybackHeadPositionMethod = (*env)->GetMethodID(env, audioPassthroughClass,
      "getPlaybackHeadPosition", "()I");
  
  if (!probeCapabilitiesMethod || !createMethod || !writeMethod ||
      !playMethod || !pauseMethod || !releaseMethod) {
    TRACE(TRACE_ERROR, "Android Audio", "Failed to get AudioPassthrough methods");
    return -1;
  }
  
  // Probe device capabilities
  (*env)->CallStaticVoidMethod(env, audioPassthroughClass, probeCapabilitiesMethod);
  
  TRACE(TRACE_DEBUG, "Android Audio", "AudioPassthrough JNI initialized");
  return 0;
}

/**
 * Release passthrough AudioTrack
 */
static void
android_passthrough_release(decoder_t *d)
{
  if (d->d_pt_instance == NULL)
    return;
  
  JNIEnv *env = get_jni_env();
  if (env == NULL)
    return;
  
  (*env)->CallVoidMethod(env, d->d_pt_instance, releaseMethod);
  (*env)->DeleteGlobalRef(env, d->d_pt_instance);
  d->d_pt_instance = NULL;
  d->d_passthrough_mode = 0;
  
  TRACE(TRACE_DEBUG, "Android Audio", "Passthrough AudioTrack released");
}

/**
 *
 */
static int
android_audio_init(audio_decoder_t *ad)
{
  decoder_t *d = (decoder_t *)ad;

  d->d_gain = 1.0f;
  d->d_last_set_vol = 0;

  if(slCreateEngine(&d->d_engine, 0, NULL, 0, NULL, NULL)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to create engine");
    return -1;
  }

  if((*d->d_engine)->Realize(d->d_engine, SL_BOOLEAN_FALSE)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to relize engine");
    return -1;
  }

  if((*d->d_engine)->GetInterface(d->d_engine, SL_IID_ENGINE, &d->d_eif)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to get interface for engine");
    return -1;
  }

  TRACE(TRACE_DEBUG, "SLES", "Engine opened");

  if((*d->d_eif)->CreateOutputMix(d->d_eif, &d->d_mixer, 0, NULL, NULL)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to create output mixer");
    return -1;
  }

  if((*d->d_mixer)->Realize(d->d_mixer, SL_BOOLEAN_FALSE)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to realize output mixer");
    return -1;
  }

  TRACE(TRACE_DEBUG, "SLES", "Mixer opened");
  return 0;
}


/**
 *
 */
static void
android_stop_player(decoder_t *d)
{
  if(d->d_player != NULL) {
    // Explicitly stop and clear before destroying to prevent callbacks
    if(d->d_pif != NULL)
      (*d->d_pif)->SetPlayState(d->d_pif, SL_PLAYSTATE_STOPPED);
    if(d->d_bif != NULL)
      (*d->d_bif)->Clear(d->d_bif);

    (*d->d_player)->Destroy(d->d_player);
    d->d_player = NULL;
    // d->d_eif must NOT be cleared here as it is needed for re-creation
    d->d_pif = NULL;
    d->d_vif = NULL;
    d->d_bif = NULL;
  }

  // Free memory AFTER stopping the player to avoid race conditions in callbacks
  d->d_avail_buffers = 0;
  free(d->d_pcmbuf);
  d->d_pcmbuf = NULL; 
}

/**
 *
 */
static void
android_audio_fini(audio_decoder_t *ad)
{
  decoder_t *d = (decoder_t *)ad;

  // Release passthrough if active
  android_passthrough_release(d);
  
  android_stop_player(d);
  if (d->d_mixer != NULL)
    (*d->d_mixer)->Destroy(d->d_mixer);
  if (d->d_engine != NULL)
    (*d->d_engine)->Destroy(d->d_engine);
}


static void
player_cb(SLPlayItf caller,
          void *pContext,
          SLuint32 event)
{
  decoder_t *d = pContext;
  media_pipe_t *mp = d->ad.ad_mp;

  if(event != 4) {
    TRACE(TRACE_DEBUG, "SLES" ,"Event %x", event);
    return;
  }
#if 0
  int64_t now = arch_get_avtime();
  static int64_t last;
  int64_t delta_realtime = now - last;
  last = now;
#endif
  SLmillisecond ms;
  (*d->d_pif)->GetPosition(d->d_pif, &ms);

  // Current sample being played
  int64_t current_sample = (int64_t)ms * d->ad.ad_out_sample_rate / 1000LL;

  int64_t audio_delay_samples = d->d_samples_sent - current_sample +
    d->ad.ad_tile_size * PCM_RING_SIZE;

  d->ad.ad_delay = audio_delay_samples * 1000000LL / d->ad.ad_out_sample_rate;
  if(d->d_mark_ts != PTS_UNSET) {

    hts_mutex_lock(&mp->mp_clock_mutex);

    mp->mp_audio_clock_epoch = d->d_mark_epoch;
    mp->mp_audio_clock_avtime = arch_get_avtime();
    mp->mp_audio_clock = d->d_mark_ts - d->ad.ad_delay;
    mp->mp_realtime_delta = mp->mp_audio_clock_avtime - mp->mp_audio_clock;
    hts_mutex_unlock(&mp->mp_clock_mutex);
    d->d_mark_ts = PTS_UNSET;
  }
#if 0
  
  static int last_ms;
  int delta_ms = ms - last_ms;
  last_ms = ms;

  static int last_samples_sent;
  int sd = d->d_samples_sent - last_samples_sent;
  last_samples_sent = d->d_samples_sent;

  int64_t sbt = ((int64_t)ms * 44100LL) / 1000LL;

  TRACE(TRACE_DEBUG, "SLES",
        "RTD:%7lld ts:%7d (delta:%6d) samples:%7d (delta:%6d) sbt:%9lld %9lld rtd:%9lld %c",
        delta_realtime, ms, delta_ms, d->d_samples_sent, sd, sbt,
        d->d_samples_sent - sbt, mp->mp_realtime_delta, upd ? '*' : ' ');
#endif
}



/**
 *
 */
static int
android_audio_reconfig(audio_decoder_t *ad)
{
  decoder_t *d = (decoder_t *)ad;

  android_stop_player(d);

  int num_sles_buffers = 4;

  ad->ad_out_sample_rate = android_system_audio_sample_rate ?: 44100;

  SLDataLocator_AndroidSimpleBufferQueue loc_bufq = {
    SL_DATALOCATOR_ANDROIDSIMPLEBUFFERQUEUE, num_sles_buffers};

  ad->ad_out_sample_format  = AV_SAMPLE_FMT_S16;
  ad->ad_out_channel_layout = AV_CH_LAYOUT_STEREO;

  d->d_framesize = 2 * sizeof(int16_t);

  ad->ad_tile_size = android_system_audio_frames_per_buffer ?: 1024;
  while(ad->ad_tile_size < 512)
    ad->ad_tile_size *= 2;

  d->d_sleeptime = 1000 /* ms */ * ad->ad_tile_size / ad->ad_out_sample_rate;

  d->d_pcmbuf_size = d->d_framesize * ad->ad_tile_size;
  d->d_pcmbuf = calloc(PCM_RING_SIZE, d->d_pcmbuf_size);

  TRACE(TRACE_DEBUG, "SLES",
        "Player samplerate=%d framesize=%d",
        ad->ad_out_sample_rate, ad->ad_tile_size);

  SLDataFormat_PCM format_pcm = {SL_DATAFORMAT_PCM,
                                 2,
                                 ad->ad_out_sample_rate * 1000,
                                 SL_PCMSAMPLEFORMAT_FIXED_16,
                                 SL_PCMSAMPLEFORMAT_FIXED_16,
                                 SL_SPEAKER_FRONT_LEFT |
                                 SL_SPEAKER_FRONT_RIGHT,
                                 SL_BYTEORDER_LITTLEENDIAN};

  SLDataSource audioSrc = {&loc_bufq, &format_pcm};

  // configure audio sink
  SLDataLocator_OutputMix loc_outmix = {SL_DATALOCATOR_OUTPUTMIX,
                                        d->d_mixer};
  SLDataSink audioSnk = {&loc_outmix, NULL};

  // create audio player
  const SLInterfaceID ids[2] = {SL_IID_ANDROIDSIMPLEBUFFERQUEUE, SL_IID_VOLUME};
  const SLboolean req[2]     = {SL_BOOLEAN_TRUE,    SL_BOOLEAN_TRUE};

  if((*d->d_eif)->CreateAudioPlayer(d->d_eif, &d->d_player,
                                    &audioSrc, &audioSnk,
                                    2, ids, req)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to create audio player");
    return -1;
  }

  // realize the player
  if((*d->d_player)->Realize(d->d_player, SL_BOOLEAN_FALSE)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to realize audio player");
    return -1;
  }

  // get the play interface
  if((*d->d_player)->GetInterface(d->d_player, SL_IID_PLAY, &d->d_pif)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to get player interface");
    return -1;
  }


  if((*d->d_player)->GetInterface(d->d_player, SL_IID_VOLUME, &d->d_vif)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to get volume interface");
    return -1;
  }

  // get the buffer queue interface
  if((*d->d_player)->GetInterface(d->d_player, SL_IID_ANDROIDSIMPLEBUFFERQUEUE,
                                  &d->d_bif)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to get buffer queue interface");
    return -1;
  }

  // register callback on the buffer queue
  if((*d->d_bif)->RegisterCallback(d->d_bif, buffer_callback, ad)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to register callback");
    return -1;
  }

  // set the player callback
  if((*d->d_pif)->RegisterCallback(d->d_pif, player_cb, d)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to set playback callback");
    return -1;
  }

  if((*d->d_pif)->SetCallbackEventsMask(d->d_pif, 0x1f)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to set event mask");
    return -1;
  }

  if((*d->d_pif)->SetPositionUpdatePeriod(d->d_pif, 100)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to set position update period");
    return -1;
  }

  for(int i = 0; i < PCM_RING_SIZE; i++)
    d->d_timestamp[i] = PTS_UNSET;

  // set the player's state to playing
  if((*d->d_pif)->SetPlayState(d->d_pif, d->d_paused ?
                               SL_PLAYSTATE_PAUSED : SL_PLAYSTATE_PLAYING)) {
    TRACE(TRACE_ERROR, "SLES", "Unable to set playback state");
    return -1;
  }

  (*d->d_bif)->Enqueue(d->d_bif, d->d_pcmbuf, d->d_pcmbuf_size);
  (*d->d_bif)->Enqueue(d->d_bif, d->d_pcmbuf + d->d_pcmbuf_size, d->d_pcmbuf_size);
  d->d_read_ptr = 1;
  d->d_write_ptr = 2;
  d->d_partial_samples = 0;
  // Account for the samples we just pre-filled so delay calculation is correct
  d->d_samples_sent = 2 * d->ad.ad_tile_size;

  d->d_avail_buffers = num_sles_buffers;
  return 0;
}


/**
 *
 */
static void
buffer_callback(SLAndroidSimpleBufferQueueItf bqif, void *context)
{
  decoder_t *d = context;
  __sync_synchronize();
  const int nr = (d->d_read_ptr + 1) & PCM_RING_MASK;
  if(nr == d->d_write_ptr) {
    TRACE(TRACE_DEBUG, "GLES", "Underrun");
    int offset = d->d_read_ptr * d->d_pcmbuf_size;
    memset(d->d_pcmbuf + offset, 0, d->d_pcmbuf_size);
    (*d->d_bif)->Enqueue(d->d_bif, d->d_pcmbuf + offset, d->d_pcmbuf_size);
    d->d_samples_sent += d->ad.ad_tile_size;
    return;
  }

  int offset = nr * d->d_pcmbuf_size;
  int64_t pts = d->d_timestamp[nr];
  int epoch = d->d_epoch[nr];
  d->d_timestamp[nr] = PTS_UNSET;
  if(pts != PTS_UNSET) {
    d->d_mark_ts = pts;
    d->d_mark_epoch = epoch;
    d->d_mark_samples = d->d_samples_sent;
  }

  (*d->d_bif)->Enqueue(d->d_bif, d->d_pcmbuf + offset, d->d_pcmbuf_size);
  d->d_samples_sent += d->ad.ad_tile_size;

  d->d_read_ptr = nr;
  __sync_synchronize();
}


/**
 *
 */
static int
android_audio_deliver(audio_decoder_t *ad, int samples, int64_t pts, int epoch)
{
  decoder_t *d = (decoder_t *)ad;

  float gain = audio_master_mute ? 0.0f : (d->d_gain * audio_master_volume);
  if(gain != d->d_last_set_vol) {
    d->d_last_set_vol = gain;

    int mb = lroundf(2000.f * log10f(gain));
    mb = MAX(mb, SL_MILLIBEL_MIN);
    (*d->d_vif)->SetVolumeLevel(d->d_vif, mb);
  }

  while(1) {
    int needed = ad->ad_tile_size - d->d_partial_samples;
    if(swr_get_out_samples(ad->ad_avr, 0) < needed)
      break;

    __sync_synchronize();

    if(((d->d_write_ptr + 1) & PCM_RING_MASK) == d->d_read_ptr)
      return d->d_sleeptime; // Time for one slot in ring buffer

    uint8_t *data[8] = {0};
    uint8_t *dst = d->d_pcmbuf + d->d_write_ptr * d->d_pcmbuf_size + d->d_partial_samples * d->d_framesize;
    data[0] = dst;

    int ret = swr_convert(ad->ad_avr, data, needed, NULL, 0);
    if(ret < 0) ret = 0;

    d->d_partial_samples += ret; // Accumulate samples

    if(d->d_partial_samples < ad->ad_tile_size) {
      break; // Not enough data for a full tile yet
    }

    if(pts != PTS_UNSET && d->d_partial_samples == ret) {
      d->d_timestamp[d->d_write_ptr] = pts;
      d->d_epoch[d->d_write_ptr] = epoch;
      pts = PTS_UNSET;
    }

    d->d_write_ptr = (d->d_write_ptr + 1) & PCM_RING_MASK;
    d->d_partial_samples = 0;
    __sync_synchronize();
  }

  return 0;
}


/**
 *
 */
static void
android_set_volume(audio_decoder_t *ad, float scale)
{
  decoder_t *d = (decoder_t *)ad;
  d->d_gain = scale;
}



/**
 *
 */
static void
android_audio_pause(audio_decoder_t *ad)
{
  decoder_t *d = (decoder_t *)ad;
  
  // Handle passthrough pause
  if (d->d_passthrough_mode && d->d_pt_instance != NULL) {
    JNIEnv *env = get_jni_env();
    if (env != NULL && pauseMethod != NULL) {
      (*env)->CallVoidMethod(env, d->d_pt_instance, pauseMethod);
    }
    d->d_paused = 1;
    return;
  }
  
  if(d->d_pif != NULL)
    (*d->d_pif)->SetPlayState(d->d_pif, SL_PLAYSTATE_PAUSED);
  d->d_paused = 1;
}


/**
 *
 */
static void
android_audio_play(audio_decoder_t *ad)
{
  decoder_t *d = (decoder_t *)ad;
  
  // Handle passthrough play
  if (d->d_passthrough_mode && d->d_pt_instance != NULL) {
    JNIEnv *env = get_jni_env();
    if (env != NULL && playMethod != NULL) {
      (*env)->CallVoidMethod(env, d->d_pt_instance, playMethod);
    }
    d->d_paused = 0;
    return;
  }
  
  if(d->d_pif != NULL)
    (*d->d_pif)->SetPlayState(d->d_pif, SL_PLAYSTATE_PLAYING);
  d->d_paused = 0;
}


/**
 *
 */
static void
android_audio_flush(audio_decoder_t *ad)
{
  decoder_t *d = (decoder_t *)ad;
  
  // Handle passthrough flush
  if (d->d_passthrough_mode && d->d_pt_instance != NULL) {
    JNIEnv *env = get_jni_env();
    if (env != NULL && flushMethod != NULL) {
      (*env)->CallVoidMethod(env, d->d_pt_instance, flushMethod);
    }
    d->d_pt_samples_written = 0;
    return;
  }
  
  d->d_read_ptr = 0;
  d->d_write_ptr = 1;
  d->d_partial_samples = 0;
  __sync_synchronize();
}


/**
 * Determine audio output mode for given codec
 */
static int
android_audio_get_mode(audio_decoder_t *ad, int codec,
                       const void *extradata, size_t extradata_size)
{
  decoder_t *d = (decoder_t *)ad;
  
  switch(codec) {
  case AV_CODEC_ID_AC3:
    if (passthrough_ac3_mode) {
      if (cap_ac3_supported) {
        d->d_passthrough_codec = PT_CODEC_AC3;
        d->d_passthrough_use_iec = 0;
        TRACE(TRACE_DEBUG, "Android Audio", "AC3 passthrough (raw encoding)");
        return AUDIO_MODE_CODED;
      }
      if (cap_iec61937_supported || cap_legacy_iec_supported) {
        d->d_passthrough_codec = PT_CODEC_AC3;
        d->d_passthrough_use_iec = 1;
        TRACE(TRACE_DEBUG, "Android Audio", "AC3 passthrough (IEC61937)");
        return AUDIO_MODE_SPDIF;
      }
    }
    break;
    
  case AV_CODEC_ID_EAC3:
    if (passthrough_eac3_mode) {
      if (cap_eac3_supported) {
        d->d_passthrough_codec = PT_CODEC_EAC3;
        d->d_passthrough_use_iec = 0;
        TRACE(TRACE_DEBUG, "Android Audio", "E-AC3 passthrough (raw encoding)");
        return AUDIO_MODE_CODED;
      }
      if (cap_iec61937_supported) {
        d->d_passthrough_codec = PT_CODEC_EAC3;
        d->d_passthrough_use_iec = 1;
        TRACE(TRACE_DEBUG, "Android Audio", "E-AC3 passthrough (IEC61937)");
        return AUDIO_MODE_SPDIF;
      }
    }
    break;
    
  case AV_CODEC_ID_DTS:
    // Check for DTS-HD MA/HRA profiles
    // TODO: Parse extradata to detect DTS-HD variants
    if (passthrough_dts_mode) {
      if (cap_dts_supported) {
        d->d_passthrough_codec = PT_CODEC_DTS;
        d->d_passthrough_use_iec = 0;
        TRACE(TRACE_DEBUG, "Android Audio", "DTS passthrough (raw encoding)");
        return AUDIO_MODE_CODED;
      }
      if (cap_iec61937_supported || cap_legacy_iec_supported) {
        d->d_passthrough_codec = PT_CODEC_DTS;
        d->d_passthrough_use_iec = 1;
        TRACE(TRACE_DEBUG, "Android Audio", "DTS passthrough (IEC61937)");
        return AUDIO_MODE_SPDIF;
      }
    }
    break;
    
  case AV_CODEC_ID_TRUEHD:
    if (passthrough_truehd_mode && cap_truehd_supported) {
      d->d_passthrough_codec = PT_CODEC_TRUEHD;
      d->d_passthrough_use_iec = 0;
      TRACE(TRACE_DEBUG, "Android Audio", "TrueHD passthrough");
      return AUDIO_MODE_CODED;
    }
    break;
  }
  
  return AUDIO_MODE_PCM;
}


/**
 * Initialize passthrough AudioTrack for coded mode
 */
static int
android_passthrough_init(decoder_t *d, int codec_type, int sample_rate)
{
  JNIEnv *env = get_jni_env();
  if (env == NULL)
    return -1;
  
  if (init_passthrough_jni(env) < 0)
    return -1;
  
  // Get encoding for codec
  jint encoding = (*env)->CallStaticIntMethod(env, audioPassthroughClass,
      getEncodingForCodecMethod, codec_type, (jboolean)d->d_passthrough_use_iec);
  
  if (encoding == -1) {
    TRACE(TRACE_ERROR, "Android Audio", "No encoding available for codec %d", codec_type);
    return -1;
  }
  
  // Determine channels based on codec
  int channels = 2;
  if (codec_type == PT_CODEC_DTS_HD || codec_type == PT_CODEC_TRUEHD) {
    channels = 8;
  }
  
  // Get minimum buffer size
  jint minBuffer = (*env)->CallStaticIntMethod(env, audioPassthroughClass,
      getMinBufferSizeMethod, encoding, sample_rate, channels);
  
  if (minBuffer <= 0) {
    TRACE(TRACE_ERROR, "Android Audio", "Invalid min buffer size: %d", minBuffer);
    return -1;
  }
  
  // Use larger buffer for passthrough
  int bufferSize = minBuffer * 4;
  
  // Create AudioPassthrough instance
  jmethodID constructor = (*env)->GetMethodID(env, audioPassthroughClass, "<init>", "()V");
  jobject localInstance = (*env)->NewObject(env, audioPassthroughClass, constructor);
  
  if (localInstance == NULL) {
    TRACE(TRACE_ERROR, "Android Audio", "Failed to create AudioPassthrough instance");
    return -1;
  }
  
  // Call create method (pass NULL for context - Java will use cached app context)
  jboolean success = (*env)->CallBooleanMethod(env, localInstance, createMethod,
      NULL, encoding, sample_rate, channels, bufferSize);
  
  if (!success) {
    TRACE(TRACE_ERROR, "Android Audio", "Failed to create passthrough AudioTrack");
    (*env)->DeleteLocalRef(env, localInstance);
    return -1;
  }
  
  d->d_pt_instance = (*env)->NewGlobalRef(env, localInstance);
  (*env)->DeleteLocalRef(env, localInstance);
  
  d->d_pt_sample_rate = sample_rate;
  d->d_pt_encoding = encoding;
  d->d_pt_buffer_size = bufferSize;
  d->d_pt_samples_written = 0;
  d->d_passthrough_mode = 1;
  
  // Start playback
  (*env)->CallVoidMethod(env, d->d_pt_instance, playMethod);
  
  TRACE(TRACE_INFO, "Android Audio", 
        "Passthrough AudioTrack created: encoding=%d rate=%d channels=%d buffer=%d",
        encoding, sample_rate, channels, bufferSize);
  
  return 0;
}


/**
 * Deliver coded (passthrough) audio data
 */
static int
android_audio_deliver_coded(audio_decoder_t *ad, const void *data, size_t size,
                            int64_t pts, int epoch)
{
  decoder_t *d = (decoder_t *)ad;
  media_pipe_t *mp = ad->ad_mp;
  
  // Initialize passthrough if needed
  if (!d->d_passthrough_mode || d->d_pt_instance == NULL) {
    // Default to 48kHz for passthrough
    if (android_passthrough_init(d, d->d_passthrough_codec, 48000) < 0) {
      TRACE(TRACE_ERROR, "Android Audio", "Passthrough init failed, falling back to PCM");
      return -1;
    }
  }
  
  JNIEnv *env = get_jni_env();
  if (env == NULL)
    return -1;
  
  // Create byte array and write data
  jbyteArray byteArray = (*env)->NewByteArray(env, size);
  (*env)->SetByteArrayRegion(env, byteArray, 0, size, (jbyte *)data);
  
  jint written = (*env)->CallIntMethod(env, d->d_pt_instance, writeMethod,
      byteArray, 0, (jint)size);
  
  (*env)->DeleteLocalRef(env, byteArray);
  
  if (written < 0) {
    TRACE(TRACE_ERROR, "Android Audio", "Passthrough write failed: %d", written);
    return -1;
  }
  
  d->d_pt_samples_written += size / 4;  // Approximate samples
  
  // Update audio clock
  if (pts != PTS_UNSET) {
    hts_mutex_lock(&mp->mp_clock_mutex);
    mp->mp_audio_clock_epoch = epoch;
    mp->mp_audio_clock_avtime = arch_get_avtime();
    mp->mp_audio_clock = pts;
    hts_mutex_unlock(&mp->mp_clock_mutex);
  }
  
  return 0;
}


/**
 *
 */
static audio_class_t android_audio_class = {
  .ac_alloc_size     = sizeof(decoder_t),
  .ac_init           = android_audio_init,
  .ac_fini           = android_audio_fini,
  .ac_reconfig       = android_audio_reconfig,
  .ac_deliver_locked = android_audio_deliver,
  .ac_set_volume     = android_set_volume,
  .ac_pause          = android_audio_pause,
  .ac_play           = android_audio_play,
  .ac_flush          = android_audio_flush,
  .ac_get_mode       = android_audio_get_mode,
  .ac_deliver_coded_locked = android_audio_deliver_coded,
};


/**
 *
 */
audio_class_t *
audio_driver_init(struct prop *asettings)
{
  JNIEnv *env = get_jni_env();
  
  // Initialize JNI and probe passthrough capabilities
  if (env != NULL) {
    init_passthrough_jni(env);
  }
  
  // Create passthrough settings section
  settings_create_separator(asettings, _p("Audio Passthrough"));
  
  setting_create(SETTING_BOOL, asettings, SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("AC3 Pass-Through")),
                 SETTING_STORE("audio2", "pt_ac3"),
                 SETTING_WRITE_INT(&passthrough_ac3_mode),
                 NULL);
  
  setting_create(SETTING_BOOL, asettings, SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("E-AC3 Pass-Through")),
                 SETTING_STORE("audio2", "pt_eac3"),
                 SETTING_WRITE_INT(&passthrough_eac3_mode),
                 NULL);
  
  setting_create(SETTING_BOOL, asettings, SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("DTS Pass-Through")),
                 SETTING_STORE("audio2", "pt_dts"),
                 SETTING_WRITE_INT(&passthrough_dts_mode),
                 NULL);
  
  setting_create(SETTING_BOOL, asettings, SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("DTS-HD Pass-Through")),
                 SETTING_STORE("audio2", "pt_dtshd"),
                 SETTING_WRITE_INT(&passthrough_dtshd_mode),
                 NULL);
  
  setting_create(SETTING_BOOL, asettings, SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("TrueHD Pass-Through")),
                 SETTING_STORE("audio2", "pt_truehd"),
                 SETTING_WRITE_INT(&passthrough_truehd_mode),
                 NULL);
  
  return &android_audio_class;
}

