# Windows Port Status

## Current Progress
We have made significant progress on adapting Movian to build and run as a native Windows application cross-compiled from Linux using MinGW-w64.

1. **Packaging & Build System**:
   - Updated `configure.windows` and `Makefile` to link standard dynamic libraries (`libwinpthread-1.dll`, `libgcc_s_seh-1.dll`, `libstdc++-6.dll`).
   - Added a `windows_release_zip` target in `Makefile` to automatically bundle `movian.exe` (stripped) with all DLLs and resource directories.
   - Can be built and zipped via: `make BUILD=windows windows_release_zip`.

2. **Sockets & IPC**:
   - Implemented `WSAStartup` in `windows_main.c` so Windows sockets can initialize.
   - Movian's core background event loop uses an internal IPC pipe to wake up poll loops (`prop_courier`). In `src/networking/asyncio_posix.c`, we circumvented posix pipes by mapping `read()`/`write()` calls on these IPC pipes to WinSock `recv()`/`send()` natively for `_WIN32`, as `arch_pipe()` yields local TCP socket endpoints.
   - Sockets for the `arch_pipe` in `windows_misc.c` are properly set to non-blocking using `ioctlsocket(..., FIONBIO, ...)` to avoid deadlocking when both ends try to connect/accept on a single event loop thread.

3. **Crash Reporting**:
   - MinGW suppresses memory violation Segfaults silently on Windows. To debug, we installed `SetUnhandledExceptionFilter()` in `windows_main.c` which cleanly prints the exact RVA (Relative Virtual Address) exception code and memory offset on crashes, allowing us to pinpoint issues.

4. **GLFW OpenGL UI**:
   - `glw_glfw.c` loop was restructured to use `glfwWaitEventsTimeout(0.010)` instead of `Sleep(10)` to keep the GLFW context active.
   - Handled proper initialization of the UI prop root before `glw_init()`.

## Current Blocker
The application successfully spins up the main application thread, binds sockets, and creates the GLFW window context. However, it hangs indefinitely, taking up 25% CPU (busy spinlock on a single core) when starting the UI root:
```
Creating ui prop...
```

**Investigation points:**
- The process enters `prop_create_root_ex("ui")` inside `glw_glfw.c` and blocks indefinitely.
- The `prop_mutex` (a `pthread_mutex_t` macro-mapped to WinPthreads `hts_mutex_t`) seems to either deadlock or enter an infinite loop during memory allocation inside `pool_get()` in `prop_make()`. 
- `prop_init()` initialized the mutex in `main_init()`, but the behavior indicates either a thread lock conflict or `winpthreads` not behaving as expected under MinGW in `prop_make()`.

## Next Steps for Windows
- On a native Windows machine with Visual Studio / WinDbg or GDB, run the built `movian.exe`.
- When it hangs during UI creation, pause the debugger and check the thread stack trace to see exactly where `hts_mutex_lock(&prop_mutex)` or `pool_get(prop_pool)` is looping or locked.
- Consider exploring if `asyncio_windows.c` should be fully populated natively using Win32 IOCP / `WSAPoll` to replace `asyncio_posix.c` in the future for performance (similar to the NaCl pepper backend), removing reliance on WinPthreads locks that may be faltering.