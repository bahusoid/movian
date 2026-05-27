#include <stdio.h>
#include <stdlib.h>
#include <winsock2.h>
#include <windows.h>
#include <io.h>
#include <fcntl.h>
#include <shlobj.h>
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

    SYSTEM_INFO sysinfo;
    GetSystemInfo(&sysinfo);
    gconf.concurrency = sysinfo.dwNumberOfProcessors;

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    OSVERSIONINFO osvi;
    ZeroMemory(&osvi, sizeof(OSVERSIONINFO));
    osvi.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);
    if (GetVersionEx(&osvi)) {
        snprintf(gconf.os_info, sizeof(gconf.os_info), "Windows %lu.%lu Build %lu", osvi.dwMajorVersion, osvi.dwMinorVersion, osvi.dwBuildNumber);
    }
#pragma GCC diagnostic pop

    char appdata[MAX_PATH];
    if (SUCCEEDED(SHGetFolderPathA(NULL, CSIDL_LOCAL_APPDATA, NULL, 0, appdata))) {
        for (int i = 0; appdata[i]; i++) {
            if (appdata[i] == '\\') {
                appdata[i] = '/';
            }
        }
        char *path = malloc(MAX_PATH + 50);
        snprintf(path, MAX_PATH + 50, "file://%s/movian", appdata);
        gconf.cache_path = path;
        gconf.persistent_path = strdup(path);
    } else {
        gconf.cache_path = strdup("file://movian_data");
        gconf.persistent_path = strdup("file://movian_data");
    }

    parse_opts(argc, argv);
    main_init();

    struct prop *nav = nav_spawn();

    glw_glfw_start(nav);

    main_fini();
    return 0;
}

LONG WINAPI MyUnhandledExceptionFilter(struct _EXCEPTION_POINTERS *ExceptionInfo) {
    HMODULE hModule = GetModuleHandle(NULL);
    unsigned long long baseAddr = (unsigned long long)hModule;
    unsigned long long crashAddr = (unsigned long long)ExceptionInfo->ExceptionRecord->ExceptionAddress;
    unsigned long long rva = crashAddr - baseAddr;
    
    fprintf(stderr, "\n=== FATAL EXCEPTION CAUGHT ===\n");
    fprintf(stderr, "Exception Code: 0x%08lX\n", (unsigned long)ExceptionInfo->ExceptionRecord->ExceptionCode);
    fprintf(stderr, "Base Address: 0x%016llX\n", baseAddr);
    fprintf(stderr, "Crash Address: 0x%016llX\n", crashAddr);
    fprintf(stderr, "Relative Address (RVA): 0x%08llX\n", rva);
    fflush(stderr);
    return EXCEPTION_EXECUTE_HANDLER;
}
