.DEFAULT_GOAL := ${PROG}

SRCS += src/arch/windows/windows_main.c \
        src/arch/windows/windows_misc.c \
        src/arch/posix/posix.c \
        src/arch/posix/posix_threads.c \
        src/networking/asyncio_posix.c \
        src/networking/net_posix.c \
        src/fileaccess/fa_fs.c \
        src/htsmsg/persistent_file.c \
        src/ui/glw/glw_video_tex.c \
        src/ui/glw/glw_video_yuvp.c

# Probably more needed like glw_frontend_glfw.c?

