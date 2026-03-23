(function(plugin) {

  var PREFIX = 'history:';
  var STORE_KEY = 'entries';
  var MAX_ENTRIES = 100;

  var prop = require('movian/prop');
  var videoscrobbler = require('movian/videoscrobbler');

  var store = plugin.createStore('history_store');

  var settings = plugin.createSettings('History', null, 'History plugin settings');
  var debug = false;
  settings.createBool('debug', 'Debug', false, function(v) { debug = v; });
  var filterByPage = false;
  settings.createBool('filterByPage', 'Filter By Page', false, function(v) { filterByPage = v; });
  settings.createAction('clearHistory', 'Clear History', function() {
    try {
      if(!popup.message('Clear all history entries?', true, true))
        return;

      store[STORE_KEY] = null;
      historyUpdatedStamp = Date.now();
      browseStack = [];
      pendingFocus = null;
      debugLog(debug && 'history cleared by user');
    } catch (e) {
      debugLog(debug && 'failed to clear history: ' + e);
    }
  });

  var lastPageUrl = null;
  var lastPageTitle = null;
  var browseStack = [];  // [{url, title, canonical}, ...] — recent browsable pages
  var MAX_BROWSE_STACK = 5;
  var currentPageUrl = null;
  var currentPageTitle = null;
  var currentPageType = null;
  var currentPageCanonical = null;
  var nodesSubscriptionActive = false;
  var pendingFocus = null;
    // In-memory stamp to signal history updates
  var historyUpdatedStamp = 0;
  const historyPageUrl = PREFIX + 'start';
  var lastHistoryStamp = 0;

  function debugLog(msg) {
    if (!debug) return;
    console.log('History focus: ' + msg);
  }

  function debugDescribeNode(node) {
    if (!node) {
      debugLog(debug && 'node payload is <null>');
      return;
    }

    try {
      var keys = prop.enumerate(node);
      debugLog(debug && 'node keys=' + (keys && keys.length ? keys.join(',') : '<none>'));
    } catch (e1) {
      debugLog(debug && 'failed to enumerate node keys: ' + e1);
    }

    try {
      prop.print(node);
    } catch (e2) {
      debugLog(debug && 'failed to print node tree: ' + e2);
    }
  }

  function makeNodeProxy(node) {
    if (!node) return null;
    try {
      return prop.makeProp(node);
    } catch (e) {
      debugLog(debug && 'failed to proxy node: ' + e);
      return null;
    }
  }

  function safeString(v, fallback) {
    if (v == null) {
      return fallback !== undefined ? fallback : null;
    }
    try {
      if (typeof v === 'object' && typeof v.valueOf === 'function') {
        v = v.valueOf();
      }
    } catch (e) {
    }
    v = String(v);
    return (v !== '' && v !== 'null') ? v : (fallback !== undefined ? fallback : null);
  }

  function isBrowsablePage(url, type) {
    if (!url) return false;
    if (url.indexOf(PREFIX) === 0) return false;
    if (url.indexOf('videoparams:') === 0) return false;
    // model.type is 'video' when the player is active; anything else is browsable.
    return type !== 'video';
  }

  function updateBrowsable(url, title) {
    if (!url) return;
    var top = browseStack.length > 0 ? browseStack[browseStack.length - 1] : null;
    if (top && top.url === url) {
      if (title) top.title = title;
      if (currentPageCanonical) top.canonical = currentPageCanonical;
      return;
    }
    browseStack.push({ url: url, title: title, canonical: currentPageCanonical });
    if (browseStack.length > MAX_BROWSE_STACK) {
      browseStack.shift();
    }
  }

  // Walk the stack backwards to find the first page whose URL or canonical
  // is not the item's own canonical URL (i.e. skip intermediate redirect pages).
  function findBrowsablePageFor(itemCanonical) {
    for (var i = browseStack.length - 1; i >= 0; i--) {
      var entry = browseStack[i];
      if (!itemCanonical ||
          (entry.url !== itemCanonical && entry.canonical !== itemCanonical)) {
        return entry;
      }
    }
    return browseStack.length > 0 ? browseStack[browseStack.length - 1] : null;
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

    if (filterByPage) {
      var writeIdx = 0;
      for (var i = 0; i < list.length; i++) {
        if (list[i].pageUrl !== entry.pageUrl) {
          if (writeIdx !== i) list[writeIdx] = list[i];
          writeIdx++;
        }
      }
      list.length = writeIdx;
    } else {
    for (var i = 0; i < list.length; i++) {
      if (makeKey(list[i]) === key) {
        list.splice(i, 1);
        break;
        }
      }
    }

    list.unshift(entry);

    if (list.length > MAX_ENTRIES) {
      list = list.slice(0, MAX_ENTRIES);
    }

    saveEntries(list);
    // Touch an in-memory timestamp so pages can detect changes and refresh themselves
    historyUpdatedStamp = Date.now();
  }

  function titleForEntry(entry) {
    var item = entry.itemTitle || 'Unknown item';
    var page = entry.pageTitle || entry.pageUrl || 'Unknown page';
    return item + ' | ' + page;
  }

  function clearPendingFocus(reason) {
    var pf = pendingFocus;
    if (pf) {
      debugLog(debug && 'clear pending focus reason=' + safeString(reason, 'unknown') +
               '\npage=' + safeString(pf.pageUrl, '<none>') +
               '\nitem=' + safeString(pf.itemCanonical || pf.itemUrl, '<none>'));
    }
    pendingFocus = null;
  }

  function armPendingFocus(entry) {
    pendingFocus = {
      pageUrl: entry.pageUrl,
      itemCanonical: entry.itemCanonical || null,
      itemUrl: entry.itemUrl || null,
    };
    var pf = pendingFocus;
    debugLog(debug && 'arm pending focus page=' + safeString(pf.pageUrl, '<none>') +
             '\ncanonical=' + safeString(pf.itemCanonical, '<none>') +
             '\nurl=' + safeString(pf.itemUrl, '<none>'));
  }

  function isPendingActiveForPage(url) {
    var pf = pendingFocus;
    if (!pf) return false;

    return safeString(url, '') === safeString(pf.pageUrl, '');
  }

  function nodeMatchesPending(node, rawNode) {
    var pf = pendingFocus;
    if (!pf || !node) return false;

    //debugDescribeNode(rawNode || node);

    var nodeTitle = safeString(node.metadata && node.metadata.title, null) ||
                    safeString(node.title, null) ||
                    '<no-title>';
                    
    var nodeType = safeString(node.type, null);
    var nodeMetaCanonUrl = safeString(node.metadata && node.metadata.canonical_url, null);
    var nodeUrl = safeString(node.url, null);
    if (nodeMetaCanonUrl !== null && nodeMetaCanonUrl !== 'null') 
        nodeUrl = nodeMetaCanonUrl;

    var nodeCanonical = canonicalFromUrl(nodeUrl);
    var targetCanonical = safeString(pf.itemCanonical, null);
    var targetUrl = safeString(pf.itemUrl, null);

    debugLog(debug && 'inspect node title=' + nodeTitle +
             '\n url=' + nodeUrl +
             '\n type=' + nodeType +
             '\n canonical=' + nodeCanonical +
             '\n targetCanonical=' + targetCanonical +
             '\n targetUrl=' + targetUrl);

    if (targetCanonical && nodeCanonical && targetCanonical === nodeCanonical) {
      debugLog(debug && 'matched node by canonical url=' + safeString(nodeUrl, '<none>'));
      return true;
    }

    if (targetUrl && nodeUrl && targetUrl === nodeUrl) {
      debugLog(debug && 'matched node by item url=' + safeString(nodeUrl, '<none>'));
      return true;
    }

    debugLog(debug && 'node did not match target');

    return false;
  }

  function markNodeAutofocus(rawNode) {
    var pf = pendingFocus;
    if (!rawNode || !pf) return false;

    var node = makeNodeProxy(rawNode);
    if (!node) return false;
    if (!nodeMatchesPending(node, rawNode)) return false;

    try {
      // Let default page focus logic pick this item.   
      node.metadata.autofocus = true;
      node.metadata.focusable = 2;
      debugLog(debug && 'applied autofocus to node url=' + safeString(node.url, '<none>'));
      clearPendingFocus('marked');
      return true;
    } catch (e) {
      debugLog(debug && 'failed to apply autofocus: ' + e);
      return false;
    }
  }

  // Debug subscription: monitor currentpage changes in detail (Android/Linux comparison)
  function dumpCurrentPageState(prefix) {
    try {
      var nav = prop.global.navigators.current;
      if (!nav) {
        debugLog(debug && prefix + ' nav.current missing');
        return;
      }
      var cp = nav.currentpage;
      if (!cp) {
        debugLog(debug && prefix + ' currentpage missing');
        return;
      }

      var curUrl = safeString(cp.url, '<none>');
      var curModel = cp.model || {};
      var curType = safeString(curModel.type, '<none>');
      var curTitle = safeString(curModel.metadata && curModel.metadata.title, '<none>');
      var curCanonical = safeString(curModel.metadata && curModel.metadata.canonical_url, '<none>');

      debugLog(debug && prefix + ' currentpage { url=' + curUrl + ', type=' + curType + ', title=' + curTitle + ', canonical=' + curCanonical + ' }');
    } catch (e) {
      debugLog(debug && prefix + ' dump error: ' + e);
    }
  }
  function onCurrentPageUrlUpdate(v) {
   // dumpCurrentPageState('url update');
    var url = safeString(v, null);
    currentPageUrl = url;
    var pf = pendingFocus;
    debugLog(debug && 'current page url'+
      '\n updated=' + safeString(url, '<none>') +
      '\n lastPage=' + safeString(lastPageUrl, '<none>') +
      '\n pendingFocus=' + (pf ? 'yes' : 'no'));

      if(!isPendingActiveForPage(url))
          pendingFocus = null;

    if (isBrowsablePage(url, currentPageType)) {
      lastPageUrl = url;
      updateBrowsable(url, currentPageTitle);
    }
    else {
      if (url === historyPageUrl) {
        if (historyUpdatedStamp !== lastHistoryStamp) {
          debugLog(debug && 'history page refresh triggered, reloading page, evenSink = ', prop.global.navigators.current.eventSink);
          prop.sendEvent(prop.global.navigators.current.currentpage.eventSink, 'redirect', historyPageUrl);
        }
      }
    }
  }


  function onCurrentPageTypeUpdate(v) {
    //dumpCurrentPageState('type update');
    currentPageType = safeString(v, null);

    debugLog(debug && 'current page type ' + safeString(currentPageType, '<none>'));
    // When we transition to a browsable page, update the last known browsable URL.
    if (isBrowsablePage(currentPageUrl, currentPageType)) {
      updateBrowsable(currentPageUrl, currentPageTitle);
    }
  }

  function onCurrentPageCanonicalUpdate(v) {
   // dumpCurrentPageState('canonical_url update');
    currentPageCanonical = safeString(v, null);

    debugLog(debug && 'current page canonical url ' + safeString(currentPageCanonical, '<none>'));
    // Update the top stack entry if it matches the current page.
    var top = browseStack.length > 0 ? browseStack[browseStack.length - 1] : null;
    if (top && top.url === currentPageUrl && currentPageCanonical) {
      top.canonical = currentPageCanonical;
    }
  }

  function onCurrentPageTitleUpdate(v) {
    //dumpCurrentPageState('title update');
    var title = safeString(v, null);
    currentPageTitle = title;
    debugLog(debug && 'current page title ' + safeString(title, '<none>'));

    if (isBrowsablePage(currentPageUrl, currentPageType) && title) {
      lastPageTitle = title;
      var top = browseStack.length > 0 ? browseStack[browseStack.length - 1] : null;
      if (top && top.url === currentPageUrl) {
        top.title = title;
      }
    }
  }


function onPageModelNodeEvent(type, v1) {
    debugLog(debug && 'node event type=' + type);
    if(type === "destroyed")
    {
      nodesSubscriptionActive = false;
      return;
    }

    var pf = pendingFocus;
    if (!pf || !currentPageUrl || !isPendingActiveForPage(currentPageUrl)) {
      return;
    }

    if (type === 'addchild') {
      debugLog(debug && 'node event type=addchild page=' + safeString(currentPageUrl, '<none>'));
      markNodeAutofocus(v1);
      return;
    }

    if (type === 'addchildbefore') {
      debugLog(debug && 'node event type=addchildbefore page=' + safeString(currentPageUrl, '<none>'));
      markNodeAutofocus(v1);
      return;
    }

    if ((type === 'addchilds' || type === 'addchildsbefore') && v1 && v1.length) {
      debugLog(debug && 'node event type=' + type + ' count=' + v1.length + ' page=' + safeString(currentPageUrl, '<none>'));
      for (var i = 0; i < v1.length; i++) {
        if (markNodeAutofocus(v1[i])) {
          return;
        }
      }
    }
  }

  function subscribeToPageModelNodes()
  {
    debugLog(debug && 'subscribe to page model nodes');
    nodesSubscriptionActive = true;
    try{
    prop.subscribe(prop.global.navigators.current.currentpage.model.nodes, onPageModelNodeEvent, { autoDestroy: false });
    }
    catch(e)    {
      debugLog(debug && 'failed to subscribe to page model nodes: ' + e);
      nodesSubscriptionActive = false;
    }
  }

  // Parent subscribe that reads properties and forwards them to handlers
  // (works on Android where per-value subscriptions may not fire).
  prop.subscribe(prop.global.navigators.current.currentpage, function(type, value) {
    //debugLog(debug && 'currentpage event type=' + type + ' value=' + (value !== undefined ? String(value) : '<undef>'));
    //dumpCurrentPageState('event');

    try {
      var nav = prop.global.navigators.current;

      var cp = nav.currentpage;
      if (!cp) return;

      var pageUrl = safeString(cp.url);
      if(!nodesSubscriptionActive  && pageUrl && isPendingActiveForPage(pageUrl))
      {
        subscribeToPageModelNodes();
      }

      // if(cp.url)
      //   debugLog(debug && 'currentpage url=' + safeString(cp.url, '<none>'));

      if(pageUrl &&  currentPageUrl != pageUrl)
        onCurrentPageUrlUpdate(cp.url);

      var model = cp.model || {};
      // if(model.type)
      //   debugLog(debug && 'currentpage model.type=' + safeString(model.type, '<none>'));

      if(model.type && currentPageType != safeString(model.type))
        onCurrentPageTypeUpdate(model.type);

      var metadata = model.metadata || {};
      if(currentPageCanonical != safeString(metadata.canonical_url))
        onCurrentPageCanonicalUpdate(metadata.canonical_url);

      if(currentPageTitle != safeString(metadata.title))
        onCurrentPageTitleUpdate(metadata.title);

    } catch (e) {
      debugLog(debug && 'parent subscribe handler error: ' + e);
    }
  }, { autoDestroy: false });

  var scrobbler = new videoscrobbler.VideoScrobbler();

  scrobbler.onstart = function(data, prop, origin) {
    var dataCanonical = safeString(data && data.canonical_url, null);
    var dataUrl = safeString(data && data.url, null);
    var originUrl = safeString(origin && origin.url, null);

    var itemCanonical = dataCanonical || canonicalFromUrl(originUrl) || canonicalFromUrl(dataUrl);
    var itemUrl = originUrl || dataUrl || itemCanonical;

    if (!itemCanonical && !itemUrl) {
      return;
    }

    var found = findBrowsablePageFor(itemCanonical);
    var pageUrl = found ? found.url : lastPageUrl;

    // Fallback only when current page looks like a real listing/details page.
    if (!pageUrl && isBrowsablePage(currentPageUrl, currentPageType)) {
      pageUrl = currentPageUrl;
    }

    if (!pageUrl) return;
    debugLog(debug && "data title=" + safeString(data && data.title, '<none>'));
    // debugDescribeNode(data);
    // debugLog(debug && "origin");
    // debugDescribeNode(origin);

    // var attempts = [];
    // attempts.push({ src: 'data.title', val: safeString(data && data.title, null) });
    // attempts.push({ src: 'data.filename', val: safeString(data && data.filename, null) });
    // attempts.push({ src: 'data.label', val: safeString(data && data.label, null) });
    // attempts.push({ src: 'data.metadata.title', val: safeString(data && data.metadata && data.metadata.title, null) });
    // attempts.push({ src: 'data.metadata.name', val: safeString(data && data.metadata && data.metadata.name, null) });
    // attempts.push({ src: 'data.metadata.filename', val: safeString(data && data.metadata && data.metadata.filename, null) });
    // attempts.push({ src: 'data.metadata.episode.title', val: safeString(data && data.metadata && data.metadata.episode && data.metadata.episode.title, null) });
    // attempts.push({ src: 'origin.title', val: safeString(origin && origin.title, null) });
    // attempts.push({ src: 'origin.metadata.title', val: safeString(origin && origin.metadata && origin.metadata.title, null) });
    // attempts.push({ src: 'origin.metadata.name', val: safeString(origin && origin.metadata && origin.metadata.name, null) });
    // attempts.push({ src: 'origin.metadata.filename', val: safeString(origin && origin.metadata && origin.metadata.filename, null) });

    // var itemTitle = 'Unknown item';
    // var logLines = [];
    // for (var ti = 0; ti < attempts.length; ti++) {
    //   var a = attempts[ti];
    //   logLines.push(a.src + '=' + safeString(a.val, '<null>'));
    // }
    // debugLog(debug && 'title attempts:\n' + (logLines.length ? logLines.join('\n') : '<none>'));
    
    itemTitle =safeString(origin.metadata.title) || safeString(data.title) || "Unknown";


    var pageTitle = (found && found.title) || lastPageTitle || currentPageTitle || pageUrl;

    debugLog(debug && 'save entry page=' + safeString(pageUrl, '<none>') +
         '\n item=' + safeString(itemCanonical || itemUrl, '<none>') +
        '\n title=' + itemTitle);

    saveEntry({
      itemTitle: itemTitle,
      itemCanonical: itemCanonical,
      itemUrl: itemUrl,
      pageUrl: pageUrl,
      pageTitle: pageTitle,
      playedAt: Date.now()
    });
  };

  plugin.createService('History', PREFIX + 'start', 'video', true, Plugin.path + 'icon.png');

  plugin.addURI(historyPageUrl, function(page) {
  
    // Remember current in-memory timestamp
    // When user returns to this page (back action) and entries were updated,
    // redirect to the same URI to force reloading the page contents.
    lastHistoryStamp = historyUpdatedStamp;

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

    debugLog(debug && 'open history idx=' + idx +
             ' page=' + safeString(targetPageUrl, '<none>') +
             ' item=' + safeString(targetItemUrl, '<none>'));

    if (targetPageUrl && targetPageUrl.indexOf(PREFIX) !== 0) {
      armPendingFocus(entry);
      debugLog(debug && 'redirect to page=' + targetPageUrl);
      page.redirect(targetPageUrl);
      return;
    }

    if (targetItemUrl) {
      debugLog(debug && 'redirect directly to item=' + targetItemUrl);
      page.redirect(targetItemUrl);
      return;
    }

    page.error('Entry has no valid URL');
  });

})(this);
