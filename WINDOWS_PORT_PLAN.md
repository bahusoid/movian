# Windows Port Plan

## Objective
Create a native Windows port for Movian. We will use the existing `nacl` port as a reference where necessary but target native Windows, utilizing GLFW for windowing and ANGLE for OpenGL ES translation.

## Build System & Dependencies
### Compiler and Toolchain
* We will use MinGW-w64 to allow easy cross-compilation from Linux/WSL or native building via MSYS2. 
* Targetting `x86_64-w64-mingw32-gcc`.

### Heavy Dependencies
We will avoid building huge dependencies from source when possible:
* **ANGLE**: Use a precompiled binary dataset downloaded during configuration or build time (since we are cross-compiling from Linux, we'll download a zip/tar release of ANGLE built for Windows).
* **GLFW**: We can either download a precompiled Windows binary for GLFW or build it from source if it's lightweight enough. Precompiled is preferred to match ANGLE.

Actually, let's list the known Movian dependencies:
* Libav / FFmpeg
* Freetype
* Zlib
* Bzip2
Most of these are built by the internal `ext/` system (`libav_setup`, `freetype_setup`, etc.). Those can generally cross-compile using MinGW-w64 easily because they use standard configure/Make.

## Step-by-step Plan
1. **Initial configure script**: Create `configure.windows` analogous to `configure.linux`. Target `x86_64-w64-mingw32-gcc`.
2. **Build framework changes**: Add `PLATFORM="windows"` definitions, adapt `support/configure.inc` if necessary to handle `.exe` extensions, `.dll` output logic.
3. **Core adaptions**: Add `_WIN32` conditional blocks in `src/` where filesystem, socket, or threading logic is Unix-specific. 
   - Since Movian relies heavily on POSIX (pthreads, file access), we must check if we use a POSIX wrapper or directly map to Win32 APIs. MinGW-w64 provides pthreads, which reduces the effort.
   - Network layer (needs `Winsock2`, initialization).
4. **Window/Graphics Context**: Implement a Windows window creation context. The idea is to use GLFW + ANGLE (OpenGL ES wrappers for DirectX).
5. **Download & Integration of Precompiled Binaries**: Add helper scripts or logic in `configure.windows` to fetch precompiled ANGLE and GLFW.
6. **Testing and Debugging**: Build and run `movian.exe`.
7. **Packaging/Distribution**: Define a packaging structure.

---

## Current Status (May 2026 - Linker & Core Implementation Resolved)
* **Configure Script**: Created `configure.windows` utilizing MinGW-w64 (`x86_64-w64-mingw32-gcc`). 
* **Dependencies & Precompiled Binaries**: 
  * Automatically fetches prebuilt generic Windows **GLFW 3.3.8** binaries, extracting static libs/headers to `build.windows/inst/`.
  * Patched `zlib_setup_win` to correctly cross-compile `libz.a` targeting MinGW.
  * `bzip2`, `freetype`, and `libav` (FFmpeg) configure and build properly with the Windows cross-compiler logic. 
* **Arch Layer skeleton**: Created `src/arch/windows/` with base hooks populated (`windows.mk`, `windows_main.c`, `windows_misc.c`).
* **Active compilation & Linker Step**: The `movian.exe` successfully compiles and links natively.

### Documentation of Issues Encountered and Resolutions
You mentioned expecting no issues with GLFW because `build.windows/glfw-3.3.8.bin.WIN64/lib-mingw-w64` contained precompiled libraries specifically for MinGW. You were right! **GLFW itself didn't have any issues**. The precompiled `libglfw3.a` worked flawlessly.

The linker "struggles" we encountered were strictly due to missing **OS-level dependency flags** and missing **OpenGL backend implementations** for ANGLE:

1. **GLFW OS Dependencies**: While `libglfw3.a` is statically provided, it relies on underlying Windows APIs. To make it link successfully, we just had to explicitly append `-lglfw3` along with its required Windows system libraries (`-lgdi32`, `-liphlpapi`) to `LDFLAGS_cfg` inside `configure.windows`.
2. **The real graphics linker struggle — ANGLE (GLESv2 & EGL)**: Movian expects an OpenGL ES 2 renderer (`glEnable`, `glDrawArrays`, etc.). Precompiled GLFW gives us a window, but *not* a graphics driver. When we tried linking, `make` aborted citing hundreds of `undefined reference to gl...` errors. 
   - *Resolution*: Windows lacks native GLESv2. We bypassed building Google ANGLE from source (too heavy) and instead forcibly downloaded the pre-compiled **MSYS2 ANGLE package** (`mingw-w64-x86_64-angleproject-*.pkg.tar.zst`). We extracted `libGLESv2.dll.a`, `libEGL.dll.a`, and the ANGLE `<GLES2/gl2.h>` headers into `build.windows/inst`, satisfying all missing OpenGL symbols!
3. **Cryptography & Random Bytes**: POSIX relies on `/dev/urandom`. We implemented `arch_get_random_bytes` using Windows Cryptography Next Generation (`<bcrypt.h>`, `BCryptGenRandom`) and linked against `-lbcrypt` and `-lsecur32` in `config.mak`.
4. **Networking (WinSock2 mapping)**: Windows handles sockets drastically differently. Compiling POSIX socket code naturally failed. 
   - *Resolution*: Replaced `net_posix.c` with a platform-specific `net_windows.c`. Converted `#include <sys/socket.h>` to `<winsock2.h>`. Replaced POSIX `fcntl(fd, F_SETFL, O_NONBLOCK)` with Windows `ioctlsocket(fd, FIONBIO)`. Removed `gethostbyname_r` (missing in MinGW) in favor of standard thread-local `gethostbyname`. Mapped `poll` to `WSAPoll`.
5. **Architectural Pipes (`arch_pipe`)**: Unix pipes (`pipe()`) do not exist with the same multiplex-capable traits on Windows.
   - *Resolution*: We successfully simulated `arch_pipe()` in `windows_misc.c` by booting up a localhost TCP socket (`INET_LOOPBACK`) that connects to itself.

## Recommended Next Steps for the Windows Port
1. **Packaging (`movian.exe`)**: 
   The binary has been successfully linked. However, to execute `movian.exe`, you must bundle it alongside the shared DLLs we linked against:
   * ANGLE DLLs (`libGLESv2.dll`, `libEGL.dll`) from the MSYS2 archive.
   * C-Runtime DLLs if not strictly statically linked (e.g., `libgcc_s_sjlj-1.dll`, `libwinpthread-1.dll`).
2. **Audio Backend**: 
   `audio_driver_init` in `windows_misc.c` currently returns `NULL` (audio disabled). We need to implement an audio output adapter traversing through Windows WASAPI or XAudio2.
3. **GLFW Input Handling**:
   While GLFW initializes the window context correctly, you need to map GLFW input callbacks (key presses, mouse, gamepad) into Movian's `glw` UI layers inside `src/ui/glw/glw_frontend_glfw.c` etc.
4. **Added `windows_release` target to Makefile**
    A new Make target `.PHONY: windows_release` has been added to `Makefile` so that:
    `make BUILD=windows windows_release` correctly outputs a final distributable bundle inside `build.windows/release/`. 
    This automatically collects the built `movian.exe` along with necessary MSYS2 ANGLE DLL binaries (`libEGL.dll`, `libGLESv2.dll`) and any compiler-specific threading runtimes (`libwinpthread-1.dll`) into one directory.
