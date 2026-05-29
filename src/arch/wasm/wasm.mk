.DEFAULT_GOAL := stage

SRCS += src/arch/wasm/wasm_main.c \
        src/arch/wasm/wasm_misc.c \
        src/arch/wasm/wasm_fs.c \
        src/arch/wasm/wasm_audio.c \
        src/arch/wasm/wasm_video.c \
        src/arch/wasm/wasm_threads.c \
        src/arch/wasm/wasm_dnd.c \
        src/networking/net_posix.c \
        src/networking/net_ifaddr.c \
        src/networking/asyncio_posix.c \
        src/ui/glw/glw_video_yuvp.c \
        src/ui/glw/glw_video_tex.c \
        src/htsmsg/persistent_file.c

${BUILDDIR}/stage/%: support/wasm/%
	@mkdir -p $(dir $@)
	cp $< $@

${BUILDDIR}/stage/movian.wasm: ${PROG}
	@mkdir -p $(dir $@)
	cp $<.wasm $@

${BUILDDIR}/stage/movian.js: ${PROG}
	@mkdir -p $(dir $@)
	cp $< $@

${BUILDDIR}/stage/manifest.json: support/wasm/manifest.json
	@mkdir -p $(dir $@)
	sed <$< >$@ -e "s/__VERSION__/$(shell git describe | sed -e 's/-g.*//' -e 's/-/./g')/"

STAGEFILES = \
        ${BUILDDIR}/stage/index.html \
        ${BUILDDIR}/stage/app.css \
        ${BUILDDIR}/stage/app.js \
        ${BUILDDIR}/stage/manifest.json \
        ${BUILDDIR}/stage/background.js \
        ${BUILDDIR}/stage/st128.png \
        ${BUILDDIR}/stage/st16.png

.PHONY: stage dbgstage dist
stage:  ${STAGEFILES} ${BUILDDIR}/stage/movian.wasm ${BUILDDIR}/stage/movian.js

dbgstage:       ${STAGEFILES} ${BUILDDIR}/stage/movian.wasm ${BUILDDIR}/stage/movian.js

DISTARCHIVE := ${BUILDDIR}/${APPNAMEUSER}-${VERSION}.zip

${DISTARCHIVE}: ${STAGEFILES} ${BUILDDIR}/stage/movian.wasm ${BUILDDIR}/stage/movian.js
	rm -f ${DISTARCHIVE}
	zip -j ${DISTARCHIVE} ${BUILDDIR}/stage/*

dist: ${DISTARCHIVE}
