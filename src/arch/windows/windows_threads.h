#pragma once

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#ifdef __cplusplus
extern "C" {
#endif

// Mutex
typedef struct {
    CRITICAL_SECTION cs;
    volatile LONG init_state;
} hts_mutex_t;

typedef hts_mutex_t hts_lwmutex_t;

static inline void hts_mutex_init(hts_mutex_t *m) {
    InitializeCriticalSection(&m->cs);
    m->init_state = 2;
}

static inline void hts_mutex_init_recursive(hts_mutex_t *m) {
    hts_mutex_init(m); // Windows CRITICAL_SECTION is always recursive
}

static inline void hts_lwmutex_init(hts_lwmutex_t *m) { hts_mutex_init(m); }
static inline void hts_lwmutex_init_recursive(hts_lwmutex_t *m) { hts_mutex_init(m); }

static inline void hts_mutex_lazy_init(hts_mutex_t *m) {
    if (m->init_state != 2) {
        if (InterlockedCompareExchange(&m->init_state, 1, 0) == 0) {
            InitializeCriticalSection(&m->cs);
            m->init_state = 2;
        } else {
            while (m->init_state != 2) {
                Sleep(0);
            }
        }
    }
}

static inline void hts_mutex_lock(hts_mutex_t *m) {
    hts_mutex_lazy_init(m);
    EnterCriticalSection(&m->cs);
}

static inline void hts_mutex_unlock(hts_mutex_t *m) {
    LeaveCriticalSection(&m->cs);
}

static inline void hts_mutex_destroy(hts_mutex_t *m) {
    if (m->init_state == 2) {
        DeleteCriticalSection(&m->cs);
        m->init_state = 0;
    }
}

static inline void hts_lwmutex_lock(hts_lwmutex_t *m) { hts_mutex_lock(m); }
static inline void hts_lwmutex_unlock(hts_lwmutex_t *m) { hts_mutex_unlock(m); }
static inline void hts_lwmutex_destroy(hts_lwmutex_t *m) { hts_mutex_destroy(m); }

static inline void hts_mutex_assert0(hts_mutex_t *m, const char *file, int line) {
    hts_mutex_lazy_init(m);
    // CRITICAL_SECTION lock count is > 0 and OwningThread equals current thread
    if (m->cs.OwningThread != (HANDLE)(intptr_t)GetCurrentThreadId()) {
        fprintf(stderr, "Mutex not held at %s:%d\n", file, line);
        abort();
    }
}
#define hts_mutex_assert(l) hts_mutex_assert0(l, __FILE__, __LINE__)

static inline int hts_mutex_trylock(hts_mutex_t *m) {
    hts_mutex_lazy_init(m);
    return !TryEnterCriticalSection(&m->cs); // returns 1 if busy (failed to enter)
}

#define HTS_MUTEX_DECL(name) hts_mutex_t name = { {0}, 0 }
#define HTS_LWMUTEX_DECL(name) hts_mutex_t name = { {0}, 0 }


// Condition Variables
typedef CONDITION_VARIABLE hts_cond_t;

static inline void hts_cond_init(hts_cond_t *c, hts_mutex_t *m) {
    InitializeConditionVariable(c);
}

static inline void hts_cond_signal(hts_cond_t *c) {
    WakeConditionVariable(c);
}

static inline void hts_cond_broadcast(hts_cond_t *c) {
    WakeAllConditionVariable(c);
}

static inline void hts_cond_wait(hts_cond_t *c, hts_mutex_t *m) {
    hts_mutex_lazy_init(m);
    SleepConditionVariableCS(c, &m->cs, INFINITE);
}

static inline void hts_cond_destroy(hts_cond_t *c) {
    // Condition variables do not need to be destroyed on Windows
}

extern int hts_cond_wait_timeout(hts_cond_t *c, hts_mutex_t *m, int delta);
extern int hts_cond_wait_timeout_abs(hts_cond_t *c, hts_mutex_t *m, int64_t deadline);


// Threads
#define THREAD_PRIO_AUDIO         -10
#define THREAD_PRIO_VIDEO         -5
#define THREAD_PRIO_DEMUXER        3
#define THREAD_PRIO_UI_WORKER_HIGH 5
#define THREAD_PRIO_UI_WORKER_MED  8
#define THREAD_PRIO_FILESYSTEM     10
#define THREAD_PRIO_MODEL          12
#define THREAD_PRIO_METADATA       13
#define THREAD_PRIO_UI_WORKER_LOW  14
#define THREAD_PRIO_METADATA_BG    15
#define THREAD_PRIO_BGTASK         19

typedef HANDLE hts_thread_t;

extern void hts_thread_create_detached(const char *title, void *(*func)(void *), void *aux, int prio);
extern void hts_thread_create_joinable(const char *title, hts_thread_t *p, void *(*func)(void *), void *aux, int prio);

static inline void hts_thread_detach(hts_thread_t *t) {
    CloseHandle(*t);
}

static inline void hts_thread_join(hts_thread_t *t) {
    WaitForSingleObject(*t, INFINITE);
    CloseHandle(*t);
}

static inline hts_thread_t hts_thread_current() {
    return GetCurrentThread();
}

extern const char *hts_thread_name(char *buf, size_t len);

#if !ENABLE_EMU_THREAD_SPECIFICS
// Thread Local Storage
typedef DWORD hts_key_t;

static inline int hts_thread_key_create(hts_key_t *k, void (*destructor)(void*)) {
    *k = TlsAlloc();
    if (*k == TLS_OUT_OF_INDEXES) return -1;
    return 0;
}

static inline void hts_thread_key_delete(hts_key_t k) {
    TlsFree(k);
}

static inline void hts_thread_set_specific(hts_key_t k, void *p) {
    TlsSetValue(k, p);
}

static inline void *hts_thread_get_specific(hts_key_t k) {
    return TlsGetValue(k);
}
#endif

#ifdef __cplusplus
}
#endif
