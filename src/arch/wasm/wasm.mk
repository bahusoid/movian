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

${BUILDDIR}/stage/%: support/wasm/% ; mkdir -p $(dir $@) && cp $< $@

${BUILDDIR}/stage/movian.wasm: ${PROG} ; mkdir -p $(dir $@) && cp $<.wasm $@

${BUILDDIR}/stage/movian.js: ${PROG} ; mkdir -p $(dir $@) && cp $< $@

${BUILDDIR}/stage/movian.data: ${PROG} ; mkdir -p $(dir $@) && cp $<.data $@

${BUILDDIR}/stage/manifest.json: support/wasm/manifest.json ; mkdir -p $(dir $@) && sed <$< >$@ -e "s/__VERSION__/$(shell git describe | sed -e 's/-g.*//' -e 's/-/./g')/"

${BUILDDIR}/stage/resources.stamp: $(wildcard glwskins/* res/* lang/* guresources/*) ; rm -f ${BUILDDIR}/stage/background.js ${BUILDDIR}/stage/manifest.json ${BUILDDIR}/stage/app.nmf && rm -rf ${BUILDDIR}/stage/res ${BUILDDIR}/stage/lang ${BUILDDIR}/stage/glwskins ${BUILDDIR}/stage/guresources && mkdir -p ${BUILDDIR}/stage && cp -r glwskins res lang guresources ${BUILDDIR}/stage/ && touch $@

STAGEFILES = \
        ${BUILDDIR}/stage/index.html \
        ${BUILDDIR}/stage/app.css \
        ${BUILDDIR}/stage/app.js \
        ${BUILDDIR}/stage/st128.png \
        ${BUILDDIR}/stage/st16.png

.PHONY: stage-clean-legacy stage dbgstage dist stagezip
stage-clean-legacy: ; rm -f ${BUILDDIR}/stage/background.js ${BUILDDIR}/stage/manifest.json ${BUILDDIR}/stage/app.nmf

stage:  stage-clean-legacy ${STAGEFILES} ${BUILDDIR}/stage/resources.stamp ${BUILDDIR}/stage/movian.wasm ${BUILDDIR}/stage/movian.js
stage:  ${BUILDDIR}/stage/movian.data

dbgstage:       stage-clean-legacy ${STAGEFILES} ${BUILDDIR}/stage/resources.stamp ${BUILDDIR}/stage/movian.wasm ${BUILDDIR}/stage/movian.js
dbgstage:       ${BUILDDIR}/stage/movian.data

DISTARCHIVE := ${BUILDDIR}/${APPNAMEUSER}-${VERSION}.zip
STAGEARCHIVE := ${BUILDDIR}/${APPNAMEUSER}-${VERSION}-stage.zip

${DISTARCHIVE}: stage-clean-legacy ${STAGEFILES} ${BUILDDIR}/stage/resources.stamp ${BUILDDIR}/stage/movian.wasm ${BUILDDIR}/stage/movian.js ${BUILDDIR}/stage/movian.data ; rm -f ${DISTARCHIVE} && zip -j ${DISTARCHIVE} ${BUILDDIR}/stage/*

${STAGEARCHIVE}: stage ; rm -f ${STAGEARCHIVE} && cd ${BUILDDIR}/stage && zip -r ../$(notdir ${STAGEARCHIVE}) .

dist: ${DISTARCHIVE}

stagezip: ${STAGEARCHIVE}
