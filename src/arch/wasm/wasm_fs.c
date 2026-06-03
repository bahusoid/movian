/*
 *  Copyright (C) 2007-2015 Lonelycoder AB
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 */
#include "main.h"
#include "fileaccess/fa_proto.h"

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <dirent.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif


typedef struct fa_posix {
  fa_handle_t fh;
  int fd;
} fa_posix_t;

static void build_path(char *dst, size_t dstlen, const fa_protocol_t *fap, const char *url) {
  if(!strcmp(fap->fap_name, "file")) {
    if(url[0] == '/')
      snprintf(dst, dstlen, "%s", url);
    else
      snprintf(dst, dstlen, "/%s", url);
    return;
  }

  snprintf(dst, dstlen, "/%s/%s", fap->fap_name, url);
}

static void build_url(char *dst, size_t dstlen, const fa_protocol_t *fap, const char *url, const char *name) {
  if(!strcmp(fap->fap_name, "file")) {
    size_t len = strlen(url);
    if(len == 0 || !strcmp(url, "/")) {
      snprintf(dst, dstlen, "file:///%s", name);
    } else if(url[len - 1] == '/') {
      snprintf(dst, dstlen, "file://%s%s", url, name);
    } else {
      snprintf(dst, dstlen, "file://%s/%s", url, name);
    }
    return;
  }

  snprintf(dst, dstlen, "%s://%s/%s", fap->fap_name, url, name);
}

static int fs_scandir(fa_protocol_t *fap, fa_dir_t *fd, const char *url, char *errbuf, size_t errlen, int flags) {
  char path[1024];
  build_path(path, sizeof(path), fap, url);
  DIR *d = opendir(path);
  if(!d) {
    if(errbuf) snprintf(errbuf, errlen, "Unable to open directory");
    return -1;
  }
  struct dirent *de;
  while((de = readdir(d)) != NULL) {
    if(!strcmp(de->d_name, ".") || !strcmp(de->d_name, "..")) continue;
    char fullurl[2048];
    build_url(fullurl, sizeof(fullurl), fap, url, de->d_name);
    int type = CONTENT_FILE;
    if(de->d_type == DT_DIR) type = CONTENT_DIR;
    fa_dir_add(fd, fullurl, de->d_name, type);
  }
  closedir(d);
  return 0;
}

static fa_handle_t *fs_open(fa_protocol_t *fap, const char *url, char *errbuf, size_t errlen, int flags, struct fa_open_extra *foe) {
  char path[1024];
  build_path(path, sizeof(path), fap, url);
  int p = O_RDONLY;
  if(flags & FA_WRITE) {
    p = O_RDWR | O_CREAT;
    if(!(flags & FA_APPEND)) p |= O_TRUNC;
  }
  int fd = open(path, p, 0666);
  if(fd < 0) {
    if(errbuf) snprintf(errbuf, errlen, "Failed to open file: %s", strerror(errno));
    return NULL;
  }
  fa_posix_t *fp = calloc(1, sizeof(fa_posix_t));
  fp->fh.fh_proto = fap;
  fp->fd = fd;
  if(flags & FA_APPEND) lseek(fd, 0, SEEK_END);
  return &fp->fh;
}

static void fs_close(fa_handle_t *fh) {
  fa_posix_t *fp = (fa_posix_t *)fh;
  close(fp->fd);
  free(fp);
}

static int fs_read(fa_handle_t *fh, void *buf, size_t size) {
  fa_posix_t *fp = (fa_posix_t *)fh;
  return read(fp->fd, buf, size);
}

static int fs_write(fa_handle_t *fh, const void *buf, size_t size) {
  fa_posix_t *fp = (fa_posix_t *)fh;
  return write(fp->fd, buf, size);
}

static int64_t fs_seek(fa_handle_t *fh, int64_t pos, int whence, int lazy) {
  fa_posix_t *fp = (fa_posix_t *)fh;
  return lseek(fp->fd, pos, whence);
}

static int64_t fs_fsize(fa_handle_t *fh) {
  fa_posix_t *fp = (fa_posix_t *)fh;
  struct stat st;
  if(fstat(fp->fd, &st) < 0) return -1;
  return st.st_size;
}

static int fs_stat(fa_protocol_t *fap, const char *url, struct fa_stat *fs, int flags, char *errbuf, size_t errlen) {
  char path[1024];
  build_path(path, sizeof(path), fap, url);
  struct stat st;
  if(stat(path, &st) < 0) {
    if(errbuf) snprintf(errbuf, errlen, "Stat failed: %s", strerror(errno));
    return -1;
  }
  fs->fs_size = st.st_size;
  fs->fs_mtime = st.st_mtime;
  fs->fs_type = S_ISDIR(st.st_mode) ? CONTENT_DIR : CONTENT_FILE;
  return 0;
}

static int fs_unlink(const fa_protocol_t *fap, const char *url, char *errbuf, size_t errlen) {
  char path[1024];
  build_path(path, sizeof(path), fap, url);
  if(remove(path) < 0) {
     if(errbuf) snprintf(errbuf, errlen, "Remove failed");
     return -1;
  }
  return 0;
}

static int fs_rename(const fa_protocol_t *fap, const char *old, const char *new, char *errbuf, size_t errlen) {
  char op[1024], np[1024];
  build_path(op, sizeof(op), fap, old);
  build_path(np, sizeof(np), fap, new);
  if(rename(op, np) < 0) return -1;
  return 0;
}

static int fs_ftruncate(fa_handle_t *fh, uint64_t newsize) {
  fa_posix_t *fp = (fa_posix_t *)fh;
  return ftruncate(fp->fd, newsize);
}

static fa_err_code_t fs_mkdir(fa_protocol_t *fap, const char *url) {
  char path[1024];
  build_path(path, sizeof(path), fap, url);
  if(mkdir(path, 0777) < 0) {
    switch(errno) {
    case ENOENT:  return FAP_NOENT;
    case EPERM:   return FAP_PERMISSION_DENIED;
    case EEXIST:  return FAP_EXIST;
    default:      return FAP_ERROR;
    }
  }
  return 0;
}

static fa_err_code_t fs_fsinfo(struct fa_protocol *fap, const char *url, fa_fsinfo_t *ffi) {
  ffi->ffi_size = 100LL * 1024 * 1024 * 1024;
  ffi->ffi_avail = 100LL * 1024 * 1024 * 1024;
  return 0;
}

fa_protocol_t fa_protocol_cache = {
  .fap_name  = "cache",
  .fap_scan  = fs_scandir,
  .fap_open  = fs_open,
  .fap_close = fs_close,
  .fap_read  = fs_read,
  .fap_write = fs_write,
  .fap_seek  = fs_seek,
  .fap_fsize = fs_fsize,
  .fap_stat  = fs_stat,
  .fap_unlink= fs_unlink,
  .fap_rmdir = fs_unlink,
  .fap_rename = fs_rename,
  .fap_ftruncate = fs_ftruncate,
  .fap_makedir = fs_mkdir,
  .fap_fsinfo = fs_fsinfo,
};
FAP_REGISTER(cache);

fa_protocol_t fa_protocol_persistent = {
  .fap_name  = "persistent",
  .fap_scan  = fs_scandir,
  .fap_open  = fs_open,
  .fap_close = fs_close,
  .fap_read  = fs_read,
  .fap_write = fs_write,
  .fap_seek  = fs_seek,
  .fap_fsize = fs_fsize,
  .fap_stat  = fs_stat,
  .fap_unlink= fs_unlink,
  .fap_rmdir = fs_unlink,
  .fap_rename = fs_rename,
  .fap_ftruncate = fs_ftruncate,
  .fap_makedir = fs_mkdir,
  .fap_fsinfo = fs_fsinfo,
};
FAP_REGISTER(persistent);

fa_protocol_t fa_protocol_file = {
  .fap_name  = "file",
  .fap_scan  = fs_scandir,
  .fap_open  = fs_open,
  .fap_close = fs_close,
  .fap_read  = fs_read,
  .fap_write = fs_write,
  .fap_seek  = fs_seek,
  .fap_fsize = fs_fsize,
  .fap_stat  = fs_stat,
  .fap_unlink= fs_unlink,
  .fap_rmdir = fs_unlink,
  .fap_rename = fs_rename,
  .fap_ftruncate = fs_ftruncate,
  .fap_makedir = fs_mkdir,
  .fap_fsinfo = fs_fsinfo,
};
FAP_REGISTER(file);

