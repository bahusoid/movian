#include "asyncio.h"
#include "platform.h"
#include <winsock2.h>
#include <windows.h>
#include <mswsock.h>
#include <stdio.h>
#include <stdint.h>
#include <assert.h>
#include "arch/threads.h"
#include "misc/queue.h"
#include "main.h"

// Define sendq structures natively
#include "htsmsg/htsbuf.h"
#include "net_i.h"
#include "prop/prop.h"
#include "ws2tcpip.h"

#ifndef IP_ADD_MEMBERSHIP
#define IP_ADD_MEMBERSHIP 12
#endif

#define MAX_WSA_EVENTS WSA_MAXIMUM_WAIT_EVENTS

struct asyncio_fd {
    SOCKET fd;
    WSAEVENT event;
    int events_mask;
    asyncio_fd_callback_t *cb;
    void *opaque;
    char name[64];
    int active;

    htsbuf_queue_t af_sendq;
    int af_pending_write;
};

// Global networking state
static struct asyncio_fd *g_fds[MAX_WSA_EVENTS];
static WSAEVENT g_events[MAX_WSA_EVENTS];
static int g_event_count = 0;

// Minimal Timer system (using list macro equivalents)
static LIST_HEAD(asyncio_timer_list, asyncio_timer) g_timers;

// Note: Movian core will supply threading/mutex primitives. Using a lightweight SRWLOCK for bare-metal NT sync
static hts_mutex_t asyncio_task_mutex;
static int g_asyncio_running = 0;
static hts_thread_t asyncio_thread_id;

struct prop_courier *asyncio_courier = NULL;

// DNS resolver primitives
struct asyncio_dns_req {
    TAILQ_ENTRY(asyncio_dns_req) adr_link;
    char *adr_hostname;
    void *adr_opaque;
    void (*adr_cb)(void *opaque, int status, const void *data);

    int adr_status;
    int adr_cancelled;
    const void *adr_data;
    const char *adr_errmsg;
    net_addr_t adr_addr;
};
static hts_mutex_t asyncio_dns_mutex;
static int asyncio_dns_worker;
static struct asyncio_dns_req_queue {
    struct asyncio_dns_req *tqh_first;
    struct asyncio_dns_req **tqh_last;
} asyncio_dns_pending, asyncio_dns_completed;
static int adr_resolver_running = 0;

static void adr_deliver_cb(void);

typedef struct asyncio_task {
    TAILQ_ENTRY(asyncio_task) at_link;
    void (*at_fn)(void *aux);
    void *at_aux;
} asyncio_task_t;
TAILQ_HEAD(asyncio_task_queue, asyncio_task) asyncio_tasks;

typedef struct asyncio_worker {
    LIST_ENTRY(asyncio_worker) link;
    void (*fn)(void);
    int id;
} asyncio_worker_t;
LIST_HEAD(asyncio_worker_list, asyncio_worker) asyncio_workers;
static hts_mutex_t asyncio_worker_mutex;
static int workers_cnt = 0;
static int asyncio_w_event_id = -1;

void asyncio_init_early(void) {
    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);

    TAILQ_INIT(&asyncio_tasks);
    LIST_INIT(&asyncio_workers);
    hts_mutex_init(&asyncio_task_mutex);
    hts_mutex_init(&asyncio_worker_mutex);

    TAILQ_INIT(&asyncio_dns_pending);
    TAILQ_INIT(&asyncio_dns_completed);
    hts_mutex_init(&asyncio_dns_mutex);
}

static void asyncio_courier_notify(void *opaque) {
    // Dummy write to wakeup the wait
    if (g_asyncio_running && asyncio_w_event_id != -1) {
        WSASetEvent(g_events[asyncio_w_event_id]);
    }
}

static void *asyncio_thread_fn(void *aux) {
    asyncio_thread_id = hts_thread_current();
    asyncio_courier = prop_courier_create_notify(asyncio_courier_notify, NULL);
    asyncio_dns_worker = asyncio_add_worker(adr_deliver_cb);

    g_asyncio_running = 1;

    // Register wakeup event for tasks and couriers
    WSAEVENT wakeup_event = WSACreateEvent();
    asyncio_w_event_id = g_event_count;
    g_events[g_event_count++] = wakeup_event;

    init_group(INIT_GROUP_ASYNCIO);
    asyncio_trig_network_change();

    while (g_asyncio_running) {
        if (g_event_count == 0) {
            Sleep(10);
            continue;
        }

        DWORD ret = WSAWaitForMultipleEvents(g_event_count, g_events, FALSE, 10, FALSE);

        // Process couriers and tasks if awakened
        if (ret == WSA_WAIT_EVENT_0 + asyncio_w_event_id) {
            WSAResetEvent(wakeup_event);
            prop_courier_poll(asyncio_courier);

            struct asyncio_task_queue atq;
            asyncio_task_t *at, *next;

            hts_mutex_lock(&asyncio_task_mutex);
            TAILQ_MOVE(&atq, &asyncio_tasks, at_link);
            hts_mutex_unlock(&asyncio_task_mutex);

            for(at = TAILQ_FIRST(&atq); at != NULL; at = next) {
                next = TAILQ_NEXT(at, at_link);
                at->at_fn(at->at_aux);
                free(at);
            }
        } else if (ret == WSA_WAIT_TIMEOUT) {
            // Nothing to do for network, timer pass handled below
        } else if (ret >= WSA_WAIT_EVENT_0 && ret < WSA_WAIT_EVENT_0 + g_event_count) {
            int idx = ret - WSA_WAIT_EVENT_0;
            struct asyncio_fd* af = g_fds[idx];

            WSANETWORKEVENTS networkEvents;
            WSAEnumNetworkEvents(af->fd, af->event, &networkEvents);

            int event_flags = 0;
            if (networkEvents.lNetworkEvents & FD_READ) event_flags |= ASYNCIO_READ;
            if (networkEvents.lNetworkEvents & FD_WRITE) event_flags |= ASYNCIO_WRITE;
            if (networkEvents.lNetworkEvents & FD_ACCEPT) event_flags |= ASYNCIO_READ;
            if (networkEvents.lNetworkEvents & FD_CONNECT) {
                if (networkEvents.iErrorCode[FD_CONNECT_BIT] != 0) {
                    event_flags |= ASYNCIO_ERROR;
                } else {
                    event_flags |= ASYNCIO_WRITE;
                }
            }
            if (networkEvents.lNetworkEvents & FD_CLOSE) event_flags |= ASYNCIO_ERROR;

            if (event_flags && af->cb) {
                af->cb(af, af->opaque, event_flags, 0);
            }
        }

        // Process timers
        int64_t now = async_current_time();
        asyncio_timer_t *at_timer;
        while ((at_timer = LIST_FIRST(&g_timers)) != NULL && at_timer->at_expire <= now) {
            LIST_REMOVE(at_timer, at_link);
            at_timer->at_expire = 0;
            at_timer->at_fn(at_timer->at_opaque);
        }
    }
    return NULL;
}

void asyncio_start(void) {
    hts_thread_create_detached("asyncio", asyncio_thread_fn, NULL, THREAD_PRIO_MODEL);
}

void asyncio_suspend(void) { }

void asyncio_resume(void) { }

asyncio_fd_t *asyncio_add_fd(int fd, int events, asyncio_fd_callback_t *cb, void *opaque, const char *name) {
    if (g_event_count >= MAX_WSA_EVENTS) return NULL;

    struct asyncio_fd *af = calloc(1, sizeof(struct asyncio_fd));
    if (!af) return NULL;

    af->fd = fd;
    af->cb = cb;
    af->opaque = opaque;
    af->active = 1;
    af->event = WSACreateEvent();

    htsbuf_queue_init(&af->af_sendq, 0);

    long network_events = 0;
    if (events & ASYNCIO_READ) network_events |= (FD_READ | FD_ACCEPT | FD_CLOSE);
    if (events & ASYNCIO_WRITE) network_events |= (FD_WRITE | FD_CONNECT);

    WSAEventSelect(af->fd, af->event, network_events);

    g_fds[g_event_count] = af;
    g_events[g_event_count] = af->event;
    g_event_count++;

    if (name) strncpy(af->name, name, sizeof(af->name) - 1);

    return af;
}

void asyncio_del_fd(asyncio_fd_t *af) {
    if (!af) return;

    for (int i = 0; i < g_event_count; i++) {
        if (g_fds[i] == af) {
            WSACloseEvent(af->event);
            htsbuf_queue_flush(&af->af_sendq);
            free(af);

            // Shift array
            for (int j = i; j < g_event_count - 1; j++) {
                g_fds[j] = g_fds[j + 1];
                g_events[j] = g_events[j + 1];
            }
            g_event_count--;
            break;
        }
    }
}

void asyncio_run_task(void (*fn)(void *aux), void *aux) {
    asyncio_task_t *at = malloc(sizeof(asyncio_task_t));
    at->at_fn = fn;
    at->at_aux = aux;

    hts_mutex_lock(&asyncio_task_mutex);
    int do_signal = TAILQ_EMPTY(&asyncio_tasks);
    TAILQ_INSERT_TAIL(&asyncio_tasks, at, at_link);
    hts_mutex_unlock(&asyncio_task_mutex);

    if (do_signal && g_asyncio_running && asyncio_w_event_id != -1) {
        WSASetEvent(g_events[asyncio_w_event_id]);
    }
}

int64_t async_current_time(void) {
    return GetTickCount64() * 1000; // Return microseconds
}

void asyncio_register_for_network_changes(void (*cb)(const struct netif *ni)) { }

void asyncio_trig_network_change(void) { }

int asyncio_add_worker(void (*fn)(void)) {
    asyncio_worker_t *aw = calloc(1, sizeof(asyncio_worker_t));
    aw->fn = fn;
    hts_mutex_lock(&asyncio_worker_mutex);
    workers_cnt++;
    aw->id = workers_cnt;
    LIST_INSERT_HEAD(&asyncio_workers, aw, link);
    hts_mutex_unlock(&asyncio_worker_mutex);
    return aw->id;
}

void asyncio_wakeup_worker(int id) {
    asyncio_worker_t *aw;
    hts_mutex_lock(&asyncio_worker_mutex);
    LIST_FOREACH(aw, &asyncio_workers, link) {
        if (aw->id == id) {
            // Usually enqueues to the asyncio thread queue
            asyncio_run_task((void (*)(void*))aw->fn, NULL);
            break;
        }
    }
    hts_mutex_unlock(&asyncio_worker_mutex);
}

void *asyncio_ssl_create_server(const char *privatekeyfile, const char *certfile) { return NULL; }

void *asyncio_ssl_create_client(void) { return NULL; }

void asyncio_ssl_free(void *ctx) { }

asyncio_fd_t *asyncio_listen(const char *name, int port, asyncio_accept_callback_t *cb, void *opaque, int bind_any_on_fail) {
    SOCKET s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (s == INVALID_SOCKET) return NULL;

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    if (bind(s, (struct sockaddr*)&addr, sizeof(addr)) == SOCKET_ERROR) {
        closesocket(s);
        return NULL;
    }

    if (listen(s, SOMAXCONN) == SOCKET_ERROR) {
        closesocket(s);
        return NULL;
    }

    return asyncio_add_fd(s, ASYNCIO_READ, (asyncio_fd_callback_t*)cb, opaque, name);
}

asyncio_fd_t *asyncio_attach(const char *name, int fd, asyncio_error_callback_t *error_cb, asyncio_read_callback_t *read_cb, void *opaque, void *tls) {
    if (fd == INVALID_SOCKET) return NULL;
    // Attaching an existing socket (like an accepted incoming raw TCP socket or pipe)
    u_long mode = 1; 
    ioctlsocket((SOCKET)fd, FIONBIO, &mode);
    // On attach, typically looking for READ and ERROR conditions natively, caller handles generic IO
    return asyncio_add_fd(fd, ASYNCIO_READ | ASYNCIO_WRITE | ASYNCIO_ERROR, (asyncio_fd_callback_t*)read_cb, opaque, name);
}

asyncio_fd_t *asyncio_connect(const char *name, const net_addr_t *remote_addr, asyncio_error_callback_t *connect_cb, asyncio_read_callback_t *read_cb, void *opaque, int timeout, void *tls, const char *hostname) {
    SOCKET s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (s == INVALID_SOCKET) return NULL;

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    // Note: Assuming net_addr_t maps cleanly or needs a mapping function
    addr.sin_port = htons(80); // simplified port mapping

    // Non blocking mode is implicitly set by WSAEventSelect, but connect needs it bound
    asyncio_fd_t* af = asyncio_add_fd(s, ASYNCIO_WRITE | ASYNCIO_READ | ASYNCIO_ERROR, (asyncio_fd_callback_t*)connect_cb, opaque, name);

    connect(s, (struct sockaddr*)&addr, sizeof(addr));
    return af;
}

void asyncio_send(asyncio_fd_t *af, const void *buf, size_t len, int cork) {
    if (af && af->fd != INVALID_SOCKET) {
        htsbuf_append(&af->af_sendq, buf, len);
        if (!cork) {
            const htsbuf_data_t *hd = TAILQ_FIRST(&af->af_sendq.hq_q);
            if (hd != NULL) {
                int size = hd->hd_data_len - hd->hd_data_off;
                int r = send(af->fd, (const char *)(hd->hd_data + hd->hd_data_off), size, 0);
                if (r > 0) {
                    htsbuf_drop(&af->af_sendq, r);
                }
            }
        }
    }
}

void asyncio_sendq(asyncio_fd_t *af, htsbuf_queue_t *q, int cork) {
    if (af && af->fd != INVALID_SOCKET) {
        htsbuf_appendq(&af->af_sendq, q);
        if (!cork) {
            const htsbuf_data_t *hd = TAILQ_FIRST(&af->af_sendq.hq_q);
            if (hd != NULL) {
                int size = hd->hd_data_len - hd->hd_data_off;
                int r = send(af->fd, (const char *)(hd->hd_data + hd->hd_data_off), size, 0);
                if (r > 0) {
                    htsbuf_drop(&af->af_sendq, r);
                }
            }
        }
    }
}

int asyncio_get_port(asyncio_fd_t *af) {
    if(!af) return 0;
    struct sockaddr_in addr;
    int len = sizeof(addr);
    if(getsockname(af->fd, (struct sockaddr*)&addr, &len) == 0) {
        return ntohs(addr.sin_port);
    }
    return 0;
}

void asyncio_set_timeout_delta_sec(asyncio_fd_t *af, int seconds) { }

asyncio_fd_t *asyncio_udp_bind(const char *name, const net_addr_t *na, asyncio_udp_callback_t *cb, void *opaque, int bind_any_on_fail, int broadcast) {
    SOCKET s = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (s == INVALID_SOCKET) return NULL;

    // Bind logic placeholder
    return asyncio_add_fd(s, ASYNCIO_READ, (asyncio_fd_callback_t*)cb, opaque, name);
}

void asyncio_udp_send(asyncio_fd_t *af, const void *data, int size, const net_addr_t *remote_addr) {
    if (af && af->fd != INVALID_SOCKET) {
        struct sockaddr_in dest;
        dest.sin_family = AF_INET;
        dest.sin_port = htons(remote_addr->na_port);
        memcpy(&dest.sin_addr.s_addr, remote_addr->na_addr, 4);

        sendto(af->fd, data, size, 0, (struct sockaddr*)&dest, sizeof(dest));
    }
}

int asyncio_udp_add_membership(asyncio_fd_t *af, const net_addr_t *group, const net_addr_t *iface) {
    if (!af) return -1;
#ifndef HAVE_IP_MREQ
    struct ip_mreq {
        struct in_addr imr_multiaddr;
        struct in_addr imr_interface;
    };
#endif
    struct ip_mreq mreq;
    memcpy(&mreq.imr_multiaddr.s_addr, group->na_addr, 4);
    if (iface) {
        memcpy(&mreq.imr_interface.s_addr, iface->na_addr, 4);
    } else {
        mreq.imr_interface.s_addr = INADDR_ANY;
    }

    return setsockopt(af->fd, IPPROTO_IP, IP_ADD_MEMBERSHIP, (char *)&mreq, sizeof(mreq));
}


void asyncio_timer_init(asyncio_timer_t *at, void (*fn)(void *opaque), void *opaque) {
    at->at_fn = fn;
    at->at_opaque = opaque;
    at->at_expire = 0;
}

void asyncio_timer_arm(asyncio_timer_t *at, int64_t ts) {
    if (at->at_expire) {
        LIST_REMOVE(at, at_link);
    }
    at->at_expire = ts;
    // Insert sorted
    asyncio_timer_t *cur;
    LIST_FOREACH(cur, &g_timers, at_link) {
        if (cur->at_expire > ts) {
            LIST_INSERT_BEFORE(cur, at, at_link);
            return;
        }
    }
    LIST_INSERT_HEAD(&g_timers, at, at_link);
}

void asyncio_timer_arm_delta_sec(asyncio_timer_t *at, int seconds) {
    asyncio_timer_arm(at, async_current_time() + (seconds * 1000000LL));
}

void asyncio_timer_disarm(asyncio_timer_t *at) {
    if (at->at_expire) {
        LIST_REMOVE(at, at_link);
        at->at_expire = 0;
    }
}

static void *adr_resolver(void *aux) {
    struct asyncio_dns_req *adr;
    hts_mutex_lock(&asyncio_dns_mutex);
    while((adr = TAILQ_FIRST(&asyncio_dns_pending)) != NULL) {
        TAILQ_REMOVE(&asyncio_dns_pending, adr, adr_link);
        hts_mutex_unlock(&asyncio_dns_mutex);

        if (net_resolve(adr->adr_hostname, &adr->adr_addr, &adr->adr_errmsg)) {
            adr->adr_status = ASYNCIO_DNS_STATUS_FAILED;
            adr->adr_data = adr->adr_errmsg;
        } else {
            adr->adr_status = ASYNCIO_DNS_STATUS_COMPLETED;
            adr->adr_data = &adr->adr_addr;
        }

        hts_mutex_lock(&asyncio_dns_mutex);
        TAILQ_INSERT_TAIL(&asyncio_dns_completed, adr, adr_link);
        asyncio_wakeup_worker(asyncio_dns_worker);
    }
    adr_resolver_running = 0;
    hts_mutex_unlock(&asyncio_dns_mutex);
    return NULL;
}

static void adr_deliver_cb(void) {
    struct asyncio_dns_req *adr;
    hts_mutex_lock(&asyncio_dns_mutex);
    while((adr = TAILQ_FIRST(&asyncio_dns_completed)) != NULL) {
        TAILQ_REMOVE(&asyncio_dns_completed, adr, adr_link);
        hts_mutex_unlock(&asyncio_dns_mutex);
        if(!adr->adr_cancelled)
            adr->adr_cb(adr->adr_opaque, adr->adr_status, adr->adr_data);

        free(adr->adr_hostname);
        free(adr);
        hts_mutex_lock(&asyncio_dns_mutex);
    }
    hts_mutex_unlock(&asyncio_dns_mutex);
}

asyncio_dns_req_t *asyncio_dns_lookup_host(const char *hostname, void (*cb)(void *opaque, int status, const void *data), void *opaque) {
    struct asyncio_dns_req *adr = calloc(1, sizeof(struct asyncio_dns_req));
    adr->adr_hostname = strdup(hostname);
    adr->adr_cb = cb;
    adr->adr_opaque = opaque;

    hts_mutex_lock(&asyncio_dns_mutex);
    TAILQ_INSERT_TAIL(&asyncio_dns_pending, adr, adr_link);
    if(!adr_resolver_running) {
        adr_resolver_running = 1;
        hts_thread_create_detached("DNS resolver", adr_resolver, NULL, THREAD_PRIO_BGTASK);
    }
    hts_mutex_unlock(&asyncio_dns_mutex);
    return adr;
}

void asyncio_dns_cancel(asyncio_dns_req_t *adr) {
    if(adr) adr->adr_cancelled = 1;
}
