#include <stdio.h>
#include <stdlib.h>
#include <winsock2.h>
#include <windows.h>
#include <io.h>
#include <fcntl.h>
#include "main.h"
#include "navigator.h"

LONG WINAPI MyUnhandledExceptionFilter(struct _EXCEPTION_POINTERS *ExceptionInfo);

extern void *glw_glfw_start(void *nav);

int main(int argc, char **argv) {
    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);

    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);
    SetUnhandledExceptionFilter(MyUnhandledExceptionFilter);

    gconf.binary = argv[0];
    parse_opts(argc, argv);
    main_init();

    struct prop *nav = nav_spawn();

    glw_glfw_start(nav);

    main_fini();
    return 0;
}
