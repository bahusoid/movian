(function(plugin) {

  var PREFIX = 'history:';
  var STORE_KEY = 'entries';
  var MAX_ENTRIES = 100;

  var P = require('movian/prop');
  var videoscrobbler = require('movian/videoscrobbler');

  var store = plugin.createStore('history_store');

  var lastPageUrl = null;
  var lastPageTitle = null;
  var lastBrowsablePageUrl = null;
  var lastBrowsablePageTitle = null;
  var currentPageUrl = null;
  var currentPageTitle = null;

  var pendingFocus = null;

  function safeString(v, fallback) {
    if (v === null || v === undefined) {
      return fallback !== undefined ? fallback : null;
    }
    try {
      if (typeof v === 'object' && typeof v.valueOf === 'function') {
        v = v.valueOf();
      }
    } catch (e) {
    }
    v = String(v);
    return v !== '' ? v : (fallback !== undefined ? fallback : null);
  }

  function isPlayerUrl(url) {
    if (!url) return false;
    return url.indexOf('videoparams:') === 0 ||
           url.indexOf(':play:') !== -1 ||
           url.indexOf(':play/') !== -1;
  }

  function isDirectMediaUrl(url) {
    if (!url) return false;

    // Common direct stream/file suffixes that should be treated as items, not pages.
    return /\.(mkv|mp4|avi|mov|wmv|m4v|flv|ts|m2ts|webm|mp3|flac|aac|m4a|wav|ogg|opus|m3u8|mpd)(\?|#|$)/i.test(url);
  }

  function isBrowsablePageUrl(url) {
    if (!url) return false;
    if (url.indexOf(PREFIX) === 0) return false;
    return !isPlayerUrl(url) && !isDirectMediaUrl(url);
  }

  function parseVideoParams(url) {
    if (!url || url.indexOf('videoparams:') !== 0) {
      return null;
    }
    try {
      return JSON.parse(url.substring(12));
    } catch (e) {
      return null;
    }
  }

  function canonicalFromUrl(url) {
    var vp = parseVideoParams(url);
    if (vp && vp.canonicalUrl) {
      return safeString(vp.canonicalUrl, null);
    }
    return safeString(url, null);
  }

  function readEntries() {
    var raw = store[STORE_KEY];
    if (!raw) return [];

    try {
      var parsed = JSON.parse(raw);
      return parsed instanceof Array ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(entries) {
    store[STORE_KEY] = JSON.stringify(entries);
  }

  function makeKey(entry) {
    var left = entry.itemCanonical || entry.itemUrl || '';
    var right = entry.pageUrl || '';
    return left + '|' + right;
  }

  function saveEntry(entry) {
    if (!entry || !entry.pageUrl || (!entry.itemCanonical && !entry.itemUrl)) {
      return;
    }

    var list = readEntries();
    var key = makeKey(entry);

    for (var i = 0; i < list.length; i++) {
      if (makeKey(list[i]) === key) {
        list.splice(i, 1);
        break;
      }
    }

    list.unshift(entry);

    if (list.length > MAX_ENTRIES) {
      list = list.slice(0, MAX_ENTRIES);
    }

    saveEntries(list);
  }

  function titleForEntry(entry) {
    var item = entry.itemTitle || 'Unknown item';
    var page = entry.pageTitle || entry.pageUrl || 'Unknown page';
    return item + '|' + page;
  }

  function clearPendingFocus(reason) {
    pendingFocus = null;
  }

  function armPendingFocus(entry) {
    pendingFocus = {
      pageUrl: entry.pageUrl,
      itemCanonical: entry.itemCanonical || null,
      itemUrl: entry.itemUrl || null,
      expiresAt: Date.now() + 10000
    };
  }

  function isPendingActiveForPage(url) {
    if (!pendingFocus) return false;
    if (Date.now() > pendingFocus.expiresAt) {
      clearPendingFocus('timeout');
      return false;
    }
    return safeString(url, '') === safeString(pendingFocus.pageUrl, '');
  }

  function nodeMatchesPending(node) {
    if (!pendingFocus || !node) return false;

    var nodeUrl = safeString(node.url, null);
    var nodeCanonical = canonicalFromUrl(nodeUrl);

    if (pendingFocus.itemCanonical && nodeCanonical &&
        pendingFocus.itemCanonical === nodeCanonical) {
      return true;
    }

    if (pendingFocus.itemUrl && nodeUrl && pendingFocus.itemUrl === nodeUrl) {
      return true;
    }

    return false;
  }

  function tryFocusNode(node) {
    if (!node || !pendingFocus) return false;
    if (!nodeMatchesPending(node)) return false;

    try {
      P.select(node);
      clearPendingFocus('matched');
      return true;
    } catch (e) {
      return false;
    }
  }

  function tryFocusFromCurrentNodes() {
    if (!pendingFocus) return false;

    var nodes;
    try {
      nodes = P.global.navigators.current.currentpage.model.nodes;
    } catch (e) {
      return false;
    }

    try {
      var keys = P.enumerate(nodes);
      for (var i = 0; i < keys.length; i++) {
        var n = nodes[keys[i]];
        if (tryFocusNode(n)) {
          return true;
        }
      }
    } catch (e2) {
    }

    return false;
  }

  P.subscribeValue(P.global.navigators.current.currentpage.url, function(v) {
    var url = safeString(v, null);
    currentPageUrl = url;

    if (isBrowsablePageUrl(url)) {
      lastPageUrl = url;
      lastBrowsablePageUrl = url;
      if (currentPageTitle) {
        lastPageTitle = currentPageTitle;
        lastBrowsablePageTitle = currentPageTitle;
      }
    }

    if (isPendingActiveForPage(url)) {
      tryFocusFromCurrentNodes();
    }
  });

  P.subscribeValue(P.global.navigators.current.currentpage.model.metadata.title, function(v) {
    var title = safeString(v, null);
    currentPageTitle = title;

    if (isBrowsablePageUrl(currentPageUrl) && title) {
      lastPageTitle = title;
      lastBrowsablePageTitle = title;
    }
  });

  P.subscribe(P.global.navigators.current.currentpage.model.nodes, function(type, v1) {
    if (!pendingFocus || !currentPageUrl || !isPendingActiveForPage(currentPageUrl)) {
      return;
    }

    if (type === 'addchild') {
      tryFocusNode(v1);
      return;
    }

    if (type === 'addchildbefore') {
      tryFocusNode(v1);
      return;
    }

    if ((type === 'addchilds' || type === 'addchildsbefore') && v1 && v1.length) {
      for (var i = 0; i < v1.length; i++) {
        if (tryFocusNode(v1[i])) {
          return;
        }
      }
    }
  }, { autoDestroy: false });

  // Fallback timer: if page doesn't emit node events as expected, avoid stale pending state.
  setInterval(function() {
    if (!pendingFocus) return;
    if (Date.now() > pendingFocus.expiresAt) {
      clearPendingFocus('expire');
      return;
    }
    if (currentPageUrl && isPendingActiveForPage(currentPageUrl)) {
      tryFocusFromCurrentNodes();
    }
  }, 300);

  var scrobbler = new videoscrobbler.VideoScrobbler();

  scrobbler.onstart = function(data, prop, origin) {
    var pageUrl = lastBrowsablePageUrl || lastPageUrl;

    // Fallback only when current page looks like a real listing/details page.
    if (!pageUrl && isBrowsablePageUrl(currentPageUrl)) {
      pageUrl = currentPageUrl;
    }

    if (!pageUrl) return;

    var dataCanonical = safeString(data && data.canonical_url, null);
    var dataUrl = safeString(data && data.url, null);
    var originUrl = safeString(origin && origin.url, null);

    var itemCanonical = dataCanonical || canonicalFromUrl(originUrl) || canonicalFromUrl(dataUrl);
    var itemUrl = originUrl || dataUrl || itemCanonical;

    if (!itemCanonical && !itemUrl) {
      return;
    }

    if (!pageUrl) {
      return;
    }

    var itemTitle = safeString(data && data.title, null) ||
                    safeString(origin && origin.metadata && origin.metadata.title, null) ||
                    'Unknown item';

    var pageTitle = lastBrowsablePageTitle || lastPageTitle || currentPageTitle || pageUrl;

    saveEntry({
      itemTitle: itemTitle,
      itemCanonical: itemCanonical,
      itemUrl: itemUrl,
      pageUrl: pageUrl,
      pageTitle: pageTitle,
      playedAt: Date.now()
    });
  };

  plugin.createService('History', PREFIX + 'start', 'video', true);

  plugin.addURI(PREFIX + 'start', function(page) {
    page.type = 'directory';
    page.metadata.title = 'History';

    var list = readEntries();

    if (list.length === 0) {
      page.appendPassiveItem('label', null, {
        title: 'No history yet'
      });
      page.appendPassiveItem('label', null, {
        title: 'Play a video from any plugin to create entries'
      });
      page.loading = false;
      return;
    }

    for (var i = 0; i < list.length; i++) {
      page.appendItem(PREFIX + 'open:' + i, 'directory', {
        title: titleForEntry(list[i])
      });
    }

    page.loading = false;
  });

  plugin.addURI(PREFIX + 'open:(\\d+)', function(page, idxStr) {
    var idx = parseInt(idxStr, 10);
    var list = readEntries();
    var entry = list[idx];

    if (!entry) {
      page.error('Entry not found');
      return;
    }

    var targetPageUrl = safeString(entry.pageUrl, null);
    var targetItemUrl = safeString(entry.itemUrl, null);

    if (targetPageUrl && isBrowsablePageUrl(targetPageUrl)) {
      armPendingFocus(entry);
      page.redirect(targetPageUrl);
      return;
    }

    if (targetItemUrl) {
      page.redirect(targetItemUrl);
      return;
    }

    page.error('Entry has no valid URL');
  });

})(this);
