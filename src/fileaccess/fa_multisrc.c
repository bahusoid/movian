#include "main.h"
#include "fileaccess.h"
#include "fa_proto.h"
#include "misc/cancellable.h"
#include "arch/threads.h"
#include "arch/atomic.h"
static fa_protocol_t fa_protocol_multisrc;
typedef struct {
  fa_handle_t h;
  char **urls;
  int num_urls;
  fa_open_extra_t foe;
  cancellable_t *my_c;
  cancellable_t *winner_c;
  fa_handle_t *primary;
  int current_idx;
  int64_t size;
  int64_t offset;
  int flags;
} multisrc_t;
struct ms_candidate {
  char *url;
  fa_open_extra_t foe;
  cancellable_t *my_c;
  int flags;
  char errbuf[256];
  struct ms_race *race;
  int id;
};
struct ms_race {
  int num_urls;
  struct ms_candidate *candidates;
  hts_mutex_t lock;
  hts_cond_t cond;
  atomic_t refcount;
  fa_handle_t *winner;
  int winner_idx;
  int done;
};
static void *race_thread(void *opaque) {
  struct ms_candidate *cand = opaque;
  struct ms_race *race = cand->race;
  fa_handle_t *fh = fa_open_ex(cand->url, cand->errbuf, sizeof(cand->errbuf), cand->flags, &cand->foe);
  hts_mutex_lock(&race->lock);
  if (!race->done && fh != NULL) {
    race->winner = fh;
    race->winner_idx = cand->id;
    race->done = 1;
    for(int i=0; i<race->num_urls; i++) {
      if(i != cand->id) cancellable_cancel(race->candidates[i].my_c);
    }
  } else {
    if (fh) fa_close(fh);
  }
  hts_cond_broadcast(&race->cond);
  hts_mutex_unlock(&race->lock);
  if(atomic_dec(&race->refcount) == 0) {
    hts_mutex_destroy(&race->lock);
    hts_cond_destroy(&race->cond);
    for(int i=0; i<race->num_urls; i++) {
      cancellable_release(race->candidates[i].my_c);
    }
    free(race->candidates);
    free(race);
  }
  return NULL;
}
static void parent_cancel_cb(void *opaque) {
  struct ms_race *race = opaque;
  hts_mutex_lock(&race->lock);
  race->done = 1;
  for(int i = 0; i < race->num_urls; i++) {
    cancellable_cancel_locked(race->candidates[i].my_c);
  }
  hts_cond_broadcast(&race->cond);
  hts_mutex_unlock(&race->lock);
}
static void ms_cancel_cb(void *opaque) {
  multisrc_t *ms = opaque;
  cancellable_cancel_locked(ms->my_c);
  if(ms->winner_c) cancellable_cancel_locked(ms->winner_c);
}
static fa_handle_t *
ms_open(fa_protocol_t *fap, const char *url, char *errbuf, size_t errsize,
        int flags, fa_open_extra_t *foe)
{
  char *dup = strdup(url);
  char *saveptr;
  char *p = strtok_r(dup, "|", &saveptr);
  int num_urls = 0;
  char **urls = NULL;
  while(p) {
    urls = realloc(urls, (num_urls + 1) * sizeof(char*));
    urls[num_urls++] = strdup(p);
    p = strtok_r(NULL, "|", &saveptr);
  }
  free(dup);
  if (num_urls == 0) {
    if (errbuf) snprintf(errbuf, errsize, "No URLs specified for multisrc");
    return NULL;
  }
  TRACE(TRACE_DEBUG, "ms", "opening multisrc with %d urls: %s", num_urls, url);
  struct ms_race *race = calloc(1, sizeof(*race));
  hts_mutex_init(&race->lock);
  hts_cond_init(&race->cond, &race->lock);
  atomic_set(&race->refcount, num_urls + 1); // 1 for ms_open, 1 per thread
  race->num_urls = num_urls;
  race->candidates = calloc(num_urls, sizeof(struct ms_candidate));
  for(int i=0; i<num_urls; i++) {
    race->candidates[i].url = urls[i];
    if(foe) race->candidates[i].foe = *foe;
    race->candidates[i].my_c = cancellable_create();
    race->candidates[i].foe.foe_cancellable = race->candidates[i].my_c;
    race->candidates[i].flags = flags;
    race->candidates[i].race = race;
    race->candidates[i].id = i;
  }
  if(foe && foe->foe_cancellable) {
    cancellable_t *ignored = cancellable_bind(foe->foe_cancellable, parent_cancel_cb, race);
    (void)ignored;
  }
  for(int i=0; i<num_urls; i++) {
    hts_thread_create_detached("ms_race", race_thread, &race->candidates[i], THREAD_PRIO_FILESYSTEM);
  }
  hts_mutex_lock(&race->lock);
  while(race->winner == NULL && !race->done && atomic_get(&race->refcount) > 1) {
    hts_cond_wait(&race->cond, &race->lock);
  }
  fa_handle_t *primary = race->winner;
  int winner_idx = race->winner_idx;
  if (!primary && errbuf) {
    if (race->done && (!foe || !cancellable_is_cancelled(foe->foe_cancellable))) {
      snprintf(errbuf, errsize, "No sources could be opened");
    } else if (race->done) {
      snprintf(errbuf, errsize, "Cancelled by user");
    } else {
      snprintf(errbuf, errsize, "No sources could be opened");
    }
  }
  hts_mutex_unlock(&race->lock);
  if(foe && foe->foe_cancellable) {
    cancellable_unbind(foe->foe_cancellable, race);
  }
  cancellable_t *winner_c = NULL;
  if(primary) {
    TRACE(TRACE_DEBUG, "ms", "winner: %s", race->candidates[winner_idx].url);
    winner_c = cancellable_retain(race->candidates[winner_idx].my_c);
  }
  if(atomic_dec(&race->refcount) == 0) {
    hts_mutex_destroy(&race->lock);
    hts_cond_destroy(&race->cond);
    for(int i=0; i<race->num_urls; i++) {
      cancellable_release(race->candidates[i].my_c);
    }
    free(race->candidates);
    free(race);
  }
  if (!primary) {
    for(int i=0; i<num_urls; i++) free(urls[i]);
    free(urls);
    return NULL;
  }
  multisrc_t *ms = calloc(1, sizeof(multisrc_t));
  ms->h.fh_proto = &fa_protocol_multisrc;
  ms->urls = urls;
  ms->num_urls = num_urls;
  ms->primary = primary;
  ms->current_idx = winner_idx;
  if (foe) ms->foe = *foe;
  ms->my_c = cancellable_create();
  ms->winner_c = winner_c;
  ms->foe.foe_cancellable = ms->my_c;
  ms->flags = flags;
  ms->size = fa_fsize(primary);
  ms->offset = 0;
  if(foe && foe->foe_cancellable) {
    cancellable_t *ignored = cancellable_bind(foe->foe_cancellable, ms_cancel_cb, ms);
    (void)ignored;
  }
  return &ms->h;
}
static void ms_close(fa_handle_t *fh) {
  multisrc_t *ms = (multisrc_t *)fh;
  if(ms->primary) fa_close(ms->primary);
  for(int i=0; i<ms->num_urls; i++) free(ms->urls[i]);
  free(ms->urls);
  cancellable_release(ms->my_c);
  if(ms->winner_c) cancellable_release(ms->winner_c);
  free(ms);
}
static int ms_read(fa_handle_t *fh, void *buf, size_t size) {
  multisrc_t *ms = (multisrc_t *)fh;
  int attempts = 0;
  int r = -1;
  while(attempts < ms->num_urls) {
    if(!ms->primary) {
      if(ms->winner_c) {
        cancellable_release(ms->winner_c);
        ms->winner_c = NULL;
      }
      ms->current_idx = (ms->current_idx + 1) % ms->num_urls;
      ms->primary = fa_open_ex(ms->urls[ms->current_idx], NULL, 0, ms->flags, &ms->foe);
      if(ms->primary) {
        if(ms->offset > 0) {
          fa_seek4(ms->primary, ms->offset, SEEK_SET, 0);
        }
      }
    }
    if(ms->primary) {
      r = fa_read(ms->primary, buf, size);
      if (r > 0) {
        ms->offset += r;
        return r;
      }
      // If error or disconnected unexpectedly, failover to next source!
      fa_close(ms->primary);
      ms->primary = NULL;
    }
    attempts++;
    if (cancellable_is_cancelled(ms->my_c)) break;
  }
  return r;
}
static int64_t ms_seek(fa_handle_t *fh, int64_t off, int whence, int lazy) {
  multisrc_t *ms = (multisrc_t *)fh;
  if(!ms->primary) return -1;
  int64_t r = fa_seek4(ms->primary, off, whence, lazy);
  if(r >= 0) ms->offset = r;
  return r;
}
static int64_t ms_fsize(fa_handle_t *fh) {
  multisrc_t *ms = (multisrc_t *)fh;
  return ms->size;
}
static int ms_stat(fa_protocol_t *fap, const char *url, struct fa_stat *buf,
                   int flags, char *errbuf, size_t errsize)
{
  memset(buf, 0, sizeof(*buf));
  buf->fs_type = CONTENT_FILE;
  buf->fs_size = 0;
  return 0;
}
static fa_protocol_t fa_protocol_multisrc = {
  .fap_name = "multisrc",
  .fap_open = ms_open,
  .fap_close = ms_close,
  .fap_read = ms_read,
  .fap_seek = ms_seek,
  .fap_fsize = ms_fsize,
  .fap_stat = ms_stat,
};
static void __attribute__((constructor)) multisrc_init(void) {
  fileaccess_register_entry(&fa_protocol_multisrc);
}
