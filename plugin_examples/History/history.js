var prop = require('movian/prop');
var videoscrobbler = require('movian/videoscrobbler');
var store = require('movian/store').create('history_store');
var settingsModule = require('movian/settings');
var popup = require('native/popup');
var page = require('movian/page');
var service = require('movian/service');


var PREFIX = 'history:';
var STORE_KEY = 'entries';
var MAX_ENTRIES = 100;


var settings = new settingsModule.globalSettings(Plugin.id, 'History', null, 'History plugin settings');

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
    pendingFocus = null;
    log(debug && 'history cleared by user');
  } catch (e) {
    log(debug && 'failed to clear history: ' + e);
  }
});

var currentPageCanonical = null;
var nodesSubscriptionActive = false;
var pendingFocus = null;
  // In-memory stamp to signal history updates
var historyUpdatedStamp = 0;
const historyPageUrl = PREFIX + 'start';
var lastHistoryStamp = 0;

function log(msg) {
  if (!debug) return;
  console.log('History: ' + msg);
}

function debugDescribeNode(node) {
  if (!node) {
    log(debug && 'node payload is <null>');
    return;
  }

  try {
    var keys = prop.enumerate(node);
    log(debug && 'node keys=' + (keys && keys.length ? keys.join(',') : '<none>'));
  } catch (e1) {
    log(debug && 'failed to enumerate node keys: ' + e1);
  }

  try {
    prop.print(node);
  } catch (e2) {
    log(debug && 'failed to print node tree: ' + e2);
  }
}

function makeNodeProxy(node) {
  if (!node) return null;
  try {
    return prop.makeProp(node);
  } catch (e) {
    log(debug && 'failed to proxy node: ' + e);
    return null;
  }
}
function startsWith(str, prefix, position) {
  if(str == null || prefix == null)
    return false;

  position = position || 0;
  if (str.length < prefix.length + position)
    return false;

  for (var i = 0; i < prefix.length; i++) {
    if (str[position + i] !== prefix[i])
      return false;
  }
  return true;
}

function endsWith(str, prefix) {
  if(str == null || prefix == null)
    return false;

  return startsWith(str, prefix, str.length - prefix.length);
}

function safePlayUrl(url) {
  var v = safeString(url, null);
  if(v && startsWith(v, PREFIX))
    return null;

  return v;
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
  if (!entry) {
    return;
  }

  var list = readEntries();
  var key = makeKey(entry);

  if (filterByPage && entry.pageUrl) {
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
  var page = entry.pageTitle;
  if(!page)
     return item;
  return item +  ' | ' + page;
}
/*
// TODO: It's added globally. How to add only on this page?
// ItemHook: add "Remove from History" context menu action for video items
var itemhook = require('movian/itemhook');
itemhook.create({
  title: 'Remove from History',
  icon: Plugin.path + 'icon.png',
  itemtype: 'directory',
  handler: function(obj, nav) {
    page.redirect(PREFIX + 'remove:' + obj.index);
  }
});
*/
function clearPendingFocus(reason) {
  var pf = pendingFocus;
  if (pf) {
    log(debug && 'clear pending focus reason=' + safeString(reason, 'unknown') +
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
  log(debug && 'arm pending focus page=' + safeString(pf.pageUrl, '<none>') +
           '\ncanonical=' + safeString(pf.itemCanonical, '<none>') +
           '\nurl=' + safeString(pf.itemUrl, '<none>'));
  subscribeToPageModelNodes();
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

  log(debug && 'inspect node title=' + nodeTitle +
           '\n url=' + nodeUrl +
           '\n type=' + nodeType +
           '\n canonical=' + nodeCanonical +
           '\n targetCanonical=' + targetCanonical +
           '\n targetUrl=' + targetUrl);

  if (targetCanonical && nodeCanonical && targetCanonical === nodeCanonical) {
    log(debug && 'matched node by canonical url=' + safeString(nodeUrl, '<none>'));
    return true;
  }

  if (targetUrl && nodeUrl && targetUrl === nodeUrl) {
    log(debug && 'matched node by item url=' + safeString(nodeUrl, '<none>'));
    return true;
  }

  log(debug && 'node did not match target');

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
    log(debug && 'applied autofocus to node url=' + safeString(node.url, '<none>'));
    clearPendingFocus('marked');
    return true;
  } catch (e) {
    log(debug && 'failed to apply autofocus: ' + e);
    return false;
  }
}

function onPageModelNodeEvent(type, v1) {
  log(debug && 'node event type=' + type);
  if(type === "destroyed")
  {
    nodesSubscriptionActive = false;
    return;
  }

  var pf = pendingFocus;
  var currentPageUrl = safeString(prop.global.navigators.current.currentpage.url, null);
  if (!pf || !currentPageUrl || !isPendingActiveForPage(currentPageUrl)) {
    return;
  }

  if (type === 'addchild') {
    log(debug && 'node event type=addchild page=' + safeString(currentPageUrl, '<none>'));
    markNodeAutofocus(v1);
    return;
  }

  if (type === 'addchildbefore') {
    log(debug && 'node event type=addchildbefore page=' + safeString(currentPageUrl, '<none>'));
    markNodeAutofocus(v1);
    return;
  }

  if ((type === 'addchilds' || type === 'addchildsbefore') && v1 && v1.length) {
    log(debug && 'node event type=' + type + ' count=' + v1.length + ' page=' + safeString(currentPageUrl, '<none>'));
    for (var i = 0; i < v1.length; i++) {
      if (markNodeAutofocus(v1[i])) {
        return;
      }
    }
  }
}

function subscribeToPageModelNodes()
{
  log(debug && 'subscribe to page model nodes');
  nodesSubscriptionActive = true;
  try{
    prop.subscribe(prop.global.navigators.current.currentpage.model.nodes, onPageModelNodeEvent, { autoDestroy: true });
  }
  catch(e)    {
    log(debug && 'failed to subscribe to page model nodes: ' + e);
    nodesSubscriptionActive = false;
  }
}

// Parent subscribe that reads properties and forwards them to handlers
prop.subscribe(prop.global.navigators.current.currentpage, function(type, value) {
  //log(debug && 'currentpage event type=' + type + ' value=' + (value !== undefined ? String(value) : '<undef>'));
  //dumpCurrentPageState('event');
  var needNodesSub = !nodesSubscriptionActive && pendingFocus;
  var needRefresh = historyUpdatedStamp !== lastHistoryStamp;

  if(!needNodesSub && !needRefresh)
    return;

  try {
    var nav = prop.global.navigators.current;

    var cp = nav.currentpage;
    if (!cp) return;

    var pageUrl = safeString(cp.url);

    if (needNodesSub && pageUrl && isPendingActiveForPage(pageUrl))
      subscribeToPageModelNodes();

    if (pageUrl === historyPageUrl) {
      log(debug && 'history page refresh triggered, reloading page, evenSink = ', prop.global.navigators.current.eventSink);
      lastHistoryStamp = historyUpdatedStamp;
      prop.sendEvent(prop.global.navigators.current.currentpage.eventSink, 'redirect', historyPageUrl);
    }
  } catch (e) {
    log(debug && 'parent subscribe handler error: ' + e);
  }
}, { autoDestroy: false });

var scrobbler = new videoscrobbler.VideoScrobbler();

scrobbler.onstart = function(data, property, origin) {
  var pageUrl = null;
  var pageTitle = null;
  var dataCanonical = safeString(data && data.canonical_url, null);
  var dataUrl = safeString(data && data.url, null);
  var originUrl = safePlayUrl(origin && origin.url);
  var parentUrl = safeString(prop.global.navigators.current.currentpage.parentUrl);

  var itemCanonical = dataCanonical || canonicalFromUrl(originUrl) || canonicalFromUrl(dataUrl);
  var itemUrl = originUrl || dataUrl || itemCanonical;

  if (!itemCanonical && !itemUrl) {
    return;
  }

  pageUrl = parentUrl
  if (parentUrl)
  {
    var pagesNode = prop.global.navigators.current.pages;
    var pages = prop.enumerate(pagesNode);
    var idx = pages.length - 2;

    while (idx >= 0) {
      var page = pagesNode[idx--];
      var page_canonical = safeString(page.model.metadata.canonical_url);
      pageTitle = safeString(page.model.metadata.title);
      pageUrl = safeString(page.url);
      //console.log('HISTORY check page url=' + pageUrl + ' canonical=' + page_canonical + ' title=' + pageTitle);
      if(page_canonical) {
        //console.log('HISTORY skip');
        continue;
      }
      else
      {
        break;
      }
    }
  }
  var itemTitle = safeString(origin.metadata.title) || safeString(data.title) || "Unknown";

  log(debug && 'save entry pageUrl=' + safeString(pageUrl, '<none>') +
      '\n pageTitle=' + safeString(pageTitle, '<none>') +
      '\n title=' + itemTitle +
      '\n itemUrl=' + safeString(itemUrl, '<none>') +
      '\n itemCanonical=' + safeString(itemCanonical, '<none>') +
      '\n dataCanonical=' + safeString(dataCanonical, '<none>') +
      '\n parentUrl=' + safeString(parentUrl, '<none>') +
      '\n datUrl=' + safeString(dataUrl, '<none>')
  );

  if(startsWith(pageTitle, itemTitle))
  {
    itemTitle = pageTitle;
    pageTitle = null;
  }
  else if (endsWith(itemTitle, pageTitle))
  {
    pageTitle = null;
  }

  saveEntry({
    itemTitle: itemTitle,
    itemCanonical: itemCanonical,
    itemUrl: itemUrl,
    pageUrl: pageUrl || parentUrl,
    pageTitle: pageTitle,
    playedAt: Date.now()
  });
};

service.create('History', PREFIX + 'start', 'video', true, Plugin.path + 'icon.png');

new page.Route(historyPageUrl, function(page) {

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
      title: 'Play a video from any source to create entries'
    });
    page.loading = false;
    return;
  }

  for (var i = 0; i < list.length; i++) {
    page.appendItem(PREFIX + 'open:' + i, 'directory', {
      title: titleForEntry(list[i]),
      index: i
    });
  }

  page.loading = false;
});

new page.Route(PREFIX + 'open:(\\d+)', function(page, idxStr) {
  var idx = parseInt(idxStr, 10);
  var list = readEntries();
  var entry = list[idx];

  if (!entry) {
    page.error('Entry not found');
    return;
  }

  var targetPageUrl = safeString(entry.pageUrl, null);
  var targetItemUrl = safeString(entry.itemUrl, null);

  log(debug && 'open history idx=' + idx +
           ' page=' + safeString(targetPageUrl, '<none>') +
           ' item=' + safeString(targetItemUrl, '<none>'));

  if (targetPageUrl && targetPageUrl.indexOf(PREFIX) !== 0) {
    armPendingFocus(entry);
    log(debug && 'redirect to page=' + targetPageUrl);
    page.redirect(targetPageUrl);
    return;
  }

  if (targetItemUrl && targetItemUrl.indexOf(PREFIX) !== 0) {
    log(debug && 'redirect directly to item=' + targetItemUrl);
    page.redirect(targetItemUrl);
    return;
  }

  page.error('Entry has no valid URL');
});

new page.Route(PREFIX + 'remove:(\\d+)', function(page, idxStr) {
  var idx = parseInt(idxStr, 10);
  var list = readEntries();

  if ( idx < list.length && popup.message('Remove ' + titleForEntry(list[idx]) + '?', true, true)) {
    list.splice(idx, 1);
    saveEntries(list);
    historyUpdatedStamp = Date.now();
  }
  page.redirect(historyPageUrl);
});