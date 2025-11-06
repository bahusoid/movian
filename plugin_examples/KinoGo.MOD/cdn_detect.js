/* Dynamic Kinogo CDN + playlist detector (JS port of Python detect_cdn_host)
 * Focus: derive iframe URL, playerConfigs (href, file, key), vid shard, baseOrigin and playlist path.
 * No hardcoded CDN domains. Optional kinolordfilm.com canonical fallback (disabled by default).
 */
/* eslint-disable no-var */
var http = require('movian/http');

function safeLog(dlog, msg) { try { if (dlog) dlog('DETECT: ' + msg); } catch(e) {} }

function fetch(url, headers) {
  try {
    return http.request(url, {debug:true, noFail:true, compression:true, headers: headers||{}}).toString();
  } catch(e) { return ''; }
}

function extractIframeUrl(html) {
  if (!html) return '';
  var m = html.match(/<iframe[^>]+src=(['"])(https?:\/\/[^'"<>]+\/(?:serial|movie|video)\/[A-Za-z0-9_-]{32,}\/iframe)\1/i);
  if (m && m[2]) return m[2];
  var m2 = html.match(/https?:\/\/[^'"<>]+\/(?:serial|movie|video)\/[A-Za-z0-9_-]{32,}\/iframe/i);
  if (m2 && m2[0]) return m2[0];
  var m3 = html.match(/https?:\/\/[^'"<>]+\/iframe/i);
  return (m3 && m3[0]) || '';
}

function extractKindAndHash(html) {
  if (!html) return {kind:'', hash:''};
  var m = html.match(/\/(serial|movie|video)\/([0-9a-f]{32,})\/iframe/i);
  if (m) return {kind:m[1], hash:m[2]};
  var m2 = html.match(/show_player\(\s*['"]([0-9a-f]{32,})['"]\s*,\s*2/i);
  if (m2) return {kind:'serial', hash:m2[1]};
  return {kind:'', hash:''};
}

function extractJsonAfterVar(src, varName) {
  if (!src || !varName) return '';
  try {
    var p = src.indexOf(varName);
    if (p < 0) return '';
    p = src.indexOf('=', p);
    if (p < 0) return '';
    var i = src.indexOf('{', p);
    if (i < 0) return '';
    var depth = 0, inStr = false, strCh = '';
    for (var j = i; j < src.length; j++) {
      var ch = src.charAt(j);
      if (inStr) {
        if (ch === '\\' && j + 1 < src.length) { j++; continue; }
        if (ch === strCh) inStr = false;
        continue;
      }
      if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
      if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return src.substring(i, j + 1); }
    }
  } catch(e) {}
  return '';
}

function parsePlayerConfigs(html, scripts) {
  var pcRaw = extractJsonAfterVar(html||'', 'playerConfigs');
  if (!pcRaw && scripts) pcRaw = extractJsonAfterVar(scripts||'', 'playerConfigs');
  if (!pcRaw) return null;
  try {
    return JSON.parse(pcRaw.replace(/&quot;/g,'"').replace(/\\u([0-9a-fA-F]{4})/g,function(_,h){return String.fromCharCode(parseInt(h,16));}));
  } catch(e) { return null; }
}

function extractThemeScript(html) {
  if (!html) return '';
  // Primary patterns (protocol-relative or absolute kinogo.js)
  var m = html.match(/<script[^>]+src=(['"])(\/\/[^'"<>]*kinogo[^'"<>]*\.js[^'"<>]*)\1/i);
  if (m && m[2]) return (/^\/[\/]/.test(m[2]) ? 'https:' + m[2] : m[2]);
  var m2 = html.match(/<script[^>]+src=(['"])(https?:\/\/[^'"<>]*kinogo[^'"<>]*\.js[^'"<>]*)\1/i);
  if (m2 && m2[2]) return m2[2];
  // Broaden: any script whose src contains 'kinogo' and .js
  var m3 = html.match(/<script[^>]+src=(['"])([^'"<>]*kinogo[^'"<>]*\.js[^'"<>]*)\1/i);
  if (m3 && m3[2]) {
    var src = m3[2];
    if (/^\/\//.test(src)) src = 'https:' + src;
    return src;
  }
  return '';
}

function extractVidShard(themeJs, allScripts) {
  var blob = (themeJs||'') + '\n' + (allScripts||'');
  var m = blob.match(/https?:\/\/(vid\d+)\./i);
  if (m && m[1]) return m[1];
  var m2 = blob.match(/\b(vid\d{1,3})\b/i);
  if (m2 && m2[1]) return m2[1];
  // Composed pattern 'vid'+11
  var m3 = blob.match(/['"]vid['"]\s*\+\s*(\d{1,3})/);
  if (m3 && m3[1]) return 'vid' + m3[1];
  return '';
}

function extractPlayerJsScripts(html) {
  if (!html) return [];
  var out = [];
  var re = /<script[^>]+src=(['"])([^'"<>]*playerjs[^'"<>]*\.js[^'"<>]*)\1/ig, m;
  while ((m = re.exec(html))) {
    var src = m[2];
    if (/^\/\//.test(src)) src = 'https:' + src;
    out.push(src);
  }
  // de-dup
  var seen = {}; var uniq = [];
  for (var i=0;i<out.length;i++) if (!seen[out[i]]) { seen[out[i]]=1; uniq.push(out[i]); }
  return uniq;
}

// Extract fully-qualified vid host from any script/HTML, e.g. vid11.entouaedon.com
function extractAbsoluteVidHost(html, scripts, themeJs) {
  var blob = (html||'') + '\n' + (scripts||'') + '\n' + (themeJs||'');
  var m = blob.match(/https?:\/\/(vid\d+\.[a-z0-9.-]+)/i);
  if (m && m[1]) return m[1].toLowerCase();
  return '';
}

function extractVidShardFromJs(jsText) {
  if (!jsText) return '';
  var m = jsText.match(/https?:\/\/(vid\d+)\./i);
  if (m && m[1]) return m[1];
  var m2 = jsText.match(/\b(vid\d{1,3})\b/i);
  if (m2 && m2[1]) return m2[1];
  var m3 = jsText.match(/['"]vid['"]\s*\+\s*(\d{1,3})/);
  if (m3 && m3[1]) return 'vid' + m3[1];
  return '';
}

// Extract server prefix from template strings like: `https://vid11.${v.href}${url}`
function extractServerPrefixFromTemplate(jsText) {
  if (!jsText) return '';
  // Match backtick or quoted templates and capture the http(s) prefix before ${v.href}${url}
  // Examples:
  //  `https://vid11.${v.href}${url}`
  //  "http://vid7.${v.href}${url}"
  var re = /(https?:\/\/[^\s"'`]+)\$\{v\.href\}\$\{url\}/i;
  var m = jsText.match(re);
  if (m && m[1]) return m[1];
  return '';
}

function extractPlaylistPath(html, scripts) {
  var blob = (html||'') + '\n' + (scripts||'');
  var mAbs = blob.match(/https?:\/\/[^'"\s]+\/playlist\/[^'"\s]+\.(?:txt|json)/i);
  if (mAbs && mAbs[0]) return mAbs[0];
  var mRel = blob.match(/\/playlist\/[^'"\s]+\.(?:txt|json)/i);
  if (mRel && mRel[0]) return mRel[0];
  var mFile = blob.match(/\bfile\s*[:=]\s*['"]([^'"]+)['"]/i);
  if (mFile && mFile[1]) return mFile[1];
  return '';
}

// Try to extract cluster id (b-### or cdn-###) from any script/HTML
function extractClusterFromScripts(html, scripts, themeJs) {
  var blob = (html||'') + '\n' + (scripts||'') + '\n' + (themeJs||'');
  var m = blob.match(/\/(?:stream2|hls)\/((?:b|cdn)-\d{1,4})\//i);
  if (m && m[1]) return m[1];
  return '';
}

function extractCsrf(html, scripts) {
  var blob = (html||'') + '\n' + (scripts||'');
  var m = blob.match(/name=['"]csrf-token['"]\s+content=['"]([^'"]+)['"]/i);
  if (m && m[1]) return m[1];
  var m2 = blob.match(/csrf[_-]?token['"]?\s*[:=]\s*['"]([^'"]+)['"]/i);
  return (m2 && m2[1]) || '';
}

// Ephemeral cache: hash/token -> { baseOrigin, csrf }
var _CACHE = {};

function detect(opts) {
  opts = opts || {};
  var kinogoUrl = opts.kinogoUrl || '';
  var dlog = opts.dlog;
  var UA = opts.UA || 'Mozilla/5.0';
  var kinogoOrigin = opts.kinogoOrigin || '';
  var allowKinolordfilm = !!opts.allowKinolordfilm; // player#2-specific fallback
  var headersBase = {
    'User-Agent': UA,
    'Origin': kinogoOrigin,
    'Referer': kinogoOrigin ? (kinogoOrigin.replace(/\/$/,'') + '/') : '',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
  };
  var pageHtml = fetch(kinogoUrl, headersBase);
  var directIframePattern = /(https?:\/\/[^'"\s]+\/(serial|movie|video)\/[A-Za-z0-9_-]{32,}\/iframe)/i;
  var iframeUrl = '';
  var iframeHtml = '';
  if (!pageHtml && allowKinolordfilm) {
    // If caller passed an iframe URL directly (common in some routes), synthesize canonical fallback
    var mDir = kinogoUrl.match(/\/(serial|movie|video)\/([A-Za-z0-9_-]{32,})\/iframe/i);
    if (mDir) {
      var canon = 'https://kinolordfilm.com/' + mDir[1] + '/' + mDir[2] + '/iframe';
      safeLog(dlog, 'iframe unreachable; trying canonical ' + canon);
      pageHtml = fetch(canon, headersBase);
      if (pageHtml) { kinogoUrl = canon; iframeUrl = canon; iframeHtml = pageHtml; }
    }
  }
  if (!pageHtml) { safeLog(dlog, 'main page fetch failed'); return null; }
  var kindHash = extractKindAndHash(pageHtml);
  if (!iframeUrl) iframeUrl = extractIframeUrl(pageHtml);
  if (!iframeHtml && iframeUrl) iframeHtml = fetch(iframeUrl, headersBase);
  if (allowKinolordfilm && (!iframeUrl || !iframeHtml) && kindHash.hash) {
    // kinolordfilm canonical fallback
    var alt = 'https://kinolordfilm.com/' + (kindHash.kind||'serial') + '/' + kindHash.hash + '/iframe';
    iframeHtml = fetch(alt, headersBase);
    if (iframeHtml) iframeUrl = iframeUrl || alt;
  }
  if (!iframeHtml) { safeLog(dlog,'iframe not found'); }
  // Collect inline script text
  var scriptsText = '';
  try {
    var re = /<script[^>]*>([\s\S]*?)<\/script>/ig, m;
    while ((m = re.exec(iframeHtml))) { if (m[1]) scriptsText += m[1] + '\n'; }
  } catch(_s) {}
  var pc = parsePlayerConfigs(iframeHtml, scriptsText);
  var href = pc && pc.href || '';
  var file = pc && pc.file || '';
  var key = pc && (pc.key || pc.csrf || pc.csrfToken) || extractCsrf(iframeHtml, scriptsText);
  var themeSrc = extractThemeScript(iframeHtml);
  var themeJs = themeSrc ? fetch(themeSrc, headersBase) : '';
  if (!themeSrc && allowKinolordfilm) {
    safeLog(dlog, 'theme script not found in iframe HTML, attempting broad scan of canonical HTML');
  }
  var vidShard = extractVidShard(themeJs, scriptsText);
  var vidHostAbs = extractAbsoluteVidHost(iframeHtml, scriptsText, themeJs);
  var serverPrefix = '';
  if (!serverPrefix) serverPrefix = extractServerPrefixFromTemplate(themeJs);
  if (!vidShard) {
    // Try playerjs scripts (scan iframeHtml + themeJs for embedded playerjs URLs)
    var pjs = extractPlayerJsScripts(iframeHtml + '\n' + themeJs);
    for (var pi=0; pi<pjs.length && !vidShard; pi++) {
      var body = fetch(pjs[pi], headersBase);
      if (!serverPrefix) serverPrefix = extractServerPrefixFromTemplate(body);
      var vs = extractVidShardFromJs(body);
      if (vs) vidShard = vs;
      if (!vidHostAbs) {
        var abs = extractAbsoluteVidHost('', body, '');
        if (abs) vidHostAbs = abs;
      }
    }
  }
  if (!href && themeSrc) {
    try {
      var host = themeSrc.match(/https?:\/\/([^\/]+)/)[1];
      var parts = host.split('.');
      if (parts.length >= 2) href = parts.slice(-2).join('.');
    } catch(eh) {}
  }
  var baseOrigin = '';
  // If a serverPrefix like 'https://vid11.' is found, prefer it to build baseOrigin
  if (!baseOrigin && serverPrefix && href) {
    try {
      var hrefHost = href.replace(/^https?:\/\//,'');
      // Ensure serverPrefix ends with exactly one dot
      var pref = serverPrefix.replace(/\/?$/,'');
      if (!/\.$/.test(pref)) pref += '.';
      baseOrigin = pref + hrefHost;
      // Normalize to include https:// once
      if (!/^https?:\/\//.test(baseOrigin)) baseOrigin = 'https://' + baseOrigin;
    } catch(_bp) {}
  }
  // If scripts mention a fully-qualified vid host, only trust it when it matches href domain suffix
  if (vidHostAbs) {
    try {
      var absHost = vidHostAbs.replace(/^https?:\/\//,'');
      var absParts = absHost.split('.');
      var hrefHost2 = (href||'').replace(/^https?:\/\//,'');
      var hrefParts = hrefHost2.split('.');
      if (absParts.length >= 2 && hrefParts.length >= 2) {
        var absSuf = absParts.slice(1).join('.').toLowerCase();
        var hrefSuf = hrefParts.slice(-2).join('.').toLowerCase();
        if (absSuf === hrefSuf) {
          baseOrigin = 'https://' + absHost;
        } else {
          safeLog(dlog, 'skip vidHostAbs due to suffix mismatch: ' + absHost + ' vs ' + hrefSuf);
        }
      }
    } catch(_vh) {}
  }
  // If playerConfigs.file indicates b- cluster (stream2/b-401/...), prefer that host
  var cluster = '';
  if (file) {
    var cm = file.match(/\/stream2\/(b-\d+)\//);
    if (cm && cm[1]) cluster = cm[1];
  }
  // If not in file, try to find cluster hints in scripts/theme
  if (!cluster) {
    try { cluster = extractClusterFromScripts(iframeHtml, scriptsText, themeJs); } catch(_cl) {}
  }
  
  if (href && cluster) {
    baseOrigin = 'https://' + cluster + '.' + href.replace(/^https?:\/\//,'');
  } else if (href && vidShard) {
    baseOrigin = 'https://' + vidShard + '.' + href.replace(/^https?:\/\//,'');
  }
  var playlistPath = '';
  // Directly trust playerConfigs.file first (it may be /stream2/.../index.m3u8 or /playlist/...txt)
  if (file) playlistPath = file;
  if (!playlistPath) playlistPath = extractPlaylistPath(iframeHtml, scriptsText);
  if (!playlistPath && kindHash.hash) playlistPath = '/playlist/' + kindHash.hash + '.txt';
  // If detection failed to derive baseOrigin but we have href + vidShard or cluster, attempt construction now
  if (!baseOrigin && href) {
    if (cluster) baseOrigin = 'https://' + cluster + '.' + href.replace(/^https?:\/\//,'');
    else if (vidShard) baseOrigin = 'https://' + vidShard + '.' + href.replace(/^https?:\/\//,'');
    else baseOrigin = 'https://' + href.replace(/^https?:\/\//,'');
  }
  var playlistUrl = '';
  if (playlistPath) {
    if (/^https?:\/\//i.test(playlistPath)) {
      playlistUrl = playlistPath;
      // If absolute, try to derive baseOrigin from its host when not set
      if (!baseOrigin) {
        try { baseOrigin = playlistPath.match(/https?:\/\/([^\/]+)/)[1]; baseOrigin = 'https://' + baseOrigin; } catch(eh) {}
      }
    } else if (baseOrigin) {
      playlistUrl = baseOrigin + (playlistPath.charAt(0)==='/'?'':'/') + playlistPath;
    }
  }
  // Cache by hash or token core
  var cacheKey = kindHash.hash || (playlistPath && playlistPath.replace(/^[~#]/,'').replace(/\.txt.*$/,''));
  if (cacheKey && baseOrigin) _CACHE[cacheKey] = { baseOrigin: baseOrigin, csrf: key };
  return {
    iframeUrl: iframeUrl,
    baseOrigin: baseOrigin,
    playlistPath: playlistPath,
    playlistUrl: playlistUrl,
    csrfToken: key || '',
  vidShard: vidShard,
  cluster: cluster,
    serverPrefix: serverPrefix,
    href: href,
    cacheKey: cacheKey,
    fromCache: false
  };
}

module.exports = {
  detect: detect,
  _cache: function(){ return _CACHE; }
};
