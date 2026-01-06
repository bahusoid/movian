package com.lonelycoder.mediaplayer;

import java.util.concurrent.FutureTask;
import java.util.concurrent.RunnableFuture;
import java.util.concurrent.Callable;

import android.os.Handler;

import android.net.Uri;

import android.os.Bundle;
import android.os.Message;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.Context;
import android.content.ComponentName;
import android.content.pm.PackageManager;
import android.content.ServiceConnection;
import android.content.Context;
import android.content.ComponentName;
import android.app.Activity;
import android.view.Menu;
import android.view.KeyEvent;
import android.view.SurfaceView;
import android.view.Window;
import android.view.WindowManager;
import android.util.Log;

import android.os.Environment;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.provider.MediaStore.MediaColumns;
import android.database.Cursor;

import android.widget.FrameLayout;

import android.util.Log;
import android.app.AlertDialog;
import android.widget.EditText;
import android.text.InputType;
import android.view.inputmethod.InputMethodManager;
import android.content.ClipboardManager;
import android.content.ClipData;
import android.content.Context;

public class GLWActivity extends Activity implements VideoRendererProvider {

    GLWView mGLWView;
    FrameLayout mRoot;
    SurfaceView sv;
    private AlertDialog mKeyboardDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d("Movian", "onCreate");
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);

        Core.init(this);

        mRoot = new FrameLayout(this);
        mGLWView = new GLWView(getApplication(), this);
        mRoot.addView(mGLWView);
        setContentView(mRoot);

        startService(new Intent(this, CoreService.class));
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    public boolean onKeyUp(int keyCode, KeyEvent event) {

        if(mGLWView != null && mGLWView.keyUp(keyCode, event))
            return true;
        return super.onKeyUp(keyCode, event);
    }


    public boolean onKeyDown(int keyCode, KeyEvent event) {

        if(mGLWView != null && mGLWView.keyDown(keyCode, event))
            return true;
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }

    @Override
    protected void onResume() {
        Log.d("Movian", "onResume");
        super.onResume();
        if (mGLWView != null) {
            mGLWView.onResume();
        }

        Handler h = new Handler(new Handler.Callback() {
                public boolean handleMessage(Message msg) {
                    Intent intent = getIntent();
                    String action = intent.getAction();
                    String type = intent.getType();
                    String uriString = null;
                    
                    if (Intent.ACTION_SEND.equals(action) && "text/plain".equals(type)) {
                        uriString = intent.getStringExtra(Intent.EXTRA_TEXT);
                    } else {
                        Uri uri = intent.getData();
                        if(uri == null)
                            uri = intent.getParcelableExtra("uri");

                        if(uri != null) {
                            String u = getRealPathFromUri(uri);
                            uriString = u != null ? u : uri.toString();
                        }
                    }

                    if (uriString != null) {
                        Core.openUri(uriString);
                    }
                    return true;
                }
            });

        h.sendEmptyMessage(0);
    }

    @Override
    protected void onPause() {
        Log.d("Movian", "onPause");
        super.onPause();
        if (mGLWView != null) {
            int mode = Core.getBackgroundPlaybackMode();
            // 0=Stop, 1=Pause, 2=Play

            if (mode == 0) {
                mGLWView.keyDown(KeyEvent.KEYCODE_MEDIA_STOP, new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_STOP));
                mGLWView.keyUp(KeyEvent.KEYCODE_MEDIA_STOP, new KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_STOP));
            } else if (mode == 1) {
                mGLWView.keyDown(KeyEvent.KEYCODE_MEDIA_PAUSE, new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PAUSE));
                mGLWView.keyUp(KeyEvent.KEYCODE_MEDIA_PAUSE, new KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_PAUSE));
            }
            
            // Give the native thread some time to process the event before suspending the surface
            if (mode != 2) {
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                }
            }
            
            mGLWView.onPause();
        }
    }

    @Override
    protected void onDestroy() {
        Log.d("Movian", "onDestroy");
        super.onDestroy();
        if (mGLWView != null) {
            mGLWView.destroy();
        }
    }

    // These does not execute on the main ui thread so we need to dispatch

    @Override
    public VideoRenderer createVideoRenderer() throws Exception {

        RunnableFuture<VideoRenderer> f = new FutureTask<VideoRenderer>(new Callable<VideoRenderer>() {
                public VideoRenderer call() {
                    VideoRenderer vr = new VideoRenderer(GLWActivity.this);
                    mRoot.addView(vr);
                    return vr;
                }
            });

        runOnUiThread(f);
        return f.get();
    }

    @Override
    public void destroyVideoRenderer(final VideoRenderer vr) {

        runOnUiThread(new Runnable() {
                public void run() {
                    mRoot.removeView(vr);
                }
            });
    }


    @Override
    public void disableScreenSaver() {
        runOnUiThread(new Runnable() {
                public void run() {
                    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
    }

    @Override
    public void enableScreenSaver() {
        runOnUiThread(new Runnable() {
                public void run() {
                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
    }

    @Override
    public void sysHome() {
        runOnUiThread(new Runnable() {
                public void run() {
                    Intent startMain = new Intent(Intent.ACTION_MAIN);
                    startMain.addCategory(Intent.CATEGORY_HOME);
                    startMain.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(startMain);
                }
            });
    }

    @Override
    public void askPermission(final String permission) {
        runOnUiThread(new Runnable() {
                public void run() {
                    if (Build.VERSION.SDK_INT >= 30 && "android.permission.MANAGE_EXTERNAL_STORAGE".equals(permission)) {
                        try {
                            Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                            intent.addCategory("android.intent.category.DEFAULT");
                            intent.setData(Uri.parse(String.format("package:%s", getApplicationContext().getPackageName())));
                            startActivityForResult(intent, 2);
                        } catch (Exception e) {
                            Intent intent = new Intent();
                            intent.setAction(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
                            startActivityForResult(intent, 2);
                        }
                    } else {
                        requestPermissions(new String[] {permission}, 1);
                    }
                }
            });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 2) {
            if (Build.VERSION.SDK_INT >= 30) {
                Core.permissionResult(Environment.isExternalStorageManager());
            } else {
                Core.permissionResult(false);
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[],
                                           int[] grantResults) {
        Core.permissionResult(grantResults[0] ==
                              PackageManager.PERMISSION_GRANTED);
    }

    public String getRealPathFromUri(final Uri uri) {
        // DocumentProvider
        if (DocumentsContract.isDocumentUri(this, uri)) {
            // ExternalStorageProvider
            if (isExternalStorageDocument(uri)) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];

                if ("primary".equalsIgnoreCase(type)) {
                    return "es:///" + split[1];
                }
            }
            // DownloadsProvider
            else if (isDownloadsDocument(uri)) {

                final String id = DocumentsContract.getDocumentId(uri);
                final Uri contentUri = ContentUris.withAppendedId(
                        Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));

                return getDataColumn(this, contentUri, null, null);
            }
            // MediaProvider
            else if (isMediaDocument(uri)) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];

                Uri contentUri = null;
                if ("image".equals(type)) {
                    contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if ("video".equals(type)) {
                    contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if ("audio".equals(type)) {
                    contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }

                final String selection = "_id=?";
                final String[] selectionArgs = new String[]{
                        split[1]
                };

                return getDataColumn(this, contentUri, selection, selectionArgs);
            }
        }
        // MediaStore (and general)
        else if ("content".equalsIgnoreCase(uri.getScheme())) {

            // Return the remote address
            if (isGooglePhotosUri(uri))
                return uri.getLastPathSegment();

            return getDataColumn(this, uri, null, null);
        }
        // File
        else if ("file".equalsIgnoreCase(uri.getScheme())) {
            return uri.getPath();
        }

        return null;
    }

    private String getDataColumn(Context context, Uri uri, String selection,
                                 String[] selectionArgs) {

        Cursor cursor = null;
        final String column = "_data";
        final String[] projection = {
                column
        };

        try {
            cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs,
                    null);
            if (cursor != null && cursor.moveToFirst()) {
                final int index = cursor.getColumnIndexOrThrow(column);
                return cursor.getString(index);
            }
        } finally {
            if (cursor != null)
                cursor.close();
        }
        return null;
    }

    private boolean isExternalStorageDocument(Uri uri) {
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    private boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    private boolean isMediaDocument(Uri uri) {
        return "com.android.providers.media.documents".equals(uri.getAuthority());
    }

    private boolean isGooglePhotosUri(Uri uri) {
        return "com.google.android.apps.photos.content".equals(uri.getAuthority());
    }

    public void showAndroidKeyboard(final String title, final String initialText, 
                                   final boolean isPassword) {
        runOnUiThread(new Runnable() {
            public void run() {
                if (mKeyboardDialog != null && mKeyboardDialog.isShowing()) {
                    mKeyboardDialog.dismiss();
                }

                AlertDialog.Builder builder = new AlertDialog.Builder(GLWActivity.this);
                if (title != null && !title.isEmpty()) {
                    builder.setTitle(title);
                }

                final EditText input = new EditText(GLWActivity.this);
                input.setText(initialText != null ? initialText : "");
                input.setInputType(isPassword ? 
                    InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD :
                    InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_AUTO_CORRECT);
                input.setSelectAllOnFocus(true);
                input.setSingleLine(true);
                
                // Enable text selection and context menu for copy/paste
                input.setTextIsSelectable(true);
                input.setLongClickable(true);
                
                //TODO: DOUBLE CHECK IT'S NEEDED
                // Ensure keyboard shortcuts work (Ctrl+C/V/X/A for physical keyboards)
                // EditText handles these automatically, but we explicitly enable them
                input.setFocusable(true);
                input.setFocusableInTouchMode(true);

                builder.setView(input);
                builder.setPositiveButton("OK", new android.content.DialogInterface.OnClickListener() {
                    public void onClick(android.content.DialogInterface dialog, int which) {
                        if (mGLWView != null) {
                            Core.glwTextChanged(mGLWView.getGlwId(), input.getText().toString());
                        }
                    }
                });
                builder.setNegativeButton("Cancel", new android.content.DialogInterface.OnClickListener() {
                    public void onClick(android.content.DialogInterface dialog, int which) {
                        if (mGLWView != null) {
                            Core.glwKeyboardCancelled(mGLWView.getGlwId());
                        }
                        dialog.cancel();
                    }
                });
                builder.setOnCancelListener(new android.content.DialogInterface.OnCancelListener() {
                    public void onCancel(android.content.DialogInterface dialog) {
                        if (mGLWView != null) {
                            Core.glwKeyboardCancelled(mGLWView.getGlwId());
                        }
                    }
                });

                mKeyboardDialog = builder.create();
                mKeyboardDialog.getWindow().setSoftInputMode(
                    WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE);
                mKeyboardDialog.show();

                input.requestFocus();
                InputMethodManager imm = (InputMethodManager) 
                    getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT);
            }
        });
    }

    public void setClipboard(String text) {
        ClipboardManager clipboard = (ClipboardManager) 
            getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("movian", text);
        clipboard.setPrimaryClip(clip);
    }

    public String getClipboard() {
        ClipboardManager clipboard = (ClipboardManager) 
            getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard.hasPrimaryClip()) {
            ClipData.Item item = clipboard.getPrimaryClip().getItemAt(0);
            if (item != null && item.getText() != null) {
                return item.getText().toString();
            }
        }
        return null;
    }
}

