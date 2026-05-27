#include "audio2/audio.h"
#include "networking/net.h"
#include "arch/arch.h"
#include "arch/halloc.h"
#include "main.h"
#include <malloc.h>
#include <winsock2.h>
#include <windows.h>
#include <time.h>
#include <stdint.h>
#include <stdlib.h>

const char *arch_get_system_type(void) {
    return "Windows";
}

void arch_sync_path(const char *path) {
}

size_t arch_malloc_size(void *ptr) {
    return _msize(ptr);
}

int64_t arch_get_ts(void) {
    FILETIME ft;
    GetSystemTimeAsFileTime(&ft);
    uint64_t t = ((uint64_t)ft.dwHighDateTime << 32) | ft.dwLowDateTime;
    t -= 116444736000000000ULL;
    t /= 10;
    return t;
}

int64_t arch_get_avtime(void) {
    return arch_get_ts();
}

void *halloc(size_t size) {
    return VirtualAlloc(NULL, size, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
}

void hfree(void *ptr, size_t size) {
    VirtualFree(ptr, 0, MEM_RELEASE);
}

void *mymalloc(size_t size) { return malloc(size); }
void *myrealloc(void *ptr, size_t size) { return realloc(ptr, size); }
void *mycalloc(size_t count, size_t size) { return calloc(count, size); }

void *mymemalign(size_t align, size_t size) {
    return _aligned_malloc(size, align);
}

void mymemalign_free(void *ptr) {
    _aligned_free(ptr);
}

void arch_localtime(const time_t *now, struct tm *tm) {
#ifdef __MINGW32__
    struct tm *tmp = localtime(now);
    if(tmp) *tm = *tmp;
#else
    localtime_s(tm, now);
#endif
}
char *strndup(const char *s, size_t n) {
    char *result;
    size_t len = 0;
    while (len < n && s[len]) len++;
    result = malloc(len + 1);
    if (!result) return 0;
    memcpy(result, s, len);
    result[len] = '\0';
    return result;
}

struct tm *gmtime_r(const time_t *timep, struct tm *result) {
    if (!timep || !result) return NULL;
    if (gmtime_s(result, timep) == 0)
        return result;
    return NULL;
}

char *strsep(char **stringp, const char *delim) {
    char *s;
    const char *spanp;
    int c, sc;
    char *tok;
    if ((s = *stringp) == NULL) return NULL;
    for (tok = s;;) {
        c = *s++;
        spanp = delim;
        do {
            if ((sc = *spanp++) == c) {
                if (c == 0) s = NULL;
                else s[-1] = 0;
                *stringp = s;
                return tok;
            }
        } while (sc != 0);
    }
}

size_t strlcat(char *dst, const char *src, size_t siz) {
    char *d = dst;
    const char *s = src;
    size_t n = siz;
    size_t dlen;
    while (n-- != 0 && *d != '\0') d++;
    dlen = d - dst;
    n = siz - dlen;
    if (n == 0) return (dlen + strlen(s));
    while (*s != '\0') {
        if (n != 1) {
            *d++ = *s;
            n--;
        }
        s++;
    }
    *d = '\0';
    return (dlen + (s - src));
}

#include <bcrypt.h>

void arch_get_random_bytes(void *ptr, size_t n) {
    uint8_t *dst = (uint8_t *)ptr;
    BCRYPT_ALG_HANDLE hAlgo = NULL;
    if (BCryptOpenAlgorithmProvider(&hAlgo, BCRYPT_RNG_ALGORITHM, NULL, 0) == 0) {
        BCryptGenRandom(hAlgo, dst, (ULONG)n, 0);
        BCryptCloseAlgorithmProvider(hAlgo, 0);
    }
}


void trace_arch(int level, const char *prefix, const char *buf) {
    fprintf(stderr, "%s %s\n", prefix, buf);
    fflush(stderr);
}

void arch_exit(void) {
    fprintf(stderr, "\n=== arch_exit() CALLED ===\n");
    fflush(stderr);
    exit(0);
}

int arch_stop_req(void) {
    fprintf(stderr, "\n=== arch_stop_req() CALLED ===\n");
    fflush(stderr);
    return 2; // ARCH_STOP_CALLER_MUST_HANDLE
}

struct net_iface;
netif_t *net_get_interfaces(void) {
    
    return NULL;
}

#include <winsock2.h>
int arch_pipe(int fd[2]) {
    SOCKET lst = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (lst == INVALID_SOCKET) return -1;
    
    // Bind to localhost
    struct sockaddr_in inaddr;
    memset(&inaddr, 0, sizeof(inaddr));
    inaddr.sin_family = AF_INET;
    inaddr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    inaddr.sin_port = 0;
    if (bind(lst, (struct sockaddr *)&inaddr, sizeof(inaddr)) == SOCKET_ERROR) {
        closesocket(lst);
        return -1;
    }
    if (listen(lst, 1) == SOCKET_ERROR) {
        closesocket(lst);
        return -1;
    }
    int len = sizeof(inaddr);
    if (getsockname(lst, (struct sockaddr *)&inaddr, &len) == SOCKET_ERROR) {
        closesocket(lst);
        return -1;
    }

    SOCKET src = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (src == INVALID_SOCKET) {
        closesocket(lst);
        return -1;
    }

    // Must set connect socket non-blocking so connect() doesn't deadlock waiting for accept()
    // in the same thread.
    unsigned long mode = 1;
    ioctlsocket(src, FIONBIO, &mode);
    
    connect(src, (struct sockaddr *)&inaddr, len);
    
    SOCKET dst = accept(lst, NULL, NULL);
    closesocket(lst);
    if (dst == INVALID_SOCKET) {
        closesocket(src);
        return -1;
    }
    
    // Revert src to blocking since the rest of the app might assume write() blocks
    // Oh wait, reading from pipes usually needs to be non-blocking in poll loops
    // But let's leave it as is or revert to blocking.
    mode = 0;
    ioctlsocket(src, FIONBIO, &mode);

    fd[0] = (int)dst;
    fd[1] = (int)src;
    return 0;
}