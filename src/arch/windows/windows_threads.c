#include "arch/arch.h"
#include "main.h"
#include "windows_threads.h"

int posix_set_thread_priorities = 0; // Not used on Windows natively

typedef struct {
    char *title;
    void *(*func)(void *);
    void *aux;
    int prio;
} trampoline_t;

static DWORD WINAPI thread_trampoline(LPVOID aux) {
    trampoline_t *t = aux;
    char title[32];
    void *taux = t->aux;
    void *(*func)(void *) = t->func;

    snprintf(title, sizeof(title), "%s", t->title);

    // Set thread name if using Windows 10 updated APIs, otherwise omit
    // (SetThreadDescription is available on newer Windows 10 builds)
    typedef HRESULT (WINAPI *SetThreadDescription_t)(HANDLE, PCWSTR);
    HMODULE hKernel32 = GetModuleHandle("kernel32.dll");
    SetThreadDescription_t pSetThreadDescription = (SetThreadDescription_t)GetProcAddress(hKernel32, "SetThreadDescription");
    if (pSetThreadDescription) {
        int wlen = MultiByteToWideChar(CP_UTF8, 0, title, -1, NULL, 0);
        if (wlen > 0) {
            WCHAR *wtitle = malloc(wlen * sizeof(WCHAR));
            if (wtitle) {
                MultiByteToWideChar(CP_UTF8, 0, title, -1, wtitle, wlen);
                pSetThreadDescription(GetCurrentThread(), wtitle);
                free(wtitle);
            }
        }
    }

    free(t->title);
    free(t);

    func(taux);

#if ENABLE_EMU_THREAD_SPECIFICS
    hts_thread_exit_specific();
#endif

    if (gconf.enable_thread_debug)
        TRACE(TRACE_DEBUG, "thread", "Thread %s exited", title);

    return 0;
}

static trampoline_t *make_trampoline(const char *title, void *(*func)(void *), void *aux, int prio) {
    trampoline_t *t = malloc(sizeof(trampoline_t));
    t->title = strdup(title);
    t->func = func;
    t->aux = aux;
    t->prio = prio;
    return t;
}

void hts_thread_create_detached(const char *title, void *(*func)(void *), void *aux, int prio) {
    HANDLE hThread = CreateThread(NULL, 0, thread_trampoline, make_trampoline(title, func, aux, prio), 0, NULL);
    if (hThread) {
        CloseHandle(hThread); // Detach
    }
    if (gconf.enable_thread_debug)
        tracelog(TRACE_NO_PROP, TRACE_DEBUG, "thread", "Created detached thread: %s", title);
}

void hts_thread_create_joinable(const char *title, hts_thread_t *p, void *(*func)(void *), void *aux, int prio) {
    HANDLE hThread = CreateThread(NULL, 0, thread_trampoline, make_trampoline(title, func, aux, prio), 0, NULL);
    *p = hThread;
    if (gconf.enable_thread_debug)
        tracelog(TRACE_NO_PROP, TRACE_DEBUG, "thread", "Created joinable thread: %s", title);
}

const char *hts_thread_name(char *buf, size_t len) {
    typedef HRESULT (WINAPI *GetThreadDescription_t)(HANDLE, PWSTR*);
    HMODULE hKernel32 = GetModuleHandle("kernel32.dll");
    GetThreadDescription_t pGetThreadDescription = (GetThreadDescription_t)GetProcAddress(hKernel32, "GetThreadDescription");

    if (pGetThreadDescription) {
        PWSTR wtitle = NULL;
        if (SUCCEEDED(pGetThreadDescription(GetCurrentThread(), &wtitle)) && wtitle) {
            WideCharToMultiByte(CP_UTF8, 0, wtitle, -1, buf, len, NULL, NULL);
            LocalFree(wtitle);
            return buf;
        }
    }
    snprintf(buf, len, "thread-%lu", GetCurrentThreadId());
    return buf;
}

int hts_cond_wait_timeout(hts_cond_t *c, hts_mutex_t *m, int delta) {
    hts_mutex_lazy_init(m);
    BOOL b = SleepConditionVariableCS(c, &m->cs, delta);
    return b == 0 ? 1 : 0; // Return 1 (ETIMEDOUT) if sleep failed
}

int hts_cond_wait_timeout_abs(hts_cond_t *c, hts_mutex_t *m, int64_t deadline) {
    int64_t ts = deadline - arch_get_ts();
    if (ts <= 0)
        return 1;
    return hts_cond_wait_timeout(c, m, ts / 1000);
}
