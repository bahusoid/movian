/* CDNLAND-specific helpers: index builder and token resolver */
/* eslint-disable no-var */

var http = require('movian/http');

function dfltUA() {
  return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36';
}

function safeLog(dlog, msg) { try { if (dlog) dlog(msg); } catch(e) {} }

// Build seasons + translators index from CDNLAND JSON using strict structure
// items: top-level array where each item contains season info and episodes in .playlist or .folder
// Returns { seasons, trIndex }
function buildIndex(items, poster, icon, dlog) {
  // Strict parsing: items = seasons[], each season.folder = episodes[], each episode.folder = translator variants with direct file
  if (!Array.isArray(items) || !items.length) return { seasons: [], trIndex: {} };
  var seasons = [];
  for (var i = 0; i < items.length; i++) {
    var it = items[i] || {};
    if (!Array.isArray(it.folder) || !it.folder.length) continue; // must have episodes
    var label = it.comment || it.title || '';
    var sid = it.id || '';
    var sPoster = it.poster || poster || icon;
    var mnum = (label.match(/(?:Сезон|Season)\s*(\d{1,3})/i) || label.match(/(\d{1,3})\s*(?:сезон|season)/i) || sid.match(/^(\d{1,3})$/));
    var snum = mnum && mnum[1] ? parseInt(mnum[1], 10) : 0;
    seasons.push({ label: label, id: (sid||(''+(seasons.length+1))), num: isNaN(snum) ? 0 : snum, poster: sPoster, pl: it.folder });
  }
  if (!seasons.length) return { seasons: [], trIndex: {} };
  seasons.sort(function(a,b){ if (a.num !== b.num) return a.num - b.num; return 0; });
  var trIndex = {};
  for (var s = 0; s < seasons.length; s++) {
    var S = seasons[s];
    var eps = S.pl || [];
    for (var e = 0; e < eps.length; e++) {
      var ep = eps[e] || {};
      // Strict: each first-level season.folder element is an episode
      var etitle = ep.comment || ep.title || ('Серия ' + (e+1));
      var eposter = ep.poster || S.poster || poster || icon;
      var epid = ep.id || ((S.id||'s') + '-' + (e+1));
      var variants = Array.isArray(ep.folder) ? ep.folder : [];
      if (!variants.length) continue;
      for (var v = 0; v < variants.length; v++) {
        var qit = variants[v] || {};
        var tname = qit.title || qit.comment || '';
        // Use only existing field 'translator' (numeric/string id). If missing, skip.
        var tid = (qit.translator !== undefined && qit.translator !== null) ? ('' + qit.translator) : '';
        if (!tid) { safeLog(dlog, 'CDNLAND: [index] skip variant without translator id for ep=' + epid); continue; }
        // No special-case for translator id '0'; use server text or fallback label
        var dname = tname || ('Перевод ' + tid);
        if (!trIndex[tid]) trIndex[tid] = { id: tid, name: dname, seasons: {} };
        var T = trIndex[tid];
        if (!T.seasons[S.id || (S.num+'')]) T.seasons[S.id || (S.num+'')] = { id: (S.id || (S.num+'')), num: S.num, label: S.label, poster: S.poster, episodes: [] };
        var Ss = T.seasons[S.id || (S.num+'')];
        var tok = qit.file || '';
        if (!tok) { safeLog(dlog, 'CDNLAND: [index] missing file for ep=' + epid + ' tr=' + tid); continue; }
        var disp = tname || '';
        Ss.episodes.push({ id: epid, title: etitle, display: disp, token: tok, poster: eposter });
      }
    }
  }
  return { seasons: seasons, trIndex: trIndex };
}

function tryParsePlayerJSON(txt) {
  if (!txt) return null; var s = (''+txt).trim(); var m = s.match(/(\{[\s\S]*\}|\[[\s\S]*\])/); if (!m) return null; try { return JSON.parse(m[1]); } catch(e1){} try { return JSON.parse(m[1].replace(/\\"/g,'"')); } catch(e2){} return null;
}

function buildTokenPlaylistUrl(baseOrigin, tok) {
  var token = tok.charAt(0) === '~' ? tok.substr(1) : tok;
  var hasBangBang = /!!$/.test(token);
  // Expect caller to provide a discovered baseOrigin (e.g. https://vid11.entouaedon.com or https://vid11.fotpro135alto.com)
  // Do not hardcode any specific CDN host; if missing we cannot construct a URL.
  var base = baseOrigin || '';
  if (!base) return '';
  var url = base + (base.charAt(base.length-1) === '/' ? '' : '/') + 'playlist/' + token + (hasBangBang ? '' : '!!') + '.txt';
  return url;
}

function fetchTokenFile(ctx, tok, dlog) {
  var UA = ctx.UA || dfltUA();
  // Use supplied Kinogo / iframe origins; avoid hardcoded entouaedon fallback.
  var ORIGIN = ctx.ORIGIN || '';
  var REFERER = ctx.REFERER || (ctx.baseOrigin ? (ctx.baseOrigin + '/') : '');
  var csrfToken = ctx.csrfToken || '';
  var u = buildTokenPlaylistUrl(ctx.baseOrigin, tok);
  if (!u) { safeLog(dlog, 'CDNLAND: [play] cannot build playlist URL (no baseOrigin)'); return ''; }
  safeLog(dlog, 'CDNLAND: [play] fetching token playlist: ' + u);
  function req(method, url, addHeaders) {
    try {
      var headers = {
        'User-Agent': UA,
        'Accept': '*/*',
        'Origin': ORIGIN,
        'Referer': REFERER,
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
      };
      if (method === 'POST') {
        headers['X-Requested-With'] = 'XMLHttpRequest';
        headers['Content-Type'] = 'text/plain; charset=UTF-8';
      }
      if (addHeaders) for (var k in addHeaders) headers[k] = addHeaders[k];
      var resp = http.request(url, { method: method, debug:true, noFail:true, compression:true, headers: headers, postdata: (method === 'POST' ? '' : null) });
      if (resp && resp.statuscode >= 200 && resp.statuscode < 300) return resp.toString();
    } catch(e) {}
    return '';
  }
  var payload = '';
  if (csrfToken) payload = req('POST', u, {'X-CSRF-TOKEN': csrfToken, 'X-CSRF-Token': csrfToken, 'x-csrf-token': csrfToken});
  if (!payload) payload = req('GET', u);
  if (!payload) payload = req('GET', u + (u.indexOf('?')>=0?'&':'?') + 'cb=' + Date.now());
  if (!payload) payload = req('POST', u);
  // Try same-site semantics if still empty (some hosts expect Origin/Referer on their own domain)
  if (!payload && ctx.baseOrigin) {
    payload = req('POST', u, {
      'Origin': ctx.baseOrigin,
      'Referer': ctx.baseOrigin + '/',
      'X-CSRF-TOKEN': csrfToken || '', 'X-CSRF-Token': csrfToken || '', 'x-csrf-token': csrfToken || ''
    });
  }
  payload = (payload || '');
  safeLog(dlog, 'CDNLAND: [play] token payload len=' + payload.length + (payload.length<64? (', body=' + JSON.stringify(payload)) : ''));
  return payload;
}

function pickUrlFromPayload(payload) {
  if (!payload || payload.length < 4) return '';
  var j = tryParsePlayerJSON(payload);
  if (j && typeof j === 'object') {
    var f = j.file || j.hls || j.src || '';
    if (!f && j.playlist && j.playlist.length) { var it = j.playlist[0] || {}; f = it.file || it.hls || it.src || ''; }
    if (!f && j.folder && j.folder.length) { var it2 = j.folder[0] || {}; f = it2.file || it2.hls || it2.src || ''; }
    if (f) return f;
  }
  var txt = (payload || '').replace(/^[\s\uFEFF\u200B]+|[\s\uFEFF\u200B]+$/g, '');
  if (/^https?:\/\//i.test(txt)) return txt;
  if (/^#EXTM3U/.test(txt)) {
    var m = txt.match(/https?:\/\/[^\s"']+/i);
    if (m && m[0]) return m[0];
    var mrel = txt.match(/\n\s*([^\n#][^\s"']*\.(?:m3u8|m3u))\s*(?:\n|$)/i);
    if (mrel && mrel[1]) {
      // Return relative path; caller will resolve against discovered CDN suffix
      var rel = mrel[1].trim();
      return (rel.charAt(0) === '/' ? rel : ('/' + rel));
    }
    return '';
  }
  var m2 = txt.match(/https?:\/\/[^\s"']+/i);
  if (m2 && m2[0]) return m2[0];
  return txt;
}

// Resolve token or direct url; returns { url, csrfToken }
function resolveToken(ctx, tokenOrFile, dlog) {
  var t = tokenOrFile || '';
  if (/^~/.test(t)) {
    var payload = fetchTokenFile(ctx, t, dlog);
    var url = pickUrlFromPayload(payload);
    // If we got a relative M3U path, build absolute using baseOrigin's domain suffix
    if (url && !/^https?:\/\//i.test(url) && ctx.baseOrigin) {
      try {
        var suf = (ctx.baseOrigin||'').replace(/^https?:\/\//,'');
        var parts = suf.split('.');
        if (parts.length >= 2) {
          var domainSuffix = parts.slice(1).join('.'); // everything after first label
          // Try to extract cluster prefix from the relative path (e.g., /stream2/b-401/...)
          var mh = url.match(/\/(?:stream2?|hls)\/((?:b|cdn)-\d{1,4})\//i);
          var cluster = mh && mh[1] ? mh[1] : '';
          if (cluster) {
            url = 'https://' + cluster + '.' + domainSuffix + url;
          } else {
            // Fallback to using the host from baseOrigin directly
            url = (ctx.baseOrigin.replace(/\/$/, '')) + url;
          }
        }
      } catch(_rabs) {}
    }
    // If likely CSRF mismatch (tiny payload), try refresh and retry once
    if (!url && ctx.baseOrigin) {
      try {
        var rootHtml = http.request(ctx.baseOrigin + '/', {debug:true, noFail:true, compression:true, headers:{
          'User-Agent': ctx.UA || dfltUA(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }}).toString();
        var m = rootHtml && rootHtml.match(/<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/i);
        if (m && m[1]) {
          ctx.csrfToken = m[1];
          safeLog(dlog, 'CDNLAND: [play] refreshed csrfToken');
          payload = fetchTokenFile(ctx, t, dlog);
          url = pickUrlFromPayload(payload);
        }
      } catch(_e) {}
    }
    return { url: url || '', csrfToken: ctx.csrfToken || '' };
  } else if (/\[[^\]]+\]/.test(t)) {
    var mOne = t.match(/\[(.*?)\]([^,\n\r"']+)/);
    if (mOne && mOne[2]) { return { url: mOne[2].trim().replace(/\\\//g,'/'), csrfToken: ctx.csrfToken||'' }; }
    return { url: '', csrfToken: ctx.csrfToken||'' };
  } else if (/^https?:\/\//i.test(t)) {
    return { url: t, csrfToken: ctx.csrfToken||'' };
  }
  return { url: '', csrfToken: ctx.csrfToken||'' };
}

module.exports = {
  buildIndex: buildIndex,
  resolveToken: resolveToken
};
