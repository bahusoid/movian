/*
 *  Copyright (C) 2007-2015 Lonelycoder AB
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  This program is also available under a commercial proprietary license.
 *  For more information, contact andreas@lonelycoder.com
 */
#include <unistd.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/html5.h>
#endif

#include "main.h"
#include "event.h"
#include "fileaccess/fa_proto.h"

// Note: Replaced NaCl PPAPI dependencies with WebAssembly EM_JS integrations
#include "misc/minmax.h"

LIST_HEAD(fa_dnd_list, fa_dnd);

static HTS_MUTEX_DECL(dnd_mutex);
static struct fa_dnd_list fa_dnds;
static int req_id_gen;

typedef struct fa_dnd {
  fa_handle_t fh;
  int64_t fpos;
  int64_t size;
  int fileid;
  int errcode;
  int reqid;
  hts_cond_t cond;
  LIST_ENTRY(fa_dnd) link;

  void *buf;
  int readsize;
  int resultsize;

} fa_dnd_t;


EMSCRIPTEN_KEEPALIVE void wasm_dnd_open_reply(int reqid, int errcode, double size);

EMSCRIPTEN_KEEPALIVE
void wasm_dnd_open_reply(int reqid, int errcode, double size) {
  fa_dnd_t *dnd;
  hts_mutex_lock(&dnd_mutex);
  LIST_FOREACH(dnd, &fa_dnds, link) {
    if(dnd->reqid == reqid) break;
  }
  if(dnd != NULL) {
    dnd->errcode = errcode;
    if(errcode == 0) {
      dnd->size = (int64_t)size;
    }
    hts_cond_signal(&dnd->cond);
  }
  hts_mutex_unlock(&dnd_mutex);
}


EMSCRIPTEN_KEEPALIVE void wasm_dnd_read_reply(int reqid, int errcode, int readsize);

EMSCRIPTEN_KEEPALIVE
void wasm_dnd_read_reply(int reqid, int errcode, int readsize) {
  fa_dnd_t *dnd;
  hts_mutex_lock(&dnd_mutex);
  LIST_FOREACH(dnd, &fa_dnds, link) {
    if(dnd->reqid == reqid) break;
  }
  if(dnd != NULL) {
    dnd->errcode = errcode;
    if(errcode == 0) {
      dnd->resultsize = MIN(readsize, dnd->readsize);
    }
    hts_cond_signal(&dnd->cond);
  }
  hts_mutex_unlock(&dnd_mutex);
}

EMSCRIPTEN_KEEPALIVE void wasm_openurl(const char *url);

EMSCRIPTEN_KEEPALIVE
void wasm_openurl(const char *url) {
  event_dispatch(event_create_openurl(url));
}


EM_JS(void, js_dnd_open, (const char* filename, int reqid), {
   var fname = UTF8ToString(filename);
   if (fname.startsWith("dragndrop://")) {
       fname = fname.substring(12);
   }
   if (window.droppedfile && window.droppedfile.name === fname) {
       _wasm_dnd_open_reply(reqid, 0, window.droppedfile.size);
   } else {
       _wasm_dnd_open_reply(reqid, 1, 0);
   }
});


EM_JS(void, js_dnd_read, (double fpos, int size, int reqid, void *ptr), {
   if (!window.droppedfile) {
       _wasm_dnd_read_reply(reqid, 1, 0);
       return;
   }
   var chunk = window.droppedfile.slice(fpos, fpos + size);
   var reader = new FileReader();
   reader.onload = function() {
       var arr = new Uint8Array(reader.result);
       HEAPU8.set(arr, ptr);
       _wasm_dnd_read_reply(reqid, 0, arr.length);
   };
   reader.onerror = function() {
       _wasm_dnd_read_reply(reqid, 1, 0);
   };
   reader.readAsArrayBuffer(chunk);
});

/**
 *
 */
static int
send_open(const char *filename)
{
  int id = ++req_id_gen;
  js_dnd_open(filename, id);
  return id;
}


/**
 *
 */
static int
send_read(void *buf_ptr, int64_t fpos, int size)
{
  int id = ++req_id_gen;
  js_dnd_read((double)fpos, size, id, buf_ptr);
  return id;
}



static fa_handle_t *
dnd_open(fa_protocol_t *fap, const char *url, char *errbuf, size_t errlen,
        int flags, struct fa_open_extra *foe)
{
  TRACE(TRACE_DEBUG, "DND", "Opening %s", url);

  fa_dnd_t *dnd = calloc(1, sizeof(fa_dnd_t));
  hts_cond_init(&dnd->cond, &dnd_mutex);

  hts_mutex_lock(&dnd_mutex);
  dnd->errcode = -1;
  LIST_INSERT_HEAD(&fa_dnds, dnd, link);

  dnd->reqid = send_open(url);

  while(dnd->errcode == -1)
    hts_cond_wait(&dnd->cond, &dnd_mutex);

  LIST_REMOVE(dnd, link);
  hts_mutex_unlock(&dnd_mutex);

  if(dnd->errcode) {
    snprintf(errbuf, errlen, "Failed to open file");
    hts_cond_destroy(&dnd->cond);
    free(dnd);
    return NULL;
  }

  dnd->fh.fh_proto = fap;

  return &dnd->fh;
}


/**
 *
 */
static void
dnd_close(fa_handle_t *fh)
{
  fa_dnd_t *dnd = (fa_dnd_t *)fh;
  hts_cond_destroy(&dnd->cond);
  free(fh);
}


static int
dnd_read(fa_handle_t *fh, void *buf, size_t size)
{
  fa_dnd_t *dnd = (fa_dnd_t *)fh;

  if(size < 1)
    return size;

  if(dnd->fpos + size > dnd->size)
    size = dnd->size - dnd->fpos;

  hts_mutex_lock(&dnd_mutex);
  dnd->errcode = -1;
  dnd->buf = buf;
  dnd->readsize = size;

  LIST_INSERT_HEAD(&fa_dnds, dnd, link);

  dnd->reqid = send_read(dnd->buf, dnd->fpos, size);

  while(dnd->errcode == -1)
    hts_cond_wait(&dnd->cond, &dnd_mutex);

  LIST_REMOVE(dnd, link);
  hts_mutex_unlock(&dnd_mutex);
  dnd->fpos += dnd->resultsize;
  return dnd->resultsize;
}

/**
 *
 */
static int64_t
dnd_seek(fa_handle_t *fh, int64_t pos, int whence, int lazy)
{
  fa_dnd_t *dnd = (fa_dnd_t *)fh;
  int64_t np;

  switch(whence) {
  case SEEK_SET:
    np = pos;
    break;

  case SEEK_CUR:
    np = dnd->fpos + pos;
    break;

  case SEEK_END:
    np = dnd->size + pos;
    break;

  default:
    return -1;
  }

  if(np < 0)
    return -1;

  dnd->fpos = np;
  return np;
}

/**
 *
 */
static int64_t
dnd_fsize(fa_handle_t *fh)
{
  fa_dnd_t *dnd = (fa_dnd_t *)fh;
  return dnd->size;
}


/**
 *
 */
static int
dnd_stat(fa_protocol_t *fap, const char *url, struct fa_stat *fs,
         int flags, char *errbuf, size_t errlen)
{
  // This could be handled in the generic fa layer

  fa_handle_t *fh = dnd_open(fap, url, errbuf, errlen, 0, NULL);
  if(fh == NULL)
    return -1;

  fs->fs_size = fa_fsize(fh);
  fs->fs_mtime = 0;
  fs->fs_type = CONTENT_FILE;
  fa_close(fh);
  return 0;
}


fa_protocol_t fa_protocol_dragndrop = {
  .fap_name  = "dragndrop",
  .fap_open  = dnd_open,
  .fap_close = dnd_close,
  .fap_read  = dnd_read,
  .fap_seek  = dnd_seek,
  .fap_fsize = dnd_fsize,
  .fap_stat  = dnd_stat,
};

FAP_REGISTER(dragndrop);
