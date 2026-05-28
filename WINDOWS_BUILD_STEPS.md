# Building Movian on Windows Natively

This document outlines the required steps to set up a clean Windows environment and build the Movian Windows native port.

## 1. Install Dependencies

You need `MSYS2` to get the `MinGW-w64` toolchain and other required build tools (`make`, `unzip`, `curl`).

### Option A: Using Winget (Recommended)
Open a PowerShell prompt terminal and run:
```powershell
winget install MSYS2.MSYS2 --accept-source-agreements --accept-package-agreements
```

### Option B: Manual Installation
1. Download the installer from the [MSYS2 website](https://www.msys2.org/).
2. Run the installer and install it to the default directory (`C:\msys64`).

## 2. Install Required Packages via MSYS2

Once MSYS2 is installed, you need to install the build toolchain. You can do this from PowerShell using:

```powershell
C:\msys64\usr\bin\bash.exe -lc "pacman --noconfirm -S mingw-w64-x86_64-gcc make unzip curl gettext nasm diffutils pkgconf mingw-w64-x86_64-pkgconf mingw-w64-x86_64-gdb"
```

Packages installed:
* `mingw-w64-x86_64-gcc`: The C/C++ cross-compiler for Windows 64-bit.
* `make`: The build automation tool.
* `unzip`: Required by `configure.windows` for extracting dependencies like GLFW.
* `curl`: Required for downloading precompiled libraries like ANGLE.
* `gettext`: Provides necessary localization tools if required.
* `nasm`: The assembler necessary for compiling FFmpeg natively on Windows.
* `diffutils`: Provides the `cmp` tool required during the FFmpeg configure block.
* `pkgconf`, `mingw-w64-x86_64-pkgconf`: Tools for library detection via `pkg-config`.
* `mingw-w64-x86_64-gdb`: gdb debugger (needed if you plan to debug movian code is some IDE) 

## 3. Pre-Build Setup (Toolchain Aliasing)

The build script assumes the compiler toolchain uses the `x86_64-w64-mingw32-` prefix for all tools (e.g. `ar`, `nm`), which is common in cross-compilation environments but sometimes natively grouped under standard names in MSYS2. Run this command to create prefixed copies if any tools are not automatically recognized:

```powershell
$binDir = "C:\msys64\mingw64\bin"; @("ar", "nm", "ranlib", "strip", "windres") | ForEach-Object { Copy-Item "$binDir\$_.exe" "$binDir\x86_64-w64-mingw32-$_.exe" -ErrorAction SilentlyContinue }
```

## 4. Set up the Environment PATH

For the build scripts to find the installed tools, you need to add the MSYS2 bin directories to your `PATH`.

You can do this temporarily in your current PowerShell session:
```powershell
$env:PATH = "C:\msys64\mingw64\bin;C:\msys64\usr\bin;$env:PATH"
```

> **Note**: For a permanent solution, add `C:\msys64\mingw64\bin` and `C:\msys64\usr\bin` to your System Environment Variables via Windows Settings. Log Out and Log In to make sure it's applied.

## 5. Build Movian

With the PATH set, simply navigate to your Movian source directory in PowerShell and run:

```powershell
make BUILD=windows windows_release
```

This will invoke the `Makefile`, automatically execute `configure.windows` pulling in internal dependencies (zlib, freetype, ffmpeg, etc.) and external prebuilt libraries (GLFW, ANGLE), and produce a fully packaged release inside the `build.windows/release` directory.

