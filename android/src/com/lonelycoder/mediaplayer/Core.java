package com.lonelycoder.mediaplayer;

import java.io.File;

import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.os.Environment;
import android.content.Context;
import android.util.Log;
import android.graphics.Bitmap;
import android.app.Activity;
import android.view.SurfaceView;
import android.view.SurfaceHolder;
import android.graphics.PixelFormat;
import android.graphics.Canvas;
import android.text.format.DateFormat;
import android.widget.FrameLayout;
import android.content.pm.PackageManager;

import android.media.MediaCodec;
import android.media.MediaFormat;
import android.media.AudioManager;

import android.provider.Settings.Secure;
import android.provider.Settings;
import android.content.Intent;
import android.net.Uri;


public class Core {


    private static Activity currentActivity;
    private static SurfaceView sv;
    private static Context mContext;

    static {
        System.loadLibrary("avutil");
        System.loadLibrary("swresample");
        System.loadLibrary("avcodec");
        System.loadLibrary("avformat");
        System.loadLibrary("swscale");
        System.loadLibrary("core");
    }

    public static native void coreInit(String settingsdir, String cachedir,
                                       String sdcard, String aid,
                                       int clock_24hrs,
                                       String music,
                                       String pictures,
                                       String movies,
                                       int audio_sample_rate,
                                       int audio_frames_per_buffer);

    public static native void openUri(String uri, boolean quitOnStop);

    // These two GLW methods should be called on UI thread

    public static native int glwCreate(VideoRendererProvider vrp);
    public static native void glwDestroy(int id);

    // These four GLW methods should be called on OpenGL renderer thread

    public static native void glwInit(int id);
    public static native void glwFini(int id);
    public static native void glwResize(int id, int width, int height);
    public static native void glwStep(int id);
    public static native void glwFlush(int id);

    // The thread for those are not so important I think...

    public static native void glwMotion(int id, int source, int event, int x, int y, long timestamp);
    public static native boolean glwKeyDown(int id, int code, int unicode,
                                            boolean shift);
    public static native boolean glwKeyUp(int id, int code);

    public static native void permissionResult(boolean ok);

    // Clipboard operations
    public static native void clipboardSet(String text);
    public static native String clipboardGet();

    // Android keyboard
    public static native void glwTextChanged(int id, String text);
    public static native void glwKeyboardCancelled(int id);

    // Create / Destroy subscriptions

    public static native int subValue(int prop, String path, ValueSubscription.Callback cb);
    public static native int subNodes(int prop, String path, NodeSubscriptionCallback cb);
    public static native int unSub(int id);

    // Properties

    public static native int propRetain(int id);

    public static native void propRelease(int id);

    // Dispatch a round of property updates, should only be called on UI thread
    public static native void pollCourier();

    public static native void networkStatusChanged();

    public static native int getBackgroundPlaybackMode();

    public static void init(Context context) {

        mContext = context.getApplicationContext();
        
        // Initialize audio passthrough with application context
        AudioPassthrough.setApplicationContext(mContext);

        int clock_24hrs = DateFormat.is24HourFormat(context) ? 1 : 0;

        // Determine cache directory path
        // Use noBackupFilesDir for persistent cache that shouldn't be backed up
        // This is safer for SQLite databases than getCacheDir() which can be cleared by OS
        File cacheDir = new File(context.getNoBackupFilesDir(), "cache");
        if (!cacheDir.exists()) {
            cacheDir.mkdirs();
        }
        String cachePath = cacheDir.getPath();

        String androidId = Secure.getString(context.getContentResolver(), Secure.ANDROID_ID);
        if (androidId == null)
            androidId = "unknown";

        int sampleRate = 0;
        int framesPerBuffer = 0;

        if(Build.VERSION.SDK_INT >= 21) {
            AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
            if (audioManager != null) {
                String sr = audioManager.getProperty(AudioManager.PROPERTY_OUTPUT_SAMPLE_RATE);
                if (sr != null) sampleRate = Integer.parseInt(sr);
                String fpb = audioManager.getProperty(AudioManager.PROPERTY_OUTPUT_FRAMES_PER_BUFFER);
                if (fpb != null) framesPerBuffer = Integer.parseInt(fpb);
            }
        }

        coreInit(context.getFilesDir().getPath(),
                 cachePath,
                 Environment.getExternalStorageDirectory().toString(),
                 androidId,
                 clock_24hrs,
                 Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC).toString(),
                 Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).toString(),
                 Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES).toString(),
                 sampleRate,
                 framesPerBuffer);
    }

    public static Bitmap createBitmap(int width, int height) {
        return Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    }

    public static boolean checkPermission(String permission) {
        if (Build.VERSION.SDK_INT >= 30 && "android.permission.MANAGE_EXTERNAL_STORAGE".equals(permission)) {
            return Environment.isExternalStorageManager();
        }
        return mContext.checkSelfPermission(permission) ==
            PackageManager.PERMISSION_GRANTED;
    }

    public static void pushBitmap(final Bitmap b) {

        currentActivity.runOnUiThread(new Runnable() {
                public void run() {

                    SurfaceHolder sh = sv.getHolder();

                    sh.setFormat(PixelFormat.RGBA_8888);

                    Canvas c = sh.lockCanvas();
                    c.drawBitmap(b, null, sh.getSurfaceFrame(), null);
                    sh.unlockCanvasAndPost(c);
                }
            });
    }

    public static native void vdInputAvailable(int opaque, int buf);
    public static native void vdOutputAvailable(int opaque, int buf,
                                                long pts);
    public static native void vdOutputFormatChanged(int opaque,
                                                    MediaFormat format);
    public static native void vdError(int opaque);


    public static void setVideoDecoderWrapper(MediaCodec codec,
                                              final int opaque) {

        codec.setCallback(new MediaCodec.Callback() {

                @Override
                public void onInputBufferAvailable(MediaCodec mc, int buf) {
                    vdInputAvailable(opaque, buf);
                }

                @Override
                public void onOutputBufferAvailable(MediaCodec mc, int buf,
                                                    MediaCodec.BufferInfo info) {
                    vdOutputAvailable(opaque, buf, info.presentationTimeUs);
                }

                @Override
                public void onOutputFormatChanged(MediaCodec mc,
                                                  MediaFormat format) {
                    vdOutputFormatChanged(opaque, format);
                }

                @Override
                public void onError(MediaCodec mc, MediaCodec.CodecException e) {
                    vdError(opaque);
                }
            });
    }
}
