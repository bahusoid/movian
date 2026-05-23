#include "main.h"
#include "fileaccess.h"
#include "fa_proto.h"
#include "misc/cancellable.h"
#include "arch/threads.h"
#include "arch/atomic.h"
static fa_protocol_t fa_protocol_multisrc;
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
  int done;
};
static void *race_thread(void *opaque) {
  struct ms_candidate *cand = opaque;
  struct ms_race *race = cand->race;
  fa_handle_t *fh = fa_open_ex(cand->url, cand->errbuf, sizeof(cand->errbuf), cand->flags, &cand->foe);
  hts_mutex_lock(&race->lock);
  if (!race->done && fh != NULL) {
    race->winner = fh;
    race->done = 1;
    // Cancel others
    for(int i=0; i<race->num_urls; i++) {
      if(i != cand->id) cancellable_cancel(race->candidates[i].my_c);
    }
  } else {
    // If we have a winner already or we are cancelled, close the file we just opened
    if (fh) fa_close(fh);
  }
  hts_cond_broadcast(&race->cond);
  hts_mutex_unlock(&race->lock);
  if(atomic_dec(&race->refcount) == 0) {
    hts_mutex_destroy(&race->lock);
    hts_cond_destroy(&race->cond);
    for(int i=0; i<race->num_urls; i++) {
      cancellable_release(race->candidates[i].my_c);
      free(race->candidates[i].url);
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
    cancellable_cancel(race->candidates[i].my_c);
  }
  hts_cond_broadcast(&race->cond);
  hts_mutex_unlock(&race->lock);
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
  free(urls);
  if(foe && foe->foe_cancellable) {
    cancellable_t *ignored = cancellable_bind(foe->foe_cancellable, parent_cancel_cb, race);
    (void)ignored;
  }
  for(int i=0; i<num_urls; i++) {
    hts_thread_create_detached("ms_race", race_thread, &race->candidates[i], THREAD_PRIO_FILESYSTEM);
  }
  hts_mutex_lock(&race->lock);
  // Wait until we have a winner, OR we are done (cancelled), OR all threads finished (refcount == 1)
  while(race->winner == NULL && !race->done && atomic_get(&race->refcount) > 1) {
    hts_cond_wait(&race->cond, &race->lock);
  }
  fa_handle_t *primary = race->winner;
  // If we couldn't open any and not cancelled by user
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
  if(atomic_dec(&race->refcount) == 0) {
    hts_mutex_destroy(&race->lock);
    hts_cond_destroy(&race->cond);
    for(int i=0; i<race->num_urls; i++) {
      cancellable_release(race->candidates[i].my_c);
      free(race->candidates[i].url);
    }
    free(race->candidates);
    free(race);
  }
  return primary;
}
static int ms_stat(fa_protocol_t *fap, const char *url, struct fa_stat *buf,
                   int flags, char *errbuf, size_t errsize)
{
  int r = -1;
  char *dup = strdup(url);
  char *saveptr;
  char *p = strtok_r(dup, "|", &saveptr);
  if(p) {
    r = fa_stat_ex(p, buf, errbuf, errsize, flags);
  }
  free(dup);
  return r;
}
static fa_protocol_t fa_protocol_multisrc = {
  .fap_name = "multisrc",
  .fap_open = ms_open,
  .fap_stat = ms_stat,
};
static void __attribute__((constructor)) multisrc_init(void) {
  fileaccess_register_entry(&fa_protocol_multisrc);
}
