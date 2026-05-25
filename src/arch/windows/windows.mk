.DEFAULT_GOAL := ${PROG}

CFLAGS += -Isrc/arch/windows

SRCS += src/arch/windows/windows_main.c \
        src/arch/windows/windows_misc.c \
        src/arch/windows/windows_threads.c \
        src/arch/windows/windows_fs.c \
        src/networking/asyncio_posix.c \
        src/networking/net_windows.c \
        src/htsmsg/persistent_file.c \
        src/ui/glw/glw_glfw.c \
        src/ui/glw/glw_video_tex.c \
        src/ui/glw/glw_video_yuvp.c

# Probably more needed like glw_frontend_glfw.c?

SRCS += src/audio2/waveout_audio.c
