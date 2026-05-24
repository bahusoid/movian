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

## Current Status (May 2026)
* **Configure Script**: Created `configure.windows` utilizing MinGW-w64 (`x86_64-w64-mingw32-gcc`). Integrated seamless launching in the main `./configure`.
* **Dependencies**: 
  * Automatically fetches prebuilt generic Windows **GLFW 3.3.8** binaries, extracting static libs/headers to `build.windows/inst/`.
  * Patched `zlib_setup_win` to correctly download `zlib-1.2.13` and cross-compile `libz.a` targeting MinGW. (Also fixed broken curl 403 Google NaCl URLs in the global `support/configure.inc` and `support/configure_alternative.inc`).
  * `bzip2`, `freetype`, and `libav` (FFmpeg) configure and build properly with the Windows cross-compiler logic. 
* **Arch Layer skeleton**: Created `src/arch/windows/` with base hooks (`windows.mk`, `windows_main.c`, `windows_misc.c`).
* **Active compilation**: Making `BUILD=windows` succeeds through the massive `libav` build, but currently pending resolving native compilation errors in the Movian `src/` layer.

## Recommended Next Steps for the Next Machine Setup
1. **Setup Environment**: Install MinGW-w64 cross-compiler (`sudo apt install gcc-mingw-w64 g++-mingw-w64`) if you are building from a Linux machine/WSL. 
2. **Run Configure**: Clean your tree and run `./configure.windows` (or just `./configure`, it detects MSYS/MinGW environments automatically if natively on Windows, though from Linux `configure.windows` forces the cross-compilation). 
3. **Build and Fix C-level Errors**: 
   * Run `make BUILD=windows V=1 -j4`.
   * **Wait for `libav` to compile** (it takes a few minutes and may look like the build is hung, check `ps aux | grep make`).
   * When `libav` completes, `make` will begin compiling Movian's `src/**/*.c`. 
   * **Networking**: You will rapidly hit socket incompatibilities in `src/networking/net_posix.c`. Code must be patched for mapped Winsock functionality (e.g. `closesocket()` instead of `close()`, and `WSAStartup()` during `windows_misc_init()`). 
   * **Filesystem**: Similarly, inspect `fa_fs.c` and fix file handling methods that expect strict POSIX paths or semantics.
4. **GLFW Frontend (`glw_frontend_glfw.c`)**: Create a GLFW event handler/glue layer in `src/ui/glw/` to initialize a window, parse keyboard/mouse input, and pass it to Movian's `glw` UI layer. 
5. **ANGLE Initialization**: Since `glw_backend_opengl_es.c` handles drawing, your GLFW window will need to initialize EGL/GLES contexts via ANGLE binaries (`libEGL.dll` and `libGLESv2.dll`). Add the download logic in `configure.windows` as outlined by the bypassed function there.


Moving to the New Machine — Your Next Steps:
Toolchain setup: If on Linux, sudo apt install gcc-mingw-w64 g++-mingw-w64 binutils-mingw-w64 is required.
Setup run: rm -rf build.windows && ./configure.windows
Trigger compiling: make BUILD=windows V=1 -j4
Note: libav (FFmpeg) configure and compile process will run for a while sequentially before it even hits Movian src/ files. Do not terminate it thinking it's stuck.
Platform Fixes: When libav completes, make will begin checking things like src/networking/net_posix.c. This is where you'll transition from configuring the tooling to natively mapping Winsock / Win32 properties (like implementing net_windows.c instead of net_posix.c).
GLFW Graphics Frontend: Implement src/ui/glw/glw_frontend_glfw.c which interfaces GLFW into Movian's UI renderer, using ANGLE context bootstrapping (since Movian's hardware layer is tailored towards OpenGL ES).
All directions and next hurdles are safely logged in the plan document. Safe travels!