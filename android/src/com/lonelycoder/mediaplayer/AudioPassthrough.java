package com.lonelycoder.mediaplayer;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.media.AudioAttributes;
import android.os.Build;
import android.content.Context;
import android.util.Log;

/**
 * Audio passthrough support for AC3, DTS, E-AC3, DTS-HD, TrueHD
 * Supports legacy Android 5.0 devices via IEC61937 packing with PCM16
 */
public class AudioPassthrough {
    private static final String TAG = "MovianAudioPT";
    
    // Static application context set during initialization
    private static Context sAppContext = null;
    
    private AudioTrack mAudioTrack;
    private float mSavedVolume = -1;
    private Context mContext;
    private boolean mIsLegacyIEC = false;
    private int mEncoding;
    private int mSampleRate;
    
    // Encoding constants (will be -1 if not supported on device)
    public static int ENCODING_AC3 = -1;
    public static int ENCODING_E_AC3 = -1;
    public static int ENCODING_DTS = -1;
    public static int ENCODING_DTS_HD = -1;
    public static int ENCODING_DOLBY_TRUEHD = -1;
    public static int ENCODING_IEC61937 = -1;
    
    // Codec type constants matching libavcodec
    public static final int CODEC_AC3 = 1;
    public static final int CODEC_EAC3 = 2;
    public static final int CODEC_DTS = 3;
    public static final int CODEC_DTS_HD = 4;
    public static final int CODEC_TRUEHD = 5;
    
    static {
        initEncodingConstants();
    }
    
    /**
     * Initialize Android AudioFormat encoding constants
     * These may not exist on older API levels
     */
    private static void initEncodingConstants() {
        // API 21+ encodings
        if (Build.VERSION.SDK_INT >= 21) {
            try {
                ENCODING_AC3 = AudioFormat.ENCODING_AC3;
            } catch (Exception e) { 
                Log.w(TAG, "ENCODING_AC3 not available");
            }
            
            try {
                ENCODING_E_AC3 = AudioFormat.ENCODING_E_AC3;
            } catch (Exception e) { 
                Log.w(TAG, "ENCODING_E_AC3 not available");
            }
            
            try {
                ENCODING_DTS = AudioFormat.ENCODING_DTS;
            } catch (Exception e) { 
                Log.w(TAG, "ENCODING_DTS not available");
            }
            
            try {
                ENCODING_DTS_HD = AudioFormat.ENCODING_DTS_HD;
            } catch (Exception e) { 
                Log.w(TAG, "ENCODING_DTS_HD not available");
            }
        }
        
        // API 23+ encodings
        if (Build.VERSION.SDK_INT >= 23) {
            try {
                ENCODING_DOLBY_TRUEHD = AudioFormat.ENCODING_DOLBY_TRUEHD;
            } catch (Exception e) { 
                Log.w(TAG, "ENCODING_DOLBY_TRUEHD not available");
            }
        }
        
        // API 24+ encodings
        if (Build.VERSION.SDK_INT >= 24) {
            try {
                ENCODING_IEC61937 = AudioFormat.ENCODING_IEC61937;
            } catch (Exception e) { 
                Log.w(TAG, "ENCODING_IEC61937 not available");
            }
        }
        
        Log.i(TAG, String.format(
            "Encoding constants: AC3=%d E-AC3=%d DTS=%d DTS-HD=%d TrueHD=%d IEC61937=%d",
            ENCODING_AC3, ENCODING_E_AC3, ENCODING_DTS, 
            ENCODING_DTS_HD, ENCODING_DOLBY_TRUEHD, ENCODING_IEC61937));
    }
    
    /**
     * Check if a specific encoding is supported by the device
     */
    public static boolean isEncodingSupported(int encoding, int sampleRate) {
        if (encoding == -1) return false;
        
        try {
            int minBufferSize = AudioTrack.getMinBufferSize(
                sampleRate,
                AudioFormat.CHANNEL_OUT_STEREO,
                encoding
            );
            return minBufferSize > 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Check if 7.1 channel encoding is supported (for DTS-HD MA, TrueHD)
     */
    public static boolean is71EncodingSupported(int encoding, int sampleRate) {
        if (encoding == -1) return false;
        if (Build.VERSION.SDK_INT < 23) return false; // CHANNEL_OUT_7POINT1_SURROUND
        
        try {
            int minBufferSize = AudioTrack.getMinBufferSize(
                sampleRate,
                AudioFormat.CHANNEL_OUT_7POINT1_SURROUND,
                encoding
            );
            return minBufferSize > 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Native callback to report passthrough capabilities to C code
     */
    public static native void reportCapabilities(
        boolean ac3Supported,
        boolean eac3Supported,
        boolean dtsSupported,
        boolean dtsHdSupported,
        boolean trueHdSupported,
        boolean iec61937Supported,
        boolean legacyIecSupported
    );
    
    /**
     * Probe device passthrough capabilities and report to native code
     * 
     * Detection strategy:
     * - Android 7+ (API 24+): Check for native IEC61937 encoding support
     * - Android 5-6 (API 21-23): Use legacy PCM16 IEC hack if no raw encodings available
     * - Raw encodings (ENCODING_AC3, etc.): Preferred when available (API 21+)
     */
    public static void probeCapabilities() {
        // Check raw encoding support (best quality, when available)
        boolean ac3 = isEncodingSupported(ENCODING_AC3, 48000);
        boolean eac3 = isEncodingSupported(ENCODING_E_AC3, 48000);
        boolean dts = isEncodingSupported(ENCODING_DTS, 48000);
        boolean dtsHd = is71EncodingSupported(ENCODING_DTS_HD, 48000);
        boolean trueHd = is71EncodingSupported(ENCODING_DOLBY_TRUEHD, 192000);
        
        // Check native IEC61937 support (Android 7+/API 24+)
        boolean iec = isEncodingSupported(ENCODING_IEC61937, 48000);
        
        // Legacy IEC fallback for Android 5-6 (API 21-23)
        // This uses PCM16 encoding with IEC61937-wrapped data
        // Only enable on older Android versions where native IEC isn't available
        boolean legacyIec = false;
        if (Build.VERSION.SDK_INT >= 21 && Build.VERSION.SDK_INT < 24) {
            // On Android 5-6, native IEC61937 doesn't exist
            // We can use PCM16 to pass through IEC61937 data if device supports it
            int minBuf = AudioTrack.getMinBufferSize(
                48000, 
                AudioFormat.CHANNEL_OUT_STEREO,
                AudioFormat.ENCODING_PCM_16BIT
            );
            legacyIec = (minBuf > 0);
            Log.i(TAG, "Legacy IEC mode available (Android " + Build.VERSION.SDK_INT + ")");
        }
        
        Log.i(TAG, String.format(
            "Passthrough capabilities - AC3:%b E-AC3:%b DTS:%b DTS-HD:%b TrueHD:%b IEC:%b Legacy:%b (API %d)",
            ac3, eac3, dts, dtsHd, trueHd, iec, legacyIec, Build.VERSION.SDK_INT));
        
        reportCapabilities(ac3, eac3, dts, dtsHd, trueHd, iec, legacyIec);
    }
    
    /**
     * Get the appropriate encoding for a codec type
     */
    public static int getEncodingForCodec(int codecType, boolean useIec) {
        if (useIec) {
            // Use IEC61937 if available, otherwise fall back to PCM16 for legacy
            if (ENCODING_IEC61937 != -1) {
                return ENCODING_IEC61937;
            }
            return AudioFormat.ENCODING_PCM_16BIT;
        }
        
        switch (codecType) {
            case CODEC_AC3:
                return ENCODING_AC3;
            case CODEC_EAC3:
                return ENCODING_E_AC3;
            case CODEC_DTS:
                return ENCODING_DTS;
            case CODEC_DTS_HD:
                return ENCODING_DTS_HD;
            case CODEC_TRUEHD:
                return ENCODING_DOLBY_TRUEHD;
            default:
                return -1;
        }
    }
    
    /**
     * Set the application context (called from native during init)
     */
    public static void setApplicationContext(Context context) {
        if (context != null) {
            sAppContext = context.getApplicationContext();
            Log.i(TAG, "Application context set");
        }
    }
    
    /**
     * Create AudioTrack for passthrough playback
     * 
     * Uses optimal API based on Android version:
     * - Android 8+ (API 26+): AudioTrack.Builder (recommended)
     * - Android 5-7 (API 21-25): Legacy AudioTrack constructor with AudioAttributes
     * - Legacy IEC mode (API 21-23): PCM16 with volume hack
     * 
     * @param context Application context (can be null - will use cached context)
     */
    public boolean create(Context context, int encoding, int sampleRate, 
                          int channels, int bufferSize) {
        mContext = (context != null) ? context : sAppContext;
        mEncoding = encoding;
        mSampleRate = sampleRate;
        mIsLegacyIEC = false;
        
        try {
            int channelMask;
            if (Build.VERSION.SDK_INT >= 23 && channels > 6) {
                channelMask = AudioFormat.CHANNEL_OUT_7POINT1_SURROUND;
            } else if (channels > 2) {
                channelMask = AudioFormat.CHANNEL_OUT_5POINT1;
            } else {
                channelMask = AudioFormat.CHANNEL_OUT_STEREO;
            }
            
            // Legacy IEC hack for Android 5-6 (API 21-23)
            // When using PCM16 for IEC passthrough, we need to set volume to 100%
            // to avoid audio mangling by Android's audio processing
            if (encoding == AudioFormat.ENCODING_PCM_16BIT && 
                Build.VERSION.SDK_INT >= 21 && Build.VERSION.SDK_INT < 24) {
                mIsLegacyIEC = true;
                Log.i(TAG, "Using legacy IEC passthrough mode (Android " + Build.VERSION.SDK_INT + ")");
                setSystemVolume(1.0f);
            }
            
            Log.i(TAG, String.format(
                "Creating AudioTrack: encoding=%d sampleRate=%d channels=%d buffer=%d channelMask=0x%x API=%d",
                encoding, sampleRate, channels, bufferSize, channelMask, Build.VERSION.SDK_INT));
            
            // Use AudioTrack.Builder for Android 8+ (API 26+) - optimal modern API
            if (Build.VERSION.SDK_INT >= 26) {
                mAudioTrack = createAudioTrackModern(encoding, sampleRate, channelMask, bufferSize);
            } else if (Build.VERSION.SDK_INT >= 21) {
                // Android 5-7: Use AudioTrack constructor with AudioAttributes
                mAudioTrack = createAudioTrackLegacy(encoding, sampleRate, channelMask, bufferSize);
            } else {
                // Android < 5: Not supported for passthrough
                Log.e(TAG, "Android version too old for passthrough (API " + Build.VERSION.SDK_INT + ")");
                return false;
            }
            
            if (mAudioTrack == null || mAudioTrack.getState() != AudioTrack.STATE_INITIALIZED) {
                Log.e(TAG, "AudioTrack failed to initialize");
                if (mAudioTrack != null) {
                    mAudioTrack.release();
                    mAudioTrack = null;
                }
                restoreSystemVolumeIfNeeded();
                return false;
            }
            
            // Pause initially to allow buffer filling before playback
            mAudioTrack.pause();
            mAudioTrack.flush();
            
            Log.i(TAG, "AudioTrack created successfully");
            return true;
            
        } catch (Exception e) {
            Log.e(TAG, "Failed to create AudioTrack: " + e.getMessage());
            e.printStackTrace();
            restoreSystemVolumeIfNeeded();
            return false;
        }
    }
    
    /**
     * Create AudioTrack using modern Builder API (Android 8+/API 26+)
     * This is the recommended approach for modern Android
     */
    private AudioTrack createAudioTrackModern(int encoding, int sampleRate, 
                                               int channelMask, int bufferSize) {
        try {
            AudioAttributes attributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build();
            
            AudioFormat format = new AudioFormat.Builder()
                .setChannelMask(channelMask)
                .setEncoding(encoding)
                .setSampleRate(sampleRate)
                .build();
            
            return new AudioTrack.Builder()
                .setAudioAttributes(attributes)
                .setAudioFormat(format)
                .setBufferSizeInBytes(bufferSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .setSessionId(AudioManager.AUDIO_SESSION_ID_GENERATE)
                .build();
                
        } catch (Exception e) {
            Log.e(TAG, "Failed to create AudioTrack with Builder: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Create AudioTrack using legacy API (Android 5-7/API 21-25)
     * Uses AudioAttributes but not AudioTrack.Builder
     */
    private AudioTrack createAudioTrackLegacy(int encoding, int sampleRate,
                                               int channelMask, int bufferSize) {
        try {
            AudioAttributes.Builder attrBuilder = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC);
            
            AudioFormat.Builder fmtBuilder = new AudioFormat.Builder()
                .setChannelMask(channelMask)
                .setEncoding(encoding)
                .setSampleRate(sampleRate);
            
            return new AudioTrack(
                attrBuilder.build(),
                fmtBuilder.build(),
                bufferSize,
                AudioTrack.MODE_STREAM,
                AudioManager.AUDIO_SESSION_ID_GENERATE
            );
        } catch (Exception e) {
            Log.e(TAG, "Failed to create AudioTrack with legacy API: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Write byte data to AudioTrack
     * Uses WRITE_BLOCKING mode for API 23+ for better synchronization
     */
    public int write(byte[] data, int offset, int size) {
        if (mAudioTrack == null) return -1;
        
        try {
            int written;
            if (Build.VERSION.SDK_INT >= 23) {
                // Use blocking write with write mode parameter (API 23+)
                written = mAudioTrack.write(data, offset, size, AudioTrack.WRITE_BLOCKING);
            } else {
                // Legacy write without mode parameter
                written = mAudioTrack.write(data, offset, size);
            }
            if (written < 0) {
                Log.e(TAG, "AudioTrack write error: " + written);
            }
            return written;
        } catch (Exception e) {
            Log.e(TAG, "AudioTrack write exception: " + e.getMessage());
            return -1;
        }
    }
    
    /**
     * Write short data to AudioTrack (for IEC61937 mode)
     * Uses WRITE_BLOCKING mode for API 23+ for better synchronization
     */
    public int writeShorts(short[] data, int offset, int size) {
        if (mAudioTrack == null) return -1;
        
        try {
            int written;
            if (Build.VERSION.SDK_INT >= 23) {
                // Use blocking write with write mode parameter (API 23+)
                written = mAudioTrack.write(data, offset, size, AudioTrack.WRITE_BLOCKING);
            } else {
                // Legacy write without mode parameter
                written = mAudioTrack.write(data, offset, size);
            }
            if (written < 0) {
                Log.e(TAG, "AudioTrack write error: " + written);
            }
            return written;
        } catch (Exception e) {
            Log.e(TAG, "AudioTrack write exception: " + e.getMessage());
            return -1;
        }
    }
    
    /**
     * Start playback
     */
    public void play() {
        if (mAudioTrack != null) {
            try {
                mAudioTrack.play();
            } catch (Exception e) {
                Log.e(TAG, "AudioTrack play exception: " + e.getMessage());
            }
        }
    }
    
    /**
     * Pause playback
     */
    public void pause() {
        if (mAudioTrack != null) {
            try {
                mAudioTrack.pause();
            } catch (Exception e) {
                Log.e(TAG, "AudioTrack pause exception: " + e.getMessage());
            }
        }
    }
    
    /**
     * Stop playback
     */
    public void stop() {
        if (mAudioTrack != null) {
            try {
                mAudioTrack.stop();
            } catch (Exception e) {
                Log.e(TAG, "AudioTrack stop exception: " + e.getMessage());
            }
        }
    }
    
    /**
     * Flush AudioTrack buffer
     */
    public void flush() {
        if (mAudioTrack != null) {
            try {
                mAudioTrack.flush();
            } catch (Exception e) {
                Log.e(TAG, "AudioTrack flush exception: " + e.getMessage());
            }
        }
    }
    
    /**
     * Release AudioTrack and cleanup
     */
    public void release() {
        Log.i(TAG, "Releasing AudioTrack");
        
        if (mAudioTrack != null) {
            try {
                mAudioTrack.stop();
            } catch (Exception e) { }
            
            try {
                mAudioTrack.release();
            } catch (Exception e) {
                Log.e(TAG, "AudioTrack release exception: " + e.getMessage());
            }
            mAudioTrack = null;
        }
        
        restoreSystemVolumeIfNeeded();
    }
    
    /**
     * Get current playback head position (in frames)
     */
    public int getPlaybackHeadPosition() {
        if (mAudioTrack == null) return 0;
        try {
            return mAudioTrack.getPlaybackHeadPosition();
        } catch (Exception e) {
            return 0;
        }
    }
    
    /**
     * Get playback state
     */
    public int getPlayState() {
        if (mAudioTrack == null) return AudioTrack.PLAYSTATE_STOPPED;
        try {
            return mAudioTrack.getPlayState();
        } catch (Exception e) {
            return AudioTrack.PLAYSTATE_STOPPED;
        }
    }
    
    /**
     * Check if AudioTrack is initialized
     */
    public boolean isInitialized() {
        return mAudioTrack != null && 
               mAudioTrack.getState() == AudioTrack.STATE_INITIALIZED;
    }
    
    /**
     * Set system volume to max for legacy IEC passthrough
     * Saves current volume for later restoration
     */
    private void setSystemVolume(float volume) {
        try {
            AudioManager am = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
            int maxVol = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
            int curVol = am.getStreamVolume(AudioManager.STREAM_MUSIC);
            mSavedVolume = (float) curVol / maxVol;
            
            int newVol = (int)(maxVol * volume);
            am.setStreamVolume(AudioManager.STREAM_MUSIC, newVol, 0);
            
            Log.i(TAG, String.format(
                "Set system volume to %.2f (was %.2f)", volume, mSavedVolume));
        } catch (Exception e) {
            Log.e(TAG, "Failed to set system volume: " + e.getMessage());
        }
    }
    
    /**
     * Restore system volume after legacy IEC passthrough
     */
    private void restoreSystemVolumeIfNeeded() {
        if (mIsLegacyIEC && mSavedVolume >= 0) {
            try {
                AudioManager am = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
                int maxVol = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
                int newVol = (int)(maxVol * mSavedVolume);
                am.setStreamVolume(AudioManager.STREAM_MUSIC, newVol, 0);
                
                Log.i(TAG, String.format("Restored system volume to %.2f", mSavedVolume));
            } catch (Exception e) {
                Log.e(TAG, "Failed to restore system volume: " + e.getMessage());
            }
            mSavedVolume = -1;
        }
        mIsLegacyIEC = false;
    }
    
    /**
     * Get minimum buffer size for passthrough
     */
    public static int getMinBufferSize(int encoding, int sampleRate, int channels) {
        try {
            int channelMask = (channels > 2) ? 
                AudioFormat.CHANNEL_OUT_5POINT1 : 
                AudioFormat.CHANNEL_OUT_STEREO;
            
            if (Build.VERSION.SDK_INT >= 23 && channels > 6) {
                channelMask = AudioFormat.CHANNEL_OUT_7POINT1_SURROUND;
            }
            
            return AudioTrack.getMinBufferSize(sampleRate, channelMask, encoding);
        } catch (Exception e) {
            return -1;
        }
    }
}
