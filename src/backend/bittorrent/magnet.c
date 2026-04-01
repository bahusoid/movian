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
#include <string.h>
#include <unistd.h>

#include "main.h"
#include "navigator.h"
#include "backend/backend.h"
#include "misc/sha.h"
#include "misc/str.h"
#include "networking/http.h"
#include "htsmsg/htsmsg.h"
#include "fileaccess/http_client.h"

#include "bittorrent.h"
#include "bencode.h"

// http://www.bittorrent.org/beps/bep_0009.html

#define TRACKER_LIST_URL_NEWTRACKON  "https://newtrackon.com/api/stable"
#define TRACKER_LIST_URL_NGOSANG     "https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt"
#define TRACKER_CACHE_TTL  (24 * 3600LL)   /* seconds */

/* Hardcoded fallback used when the online fetch fails */
static const char *fallback_trackers[] = {
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://open.tracker.cl:1337/announce",
  "udp://tracker.openbittorrent.com:6969/announce",
  "udp://tracker.torrent.eu.org:451/announce",
  "udp://open.stealth.si:80/announce",
  "udp://tracker.tiny-vps.com:6969/announce",
  "udp://tracker.pomf.se:80/announce",
  "udp://explodie.org:6969/announce",
  "udp://tracker.dler.org:6969/announce",
  "udp://tracker.internetwarriors.net:1337/announce",
  "udp://ipv4.tracker.harry.lu:80/announce",
  "udp://retracker.lanta-net.ru:2710/announce",
  NULL
};

/*
 * Dynamically fetched tracker list (updated every TRACKER_CACHE_TTL seconds).
 * Access only WITHOUT bittorrent_mutex (updated from outside the lock).
 */
static char   **g_fetched_trackers;    /* NULL-terminated array of strdup'd URLs */
static int64_t  g_trackers_fetch_time; /* arch_get_ts() / 1e6, seconds */

/**
 * Parse the newtrackon response (URLs separated by \n or \n\n) into a
 * NULL-terminated array of freshly allocated strings.
 */
static char **
parse_tracker_list(const char *body)
{
  int cap = 32, n = 0;
  char **arr = malloc(cap * sizeof(char *));
  if(!arr)
    return NULL;

  const char *p = body;
  while(*p) {
    /* skip blank lines / whitespace */
    while(*p == '\r' || *p == '\n' || *p == ' ')
      p++;
    if(!*p)
      break;
    const char *end = p;
    while(*end && *end != '\r' && *end != '\n')
      end++;
    if(end > p) {
      if(n + 1 >= cap) {
        cap *= 2;
        arr = realloc(arr, cap * sizeof(char *));
        if(!arr)
          return NULL;
      }
      arr[n++] = strndup(p, end - p);
    }
    p = end;
  }
  arr[n] = NULL;
  return arr;
}

static void
free_tracker_list(char **list)
{
  if(!list)
    return;
  for(int i = 0; list[i]; i++)
    free(list[i]);
  free(list);
}

/**
 * Try fetching a tracker list from the given URL.
 * Returns a parsed NULL-terminated list, or NULL on failure.
 * Called WITHOUT bittorrent_mutex held.
 */
static char **
fetch_tracker_list_from(const char *url)
{
  buf_t *b = NULL;
  char errbuf[256];

  int r = http_req(url,
                   HTTP_RESULT_PTR(&b),
                   HTTP_ERRBUF(errbuf, sizeof(errbuf)),
                   HTTP_CONNECT_TIMEOUT(10000),
                   HTTP_READ_TIMEOUT(15000),
                   NULL);

  if(r || b == NULL) {
    TRACE(TRACE_INFO, "MAGNET",
          "Failed to fetch tracker list from %s: %s", url, errbuf);
    return NULL;
  }

  char **list = parse_tracker_list(buf_cstr(b));
  buf_release(b);

  if(list == NULL || list[0] == NULL) {
    TRACE(TRACE_INFO, "MAGNET", "Empty tracker list from %s", url);
    free_tracker_list(list);
    return NULL;
  }

  int count = 0;
  for(int i = 0; list[i]; i++)
    count++;

  TRACE(TRACE_INFO, "MAGNET", "Fetched %d public trackers from %s",
        count, url);
  return list;
}

/**
 * Refresh the cached public tracker list.
 * Tries newtrackon first, then ngosang as fallback.
 * Called WITHOUT bittorrent_mutex held.
 */
static void
magnet_refresh_public_trackers(void)
{
  char **list = fetch_tracker_list_from(TRACKER_LIST_URL_NEWTRACKON);

  if(list == NULL)
    list = fetch_tracker_list_from(TRACKER_LIST_URL_NGOSANG);

  if(list == NULL) {
    TRACE(TRACE_INFO, "MAGNET",
          "All tracker sources failed, will use hardcoded fallback");
    return;
  }

  free_tracker_list(g_fetched_trackers);
  g_fetched_trackers = list;
  g_trackers_fetch_time = arch_get_ts() / 1000000LL;
}


static void
magnet_trace(const torrent_t *t, const char *msg, ...)
  attribute_printf(2, 3);

static void
magnet_trace(const torrent_t *t, const char *msg, ...)
{
  if(!gconf.enable_torrent_debug)
    return;

  va_list ap;
  char buf[256];
  va_start(ap, msg);
  vsnprintf(buf, sizeof(buf), msg, ap);
  va_end(ap);

  TRACE(TRACE_DEBUG, "MAGNET", "%s: %s", t->to_title, buf);
}


static int
base32decode(uint8_t *dst, const char *in)
{
  int bits = 11;
  uint16_t x = 0;
  int written = 0;
  while(*in) {
    char c = *in++;
    uint16_t v;
    if(c >= 'A' && c <= 'Z')
      v = c - 'A';
    else if(c >= 'a' && c <= 'z')
      v = c - 'a';
    else if(c >= '2' && c <= '7')
      v = 26 + c - '2';
    else
      return -1;

    x |= (v << bits);
    if(bits <= 8) {
      *dst++ = (x >> 8);
      if(++written == 20)
        return 0;
      x <<= 8;
      bits += 3;
    } else {
      bits -= 5;
    }
  }
  return -1;
}

/**
 *
 */
static torrent_t *
magnet_parse(struct http_header_list *list, char *errbuf, size_t errlen)
{
  const char *dn = http_header_get(list, "dn");

  const char *xt = http_header_get(list, "xt");
  if(xt == NULL) {
    snprintf(errbuf, errlen, "No 'xt' in magnet link");
    return NULL;
  }

  const char *hash = mystrbegins(xt, "urn:btih:");
  if(hash == NULL) {
    snprintf(errbuf, errlen, "Unknown hash scheme: %s", xt);
    return NULL;
  }

  uint8_t infohash[20];

  if(hex2bin(infohash, sizeof(infohash), hash) != sizeof(infohash)) {
    // Try base32
    if(base32decode(infohash, hash)) {
      snprintf(errbuf, errlen, "Invalid hash: %s", hash);
      return NULL;
    }
  }

  http_header_t *hh;
  int num_trackers = 0;
  LIST_FOREACH(hh, list, hh_link) {
    if(!strcmp(hh->hh_key, "tr")) {
      num_trackers++;
    }
  }

  if(num_trackers == 0) {
    TRACE(TRACE_DEBUG, "MAGNET",
          "No trackers in magnet link, will inject public fallbacks");
  }

  TRACE(TRACE_DEBUG, "MAGNET", "Opening magnet for hash %s -- %s",
	hash, dn ?: "<unknown name>");

  torrent_t *to = torrent_create_from_hash(infohash, "magnet");


  LIST_FOREACH(hh, list, hh_link) {
    if(!strcmp(hh->hh_key, "tr")) {
      tracker_t *tr = tracker_create(hh->hh_value);
      if(tr != NULL)
        tracker_add_torrent(tr, to);
    }
  }

  if(num_trackers == 0) {
    /* Use dynamically fetched list; fall back to hardcoded if unavailable */
    char **dynamic = g_fetched_trackers;
    if(dynamic != NULL && dynamic[0] != NULL) {
      int count = 0;
      for(int i = 0; dynamic[i]; i++) {
        tracker_t *tr = tracker_create(dynamic[i]);
        if(tr != NULL) {
          tracker_add_torrent(tr, to);
          count++;
        }
      }
      TRACE(TRACE_DEBUG, "MAGNET",
            "Injected %d public trackers (from newtrackon)", count);
    } else {
      int count = 0;
      for(int i = 0; fallback_trackers[i] != NULL; i++) {
        tracker_t *tr = tracker_create(fallback_trackers[i]);
        if(tr != NULL) {
          tracker_add_torrent(tr, to);
          count++;
        }
      }
      TRACE(TRACE_DEBUG, "MAGNET",
            "Injected %d public trackers (hardcoded fallback)", count);
    }
  }

  return to;
}



static void
magnet_destroy_metainfo_requests(struct metainfo_request_list *list)
{
  metainfo_request_t *mr;
  while((mr = LIST_FIRST(list)) != NULL) {
    LIST_REMOVE(mr, mr_peer_link);
    LIST_REMOVE(mr, mr_query_link);
    free(mr->mr_data);
    free(mr);
  }
}


/**
 *
 */
static buf_t *
metainfo_load(torrent_t *to, char *errbuf, size_t errlen)
{
  hts_mutex_assert(&bittorrent_mutex);

  // Compute final deadline for getting metadata
  int64_t deadline = arch_get_ts() + 120 * 1000000LL;

  while(1) {

    buf_t *r = NULL;
    int num_pieces = 1; // Until we know better
    int metainfo_size = 0;

    for(int piece = 0; piece < num_pieces; piece++) {

      int max_active_requests = 1;
      int64_t piece_start = arch_get_ts();
      metainfo_request_t *mr;
      peer_t *p;
      struct metainfo_request_list requests;
      LIST_INIT(&requests);

      while(1) {

        // First check if we have a satisfied request

        mr = NULL;
        LIST_FOREACH(p, &to->to_running_peers, p_running_link) {
          LIST_FOREACH(mr, &p->p_metainfo_requests, mr_peer_link) {
            if(mr->mr_piece == piece && mr->mr_state >= MR_RECEIVED)
              break;
          }
          if(mr != NULL)
            break;
        }

        if(mr != NULL) {

          p = mr->mr_peer;

          if(mr->mr_state == MR_RECEIVED) {

            // Move peer that responded first to front
            LIST_REMOVE(p, p_running_link);
            LIST_INSERT_HEAD(&to->to_running_peers, p, p_running_link);

            LIST_REMOVE(mr, mr_peer_link);
            LIST_REMOVE(mr, mr_query_link);
            magnet_destroy_metainfo_requests(&requests);
            break;

          } else {

            assert(mr->mr_state == MR_REJECTED);
            // Peer rejected our request, mark it as unable to send metadata
            p->p_ext_ut_metadata = 0;

            LIST_REMOVE(mr, mr_peer_link);
            LIST_REMOVE(mr, mr_query_link);
            free(mr);
          }
        }


        int active_requests = 0;
        LIST_FOREACH(mr, &requests, mr_query_link)
          active_requests++;

        LIST_FOREACH(p, &to->to_running_peers, p_running_link) {
          if(active_requests >= max_active_requests)
            break;
          if(!p->p_ext_ut_metadata)
            continue;
          LIST_FOREACH(mr, &p->p_metainfo_requests, mr_peer_link) {
            if(mr->mr_piece == piece)
              break;
          }
          if(mr != NULL)
            continue;

          mr = calloc(1, sizeof(metainfo_request_t));
          mr->mr_state = MR_PENDING_SEND;
          mr->mr_peer = p;
          mr->mr_piece = piece;
          LIST_INSERT_HEAD(&p->p_metainfo_requests, mr, mr_peer_link);
          LIST_INSERT_HEAD(&requests, mr, mr_query_link);
          active_requests++;
        }
        torrent_wakeup_for_metadata_requests();

        hts_cond_wait_timeout(&torrent_metainfo_available_cond,
                              &bittorrent_mutex, 1000);


        int64_t now = arch_get_ts();

        if(now > deadline) {
          buf_release(r);
          magnet_destroy_metainfo_requests(&requests);
          snprintf(errbuf, errlen, "Timeout waiting for metadata piece %d/%d",
                   piece, num_pieces);
          return NULL;
        }

        int64_t elapsed = now - piece_start;

        max_active_requests = elapsed / 1000000LL;
        if(max_active_requests > 5)
          max_active_requests = 5;
      }

      magnet_trace(to, "Got metadata piece %d/%d (%d bytes) from peer %s",
                   piece, num_pieces, mr->mr_size, mr->mr_peer->p_name);


      if(piece == 0) {
        metainfo_size = mr->mr_total_size;

        magnet_trace(to, "Got first piece claiming total size %d",
                     metainfo_size);

        if(r != NULL)
          buf_release(r);

        r = buf_create(metainfo_size);
        num_pieces = (metainfo_size + 16383) / 16384;
      }

      int bad_size;

      if(piece == num_pieces - 1) {
        bad_size = mr->mr_size != (metainfo_size & 16383);
      } else {
        bad_size = mr->mr_size != 16384;
      }

      if(bad_size) {
        magnet_trace(to, "Got bad metadata piece size (%d/%d) is %d bytes",
                     piece, num_pieces, mr->mr_size);
        free(mr->mr_data);
        free(mr);
        buf_release(r);
        r = NULL;
        break;
      }

      memcpy(buf_str(r) + piece * 16384, mr->mr_data, mr->mr_size);

      free(mr->mr_data);
      free(mr);
    }

    if(r == NULL)
      continue;

    uint8_t digest[20];
    sha1_decl(shactx);
    sha1_init(shactx);
    sha1_update(shactx, buf_data(r), buf_size(r));
    sha1_final(shactx, digest);

    if(!memcmp(digest, to->to_info_hash, 20)) {
      magnet_trace(to, "Downloaded metainfo hash verified OK");
      return r;
    }

    magnet_trace(to, "Downloaded metainfo hash failed, retrying");
    buf_release(r);
  }
}



/**
 * This function creates a so called 'torrentdoc' (basically what's
 * bencoded into a .torrent file). That's currently just the list
 * of trackers + metadata info dict
 */
static htsmsg_t *
create_torrent_doc(torrent_t *to, htsmsg_t *info)
{
  tracker_torrent_t *tt;
  htsmsg_t *torrentdoc = htsmsg_create_map();

  htsmsg_t *al = htsmsg_create_list();
  htsmsg_t *al2 = htsmsg_create_list();

  LIST_FOREACH(tt, &to->to_trackers, tt_torrent_link)
    htsmsg_add_str(al2, NULL, tt->tt_tracker->t_url);

  htsmsg_add_msg(al, NULL, al2);
  htsmsg_add_msg(torrentdoc, "announce-list", al);
  htsmsg_add_msg(torrentdoc, "info", info);

  return torrentdoc;
}


/**
 *
 */
torrent_t *
magnet_open(const char *url0, char *errbuf, size_t errlen)
{
  if(*url0 == '?')
    url0++;

  /* Refresh public tracker list if stale (called without bittorrent_mutex) */
  int64_t now_sec = arch_get_ts() / 1000000LL;
  if(g_fetched_trackers == NULL ||
     now_sec - g_trackers_fetch_time > TRACKER_CACHE_TTL) {
    hts_mutex_unlock(&bittorrent_mutex);
    magnet_refresh_public_trackers();
    hts_mutex_lock(&bittorrent_mutex);
  }

  char *url = mystrdupa(url0);

  struct http_header_list list = {};

  http_parse_uri_args(&list, url, 1);

  torrent_t *to = magnet_parse(&list, errbuf, errlen);
  http_headers_free(&list);
  if(to == NULL)
    return NULL;

  if(to->to_metainfo != NULL)
    return to;

  torrent_retain(to);

  while(to->to_loading_metadata)
    hts_cond_wait(&torrent_metainfo_available_cond, &bittorrent_mutex);

  if(to->to_metainfo != NULL) {
    torrent_release(to);
    return to;
  }

  to->to_loading_metadata = 1;

  buf_t *b = metainfo_load(to, errbuf, errlen);

  torrent_release(to);

  to->to_loading_metadata = 0;
  hts_cond_broadcast(&torrent_metainfo_available_cond);

  if(b == NULL)
    return NULL;

  htsmsg_t *doc = bencode_deserialize(buf_cstr(b), buf_cstr(b) + buf_size(b),
                                      errbuf, errlen, NULL, NULL, NULL);
  buf_release(b);

  if(torrent_parse_infodict(to, doc, errbuf, errlen)) {
    htsmsg_release(doc);
    return NULL;
  }

  htsmsg_t *torrentdoc = create_torrent_doc(to, doc); // Gets ownership of 'doc'

  to->to_metainfo = bencode_serialize(torrentdoc);
  htsmsg_release(torrentdoc);

  torrent_diskio_open(to);
  peer_activate_pending_data(to);
  return to;
}
