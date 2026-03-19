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

  function debugLog(msg) {
    console.log('History focus: ' + msg);
  }

  function debugDescribeNode(node) {
    if (!node) {
      debugLog('node payload is <null>');
      return;
    }

    try {
      var keys = P.enumerate(node);
      debugLog('node keys=' + (keys && keys.length ? keys.join(',') : '<none>'));
    } catch (e1) {
      debugLog('failed to enumerate node keys: ' + e1);
    }

    try {
      P.print(node);
    } catch (e2) {
      debugLog('failed to print node tree: ' + e2);
    }
  }

  function makeNodeProxy(node) {
    if (!node) return null;
    try {
      return P.makeProp(node);
    } catch (e) {
      debugLog('failed to proxy node: ' + e);
      return null;
    }
  }

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
    return item + ' | ' + page;
  }

  function clearPendingFocus(reason) {
    if (pendingFocus) {
      debugLog('clear pending focus reason=' + safeString(reason, 'unknown') +
               ' page=' + safeString(pendingFocus.pageUrl, '<none>') +
               ' item=' + safeString(pendingFocus.itemCanonical || pendingFocus.itemUrl, '<none>'));
    }
    pendingFocus = null;
  }

  function armPendingFocus(entry) {
    pendingFocus = {
      pageUrl: entry.pageUrl,
      itemCanonical: entry.itemCanonical || null,
      itemUrl: entry.itemUrl || null,
      expiresAt: Date.now() + 10000
    };
    debugLog('arm pending focus page=' + safeString(pendingFocus.pageUrl, '<none>') +
             ' canonical=' + safeString(pendingFocus.itemCanonical, '<none>') +
             ' url=' + safeString(pendingFocus.itemUrl, '<none>'));
  }

  function isPendingActiveForPage(url) {
    if (!pendingFocus) return false;
    if (Date.now() > pendingFocus.expiresAt) {
      clearPendingFocus('timeout');
      return false;
    }
    return safeString(url, '') === safeString(pendingFocus.pageUrl, '');
  }

  function nodeMatchesPending(node, rawNode) {
    if (!pendingFocus || !node) return false;

    //debugDescribeNode(rawNode || node);

    var nodeTitle = safeString(node.metadata && node.metadata.title, null) ||
                    safeString(node.title, null) ||
                    '<no-title>';
                    
    var nodeType = safeString(node.type, null);
    var nodeUrl = safeString(node.url, null);
    var nodeCanonical = canonicalFromUrl(nodeUrl);
    var targetCanonical = safeString(pendingFocus.itemCanonical, null);
    var targetUrl = safeString(pendingFocus.itemUrl, null);

    debugLog('inspect node title=' + nodeTitle +
             ' url=' + nodeUrl +
             ' type=' + nodeType +
             ' canonical=' + nodeCanonical +
             ' targetCanonical=' + targetCanonical +
             ' targetUrl=' + targetUrl);

    if (targetCanonical && nodeCanonical && targetCanonical === nodeCanonical) {
      debugLog('matched node by canonical url=' + safeString(nodeUrl, '<none>'));
      return true;
    }

    if (targetUrl && nodeUrl && targetUrl === nodeUrl) {
      debugLog('matched node by item url=' + safeString(nodeUrl, '<none>'));
      return true;
    }

    debugLog('node did not match target');

    return false;
  }

  function markNodeAutofocus(rawNode) {
    if (!rawNode || !pendingFocus) return false;

    var node = makeNodeProxy(rawNode);
    if (!node) return false;
    if (!nodeMatchesPending(node, rawNode)) return false;

    try {
      // Let default page focus logic pick this item.
      node.metadata.autofocus = true;
      node.metadata.focusable = 1.5;
      debugLog('applied autofocus to node url=' + safeString(node.url, '<none>'));
      clearPendingFocus('marked');
      return true;
    } catch (e) {
      debugLog('failed to apply autofocus: ' + e);
      return false;
    }
  }

  P.subscribeValue(P.global.navigators.current.currentpage.url, function(v) {
    var url = safeString(v, null);
    currentPageUrl = url;

    if (pendingFocus) {
      debugLog('page url changed current=' + safeString(url, '<none>') +
               ' target=' + safeString(pendingFocus.pageUrl, '<none>') +
               ' active=' + isPendingActiveForPage(url));
    }

    if (isBrowsablePageUrl(url)) {
      lastPageUrl = url;
      lastBrowsablePageUrl = url;
      if (currentPageTitle) {
        lastPageTitle = currentPageTitle;
        lastBrowsablePageTitle = currentPageTitle;
      }
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
      debugLog('node event type=addchild page=' + safeString(currentPageUrl, '<none>'));
      markNodeAutofocus(v1);
      return;
    }

    if (type === 'addchildbefore') {
      debugLog('node event type=addchildbefore page=' + safeString(currentPageUrl, '<none>'));
      markNodeAutofocus(v1);
      return;
    }

    if ((type === 'addchilds' || type === 'addchildsbefore') && v1 && v1.length) {
      debugLog('node event type=' + type + ' count=' + v1.length + ' page=' + safeString(currentPageUrl, '<none>'));
      for (var i = 0; i < v1.length; i++) {
        if (markNodeAutofocus(v1[i])) {
          return;
        }
      }
    }
  }, { autoDestroy: false });

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

    debugLog('save entry page=' + safeString(pageUrl, '<none>') +
         ' item=' + safeString(itemCanonical || itemUrl, '<none>'));

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

    debugLog('open history idx=' + idx +
             ' page=' + safeString(targetPageUrl, '<none>') +
             ' item=' + safeString(targetItemUrl, '<none>'));

    if (targetPageUrl && isBrowsablePageUrl(targetPageUrl)) {
      armPendingFocus(entry);
      debugLog('redirect to page=' + targetPageUrl);
      page.redirect(targetPageUrl);
      return;
    }

    if (targetItemUrl) {
      debugLog('redirect directly to item=' + targetItemUrl);
      page.redirect(targetItemUrl);
      return;
    }

    page.error('Entry has no valid URL');
  });

})(this);
