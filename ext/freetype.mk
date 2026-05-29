BD=${BUILDDIR}/freetype/build

build:
	${MAKE} -C ${BD} CCraw_build=cc
	${MAKE} -C ${BD} install CCraw_build=cc

configure:
	