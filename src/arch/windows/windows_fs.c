#include "platform.h"
#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <errno.h>
#include <sys/stat.h>

#include "main.h"
#include "misc/minmax.h"
#include "misc/str.h"
#include "fileaccess/fileaccess.h"
#include "fileaccess/fa_proto.h"

#include <io.h>
#include <dirent.h>

typedef struct fs_handle {
    fa_handle_t h;
    int fd;
} fs_handle_t;

static fa_err_code_t
windows_url_to_path(const fa_protocol_t *fap, const char *url, int flags,
                    char *errbuf, size_t errlen, char **path)
{
    *path = strdup(url);
    return FAP_OK;
}

static int
fs_scandir(fa_protocol_t *fap, fa_dir_t *fd, const char *url,
           char *errbuf, size_t errlen, int flags)
{
    char buf[URL_MAX];
    struct stat st;
    struct dirent *d;
    DIR *dir;

    scoped_char *path = NULL;
    if(windows_url_to_path(fap, url, 0, errbuf, errlen, &path))
        return -1;

    const char *sep = url[strlen(url) - 1] == '/' ? "" : "/";

    if((dir = opendir(path)) == NULL) {
        if(errbuf) snprintf(errbuf, errlen, "%s", strerror(errno));
        return -1;
    }

    while((d = readdir(dir)) != NULL) {
        if(!strcmp(d->d_name, ".") || !strcmp(d->d_name, ".."))
            continue;

        snprintf(buf, sizeof(buf), "%s/%s", path, d->d_name);

        if(stat(buf, &st))
            continue;

        int type;
        if(S_ISDIR(st.st_mode)) type = CONTENT_DIR;
        else if(S_ISREG(st.st_mode)) type = CONTENT_FILE;
        else continue;

        snprintf(buf, sizeof(buf), "%s://%s%s%s",
                 fap->fap_name, url, sep, d->d_name);
        fa_dir_add(fd, buf, d->d_name, type);
    }
    closedir(dir);
    return 0;
}

static void
fs_close(fa_handle_t *fh0)
{
    fs_handle_t *fh = (fs_handle_t *)fh0;
    close(fh->fd);
    free(fh);
}

static fa_handle_t *
fs_open(fa_protocol_t *fap, const char *url, char *errbuf, size_t errlen,
        int flags, struct fa_open_extra *foe)
{
    fs_handle_t *fh = NULL;
    int fd;

    scoped_char *path = NULL;
    if(windows_url_to_path(fap, url, flags, errbuf, errlen, &path))
        return NULL;

    if(flags & FA_WRITE) {
        int open_flags = O_RDWR | O_CREAT | O_BINARY;
        if(!(flags & FA_APPEND))
            open_flags |= O_TRUNC;
        fd = open(path, open_flags, 0666);
        if(fd != -1 && (flags & FA_APPEND))
            lseek(fd, 0, SEEK_END);
    } else {
        fd = open(path, O_RDONLY | O_BINARY, 0);
    }

    if(fd == -1) {
        if(errbuf) snprintf(errbuf, errlen, "%s", strerror(errno));
        return NULL;
    }

    fh = calloc(1, sizeof(fs_handle_t));
    fh->fd = fd;
    fh->h.fh_proto = fap;
    return &fh->h;
}

static int
fs_read(fa_handle_t *fh0, void *buf, size_t size)
{
    fs_handle_t *fh = (fs_handle_t *)fh0;
    return read(fh->fd, buf, size);
}

static int
fs_write(fa_handle_t *fh0, const void *buf, size_t size)
{
    fs_handle_t *fh = (fs_handle_t *)fh0;
    return write(fh->fd, buf, size);
}

static int64_t
fs_seek(fa_handle_t *fh0, int64_t pos, int whence, int lazy)
{
    fs_handle_t *fh = (fs_handle_t *)fh0;
    return lseek(fh->fd, pos, whence);
}

static int64_t
fs_fsize(fa_handle_t *fh0)
{
    fs_handle_t *fh = (fs_handle_t *)fh0;
    struct stat st;
    if(fstat(fh->fd, &st) < 0)
        return -1;
    return st.st_size;
}

static int
fs_stat(fa_protocol_t *fap, const char *url, struct fa_stat *fs,
        int flags, char *errbuf, size_t errlen)
{
    struct stat st;
    scoped_char *path = NULL;

    fa_err_code_t err = windows_url_to_path(fap, url, flags, errbuf, errlen, &path);
    if(err) return err;

    if(stat(path, &st)) {
        if(errbuf) snprintf(errbuf, errlen, "%s", strerror(errno));
        return FAP_ERROR;
    }

    memset(fs, 0, sizeof(struct fa_stat));
    fs->fs_size = st.st_size;
    fs->fs_mtime = st.st_mtime;
    fs->fs_type = S_ISDIR(st.st_mode) ? CONTENT_DIR : CONTENT_FILE;
    return FAP_OK;
}

static int
fs_rmdir(const fa_protocol_t *fap, const char *url, char *errbuf, size_t errlen)
{
    scoped_char *path = NULL;
    fa_err_code_t err = windows_url_to_path(fap, url, FA_WRITE, errbuf, errlen, &path);
    if(err) return err;

    if(rmdir(path)) {
        if(errbuf) snprintf(errbuf, errlen, "%s", strerror(errno));
        return -1;
    }
    return 0;
}

static int
fs_unlink(const fa_protocol_t *fap, const char *url,
          char *errbuf, size_t errlen)
{
    scoped_char *path = NULL;
    fa_err_code_t err = windows_url_to_path(fap, url, FA_WRITE, errbuf, errlen, &path);
    if(err) return err;

    if(unlink(path)) {
        if(errbuf) snprintf(errbuf, errlen, "%s", strerror(errno));
        return -1;
    }
    return 0;
}

static fa_err_code_t
fs_makedir(struct fa_protocol *fap, const char *url)
{
    scoped_char *path = NULL;
    fa_err_code_t err = windows_url_to_path(fap, url, FA_WRITE, NULL, 0, &path);
    if(err) return err;

    if(mkdir(path)) {
        switch(errno) {
        case ENOENT:  return FAP_NOENT;
        case EPERM:   return FAP_PERMISSION_DENIED;
        case EEXIST:  return FAP_EXIST;
        default:      return FAP_ERROR;
        }
    }
    return FAP_OK;
}

static int
fs_rename(const fa_protocol_t *fap, const char *old_url, const char *new_url,
          char *errbuf, size_t errlen)
{
    scoped_char *old_path = NULL;
    scoped_char *new_path = NULL;
    
    fa_err_code_t err;
    err = windows_url_to_path(fap, old_url, FA_WRITE, errbuf, errlen, &old_path);
    if(err) return err;
    err = windows_url_to_path(fap, new_url, FA_WRITE, errbuf, errlen, &new_path);
    if(err) return err;

    if(rename(old_path, new_path)) {
        if(errbuf) snprintf(errbuf, errlen, "%s", strerror(errno));
        return -1;
    }
    return 0;
}

static fa_err_code_t
fs_fsinfo(struct fa_protocol *fap, const char *url, fa_fsinfo_t *ffi)
{
    scoped_char *path = NULL;
    fa_err_code_t err = windows_url_to_path(fap, url, 0, NULL, 0, &path);
    if(err) return err;

    ULARGE_INTEGER freeBytesAvailable, totalNumberOfBytes, totalNumberOfFreeBytes;

    if (GetDiskFreeSpaceExA(path, &freeBytesAvailable, &totalNumberOfBytes, &totalNumberOfFreeBytes)) {
        ffi->ffi_size = totalNumberOfBytes.QuadPart;
        ffi->ffi_avail = freeBytesAvailable.QuadPart;
        return FAP_OK;
    }
    return FAP_ERROR;
}

static int
fs_ftruncate(fa_handle_t *fh0, uint64_t newsize)
{
    fs_handle_t *fh = (fs_handle_t *)fh0;
    if(!chsize(fh->fd, newsize))
        return FAP_OK;
    return FAP_ERROR;
}

fa_protocol_t fa_protocol_file = {
  .fap_name = "file",
  .fap_scan = fs_scandir,
  .fap_open  = fs_open,
  .fap_close = fs_close,
  .fap_read  = fs_read,
  .fap_write = fs_write,
  .fap_seek  = fs_seek,
  .fap_fsize = fs_fsize,
  .fap_stat  = fs_stat,
  .fap_unlink= fs_unlink,
  .fap_rmdir = fs_rmdir,
  .fap_rename = fs_rename,
  .fap_makedir = fs_makedir,
  .fap_ftruncate = fs_ftruncate,
  .fap_fsinfo = fs_fsinfo,
};

FAP_REGISTER(file);