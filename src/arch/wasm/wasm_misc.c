/*
 *  Copyright (C) 2007-2015 Lonelycoder AB
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 */
#include <malloc.h>
#include <sys/param.h>
#include <sys/time.h>
#include <sys/mman.h>

#include "main.h"
#include "arch/halloc.h"
#include "misc/callout.h"
#include "misc/md5.h"
#include "misc/str.h"
#include "misc/prng.h"
#include "prop/prop.h"

#include "arch/posix/posix.h"
#include "arch/arch.h"

const char *arch_get_system_type(void) {
  return "Wasm";
}

void arch_sync_path(const char *path) {}

size_t arch_malloc_size(void *ptr) {
  return malloc_usable_size(ptr);
}

int64_t arch_get_ts(void) {
  struct timeval tv;
  gettimeofday(&tv, NULL);
  return (int64_t)tv.tv_sec * 1000000LL + tv.tv_usec;
}

int64_t arch_get_avtime(void) {
  return arch_get_ts();
}

void *halloc(size_t size) {
  void *p = mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  if(p == MAP_FAILED) return NULL;
  return p;
}

void hfree(void *ptr, size_t size) {
  munmap(ptr, size);
}

void *mymalloc(size_t size) {
  return malloc(size);
}

void *myrealloc(void *ptr, size_t size) {
  return realloc(ptr, size);
}

void *mycalloc(size_t count, size_t size) {
  return calloc(count, size);
}

void *mymemalign(size_t align, size_t size) {
  void *p;
  return posix_memalign(&p, align, size) ? NULL : p;
}

void arch_localtime(const time_t *now, struct tm *tm) {
  localtime_r(now, tm);
}

#include "networking/net.h"
#include <ifaddrs.h>
#include <stdarg.h>

void posix_init(void) {
  gconf.cache_path = strdup("/cache");
  gconf.persistent_path = strdup("/persistent");
  snprintf(gconf.os_info, sizeof(gconf.os_info), "WebAssembly");
}

void panic(const char *fmt, ...) {
  va_list ap;
  char buf[1024];
  va_start(ap, fmt);
  vsnprintf(buf, sizeof(buf), fmt, ap);
  va_end(ap);
  fprintf(stderr, "PANIC: %s\n", buf);
  exit(1);
}

void trace_arch(int level, const char *prefix, const char *str) {
  fprintf(stderr, "%s %s\n", prefix, str);
}

int arch_pipe(int pipefd[2]) {
  return pipe(pipefd);
}

netif_t *net_get_interfaces(void) {
  struct ifaddrs *ifa_list, *ifa;
  struct netif *ni, *n;
  struct sockaddr_in *sin;

  if (getifaddrs(&ifa_list) < 0)
    return NULL;

  ni = NULL;

  for (ifa = ifa_list; ifa != NULL; ifa = ifa->ifa_next) {
    if (ifa->ifa_addr == NULL || ifa->ifa_addr->sa_family != AF_INET)
      continue;
    sin = (struct sockaddr_in *)ifa->ifa_addr;
    n = mycalloc(1, sizeof(struct netif));
    n->ni_addr.num = sin->sin_addr.s_addr;
    sin = (struct sockaddr_in *)ifa->ifa_netmask;
    n->ni_mask.num = sin->sin_addr.s_addr;
    mystrlcpy(n->ni_name, ifa->ifa_name, sizeof(n->ni_name));

    for(int i = 0; i < 6; i++) {
        n->ni_hwaddr[i] = i;
    }
    n->ni_max_packet_size = 1400;
    n->ni_next = ni;
    ni = n;
  }
  freeifaddrs(ifa_list);
  return ni;
}
