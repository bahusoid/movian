# FFmpeg Migration from libav

## Summary

This document describes the migration from libav to FFmpeg in the Movian media player project.

## Date
December 23, 2025

## Changes Overview

### 1. Submodule Replacement

**Old:** `https://github.com/czz/libav.git` (libav fork)
**New:** `https://github.com/FFmpeg/FFmpeg.git` (official FFmpeg)
**Commit:** `e5eef271a5f6e20de9eff7660680bf42e5ef4f89`

The submodule path remains `ext/libav` to minimize changes to the build system.

### 2. Audio Resampling API Migration (avresample → swresample)

The main API difference between libav and FFmpeg is the audio resampling library:
- **libav:** `libavresample` with `AVAudioResampleContext`
- **FFmpeg:** `libswresample` with `SwrContext`

#### API Mapping

| libav (avresample)           | FFmpeg (swresample)                    |
|------------------------------|----------------------------------------|
| `#include <libavresample/avresample.h>` | `#include <libswresample/swresample.h>` |
| `AVAudioResampleContext`     | `SwrContext`                           |
| `avresample_alloc_context()` | `swr_alloc()`                          |
| `avresample_open()`          | `swr_init()`                           |
| `avresample_close()`         | `swr_close()`                          |
| `avresample_free()`          | `swr_free()`                           |
| `avresample_convert()`       | `swr_convert()`                        |
| `avresample_available()`     | `swr_get_out_samples(swr, 0)`          |
| `avresample_get_delay()`     | `swr_get_delay()`                      |
| `avresample_read(avr, out, n)` | `swr_convert(swr, out, n, NULL, 0)`  |

### 3. FFmpeg 5+ API Changes

Beyond the swresample migration, FFmpeg 5+ introduced many breaking API changes:

#### Deprecated/Removed Functions

| Old API (removed)               | New API                                     |
|---------------------------------|---------------------------------------------|
| `avcodec_decode_video2()`       | `avcodec_send_packet()` + `avcodec_receive_frame()` |
| `avcodec_decode_audio4()`       | `avcodec_send_packet()` + `avcodec_receive_frame()` |
| `avcodec_encode_video2()`       | `avcodec_send_frame()` + `avcodec_receive_packet()` |
| `avcodec_encode_audio2()`       | `avcodec_send_frame()` + `avcodec_receive_packet()` |
| `avcodec_close()`               | `avcodec_free_context()`                    |
| `avcodec_copy_context()`        | Use `mcp` parameters directly               |
| `av_free_packet()`              | `av_packet_unref()`                         |
| `av_init_packet()`              | `av_packet_alloc()`                         |
| `avpicture_alloc()`             | `av_frame_get_buffer()`                     |
| `avpicture_free()`              | `av_frame_free()`                           |
| `AVPicture` type                | Use `AVFrame` or custom struct              |
| `av_register_all()`             | Not needed (auto-registration)              |
| `av_lockmgr_register()`         | Not needed (internal threading)             |
| `av_get_channel_layout_string()`| `av_channel_layout_describe()`              |
| `av_get_default_channel_layout()`| `av_channel_layout_default()`              |

#### Removed Struct Members

| Old Member                       | New Approach                               |
|----------------------------------|---------------------------------------------|
| `AVCodecContext->channels`       | `AVCodecContext->ch_layout.nb_channels`     |
| `AVCodecContext->channel_layout` | `AVCodecContext->ch_layout`                 |
| `AVCodecContext->request_channel_layout` | `AVChannelLayout` API                |
| `AVCodecContext->refcounted_frames` | Always enabled in FFmpeg 5+            |
| `AVCodecContext->reordered_opaque` | Use `AV_CODEC_FLAG_COPY_OPAQUE` + `frame->opaque` |
| `AVFrame->channel_layout`        | `AVFrame->ch_layout`                        |
| `AVFrame->interlaced_frame`      | `AVFrame->flags & AV_FRAME_FLAG_INTERLACED` |
| `AVFrame->top_field_first`       | `AVFrame->flags & AV_FRAME_FLAG_TOP_FIELD_FIRST` |
| `AVFrame->reordered_opaque`      | `AVFrame->opaque` with `AV_CODEC_FLAG_COPY_OPAQUE` |
| `AVSubtitleRect->pict`           | `AVSubtitleRect->data` / `AVSubtitleRect->linesize` |
| `AVStream->codec`                | `AVStream->codecpar` + `avcodec_parameters_to_context()` |

#### Type Changes

| Old Type                         | New Type                                    |
|----------------------------------|---------------------------------------------|
| `AVCodec *`                      | `const AVCodec *` (from find_decoder/encoder) |
| `AVOutputFormat *`               | `const AVOutputFormat *` (from av_guess_format) |
| `AVInputFormat *`                | `const AVInputFormat *` (from av_find_input_format) |
| `AVBitStreamFilterContext`       | `AVBSFContext`                              |

### 4. Modified Files

#### Header Files
- `src/audio2/audio.h` - Changed include and type definition
- `src/video/video_decoder.h` - Changed `AVPicture` to `AVFrame*`

#### Core Audio Code
- `src/audio2/audio.c` - Replaced all avresample API calls, updated channel layout API
- `src/audio2/audio_test.c` - Updated encode/decode API, channel layout
- `src/audio2/alsa.c` - Updated audio delivery function
- `src/audio2/mac_audio.c` - Updated audio delivery function

#### Video Decoder
- `src/libav.c` - Major updates: send/receive API, frame flags, channel layout
- `src/video/video_decoder.c` - Updated for AVFrame-based conversion buffer

#### Platform-Specific Audio Drivers
- `src/arch/linux/pulseaudio.c` - Updated for swresample
- `src/arch/android/android_audio.c` - Updated for swresample
- `src/arch/android/android_video_codec.c` - Updated bitstream filter API
- `src/arch/ps3/ps3_audio.c` - Updated for swresample
- `src/arch/rpi/rpi_audio.c` - Updated for swresample
- `src/arch/nacl/nacl_audio.c` - Updated for swresample

#### Media Subsystem
- `src/media/media_codec.c` - Replaced avcodec_close with avcodec_free_context
- `src/main.c` - Removed av_register_all, av_lockmgr_register

#### File Access
- `src/fileaccess/fa_libav.c` - Updated for const AVInputFormat*
- `src/fileaccess/fa_audio.c` - Updated stream->codec to stream->codecpar
- `src/fileaccess/fa_video.c` - Already using codecpar
- `src/fileaccess/fa_imageloader.c` - Updated avpicture_alloc to av_frame_get_buffer

#### Image Decoder
- `src/image/image_decoder_libav.c` - Replaced AVPicture with custom struct, send/receive API

#### Backend
- `src/backend/icecast/icecast.c` - Updated stream->codec to stream->codecpar
- `src/backend/hls/hls_ts.c` - Updated decode API

#### Subtitles
- `src/subtitles/video_overlay.c` - Updated AVSubtitleRect pict to data/linesize

#### UI/Recording
- `src/ui/glw/glw_rec.c` - Updated for swresample, send/receive encode API

#### API Screenshot
- `src/api/screenshot.c` - Updated encode API

#### Build Configuration
- `support/configure.inc` - Added `--enable-swresample` flag, changed linking from `-lavresample` to `-lswresample`
- `src/arch/android/android.mk` - Changed library references from libavresample to libswresample
- `ios/build_libav.sh` - Updated library list
- `ios/Movian.xcodeproj/project.pbxproj` - Updated library references

## Build Instructions

### IMPORTANT: Clean Build Required

After the migration, you **must** perform a clean build because old libav build artifacts will conflict with the new FFmpeg:

```bash
# For Linux build
rm -rf build.linux
./configure.linux
make

# For Android build
rm -rf build.android.api21_x86
./configure.android --kind=api21_x86
make
```

### FFmpeg Configuration

FFmpeg is configured with the following common flags:
- `--enable-swresample` - Enable the swresample library (required)
- `--disable-encoders` - Disable most encoders (not needed)
- `--disable-filters` - Disable filters
- `--disable-muxers` - Disable most muxers
- `--disable-devices` - Disable device support
- `--disable-programs` - Disable ffmpeg/ffprobe binaries
- `--disable-avfilter` - Disable avfilter library

Enabled components:
- PNG decoder/encoder
- MJPEG decoder/encoder
- AC3/EAC3 encoders
- Matroska muxer
- SPDIF muxer

### Platform-Specific Flags

#### Linux
```
--disable-shared --enable-static --disable-inline-asm
```

#### Android ARMv7 (api21_armv7)
```
--enable-cross-compile --arch=armv7 --target-os=android --enable-shared --disable-static
```
Full NEON optimizations are available.

#### Android x86 (api21_x86)
```
--enable-cross-compile --arch=x86 --target-os=android --enable-shared --disable-static --disable-asm --disable-inline-asm
```
**Note:** Assembly optimizations are disabled for x86 Android to avoid compatibility issues with Android 5.0 (API 21).

#### Android ARMv8/ARM64 (api34_armv8)
```
--enable-cross-compile --arch=aarch64 --target-os=android --enable-shared --disable-static
```
Full optimizations available.

## Assembly Optimizations

### x86 Android (API 21)

Assembly optimizations are disabled (`--disable-asm --disable-inline-asm`) for x86 Android targeting API 21 (Android 5.0) because:

1. **Text relocations:** x86 assembly in FFmpeg uses text relocations which are deprecated in Android 5.0 and prohibited in Android 6.0+
2. **Position Independent Code (PIC):** The x86 assembly needs proper PIC support which can cause issues on older Android versions
3. **NDK Compatibility:** Older Android x86 devices may have varying instruction set support

### ARM/ARM64 Optimizations

ARM builds (both ARMv7 and ARMv8) can use full optimizations including:
- **NEON** - SIMD instructions for ARMv7 and ARM64
- **VFP** - Vector Floating Point
- **Assembly routines** - Hand-optimized assembly for critical codecs

### Enabling More Optimizations (Advanced)

If you want to enable x86 assembly for newer Android versions (API 23+), you can modify `configure.android`:

```bash
# For API 23+ x86 builds (not recommended for API 21 compatibility)
LIBAV_ARCH_FLAGS="--enable-cross-compile --arch=x86 --target-os=android --enable-shared --disable-static --enable-pic"
```

However, this will break Android 5.0 compatibility.

## Troubleshooting

### "libswresample/swresample.h not found"

This error occurs when building against old libav artifacts. Solution:
```bash
rm -rf build.android.api21_x86
./configure.android --kind=api21_x86
make
```

### FFmpeg configure fails

Make sure you have the latest FFmpeg submodule:
```bash
cd ext/libav
git fetch origin
git checkout master  # or specific commit
```

### Link errors with avresample

If you see link errors mentioning `-lavresample`, ensure all build files are updated:
- Check `support/configure.inc` uses `-lswresample`
- Check platform-specific makefiles reference `libswresample.so` not `libavresample.so`

## Testing

After migration, test the following:
1. Audio playback with various sample rates
2. Channel layout conversion (stereo, 5.1, 7.1)
3. Sample format conversion (int16, float, planar formats)
4. Seeking and discontinuity handling
5. Recording functionality (glw_rec)

## Reverting (if needed)

To revert to the old libav:
```bash
cd ext/libav
git remote add libav https://github.com/czz/libav.git
git fetch libav
git checkout libav/master
```

Then revert all source code changes and use `-lavresample` instead of `-lswresample`.
