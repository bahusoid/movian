# Android Audio Passthrough Implementation Plan for Movian

## Overview
This document provides a detailed implementation plan for adding audio passthrough support (AC3, DTS, DTS-HD, E-AC3, TrueHD) to Movian on Android, with support for legacy Android 5.0 (API 21) devices.

## Implementation Status: DONE ✓

The passthrough implementation is complete with the following files:
- **Java**: `android/src/com/lonelycoder/mediaplayer/AudioPassthrough.java`
- **C/JNI**: `src/arch/android/android_audio.c`

## Android API Levels and AudioTrack Methods

### API Level Summary for Passthrough:

| API Level | Android Version | AudioTrack Creation Method | Encodings Available |
|-----------|-----------------|---------------------------|---------------------|
| 21-22 | Android 5.0-5.1 | AudioTrack + AudioAttributes | AC3, E-AC3, DTS, DTS-HD |
| 23-25 | Android 6.0-7.1 | AudioTrack + AudioAttributes | + TrueHD, WRITE_BLOCKING |
| 24+ | Android 7.0+ | AudioTrack + AudioAttributes | + ENCODING_IEC61937 |
| 26+ | Android 8.0+ | AudioTrack.Builder (optimal) | All encodings |

### Key Implementation Details:

1. **Android 8+ (API 26+)**: Uses `AudioTrack.Builder` - the optimal modern API
2. **Android 5-7 (API 21-25)**: Uses legacy `AudioTrack` constructor with `AudioAttributes`
3. **Android 5-6 (API 21-23)**: Legacy IEC hack using `ENCODING_PCM_16BIT` with volume=100%

### Legacy Android 5-6 IEC Passthrough ("Shitty" Mode)
From Kodi's implementation (commit `cc271e294509506fbe5e582144ec08ebbf9649b8`):
- Android 5-6 devices don't have `ENCODING_IEC61937` constant
- **Workaround**: Use `ENCODING_PCM_16BIT` with IEC61937-packed audio data
- **Critical**: Must set system volume to 100% during passthrough and restore after
- Only works for AC3/DTS basic passthrough (not DTS-HD/TrueHD)

## Current State Analysis

### Existing Movian Audio Implementation
- **File**: [src/arch/android/android_audio.c](src/arch/android/android_audio.c)
- Uses **OpenSL ES** (`SLES/OpenSLES.h`) for PCM audio output
- Now includes **AudioTrack API via JNI** for passthrough
- Audio class structure defined in [src/audio2/audio.h](src/audio2/audio.h)

### Reference Implementation (Kodi)
- Uses **Android AudioTrack API via JNI** for passthrough
- Supports two modes:
  1. **RAW Mode**: Uses `ENCODING_AC3`, `ENCODING_DTS`, `ENCODING_DTS_HD`, `ENCODING_E_AC3` encodings
  2. **IEC61937 Mode**: Uses `ENCODING_IEC61937` with IEC-packed data (Android 7.0+)

---

## Architecture

### Dual Audio Path Design:
        } catch (Exception e) {
            Log.e(TAG, "Failed to create AudioTrack: " + e.getMessage());
            return false;
        }
    }
    
    public int write(byte[] data, int offset, int size) {
        if (mAudioTrack == null) return -1;
        return mAudioTrack.write(data, offset, size);
    }
    
    public int write(short[] data, int offset, int size) {
        if (mAudioTrack == null) return -1;
        return mAudioTrack.write(data, offset, size);
    }
    
    public void play() {
        if (mAudioTrack != null) {
            mAudioTrack.play();
        }
    }
    
    public void pause() {
        if (mAudioTrack != null) {
            mAudioTrack.pause();
        }
    }
    
    public void stop() {
        if (mAudioTrack != null) {
            mAudioTrack.stop();
        }
    }
    
    public void flush() {
        if (mAudioTrack != null) {
            mAudioTrack.flush();
        }
    }
    
    public void release() {
        if (mAudioTrack != null) {
            mAudioTrack.release();
            mAudioTrack = null;
        }
        
        // Restore system volume if using legacy IEC
        if (mIsLegacyIEC && mSavedVolume >= 0) {
            restoreSystemVolume();
        }
        mIsLegacyIEC = false;
    }
    
    public int getPlaybackHeadPosition() {
        if (mAudioTrack == null) return 0;
        return mAudioTrack.getPlaybackHeadPosition();
    }
    
    private void setSystemVolume(float volume) {
        try {
            AudioManager am = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
            int maxVol = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
            int curVol = am.getStreamVolume(AudioManager.STREAM_MUSIC);
            mSavedVolume = (float) curVol / maxVol;
            am.setStreamVolume(AudioManager.STREAM_MUSIC, 
                (int)(maxVol * volume), 0);
            Log.d(TAG, "Set system volume to " + volume + ", saved: " + mSavedVolume);
        } catch (Exception e) {
            Log.e(TAG, "Failed to set system volume: " + e.getMessage());
        }
    }
    
    private void restoreSystemVolume() {
        try {
            AudioManager am = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
            int maxVol = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
            am.setStreamVolume(AudioManager.STREAM_MUSIC, 
                (int)(maxVol * mSavedVolume), 0);
            Log.d(TAG, "Restored system volume to " + mSavedVolume);
            mSavedVolume = -1;
        } catch (Exception e) {
            Log.e(TAG, "Failed to restore system volume: " + e.getMessage());
        }
    }
}
```

### Phase 2: Modify android_audio.c for Passthrough Support

#### 2.1 Add passthrough structures and settings

Add to the top of `android_audio.c`:

```c
// Passthrough settings (stored per-format)
static int passthrough_ac3_mode = 0;    // 0=Off, 1=On
static int passthrough_eac3_mode = 0;   // 0=Off, 1=On
static int passthrough_dts_mode = 0;    // 0=Off, 1=On
static int passthrough_dtshd_mode = 0;  // 0=Off, 1=On
static int passthrough_truehd_mode = 0; // 0=Off, 1=On

// Device capabilities (set from Java)
static int cap_ac3_supported = 0;
static int cap_eac3_supported = 0;
static int cap_dts_supported = 0;
static int cap_dtshd_supported = 0;
static int cap_truehd_supported = 0;
static int cap_iec61937_supported = 0;
```

#### 2.2 Add JNI methods for passthrough

```c
// JNI method to receive capabilities from Java
JNIEXPORT void JNICALL
Java_com_lonelycoder_mediaplayer_AudioPassthrough_reportCapabilities(
    JNIEnv *env, jclass cls,
    jboolean ac3, jboolean eac3, jboolean dts, 
    jboolean dtsHd, jboolean trueHd, jboolean iec61937) {
    
    cap_ac3_supported = ac3;
    cap_eac3_supported = eac3;
    cap_dts_supported = dts;
    cap_dtshd_supported = dtsHd;
    cap_truehd_supported = trueHd;
    cap_iec61937_supported = iec61937;
    
    TRACE(TRACE_INFO, "Android Audio", 
          "Passthrough caps - AC3:%d E-AC3:%d DTS:%d DTS-HD:%d TrueHD:%d IEC:%d",
          ac3, eac3, dts, dtsHd, trueHd, iec61937);
}
```

#### 2.3 Implement ac_get_mode callback

```c
static int
android_audio_get_mode(audio_decoder_t *ad, int codec,
                       const void *extradata, size_t extradata_size)
{
    switch(codec) {
    case AV_CODEC_ID_AC3:
        if (passthrough_ac3_mode && (cap_ac3_supported || cap_iec61937_supported))
            return cap_ac3_supported ? AUDIO_MODE_CODED : AUDIO_MODE_SPDIF;
        break;
        
    case AV_CODEC_ID_EAC3:
        if (passthrough_eac3_mode && (cap_eac3_supported || cap_iec61937_supported))
            return cap_eac3_supported ? AUDIO_MODE_CODED : AUDIO_MODE_SPDIF;
        break;
        
    case AV_CODEC_ID_DTS:
        // Check for DTS-HD profile in extradata
        // For now, treat all DTS as basic DTS
        if (passthrough_dts_mode && (cap_dts_supported || cap_iec61937_supported))
            return cap_dts_supported ? AUDIO_MODE_CODED : AUDIO_MODE_SPDIF;
        break;
        
    case AV_CODEC_ID_TRUEHD:
        if (passthrough_truehd_mode && cap_truehd_supported)
            return AUDIO_MODE_CODED;
        break;
    }
    
    return AUDIO_MODE_PCM;
}
```

### Phase 3: Create Passthrough AudioTrack Handler

#### 3.1 Add passthrough decoder structure

```c
typedef struct passthrough_decoder {
    audio_decoder_t ad;
    
    // JNI references
    jobject pt_instance;       // AudioPassthrough Java object
    jmethodID pt_write;        // write method
    jmethodID pt_play;         // play method  
    jmethodID pt_pause;        // pause method
    jmethodID pt_flush;        // flush method
    jmethodID pt_release;      // release method
    jmethodID pt_getHeadPos;   // getPlaybackHeadPosition method
    
    // IEC61937 muxer (for SPDIF mode)
    void *iec_buffer;
    int iec_buffer_size;
    
    // State
    int encoding;
    int sample_rate;
    int channels;
    int paused;
    
    int64_t samples_written;
    int64_t last_head_position;
    
} passthrough_decoder_t;
```

### Phase 4: Add Settings UI

In `audio_driver_init()`:

```c
audio_class_t *
audio_driver_init(struct prop *asettings)
{
    // Probe passthrough capabilities from Java
    // (call AudioPassthrough.probeCapabilities())
    
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
```

---

## Detailed Implementation Steps (For Simpler Models)

### Step 1: Create Java Bridge
1. Create `android/src/com/lonelycoder/mediaplayer/AudioPassthrough.java`
2. Implement encoding constants detection
3. Implement `probeCapabilities()` static method
4. Implement `create()`, `write()`, `play()`, `pause()`, `stop()`, `flush()`, `release()`
5. Implement legacy IEC61937 hack (set/restore system volume)

### Step 2: Modify android_audio.c - Add Variables
1. Add passthrough settings variables (passthrough_ac3_mode, etc.)
2. Add capability variables (cap_ac3_supported, etc.)
3. Add JNI global references for AudioPassthrough class and methods

### Step 3: Modify android_audio.c - Add JNI Native Methods
1. Implement `Java_com_lonelycoder_mediaplayer_AudioPassthrough_reportCapabilities`
2. Add JNI initialization in `audio_driver_init()` to:
   - Get JNIEnv
   - Find AudioPassthrough class
   - Get method IDs
   - Call `probeCapabilities()`

### Step 4: Modify android_audio.c - Add ac_get_mode
1. Implement `android_audio_get_mode()` function
2. Return appropriate AUDIO_MODE based on codec and settings/capabilities
3. Add to audio_class structure: `.ac_get_mode = android_audio_get_mode`

### Step 5: Implement SPDIF Mode (IEC61937 Packing)
1. Use existing SPDIF muxer infrastructure from `audio.c`
2. The main `audio.c` already handles `AUDIO_MODE_SPDIF`:
   - Calls `audio_setup_spdif_muxer()` 
   - Packs audio into IEC61937 format
3. Implement `ac_deliver_locked` to send IEC61937 data to AudioTrack

### Step 6: Implement CODED Mode (Raw Passthrough)
1. Implement `ac_deliver_coded_locked()` callback
2. Send raw audio frames directly to AudioTrack with proper encoding

### Step 7: Create Passthrough AudioTrack Instance
1. Modify `android_audio_reconfig()` to detect passthrough mode
2. Create AudioTrack via JNI instead of OpenSL ES for passthrough
3. Select correct encoding based on codec type

### Step 8: Add Settings UI
1. Add settings in `audio_driver_init()`
2. Store settings in "audio2" namespace
3. Create separate on/off toggles for each format

### Step 9: Handle Mode Switching
1. Implement proper cleanup when switching between PCM and passthrough
2. Destroy OpenSL ES player when switching to passthrough
3. Release AudioTrack when switching back to PCM

### Step 10: Testing
1. Test AC3 passthrough on Android 5.0 device (legacy IEC mode)
2. Test DTS passthrough on Android 5.0 device
3. Test on newer Android devices with native encoding support
4. Verify volume is restored after playback on legacy devices

---

## Key Technical Details

### IEC61937 Frame Format
- Preamble: 0xF872 0x4E1F (sync words)
- Data type: Identifies codec (AC3=0x01, DTS types=0x0B-0x0D)
- Length: Payload size in bits
- Payload: Audio frame data
- Padding: Zero padding to frame boundary

### Frame Sizes
- AC3: 1536 samples (32ms at 48kHz)
- DTS: 512/1024/2048 samples depending on type
- E-AC3: 6144 samples
- TrueHD: 15360 samples

### Android Audio Encoding Constants
```java
ENCODING_AC3 = 5          // API 21+
ENCODING_E_AC3 = 6        // API 21+  
ENCODING_DTS = 7          // API 21+
ENCODING_DTS_HD = 8       // API 21+
ENCODING_IEC61937 = 13    // API 24+
ENCODING_DOLBY_TRUEHD = 14 // API 23+
```

### Legacy Device Hack (Android 5.0)
When `ENCODING_IEC61937` is not available:
1. Use `ENCODING_PCM_16BIT` instead
2. Pack audio in IEC61937 format
3. Set system volume to 100% (data passes through unchanged)
4. Restore volume on stop/release

---

## Files to Create/Modify

### New Files
- `android/src/com/lonelycoder/mediaplayer/AudioPassthrough.java`

### Modified Files
- `src/arch/android/android_audio.c` (major changes)
- `src/arch/android/android.mk` (add new source if needed)

### Optional Additions
- `src/arch/android/android_audio_passthrough.c` (separate file for cleaner code)

---

## Error Handling

1. If AudioTrack creation fails, fall back to PCM mode
2. Log passthrough capability detection results
3. Handle JNI exceptions gracefully
4. Validate encoding support before attempting passthrough
5. Handle audio route changes (HDMI disconnect)

---

## References

- Kodi AESinkAUDIOTRACK.cpp: https://github.com/xbmc/xbmc/blob/master/xbmc/cores/AudioEngine/Sinks/AESinkAUDIOTRACK.cpp
- Android 5.0 legacy commit: https://github.com/bahusoid/xbmc/commit/cc271e294509506fbe5e582144ec08ebbf9649b8
- Android AudioTrack documentation: https://developer.android.com/reference/android/media/AudioTrack
- IEC61937 specification
