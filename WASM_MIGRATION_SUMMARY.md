# WASM Port Migration Summary
Here is a summary of the changes, struggles, and resolutions so far in our migration from Native Client (NaCl) to WebAssembly (Emscripten):
### 1. High-Level Changes & Infrastructure Setup
* **Toolchain Installation**: Created an automated script (`install_emsdk.sh`) to download and activate the Emscripten SDK locally. 
* **Port Configuration**: Wrote custom `configure.wasm`, serving as a drop-in replacement for `configure.nacl`. 
* **Build Files**: Created the WebAssembly migration plan (`WASM_PORT_PLAN.md`) and a `README.wasm.md`.
* **Architecture Base**: Cloned `src/arch/nacl/` into `src/arch/wasm/`, renamed the `nacl_*.c` source files to `wasm_*.c`, and adapted `wasm.mk` to use the new architecture target.
### 2. Struggles & Resolutions
**Struggle A: External Library Configurations (`freetype`)**
* **The Problem**: The legacy `config.sub` shipped inside the `freetype` dependency did not recognize the `wasm32-linux`/`emscripten` targets.
* **The Resolution**: Rewrote `freetype_setup` inside `configure.wasm` to inject the system’s modern `config.sub` before running configuration, and forced it to use Emscripten’s `emconfigure` wrapper. 
**Struggle B: Linker Flags Triggering Compilation Errors**
* **The Problem**: Emscripten-specific linker arguments like `-s USE_WEBGL2=1` were being passed to standard C-compilation steps. Clang flagged these as unused arguments. Combined with Movian’s `-Werror` (warnings as errors), the build completely halted.
* **The Resolution**: Removed WebAssembly linker flags from `CFLAGS` and migrated purely to standard C threading flags (`-pthread`), isolating the `-s` arguments entirely to `LDFLAGS`.
**Struggle C: Compiler Warnings acting as Blockers (`-Werror`)**
* **The Problem**: The newer version of Clang (v18+) shipped with Emscripten throws out different warnings than the older GCC version Movian originally targeted. Widespread warnings like `unused-but-set-variable` inside external libraries (`ext/sqlite`, `ext/vmir`) kept crashing the build. Additionally, GCC-specific suppressions (`-Wno-stringop-truncation`) were unknown to Clang, which triggered further Werrors.
* **The Resolution**: Instead of altering and butchering external source code as initially attempted, I patched Movian's `Makefile` to explicitly instruct Clang to ignore these inconsistencies without failure using `-Wno-error=unused-but-set-variable` and `-Wno-error=implicit-function-declaration`. We also removed the Clang-incompatible GCC flags.
**Struggle D: Missing BSD Headers in Emscripten**
* **The Problem**: Emscripten’s internal C library (musl) does not ship with BSD's `<sys/queue.h>`. External libraries like `vmir` and parts of Movian core were failing to find it.
* **The Resolution**: Downloaded a portable `bsd-queue.h` from FreeBSD's source tree directly into the `build.wasm/sys/queue.h` directory, and added `-I$(BUILDDIR)` to the CFLAGS so any `#include <sys/queue.h>` seamlessly routes to the polyfill. Added `-D_GNU_SOURCE` and POSIX standard macros to ensure `gmtime_r` and `strptime` compile correctly.
### 3. Current Status & Next Steps
We have successfully managed to compile the vast majority of Movian's core runtime (`src/`) and its heavy external dependencies (`ext/`) into WebAssembly `.o` files. 
**The Current Blocker**: The compile has reached our newly created `src/arch/wasm/wasm_audio.c` and `wasm_dnd.c`. Because these files were duplicated straight from NACL, they are trying to include `#include "ppapi/c/pp_errors.h"`, which is the deprecated Google Pepper API. 
**Next Steps**: We must replace all Pepper (`ppapi`) logic from the `wasm_*.c` target files with HTML5/Emscripten equivalents (WebGL2, WebAudio, Browser I/O) to finish the port!
