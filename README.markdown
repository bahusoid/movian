Movian mediaplayer
==================

(c) 2006 - 2018 Lonelycoder AB


## How to build for Linux

First you need to satisfy some dependencies (for Ubuntu 24.04.3 LTS)

`	sudo apt-get install libfreetype6-dev libfontconfig1-dev libxext-dev libgl1-mesa-dev libasound2-dev libasound2-dev libgtk2.0-dev libxss-dev libxxf86vm-dev libxv-dev libvdpau-dev yasm nasm libpulse-dev libssl-dev curl libwebkit2gtk-4.1-dev libsqlite3-dev libavahi-client-dev
`

Note: `nasm` is required for building FFmpeg 7.x (in addition to `yasm`).

Then you need to configure:

	./configure

If your system lacks libwebkitgtk or some other lib you can configure like this:

	./configure --disable-webkit

If any dependencies are missing the configure script will complain.
You then have the option to disable that particular module/subsystem.

	make

Build the binary, after build the binary resides in `./build.linux/`.
Thus, to start it, just type:

	./build.linux/movian

To debug movian or plugins
	./build.linux/movian -d -p plugin_examples/plugin1 -p plugin_examples/plugin2
-d - for debug logs
-p - for loading plugins from folder


Settings are stored in `~/.hts/showtime`

If you want to build with extra debugging options for development these options might be of interest:

	--cc=gcc-5 --extra-cflags=-fno-omit-frame-pointer --optlevel=0 --sanitize=address --enable-bughunt


## How to build for Mac OS X

To build for Mac OS X you need Xcode and yasm. Xcode should be installed from Mac Appstore.

To install yasm, install [Brew](http://brew.sh/) and then

	$ brew install yasm

Now run configure

	$ ./configure

Or if you build for release

	$ ./configure --release

If configured successfully run:

	$ make

or if you have multiple configurations
	$ make BUILD=build.linux
	$ make BUILD=android.api21_x86
	$ make BUILD=android.api21_armv7

Run Movian binary from build directory

	$ build.osx/Movian.app/Contents/MacOS/movian

Note that in this case Movian loads all resources from current directory
so this binary can't be run elsewhere.

If you want a build that can be run as a normal Mac Application you shold do

	$ make dist

This will generate a DMG

## How to build for PS3 with PSL1GHT

$ ./Autobuild.sh -t ps3 -v 5.0.500

## How to build for Raspberry Pi

First you need to satisfy some dependencies (for Ubuntu 16.04.3 LTS 64bit):

	sudo apt-get install git-core build-essential autoconf bison flex libelf-dev libtool pkg-config texinfo libncurses5-dev libz-dev python-dev libssl-dev libgmp3-dev ccache zip squashfs-tools

$ ./Autobuild.sh -t rpi -v 5.0.500

To update Movian on rpi with compiled one, enable Binreplace in settings:dev and issue:

	curl --data-binary @build.rpi/showtime.sqfs http://rpi_ip_address:42000/api/replace

VS Code:
code --install-extension ms-vscode.cpptools