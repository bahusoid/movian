# WebAssembly Port Migration Plan (Replacing NaCl)
## Overview
NaCl/Pepper is deprecated. The official path forward is using WebAssembly (Wasm), WebCodecs, WebGL2, and WebAudio. This guide details how to build the Movian WebAssembly port using Emscripten.
## Pre-requisites
### Install Emscripten
To build the WASM port of Movian, you need the Emscripten SDK (`emsdk`).
1. Clone emsdk:
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
```
2. Install and activate learning tools:
```bash
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```
## Build Configuration
1. Set up the project configuration using `configure.wasm`. 
```bash
# If emsdk_env.sh was sourced, EMSDK environment variable will be picked up automatically
./configure.wasm
# Otherwise, explicitly define the path
./configure.wasm --emsdk=/path/to/emsdk
```
2. Make
```bash
make BUILD=wasm
```
## Migration Notes
- WebAssembly requires specific compilation and linker flags (`-s WASM=1 -s USE_WEBGL2=1 -s USE_PTHREADS=1 -s ASYNCIFY`).
- Replaces NaCl implementations with Emscripten's built-in APIs (`GL`, `EGL`, Browser API).
- Need to check threaded code and ensure it complies with WebAssembly threading rules (SharedArrayBuffer needs COOP/COEP headers on the hosting server).
