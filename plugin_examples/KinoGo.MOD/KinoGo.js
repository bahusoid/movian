/**
    // Try extracting from inline playerConfigs assignment (contains key and file)
    function extractJsonObjectAfterAssignment(src, varName) {
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
          if (ch === '{') depth++;
          else if (ch === '}') {
            depth--;
            if (depth === 0) return src.substring(i, j + 1);
          }
        }
      } catch(e) {}
      return '';
    }
 *
      var pcRaw = extractJsonObjectAfterAssignment((decodedHtml||''), 'playerConfigs');
      if (!pcRaw) pcRaw = extractJsonObjectAfterAssignment((scriptsText||''), 'playerConfigs');
      if (pcRaw) {
 *  This program is free software: you can redistribute it and/or modify
          var pcJson = JSON.parse(pcRaw
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
// ver. 0.0.1
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-var */
//(function (plugin) {
var pluginDescriptor = JSON.parse(Plugin.manifest);
var plugin = JSON.parse(Plugin.manifest);
//var pluginDescriptor = plugin.getDescriptor();
/*
var config = {
  pluginInfo: plugin.getDescriptor(),
  PREFIX: plugin.getDescriptor().id,
  TTL: plugin.getDescriptor().title,
  SYN: plugin.getDescriptor().synopsis,
  AUT: plugin.getDescriptor().author,
  VER: plugin.getDescriptor().version,
  LOGO: Plugin.path + 'KinoGo.png',
};
*/
//var PREFIX = plugin.getDescriptor().id;
var PREFIX = plugin.id;
//var TTL = plugin.getDescriptor().title;
var TTL = plugin.title;
//var SYN = plugin.getDescriptor().synopsis;
var SYN = plugin.synopsis;
//var AUT = plugin.getDescriptor().author;
var AUT = plugin.author;
//var VER = plugin.getDescriptor().version;
var VER = plugin.version;
//var LOGO = Plugin.path + 'KinoGo.png';
var LOGO = Plugin.path + plugin.icon;
var LOGOBACKGROUND = Plugin.path + 'src/back.jpg';
var LOGOLOGO = Plugin.path + 'src/logo.png';
var LOGOICON = Plugin.path + 'src/icon.png';
var LOGOARROW = Plugin.path + 'src/arrow.png';
var LOGOFOLDER = Plugin.path + 'src/folder.png';
var LOGOBOOKMARKS = Plugin.path + 'src/bookmarks.png';
var LOGONONE = Plugin.path + 'src/none.png';
var LOGOHD = Plugin.path + 'src/hd.png';
var LOGO720 = Plugin.path + 'src/720.png';
var LOGO1080 = Plugin.path + 'src/1080.png';
var LOGO4K = Plugin.path + 'src/4k.png';
var LOGOU = Plugin.path + 'src/utorrent.png';
var LOGOM = Plugin.path + 'src/magnet.png';
var LOGOAVATAR = Plugin.path + 'src/avatar.png';
var LOGOAVATARS = Plugin.path + 'src/avatars.png';
var LOGOEXIT = Plugin.path + 'src/exit.png';
//var listview = Plugin.path + 'src/list.view';
var NAME = 'kinogo';

// Unified debug logger (matches HDRezka style: console.error/console.log go to Movian log when debug enabled)
function dlog(msg) {
  if (!service || !service.debug) return;
  // Prefer console.error (often flushed to log file) then print fallback
  try { console.error('KinoGo@dev ' + msg); return; } catch(e1) {}
  try { console.log('KinoGo@dev ' + msg); return; } catch(e2) {}
  try { print('KinoGo@dev ' + msg); } catch(e3) {}
}
//var service = require('showtime/service');
var service = require('movian/service');
//var service = plugin.createService(config.TTL, config.PREFIX + ':start', 'video', true, config.LOGO);
//var service = plugin.createService(TTL, PREFIX + ':start', 'video', true, LOGO);
//require('showtime/service').create(TTL, PREFIX + ':start', 'video', true, LOGO);
//require('movian/service').create(TTL, PREFIX + ':start', 'video', true, LOGO);
service.create(TTL, PREFIX + ':start', 'video', true, LOGO);
//var store = plugin.createStore('config', true);
var store = service.create('config', true);
//var storage = plugin.createStore(NAME);
var storage = service.create(NAME);
var io = require('native/io');
var popup = require('native/popup');
//var prop = require('showtime/prop');
var prop = require('movian/prop');
//var page = require('showtime/page');
var page = require('movian/page');
//var http = require('showtime/http');
var http = require('movian/http');
//var html = require('showtime/html');
var html = require('movian/html');
//var html = 0;
var urls = require('url');
var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36';
var result = '';
var data = {};
var items = [];
//var api = require('./src/api');
//var browse = require('./src/browse');
//var log = require('./src/log');
//var moviepage = require('./src/moviepage');
//var DeanEdwardsUnpacker = require('./utils/Dean-Edwards-Unpacker').unpacker;
//var atob = require('./utils/atob');
//var btoa = require('./utils/btoa');
/*
var config = {
  headers: {
  },
};
*/
/*
var headers = {
};
*/
/*
var config = {
  regExps: {
  },
};
*/
/*
var regExps = {
};
*/
/*
var config = {
  postdata: {
  },
};
*/
/*
var postdata = {
};
*/
/*
var config = {
  login: {
  },
};
*/
/*
var login = {
};
*/
/*
var config = {
  colors: {
  },
};
*/
/*
var colors = {
};
*/
var blue = '6699CC';
var orange = 'FFA500';
var red = 'EE0000';
//var green = '008B45';
var green = '66FF72';
var yellow = 'FFFF00';
var gray = '555555';
function colorStr(str, color) {
  return '<font color="' + color + '"> (' + str + ')</font>';
//  return '<font color="' + color + '"> ' + str + '</font>';
};
function coloredStr(str, color) {
  return '<font color="' + color + '">' + str + '</font>';
};
RichText = function (x) {this.str = x.toString()};
RichText.prototype.toRichString = function (x) {return this.str};
function getStringFromArray(obj) {
  var str = '';
  obj.forEach(function (data, index) {
    str = str + data.name + ',';
  });
  return str.substring(0, str.length - 1);
};
//var settings = require('showtime/settings');
var settings = require('movian/settings');
//var settings = plugin.createSettings(config.TTL, config.LOGO, config.PREFIX, config.SYN);
//var settings = plugin.createSettings(TTL, LOGO, PREFIX, SYN);
//settings.globalSettings(TTL, LOGO, PREFIX, SYN);
settings.globalSettings(PREFIX, TTL, LOGO, SYN);
//settings.createInfo('info', config.LOGO, 'Plugin developed by ' + config.AUT + '. \n');
//settings.createInfo('info', LOGO, 'Plugin developed by ' + AUT + '. \n');
settings.createInfo('info', LOGO, 'Plugin developed by ' + AUT + ', \n' + PREFIX + ', \n' + 'ver. ' + VER + ' \n');
settings.createDivider('Настройки:');
//settings.createBool('tosaccepted', 'Принятие условий использования (при открытии плагина)', true, function (v) {service.tosaccepted = v});
settings.createBool('tosaccepted', 'Принятие условий использования (при открытии плагина)', false, function (v) {service.tosaccepted = v});
//var tos = 'Разработчик не имеет никакого отношения к сайтам, что бы это ни было. Он также не получает за это денег или каких-либо иных льгот. Программное обеспечение предназначено исключительно для образовательных и тестовых целей, и, хотя оно может позволить пользователю создавать копии законно приобретенного и/или принадлежащего контента, требуется, чтобы такие действия пользователя соответствовали законодательству . Кроме того, автор этого программного обеспечения и его партнеры не несут НИКАКОЙ ответственности, юридической или иной подразумеваемой, за любое неправильное использование или за любые убытки, которые могут возникнуть при использовании плагина. Вы несете единоличную ответственность за соблюдение применимых законов в вашей стране, и вы должны прекратить использование этого программного обеспечения, если ваши действия во время работы плагина приведут или могут привести к нарушению прав соответствующих владельцев авторских прав на контент или к каким-либо иным нарушениям . Плагин не лицензирован, не признан и не одобрен каким-либо интернет-ресурсом, являющимся собственностью компании.\n\n';
var tos = 'Плагин предназначен исключительно для образовательных и тестовых целей. Разработчики плагина не имеют отношения к данным сайтам и интернет-ресурсам, не получают каких-либо денег или иных льгот, не несут НИКАКОЙ ответственности за любые действия при использовании плагина. Вы несете единоличную ответственность за соблюдение применимого законодательства и должны прекратить использование плагина, если ваши действия приведут или могут привести к каким-либо нарушениям законодательства.\n\n';
tos += 'Принимаете ли вы эти условия использования?';
//settings.createBool('debug', 'Отладка (debug)', true, function (v) {store.debug = v});
//settings.createBool('debug', 'Отладка (debug)', false, function (v) {store.debug = v});
//settings.createBool('debug', 'Отладка (debug)', true, function (v) {service.debug = v});
settings.createBool('debug', 'Отладка (debug)', false, function (v) {service.debug = v});
function printDebug(message) {
//  if (store.debug) console.error(message);
  if (service.debug) console.error(message);
};
var HTTPS;
var BASE_URL;
var REFERER;
function updateUrl()
{
  HTTPS = service.protocol;
  BASE_URL = service.domain;
  REFERER = HTTPS + BASE_URL + '/';
}
settings.createMultiOpt('protocol', 'Выбор протокола соединения', [
  ['http://', 'HTTP'],
  ['https://', 'HTTPS', true],
  ],
  function (v) {

  service.protocol = v;
  // Update protocol-dependent globals so protocol change is immediate
  updateUrl();
});

settings.createString('domain0', 'Пользовательский домен (базовый URL без завершающего "/" в конце)', 'kinogo.at', function (v) {
  service.domain0 = v;
  // If user is using custom domain, apply immediately
  if (service.isCustomDomain) {
    service.domain = v;
    updateUrl();
  }
});

settings.createMultiOpt('domain', 'Выбор домена', [
  ['custom', 'Пользовательский домен', true],
  ['kinogo-net.org', 'kinogo-net.org (http/https) "базовый"'],
//  ['https://kinogo-net.org', 'https://kinogo-net.org "базовый"'],
  ['kinogo-net.la', 'kinogo-net.la (http/https) "зеркало"'],
  ['kinogo.la', 'kinogo.la (http/https) "базовый"'],
//  ['https://kinogo.la', 'https://kinogo.la "базовый"'],
//  ['s9.kinogo.lu', 's9.kinogo.lu (http/https) "зеркало"'],
//  ['https://s9.kinogo.lu', 'https://s9.kinogo.lu "зеркало"'],
  ['zerkalo.kinogo.lu', 'zerkalo.kinogo.lu (http/https) "зеркало"'],
//  ['https://zerkalo.kinogo.lu', 'https://zerkalo.kinogo.lu "зеркало"'],
  ['kinogo.ag', 'kinogo.ag (http/https) "зеркало"'],
//  ['https://kinogo.ag', 'https://kinogo.ag "зеркало"'],
  ['kinogo.at', 'kinogo.at (http/https) "зеркало"'],
//  ['https://kinogo.at', 'https://kinogo.at "зеркало"'],
  ],
  function (v) {
  printDebug('Установите домен на ' + v);
  // Support a custom user-provided domain similar to HDRezka plugin
  service.isCustomDomain = v === 'custom';
  if (service.isCustomDomain) {
    service.domain = service.domain0;
  } else {
    service.domain = v;
  }
  // Update derived globals immediately so new domain is usable right away
  updateUrl();
});

updateUrl();
//var inspect_url = BASE_URL.replace(/^http.*(\w{4,15}.\w{2,3})$/gm,'.*\.$1') + '.*';
//var inspect_url = HTTPS + BASE_URL.replace(/^http.*(\w{4,15}.\w{2,3})$/gm,'.*\.$1') + '.*';
//print(inspect_url)
//io.httpInspectorCreate(inspect_url, function (ctrl) {
// Use dynamic BASE_URL and REFERER so headers follow the selected domain immediately
// io.httpInspectorCreate('http.*' + BASE_URL + '.*', function (ctrl) {
//   ctrl.setHeader('Accept-Language', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7');
//   // Origin should use the chosen protocol + domain
//   ctrl.setHeader('Origin', HTTPS + BASE_URL);
//   ctrl.setHeader('User-Agent', UA);
//   // Referer uses the computed REFERER variable (protocol + domain + '/'), updated on setting change
//   ctrl.setHeader('Referer', REFERER);
//   return 0;
// });
//io.httpInspectorCreate(BASE_URL + '.*', function (ctrl) {
io.httpInspectorCreate(HTTPS + BASE_URL + '.*', function (ctrl) {
//  ctrl.setHeader('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
//  ctrl.setHeader('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');
//  ctrl.setHeader('Accept-Encoding', 'gzip, deflate');
//  ctrl.setHeader('Accept-Language', 'en-US,en;q=0.8,ru;q=0.6');
//  ctrl.setHeader('Accept-Language', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7');
//  ctrl.setHeader('Content-Type', 'application/x-mpegURL');
//  ctrl.setHeader('Content-Type', 'application/x-www-form-urlencoded');
//  ctrl.setHeader('Origin', 'http://kinogo.tv');
  ctrl.setHeader('Origin', HTTPS + BASE_URL);
  ctrl.setHeader('User-Agent', UA);
//  ctrl.setHeader('Referer', BASE_URL);
//  ctrl.setHeader('Referer', BASE_URL + '/');
//  ctrl.setHeader('Referer', HTTPS + BASE_URL);
//  ctrl.setHeader('Referer', HTTPS + BASE_URL + '/');
  ctrl.setHeader('Referer', REFERER);
//  return 0;
});
// Ensure entouaedon (and sitsarl mirror) receive Kinogo headers expected by the backend
io.httpInspectorCreate('http.*entouaedon.com.*', function (ctrl) {
  ctrl.setHeader('Origin', HTTPS + BASE_URL);
  ctrl.setHeader('Referer', REFERER);
  ctrl.setHeader('User-Agent', UA);
  ctrl.setHeader('Accept-Language', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7');
  return 0;
});
io.httpInspectorCreate('http.*sitsarl.com.*', function (ctrl) {
  ctrl.setHeader('Origin', HTTPS + BASE_URL);
  ctrl.setHeader('Referer', REFERER);
  ctrl.setHeader('User-Agent', UA);
  ctrl.setHeader('Accept-Language', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7');
  return 0;
});
// Player scripts on cdn-t.entouaedon.com
io.httpInspectorCreate('http.*cdn-t\.entouaedon\.com.*', function (ctrl) {
  ctrl.setHeader('Origin', HTTPS + BASE_URL);
  ctrl.setHeader('Referer', REFERER);
  ctrl.setHeader('User-Agent', UA);
  ctrl.setHeader('Accept-Language', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7');
  return 0;
});
//io.httpInspectorCreate('http.*video/[a-f0-9]{16}/.*', function (ctrl) {
//  ctrl.setHeader('User-Agent', UA);
//  return 0;
//});
//io.httpInspectorCreate('http.*streamguard.cc.*', function (ctrl) {
//  ctrl.setHeader('User-Agent', UA);
//  return 0;
//});
//io.httpInspectorCreate('http.*stream.voidboost.cc.*', function (ctrl) {
//  ctrl.setHeader('User-Agent', UA);
//  ctrl.setHeader('Referer', REFERER);
//  return 0;
//});
//io.httpInspectorCreate('http.*.m3u8', function (ctrl) {
//  ctrl.setHeader('Content-Type', 'application/x-mpegURL');
//  return 0;
//});
settings.createMultiOpt('list', 'Отображение списка', [
  ['directory', 'Общим списком'],
  ['video', 'Списком с данными', true],
  ],
  function (v) {
  printDebug('Установите список на ' + v);
  service.list = v;
});
// Allow overriding the User-Agent from settings to avoid hardcoding
settings.createString('ua', 'Пользовательский User-Agent', UA, function (v) {
  UA = v;
});
//settings.createBool('movianDRM', 'Проигрыватель Movian DRM', true, function (v) {service.movianDRM = v});
settings.createBool('movianDRM', 'Проигрыватель Movian DRM', false, function (v) {service.movianDRM = v});
/*
//function setPageHeader(page, title) {
function setPageHeader(page, title, icon) {
  if (!service.tosaccepted) {
//    if (showtime.message(tos, true, true)) {
    if (popup.message(tos, true, true)) {
      service.tosaccepted = 1;
    }
    else {
      page.error('Условия не приняты. Плагин отключен.');
      return;
    }
  }
  page.loading = true;
  if (page.metadata) {
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
    page.metadata.background = LOGOBACKGROUND;
    page.metadata.logo = LOGO;
    page.metadata.icon = LOGO;
//    page.metadata.title = title;
//    page.metadata.title = new showtime.RichText(title);
    page.metadata.title = new RichText(title);
//    page.metadata.title = TTL;
  }
//  }
  page.type = 'directory';
//  page.model.contents = 'list';
//  page.model.contents = 'grid';
  page.contents = 'items';
  page.loading = false;
};
*/
//plugin.addURI(PREFIX + ':start', function (page) {
new page.Route(PREFIX + ':start', function (page) {
  if (!service.tosaccepted) { 
//    if (showtime.message(tos, true, true)) {
    if (popup.message(tos, true, true)) {
      service.tosaccepted = 1;
    }
    else {
      page.error('Условия не приняты. Плагин отключен.');
      return;
    }
  }
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, TTL);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
  page.metadata.title = TTL;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
//  REFERER = showtime.entityDecode(REFERER);
//  REFERER = unescape(REFERER);
//  REFERER = decodeURIComponent(REFERER);
/*
//  html = showtime.httpReq(REFERER).toString();
  html = http.request(REFERER).toString();
*/
//  html = showtime.httpReq(REFERER, {
  html = http.request(REFERER, { 
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  var loginstate = html.match(/logout|>(Выйти|Выход|Кабинет|Мой профиль)</);
  var user = void(0);
  try {
    var expressions = [
      /\/user\/(.*?)\//,
      /<a class="lbn".*?>(.*?)<\/a>/,
      /<div class="loginin">[\S\s]*?Привет,.*?>(.*?)<\/a>/,
      /<div class="login-title.*?">(.*?)<\/div>/,
      /<div class="login-box".*?title="(.*?)"/,
    ],
    i, length = expressions.length;
    for (i = 0; i < length; i++) {
      user = html.match(expressions[i]);
      if (user) {
        user = user[1];
        break;
      }
    }
    user = user.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    user = 'Пользователь';
    user = 'Авторизация';
//    user = '';
  }
//  user = showtime.entityDecode(user);
//  user = unescape(user);
//  user = decodeURIComponent(user);
/*
//  var x2user = html.match(/\/user\/(.*?)\//);
//  var x2user = html.match(/\/user\/([^"]+)\//);
//  var x2user = html.match(/<a class="lbn".*?>(.*?)<\/a>/);
//  var x2user = html.match(/<a class="lbn".*?>([^"]+)<\/a>/);
//  var x2user = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>(.*?)<\/a>/);
//  var x2user = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>([^"]+)<\/a>/);
//  var x2user = html.match(/<div class="login-title.*?">(.*?)<\/div>/);
//  var x2user = html.match(/<div class="login-title.*?">([^"]+)<\/div>/);
  var x2user = html.match(/<div class="login-box".*?title="(.*?)"/);
//  var x2user = html.match(/<div class="login-box".*?title="([^"]+)"/);
  try {
    x2user = x2user[1];
    x2user = x2user.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    x2user = user;
//    x2user = xuser;
//    x2user = x0user;
//    x2user = x1user;
//    x2user = 'Пользователь';
    x2user = 'Авторизация';
//    x2user = '';
  }
//  x2user = showtime.entityDecode(x2user);
//  x2user = unescape(x2user);
//  x2user = decodeURIComponent(x2user);
//  var x1user = html.match(/\/user\/(.*?)\//);
//  var x1user = html.match(/\/user\/([^"]+)\//);
//  var x1user = html.match(/<a class="lbn".*?>(.*?)<\/a>/);
//  var x1user = html.match(/<a class="lbn".*?>([^"]+)<\/a>/);
//  var x1user = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>(.*?)<\/a>/);
//  var x1user = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>([^"]+)<\/a>/);
  var x1user = html.match(/<div class="login-title.*?">(.*?)<\/div>/);
//  var x1user = html.match(/<div class="login-title.*?">([^"]+)<\/div>/);
//  var x1user = html.match(/<div class="login-box".*?title="(.*?)"/);
//  var x1user = html.match(/<div class="login-box".*?title="([^"]+)"/);
  try {
    x1user = x1user[1];
    x1user = x1user.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    x1user = user;
//    x1user = xuser;
//    x1user = x0user;
    x1user = x2user;
//    x1user = 'Пользователь';
//    x1user = 'Авторизация';
//    x1user = '';
  }
//  x1user = showtime.entityDecode(x1user);
//  x1user = unescape(x1user);
//  x1user = decodeURIComponent(x1user);
//  var x0user = html.match(/\/user\/(.*?)\//);
//  var x0user = html.match(/\/user\/([^"]+)\//);
//  var x0user = html.match(/<a class="lbn".*?>(.*?)<\/a>/);
//  var x0user = html.match(/<a class="lbn".*?>([^"]+)<\/a>/);
  var x0user = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>(.*?)<\/a>/);
//  var x0user = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>([^"]+)<\/a>/);
//  var x0user = html.match(/<div class="login-title.*?">(.*?)<\/div>/);
//  var x0user = html.match(/<div class="login-title.*?">([^"]+)<\/div>/);
//  var x0user = html.match(/<div class="login-box".*?title="(.*?)"/);
//  var x0user = html.match(/<div class="login-box".*?title="([^"]+)"/);
  try {
    x0user = x0user[1];
    x0user = x0user.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    x0user = user;
//    x0user = xuser;
    x0user = x1user;
//    x0user = x2user;
//    x0user = 'Пользователь';
//    x0user = 'Авторизация';
//    x0user = '';
  }
//  x0user = showtime.entityDecode(x0user);
//  x0user = unescape(x0user);
//  x0user = decodeURIComponent(x0user);
//  var xuser = html.match(/\/user\/(.*?)\//);
//  var xuser = html.match(/\/user\/([^"]+)\//);
  var xuser = html.match(/<a class="lbn".*?>(.*?)<\/a>/);
//  var xuser = html.match(/<a class="lbn".*?>([^"]+)<\/a>/);
//  var xuser = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>(.*?)<\/a>/);
//  var xuser = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>([^"]+)<\/a>/);
//  var xuser = html.match(/<div class="login-title.*?">(.*?)<\/div>/);
//  var xuser = html.match(/<div class="login-title.*?">([^"]+)<\/div>/);
//  var xuser = html.match(/<div class="login-box".*?title="(.*?)"/);
//  var xuser = html.match(/<div class="login-box".*?title="([^"]+)"/);
  try {
    xuser = xuser[1];
    xuser = xuser.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    xuser = user;
    xuser = x0user;
//    xuser = x1user;
//    xuser = x2user;
//    xuser = 'Пользователь';
//    xuser = 'Авторизация';
//    xuser = '';
  }
//  xuser = showtime.entityDecode(xuser);
//  xuser = unescape(xuser);
//  xuser = decodeURIComponent(xuser);
  var user = html.match(/\/user\/(.*?)\//);
//  var user = html.match(/\/user\/([^"]+)\//);
//  var user = html.match(/<a class="lbn".*?>(.*?)<\/a>/);
//  var user = html.match(/<a class="lbn".*?>([^"]+)<\/a>/);
//  var user = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>(.*?)<\/a>/);
//  var user = html.match(/<div class="loginin">[\S\s]*?Привет,.*?>([^"]+)<\/a>/);
//  var user = html.match(/<div class="login-title.*?">(.*?)<\/div>/);
//  var user = html.match(/<div class="login-title.*?">([^"]+)<\/div>/);
//  var user = html.match(/<div class="login-box".*?title="(.*?)"/);
//  var user = html.match(/<div class="login-box".*?title="([^"]+)"/);
  try {
    user = user[1];
    user = user.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    user = xuser;
//    user = x0user;
//    user = x1user;
//    user = x2user;
//    user = 'Пользователь';
//    user = 'Авторизация';
//    user = '';
  }
//  user = showtime.entityDecode(user);
//  user = unescape(user);
//  user = decodeURIComponent(user);
*/
  var avatar = void(0);
//  var avatar = LOGOAVATAR;
//  var avatar = LOGOAVATARS;
  try {
    var expressions = [
      /<div class="lb-ava img-box".*?><img src=( '|'| "|"| |)(.*?)('|"| )/,
      /<div class="avatar-box">[\S\s]*?<img src=( '|'| "|"| |)(.*?)('|"| )/,
      /<div class="login-avatar.*?"><img src=( '|'| "|"| |)(.*?)('|"| )/,
    ],
    i, length = expressions.length;
    for (i = 0; i < length; i++) {
      avatar = html.match(expressions[i]);
      if (avatar) {
        avatar = avatar[2];
        break;
      }
    }
    avatar = avatar.replace(/('|"| )/g, '').trim();
    if (/http.*?:\/\/www\.gravatar\.com/.test(avatar)) {
      avatar = avatar;
    }
    else if (/http.*?:\/\//.test(avatar)) {
      avatar = avatar;
    }
    else if (/\/\//.test(avatar)) {
      avatar = HTTPS + avatar.replace(/(http:|https:|\/\/)/g, '').trim();
    }
    else {
      avatar = HTTPS + BASE_URL + avatar;
//      avatar = HTTPS + BASE_URL + '///' + avatar;
    }
//    avatar = avatar.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(avatar)) {
      avatar = avatar;
    }
    else {
      avatar = LOGOAVATAR;
//      avatar = LOGOAVATARS;
//      avatar = LOGOICON;
//      avatar = LOGOLOGO;
//      avatar = LOGONONE;
//      avatar = '';
    }
  }
  catch (err) {
    avatar = LOGOAVATAR;
//    avatar = LOGOAVATARS;
//    avatar = LOGOICON;
//    avatar = LOGOLOGO;
//    avatar = LOGONONE;
//    avatar = '';
  }
//  avatar = showtime.entityDecode(avatar);
//  avatar = unescape(avatar);
//  avatar = decodeURIComponent(avatar);
/*
//  var x0avatar = html.match(/<div class="lb-ava img-box".*?><img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var x0avatar = html.match(/<div class="lb-ava img-box".*?><img src=( '|'| "|"| |)([^"]+)('|"| )/);
//  var x0avatar = html.match(/<div class="avatar-box">[\S\s]*?<img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var x0avatar = html.match(/<div class="avatar-box">[\S\s]*?<img src=( '|'| "|"| |)([^"]+)('|"| )/);
  var x0avatar = html.match(/<div class="login-avatar.*?"><img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var x0avatar = html.match(/<div class="login-avatar.*?"><img src=( '|'| "|"| |)([^"]+)('|"| )/);
  try {
    x0avatar = x0avatar[2];
    x0avatar = x0avatar.replace(/('|"| )/g, '').trim();
    if (/http.*?:\/\/www\.gravatar\.com/.test(x0avatar)) {
      x0avatar = x0avatar;
    }
    else if (/http.*?:\/\//.test(x0avatar)) {
      x0avatar = x0avatar;
    }
    else if (/\/\//.test(x0avatar)) {
      x0avatar = HTTPS + x0avatar.replace(/(http:|https:|\/\/)/g, '').trim();
    }
    else {
      x0avatar = HTTPS + BASE_URL + x0avatar;
//      x0avatar = HTTPS + BASE_URL + '///' + x0avatar;
    }
//    x0avatar = x0avatar.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(x0avatar)) {
      x0avatar = x0avatar;
    }
    else {
//      x0avatar = avatar;
//      x0avatar = xavatar;
      x0avatar = LOGOAVATAR;
//      x0avatar = LOGOAVATARS;
//      x0avatar = LOGOICON;
//      x0avatar = LOGOLOGO;
//      x0avatar = LOGONONE;
//      x0avatar = '';
    }
  }
  catch (err) {
//    x0avatar = avatar;
//    x0avatar = xavatar;
    x0avatar = LOGOAVATAR;
//    x0avatar = LOGOAVATARS;
//    x0avatar = LOGOICON;
//    x0avatar = LOGOLOGO;
//    x0avatar = LOGONONE;
//    x0avatar = '';
  }
//  x0avatar = showtime.entityDecode(x0avatar);
//  x0avatar = unescape(x0avatar);
//  x0avatar = decodeURIComponent(x0avatar);
//  var xavatar = html.match(/<div class="lb-ava img-box".*?><img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var xavatar = html.match(/<div class="lb-ava img-box".*?><img src=( '|'| "|"| |)([^"]+)('|"| )/);
  var xavatar = html.match(/<div class="avatar-box">[\S\s]*?<img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var xavatar = html.match(/<div class="avatar-box">[\S\s]*?<img src=( '|'| "|"| |)([^"]+)('|"| )/);
//  var xavatar = html.match(/<div class="login-avatar.*?"><img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var xavatar = html.match(/<div class="login-avatar.*?"><img src=( '|'| "|"| |)([^"]+)('|"| )/);
  try {
    xavatar = xavatar[2];
    xavatar = xavatar.replace(/('|"| )/g, '').trim();
    if (/http.*?:\/\/www\.gravatar\.com/.test(xavatar)) {
      xavatar = xavatar;
    }
    else if (/http.*?:\/\//.test(xavatar)) {
      xavatar = xavatar;
    }
    else if (/\/\//.test(xavatar)) {
      xavatar = HTTPS + xavatar.replace(/(http:|https:|\/\/)/g, '').trim();
    }
    else {
      xavatar = HTTPS + BASE_URL + xavatar;
//      xavatar = HTTPS + BASE_URL + '///' + xavatar;
    }
//    xavatar = xavatar.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(xavatar)) {
      xavatar = xavatar;
    }
    else {
//      xavatar = avatar;
      xavatar = x0avatar;
//      xavatar = LOGOAVATAR;
//      xavatar = LOGOAVATARS;
//      xavatar = LOGOICON;
//      xavatar = LOGOLOGO;
//      xavatar = LOGONONE;
//      xavatar = '';
    }
  }
  catch (err) {
//    xavatar = avatar;
    xavatar = x0avatar;
//    xavatar = LOGOAVATAR;
//    xavatar = LOGOAVATARS;
//    xavatar = LOGOICON;
//    xavatar = LOGOLOGO;
//    xavatar = LOGONONE;
//    xavatar = '';
  }
//  xavatar = showtime.entityDecode(xavatar);
//  xavatar = unescape(xavatar);
//  xavatar = decodeURIComponent(xavatar);
  var avatar = html.match(/<div class="lb-ava img-box".*?><img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var avatar = html.match(/<div class="lb-ava img-box".*?><img src=( '|'| "|"| |)([^"]+)('|"| )/);
//  var avatar = html.match(/<div class="avatar-box">[\S\s]*?<img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var avatar = html.match(/<div class="avatar-box">[\S\s]*?<img src=( '|'| "|"| |)([^"]+)('|"| )/);
//  var avatar = html.match(/<div class="login-avatar.*?"><img src=( '|'| "|"| |)(.*?)('|"| )/);
//  var avatar = html.match(/<div class="login-avatar.*?"><img src=( '|'| "|"| |)([^"]+)('|"| )/);
  try {
    avatar = avatar[2];
    avatar = avatar.replace(/('|"| )/g, '').trim();
    if (/http.*?:\/\/www\.gravatar\.com/.test(avatar)) {
      avatar = avatar;
    }
    else if (/http.*?:\/\//.test(avatar)) {
      avatar = avatar;
    }
    else if (/\/\//.test(avatar)) {
      avatar = HTTPS + avatar.replace(/(http:|https:|\/\/)/g, '').trim();
    }
    else {
      avatar = HTTPS + BASE_URL + avatar;
//      avatar = HTTPS + BASE_URL + '///' + avatar;
    }
//    avatar = avatar.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(avatar)) {
      avatar = avatar;
    }
    else {
      avatar = xavatar;
//      avatar = x0avatar;
//      avatar = LOGOAVATAR;
//      avatar = LOGOAVATARS;
//      avatar = LOGOICON;
//      avatar = LOGOLOGO;
//      avatar = LOGONONE;
//      avatar = '';
    }
  }
  catch (err) {
    avatar = xavatar;
//    avatar = x0avatar;
//    avatar = LOGOAVATAR;
//    avatar = LOGOAVATARS;
//    avatar = LOGOICON;
//    avatar = LOGOLOGO;
//    avatar = LOGONONE;
//    avatar = '';
  }
//  avatar = showtime.entityDecode(avatar);
//  avatar = unescape(avatar);
//  avatar = decodeURIComponent(avatar);
*/
  if (null == loginstate) {
    page.appendItem(PREFIX + ':login', 'directory', {
//    page.appendItem(PREFIX + ':login', 'video', {
//    page.appendItem(PREFIX + ':login', service.list, {
//      title: new showtime.RichText(coloredStr('Войти', red)),
//      title: new RichText(coloredStr('Войти', red)),
//      title: new showtime.RichText(coloredStr('Войти на ' + TTL, red)),
//      title: new RichText(coloredStr('Войти на ' + TTL, red)),
//      title: new showtime.RichText(coloredStr('Войти [ ' + user + ' ]', red)),
      title: new RichText(coloredStr('Войти [ ' + user + ' ]', red)),
//      icon: avatar,
//      icon: LOGOAVATAR,
//      icon: LOGOAVATARS,
//      icon: LOGOICON,
      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: LOGOARROW,
//      icon: '',
    });
  }
  else {
    page.appendItem(PREFIX + ':logout', 'directory', {
//    page.appendItem(PREFIX + ':logout', 'video', {
//    page.appendItem(PREFIX + ':logout', service.list, {
//      title: new showtime.RichText(coloredStr('Выйти', gray)),
//      title: new RichText(coloredStr('Выйти', gray)),
//      title: new showtime.RichText(coloredStr('Выйти из ' + TTL, gray)),
//      title: new RichText(coloredStr('Выйти из ' + TTL, gray)),
//      title: new showtime.RichText(coloredStr('Выйти [ ' + user + ' ]', gray)),
      title: new RichText(coloredStr('Выйти [ ' + user + ' ]', gray)),
//      title: new showtime.RichText(coloredStr('Пользователь [ ' + user + ' ]', gray)),
//      title: new RichText(coloredStr('Пользователь [ ' + user + ' ]', gray)),
//      title: new showtime.RichText(coloredStr('Выйти из аккаунта ' + user, gray)),
//      title: new RichText(coloredStr('Выйти из аккаунта ' + user, gray)),
      icon: avatar,
//      icon: LOGOAVATAR,
//      icon: LOGOAVATARS,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: LOGOARROW,
//      icon: LOGOEXIT,
//      icon: '',
    });
  }
//  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + PREFIX});
//  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + BASE_URL});
  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + HTTPS + BASE_URL});
//  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + PREFIX + ' (' + BASE_URL + ')'});
  if (loginstate) {
/*
//    page.appendItem('', 'separator', {title: ''});
    page.appendItem(PREFIX + ':logout', 'directory', {
//    page.appendItem(PREFIX + ':logout', 'video', {
//    page.appendItem(PREFIX + ':logout', service.list, {
//      title: new showtime.RichText(coloredStr('Выйти', red)),
//      title: new RichText(coloredStr('Выйти', red)),
//      title: new showtime.RichText(coloredStr('Выйти из ' + TTL, red)),
//      title: new RichText(coloredStr('Выйти из ' + TTL, red)),
//      title: new showtime.RichText(coloredStr('Выйти [ ' + user + ' ]', red)),
//      title: new RichText(coloredStr('Выйти [ ' + user + ' ]', red)),
//      title: new showtime.RichText(coloredStr('Пользователь [ ' + user + ' ]', red)),
//      title: new RichText(coloredStr('Пользователь [ ' + user + ' ]', red)),
//      title: new showtime.RichText(coloredStr('Выйти из аккаунта ' + user, red)),
      title: new RichText(coloredStr('Выйти из аккаунта ' + user, red)),
//      icon: avatar,
//      icon: LOGOAVATAR,
//      icon: LOGOAVATARS,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: LOGOARROW,
      icon: LOGOEXIT,
//      icon: '',
    });
*/
//    page.appendItem('', 'separator', {title: ''});
    page.appendItem(PREFIX + ':browse:' + REFERER + 'favorites/' + '~' + 'Мои закладки', 'directory', { 
//    page.appendItem(PREFIX + ':browse:' + REFERER + 'favorites/' + '~' + 'Мои закладки', 'video', {
//    page.appendItem(PREFIX + ':browse:' + REFERER + 'favorites/' + '~' + 'Мои закладки', service.list, {
//      title: new showtime.RichText('Мои закладки'),
      title: new RichText('Мои закладки'),
//      icon: avatar,
//      icon: LOGOAVATAR,
//      icon: LOGOAVATARS,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: LOGOFOLDER,
//      icon: LOGOARROW,
      icon: LOGOBOOKMARKS,
//      icon: '',
    });
  }
/*
//  page.appendItem('', 'separator', {title: ''});
  var pages = [
    {url: REFERER + 'favorites/', title: 'Мои закладки'},
    {url: REFERER + '', title: 'Карусель'},
    {url: REFERER + '', title: 'Главная'},
    {url: REFERER + '', title: 'Фильмы'},
    {url: REFERER + '', title: 'Сериалы'},
    {url: REFERER + '', title: 'Мультфильмы'},
    {url: REFERER + '', title: 'Мультсериалы'},
    {url: REFERER + '', title: 'Аниме'},
    {url: REFERER + '', title: 'Документальное'},
    {url: REFERER + '', title: 'Телешоу'},
    {url: REFERER + '', title: 'Категории'},
  ],
  i, length = pages.length;
  for (i = 0; i < length; i++) {
    var uri;
    uri = PREFIX + ':browse:' + pages[i].url + '~' + pages[i].title;
//    uri = PREFIX + ':browse:' + escape(pages[i].url) + '~' + escape(pages[i].title);
//    uri = PREFIX + ':browse:' + encodeURIComponent(pages[i].url) + '~' + encodeURIComponent(pages[i].title);
    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
//    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(pages[i].title),
      title: new RichText(pages[i].title),
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
      icon: LOGOFOLDER,
//      icon: LOGOARROW,
//      icon: '',
    });
  }
*/
  if (html) {
    var car = html.match(/<div class=.*?carousel.*?>[\s\S]*?"(inner|top-carou img-box|carou img-box)"[\s\S]*?<\/a>[\s\S]*?class="(carousel_next carousel_right|footer|footer-text|site-desc clearfix|cols clearfix|cols fx-row center)"/);
    if (car) {
//      page.appendItem('', 'separator', {title: ''});
      page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', 'directory', {
//      page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', 'video', {
//      page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', service.list, {
//        title: new showtime.RichText('Карусель'),
        title: new RichText('Карусель'),
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
        icon: LOGOFOLDER,
//        icon: LOGOARROW,
//        icon: '',
      });
    }
    var main = html.match(/<(table class="menu"|ul class="hmenu center"|ul class="second-menu clearfix"|ul class="first-menu clearfix")>([\s\S]*?)<\/(table|ul)>/);
    if (main) {
//      page.appendItem('', 'separator', {title: ''});
      scrapermain(page, main[2]);
    }
  }
/*
    var sect = html.match(/<div class="sect">[\s\S]*?<div class="sect-header fx-row fx-middle fx-start">[\s\S]*?class="sect-title">/);
    var car = html.match(/owl-carousel[\s\S]*?<div class="(th-item|popular-item)"[\s\S]*?".*?title.*?>[^"]+<\/div>[\s\S]*?<(div class="content"|main class="main"|div class="sect"|div class="sect-cont sect-items clearfix"|div class="speedbar nowrap")>/);
    var main = html.match(/<div class="(th-item|popular-item)"[\s\S]*?".*?title.*?>[^"]+<\/div>/);
    var home = html.match(/<div class="content">[\s\S]*?<a href=( '|'| "|"| |)(.*?)('|"| ).*?class="sect-title">(.*?)<\/a>/);
//    var home = html.match(/<div class="content">[\s\S]*?<a href=( '|'| "|"| |)([^"]+)('|"| ).*?class="sect-title">([^"]+)<\/a>/);
    if (sect) {
//      page.appendItem('', 'separator', {title: ''});
      page.appendItem(PREFIX + ':xbrowse:' + REFERER + '~' + 'Главная', 'directory', {
//      page.appendItem(PREFIX + ':xbrowse:' + REFERER + '~' + 'Главная', 'video', {
//      page.appendItem(PREFIX + ':xbrowse:' + REFERER + '~' + 'Главная', service.list, {
//        title: new showtime.RichText('Главная'),
        title: new RichText('Главная'),
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
        icon: LOGOFOLDER,
//        icon: LOGOARROW,
//        icon: '',
      });
      if (car) {
//        page.appendItem('', 'separator', {title: ''});
        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', 'directory', {
//        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', 'video', {
//        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', service.list, {
//          title: new showtime.RichText('Карусель'),
          title: new RichText('Карусель'),
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
        });
      }
      scrapermain(page, html);
    }
    else if (main) {
//      page.appendItem('', 'separator', {title: ''});
      page.appendItem(PREFIX + ':browse:' + REFERER + '~' + 'Главная', 'directory', {
//      page.appendItem(PREFIX + ':browse:' + REFERER + '~' + 'Главная', 'video', {
//      page.appendItem(PREFIX + ':browse:' + REFERER + '~' + 'Главная', service.list, {
//        title: new showtime.RichText('Главная'),
        title: new RichText('Главная'),
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
        icon: LOGOFOLDER,
//        icon: LOGOARROW,
//        icon: '',
      });
      if (car) {
//        page.appendItem('', 'separator', {title: ''});
        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', 'directory', {
//        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', 'video', {
//        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', service.list, {
//          title: new showtime.RichText('Карусель'),
          title: new RichText('Карусель'),
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
        });
      }
    }
    else if (home) {
      try {
        var url = home[2];
        url = url.replace(/('|"| )/g, '').trim();
        if (/http.*?:\/\//.test(url)) {
          url = url;
        }
        else {
//          url = HTTPS + BASE_URL + url;
          url = HTTPS + BASE_URL + '///' + url;
        }
//        url = url + '///';
        url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      }
      catch (err) {
        url = '';
      }
//      url = showtime.entityDecode(url);
//      url = unescape(url);
//      url = decodeURIComponent(url);
      try {
        var name = home[4];
        if (/[^"]+/.test(name)) {
          name = name;
        }
        else {
          name = 'Главная';
//          name = '';
        }
      }
      catch (err) {
        name = 'Главная';
//        name = '';
      }
//      name = showtime.entityDecode(name);
//      name = unescape(name);
//      name = decodeURIComponent(name);
      var uri;
      uri = PREFIX + ':xbrowse:' + url + '~' + 'Главная';
//      uri = PREFIX + ':xbrowse:' + escape(url) + '~' + escape('Главная');
//      uri = PREFIX + ':xbrowse:' + encodeURIComponent(url) + '~' + encodeURIComponent('Главная');
//      uri = PREFIX + ':xbrowse:' + url + '~' + name;
//      uri = PREFIX + ':xbrowse:' + escape(url) + '~' + escape(name);
//      uri = PREFIX + ':xbrowse:' + encodeURIComponent(url) + '~' + encodeURIComponent(name);
//      page.appendItem('', 'separator', {title: ''});
      page.appendItem(uri, 'directory', {
//      page.appendItem(uri, 'video', {
//      page.appendItem(uri, service.list, {
//        title: new showtime.RichText('Главная'),
//        title: new RichText('Главная'),
//        title: new showtime.RichText(name ? name : ''),
        title: new RichText(name ? name : ''),
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
        icon: LOGOFOLDER,
//        icon: LOGOARROW,
//        icon: '',
      });
    }
    else {
      if (car) {
//        page.appendItem('', 'separator', {title: ''});
        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', 'directory', {
//        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', 'video', {
//        page.appendItem(PREFIX + ':carbrowse:' + REFERER + '~' + 'Карусель', service.list, {
//          title: new showtime.RichText('Карусель'),
          title: new RichText('Карусель'),
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
        });
      }
    }
    var cat = html.match(/<ul class="hmenu.*?fx-row to-mob">[\s\S]*?<li><a href.*?>[^"]+<\/a>[\s\S]*?<\/header>|<(div class="ft-col ft-menu"|tbody)>[\s\S]*?<(li|td)><a href.*?>[^"]+<\/a>[\s\S]*?<\/(footer|tbody)>/);
    if (cat) {
//      page.appendItem('', 'separator', {title: ''});
      page.appendItem(PREFIX + ':catbrowse:' + REFERER + '~' + 'Категории', 'directory', {
//      page.appendItem(PREFIX + ':catbrowse:' + REFERER + '~' + 'Категории', 'video', {
//      page.appendItem(PREFIX + ':catbrowse:' + REFERER + '~' + 'Категории', service.list, {
//        title: new showtime.RichText('Категории ►'),
        title: new RichText('Категории ►'),
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
        icon: LOGOFOLDER,
//        icon: LOGOARROW,
//        icon: '',
      });
    }
*/
/*
  if (loginstate) {
//    page.appendItem('', 'separator', {title: ''});
    page.appendItem(PREFIX + ':logout', 'directory', {
//    page.appendItem(PREFIX + ':logout', 'video', {
//    page.appendItem(PREFIX + ':logout', service.list, {
//      title: new showtime.RichText(coloredStr('Выйти', red)),
      title: new RichText(coloredStr('Выйти', red)),
//      title: new showtime.RichText(coloredStr('Выйти из ' + TTL, red)),
//      title: new RichText(coloredStr('Выйти из ' + TTL, red)),
//      title: new showtime.RichText(coloredStr('Выйти [ ' + user + ' ]', red)),
//      title: new RichText(coloredStr('Выйти [ ' + user + ' ]', red)),
//      title: new showtime.RichText(coloredStr('Пользователь [ ' + user + ' ]', red)),
//      title: new RichText(coloredStr('Пользователь [ ' + user + ' ]', red)),
//      title: new showtime.RichText(coloredStr('Выйти из аккаунта ' + user, red)),
//      title: new RichText(coloredStr('Выйти из аккаунта ' + user, red)),
//      icon: avatar,
//      icon: LOGOAVATAR,
//      icon: LOGOAVATARS,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: LOGOARROW,
      icon: LOGOEXIT,
//      icon: '',
    });
  }
*/
  page.loading = false;
});
//plugin.addURI(PREFIX + ':login', function (page, showAuth, token) {
new page.Route(PREFIX + ':login', function (page, showAuth, token) {
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, TTL);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
  page.metadata.title = TTL;
  var name;
//  name = BASE_URL;
//  name = HTTPS + BASE_URL;
//  name = TTL + ' (' + BASE_URL + ')';
  name = TTL + ' (' + HTTPS + BASE_URL + ')';
//  name = 'Войти в ' + TTL + ' (' + BASE_URL + ')';
//  name = 'Войти в ' + TTL + ' (' + HTTPS + BASE_URL + ')';
  var text;
//  text = 'Требуется авторизация';
//  text = 'Введите логин и пароль';
//  text = 'Введите e-mail и пароль';
  text = 'Требуется авторизация, введите логин и пароль';
//  text = 'Требуется авторизация, введите e-mail и пароль';
//  var credentials = plugin.getAuthCredentials(name, text, 1, null, true);
  var credentials = popup.getAuthCredentials(name, text, 1, null, true);
//  REFERER = showtime.entityDecode(REFERER);
//  REFERER = unescape(REFERER);
//  REFERER = decodeURIComponent(REFERER);
  var url;
  url = REFERER;
//  url = REFERER + '?do=login';
//  url = REFERER + 'index.php?do=login';
//  url = REFERER + '?action=login';
//  url = REFERER + 'index.php?action=login';
//  if (credentials.rejected) return 'Rejected by user';
//  if (credentials.rejected) {return 'Rejected by user'};
  if (credentials.rejected) {return page.redirect(PREFIX + ':start')};
  if (credentials.username !== '' && credentials.password !== '') {
//    var ent = showtime.httpReq(url, {
    var ent = http.request(url, {
      debug: true,
//      debug: false,
      noFollow: true,
//      noFollow: false,
      noFail: true,
//      noFail: false,
//      compression: true,
//      compression: false,
//      caching: true,
//      caching: false,
//      cacheTime: 3600,
//      cacheTime: 6000,
//      postdata: postdata,
      postdata: {
        login_name: credentials.username,
//        login_username: credentials.username,
//        username: credentials.username,
//        name: credentials.username,
        login_password: credentials.password,
//        password: credentials.password,
//        login: 'Вход',
//        login: escape('Вход'),
//        login: encodeURIComponent('Вход'),
        login: 'submit',
//        login: 1,
//        autologin: 1,
      },
//      headers: headers,
      headers: {
//        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
//        'Accept-Language': 'en-US,en;q=0.8,ru;q=0.6',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-control': 'no-cache',
//        'Content-Type': 'application/x-mpegURL',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': UA,
        'Referer': REFERER,
      },
    });
//    }).toString();
//    }).convertFromEncoding('utf-8').toString();
//    }).convertFromEncoding('windows-1251').toString();
    console.error('status code:' + ent.statuscode);
    if (ent.statuscode == '200') {
      console.log('status 200');
    }
  }
  page.redirect(PREFIX + ':start');
});
//plugin.addURI(PREFIX + ':logout', function (page) {
new page.Route(PREFIX + ':logout', function (page) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, TTL);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
  page.metadata.title = TTL;
//  REFERER = showtime.entityDecode(REFERER);
//  REFERER = unescape(REFERER);
//  REFERER = decodeURIComponent(REFERER);
  var url;
  url = REFERER + '?action=logout';
//  url = REFERER + 'index.php?action=logout';
//  showtime.httpReq(url);
  http.request(url);
  page.loading = false;
  page.redirect(PREFIX + ':start');
});
//plugin.addURI(PREFIX + ':search:(.*)', function (page, query) {
new page.Route(PREFIX + ':search:(.*)', function (page, query) {
  page.loading = true;
//  query = showtime.entityDecode(query);
//  query = unescape(query);
//  query = decodeURIComponent(query);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, 'Результаты поиска для: ' + query + ' (' + page.entries + ')');
//  setPageHeader(page, 'Результаты поиска для: ' + query);
//  setPageHeader(page, 'Результат поиска по запросу : ' + query + ' (' + page.entries + ')');
//  setPageHeader(page, 'Результат поиска по запросу : ' + query);
//  page.metadata.logo = LOGO;
//  page.metadata.icon = LOGO;
//  page.metadata.title = 'Результаты поиска для: ' + query + ' (' + page.entries + ')';
  page.metadata.title = 'Результаты поиска для: ' + query;
//  page.metadata.title = 'Результат поиска по запросу : ' + query + ' (' + page.entries + ')';
//  page.metadata.title = 'Результат поиска по запросу : ' + query;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
//  page.model.contents = 'results';
  search(page, query);
  page.loading = false;
});
//plugin.addSearcher(PREFIX, LOGO, function (page, query) {
//new page.Searcher(PREFIX, LOGO, function (page, query) {
//plugin.addSearcher(PREFIX + ' - результат', LOGO, function (page, query) {
//new page.Searcher(PREFIX + ' - результат', LOGO, function (page, query) {
//plugin.addSearcher(TTL + ': результат', LOGO, function (page, query) {
new page.Searcher(TTL + ': результат', LOGO, function (page, query) {
  page.loading = true;
//  query = showtime.entityDecode(query);
//  query = unescape(query);
//  query = decodeURIComponent(query);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, TTL);
//  setPageHeader(page, TTL + ': результат');
//  setPageHeader(page, TTL + ': ' + query);
//  page.metadata.logo = LOGO;
//  page.metadata.icon = LOGO;
//  page.metadata.title = TTL;
//  page.metadata.title = TTL + ': результат';
  page.metadata.title = TTL + ': ' + query;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
//  page.model.contents = 'results';
  search(page, query);
  page.loading = false;
});
//plugin.addURI(PREFIX + ':browse:(.*)~(.*)', function (page, url, title) {
new page.Route(PREFIX + ':browse:(.*)~(.*)', function (page, url, title) {
  page.loading = true;
//  url = url + '///';
//  url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  page.entries = 0;
/*
//  var fromPage = 0;
  var fromPage = 1;
*/
  var tryToSearch = true;
  function loader() {
    if (!tryToSearch) return false;
    page.loading = true;
/*
    url = url + 'page/' + fromPage + '/';
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
*/
/*
//    html = showtime.httpReq(url).toString();
    html = http.request(url).toString();
*/
//    html = showtime.httpReq(url, {
    html = http.request(url, {
      debug: true,
//      debug: false,
//      noFollow: true,
//      noFollow: false,
      noFail: true,
//      noFail: false,
      compression: true,
//      compression: false,
//      caching: true,
//      caching: false,
//      cacheTime: 3600,
//      cacheTime: 6000,
//      postdata: postdata,
//      postdata: {},
//      headers: headers,
//      headers: {},
//    });
    }).toString();
//    }).convertFromEncoding('utf-8').toString();
//    }).convertFromEncoding('windows-1251').toString();
    if (html) {
/*
      var name = html.match(/<h1.*?>([\s\S]*?)<\/h1>/);
//      var name = html.match(/<h1.*?>(.*?)<\/h1>/);
//      var name = html.match(/<h1.*?>([^"]+)<\/h1>/);
      try {
        name = name[1];
        name = name.replace(/ смотреть бесплатно.*?/g, '').trim();
      }
      catch (err) {
//        name = coloredStr('Неопределенное', red);
        name = title;
//        name = '';
      }
//      name = showtime.entityDecode(name);
//      name = unescape(name);
//      name = decodeURIComponent(name);
*/
      var pages = html.match(/(<div class="bot-.*?navigation"[\s\S]*?>Раньше<|<span class="navigation">).*?<(span|span style.*?)>(.*?)<\/span>/);
//      var pages = html.match(/(<div class="bot-.*?navigation"[\s\S]*?>Раньше<|<span class="navigation">).*?<(span|span style.*?)>([^"]+)<\/span>/);
      try {
        pages = pages[3];
      }
      catch (err) {
//        pages = 0;
//        pages = 1;
        pages = '';
      }
//      pages = showtime.entityDecode(pages);
//      pages = unescape(pages);
//      pages = decodeURIComponent(pages);
      page.loading = false;
      page.appendItem('', 'separator', {
//        title: new showtime.RichText(title),
//        title: new RichText(title),
//        title: new showtime.RichText(coloredStr(title, gray)),
//        title: new RichText(coloredStr(title, gray)),
//        title: new showtime.RichText(title + ' (' + fromPage + ')'),
//        title: new RichText(title + ' (' + fromPage + ')'),
//        title: new showtime.RichText(coloredStr(title + ' (' + fromPage + ')', gray)),
//        title: new RichText(coloredStr(title + ' (' + fromPage + ')', gray)),
//        title: new showtime.RichText(coloredStr(title, gray) + ' ' + colorStr(fromPage, gray)),
//        title: new RichText(coloredStr(title, gray) + ' ' + colorStr(fromPage, gray)),
//        title: new showtime.RichText(title + ' ' + (pages ? '(' + pages + ')' : '')),
//        title: new RichText(title + ' ' + (pages ? '(' + pages + ')' : '')),
//        title: new showtime.RichText(coloredStr(title, gray) + ' ' + (pages ? colorStr(pages, gray) : '')),
        title: new RichText(coloredStr(title, gray) + ' ' + (pages ? colorStr(pages, gray) : '')),
//        title: new showtime.RichText(name ? name : ''),
//        title: new RichText(name ? name : ''),
//        title: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//        title: new RichText(name ? coloredStr(name, gray) : ''),
//        title: new showtime.RichText(name ? name + ' (' + fromPage + ')' : ''),
//        title: new RichText(name ? name + ' (' + fromPage + ')' : ''),
//        title: new showtime.RichText((name ? name + ' ' : '') + '(' + fromPage + ')'),
//        title: new RichText((name ? name + ' ' : '') + '(' + fromPage + ')'),
//        title: new showtime.RichText(name ? coloredStr(name + ' (' + fromPage + ')', gray) : ''),
//        title: new RichText(name ? coloredStr(name + ' (' + fromPage + ')', gray) : ''),
//        title: new showtime.RichText((name ? coloredStr(name, gray) + ' ' : '') + colorStr(fromPage, gray)),
//        title: new RichText((name ? coloredStr(name, gray) + ' ' : '') + colorStr(fromPage, gray)),
//        title: new showtime.RichText((name ? name + ' ' : '') + (pages ? '(' + pages + ')' : '')),
//        title: new RichText((name ? name + ' ' : '') + (pages ? '(' + pages + ')' : '')),
//        title: new showtime.RichText((name ? coloredStr(name, gray) + ' ' : '') + (pages ? colorStr(pages, gray) : '')),
//        title: new RichText((name ? coloredStr(name, gray) + ' ' : '') + (pages ? colorStr(pages, gray) : '')),
      });
      var scr = html.replace(/<div class=.*?carousel.*?>[\s\S]*?class="(carousel_next carousel_right|footer|footer-text|site-desc clearfix|cols clearfix|cols fx-row center)"/g, '').trim();
      scraper(page, scr);
//      scraper(page, html);
//      var more = html.match(/(<div class="bot-.*?navigation"[\s\S]*?>Раньше<|<span class="navigation">|<span class="pnext">|)(.*?<span>.*?<\/span> |.*?<span style.*?>.*?<\/span> |.*?<\/a>  |.*?<\/a>|)<a href=( '|'| "|"| |)(.*?)('|"| )(><span class="pnext">|)/);
      var more = html.match(/(<div class="bot-.*?navigation"[\s\S]*?>Раньше<|<span class="navigation">).*?<(span|span style.*?)>.*?<\/span> <a href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = html.match(/(<div class="bot-.*?navigation"[\s\S]*?>Раньше<|<span class="navigation">).*?<(span|span style.*?)>.*?<\/span> <a href=( '|'| "|"| |)([^"]+)('|"| )/);
      if (!more) return tryToSearch = false;
      try {
        url = more[4];
        url = url.replace(/('|"| )/g, '').trim();
        if (/http.*?:\/\//.test(url)) {
          url = url;
        }
        else {
          url = HTTPS + BASE_URL + url;
//          url = HTTPS + BASE_URL + '///' + url;
        }
//        url = url + '///';
//        url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      }
      catch (err) {
        url = '';
      }
//      url = showtime.entityDecode(url);
//      url = unescape(url);
//      url = decodeURIComponent(url);
/*
//      if (!html.match(/(<div class="bot-.*?navigation"[\s\S]*?>Раньше<|<span class="navigation">|<span class="pnext">|)(.*?<span>.*?<\/span> |.*?<span style.*?>.*?<\/span> |.*?<\/a>  |.*?<\/a>|)<a href.*?(><span class="pnext">|)/)) return tryToSearch = false;
      if (!html.match(/(<div class="bot-.*?navigation"[\s\S]*?>Раньше<|<span class="navigation">).*?<(span|span style.*?)>.*?<\/span> <a href/)) return tryToSearch = false;
      fromPage++;
*/
      return true;
    }
  };
  loader();
  page.paginator = loader;
  page.loading = false;
});
//plugin.addURI(PREFIX + ':xbrowse:(.*)~(.*)', function (page, url, title) {
new page.Route(PREFIX + ':xbrowse:(.*)~(.*)', function (page, url, title) {
  page.loading = true;
//  url = url + '///';
//  url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  if (html) {
    var re = /<div class="sect-header fx-row fx-middle fx-start">([\s\S]*?)class="sect-title">(.*?)<span([\s\S]*?)<(div class="sect"|div class="desc-text clearfix"|\/main)>/g;
//    var re = /<div class="sect-header fx-row fx-middle fx-start">([\s\S]*?)class="sect-title">([^"]+)<span([\s\S]*?)<(div class="sect"|div class="desc-text clearfix"|\/main)>/g;
    var match = re.exec(html);
    while (match) {
      try {
        var name = match[2];
      }
      catch (err) {
//        name = coloredStr('Неопределенное', red);
        name = title;
//        name = '';
      }
//      name = showtime.entityDecode(name);
//      name = unescape(name);
//      name = decodeURIComponent(name);
      page.appendItem('', 'separator', {
//        title: new showtime.RichText(title),
//        title: new RichText(title),
//        title: new showtime.RichText(coloredStr(title, gray)),
//        title: new RichText(coloredStr(title, gray)),
//        title: new showtime.RichText(name ? name : ''),
//        title: new RichText(name ? name : ''),
//        title: new showtime.RichText(name ? coloredStr(name, gray) : ''),
        title: new RichText(name ? coloredStr(name, gray) : ''),
      });
      scraper(page, match[3]);
      var more = match[1].match(/href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = match[1].match(/href=( '|'| "|"| |)([^"]+)('|"| )/);
      if (more) {
        try {
          var xurl = more[2];
          xurl = xurl.replace(/('|"| )/g, '').trim();
          if (/http.*?:\/\//.test(xurl)) {
            xurl = xurl;
          }
          else {
//            xurl = HTTPS + BASE_URL + xurl;
            xurl = HTTPS + BASE_URL + '///' + xurl;
          }
          xurl = xurl + '///';
          xurl = xurl.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
        }
        catch (err) {
          xurl = '';
        }
//        xurl = showtime.entityDecode(xurl);
//        xurl = unescape(xurl);
//        xurl = decodeURIComponent(xurl);
        var uri;
        uri = PREFIX + ':browse:' + xurl + '~' + name;
//        uri = PREFIX + ':browse:' + escape(xurl) + '~' + escape(name);
//        uri = PREFIX + ':browse:' + encodeURIComponent(xurl) + '~' + encodeURIComponent(name);
        page.appendItem(uri, 'directory', {
//        page.appendItem(uri, 'video', {
//        page.appendItem(uri, service.list, {
//          title: new showtime.RichText('Всё ►'),
//          title: new RichText('Всё ►'),
//          title: new showtime.RichText('Больше ►'),
          title: new RichText('Больше ►'),
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
          icon: LOGOARROW,
//          icon: '',
        });
      }
      match = re.exec(html);
    }
  }
  page.loading = false;
});
//plugin.addURI(PREFIX + ':carbrowse:(.*)~(.*)', function (page, url, title) {
new page.Route(PREFIX + ':carbrowse:(.*)~(.*)', function (page, url, title) {
  page.loading = true;
//  url = url + '///';
//  url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  var doc = html.match(/<div class=.*?carousel.*?>([\s\S]*?)class="(carousel_next carousel_right|footer|footer-text|site-desc clearfix|cols clearfix|cols fx-row center)"/);
  if (doc) {
    var car = doc[1].match(/"(inner|top-carou img-box|carou img-box)"[\s\S]*?<\/a>/);
    if (car) {
      scrapercar(page, doc[1]);
    }
  }
  page.loading = false;
});
//plugin.addURI(PREFIX + ':catbrowse:(.*)~(.*)', function (page, url, title) {
new page.Route(PREFIX + ':catbrowse:(.*)~(.*)', function (page, url, title) {
  page.loading = true;
//  url = url + '///';
//  url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  var doc = html.match(/<ul class="hmenu.*?fx-row to-mob">([\s\S]*?)<\/header>/);
  if (doc) {
    var cat = doc[1].match(/<li><a href.*?>[^"]+<\/a>/);
    if (cat) {
      page.appendItem('', 'separator', {
//        title: new showtime.RichText('Верхнее меню:'),
        title: new RichText('Верхнее меню:'),
      });
      scrapercat(page, doc[1]);
    }
  }
  var dom = html.match(/<(div class="ft-col ft-menu"|tbody)>([\s\S]*?)<\/(footer|tbody)>/);
  if (dom) {
    var cat = dom[2].match(/<(li|td)><a href.*?>[^"]+<\/a>/);
    if (cat) {
      page.appendItem('', 'separator', {
//        title: new showtime.RichText('Нижнее меню:'),
        title: new RichText('Нижнее меню:'),
      });
      scrapercat(page, dom[2]);
    }
  }
//  page.appendItem('', 'separator', {title: ''});
//  page.appendItem(PREFIX + ':browse:' + url + 'sf/' + '~' + 'Выборка', 'directory', {
//  page.appendItem(PREFIX + ':browse:' + url + 'sf/' + '~' + 'Выборка', 'video', {
//  page.appendItem(PREFIX + ':browse:' + url + 'sf/' + '~' + 'Выборка', service.list, {
  page.appendItem(PREFIX + ':browse:' + url + 'sf/sort=date/order=desc/' + '~' + 'Выборка', 'directory', {
//  page.appendItem(PREFIX + ':browse:' + url + 'sf/sort=date/order=desc/' + '~' + 'Выборка', 'video', {
//  page.appendItem(PREFIX + ':browse:' + url + 'sf/sort=date/order=desc/' + '~' + 'Выборка', service.list, {
//    title: new showtime.RichText('Выборка ►'),
    title: new RichText('Выборка ►'),
//    icon: LOGOICON,
//    icon: LOGOLOGO,
//    icon: LOGONONE,
    icon: LOGOFOLDER,
//    icon: LOGOARROW,
//    icon: '',
  });
//  page.appendItem('', 'separator', {title: ''});
//  page.appendItem(PREFIX + ':browse:' + url + 'f/' + '~' + 'Всё', 'directory', {
//  page.appendItem(PREFIX + ':browse:' + url + 'f/' + '~' + 'Всё', 'video', {
//  page.appendItem(PREFIX + ':browse:' + url + 'f/' + '~' + 'Всё', service.list, {
  page.appendItem(PREFIX + ':browse:' + url + 'f/sort=date/order=desc/' + '~' + 'Всё', 'directory', {
//  page.appendItem(PREFIX + ':browse:' + url + 'f/sort=date/order=desc/' + '~' + 'Всё', 'video', {
//  page.appendItem(PREFIX + ':browse:' + url + 'f/sort=date/order=desc/' + '~' + 'Всё', service.list, {
//    title: new showtime.RichText('Всё ►'),
    title: new RichText('Всё ►'),
//    icon: LOGOICON,
//    icon: LOGOLOGO,
//    icon: LOGONONE,
    icon: LOGOFOLDER,
//    icon: LOGOARROW,
//    icon: '',
  });
  page.loading = false;
});
//plugin.addURI(PREFIX + ':moviepage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':moviepage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  var doc;
/*
//  doc = showtime.httpReq(url).toString();
  doc = http.request(url).toString();
*/
//  doc = showtime.httpReq(url, {
  doc = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
/*
  var pagedetails = doc.match(/<div id='dle-content'>([\s\S]*?)class="tabs.*?">/)[1];
*/
//  icon = void(0);
//  icon = icon;
  try {
    icon = icon;
//    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(icon)) {
    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(icon) && !/\.webp/.test(icon)) {
      icon = icon;
    }
    else {
//      icon = poster;
//      icon = screenshot;
      icon = LOGOICON;
//      icon = LOGOLOGO;
//      icon = LOGONONE;
//      icon = '';
    }
  }
  catch (err) {
//    icon = poster;
//    icon = screenshot;
    icon = LOGOICON;
//    icon = LOGOLOGO;
//    icon = LOGONONE;
//    icon = '';
  }
//  var fposter = doc.match(/<div class="fposter img-wide".*?>[\s\S]*?<img([\s\S]*?)<\/div>/);
  var fposter = doc.match(/("fullimg"|"kino-desc__img-box")([\s\S]*?)"description"/);
  var poster = void(0);
  try {
    var expressions = [
      /href=( '|'| "|"| |)(.*?)('|"| )/,
//      /<div class="fposter img-wide".*?>[\s\S]*?<img.*?data-src=( '|'| "|"| |)(.*?)('|"| )/,
      /data-src=( '|'| "|"| |)(.*?)('|"| )/,
//      /<div class="fposter img-wide".*?>[\s\S]*?<img.*?src=( '|'| "|"| |)(.*?)('|"| )/,
      /src=( '|'| "|"| |)(.*?)('|"| )/,
    ],
    i, length = expressions.length;
    for (i = 0; i < length; i++) {
//      poster = doc.match(expressions[i]);
//      poster = fposter[1].match(expressions[i]);
      poster = fposter[2].match(expressions[i]);
      if (poster) {
        poster = poster[2];
        break;
      }
    }
    poster = poster.replace(/('|"| )/g, '').trim();
    if (/http.*?:\/\//.test(poster)) {
      poster = poster;
    }
    else {
      poster = HTTPS + BASE_URL + poster;
//      poster = HTTPS + BASE_URL + '///' + poster;
    }
//    poster = poster.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(poster)) {
    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(poster) && !/\.webp/.test(poster)) {
      poster = poster;
    }
    else {
      poster = icon;
//      poster = screenshot;
//      poster = LOGOICON;
//      poster = LOGOLOGO;
//      poster = LOGONONE;
//      poster = '';
    }
  }
  catch (err) {
    poster = icon;
//    poster = screenshot;
//    poster = LOGOICON;
//    poster = LOGOLOGO;
//    poster = LOGONONE;
//    poster = '';
  }
//  poster = showtime.entityDecode(poster);
//  poster = unescape(poster);
//  poster = decodeURIComponent(poster);
/*
//  var poster = doc.match(/<div class="fposter img-wide".*?>[\s\S]*?<img.*?data-src=( '|'| "|"| |)(.*?)('|"| )/);
//  var poster = doc.match(/<div class="fposter img-wide".*?>[\s\S]*?<img.*?data-src=( '|'| "|"| |)([^"]+)('|"| )/);
//  var poster = doc.match(/<div class="fposter img-wide".*?>[\s\S]*?<img.*?src=( '|'| "|"| |)(.*?)('|"| )/);
//  var poster = doc.match(/<div class="fposter img-wide".*?>[\s\S]*?<img.*?src=( '|'| "|"| |)([^"]+)('|"| )/);
  try {
//    poster = poster[2];
//    poster = fposter[1].match(/data-src=[ '|'| "|"| |]+(.*?)('|"| )/)[1];
//    poster = fposter[1].match(/data-src=[ '|'| "|"| |]+([^"]+)('|"| )/)[1];
//    poster = fposter[1].match(/data-src=( '|'| "|"| |)(.*?)('|"| )/)[2];
//    poster = fposter[1].match(/data-src=( '|'| "|"| |)([^"]+)('|"| )/)[2];
//    poster = fposter[1].match(/src=[ '|'| "|"| |]+(.*?)('|"| )/)[1];
//    poster = fposter[1].match(/src=[ '|'| "|"| |]+([^"]+)('|"| )/)[1];
    poster = fposter[1].match(/src=( '|'| "|"| |)(.*?)('|"| )/)[2];
//    poster = fposter[1].match(/src=( '|'| "|"| |)([^"]+)('|"| )/)[2];
    poster = poster.replace(/('|"| )/g, '').trim();
    if (/http.*?:\/\//.test(poster)) {
      poster = poster;
    }
    else {
      poster = HTTPS + BASE_URL + poster;
//      poster = HTTPS + BASE_URL + '///' + poster;
    }
//    poster = poster.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(poster)) {
      poster = poster;
    }
    else {
      poster = icon;
//      poster = screenshot;
//      poster = LOGOICON;
//      poster = LOGOLOGO;
//      poster = LOGONONE;
//      poster = '';
    }
  }
  catch (err) {
    poster = icon;
//    poster = screenshot;
//    poster = LOGOICON;
//    poster = LOGOLOGO;
//    poster = LOGONONE;
//    poster = '';
  }
//  poster = showtime.entityDecode(poster);
//  poster = unescape(poster);
//  poster = decodeURIComponent(poster);
*/
//  var screenshots = doc.match(/<div class="fposter img-wide".*?>[\s\S]*?<img([\s\S]*?)<\/div>/);
  var screenshots = doc.match(/("fullimg"|"kino-desc__img-box")([\s\S]*?)"description"/);
  var backdrops = [];
  if (screenshots) {
//    var re = /src=[ '|'| "|"| |]+(.*?)('|"| )/g;
//    var re = /src=[ '|'| "|"| |]+([^"]+)('|"| )/g;
//    var re = /src=( '|'| "|"| |)(.*?)('|"| )/g;
//    var re = /src=( '|'| "|"| |)([^"]+)('|"| )/g;
    var re = /(href|src)=( '|'| "|"| |)(.*?)('|"| )/g;
    var match = re.exec(screenshots[1]);
    while (match) {
      try {
//        var screenshot = match[1];
//        var screenshot = match[2];
        var screenshot = match[3];
        screenshot = screenshot.replace(/('|"| )/g, '').trim();
        if (/http.*?:\/\//.test(screenshot)) {
          screenshot = screenshot;
        }
        else {
          screenshot = HTTPS + BASE_URL + screenshot;
//          screenshot = HTTPS + BASE_URL + '///' + screenshot;
        }
//        screenshot = screenshot.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//        if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(screenshot)) {
        if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(screenshot) && !/\.webp/.test(screenshot)) {
          screenshot = screenshot;
        }
        else {
//          screenshot = icon;
          screenshot = poster;
//          screenshot = LOGOICON;
//          screenshot = LOGOLOGO;
//          screenshot = LOGONONE;
//          screenshot = '';
        }
      }
      catch (err) {
//        screenshot = icon;
        screenshot = poster;
//        screenshot = LOGOICON;
//        screenshot = LOGOLOGO;
//        screenshot = LOGONONE;
//        screenshot = '';
      }
//      screenshot = showtime.entityDecode(screenshot);
//      screenshot = unescape(screenshot);
//      screenshot = decodeURIComponent(screenshot);
//      backdrops.push({url: icon});
//      backdrops.push({url: poster});
      backdrops.push({url: screenshot});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
      match = re.exec(screenshots[1]);
    }
  }
  else {
    try {
//      backdrops.push({url: icon});
      backdrops.push({url: poster});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
    }
    catch (err) {
      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: ''});
    }
  }
/*
//  var status = doc.match(/<li><span>Статус.*?:<\/span> <span class=".*?">(.*?)<\/span><\/li>/);
//  var status = doc.match(/<li><span>Статус.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var status = doc.match(/<li><span>Статус.*?> (.*?)<\/(span|li)>/);
  var status = doc.match(/<li><span>Статус.*?>(.*?)<\/(span|li)>/);
//  var status = doc.match(/<li><span>Статус.*?>([^"]+)<\/(span|li)>/);
  try {
    status = status[1];
    status = status.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    status = serie;
    status = '';
  }
//  status = showtime.entityDecode(status);
//  status = unescape(status);
//  status = decodeURIComponent(status);
  var serie = doc.match(/<div class="th-series">(.*?)<\/div>/);
//  var serie = doc.match(/<div class="th-series">([^"]+)<\/div>/);
//  var serie = doc.match(/<div class="th-series.*?">(.*?)<\/div>/);
//  var serie = doc.match(/<div class="th-series.*?">([^"]+)<\/div>/);
  try {
    serie = serie[1];
    serie = serie.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    serie = status;
//    serie = '';
  }
//  serie = showtime.entityDecode(serie);
//  serie = unescape(serie);
//  serie = decodeURIComponent(serie);
//  var age = doc.match(/<div class="th-series">(.*?)<\/div>/);
//  var age = doc.match(/<div class="th-series">([^"]+)<\/div>/);
  var age = doc.match(/<div class="th-series.*?">(.*?)<\/div>/);
//  var age = doc.match(/<div class="th-series.*?">([^"]+)<\/div>/);
  try {
    age = age[1];
    age = age.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    age = '';
  }
//  age = showtime.entityDecode(age);
//  age = unescape(age);
//  age = decodeURIComponent(age);
//  var add = doc.match(/<li><span>.*?[обавил|бновил]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var add = doc.match(/<li><span>.*?[обавил|бновил]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var add = doc.match(/<li><span>.*?(обавил|бновил).*?> (.*?)<\/li>/);
  var add = doc.match(/<li><span>.*?(обавил|бновил).*?>(.*?)<\/li>/);
//  var add = doc.match(/<li><span>.*?(обавил|бновил).*?>([^"]+)<\/li>/);
  try {
//    add = add[1];
    add = add[2];
    add = add.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    add = '';
  }
//  add = showtime.entityDecode(add);
//  add = unescape(add);
//  add = decodeURIComponent(add);
//  var date = doc.match(/<li><span>.*?[обавлен|бновл]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var date = doc.match(/<li><span>.*?[обавлен|бновл]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var date = doc.match(/<li><span>.*?(обавлен|бновл).*?> (.*?)<\/li>/);
  var date = doc.match(/<li><span>.*?(обавлен|бновл).*?>(.*?)<\/li>/);
//  var date = doc.match(/<li><span>.*?(обавлен|бновл).*?>([^"]+)<\/li>/);
  try {
//    date = date[1];
    date = date[2];
    date = date.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    date = '';
  }
//  date = showtime.entityDecode(date);
//  date = unescape(date);
//  date = decodeURIComponent(date);
*/
//  var qyear = doc.match(/<li><span>[Год|Дата|Премьера]+.*?:<\/span> <.*?>(.*?)<\/(span|li)>/);
//  var qyear = doc.match(/<li><span>(Год|Дата|Премьера).*?> (.*?)<\/(span|li)>/);
  var qyear = doc.match(/<li><span>(Год|Дата|Премьера).*?>(.*?)<\/(span|li)>/);
//  var qyear = doc.match(/<li><span>(Год|Дата|Премьера).*?>([^"]+)<\/(span|li)>/);
  try {
//    qyear = qyear[1];
    qyear = qyear[2];
    qyear = qyear.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    qyear = year;
    qyear = '';
  }
//  qyear = showtime.entityDecode(qyear);
//  qyear = unescape(qyear);
//  qyear = decodeURIComponent(qyear);
//  var year = doc.match(/<li><span>[Год|Дата|Премьера]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var year = doc.match(/<li><span>[Год|Дата|Премьера]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var year = doc.match(/<li><span>(Год|Дата|Премьера).*?> (.*?)<\/li>/);
  var year = doc.match(/<li><span>(Год|Дата|Премьера).*?>(.*?)<\/li>/);
//  var year = doc.match(/<li><span>(Год|Дата|Премьера).*?>([^"]+)<\/li>/);
  try {
//    year = year[1];
    year = year[2];
    year = year.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    year = qyear;
//    year = '';
  }
//  year = showtime.entityDecode(year);
//  year = unescape(year);
//  year = decodeURIComponent(year);
//  var country = doc.match(/<li><span>Страна.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var country = doc.match(/<li><span>Страна.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var country = doc.match(/<li><span>Страна.*?> (.*?)<\/(span|li)>/);
  var country = doc.match(/<li><span>Страна.*?>(.*?)<\/(span|li)>/);
//  var country = doc.match(/<li><span>Страна.*?>([^"]+)<\/(span|li)>/);
  try {
    country = country[1];
    country = country.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    country = '';
  }
//  country = showtime.entityDecode(country);
//  country = unescape(country);
//  country = decodeURIComponent(country);
  var fullname = doc.match(/<h1.*?>(.*?)<\/h1>/);
//  var fullname = doc.match(/<h1.*?>([^"]+)<\/h1>/);
  try {
    fullname = fullname[1];
    fullname = fullname.replace(/<.*?>/g, '').trim();
    fullname = fullname.replace(/( фильм| сериал| смотреть онлайн| смотреть Фильм онлайн| смотреть Сериал онлайн| смотреть Мультфильм онлайн| смотреть Аниме онлайн| на LordFilm| на LordFilms| на LordSerial| на LordSerials)/g, '').trim();
//    fullname = fullname.replace(/ \(.*\)/g, '').trim();
//    fullname = fullname.replace(/ \(.*?\)/g, '').trim();
//    fullname = fullname.replace(/(:|\(|\)|\[|\]|\||\\|\/)/g, ' ').trim();
    fullname = fullname.replace(/(&nbsp;|&quot;|&amp;|&raquo;)/g, ' ').trim();
    fullname = fullname.replace(/(    |   |  )/g, ' ').trim();
  }
  catch (err) {
    fullname = title;
//    fullname = name;
//    fullname = orname;
//    fullname = '';
  }
//  fullname = showtime.entityDecode(fullname);
//  fullname = unescape(fullname);
//  fullname = decodeURIComponent(fullname);
//  var orname = doc.match(/<li><span>.*?[ригинал|льтернатив]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var orname = doc.match(/<li><span>.*?[ригинал|льтернатив]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var orname = doc.match(/<li><span>.*?(ригинал|льтернатив).*?> (.*?)<\/li>/);
  var orname = doc.match(/<li><span>.*?(ригинал|льтернатив).*?>(.*?)<\/li>/);
//  var orname = doc.match(/<li><span>.*?(ригинал|льтернатив).*?>([^"]+)<\/li>/);
  try {
//    orname = orname[1];
    orname = orname[2];
    orname = orname.replace(/<.*?>/g, '').trim();
//    orname = orname.replace(/ \(.*\)/g, '').trim();
//    orname = orname.replace(/ \(.*?\)/g, '').trim();
//    orname = orname.replace(/(:|\(|\)|\[|\]|\||\\|\/)/g, ' ').trim();
    orname = orname.replace(/(&nbsp;|&quot;|&amp;|&raquo;)/g, ' ').trim();
    orname = orname.replace(/(    |   |  )/g, ' ').trim();
  }
  catch (err) {
//    orname = title;
    orname = fullname;
//    orname = name;
//    orname = '';
  }
//  orname = showtime.entityDecode(orname);
//  orname = unescape(orname);
//  orname = decodeURIComponent(orname);
//  var name = doc.match(/<li><span>.*?азвание.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var name = doc.match(/<li><span>.*?азвание.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var name = doc.match(/<li><span>.*?азвание.*?> (.*?)<\/li>/);
  var name = doc.match(/<li><span>.*?азвание.*?>(.*?)<\/li>/);
//  var name = doc.match(/<li><span>.*?азвание.*?>([^"]+)<\/li>/);
  try {
    name = name[1];
    name = name.replace(/<.*?>/g, '').trim();
//    name = name.replace(/ \(.*\)/g, '').trim();
//    name = name.replace(/ \(.*?\)/g, '').trim();
//    name = name.replace(/(:|\(|\)|\[|\]|\||\\|\/)/g, ' ').trim();
    name = name.replace(/(&nbsp;|&quot;|&amp;|&raquo;)/g, ' ').trim();
    name = name.replace(/(    |   |  )/g, ' ').trim();
  }
  catch (err) {
//    name = title;
//    name = fullname;
    name = orname;
//    name = '';
  }
//  name = showtime.entityDecode(name);
//  name = unescape(name);
//  name = decodeURIComponent(name);
  var query = void(0);
  try {
    query = title;
//    query = title + ' ' + year;
//    query = title + ' ' + qyear;
//    query = fullname;
//    query = fullname + ' ' + year;
//    query = fullname + ' ' + qyear;
//    query = orname;
//    query = orname + ' ' + year;
//    query = orname + ' ' + qyear;
//    query = name;
//    query = name + ' ' + year;
//    query = name + ' ' + qyear;
//    query = query.replace(/ \(.*\)/g, '').trim();
    query = query.replace(/ \(.*?\)/g, '').trim();
    query = query.replace(/(:|\(|\)|\[|\]|\||\\|\/)/g, ' ').trim();
    query = query.replace(/(&nbsp;|&quot;|&amp;|&raquo;)/g, ' ').trim();
    query = query.replace(/(    |   |  )/g, ' ').trim();
//    query = query.replace(/ /g, '+').trim();
//    query = query.replace(/\s/g, '\+').trim();
  }
  catch (err) {
//    query = xquery;
    query = '';
  }
//  query = showtime.entityDecode(query);
//  query = unescape(query);
//  query = decodeURIComponent(query);
//  query = utf8to1251urlencode(query);
//  query = utf8to1251decode(query);
//  query = escape(query);
//  query = encodeURIComponent(query);
  var xquery = void(0);
  try {
//    xquery = title;
//    xquery = title + ' ' + year;
    xquery = title + ' ' + qyear;
//    xquery = fullname;
//    xquery = fullname + ' ' + year;
//    xquery = fullname + ' ' + qyear;
//    xquery = orname;
//    xquery = orname + ' ' + year;
//    xquery = orname + ' ' + qyear;
//    xquery = name;
//    xquery = name + ' ' + year;
//    xquery = name + ' ' + qyear;
//    xquery = xquery.replace(/ \(.*\)/g, '').trim();
    xquery = xquery.replace(/ \(.*?\)/g, '').trim();
    xquery = xquery.replace(/(:|\(|\)|\[|\]|\||\\|\/)/g, ' ').trim();
    xquery = xquery.replace(/(&nbsp;|&quot;|&amp;|&raquo;)/g, ' ').trim();
    xquery = xquery.replace(/(    |   |  )/g, ' ').trim();
//    xquery = xquery.replace(/ /g, '+').trim();
//    xquery = xquery.replace(/\s/g, '\+').trim();
  }
  catch (err) {
    xquery = query;
//    xquery = '';
  }
//  xquery = showtime.entityDecode(xquery);
//  xquery = unescape(xquery);
//  xquery = decodeURIComponent(xquery);
//  xquery = utf8to1251urlencode(xquery);
//  xquery = utf8to1251decode(xquery);
//  xquery = escape(xquery);
//  xquery = encodeURIComponent(xquery);
  var description = void(0);
  try {
    var expressions = [
      /<li><span>Описани.*?:<\/span> <.*?>(.*?)<\/span><\/li>/,
      /<li><span>Описани.*?> (.*?)<\/(span|li)>/,
      /<li><span>Описани.*?>(.*?)<\/(span|li)>/,
      /<div class="fdesc clearfix.*?>([\S\s]*?)<(script|\/div)>/,
      /<h2.*?>([\S\s]*?)<(script|\/div)>/,
    ],
    i, length = expressions.length;
    for (i = 0; i < length; i++) {
      description = doc.match(expressions[i]);
      if (description) {
        description = description[1];
        break;
      }
    }
    description = description.replace(/(<.*?>|<br>|Описание:)/g, '').trim();
    description = description.replace(/(    |   |  )/g, ' ').trim();
  }
  catch (err) {
    description = '';
  }
//  description = showtime.entityDecode(description);
//  description = unescape(description);
//  description = decodeURIComponent(description);
/*
//  var x0description = doc.match(/<h2.*?<\/h2>([\S\s]*?)<(script|\/div)>/);
  var x0description = doc.match(/<h2.*?>([\S\s]*?)<(script|\/div)>/);
  try {
    x0description = x0description[1];
    x0description = x0description.replace(/(<.*?>|<br>|Описание:)/g, '').trim();
    x0description = x0description.replace(/(    |   |  )/g, ' ').trim();
  }
  catch (err) {
//    x0description = description;
//    x0description = xdescription;
    x0description = '';
  }
//  x0description = showtime.entityDecode(x0description);
//  x0description = unescape(x0description);
//  x0description = decodeURIComponent(x0description);
//  var xdescription = doc.match(/<div class="fdesc clearfix slice-this".*?>([\S\s]*?)<(script|\/div)>/);
  var xdescription = doc.match(/<div class="fdesc clearfix.*?>([\S\s]*?)<(script|\/div)>/);
  try {
    xdescription = xdescription[1];
    xdescription = xdescription.replace(/(<.*?>|<br>|Описание:)/g, '').trim();
    xdescription = xdescription.replace(/(    |   |  )/g, ' ').trim();
  }
  catch (err) {
//    xdescription = description;
    xdescription = x0description;
//    xdescription = '';
  }
//  xdescription = showtime.entityDecode(xdescription);
//  xdescription = unescape(xdescription);
//  xdescription = decodeURIComponent(xdescription);
//  var description = doc.match(/<li><span>Описани.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var description = doc.match(/<li><span>Описани.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var description = doc.match(/<li><span>Описани.*?> (.*?)<\/(span|li)>/);
  var description = doc.match(/<li><span>Описани.*?>(.*?)<\/(span|li)>/);
//  var description = doc.match(/<li><span>Описани.*?>([^"]+)<\/(span|li)>/);
  try {
    description = description[1];
    description = description.replace(/<.*?>/g, '').trim();
    description = description.replace(/(    |   |  )/g, ' ').trim();
  }
  catch (err) {
    description = xdescription;
//    description = x0description;
//    description = '';
  }
//  description = showtime.entityDecode(description);
//  description = unescape(description);
//  description = decodeURIComponent(description);
*/
//  var slogan = doc.match(/<li><span>Слоган.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var slogan = doc.match(/<li><span>Слоган.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var slogan = doc.match(/<li><span>Слоган.*?> (.*?)<\/li>/);
  var slogan = doc.match(/<li><span>Слоган.*?>(.*?)<\/li>/);
//  var slogan = doc.match(/<li><span>Слоган.*?>([^"]+)<\/li>/);
  try {
    slogan = slogan[1];
    slogan = slogan.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    slogan = '';
  }
//  slogan = showtime.entityDecode(slogan);
//  slogan = unescape(slogan);
//  slogan = decodeURIComponent(slogan);
//  var genre = doc.match(/<li><span>[Жанр|Категори]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var genre = doc.match(/<li><span>[Жанр|Категори]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var genre = doc.match(/<li><span>(Жанр|Категори).*?> (.*?)<\/li>/);
  var genre = doc.match(/<li><span>(Жанр|Категори).*?>(.*?)<\/li>/);
//  var genre = doc.match(/<li><span>(Жанр|Категори).*?>([^"]+)<\/li>/);
  try {
//    genre = genre[1];
    genre = genre[2];
    genre = genre.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    genre = '';
  }
//  genre = showtime.entityDecode(genre);
//  genre = unescape(genre);
//  genre = decodeURIComponent(genre);
//  var channel = doc.match(/<li><span>Канал.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var channel = doc.match(/<li><span>Канал.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var channel = doc.match(/<li><span>Канал.*?> (.*?)<\/li>/);
  var channel = doc.match(/<li><span>Канал.*?>(.*?)<\/li>/);
//  var channel = doc.match(/<li><span>Канал.*?>([^"]+)<\/li>/);
  try {
    channel = channel[1];
    channel = channel.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    channel = '';
  }
//  channel = showtime.entityDecode(channel);
//  channel = unescape(channel);
//  channel = decodeURIComponent(channel);
//  var compilation = doc.match(/<li><span>.*?одбор.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var compilation = doc.match(/<li><span>.*?одбор.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var compilation = doc.match(/<li><span>.*?одбор.*?> (.*?)<\/li>/);
  var compilation = doc.match(/<li><span>.*?одбор.*?>(.*?)<\/li>/);
//  var compilation = doc.match(/<li><span>.*?одбор.*?>([^"]+)<\/li>/);
  try {
    compilation = compilation[1];
    compilation = compilation.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    compilation = '';
  }
//  compilation = showtime.entityDecode(compilation);
//  compilation = unescape(compilation);
//  compilation = decodeURIComponent(compilation);
//  var director = doc.match(/<li><span>Режисс[е|ё]+р.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var director = doc.match(/<li><span>Режисс[е|ё]+р.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var director = doc.match(/<li><span>Режисс(е|ё)р.*?> (.*?)<\/li>/);
  var director = doc.match(/<li><span>Режисс(е|ё)р.*?>(.*?)<\/li>/);
//  var director = doc.match(/<li><span>Режисс(е|ё)р.*?>([^"]+)<\/li>/);
  try {
//    director = director[1];
    director = director[2];
    director = director.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    director = '';
  }
//  director = showtime.entityDecode(director);
//  director = unescape(director);
//  director = decodeURIComponent(director);
//  var actor = doc.match(/<li><span>[Акт|.*?рол]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var actor = doc.match(/<li><span>[Акт|.*?рол]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var actor = doc.match(/<li><span>(Акт|.*?рол).*?> (.*?)<\/li>/);
  var actor = doc.match(/<li><span>(Акт|.*?рол).*?>(.*?)<\/li>/);
//  var actor = doc.match(/<li><span>(Акт|.*?рол).*?>([^"]+)<\/li>/);
  try {
//    actor = actor[1];
    actor = actor[2];
    actor = actor.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    actor = '';
  }
//  actor = showtime.entityDecode(actor);
//  actor = unescape(actor);
//  actor = decodeURIComponent(actor);
//  var translation = doc.match(/<li>.*?<span>.*?[звуч|еревод]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var translation = doc.match(/<li>.*?<span>.*?[звуч|еревод]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var translation = doc.match(/<li>.*?<span>.*?(звуч|еревод).*?> (.*?)<\/li>/);
//  var translation = doc.match(/<li>.*?<span>.*?(звуч|еревод).*?>(.*?)<\/li>/);
//  var translation = doc.match(/<li>.*?<span>.*?(звуч|еревод).*?>([^"]+)<\/li>/);
  var translation = doc.match(/<span>.*?(звуч|еревод).*?>(.*?)<\/li>/);
//  var translation = doc.match(/<span>.*?(звуч|еревод).*?>([^"]+)<\/li>/);
  try {
//    translation = translation[1];
    translation = translation[2];
    translation = translation.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    translation = '';
  }
//  translation = showtime.entityDecode(translation);
//  translation = unescape(translation);
//  translation = decodeURIComponent(translation);
//  var type = doc.match(/<li><span>.*?ачеств.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var type = doc.match(/<li><span>.*?ачеств.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var type = doc.match(/<li><span>.*?ачеств.*?> (.*?)<\/li>/);
//  var type = doc.match(/<li><span>.*?ачеств.*?>(.*?)<\/li>/);
//  var type = doc.match(/<li><span>.*?ачеств.*?>([^"]+)<\/li>/);
  var type = doc.match(/<li><span>.*?ачеств.*?:(.*?)<\/li>/);
//  var type = doc.match(/<li><span>.*?ачеств.*?:([^"]+)<\/li>/);
  try {
    type = type[1];
    type = type.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    type = quality;
    type = '';
  }
//  type = showtime.entityDecode(type);
//  type = unescape(type);
//  type = decodeURIComponent(type);
//  var quality = doc.match(/<li><span>.*?ачеств.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var quality = doc.match(/<li><span>.*?ачеств.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var quality = doc.match(/<li><span>.*?ачеств.*?> (.*?)<\/li>/);
//  var quality = doc.match(/<li><span>.*?ачеств.*?>(.*?)<\/li>/);
//  var quality = doc.match(/<li><span>.*?ачеств.*?>([^"]+)<\/li>/);
  var quality = doc.match(/<li><span>.*?ачеств.*?:(.*?)<\/li>/);
//  var quality = doc.match(/<li><span>.*?ачеств.*?:([^"]+)<\/li>/);
  try {
    quality = quality[1];
    quality = quality.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
    quality = type;
//    quality = '';
  }
//  quality = showtime.entityDecode(quality);
//  quality = unescape(quality);
//  quality = decodeURIComponent(quality);
  var logoquality;
//  logoquality = LOGOHD;
  if (/720/.test(quality)) {
    logoquality = LOGO720;
  }
  else if (/1080/.test(quality)) {
    logoquality = LOGO1080;
  }
  else if (/2160/.test(quality)) {
    logoquality = LOGO4K;
  }
  else {
    logoquality = LOGONONE;
//    logoquality = LOGOHD;
  }
//  var duration = doc.match(/<li><span>[Продолжитель|Длитель|Врем|Хронометр]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//  var duration = doc.match(/<li><span>[Продолжитель|Длитель|Врем|Хронометр]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//  var duration = doc.match(/<li><span>(Продолжитель|Длитель|Врем|Хронометр).*?> (.*?)<\/li>/);
  var duration = doc.match(/<li><span>(Продолжитель|Длитель|Врем|Хронометр).*?>(.*?)<\/li>/);
//  var duration = doc.match(/<li><span>(Продолжитель|Длитель|Врем|Хронометр).*?>([^"]+)<\/li>/);
  try {
//    duration = duration[1];
    duration = duration[2];
    duration = duration.replace(/<.*?>/g, '').trim();
  }
  catch (err) {
//    duration = '00:00:00';
    duration = '';
  }
//  duration = showtime.entityDecode(duration);
//  duration = unescape(duration);
//  duration = decodeURIComponent(duration);
//  var kinopoisk = doc.match(/<div class="frate frate-kp" data-text=".*?"><span>(.*?)<\/span><\/div>/);
  var kinopoisk = doc.match(/<div class="frate frate-kp".*?>(.*?)<\/div>/);
//  var kinopoisk = doc.match(/<div class="frate frate-kp".*?>([^"]+)<\/div>/);
  try {
    kinopoisk = kinopoisk[1];
    kinopoisk = kinopoisk.replace(/(<.*?>|-)/g, '').trim();
//    kinopoisk = kinopoisk.replace(/,/g, '.').trim();
  }
  catch (err) {
//    kinopoisk = 0;
    kinopoisk = '';
  }
//  kinopoisk = showtime.entityDecode(kinopoisk);
//  kinopoisk = unescape(kinopoisk);
//  kinopoisk = decodeURIComponent(kinopoisk);
//  var IMDB = doc.match(/<div class="frate frate-imdb" data-text=".*?"><span>(.*?)<\/span><\/div>/);
  var IMDB = doc.match(/<div class="frate frate-imdb".*?>(.*?)<\/div>/);
//  var IMDB = doc.match(/<div class="frate frate-imdb".*?>([^"]+)<\/div>/);
  try {
    IMDB = IMDB[1];
    IMDB = IMDB.replace(/(<.*?>|-)/g, '').trim();
//    IMDB = IMDB.replace(/,/g, '.').trim();
  }
  catch (err) {
//    IMDB = 0;
    IMDB = '';
  }
//  IMDB = showtime.entityDecode(IMDB);
//  IMDB = unescape(IMDB);
//  IMDB = decodeURIComponent(IMDB);
//  var rating = doc.match(/<li class="current-rating" style=".*?">(.*?)<\/li>/);
  var rating = doc.match(/<li class="current-rating".*?>(.*?)<\/li>/);
//  var rating = doc.match(/<li class="current-rating".*?>([^"]+)<\/li>/);
  try {
    rating = rating[1];
//    rating = rating.replace(/(<.*?>|-)/g, '').trim();
    rating = rating.replace(/,/g, '.').trim();
  }
  catch (err) {
    if (!IMDB) {
//      rating = 10 * kinopoisk;
      rating = 10 * kinopoisk.replace(/,/g, '.').trim();
    }
    else {
//      rating = 10 * IMDB;
      rating = 10 * IMDB.replace(/,/g, '.').trim();
    }
//    rating = 10 * kinopoisk;
//    rating = 10 * kinopoisk.replace(/,/g, '.').trim();
//    rating = 10 * IMDB;
//    rating = 10 * IMDB.replace(/,/g, '.').trim();
//    rating = 0;
//    rating = '';
  }
//  rating = showtime.entityDecode(rating);
//  rating = unescape(rating);
//  rating = decodeURIComponent(rating);
  var xrating = doc.match(/<span class="ratingtypeplusminus.*?>(.*?)<\/span>/);
//  var xrating = doc.match(/<span class="ratingtypeplusminus.*?>([^"]+)<\/span>/);
  try {
    xrating = xrating[1];
    xrating = xrating.replace(/(<.*?>)/g, '').trim();
    if (/\+/.test(xrating)) {
      xrating = coloredStr(xrating, green);
    }
    else if (/-/.test(xrating)) {
      xrating = coloredStr(xrating, red);
    }
    else {
      xrating = coloredStr(xrating, yellow);
    }
  }
  catch (err) {
//    xrating = 0;
    xrating = '';
  }
//  xrating = showtime.entityDecode(xrating);
//  xrating = unescape(xrating);
//  xrating = decodeURIComponent(xrating);
/*
  var ratingx = doc.match(/<span id="vote-num-id-.*?">(.*?)<\/div>/);
//  var ratingx = doc.match(/<span id="vote-num-id-.*?">([^"]+)<\/div>/);
  try {
    ratingx = ratingx[1];
    ratingx = ratingx.replace(/(<.*?>)/g, '').trim();
  }
  catch (err) {
    ratingx = '0 голосов';
//    ratingx = '';
  }
//  ratingx = showtime.entityDecode(ratingx);
//  ratingx = unescape(ratingx);
//  ratingx = decodeURIComponent(ratingx);
*/
  try {
    page.appendItem('', 'separator', {
//      title: new showtime.RichText('Видео:'),
      title: new RichText('Видео:'),
    });
  var playlist = doc.match(/class="tabs.*?">([\s\S]*?)<div class=".*?related.*?">/);
  var playlistHtml = playlist ? playlist[1] : doc;
  dlog('Moviepage: tabs found=' + !!playlist + ', scanLength=' + (playlist ? playlist[1].length : doc.length));
//    var player = playlist[1].match(/<script.*?Playerjs.*?file:.*?(\.mp4|\.m3u8)|<(iframe|IFRAME|div.*?"tabs-b video-box").*?(vcdn\.icdn\.ws|.*?\.svetacdn\.in|.*?\.annacdn\.cc|cdn\.cdn-films\.xyz|me\.greenfilm\.xyz|films\.video-up\.online|kino\.stokino\.rest|full-hd\.ki1080no\.xyz|s.*?\.filmload\.me|kino.*?\.navigatorkino\.xyz|.*?up\.terobat\.work|up.*?\.kiberload\.pw|cloud.*?\.kifise\.xyz|server.*?\.film-s-load\.live|video\.kinosteel\.club|video\.kinogo\.lu|api\.tobaco\.ws|api.*?\.tobaco\.ws|api\.topdbltj\.ws|api.*?\.topdbltj\.ws|api.*?\.delivembd\.ws|api.*?\.synchroncode\.com|api\.hostemb\.ws|shizahd\.ru|700filmov\.ru\/movie\/)/);
//    var player = playlist[1].match(/<script.*?Playerjs.*?file:.*?(\.mp4|\.m3u8)|<(iframe|IFRAME|div.*?"tabs-b video-box").*?(icdn|svetacdn|annacdn|cdn-films|greenfilm|video-up|stokino|ki1080no|filmload|navigatorkino|terobat|kiberload|kifise|film-s-load|kinosteel|video\.kinogo\.lu|tobaco|topdbltj|delivembd|synchroncode|hostemb|shizahd|700filmov.*?\/movie\/)/);
  var player = playlistHtml.match(/<script.*?Playerjs.*?file:.*?(\.mp4|\.m3u8)|<(iframe|IFRAME|div.*?"tabs-b video-box").*?((icdn|video-up|stokino|filmload|terobat|kiberload|film-s-load|svetacdn|annacdn|kinosteel|video\.kinogo\.lu|cdn-films|greenfilm|ki1080no|navigatorkino|kifise|mediafilm)|((api|apiplayers|me|meplayers).*?\.(kinogram\.best|placehere\.link|ameytools\.club|delivembed\.cc|(synchroncode|buildplayer|mir-dikogo-zapada)\.com|(embedstorage|multikland)\.net|(tobaco|topdbltj|delivembd|hostemb|loadbox|getcodes|strvid|ebder|framprox|embprox|bedemp2|embr|lessornot|linktodo|namy)\.ws)|.*?\.(takedwn\.ws|newplayjj\.com)|azure\d+.*?sitsarl\.com)|shizahd|700filmov.*?\/movie\/)/);
  dlog('Moviepage: player regex matched=' + !!player);
//    if (playlist) {
  if (player) {
//      page.appendItem('', 'separator', {
//        title: new showtime.RichText('Видео:'),
//        title: new RichText('Видео:'),
//      });
//      var replaylist = /<[iframe|IFRAME|script|div.*?"tabs-b video-box"]+(.*?)<\/(iframe|IFRAME|script|div)>/g;
  // Use [\s\S] so we also capture multiline <script> blocks with PlayerJS config
  var replaylist = /<(iframe|IFRAME|script|div.*?"tabs-b video-box")(>[\s\S]*?|[\s\S]*?)<\/(iframe|IFRAME|script|div)>/g;
//      var replaylist = /<(iframe|IFRAME|script|div.*?"tabs-b video-box")([^\"]+)<\/(iframe|IFRAME|script|div)>/g;

  // Try to parse tab labels (e.g., "Смотреть онлайн", "Плеер #2") from the header part before the first player box
  var firstBlockIndex = (function(){
    try {
      var m = /<(iframe|IFRAME|script|div.*?"tabs-b video-box")/i.exec(playlistHtml);
      return m ? m.index : -1;
    } catch(e) { return -1; }
  })();
  var headerSlice = firstBlockIndex > -1 ? playlistHtml.substring(0, firstBlockIndex) : playlistHtml;
  var tabLabels = [];
  try {
    // Generic: any element with class containing 'tab' and non-empty inner text
    var reLbl = /<([a-z0-9]+)[^>]*class=(['"])([^'"]*tab[^'"]*)\2[^>]*>([\s\S]*?)<\/\1>/ig;
    var lm;
    while ((lm = reLbl.exec(headerSlice)) !== null) {
      var inner = (lm[4] || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (inner) tabLabels.push(inner);
    }
    // Fallback: explicit Russian labels if generic missed
    if (tabLabels.length === 0) {
      var rf = />\s*((?:Плеер\s*#?\s*\d+|Смотреть\s*онлайн)[^<]{0,50})\s*</ig, rm;
      while ((rm = rf.exec(headerSlice)) !== null) {
        var inner2 = (rm[1] || '').replace(/\s+/g, ' ').trim();
        if (inner2) tabLabels.push(inner2);
      }
    }
  } catch(e) {}
  try { dlog('Moviepage: tab labels parsed count=' + tabLabels.length + ', sample=' + tabLabels.slice(0,5).join(' | ')); } catch(e) {}

  var match = replaylist.exec(playlistHtml);
  var playersAdded = 0;
  var contentIdx = 0; // index across content panes to map labels 1:1
      while (match) {
        var currentLabel = (tabLabels && tabLabels.length > contentIdx) ? tabLabels[contentIdx] : '';
        contentIdx++;
        dlog('Moviepage: found embed tag=' + match[1] + ', attrs sample=' + (match[2] ? match[2].slice(0,200) : ''));
//        var playlisturl = match[1].match(/[file:|src=]+[ '|'| "|"| |]+(.*?)('|"| ).*?/);
//        var playlisturl = match[2].match(/(file:|src=)( '|'| "|"| |)(.*?)('|"| ).*?/);
//        var playlisturl = match[2].match(/(file:|src=)( '|'| "|"| |)([^"]+)('|"| ).*?/);
        // Robustly extract a URL from common attributes/patterns and script bodies
        var srcMatch = null;
        try {
          var attrsOrBody = match[2] || '';
          // Prefer explicit src="..." on iframe/div
          srcMatch = attrsOrBody.match(/(?:\s|^)src\s*=\s*(['"])(.*?)\1/i);
          if (!srcMatch) {
            // Sometimes lazy providers use data-src
            srcMatch = attrsOrBody.match(/(?:\s|^)data-src\s*=\s*(['"])(.*?)\1/i);
          }
          // If it's a <script> block, search the whole block for PlayerJS file: patterns
          if (!srcMatch && /^script$/i.test(match[1])) {
            var block = (match[0] || '');
            // file: "..." or file: '...'
            srcMatch = block.match(/\bfile\s*:\s*(['"])(.*?)\1/);
            if (!srcMatch) {
              // file('...') variant
              srcMatch = block.match(/\bfile\s*\(\s*(['"])(.*?)\1\s*\)/);
            }
          }
        } catch (e) {}
        var playlisturl = '';
        try {
          if (srcMatch && srcMatch[2]) {
            playlisturl = srcMatch[2].trim();
          }
          // Decode common HTML entities that sometimes appear in iframe src (e.g. https&#58;//)
          try {
            // numeric entities
            playlisturl = playlisturl.replace(/&#(\d+);/g, function(_, d){ return String.fromCharCode(parseInt(d,10)); });
            // hex entities
            playlisturl = playlisturl.replace(/&#x([0-9a-fA-F]+);/g, function(_, h){ return String.fromCharCode(parseInt(h,16)); });
            // basic named entities
            playlisturl = playlisturl.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          } catch (e2) {}
          dlog('Moviepage: raw src resolved to=' + playlisturl);
          if (/http.*?:\/\//.test(playlisturl)) {
            playlisturl = playlisturl;
//            playlisturl = playlisturl + '///';
          }
          else if (/\/\//.test(playlisturl)) {
            playlisturl = HTTPS + playlisturl.replace(/(http:|https:|\/\/)/g, '').trim();
//            playlisturl = HTTPS + playlisturl.replace(/(http:|https:|\/\/)/g, '').trim() + '///';
          }
//          else if (/\/video\/film\/.*?(\.mp4|\.m3u8)/.test(playlisturl)) {
          else if (/(\.mp4|\.m3u8)/.test(playlisturl)) {
            playlisturl = HTTPS + 'kinorkn.com' + playlisturl;
//            playlisturl = HTTPS + 'kinorkn.com' + '///' + playlisturl;
          }
          else {
            playlisturl = HTTPS + BASE_URL + playlisturl;
//            playlisturl = HTTPS + BASE_URL + '///' + playlisturl;
//            playlisturl = HTTPS + BASE_URL + '///' + playlisturl + '///';
          }
          dlog('Moviepage: normalized playlisturl=' + playlisturl);
          // Fix common provider typos/concatenations seen in the wild
          // Example: 'azure133sitsarl.com' -> 'azure133.sitsarl.com'
          try {
            playlisturl = playlisturl.replace(/(azure\d+)(sitsarl\.com)/i, '$1.$2');
          } catch (e3) {}
//          playlisturl = playlisturl + '///';
//          playlisturl = playlisturl.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
        }
        catch (err) {
          dlog('Moviepage: failed to resolve playlisturl: ' + err);
          playlisturl = '';
        }
        if (!playlisturl) {
          dlog('Moviepage: warning - no src/file URL extracted from tag, skipping');
        }
//        playlisturl = showtime.entityDecode(playlisturl);
//        playlisturl = unescape(playlisturl);
//        playlisturl = decodeURIComponent(playlisturl);
        var playlistname;
/*
        playlistname = playlisturl.match(/http.*?:\/\/(.*?)\//);
//        playlistname = playlisturl.match(/http.*?:\/\/([^"]+)\//);
        try {
          playlistname = playlistname[1];
        }
        catch (err) {
//          playlistname = 'Неопределенный';
//          playlistname = 'other.player';
          playlistname = '';
        }
//        playlistname = showtime.entityDecode(playlistname);
//        playlistname = unescape(playlistname);
//        playlistname = decodeURIComponent(playlistname);
*/
  var uri;
//        if (/kinorkn\.com/.test(playlisturl)) {
        if (/kinorkn/.test(playlisturl)) {
          playlistname = 'kinorkn.com';
          uri = playlisturl;
//          uri = escape(playlisturl);
//          uri = encodeURIComponent(playlisturl);
        }
//        else if (/(vcdn\.icdn\.ws|.*?\.svetacdn\.in|.*?\.annacdn\.cc|cdn\.cdn-films\.xyz|me\.greenfilm\.xyz|films\.video-up\.online|kino\.stokino\.rest|full-hd\.ki1080no\.xyz|s.*?\.filmload\.me|kino.*?\.navigatorkino\.xyz|.*?up\.terobat\.work|up.*?\.kiberload\.pw|cloud.*?\.kifise\.xyz|server.*?\.film-s-load\.live|video\.kinosteel\.club|video\.kinogo\.lu)/.test(playlisturl)) {
//        else if (/(icdn|svetacdn|annacdn|cdn-films|greenfilm|video-up|stokino|ki1080no|filmload|navigatorkino|terobat|kiberload|kifise|film-s-load|kinosteel|video\.kinogo\.lu)/.test(playlisturl)) {
        else if (/(icdn|video-up|stokino|filmload|terobat|kiberload|film-s-load|svetacdn|annacdn|kinosteel|video\.kinogo\.lu|cdn-films|greenfilm|ki1080no|navigatorkino|kifise|mediafilm|azure\d+.*?sitsarl\.com|entouaedon\.com|\/playlist\/.*?\.txt)/.test(playlisturl)) {
          playlistname = 'cloud.cdnland.in';
//          uri = PREFIX + ':cdnlandpage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':cdnlandpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':cdnlandpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
          uri = PREFIX + ':cdnlandpage:' + playlisturl + '~' + title + '~' + poster;
//          uri = PREFIX + ':cdnlandpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(poster);
//          uri = PREFIX + ':cdnlandpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
        }
//        else if (/(api\.tobaco\.ws|api.*?\.tobaco\.ws|api\.topdbltj\.ws|api.*?\.topdbltj\.ws|api.*?\.delivembd\.ws|api.*?\.synchroncode\.com|api\.hostemb\.ws)/.test(playlisturl)) {
//        else if (/(tobaco|topdbltj|delivembd|synchroncode|hostemb)/.test(playlisturl)) {
        else if (/((api|apiplayers|me|meplayers).*?\.(kinogram\.best|placehere\.link|ameytools\.club|delivembed\.cc|(synchroncode|buildplayer|mir-dikogo-zapada)\.com|(embedstorage|multikland)\.net|(tobaco|topdbltj|delivembd|hostemb|loadbox|getcodes|strvid|ebder|framprox|embprox|bedemp2|embr|lessornot|linktodo|namy)\.ws)|.*?\.(takedwn\.ws|newplayjj\.com))/.test(playlisturl)) {
          playlistname = 'takedwn.ws';
//          playlistname = 'zombie-film.com';
//          uri = PREFIX + ':takedwnpage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':takedwnpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':takedwnpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
          uri = PREFIX + ':takedwnpage:' + playlisturl + '~' + title + '~' + poster;
//          uri = PREFIX + ':takedwnpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(poster);
//          uri = PREFIX + ':takedwnpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
        }
//        else if (/shizahd\.ru/.test(playlisturl)) {
        else if (/shizahd/.test(playlisturl)) {
          playlistname = 'video.kpapps.net';
//          playlistname = 'kpapp.online';
//          uri = PREFIX + ':kpappspage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':kpappspage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':kpappspage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
          uri = PREFIX + ':kpappspage:' + playlisturl + '~' + title + '~' + poster;
//          uri = PREFIX + ':kpappspage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(poster);
//          uri = PREFIX + ':kpappspage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
        }
//        else if (/700filmov\.ru\/movie\//.test(playlisturl)) {
        else if (/700filmov.*?\/movie\//.test(playlisturl)) {
          playlistname = 'sundb.nl';
//          uri = PREFIX + ':sundbpage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':sundbpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':sundbpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
          uri = PREFIX + ':sundbpage:' + playlisturl + '~' + title + '~' + poster;
//          uri = PREFIX + ':sundbpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(poster);
//          uri = PREFIX + ':sundbpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
        }
  else {
//          playlistname = 'other.player';
//          uri = PREFIX + ':playlistpage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':playlistpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':playlistpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
//          uri = PREFIX + ':playlistpage:' + playlisturl + '~' + title + '~' + poster;
//          uri = PREFIX + ':playlistpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(poster);
//          uri = PREFIX + ':playlistpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
//          uri = '';
    dlog('Moviepage: provider not recognized, skipping url=' + playlisturl);
        }
//        playlistname = showtime.entityDecode(playlistname);
//        playlistname = unescape(playlistname);
//        playlistname = decodeURIComponent(playlistname);
//        if (playlisturl) {
//        if (uri) {
//        if (playlistname) {
//        if (/(kinorkn\.com|vcdn\.icdn\.ws|.*?\.svetacdn\.in|.*?\.annacdn\.cc|cdn\.cdn-films\.xyz|me\.greenfilm\.xyz|films\.video-up\.online|kino\.stokino\.rest|full-hd\.ki1080no\.xyz|s.*?\.filmload\.me|kino.*?\.navigatorkino\.xyz|.*?up\.terobat\.work|up.*?\.kiberload\.pw|cloud.*?\.kifise\.xyz|server.*?\.film-s-load\.live|video\.kinosteel\.club|video\.kinogo\.lu|api\.tobaco\.ws|api.*?\.tobaco\.ws|api\.topdbltj\.ws|api.*?\.topdbltj\.ws|api.*?\.delivembd\.ws|api.*?\.synchroncode\.com|api\.hostemb\.ws|shizahd\.ru|700filmov\.ru\/movie\/)/.test(playlisturl)) {
//        if (/(kinorkn|icdn|svetacdn|annacdn|cdn-films|greenfilm|video-up|stokino|ki1080no|filmload|navigatorkino|terobat|kiberload|kifise|film-s-load|kinosteel|video\.kinogo\.lu|tobaco|topdbltj|delivembd|synchroncode|hostemb|shizahd|700filmov.*?\/movie\/)/.test(playlisturl)) {
  if (/(kinorkn|(icdn|video-up|stokino|filmload|terobat|kiberload|film-s-load|svetacdn|annacdn|kinosteel|video\.kinogo\.lu|cdn-films|greenfilm|ki1080no|navigatorkino|kifise|mediafilm)|((api|apiplayers|me|meplayers).*?\.(kinogram\.best|placehere\.link|ameytools\.club|delivembed\.cc|(synchroncode|buildplayer|mir-dikogo-zapada)\.com|(embedstorage|multikland)\.net|(tobaco|topdbltj|delivembd|hostemb|loadbox|getcodes|strvid|ebder|framprox|embprox|bedemp2|embr|lessornot|linktodo|namy)\.ws)|.*?\.(takedwn\.ws|newplayjj\.com)|azure\d+.*?sitsarl\.com)|shizahd|700filmov.*?\/movie\/)/.test(playlisturl)) {
          if (uri) {
            dlog('Moviepage: appending item for provider=' + (playlistname || '') + ', uri=' + uri);
            // Decide display title: prefer site tab label, else provider name, else movie title
            var displayTitle = currentLabel && currentLabel.length ? currentLabel : (playlistname || title);
            page.appendItem(uri, service.list, {
//            title: new showtime.RichText(title),
            title: new RichText(displayTitle),
//            title: new showtime.RichText(name),
//            title: new RichText(name),
//            title: new showtime.RichText(playlistname),
//            title: new RichText(playlistname),
//            title: new showtime.RichText('Все плейеры'),
//            title: new RichText('Все плейеры'),
//            title: new showtime.RichText('Видео не найдено или отсутствует'),
//            title: new RichText('Видео не найдено или отсутствует'),
//            icon: icon,
            icon: poster,
//            icon: LOGOICON,
//            icon: LOGOLOGO,
//            icon: LOGONONE,
//            icon: logoquality,
//            icon: '',
            backdrops: backdrops,
//            genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//            genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//            genre: new showtime.RichText(quality ? quality : ''),
//            genre: new RichText(quality ? quality : ''),
//            genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//            genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//            genre: new showtime.RichText(age ? age : ''),
//            genre: new RichText(age ? age : ''),
//            genre: new showtime.RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//            genre: new RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//            genre: new showtime.RichText(serie ? serie : ''),
//            genre: new RichText(serie ? serie : ''),
//            genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//            genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//            genre: new showtime.RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//            genre: new RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//            genre: new showtime.RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//            genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//            genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//            genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//            genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//            genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//            genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//            genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//            genre: new showtime.RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//            genre: new RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
            genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//            genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
            rating: rating ? 1 * rating : void(0),
//            rating: 1 * rating,
//            source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//            source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//            source: new showtime.RichText(age ? age : ''),
//            source: new RichText(age ? age : ''),
//            source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//            source: new RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//            source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//            source: new RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//            source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//            source: new RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//            source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//            source: new RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//            source: new showtime.RichText(translation ? translation : ''),
//            source: new RichText(translation ? translation : ''),
//            source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//            source: new RichText(translation ? coloredStr(translation, blue) : ''),
//            source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//            source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//            source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//            source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//            source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//            source: new RichText(genre ? coloredStr(genre, orange) : ''),
//            source: new showtime.RichText(country ? country : ''),
//            source: new RichText(country ? country : ''),
//            source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//            source: new RichText(country ? coloredStr(country, orange) : ''),
//            source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//            source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//            source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//            source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//            source: new showtime.RichText(year ? year : ''),
//            source: new RichText(year ? year : ''),
//            source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//            source: new RichText(year ? coloredStr(year, orange) : ''),
//            source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//            source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//            source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//            source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//            source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
            source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//            source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//            source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//            source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//            source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//            source: new showtime.RichText(playlistname ? playlistname : ''),
//            source: new RichText(playlistname ? playlistname : ''),
//            source: new showtime.RichText(playlistname ? coloredStr(playlistname, blue) : ''),
//            source: new RichText(playlistname ? coloredStr(playlistname, blue) : ''),
//            source: new showtime.RichText(playlistname ? coloredStr('Источник: ', gray) + playlistname : ''),
//            source: new RichText(playlistname ? coloredStr('Источник: ', gray) + playlistname : ''),
//            source: new showtime.RichText(playlistname ? coloredStr('Источник: ', gray) + coloredStr(playlistname, blue) : ''),
//            source: new RichText(playlistname ? coloredStr('Источник: ', gray) + coloredStr(playlistname, blue) : ''),
//            tagline: new showtime.RichText(coloredStr(title, gray)),
            // Keep the original movie title visible in tagline for clarity
            tagline: new RichText(coloredStr(title, gray)),
//            tagline: new showtime.RichText(coloredStr(name, gray)),
//            tagline: new RichText(coloredStr(name, gray)),
//            tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//            tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//            description: new showtime.RichText(coloredStr(title, gray)),
//            description: new RichText(coloredStr(title, gray)),
//            description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//            description: new RichText(name ? coloredStr(name, gray) : ''),
//            description: new showtime.RichText(genre ? genre : ''),
//            description: new RichText(genre ? genre : ''),
//            description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//            description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//            description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//            description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//            description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//            description: new RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//            description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//            description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//            description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//            description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//            description: new showtime.RichText(description ? description : ''),
//            description: new RichText(description ? description : ''),
//            description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//            description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//            description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//            description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//            description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
            description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//            description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
//            description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
            });
            playersAdded++;
          }
        }
  match = replaylist.exec(playlistHtml);
      }
      dlog('Moviepage: players added=' + playersAdded);
      if (!playersAdded) {
        dlog('Moviepage: no playable items built; appending passive message');
        page.appendPassiveItem(service.list, '', {
          title: new RichText('Видео не найдено или отсутствует'),
          icon: poster,
          backdrops: backdrops,
          rating: rating ? 1 * rating : void(0),
          source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
          tagline: new RichText(coloredStr(title, gray)),
          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
        });
      }
/*
      var uri;
//      uri = PREFIX + ':playerpage:' + url + '~' + title + '~' + icon;
//      uri = PREFIX + ':playerpage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//      uri = PREFIX + ':playerpage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
      uri = PREFIX + ':playerpage:' + url + '~' + title + '~' + poster;
//      uri = PREFIX + ':playerpage:' + escape(url) + '~' + escape(title) + '~' + escape(poster);
//      uri = PREFIX + ':playerpage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
//      page.appendItem(uri, 'directory', {
//      page.appendItem(uri, 'video', {
      page.appendItem(uri, service.list, {
//        title: new showtime.RichText(title),
//        title: new RichText(title),
//        title: new showtime.RichText(name),
//        title: new RichText(name),
//        title: new showtime.RichText(playlistname),
//        title: new RichText(playlistname),
//        title: new showtime.RichText('Все плейеры'),
        title: new RichText('Все плейеры'),
//        title: new showtime.RichText('Видео не найдено или отсутствует'),
//        title: new RichText('Видео не найдено или отсутствует'),
//        icon: icon,
        icon: poster,
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
//        icon: logoquality,
//        icon: '',
        backdrops: backdrops,
//        genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//        genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//        genre: new showtime.RichText(quality ? quality : ''),
//        genre: new RichText(quality ? quality : ''),
//        genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//        genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//        genre: new showtime.RichText(age ? age : ''),
//        genre: new RichText(age ? age : ''),
//        genre: new showtime.RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//        genre: new RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//        genre: new showtime.RichText(serie ? serie : ''),
//        genre: new RichText(serie ? serie : ''),
//        genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//        genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//        genre: new showtime.RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//        genre: new RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//        genre: new showtime.RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//        genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//        genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//        genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//        genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//        genre: new showtime.RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
        genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
        rating: rating ? 1 * rating : void(0),
//        rating: 1 * rating,
//        source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//        source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//        source: new showtime.RichText(age ? age : ''),
//        source: new RichText(age ? age : ''),
//        source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//        source: new RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//        source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//        source: new RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//        source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new showtime.RichText(translation ? translation : ''),
//        source: new RichText(translation ? translation : ''),
//        source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//        source: new RichText(translation ? coloredStr(translation, blue) : ''),
//        source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//        source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//        source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//        source: new RichText(genre ? coloredStr(genre, orange) : ''),
//        source: new showtime.RichText(country ? country : ''),
//        source: new RichText(country ? country : ''),
//        source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//        source: new RichText(country ? coloredStr(country, orange) : ''),
//        source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//        source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//        source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//        source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//        source: new showtime.RichText(year ? year : ''),
//        source: new RichText(year ? year : ''),
//        source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//        source: new RichText(year ? coloredStr(year, orange) : ''),
//        source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//        source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//        source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//        source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//        source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
        source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//        source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//        source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//        source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//        source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//        tagline: new showtime.RichText(coloredStr(title, gray)),
        tagline: new RichText(coloredStr(title, gray)),
//        tagline: new showtime.RichText(coloredStr(name, gray)),
//        tagline: new RichText(coloredStr(name, gray)),
//        tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//        tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//        description: new showtime.RichText(coloredStr(title, gray)),
//        description: new RichText(coloredStr(title, gray)),
//        description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//        description: new RichText(name ? coloredStr(name, gray) : ''),
//        description: new showtime.RichText(genre ? genre : ''),
//        description: new RichText(genre ? genre : ''),
//        description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//        description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//        description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//        description: new RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//        description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new showtime.RichText(description ? description : ''),
//        description: new RichText(description ? description : ''),
//        description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//        description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//        description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
//        description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
      });
*/
    }
    else {
//      page.appendItem('', 'separator', {
//        title: new showtime.RichText('Видео не найдено или отсутствует:'),
//        title: new RichText('Видео не найдено или отсутствует:'),
//      });
//      page.appendPassiveItem('directory', '', {
//      page.appendPassiveItem('video', '', {
      page.appendPassiveItem(service.list, '', {
//        title: new showtime.RichText(title),
//        title: new RichText(title),
//        title: new showtime.RichText(name),
//        title: new RichText(name),
//        title: new showtime.RichText(playlistname),
//        title: new RichText(playlistname),
//        title: new showtime.RichText('Все плейеры'),
//        title: new RichText('Все плейеры'),
//        title: new showtime.RichText('Видео не найдено или отсутствует'),
        title: new RichText('Видео не найдено или отсутствует'),
//        icon: icon,
        icon: poster,
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
//        icon: logoquality,
//        icon: '',
        backdrops: backdrops,
//        genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//        genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//        genre: new showtime.RichText(quality ? quality : ''),
//        genre: new RichText(quality ? quality : ''),
//        genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//        genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//        genre: new showtime.RichText(age ? age : ''),
//        genre: new RichText(age ? age : ''),
//        genre: new showtime.RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//        genre: new RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//        genre: new showtime.RichText(serie ? serie : ''),
//        genre: new RichText(serie ? serie : ''),
//        genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//        genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//        genre: new showtime.RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//        genre: new RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//        genre: new showtime.RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//        genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//        genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//        genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//        genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//        genre: new showtime.RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
        genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
        rating: rating ? 1 * rating : void(0),
//        rating: 1 * rating,
//        source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//        source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//        source: new showtime.RichText(age ? age : ''),
//        source: new RichText(age ? age : ''),
//        source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//        source: new RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//        source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//        source: new RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//        source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new showtime.RichText(translation ? translation : ''),
//        source: new RichText(translation ? translation : ''),
//        source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//        source: new RichText(translation ? coloredStr(translation, blue) : ''),
//        source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//        source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//        source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//        source: new RichText(genre ? coloredStr(genre, orange) : ''),
//        source: new showtime.RichText(country ? country : ''),
//        source: new RichText(country ? country : ''),
//        source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//        source: new RichText(country ? coloredStr(country, orange) : ''),
//        source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//        source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//        source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//        source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//        source: new showtime.RichText(year ? year : ''),
//        source: new RichText(year ? year : ''),
//        source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//        source: new RichText(year ? coloredStr(year, orange) : ''),
//        source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//        source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//        source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//        source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//        source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
        source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//        source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//        source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//        source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//        source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//        tagline: new showtime.RichText(coloredStr(title, gray)),
        tagline: new RichText(coloredStr(title, gray)),
//        tagline: new showtime.RichText(coloredStr(name, gray)),
//        tagline: new RichText(coloredStr(name, gray)),
//        tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//        tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//        description: new showtime.RichText(coloredStr(title, gray)),
//        description: new RichText(coloredStr(title, gray)),
//        description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//        description: new RichText(name ? coloredStr(name, gray) : ''),
//        description: new showtime.RichText(genre ? genre : ''),
//        description: new RichText(genre ? genre : ''),
//        description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//        description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//        description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//        description: new RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//        description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new showtime.RichText(description ? description : ''),
//        description: new RichText(description ? description : ''),
//        description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//        description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//        description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
//        description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
      });
    }
  }
  catch (err) {}
  try {
//    if (icon) {
//    if (poster) {
    if (screenshots) {
      page.appendItem('', 'separator', {
//        title: new showtime.RichText('Изображения:'),
        title: new RichText('Изображения:'),
      });
      var uri;
//      uri = PREFIX + ':imagespage:' + url + '~' + title + '~' + icon;
//      uri = PREFIX + ':imagespage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//      uri = PREFIX + ':imagespage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
      uri = PREFIX + ':imagespage:' + url + '~' + title + '~' + poster;
//      uri = PREFIX + ':imagespage:' + escape(url) + '~' + escape(title) + '~' + escape(poster);
//      uri = PREFIX + ':imagespage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
//      page.appendItem(uri, 'directory', {
//      page.appendItem(uri, 'video', {
      page.appendItem(uri, service.list, {
//        title: new showtime.RichText(title),
//        title: new RichText(title),
//        title: new showtime.RichText(name),
//        title: new RichText(name),
//        title: new showtime.RichText('Постер'),
        title: new RichText('Постер'),
//        title: new showtime.RichText('Картинки'),
//        title: new RichText('Картинки'),
//        title: new showtime.RichText('Изображения'),
//        title: new RichText('Изображения'),
//        title: new showtime.RichText('Скриншоты'),
//        title: new RichText('Скриншоты'),
//        icon: icon,
        icon: poster,
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
//        icon: LOGOFOLDER,
//        icon: LOGOARROW,
//        icon: '',
        backdrops: backdrops,
//        genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//        genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//        genre: new showtime.RichText(quality ? quality : ''),
//        genre: new RichText(quality ? quality : ''),
//        genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//        genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//        genre: new showtime.RichText(age ? age : ''),
//        genre: new RichText(age ? age : ''),
//        genre: new showtime.RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//        genre: new RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//        genre: new showtime.RichText(serie ? serie : ''),
//        genre: new RichText(serie ? serie : ''),
//        genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//        genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//        genre: new showtime.RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//        genre: new RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//        genre: new showtime.RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//        genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//        genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//        genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//        genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//        genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//        genre: new showtime.RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//        rating: rating ? 1 * rating : void(0),
//        rating: 1 * rating,
//        source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//        source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//        source: new showtime.RichText(age ? age : ''),
//        source: new RichText(age ? age : ''),
//        source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//        source: new RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//        source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//        source: new RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//        source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//        source: new showtime.RichText(translation ? translation : ''),
//        source: new RichText(translation ? translation : ''),
//        source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//        source: new RichText(translation ? coloredStr(translation, blue) : ''),
//        source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//        source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//        source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//        source: new RichText(genre ? coloredStr(genre, orange) : ''),
//        source: new showtime.RichText(country ? country : ''),
//        source: new RichText(country ? country : ''),
//        source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//        source: new RichText(country ? coloredStr(country, orange) : ''),
//        source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//        source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//        source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//        source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//        source: new showtime.RichText(year ? year : ''),
//        source: new RichText(year ? year : ''),
//        source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//        source: new RichText(year ? coloredStr(year, orange) : ''),
//        source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//        source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//        source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//        source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//        source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//        source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//        source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//        source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//        source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//        source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//        tagline: new showtime.RichText(coloredStr(title, gray)),
        tagline: new RichText(coloredStr(title, gray)),
//        tagline: new showtime.RichText(coloredStr(name, gray)),
//        tagline: new RichText(coloredStr(name, gray)),
//        tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//        tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//        description: new showtime.RichText(coloredStr(title, gray)),
//        description: new RichText(coloredStr(title, gray)),
//        description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//        description: new RichText(name ? coloredStr(name, gray) : ''),
//        description: new showtime.RichText(genre ? genre : ''),
//        description: new RichText(genre ? genre : ''),
//        description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//        description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//        description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//        description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//        description: new RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//        description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//        description: new showtime.RichText(description ? description : ''),
        description: new RichText(description ? description : ''),
//        description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//        description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//        description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//        description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//        description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
//        description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
      });
    }
  }
  catch (err) {}
  try {
//    var person = doc.match(/<li><span>Режисс(е|ё)р.*?>.*?<\/li>|<li><span>(Акт|.*?рол).*?>.*?<\/li>|<li>.*?<span>.*?(звуч|еревод).*?>.*?<\/li>/);
    var person = doc.match(/<li><span>Режисс(е|ё)р.*?>.*?<\/li>|<li><span>(Акт|.*?рол).*?>.*?<\/li>|<span>.*?(звуч|еревод).*?>.*?<\/li>/);
    if (person) {
//    if (director && actor && translation) {
      page.appendItem('', 'separator', {
//        title: new showtime.RichText('Принимали участие:'),
        title: new RichText('Принимали участие:'),
      });
//      var persons = doc.match(/<li><span>Режисс(е|ё)р.*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>|<li><span>(Акт|.*?рол).*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>|<li>.*?<span>.*?(звуч|еревод).*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>/);
      var persons = doc.match(/<li><span>Режисс(е|ё)р.*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>|<li><span>(Акт|.*?рол).*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>|<span>.*?(звуч|еревод).*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>/);
      if (persons) {
        var uri;
//        uri = PREFIX + ':personspage:' + url + '~' + title + '~' + icon;
//        uri = PREFIX + ':personspage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//        uri = PREFIX + ':personspage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
        uri = PREFIX + ':personspage:' + url + '~' + title + '~' + poster;
//        uri = PREFIX + ':personspage:' + escape(url) + '~' + escape(title) + '~' + escape(poster);
//        uri = PREFIX + ':personspage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
//        page.appendItem(uri, 'directory', {
//        page.appendItem(uri, 'video', {
        page.appendItem(uri, service.list, {
//          title: new showtime.RichText(title),
//          title: new RichText(title),
//          title: new showtime.RichText(name),
//          title: new RichText(name),
//          title: new showtime.RichText('Персоны'),
          title: new RichText('Персоны'),
//          title: new showtime.RichText('Режиссер / Актеры'),
//          title: new RichText('Режиссер / Актеры'),
//          icon: icon,
          icon: poster,
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//          genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//          genre: new showtime.RichText(quality ? quality : ''),
//          genre: new RichText(quality ? quality : ''),
//          genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//          genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//          genre: new showtime.RichText(age ? age : ''),
//          genre: new RichText(age ? age : ''),
//          genre: new showtime.RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//          genre: new RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//          genre: new showtime.RichText(serie ? serie : ''),
//          genre: new RichText(serie ? serie : ''),
//          genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//          genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//          genre: new showtime.RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//          genre: new RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//          genre: new showtime.RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//          genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//          genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//          genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//          genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//          genre: new showtime.RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          rating: rating ? 1 * rating : void(0),
//          rating: 1 * rating,
//          source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//          source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//          source: new showtime.RichText(age ? age : ''),
//          source: new RichText(age ? age : ''),
//          source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//          source: new RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//          source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//          source: new RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//          source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new showtime.RichText(translation ? translation : ''),
//          source: new RichText(translation ? translation : ''),
//          source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
          source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//          source: new RichText(genre ? coloredStr(genre, orange) : ''),
//          source: new showtime.RichText(country ? country : ''),
//          source: new RichText(country ? country : ''),
//          source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//          source: new RichText(country ? coloredStr(country, orange) : ''),
//          source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//          source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//          source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//          source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//          source: new showtime.RichText(year ? year : ''),
//          source: new RichText(year ? year : ''),
//          source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//          source: new RichText(year ? coloredStr(year, orange) : ''),
//          source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//          source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//          source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//          source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//          source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//          source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//          source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//          source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//          source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//          source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//          tagline: new showtime.RichText(coloredStr(title, gray)),
          tagline: new RichText(coloredStr(title, gray)),
//          tagline: new showtime.RichText(coloredStr(name, gray)),
//          tagline: new RichText(coloredStr(name, gray)),
//          tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//          tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//          description: new showtime.RichText(coloredStr(title, gray)),
//          description: new RichText(coloredStr(title, gray)),
//          description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//          description: new RichText(name ? coloredStr(name, gray) : ''),
//          description: new showtime.RichText(genre ? genre : ''),
//          description: new RichText(genre ? genre : ''),
//          description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//          description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//          description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText(description ? description : ''),
//          description: new RichText(description ? description : ''),
//          description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//          description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//          description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
          description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
        });
/*
//        var dir = director[1].match(/<a href.*?>[^"]+<\/a>/);
        var dir = director[2].match(/<a href.*?>[^"]+<\/a>/);
        if (dir) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Режиссер:'),
            title: new RichText('Режиссер:'),
          });
//          scrapertag(page, director[1]);
          scrapertag(page, director[2]);
        }
//        var act = actor[1].match(/<a href.*?>[^"]+<\/a>/);
        var act = actor[2].match(/<a href.*?>[^"]+<\/a>/);
        if (act) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Актеры:'),
            title: new RichText('Актеры:'),
//            title: new showtime.RichText('В ролях:'),
//            title: new RichText('В ролях:'),
          });
//          scrapertag(page, actor[1]);
          scrapertag(page, actor[2]);
        }
//        var tra = translation[1].match(/<a href.*?>[^"]+<\/a>/);
        var tra = translation[2].match(/<a href.*?>[^"]+<\/a>/);
        if (tra) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Перевод:'),
            title: new RichText('Перевод:'),
          });
//          scrapertag(page, translation[1]);
          scrapertag(page, translation[2]);
        }
*/
      }
      else {
//        page.appendPassiveItem('directory', '', {
//        page.appendPassiveItem('video', '', {
        page.appendPassiveItem(service.list, '', {
//          title: new showtime.RichText(title),
//          title: new RichText(title),
//          title: new showtime.RichText(name),
//          title: new RichText(name),
//          title: new showtime.RichText('Персоны'),
//          title: new RichText('Персоны'),
//          title: new showtime.RichText('Режиссер / Актеры'),
          title: new RichText('Режиссер / Актеры'),
//          icon: icon,
          icon: poster,
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//          genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//          genre: new showtime.RichText(quality ? quality : ''),
//          genre: new RichText(quality ? quality : ''),
//          genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//          genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//          genre: new showtime.RichText(age ? age : ''),
//          genre: new RichText(age ? age : ''),
//          genre: new showtime.RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//          genre: new RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//          genre: new showtime.RichText(serie ? serie : ''),
//          genre: new RichText(serie ? serie : ''),
//          genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//          genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//          genre: new showtime.RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//          genre: new RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//          genre: new showtime.RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//          genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//          genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//          genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//          genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//          genre: new showtime.RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          rating: rating ? 1 * rating : void(0),
//          rating: 1 * rating,
//          source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//          source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//          source: new showtime.RichText(age ? age : ''),
//          source: new RichText(age ? age : ''),
//          source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//          source: new RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//          source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//          source: new RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//          source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new showtime.RichText(translation ? translation : ''),
//          source: new RichText(translation ? translation : ''),
//          source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
          source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//          source: new RichText(genre ? coloredStr(genre, orange) : ''),
//          source: new showtime.RichText(country ? country : ''),
//          source: new RichText(country ? country : ''),
//          source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//          source: new RichText(country ? coloredStr(country, orange) : ''),
//          source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//          source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//          source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//          source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//          source: new showtime.RichText(year ? year : ''),
//          source: new RichText(year ? year : ''),
//          source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//          source: new RichText(year ? coloredStr(year, orange) : ''),
//          source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//          source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//          source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//          source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//          source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//          source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//          source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//          source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//          source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//          source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//          tagline: new showtime.RichText(coloredStr(title, gray)),
          tagline: new RichText(coloredStr(title, gray)),
//          tagline: new showtime.RichText(coloredStr(name, gray)),
//          tagline: new RichText(coloredStr(name, gray)),
//          tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//          tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//          description: new showtime.RichText(coloredStr(title, gray)),
//          description: new RichText(coloredStr(title, gray)),
//          description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//          description: new RichText(name ? coloredStr(name, gray) : ''),
//          description: new showtime.RichText(genre ? genre : ''),
//          description: new RichText(genre ? genre : ''),
//          description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//          description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//          description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText(description ? description : ''),
//          description: new RichText(description ? description : ''),
//          description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//          description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//          description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
          description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
        });
      }
    }
  }
  catch (err) {}
  try {
    var category = doc.match(/<li><span>(Год|Дата|Премьера).*?>.*?<\/li>|<li><span>Страна.*?>.*?<\/(span|li)>|<li><span>(Жанр|Категори).*?>.*?<\/li>|<li><span>Канал.*?>.*?<\/li>|<li><span>.*?одбор.*?>.*?<\/li>/);
    if (category) {
//    if (year && country && genre && channel && compilation) {
      page.appendItem('', 'separator', {
//        title: new showtime.RichText('Категории:'),
        title: new RichText('Категории:'),
      });
      var categories = doc.match(/<li><span>(Год|Дата|Премьера).*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>|<li><span>Страна.*?>.*?<a href.*?>[^"]+<\/a>.*?<\/(span|li)>|<li><span>(Жанр|Категори).*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>|<li><span>Канал.*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>|<li><span>.*?одбор.*?>.*?<a href.*?>[^"]+<\/a>.*?<\/li>/);
      if (categories) {
        var uri;
//        uri = PREFIX + ':categoriespage:' + url + '~' + title + '~' + icon;
//        uri = PREFIX + ':categoriespage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//        uri = PREFIX + ':categoriespage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
        uri = PREFIX + ':categoriespage:' + url + '~' + title + '~' + poster;
//        uri = PREFIX + ':categoriespage:' + escape(url) + '~' + escape(title) + '~' + escape(poster);
//        uri = PREFIX + ':categoriespage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
//        page.appendItem(uri, 'directory', {
//        page.appendItem(uri, 'video', {
        page.appendItem(uri, service.list, {
//          title: new showtime.RichText(title),
//          title: new RichText(title),
//          title: new showtime.RichText(name),
//          title: new RichText(name),
//          title: new showtime.RichText('Категории'),
          title: new RichText('Категории'),
//          title: new showtime.RichText('Год / Страна / Жанр'),
//          title: new RichText('Год / Страна / Жанр'),
//          icon: icon,
          icon: poster,
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//          genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//          genre: new showtime.RichText(quality ? quality : ''),
//          genre: new RichText(quality ? quality : ''),
//          genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//          genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//          genre: new showtime.RichText(age ? age : ''),
//          genre: new RichText(age ? age : ''),
//          genre: new showtime.RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//          genre: new RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//          genre: new showtime.RichText(serie ? serie : ''),
//          genre: new RichText(serie ? serie : ''),
//          genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//          genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//          genre: new showtime.RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//          genre: new RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//          genre: new showtime.RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//          genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//          genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//          genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//          genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//          genre: new showtime.RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          rating: rating ? 1 * rating : void(0),
//          rating: 1 * rating,
//          source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//          source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//          source: new showtime.RichText(age ? age : ''),
//          source: new RichText(age ? age : ''),
//          source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//          source: new RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//          source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//          source: new RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//          source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new showtime.RichText(translation ? translation : ''),
//          source: new RichText(translation ? translation : ''),
//          source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//          source: new RichText(genre ? coloredStr(genre, orange) : ''),
//          source: new showtime.RichText(country ? country : ''),
//          source: new RichText(country ? country : ''),
//          source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//          source: new RichText(country ? coloredStr(country, orange) : ''),
//          source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//          source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//          source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//          source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//          source: new showtime.RichText(year ? year : ''),
//          source: new RichText(year ? year : ''),
//          source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//          source: new RichText(year ? coloredStr(year, orange) : ''),
//          source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//          source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//          source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//          source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//          source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
          source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//          source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//          source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//          source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//          source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//          tagline: new showtime.RichText(coloredStr(title, gray)),
          tagline: new RichText(coloredStr(title, gray)),
//          tagline: new showtime.RichText(coloredStr(name, gray)),
//          tagline: new RichText(coloredStr(name, gray)),
//          tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//          tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//          description: new showtime.RichText(coloredStr(title, gray)),
//          description: new RichText(coloredStr(title, gray)),
//          description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//          description: new RichText(name ? coloredStr(name, gray) : ''),
//          description: new showtime.RichText(genre ? genre : ''),
          description: new RichText(genre ? genre : ''),
//          description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//          description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//          description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText(description ? description : ''),
//          description: new RichText(description ? description : ''),
//          description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//          description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//          description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
//          description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
        });
/*
//        var yea = year[1].match(/<a href.*?>[^"]+<\/a>/);
        var yea = year[2].match(/<a href.*?>[^"]+<\/a>/);
        if (yea) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Год:'),
            title: new RichText('Год:'),
          });
//          scrapertag(page, year[1]);
          scrapertag(page, year[2]);
        }
        var cou = country[1].match(/<a href.*?>[^"]+<\/a>/);
        if (cou) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Страна:'),
            title: new RichText('Страна:'),
          });
          scrapertag(page, country[1]);
        }
//        var gen = genre[1].match(/<a href.*?>[^"]+<\/a>/);
        var gen = genre[2].match(/<a href.*?>[^"]+<\/a>/);
        if (gen) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Жанр:'),
            title: new RichText('Жанр:'),
          });
//          scrapertag(page, genre[1]);
          scrapertag(page, genre[2]);
        }
        var cha = channel[1].match(/<a href.*?>[^"]+<\/a>/);
        if (cha) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Канал:'),
            title: new RichText('Канал:'),
          });
          scrapertag(page, channel[1]);
        }
        var set = compilation[1].match(/<a href.*?>[^"]+<\/a>/);
        if (set) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Подборка:'),
            title: new RichText('Подборка:'),
          });
          scrapertag(page, compilation[1]);
        }
*/
      }
      else {
//        page.appendPassiveItem('directory', '', {
//        page.appendPassiveItem('video', '', {
        page.appendPassiveItem(service.list, '', {
//          title: new showtime.RichText(title),
//          title: new RichText(title),
//          title: new showtime.RichText(name),
//          title: new RichText(name),
//          title: new showtime.RichText('Категории'),
//          title: new RichText('Категории'),
//          title: new showtime.RichText('Год / Страна / Жанр'),
          title: new RichText('Год / Страна / Жанр'),
//          icon: icon,
          icon: poster,
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//          genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//          genre: new showtime.RichText(quality ? quality : ''),
//          genre: new RichText(quality ? quality : ''),
//          genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//          genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//          genre: new showtime.RichText(age ? age : ''),
//          genre: new RichText(age ? age : ''),
//          genre: new showtime.RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//          genre: new RichText(status ? coloredStr('Статус: ', gray) + status : ''),
//          genre: new showtime.RichText(serie ? serie : ''),
//          genre: new RichText(serie ? serie : ''),
//          genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//          genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//          genre: new showtime.RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//          genre: new RichText(serie ? coloredStr('Добавлено: ', gray) + serie : ''),
//          genre: new showtime.RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((serie ? coloredStr('Статус: ', gray) + coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//          genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//          genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//          genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//          genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//          genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//          genre: new showtime.RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? duration + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (age ? age : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, orange) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) + ' ' : '') + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (ratingx ? coloredStr(ratingx, gray) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//          rating: rating ? 1 * rating : void(0),
//          rating: 1 * rating,
//          source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//          source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//          source: new showtime.RichText(age ? age : ''),
//          source: new RichText(age ? age : ''),
//          source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//          source: new RichText(date ? coloredStr('Добавлено: ', gray) + date : ''),
//          source: new showtime.RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//          source: new RichText(date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) : ''),
//          source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new RichText((date ? coloredStr('Добавлено: ', gray) + date + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new showtime.RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new RichText((date ? coloredStr('Добавлено: ', gray) + coloredStr(date, orange) + ' ' : '') + (add ? coloredStr(add, gray) : '')),
//          source: new showtime.RichText(translation ? translation : ''),
//          source: new RichText(translation ? translation : ''),
//          source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//          source: new RichText(genre ? coloredStr(genre, orange) : ''),
//          source: new showtime.RichText(country ? country : ''),
//          source: new RichText(country ? country : ''),
//          source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//          source: new RichText(country ? coloredStr(country, orange) : ''),
//          source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//          source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//          source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//          source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//          source: new showtime.RichText(year ? year : ''),
//          source: new RichText(year ? year : ''),
//          source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//          source: new RichText(year ? coloredStr(year, orange) : ''),
//          source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//          source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//          source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//          source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//          source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
          source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//          source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//          source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//          source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//          source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//          tagline: new showtime.RichText(coloredStr(title, gray)),
          tagline: new RichText(coloredStr(title, gray)),
//          tagline: new showtime.RichText(coloredStr(name, gray)),
//          tagline: new RichText(coloredStr(name, gray)),
//          tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//          tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//          description: new showtime.RichText(coloredStr(title, gray)),
//          description: new RichText(coloredStr(title, gray)),
//          description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//          description: new RichText(name ? coloredStr(name, gray) : ''),
//          description: new showtime.RichText(genre ? genre : ''),
          description: new RichText(genre ? genre : ''),
//          description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//          description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//          description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (serie ? coloredStr('Добавлено: ', gray) + serie : '')),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText(description ? description : ''),
//          description: new RichText(description ? description : ''),
//          description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//          description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//          description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//          description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new RichText((status ? coloredStr('Статус: ', gray) + status + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (country ? coloredStr('Выпущено: ', gray) + country + '/' : '') + (year ? year + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//          description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
//          description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
        });
      }
    }
  }
  catch (err) {}
  try {
    var tagged = doc.match(/<div class="speedbar nowrap">([\s\S]*?)<\/div>/);
    if (tagged) {
      var tag = tagged[1].match(/<a href.*?>[^"]+<\/a>/);
      if (tag) {
/*
        var tname = 'Метки';
//        tname = showtime.entityDecode(tname);
//        tname = unescape(tname);
//        tname = decodeURIComponent(tname);
        var backdrops = [];
        try {
//          backdrops.push({url: icon});
//          backdrops.push({url: poster});
          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
        }
        catch (err) {
//          backdrops.push({url: icon});
//          backdrops.push({url: poster});
//          backdrops.push({url: LOGOICON});
          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
//          backdrops.push({url: ''});
        }
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Метки:'),
//          title: new RichText('Метки:'),
//          title: new showtime.RichText(tname ? tname + ':' : ''),
          title: new RichText(tname ? tname + ':' : ''),
        });
        var uri;
//        uri = PREFIX + ':tagpage:' + url + '~' + 'Метки' + '~' + icon;
//        uri = PREFIX + ':tagpage:' + escape(url) + '~' + escape('Метки') + '~' + escape(icon);
//        uri = PREFIX + ':tagpage:' + encodeURIComponent(url) + '~' + encodeURIComponent('Метки') + '~' + encodeURIComponent(icon);
//        uri = PREFIX + ':tagpage:' + url + '~' + tname + '~' + icon;
//        uri = PREFIX + ':tagpage:' + escape(url) + '~' + escape(tname) + '~' + escape(icon);
//        uri = PREFIX + ':tagpage:' + encodeURIComponent(url) + '~' + encodeURIComponent(tname) + '~' + encodeURIComponent(icon);
//        uri = PREFIX + ':tagpage:' + url + '~' + title + '~' + icon;
//        uri = PREFIX + ':tagpage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//        uri = PREFIX + ':tagpage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
        uri = PREFIX + ':tagpage:' + url + '~' + title + '~' + poster;
//        uri = PREFIX + ':tagpage:' + escape(url) + '~' + escape(title) + '~' + escape(poster);
//        uri = PREFIX + ':tagpage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
//        page.appendItem(uri, 'directory', {
//        page.appendItem(uri, 'video', {
        page.appendItem(uri, service.list, {
//          title: new showtime.RichText('Метки'),
//          title: new RichText('Метки'),
//          title: new showtime.RichText(tname ? tname : ''),
          title: new RichText(tname ? tname : ''),
//          icon: icon,
//          icon: poster,
          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          tagline: new showtime.RichText(coloredStr(tname, gray)),
//          tagline: new RichText(coloredStr(tname, gray)),
//          description: new showtime.RichText(tname ? coloredStr(tname, gray) : ''),
          description: new RichText(tname ? coloredStr(tname, gray) : ''),
        });
*/
//        scrapertag(page, tagged[1]);
        scrapertag(page, tagged[1], true);
      }
    }
  }
  catch (err) {}
  page.appendItem('', 'separator', {
//    title: new showtime.RichText('Поиск:'),
    title: new RichText('Поиск:'),
  });
//  page.appendItem(PREFIX + ':search:' + title, 'directory', {
  page.appendItem(PREFIX + ':search:' + name, 'directory', {
//  page.appendItem(PREFIX + ':search:' + query, 'directory', {
//  page.appendItem(PREFIX + ':search:' + xquery, 'directory', {
//    title: new showtime.RichText('Найти в плагине'),
    title: new RichText('Найти в плагине'),
    icon: LOGOARROW,
//    icon: '',
  });
//  page.appendItem('search:' + title, 'directory', {
//  page.appendItem('search:' + name, 'directory', {
  page.appendItem('search:' + query, 'directory', {
//  page.appendItem('search:' + xquery, 'directory', {
//    title: new showtime.RichText('Найти в мовиан'),
    title: new RichText('Найти в мовиан'),
    icon: LOGOARROW,
//    icon: '',
  });
//  page.appendItem('youtube:search:' + title, 'directory', {
//  page.appendItem('youtube:search:' + name, 'directory', {
//  page.appendItem('youtube:search:' + query, 'directory', {
  page.appendItem('youtube:search:' + xquery, 'directory', {
//    title: new showtime.RichText('Найти на YouTube'),
    title: new RichText('Найти на YouTube'),
    icon: LOGOARROW,
//    icon: '',
  });
  page.appendItem('yo:search:' + title, 'directory', {
//  page.appendItem('yo:search:' + name, 'directory', {
//  page.appendItem('yo:search:' + query, 'directory', {
//  page.appendItem('yo:search:' + xquery, 'directory', {
//    title: new showtime.RichText('Найти из Yohoho'),
    title: new RichText('Найти из Yohoho'),
    icon: LOGOARROW,
//    icon: '',
  });
  try {
    var related = doc.match(/<div class="sect( frels|-cont sect-items clearfix)">([\s\S]*?)<(\/article|\/main|!-- END CONTENT --|footer class="footer fx-row")>/);
    if (related) {
      var rel = related[2].match(/<div class="(th-item|popular-item)"[\s\S]*?".*?title.*?>[^"]+<\/div>/);
      if (rel) {
//        var rname = 'Смотрите также';
        var rname = related[2].match(/<div class="frels-title">(.*?)<\/div>/);
//        var rname = related[2].match(/<div class="frels-title">([^"]+)<\/div>/);
        try {
          rname = rname[1];
          rname = rname.replace(/:/g, '').trim();
          if (/[^"]+/.test(rname)) {
            rname = rname;
          }
          else {
            rname = 'Смотрите также';
//            rname = '';
          }
        }
        catch (err) {
          rname = 'Смотрите также';
//          rname = '';
        }
//        rname = showtime.entityDecode(rname);
//        rname = unescape(rname);
//        rname = decodeURIComponent(rname);
        var backdrops = [];
//        var re = /src=[ '|'| "|"| |]+(.*?)('|"| )/g;
//        var re = /src=[ '|'| "|"| |]+([^"]+)('|"| )/g;
        var re = /src=( '|'| "|"| |)(.*?)('|"| )/g;
//        var re = /src=( '|'| "|"| |)([^"]+)('|"| )/g;
        var match = re.exec(related[2]);
        while (match) {
          try {
//            var rposter = match[1];
            var rposter = match[2];
            rposter = rposter.replace(/('|"| )/g, '').trim();
            if (/http.*?:\/\//.test(rposter)) {
              rposter = rposter;
            }
            else {
              rposter = HTTPS + BASE_URL + rposter;
//              rposter = HTTPS + BASE_URL + '///' + rposter;
            }
//            rposter = rposter.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
            if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(rposter)) {
              rposter = rposter;
            }
            else {
//              rposter = icon;
              rposter = poster;
//              rposter = LOGOICON;
//              rposter = LOGOLOGO;
//              rposter = LOGONONE;
//              rposter = '';
            }
          }
          catch (err) {
//            rposter = icon;
            rposter = poster;
//            rposter = LOGOICON;
//            rposter = LOGOLOGO;
//            rposter = LOGONONE;
//            rposter = '';
          }
//          rposter = showtime.entityDecode(rposter);
//          rposter = unescape(rposter);
//          rposter = decodeURIComponent(rposter);
          try {
//            backdrops.push({url: icon});
//            backdrops.push({url: poster});
            backdrops.push({url: rposter});
//            backdrops.push({url: LOGOICON});
//            backdrops.push({url: LOGOLOGO});
//            backdrops.push({url: LOGO});
          }
          catch (err) {
//            backdrops.push({url: icon});
//            backdrops.push({url: poster});
            backdrops.push({url: LOGOICON});
//            backdrops.push({url: LOGOLOGO});
//            backdrops.push({url: LOGO});
//            backdrops.push({url: ''});
          }
          match = re.exec(related[2]);
        }
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Смотрите также:'),
//          title: new RichText('Смотрите также:'),
//          title: new showtime.RichText(rname ? rname + ':' : ''),
          title: new RichText(rname ? rname + ':' : ''),
        });
        var uri;
//        uri = PREFIX + ':relpage:' + url + '~' + 'Смотрите также';
//        uri = PREFIX + ':relpage:' + escape(url) + '~' + escape('Смотрите также');
//        uri = PREFIX + ':relpage:' + encodeURIComponent(url) + '~' + encodeURIComponent('Смотрите также');
        uri = PREFIX + ':relpage:' + url + '~' + rname;
//        uri = PREFIX + ':relpage:' + escape(url) + '~' + escape(rname);
//        uri = PREFIX + ':relpage:' + encodeURIComponent(url) + '~' + encodeURIComponent(rname);
//        page.appendItem(uri, 'directory', {
//        page.appendItem(uri, 'video', {
        page.appendItem(uri, service.list, {
//          title: new showtime.RichText('Смотрите также'),
//          title: new RichText('Смотрите также'),
//          title: new showtime.RichText(rname ? rname : ''),
          title: new RichText(rname ? rname : ''),
//          icon: icon,
//          icon: poster,
          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          tagline: new showtime.RichText(coloredStr(rname, gray)),
//          tagline: new RichText(coloredStr(rname, gray)),
//          description: new showtime.RichText(rname ? coloredStr(rname, gray) : ''),
          description: new RichText(rname ? coloredStr(rname, gray) : ''),
        });
/*
//        scraper(page, related[2]);
        scraper(page, related[2], true);
*/
      }
    }
  }
  catch (err) {}
  try {
    var popular = doc.match(/<div class="popular clearfix">([\s\S]*?)<\/div>/);
    if (popular) {
      var pop = popular[1].match(/<li><a href.*?>[^"]+<\/a>/);
      if (pop) {
        var pname = 'Популярное';
//        pname = showtime.entityDecode(pname);
//        pname = unescape(pname);
//        pname = decodeURIComponent(pname);
        var backdrops = [];
        try {
//          backdrops.push({url: icon});
//          backdrops.push({url: poster});
          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
        }
        catch (err) {
//          backdrops.push({url: icon});
//          backdrops.push({url: poster});
//          backdrops.push({url: LOGOICON});
          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
//          backdrops.push({url: ''});
        }
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Популярное:'),
//          title: new RichText('Популярное:'),
//          title: new showtime.RichText(pname ? pname + ':' : ''),
          title: new RichText(pname ? pname + ':' : ''),
        });
        var uri;
//        uri = PREFIX + ':poppage:' + url + '~' + 'Популярное';
//        uri = PREFIX + ':poppage:' + escape(url) + '~' + escape('Популярное');
//        uri = PREFIX + ':poppage:' + encodeURIComponent(url) + '~' + encodeURIComponent('Популярное');
        uri = PREFIX + ':poppage:' + url + '~' + pname;
//        uri = PREFIX + ':poppage:' + escape(url) + '~' + escape(pname);
//        uri = PREFIX + ':poppage:' + encodeURIComponent(url) + '~' + encodeURIComponent(pname);
//        page.appendItem(uri, 'directory', {
//        page.appendItem(uri, 'video', {
        page.appendItem(uri, service.list, {
//          title: new showtime.RichText('Популярное'),
//          title: new RichText('Популярное'),
//          title: new showtime.RichText(pname ? pname : ''),
          title: new RichText(pname ? pname : ''),
//          icon: icon,
//          icon: poster,
          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          tagline: new showtime.RichText(coloredStr(pname, gray)),
//          tagline: new RichText(coloredStr(pname, gray)),
//          description: new showtime.RichText(pname ? coloredStr(pname, gray) : ''),
          description: new RichText(pname ? coloredStr(pname, gray) : ''),
        });
/*
//        scraperpop(page, popular[1]);
        scraperpop(page, popular[1], true);
*/
      }
    }
  }
  catch (err) {}
  try {
//    var comments = doc.match(/<div id='comment-id-.*?'>/);
    var comments = doc.match(/<div id='comment-id-.*?'>[\s\S]*?>Ответить<\/a>/);
    if (comments) {
      var cname = 'Комментарии';
//      cname = showtime.entityDecode(cname);
//      cname = unescape(cname);
//      cname = decodeURIComponent(cname);
//      var avatar = LOGOAVATAR;
      var avatar = LOGOAVATARS;
      var backdrops = [];
      try {
//        backdrops.push({url: icon});
        backdrops.push({url: poster});
//        backdrops.push({url: avatar});
//        backdrops.push({url: LOGOAVATAR});
//        backdrops.push({url: LOGOAVATARS});
//        backdrops.push({url: LOGOICON});
//        backdrops.push({url: LOGOLOGO});
//        backdrops.push({url: LOGO});
      }
      catch (err) {
//        backdrops.push({url: icon});
//        backdrops.push({url: poster});
//        backdrops.push({url: avatar});
//        backdrops.push({url: LOGOAVATAR});
//        backdrops.push({url: LOGOAVATARS});
        backdrops.push({url: LOGOICON});
//        backdrops.push({url: LOGOLOGO});
//        backdrops.push({url: LOGO});
//        backdrops.push({url: ''});
      }
      page.appendItem('', 'separator', {
//        title: new showtime.RichText('Комментарии:'),
//        title: new RichText('Комментарии:'),
//        title: new showtime.RichText(cname ? cname + ':' : ''),
        title: new RichText(cname ? cname + ':' : ''),
      });
      var uri;
//      uri = PREFIX + ':compage:' + url + '~' + 'Комментарии' + '~' + icon;
//      uri = PREFIX + ':compage:' + escape(url) + '~' + escape('Комментарии') + '~' + escape(icon);
//      uri = PREFIX + ':compage:' + encodeURIComponent(url) + '~' + encodeURIComponent('Комментарии') + '~' + encodeURIComponent(icon);
//      uri = PREFIX + ':compage:' + url + '~' + 'Комментарии' + '~' + poster;
//      uri = PREFIX + ':compage:' + escape(url) + '~' + escape('Комментарии') + '~' + escape(poster);
//      uri = PREFIX + ':compage:' + encodeURIComponent(url) + '~' + encodeURIComponent('Комментарии') + '~' + encodeURIComponent(poster);
//      uri = PREFIX + ':compage:' + url + '~' + cname + '~' + icon;
//      uri = PREFIX + ':compage:' + escape(url) + '~' + escape(cname) + '~' + escape(icon);
//      uri = PREFIX + ':compage:' + encodeURIComponent(url) + '~' + encodeURIComponent(cname) + '~' + encodeURIComponent(icon);
//      uri = PREFIX + ':compage:' + url + '~' + cname + '~' + poster;
//      uri = PREFIX + ':compage:' + escape(url) + '~' + escape(cname) + '~' + escape(poster);
//      uri = PREFIX + ':compage:' + encodeURIComponent(url) + '~' + encodeURIComponent(cname) + '~' + encodeURIComponent(poster);
//      uri = PREFIX + ':compage:' + url + '~' + title + '~' + icon;
//      uri = PREFIX + ':compage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//      uri = PREFIX + ':compage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
      uri = PREFIX + ':compage:' + url + '~' + title + '~' + poster;
//      uri = PREFIX + ':compage:' + escape(url) + '~' + escape(title) + '~' + escape(poster);
//      uri = PREFIX + ':compage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(poster);
//      page.appendItem(uri, 'directory', {
//      page.appendItem(uri, 'video', {
      page.appendItem(uri, service.list, {
//        title: new showtime.RichText('Комментарии'),
//        title: new RichText('Комментарии'),
//        title: new showtime.RichText(cname ? cname : ''),
        title: new RichText(cname ? cname : ''),
//        icon: icon,
//        icon: poster,
        icon: avatar,
//        icon: LOGOAVATAR,
//        icon: LOGOAVATARS,
//        icon: LOGOICON,
//        icon: LOGOLOGO,
//        icon: LOGONONE,
//        icon: LOGOFOLDER,
//        icon: LOGOARROW,
//        icon: '',
        backdrops: backdrops,
//        tagline: new showtime.RichText(coloredStr(cname, gray)),
//        tagline: new RichText(coloredStr(cname, gray)),
//        description: new showtime.RichText(cname ? coloredStr(cname, gray) : ''),
        description: new RichText(cname ? coloredStr(cname, gray) : ''),
      });
    }
  }
  catch (err) {}
/*
  try {
    page.entries = 0;
    var tryToSearch = true;
    function loader() {
      if (!tryToSearch) return false;
      page.loading = true;
*/
/*
//      doc = showtime.httpReq(url).toString();
      doc = http.request(url).toString();
*/
/*
//      doc = showtime.httpReq(url, {
      doc = http.request(url, {
        debug: true,
//        debug: false,
//        noFollow: true,
//        noFollow: false,
        noFail: true,
//        noFail: false,
        compression: true,
//        compression: false,
//        caching: true,
//        caching: false,
//        cacheTime: 3600,
//        cacheTime: 6000,
//        postdata: postdata,
//        postdata: {},
//        headers: headers,
//        headers: {},
//      });
      }).toString();
//      }).convertFromEncoding('utf-8').toString();
//      }).convertFromEncoding('windows-1251').toString();
//      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">([\s\S]*?)<\/span>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<div id='comm-id-.*?'>([\s\S]*?)<\/div>([\s\S]*?)>Ответить<\/a>/g;
      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">(.*?)<\/span>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<div id='comm-id-.*?'>(.*?)<\/div>([\s\S]*?)>Ответить<\/a>/g;
//      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">([^"]+)<\/span>[\s\S]*?<span>([^"]+)<\/span>[\s\S]*?<div id='comm-id-.*?'>([^"]+)<\/div>([\s\S]*?)>Ответить<\/a>/g;
//      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">(.*?)<\/span>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<div id='comm-id-.*?'>(.*?)<\/div>/g;
//      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">([^"]+)<\/span>[\s\S]*?<span>([^"]+)<\/span>[\s\S]*?<div id='comm-id-.*?'>([^"]+)<\/div>/g;
      var match = re.exec(doc);
      var first = true;
      while (match) {
        try {
          var user = match[1];
//          user = user.replace(/<.*?>/g, '').trim();
        }
        catch (err) {
          user = '';
        }
//        user = showtime.entityDecode(user);
//        user = unescape(user);
//        user = decodeURIComponent(user);
        try {
          var date = match[2];
//          date = date.replace(/<.*?>/g, '').trim();
        }
        catch (err) {
//          date = '00-00-0000';
          date = '';
        }
//        date = showtime.entityDecode(date);
//        date = unescape(date);
//        date = decodeURIComponent(date);
        try {
          var comment = match[3];
//          comment = comment.replace(/<.*?>/g, '').trim();
          comment = comment.replace(/<br>/g, ' ').trim();
          comment = comment.replace(/(    |   |  )/g, ' ').trim();
        }
        catch (err) {
          comment = '';
        }
//        comment = showtime.entityDecode(comment);
//        comment = unescape(comment);
//        comment = decodeURIComponent(comment);
        var comrating = match[4].match(/<span class="ratingtypeplusminus.*?>(.*?)<\/span>/);
//        var comrating = match[4].match(/<span class="ratingtypeplusminus.*?>([^"]+)<\/span>/);
        try {
          comrating = comrating[1];
          comrating = comrating.replace(/<.*?>/g, '').trim();
          if (/\+/.test(comrating)) {
            comrating = coloredStr(comrating, green);
          }
          else if (/-/.test(comrating)) {
            comrating = coloredStr(comrating, red);
          }
          else {
            comrating = coloredStr(comrating, yellow);
          }
        }
        catch (err) {
//          comrating = 0;
          comrating = '';
        }
//        comrating = showtime.entityDecode(comrating);
//        comrating = unescape(comrating);
//        comrating = decodeURIComponent(comrating);
        page.loading = false;
        if (first) {
          var cname = 'Комментарии';
//          cname = showtime.entityDecode(cname);
//          cname = unescape(cname);
//          cname = decodeURIComponent(cname);
          var pages = doc.match(/<div class="navigation">.*?<span>(.*?)<\/span>/);
//          var pages = doc.match(/<div class="navigation">.*?<span>([^"]+)<\/span>/);
          try {
            pages = pages[1];
          }
          catch (err) {
//            pages = 0;
//            pages = 1;
            pages = '';
          }
//          pages = showtime.entityDecode(pages);
//          pages = unescape(pages);
//          pages = decodeURIComponent(pages);
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Комментарии:'),
//            title: new RichText('Комментарии:'),
//            title: new showtime.RichText(cname ? cname + ':' : ''),
//            title: new RichText(cname ? cname + ':' : ''),
//            title: new showtime.RichText('Комментарии' + (pages ? ' (' + pages + ')' : '') + ':'),
//            title: new RichText('Комментарии' + (pages ? ' (' + pages + ')' : '') + ':'),
//            title: new showtime.RichText((cname ? cname : '') + (pages ? ' (' + pages + ')' : '') + ':'),
            title: new RichText((cname ? cname : '') + (pages ? ' (' + pages + ')' : '') + ':'),
          });
//          first = true;
          first = false;
        }
//        var avatar = LOGOAVATAR;
        var avatar = LOGOAVATARS;
        var backdrops = [];
        try {
//          backdrops.push({url: icon});
          backdrops.push({url: poster});
//          backdrops.push({url: avatar});
//          backdrops.push({url: LOGOAVATAR});
//          backdrops.push({url: LOGOAVATARS});
//          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
        }
       catch (err) {
//          backdrops.push({url: icon});
//          backdrops.push({url: poster});
//          backdrops.push({url: avatar});
//          backdrops.push({url: LOGOAVATAR});
//          backdrops.push({url: LOGOAVATARS});
          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
//          backdrops.push({url: ''});
        }
//        page.appendPassiveItem('directory', '', {
//        page.appendPassiveItem('video', '', {
        page.appendPassiveItem(service.list, '', {
//          title: new showtime.RichText((user ? coloredStr(user, orange) : '') + ' ' + (date ? date : '')),
          title: new RichText((user ? coloredStr(user, orange) : '') + ' ' + (date ? date : '')),
//          icon: icon,
//          icon: poster,
          icon: avatar,
//          icon: LOGOAVATAR,
//          icon: LOGOAVATARS,
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          genre: new showtime.RichText(comrating ? comrating : ''),
          genre: new RichText(comrating ? comrating : ''),
//          genre: new showtime.RichText(comrating ? coloredStr(comrating, yellow) : ''),
//          genre: new RichText(comrating ? coloredStr(comrating, yellow) : ''),
//          source: new showtime.RichText(date ? coloredStr(date, orange) : ''),
          source: new RichText(date ? coloredStr(date, orange) : ''),
//          tagline: new showtime.RichText(user ? coloredStr(user, gray) : ''),
          tagline: new RichText(user ? coloredStr(user, gray) : ''),
//          description: new showtime.RichText(comment ? comment : ''),
          description: new RichText(comment ? comment : ''),
        });
        match = re.exec(doc);
      }
//      var more = doc.match(/<div class="pagi-load icon-left" id="pagi-load"><a href=( '|'| "|"| |)(.*?)('|"| ).*?><span class="fa fa-refresh"><\/span>Загрузить еще<\/a><\/div>/);
//      var more = doc.match(/<div class="pagi-load icon-left" id="pagi-load"><a href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = doc.match(/<div class="pagi-load.*?href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = doc.match(/<div class="navigation">.*?<span>.*?<\/span> <a href=( '|'| "|"| |)(.*?)('|"| ).*?>.*?<\/a>/);
//      var more = doc.match(/<div class="pnext"><a href=( '|'| "|"| |)(.*?)('|"| ).*?><span class="fa fa-angle-right"><\/span><\/a><\/div>/);
//      var more = doc.match(/<div class="pnext"><a href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = doc.match(/<div class="pnext".*?href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = doc.match(/["pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> ]+<a href=( '|'| "|"| |)(.*?)('|"| )/);
      var more = doc.match(/("pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> )<a href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = doc.match(/("pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> )<a href=( '|'| "|"| |)([^"]+)('|"| )/);
      if (!more) return tryToSearch = false;
      try {
//        url = more[2];
        url = more[3];
        url = url.replace(/(#comment|'|"| )/g, '').trim();
        if (/http.*?:\/\//.test(url)) {
          url = url;
        }
        else {
          url = HTTPS + BASE_URL + url;
//          url = HTTPS + BASE_URL + '///' + url;
        }
//        url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      }
      catch (err) {
        url = '';
      }
//      url = showtime.entityDecode(url);
//      url = unescape(url);
//      url = decodeURIComponent(url);
      return true;
    };
    loader();
    page.paginator = loader;
  }
  catch (err) {}
*/
  page.loading = false;
});
/*
//plugin.addURI(PREFIX + ':playerpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':playerpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
*/
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
/*
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
    var playlist = html.match(/class="tabs.*?">([\s\S]*?)<div class=".*?related.*?">/);
    if (playlist) {
//      page.entries = 0;
      page.entries = 1;
//      var replaylist = /<[iframe|IFRAME|script|div.*?"tabs-b video-box"]+(.*?)<\/(iframe|IFRAME|script|div)>/g;
      var replaylist = /<(iframe|IFRAME|script|div.*?"tabs-b video-box")(.*?)<\/(iframe|IFRAME|script|div)>/g;
//      var replaylist = /<(iframe|IFRAME|script|div.*?"tabs-b video-box")([^"]+)<\/(iframe|IFRAME|script|div)>/g;
      var match = replaylist.exec(playlist[1]);
      while (match) {
//        var playlisturl = match[1].match(/[file:|src=]+[ '|'| "|"| |]+(.*?)('|"| ).*?/);
        var playlisturl = match[2].match(/(file:|src=)( '|'| "|"| |)(.*?)('|"| ).*?/);
//        var playlisturl = match[2].match(/(file:|src=)( '|'| "|"| |)([^"]+)('|"| ).*?/);
        try {
//          playlisturl = playlisturl[1];
          playlisturl = playlisturl[3];
          playlisturl = playlisturl.replace(/('|"| )/g, '').trim();
          if (/http.*?:\/\//.test(playlisturl)) {
            playlisturl = playlisturl;
//            playlisturl = playlisturl + '///';
          }
          else if (/\/\//.test(playlisturl)) {
            playlisturl = HTTPS + playlisturl.replace(/(http:|https:|\/\/)/g, '').trim();
//            playlisturl = HTTPS + playlisturl.replace(/(http:|https:|\/\/)/g, '').trim() + '///';
          }
//          else if (/\/video\/film\/.*?(\.mp4|\.m3u8)/.test(playlisturl)) {
          else if (/(\.mp4|\.m3u8)/.test(playlisturl)) {
            playlisturl = HTTPS + 'kinorkn.com' + playlisturl;
//            playlisturl = HTTPS + 'kinorkn.com' + '///' + playlisturl;
          }
          else {
            playlisturl = HTTPS + BASE_URL + playlisturl;
//            playlisturl = HTTPS + BASE_URL + '///' + playlisturl;
//            playlisturl = HTTPS + BASE_URL + '///' + playlisturl + '///';
          }
//          playlisturl = playlisturl + '///';
//          playlisturl = playlisturl.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
        }
        catch (err) {
          playlisturl = '';
        }
//        playlisturl = showtime.entityDecode(playlisturl);
//        playlisturl = unescape(playlisturl);
//        playlisturl = decodeURIComponent(playlisturl);
        var playlistname;
*/
/*
        playlistname = playlisturl.match(/http.*?:\/\/(.*?)\//);
//        playlistname = playlisturl.match(/http.*?:\/\/([^"]+)\//);
        try {
          playlistname = playlistname[1];
        }
        catch (err) {
//          playlistname = 'Неопределенный';
//          playlistname = 'other.player';
          playlistname = '';
        }
//        playlistname = showtime.entityDecode(playlistname);
//        playlistname = unescape(playlistname);
//        playlistname = decodeURIComponent(playlistname);
*/
/*
        var uri;
//        if (/kinorkn\.com/.test(playlisturl)) {
        if (/kinorkn/.test(playlisturl)) {
          playlistname = 'kinorkn.com';
          uri = playlisturl;
//          uri = escape(playlisturl);
//          uri = encodeURIComponent(playlisturl);
        }
//        else if (/(vcdn\.icdn\.ws|.*?\.svetacdn\.in|.*?\.annacdn\.cc|cdn\.cdn-films\.xyz|me\.greenfilm\.xyz|films\.video-up\.online|kino\.stokino\.rest|full-hd\.ki1080no\.xyz|s.*?\.filmload\.me|kino.*?\.navigatorkino\.xyz|.*?up\.terobat\.work|up.*?\.kiberload\.pw|cloud.*?\.kifise\.xyz|server.*?\.film-s-load\.live|video\.kinosteel\.club|video\.kinogo\.lu)/.test(playlisturl)) {
        else if (/(icdn|svetacdn|annacdn|cdn-films|greenfilm|video-up|stokino|ki1080no|filmload|navigatorkino|terobat|kiberload|kifise|film-s-load|kinosteel|video\.kinogo\.lu)/.test(playlisturl)) {
          playlistname = 'cloud.cdnland.in';
          uri = PREFIX + ':cdnlandpage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':cdnlandpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':cdnlandpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
        }
//        else if (/(api\.tobaco\.ws|api.*?\.tobaco\.ws|api\.topdbltj\.ws|api.*?\.topdbltj\.ws|api.*?\.delivembd\.ws|api.*?\.synchroncode\.com|api\.hostemb\.ws)/.test(playlisturl)) {
        else if (/(tobaco|topdbltj|delivembd|synchroncode|hostemb)/.test(playlisturl)) {
          playlistname = 'takedwn.ws';
//          playlistname = 'zombie-film.com';
          uri = PREFIX + ':takedwnpage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':takedwnpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':takedwnpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
        }
//        else if (/shizahd\.ru/.test(playlisturl)) {
        else if (/shizahd/.test(playlisturl)) {
          playlistname = 'video.kpapps.net';
//          playlistname = 'kpapp.online';
          uri = PREFIX + ':kpappspage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':kpappspage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':kpappspage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
        }
//        else if (/700filmov\.ru\/movie\//.test(playlisturl)) {
        else if (/700filmov.*?\/movie\//.test(playlisturl)) {
          playlistname = 'sundb.nl';
          uri = PREFIX + ':sundbpage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':sundbpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':sundbpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
        }
        else {
          playlistname = 'other.player';
          uri = PREFIX + ':playlistpage:' + playlisturl + '~' + title + '~' + icon;
//          uri = PREFIX + ':playlistpage:' + escape(playlisturl) + '~' + escape(title) + '~' + escape(icon);
//          uri = PREFIX + ':playlistpage:' + encodeURIComponent(playlisturl) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
//          uri = '';
        }
//        playlistname = showtime.entityDecode(playlistname);
//        playlistname = unescape(playlistname);
//        playlistname = decodeURIComponent(playlistname);
        var backdrops = [];
        try {
          backdrops.push({url: icon});
//          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
        }
        catch (err) {
          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
//          backdrops.push({url: ''});
        }
        if (playlisturl) {
//        if (uri) {
//        if (playlistname) {
//          page.appendItem('', 'separator', {title: 'Видео:'});
//          page.appendItem(uri, 'directory', {
//          page.appendItem(uri, 'video', {
          page.appendItem(uri, service.list, {
//            title: new showtime.RichText(title),
//            title: new RichText(title),
//            title: new showtime.RichText(playlistname),
//            title: new RichText(playlistname),
//            title: new showtime.RichText('Плейер ' + page.entries),
            title: new RichText('Плейер ' + page.entries),
//            title: new showtime.RichText('Плейер ' + page.entries + (playlistname ? ' [' + playlistname + ']' : '')),
//            title: new RichText('Плейер ' + page.entries + (playlistname ? ' [' + playlistname + ']' : '')),
            icon: icon,
//            icon: LOGOICON,
//            icon: LOGOLOGO,
//            icon: LOGONONE,
//            icon: logoquality,
//            icon: '',
            backdrops: backdrops,
//            source: new showtime.RichText(playlistname ? playlistname : ''),
//            source: new RichText(playlistname ? playlistname : ''),
//            source: new showtime.RichText(playlistname ? coloredStr(playlistname, blue) : ''),
//            source: new RichText(playlistname ? coloredStr(playlistname, blue) : ''),
//            source: new showtime.RichText(playlistname ? coloredStr('Источник: ', gray) + playlistname : ''),
//            source: new RichText(playlistname ? coloredStr('Источник: ', gray) + playlistname : ''),
//            source: new showtime.RichText(playlistname ? coloredStr('Источник: ', gray) + coloredStr(playlistname, blue) : ''),
            source: new RichText(playlistname ? coloredStr('Источник: ', gray) + coloredStr(playlistname, blue) : ''),
//            tagline: new showtime.RichText(coloredStr(title, gray)),
            tagline: new RichText(coloredStr(title, gray)),
//            description: new showtime.RichText(coloredStr(title, gray)),
//            description: new RichText(coloredStr(title, gray)),
//            description: new showtime.RichText('Плейер ' + page.entries + (playlistname ? ' [' + playlistname + ']' : '')),
//            description: new RichText('Плейер ' + page.entries + (playlistname ? ' [' + playlistname + ']' : '')),
//            description: new showtime.RichText('Плейер ' + page.entries + '<br>' + (playlistname ? coloredStr(playlistname, gray) : '')),
            description: new RichText('Плейер ' + page.entries + '<br>' + (playlistname ? coloredStr(playlistname, gray) : '')),
          });
        }
        page.entries++;
        match = replaylist.exec(playlist[1]);
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
*/
/*
//plugin.addURI(PREFIX + ':playlistpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':playlistpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
*/
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
/*
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  scraperplaylist(page, html, title, icon);
  page.loading = false;
});
*/
//plugin.addURI(PREFIX + ':cdnlandpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':cdnlandpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
  // Ensure page renders appended items
  try {
    page.type = 'directory';
    if (page.model && page.model.contents !== undefined) {
      page.model.contents = 'list';
    } else {
      page.contents = 'items';
    }
    if (title) page.metadata.title = new RichText(title);
  } catch(__ui) {}
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
  // Simple, clean implementation: fetch embed HTML (with minimal fallback), parse DOM for csrf-token and playlist path,
  // then fetch the playlist JSON and render it.

  // 0) If we were passed a direct playlist URL, handle it immediately
  try {
    if (/\/playlist\/.*?\.txt(\?|$)/i.test(url)) {
      try { dlog('CDNLAND: direct playlist URL detected, fetching: ' + url); } catch(e0) {}
      var payload0 = (function(purl){
        var body = '';
        // Try POST with CSRF (none here), then GET, then POST without CSRF
        try { body = http.request(purl, {debug:true, noFail:true, compression:true}).toString(); } catch(_) {}
        if (!body || !body.length) {
          try { body = http.request(purl, {debug:true, noFail:true, compression:true, postdata:'', headers:{'Accept':'*/*','Origin': HTTPS + BASE_URL,'Referer': REFERER,'Content-Type':'application/x-www-form-urlencoded','User-Agent': UA}}).toString(); } catch(_) {}
        }
        return body || '';
      })(url);
      if (!payload0 && /sitsarl\.com/i.test(url)) {
        var alt0 = url.replace(/^https?:\/\/[^/]*sitsarl\.com/i, 'https://vid11.entouaedon.com');
        try { dlog('CDNLAND: retry playlist on entouaedon: ' + alt0); } catch(e01) {}
        payload0 = (function(purl){
          var body = '';
          try { body = http.request(purl, {debug:true, noFail:true, compression:true}).toString(); } catch(_) {}
          if (!body || !body.length) {
            try { body = http.request(purl, {debug:true, noFail:true, compression:true, postdata:'', headers:{'Accept':'*/*','Origin': HTTPS + BASE_URL,'Referer': REFERER,'Content-Type':'application/x-www-form-urlencoded','User-Agent': UA}}).toString(); } catch(_) {}
          }
          return body || '';
        })(alt0);
      }
      if (payload0 && payload0.length) {
        var isSeries0 = /tv_series|\{"id":".*?","comment":".*?".*?file":"/i.test(payload0);
        var poster0 = icon;
        if (isSeries0) scrapercdnlandseries(page, payload0, title, icon, poster0, '');
        else scrapercdnland(page, payload0, title, icon, poster0, '');
        page.loading = false;
        return;
      }
    }
  } catch (e00) { try { dlog('CDNLAND: direct playlist preflight error: ' + e00); } catch(_) {} }

  function getOrigin(u) {
    try {
      var m = u.match(/^(https?:\/\/[^/]+)/i);
      return m ? m[1] : '';
    } catch (e) { return ''; }
  }

  function replaceToEntouaedon(u) {
    try {
      // Replace any sitsarl host to a sane default entouaedon host
      return u.replace(/^https?:\/\/[^/]*sitsarl\.com/i, 'https://vid11.entouaedon.com');
    } catch (e) { return u; }
  }

  function safeGet(u) {
    try { dlog('CDNLAND GET: ' + u); } catch(e) {}
    try {
      // Emulate browser context expected by entouaedon: kinogo Origin/Referer and UA/Accept-Language
      return http.request(u, {debug:true, noFail:true, compression:true, headers:{
        'User-Agent': UA,
        'Origin': HTTPS + BASE_URL,
        'Referer': REFERER,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
      }}).toString();
    } catch (err) {
      try { dlog('CDNLAND GET failed: ' + err); } catch(_) {}
      return '';
    }
  }

  // 1) Try original URL; if DNS fails or empty, try entouaedon replacement
  var embedHtml = safeGet(url);
  var usedUrl = url;
  if (!embedHtml || embedHtml.length === 0) {
    var altUrl = replaceToEntouaedon(url);
    if (altUrl !== url) {
      var altHtml = safeGet(altUrl);
      if (altHtml && altHtml.length) {
        embedHtml = altHtml;
        usedUrl = altUrl;
      }
    }
  }
  // Compute origin of the page we actually fetched (used for resolving relative script URLs)
  var baseOrigin = getOrigin(usedUrl);

  // 2) Parse DOM, extract csrf meta and playlist path from scripts
  var csrfToken = '';
  var playlistPath = '';
  try {
    var dom = html.parse(embedHtml || '');
    // csrf token
    try {
      var heads = dom.root.getElementsByTagName ? dom.root.getElementsByTagName('head') : [];
      if (heads && heads.length) {
        var metas = heads[0].getElementsByTagName ? heads[0].getElementsByTagName('meta') : [];
        for (var i = 0; i < metas.length; i++) {
          var nm = metas[i].attributes ? metas[i].attributes.getNamedItem('name') : null;
          if (nm && /(csrf-token|x-csrf-token|csrf)/i.test(nm.value)) {
            var ct = metas[i].attributes ? metas[i].attributes.getNamedItem('content') : null;
            if (ct && ct.value) csrfToken = ct.value;
          }
        }
      }
      try { dlog('CDNLAND: csrf-token ' + (csrfToken ? 'found' : 'not found via DOM')); } catch(_dbg1) {}
    } catch(eh) {}
    if (!csrfToken) {
      var m1 = (embedHtml||'').match(/name=("|')csrf-token\1\s+content=("|')(.*?)\2/i);
      if (m1 && m1[3]) csrfToken = m1[3];
    }
    // Fallback: try fetching the host root to obtain a CSRF meta if not present on iframe 404 body
    if (!csrfToken && baseOrigin) {
      try {
        var rootHtml = http.request(baseOrigin + '/', {debug:true, noFail:true, compression:true, headers:{
          'User-Agent': UA,
          'Origin': HTTPS + BASE_URL,
          'Referer': REFERER,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
        }}).toString();
        var m2 = (rootHtml||'').match(/name=("|')csrf-token\1\s+content=("|')(.*?)\2/i);
        if (m2 && m2[3]) csrfToken = m2[3];
        try { dlog('CDNLAND: csrf-token ' + (csrfToken ? 'found on root page' : 'still not found')); } catch(_dbg1b) {}
      } catch(_rt) {}
    }

    // scripts: look for /playlist/*.txt|.json (may contain \uXXXX)
    var scriptsText = '';
    try {
      var scripts = dom.root.getElementsByTagName('script');
      for (var si = 0; si < scripts.length; si++) {
        if (scripts[si].textContent) scriptsText += scripts[si].textContent + '\n';
      }
    } catch(es) {}
    try { dlog('CDNLAND: inline scripts bytes=' + scriptsText.length); } catch(_dbg2) {}
    // Also fetch a few external scripts to look for playlist hints (from DOM and via regex fallback)
    try {
      var fetched = 0, maxFetch = 6;
      var srcList = [];
      try {
        var scripts2 = dom.root.getElementsByTagName('script');
        for (var sj = 0; sj < scripts2.length; sj++) {
          var srcAttr = scripts2[sj].attributes ? scripts2[sj].attributes.getNamedItem('src') : null;
          if (srcAttr && srcAttr.value) srcList.push(srcAttr.value.trim());
        }
      } catch(_sdom) {}
      // Fallback: regex-search in raw HTML for <script src="...">
      try {
        var re = /<script[^>]+src=(['"])(.*?)\1/ig, m;
        while ((m = re.exec(embedHtml))) {
          if (m[2]) srcList.push(m[2]);
        }
      } catch(_sre) {}
      // Deduplicate
      var seenSrc = {};
      for (var si2 = 0; si2 < srcList.length && fetched < maxFetch; si2++) {
        var s = srcList[si2];
        if (!s || seenSrc[s]) continue;
        seenSrc[s] = 1;
        var abs = s;
        if (/^\/\//.test(s)) abs = (HTTPS.replace(/:\/\/$/, '') + ':') + s; // protocol-relative
        else if (/^\//.test(s)) abs = (baseOrigin || (HTTPS + BASE_URL)) + s;
        else if (!/^https?:\/\//i.test(s)) abs = (baseOrigin || (HTTPS + BASE_URL)) + '/' + s;
        try { dlog('CDNLAND: fetching external script: ' + abs); } catch(exf) {}
        try {
          var stxt = http.request(abs, {debug:true, noFail:true, compression:true, headers:{
            'User-Agent': UA,
            'Referer': usedUrl,
            // Important: use Kinogo origin to mimic browser context
            'Origin': (HTTPS + BASE_URL),
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
          }}).toString();
          if (stxt && stxt.length) {
            scriptsText += '\n' + stxt + '\n';
            fetched++;
          }
        } catch (ejs) { /* ignore individual failures */ }
      }
      try { dlog('CDNLAND: external scripts fetched=' + fetched); } catch(_exn) {}
    } catch (es2) {}
    // Decode unicode escapes and HTML entities in the whole embed to improve matching
    var decodedHtml = (embedHtml || '');
    try {
      decodedHtml = decodedHtml.replace(/\\u([0-9a-fA-F]{4})/g, function(_,h){return String.fromCharCode(parseInt(h,16));});
      decodedHtml = decodedHtml
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&#(\d+);/g, function(_,d){return String.fromCharCode(parseInt(d,10));})
        .replace(/&#x([0-9a-fA-F]+);/g, function(_,h){return String.fromCharCode(parseInt(h,16));});
    } catch (edAll) {}
    // Try extracting from inline playerConfigs assignment (contains key and file)
    try {
      function extractJsonObjectAfterAssignment(src, varName) {
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
            if (ch === '{') depth++;
            else if (ch === '}') {
              depth--;
              if (depth === 0) return src.substring(i, j + 1);
            }
          }
        } catch(e) {}
        return '';
      }
      var pcRaw = extractJsonObjectAfterAssignment((decodedHtml||''), 'playerConfigs');
      if (!pcRaw) pcRaw = extractJsonObjectAfterAssignment((scriptsText||''), 'playerConfigs');
      if (pcRaw) {
        try {
          var pcJson = JSON.parse(pcRaw
            .replace(/&quot;/g,'"')
            .replace(/\\u([0-9a-fA-F]{4})/g, function(_,h){return String.fromCharCode(parseInt(h,16));}));
          if (pcJson && typeof pcJson === 'object') {
            if (!csrfToken && pcJson.key) csrfToken = pcJson.key;
            if (!playlistPath && pcJson.file) playlistPath = pcJson.file; // often like '/playlist/<token>.txt'
            try { dlog('CDNLAND: playerConfigs parsed' + (csrfToken? ' [key]' : '') + (playlistPath? ' [file]' : '')); } catch(_pcd) {}
          }
        } catch(_pcp) {}
      }
    } catch(_pce) {}

    // Try to find absolute playlist first (any host)
    var pmAbs = decodedHtml.match(/https?:\/\/[^'"\s]+\/playlist\/[^'"\s]+\.(?:txt|json)/i);
    if (pmAbs && pmAbs[0]) {
      playlistPath = pmAbs[0];
      try { dlog('CDNLAND playlist ABS path found: ' + playlistPath); } catch(epl1) {}
    }
    if (!playlistPath) {
      // Try from scripts or anywhere in HTML as a relative path
      var pmScriptRel = scriptsText.match(/\/(playlist\/[^'"\s]+\.(?:txt|json))/i);
      var pmRel = pmScriptRel || decodedHtml.match(/\/(playlist\/[^'"\s]+\.(?:txt|json))/i);
      if (pmRel && pmRel[1]) {
        playlistPath = pmRel[1];
        try { dlog('CDNLAND playlist REL path found: ' + playlistPath); } catch(epl2) {}
      }
    }
    if (!playlistPath) {
      // Try PlayerJS file: '...'
      var pf1 = scriptsText.match(/\bfile\s*:\s*(['"])(.*?)\1/i);
      var pf2 = scriptsText.match(/\bfile\s*\(\s*(['"])(.*?)\1\s*\)/i);
      var cand = (pf1 && pf1[2]) ? pf1[2] : ((pf2 && pf2[2]) ? pf2[2] : '');
      if (cand && /playlist\/.+\.(?:txt|json)/i.test(cand)) {
        playlistPath = cand;
        try { dlog('CDNLAND playlist from PlayerJS file: ' + playlistPath); } catch(epl3) {}
      }
    }
    // Decode any remaining \\uXXXX in just the path
    try { playlistPath = playlistPath.replace(/\\u([0-9a-fA-F]{4})/g, function(_,h){return String.fromCharCode(parseInt(h,16));}); } catch(ed) {}
  } catch (e) {
    try { dlog('CDNLAND DOM parse error: ' + e); } catch(_) {}
  }

  // 3) Build playlist URL
  if (!playlistPath) {
    // As a fallback, try deriving playlist directly from embed URL token
    try { dlog('CDNLAND: playlist path not found in scripts'); } catch(e) {}
    try {
      var mm = usedUrl.match(/\/((?:serial|movie|video))\/([A-Za-z0-9_-]+)\/iframe/i);
      if (mm && mm[2]) {
        var guessId = mm[2];
        // first try .txt then .json
        playlistPath = '/playlist/' + guessId + '.txt';
        try { dlog('CDNLAND: guessing playlist path from URL token: ' + playlistPath); } catch(_g1) {}
      }
    } catch(_gf) {}
  }
  var playlistUrl = '';
  if (playlistPath) {
    if (/^https?:\/\//i.test(playlistPath)) playlistUrl = playlistPath;
    else playlistUrl = (baseOrigin || 'https://vid11.entouaedon.com') + (playlistPath.charAt(0) === '/' ? '' : '/') + playlistPath;
    try { dlog('CDNLAND playlist URL built: ' + playlistUrl); } catch(eu) {}
  }

  // 4) Fetch playlist JSON (prefer POST with CSRF; then GET with headers; then POST without CSRF; with cachebuster)
  function fetchPlaylist(purl) {
    var headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      // Critical: use Kinogo Origin/Referer like the browser did (per HAR)
      'Origin': (HTTPS + BASE_URL),
      'Referer': REFERER,
      'User-Agent': UA,
      'X-Requested-With': 'XMLHttpRequest',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
    };
    var body = '';
    if (csrfToken) {
      // Send multiple casings to avoid any backend quirks (headers are case-insensitive, but be extra safe)
      headers['X-CSRF-TOKEN'] = csrfToken;   // as seen in some scripts
      headers['X-CSRF-Token'] = csrfToken;   // common casing
      headers['x-csrf-token'] = csrfToken;   // as seen in HAR
      try {
        body = http.request(purl, {debug:true, noFail:true, compression:true, postdata:'', headers: headers}).toString();
        if (body && body.length > 0) return body;
      } catch(e1) {
        try { dlog('CDNLAND playlist POST with CSRF failed: ' + e1); } catch(_) {}
      }
    }
    try {
      body = http.request(purl, {debug:true, noFail:true, compression:true, headers: headers}).toString();
      if (body && body.length > 0) return body;
    } catch(e2) {
      try { dlog('CDNLAND playlist GET failed: ' + e2); } catch(_) {}
    }
    // Try GET with cache-buster
    try {
      var cbUrl = purl + (purl.indexOf('?') >= 0 ? '&' : '?') + '_=' + Date.now();
      body = http.request(cbUrl, {debug:true, noFail:true, compression:true, headers: headers}).toString();
      if (body && body.length > 0) return body;
    } catch(e2b) {
      try { dlog('CDNLAND playlist GET (cb) failed: ' + e2b); } catch(_) {}
    }
    try {
      body = http.request(purl, {debug:true, noFail:true, compression:true, postdata:'', headers: headers}).toString();
      if (body && body.length > 0) return body;
    } catch(e3) {
      try { dlog('CDNLAND playlist POST (no CSRF) failed: ' + e3); } catch(_) {}
    }
    return '';
  }

  var payload = '';
  if (playlistUrl) {
    payload = fetchPlaylist(playlistUrl);
    if (!payload && /sitsarl\.com/i.test(playlistUrl)) {
      // Try same path on entouaedon if sitsarl playlist host is blocked
      var altP = replaceToEntouaedon(playlistUrl);
      if (altP !== playlistUrl) payload = fetchPlaylist(altP);
    }
    // Generic low-risk fallback: try .json if .txt returned nothing
    if (!payload && /\.txt(\?|$)/i.test(playlistUrl)) {
      try { dlog('CDNLAND: retrying playlist as .json'); } catch(_djson) {}
      var jsonUrl = playlistUrl.replace(/\.txt(\b|$)/i, '.json');
      payload = fetchPlaylist(jsonUrl);
      if (!payload && /sitsarl\.com/i.test(jsonUrl)) {
        var jsonAlt = replaceToEntouaedon(jsonUrl);
        if (jsonAlt !== jsonUrl) payload = fetchPlaylist(jsonAlt);
      }
    }
  }

  if (payload && payload.length > 0) {
    if (payload.length < 10) { try { dlog('CDNLAND: payload too small (' + payload.length + '), treating as empty'); } catch(_ts) {} payload = ''; }
  }

  if (payload && payload.length > 0) {
    try {
      try { dlog('CDNLAND: payload bytes=' + payload.length); } catch(_pd) {}

      // Helper: attempt to extract and parse a JSON block from payload
      function tryParsePlayerJSON(txt) {
        if (!txt) return null;
        var s = ('' + txt).trim();
        // Decode common HTML entities in case server wrapped it
        try {
          s = s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
               .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
               .replace(/&#(\d+);/g, function(_,d){return String.fromCharCode(parseInt(d,10));})
               .replace(/&#x([0-9a-fA-F]+);/g, function(_,h){return String.fromCharCode(parseInt(h,16));});
        } catch(_e) {}
        var m = s.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (!m) return null;
        try { return JSON.parse(m[1]); } catch(e1) {}
        // Some playlists escape backslashes excessively, try unescaping once
        try { return JSON.parse(m[1].replace(/\\"/g, '"')); } catch(e2) {}
        return null;
      }

      // Helper: base64-like decode used by some tokenized sources ("~..."), tolerant of - _ $ variations
      function tryBase64UrlishDecode(s) {
        try {
          if (!s) return '';
          // Normalize URL-safe/Base64 variants
          var t = ('' + s).replace(/-/g, '+').replace(/_/g, '/').replace(/\$/g, '=');
          // Pad to multiple of 4
          while (t.length % 4 !== 0) t += '=';
          var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
          var out = '';
          var i = 0;
          t = t.replace(/[^A-Za-z0-9\+\/\=]/g, '');
          while (i < t.length) {
            var enc1 = b64.indexOf(t.charAt(i++));
            var enc2 = b64.indexOf(t.charAt(i++));
            var enc3 = b64.indexOf(t.charAt(i++));
            var enc4 = b64.indexOf(t.charAt(i++));
            if (enc1 < 0 || enc2 < 0 || enc3 < 0 || enc4 < 0) return '';
            var chr1 = (enc1 << 2) | (enc2 >> 4);
            var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            var chr3 = ((enc3 & 3) << 6) | enc4;
            out += String.fromCharCode(chr1);
            if (enc3 != 64) out += String.fromCharCode(chr2);
            if (enc4 != 64) out += String.fromCharCode(chr3);
          }
          return out;
        } catch(_e) { return ''; }
      }

      // RC4 (ARCFOUR) stream cipher for common site obfuscations
      function rc4(key, data) {
        try {
          var s = [], i, j = 0, x, res = '';
          for (i = 0; i < 256; i++) s[i] = i;
          for (i = 0; i < 256; i++) {
            j = (j + s[i] + key.charCodeAt(i % key.length)) & 255;
            x = s[i]; s[i] = s[j]; s[j] = x;
          }
          i = 0; j = 0;
          for (var y = 0; y < data.length; y++) {
            i = (i + 1) & 255;
            j = (j + s[i]) & 255;
            x = s[i]; s[i] = s[j]; s[j] = x;
            var k = s[(s[i] + s[j]) & 255];
            res += String.fromCharCode(data.charCodeAt(y) ^ k);
          }
          return res;
        } catch(e) { return ''; }
      }

      // Simple XOR with repeating key
      function xorWithKey(data, key) {
        try {
          var out = '';
          for (var i = 0; i < data.length; i++) {
            out += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
          }
          return out;
        } catch(e) { return ''; }
      }

      // Collect candidate keys from scripts and context (csrfToken, obvious literals)
      function collectCandidateKeys() {
        var keys = [];
        var seen = {};
        function add(k) { if (k && k.length >= 4 && !seen[k]) { seen[k] = 1; keys.push(k); } }
        try { if (csrfToken) add(csrfToken); } catch(_ck0) {}
        try {
          var st = (scriptsText || '');
          // Common patterns like key: "...", token: '...', salt="..."
          var re = /(key|token|salt|secret)\s*[:=]\s*(["'])([^"']{6,128})\2/ig, m;
          while ((m = re.exec(st))) add(m[3]);
          // playerConfigs.key was already picked via csrfToken, but scan raw embed too
          var m2 = (st.match(/playerConfigs\s*=\s*\{[\s\S]*?key\s*:\s*(["'])([^"']{6,128})\1/i));
          if (m2 && m2[2]) add(m2[2]);
        } catch(_ck1) {}
        return keys;
      }

      // Attempt to resolve a token that starts with '~' to a direct URL
      function tryResolveTokenToUrl(tok) {
        if (!tok || tok.charAt(0) !== '~') return '';
        var core = tok.substr(1);
        // Heuristic 1: base64/url-safe decode attempt
        var dec = tryBase64UrlishDecode(core);
        if (dec && /https?:\/\//i.test(dec)) {
          try { dlog('CDNLAND: token base64-decoded to URL: ' + dec.substr(0, 120) + (dec.length > 120 ? '…' : '')); } catch(_l1) {}
          return dec;
        }
        // Heuristic 2: sometimes a second decode layer
        if (dec && /^[A-Za-z0-9\-_$+/]+$/.test(dec)) {
          var dec2 = tryBase64UrlishDecode(dec);
          if (dec2 && /https?:\/\//i.test(dec2)) {
            try { dlog('CDNLAND: token double-decoded to URL: ' + dec2.substr(0, 120) + (dec2.length > 120 ? '…' : '')); } catch(_l2) {}
            return dec2;
          }
        }
        // Heuristic 3: sometimes decoded text contains embedded http
        if (dec) {
          var m = dec.match(/https?:\/\/[^\s"']+/i);
          if (m && m[0]) {
            try { dlog('CDNLAND: token decoded contained URL: ' + m[0].substr(0, 120) + (m[0].length > 120 ? '…' : '')); } catch(_l3) {}
            return m[0];
          }
        }
        // Site-specific: try RC4/XOR over the base64-decoded blob with various keys
        var keys = collectCandidateKeys();
        if (dec && keys.length) {
          for (var ki = 0; ki < keys.length; ki++) {
            var k = keys[ki];
            // RC4
            var r1 = rc4(k, dec);
            if (r1 && /https?:\/\//i.test(r1)) {
              try { dlog('CDNLAND: token resolved via RC4(' + (k.length) + '): ' + r1.substr(0, 120) + (r1.length > 120 ? '…' : '')); } catch(_l4) {}
              return r1;
            }
            // Sometimes after RC4 it is still base64
            var r1b = tryBase64UrlishDecode(r1 || '');
            if (r1b && /https?:\/\//i.test(r1b)) {
              try { dlog('CDNLAND: token RC4+base64 resolved: ' + r1b.substr(0, 120) + (r1b.length > 120 ? '…' : '')); } catch(_l4b) {}
              return r1b;
            }
            // XOR
            var r2 = xorWithKey(dec, k);
            if (r2 && /https?:\/\//i.test(r2)) {
              try { dlog('CDNLAND: token resolved via XOR(' + (k.length) + '): ' + r2.substr(0, 120) + (r2.length > 120 ? '…' : '')); } catch(_l5) {}
              return r2;
            }
            var r2b = tryBase64UrlishDecode(r2 || '');
            if (r2b && /https?:\/\//i.test(r2b)) {
              try { dlog('CDNLAND: token XOR+base64 resolved: ' + r2b.substr(0, 120) + (r2b.length > 120 ? '…' : '')); } catch(_l5b) {}
              return r2b;
            }
          }
        }
        // Last chance: try reversing and decoding
        if (dec) {
          var rev = dec.split('').reverse().join('');
          var mr = rev.match(/https?:\/\/[^\s"']+/i);
          if (mr && mr[0]) return mr[0].split('').reverse().join('');
        }
        return '';
      }

  var dbgTokensSeen = 0, dbgTokensResolved = 0;
  // Test mode: stop after first successfully appended playable item to avoid
  // hammering the provider while verifying token resolution path
  var stopAfterFirst = true;
  try { if (stopAfterFirst) dlog('CDNLAND: STOP_AFTER_FIRST is enabled for test'); } catch(_sf) {}

      // Build playlist URL for a per-episode token
      function buildTokenPlaylistUrl(tok) {
        var token = tok.charAt(0) === '~' ? tok.substr(1) : tok;
        // Token from JSON usually already contains !! at the end; don't duplicate it.
        var hasBangBang = /!!$/.test(token);
        var base = baseOrigin || 'https://vid11.entouaedon.com';
        var url = base + (base.charAt(base.length-1) === '/' ? '' : '/') + 'playlist/' + token + (hasBangBang ? '' : '!!') + '.txt';
        // If host is sitsarl mirror, normalize to entouaedon which we know works
        if (/sitsarl\.com/i.test(url)) url = replaceToEntouaedon(url);
        return url;
      }

      // Fetch per-episode token playlist and return its resolved file string (URL or bracketed list)
      function fetchTokenFile(tok) {
        var u = buildTokenPlaylistUrl(tok);
        try { dlog('CDNLAND: fetching token playlist: ' + u); } catch(_ft) {}
        var payload = '';
        function req(method, url, addHeaders) {
          try {
            var headers = {
              'User-Agent': UA,
              'Accept': '*/*',
              'Origin': (HTTPS + BASE_URL),
              'Referer': REFERER,
              'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
            };
            if (addHeaders) for (var k in addHeaders) headers[k] = addHeaders[k];
            var resp = http.request(url, { method: method, debug:true, noFail:true, compression:true, headers: headers, postdata: (method === 'POST' ? '' : null) });
            if (resp && resp.statuscode >= 200 && resp.statuscode < 300) return resp.toString();
          } catch(e) { /* ignore */ }
          return '';
        }
        // Try POST with CSRF
        if (csrfToken) {
          payload = req('POST', u, {'X-CSRF-TOKEN': csrfToken, 'X-CSRF-Token': csrfToken, 'x-csrf-token': csrfToken});
        }
        // Fallbacks
        if (!payload) payload = req('GET', u);
        if (!payload) payload = req('GET', u + (u.indexOf('?')>=0?'&':'?') + 'cb=' + Date.now());
        if (!payload) payload = req('POST', u);
        if (!payload && /sitsarl\.com/i.test(u)) payload = req('POST', replaceToEntouaedon(u));
        payload = (payload || '');
        if (payload.length < 4) return '';
  // Try parse JSON first, else plain string
        var j = tryParsePlayerJSON(payload);
        if (j && typeof j === 'object') {
          // Favor direct file/hls/src inside
          var f = j.file || j.hls || j.src || '';
          if (!f && j.playlist && j.playlist.length) {
            // Sometimes contains a nested list of one
            var it = j.playlist[0] || {};
            f = it.file || it.hls || it.src || '';
          }
          if (!f && j.folder && j.folder.length) {
            var it2 = j.folder[0] || {};
            f = it2.file || it2.hls || it2.src || '';
          }
          if (f) return f;
        }
        // Plain: could be direct URL or an HLS playlist content or bracket list
        var txt = (payload || '').replace(/^[\s\uFEFF\u200B]+|[\s\uFEFF\u200B]+$/g, '');
        if (/^https?:\/\//i.test(txt)) return txt;
        // If it's an M3U playlist content, extract the first absolute URL if present
        if (/^#EXTM3U/.test(txt)) {
          var m = txt.match(/https?:\/\/[^\s"']+/i);
          if (m && m[0]) { try { dlog('CDNLAND: token m3u absolute URL: ' + m[0].substr(0,120) + (m[0].length>120?'…':'')); } catch(_) {} return m[0]; }
          // Try to resolve common relative forms like /stream2/cdn-401/... or /stream2/b-401/.../index.m3u8
          var mrel = txt.match(/\n\s*([^\n#][^\s"']*\.(?:m3u8|m3u))\s*(?:\n|$)/i);
          if (mrel && mrel[1]) {
            var rel = mrel[1].trim();
            // Extract host marker from path
            var mh = rel.match(/\/(?:stream2?|hls)\/(?:((?:b|cdn)-\d{1,4}))\//i);
            var host = mh && mh[1] ? (mh[1] + '.entouaedon.com') : '';
            if (host) {
              if (rel.charAt(0) !== '/') rel = '/' + rel;
              var abs = 'https://' + host + rel;
              try { dlog('CDNLAND: token m3u relative -> ' + abs.substr(0,120) + (abs.length>120?'…':'')); } catch(_) {}
              return abs;
            }
          }
          return '';
        }
        // Else try to extract a URL anywhere in the text
        var m2 = txt.match(/https?:\/\/[^\s"']+/i);
        if (m2 && m2[0]) return m2[0];
        return txt;
      }

      // Helper: append a single file item (mp4/m3u8) or delegate bracket-quality string to legacy parser
      function appendFileOrQualityList(page, fileStr, displayTitle, title, icon, poster, translationid, season, serie, translation) {
        if (!fileStr) return 0;
        var appended = 0;
        // Decode common JS-escaped sequences that may appear in JSON values
        try {
          fileStr = ('' + fileStr)
            .replace(/\\u0021/gi, '!')
            .replace(/\\u0026/gi, '&')
            .replace(/\\u002F/gi, '/')
            .replace(/\\u003F/gi, '?')
            .replace(/\\\//g, '/')
            .replace(/\\\\/g, '\\')
            .replace(/\\u([0-9a-fA-F]{4})/g, function(_,h){return String.fromCharCode(parseInt(h,16));});
        } catch(_dec) {}
          // Some providers return an obfuscated token starting with '~' instead of a direct URL.
          if (/^~/.test(fileStr)) {
            dbgTokensSeen++;
            // First try local decode heuristics
            var resolved = tryResolveTokenToUrl(fileStr);
            if (!resolved) {
              // Official flow: use token as /playlist/<token>!!.txt to get per-episode URL
              resolved = fetchTokenFile(fileStr);
            }
            if (resolved) {
              dbgTokensResolved++;
              fileStr = resolved;
            } else {
              try { dlog('CDNLAND: got token but could not resolve via decode nor remote fetch: ' + fileStr.substr(0, 72) + '…'); } catch(_tok) {}
              return 0;
            }
          }
        // If it's a bracket quality list, reuse legacy parser
        if (/\[[^\]]+\]/.test(fileStr) && /(https?:)?\//.test(fileStr)) {
            // Try to resolve any embedded tokens inside the bracket list first
            if (/~[A-Za-z0-9\-_$+/]+/.test(fileStr)) {
              fileStr = fileStr.replace(/:~([A-Za-z0-9\-_$+/]+)/g, function(all, tok){
                var tokFull = '~' + tok;
                dbgTokensSeen++;
                var r = tryResolveTokenToUrl(tokFull);
                if (!r) r = fetchTokenFile(tokFull);
                if (r) { dbgTokensResolved++; return ':' + r; }
                try { dlog('CDNLAND: token in bracket list unresolved: ' + tokFull.substr(0, 48) + '…'); } catch(_tb) {}
                return all; // leave as-is
              });
            }
          if (stopAfterFirst) {
            // Append only the first quality pair
            var mOne = fileStr.match(/\[(.*?)\]([^,\n\r"']+)/);
            if (mOne && mOne[2]) {
              var qname = (mOne[1] || '').trim();
              var qurl = (mOne[2] || '').trim();
              try {
                qurl = qurl.replace(/\\\//g, '/');
                if (/^~/.test(qurl)) {
                  var resQ = tryResolveTokenToUrl(qurl);
                  if (!resQ) resQ = fetchTokenFile(qurl);
                  if (resQ) qurl = resQ; else return 0;
                }
                if (/^\/\//.test(qurl)) qurl = (HTTPS.replace(/:\/\/$/, '') + ':') + qurl;
                else if (!/^https?:\/\//i.test(qurl)) qurl = HTTPS + BASE_URL + qurl;
                // hls: prefix not needed in Movian; use plain URL
                // if (/\.m3u8(\?|$)/i.test(qurl)) qurl = 'hls:' + qurl;
              } catch(_nu) {}
              try { dlog('CDNLAND: append single quality source: ' + qurl.substr(0, 160) + (qurl.length>160?'…':'')); } catch(_) {}
              try {
                page.appendItem(qurl, service.list, {
                  title: new RichText(qname || displayTitle || 'Эпизод'),
                  icon: icon,
                  backdrops: poster ? [{url: poster}] : [{url: icon}],
                  genre: new RichText((season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
                  source: new RichText((translationid ? coloredStr('Перевод: ', gray) + coloredStr(translationid, blue) : '') + (translation ? coloredStr(' [' + translation + ']', blue) : '')),
                  tagline: new RichText(coloredStr(title, gray))
                });
                appended += 1;
              } catch(_ao) {}
              return appended;
            }
          }
          var before = page.entries || 0;
          scrapercdnland(page, fileStr, title, icon, poster, translationid, season, serie, translation);
          var after = page.entries || 0;
          appended += Math.max(0, (after - before));
          return appended;
        }
        // Else treat as a single source
        try {
          var playUrl = fileStr;

          // playUrl = "https://b-401.entouaedon.com/stream2/b-401/36dc763296fb529d2a465105a46fb25d/MJTMsp1RshGTygnMNRUR2N2MSlnWXZEdMNDZzQWe5MDZzMmdZJTO1R2RWVHZDljekhkSsl1VwYnWtx2cihVT290RVFzTUJFaNRUVw4kanFzTHpEbZpnWo1EVBd3TH5EbNRlSo5keW1mWqNWP:1762376150:91.215.146.225:e39048c1af7e08135c0026b13ed0d2f74daa82d6135722117aaeb0ca44e4e6da/index.m3u8";
          dlog('CDNLAND: append single source: ' + playUrl);
          var item = page.appendItem(playUrl, service.list, {
            title: new RichText(displayTitle || 'Эпизод'),
            icon: icon,
            backdrops: poster ? [{url: poster}] : [{url: icon}],
            genre: new RichText((season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
            source: new RichText((translationid ? coloredStr('Перевод: ', gray) + coloredStr(translationid, blue) : '') + (translation ? coloredStr(' [' + translation + ']', blue) : '')),
            tagline: new RichText(coloredStr(title, gray))
          });
          dlog('CDNLAND: appended single source: ' + item);
          appended += 1;
        } catch(_a) {
          try { dlog('CDNLAND: append single source failed: ' + _a); } catch(_) {}
        }
        return appended;
      }

      // Try JSON-based render first
      var json = tryParsePlayerJSON(payload);
      var totalAppended = 0;
  if (json && typeof json === 'object') {
        try { if (json.key) { csrfToken = json.key; dlog('CDNLAND: updated csrfToken from playlist JSON'); } } catch(_kset) {}
        try { dlog('CDNLAND: JSON playlist detected'); } catch(_dj) {}
        // Normalize to an array of items
        var items = Array.isArray(json) ? json : (json.playlist || json.folder || json.items || []);
        // Log a compact snapshot (truncate large fields) for debugging translations vs episodes classification
        try {
          var snap = [];
          for (var si=0; si < items.length && si < 12; si++) {
            var it0 = items[si] || {};
            var k = {i:si, title:(it0.title||it0.comment||''), hasChild: !!(it0.playlist||it0.folder), file: (it0.file? (''+it0.file).substring(0,80):''), tr:(it0.translator||it0.translationid||''), id:(it0.id||'')};
            snap.push(k);
          }
          dlog('CDNLAND: playlist snapshot ' + JSON.stringify(snap));
        } catch(_snap) {}
        var poster = json.poster || icon;
        // Heuristic: if items contain child playlists, treat as series (seasons -> episodes)
        var isSeriesJSON = false;
        for (var ii = 0; ii < items.length; ii++) { if (items[ii] && (items[ii].playlist || items[ii].folder)) { isSeriesJSON = true; break; } }
        if (isSeriesJSON) {
          // Collect seasons with numeric sorting
          var seasons = [];
          for (var i = 0; i < items.length; i++) {
            var it = items[i] || {};
            var label = it.comment || it.title || '';
            var sid = it.id || '';
            var sPoster = it.poster || poster || icon;
            var mnum = (label.match(/(?:Сезон|Season)\s*(\d{1,3})/i) || label.match(/(\d{1,3})\s*(?:сезон|season)/i) || sid.match(/(?:season|sezon|сезон|s)[_\s-]*?(\d{1,3})/i));
            var snum = mnum && mnum[1] ? parseInt(mnum[1], 10) : 0;
            seasons.push({ label: label, id: sid, num: isNaN(snum) ? 0 : snum, poster: sPoster, pl: (it.playlist || it.folder) });
          }
          seasons.sort(function(a,b){ if (a.num !== b.num) return a.num - b.num; return 0; });
          // Build translations index: translatorId -> { name, seasons: {sid: {label, poster, episodes:[...]}} }
          var trIndex = {};
          for (var s = 0; s < seasons.length; s++) {
            var S = seasons[s];
            var eps = S.pl || [];
            for (var e = 0; e < eps.length; e++) {
              var ep = eps[e] || {};
              var etitle = ep.comment || ep.title || ('Серия ' + (e+1));
              var eposter = ep.poster || S.poster || poster || icon;
              var epl = ep.playlist || ep.folder || [];
              if (!epl || !epl.length) continue;
              for (var q = 0; q < epl.length; q++) {
                var qit = epl[q] || {};
                // Revert translator id/name derivation to earlier stable approach: only from qit
                var tname = qit.title || qit.comment || '';
                var tid = (qit.translator || qit.translationid || tname || '0') + '';
                if (!trIndex[tid]) trIndex[tid] = { id: tid, name: tname || ('Перевод ' + tid), seasons: {} };
                var T = trIndex[tid];
                if (!T.seasons[S.id || (S.num+'')]) T.seasons[S.id || (S.num+'')] = { id: (S.id || (S.num+'')), num: S.num, label: S.label, poster: S.poster, episodes: [] };
                var Ss = T.seasons[S.id || (S.num+'')];
                // Prefer file/hls/src from quality item, then episode-level file, then first child in nested playlist
                var tok = qit.file || qit.hls || qit.src || ep.file || ep.hls || ep.src || '';
                if (!tok && qit.playlist && qit.playlist.length) {
                  var c0 = qit.playlist[0] || {};
                  tok = c0.file || c0.hls || c0.src || '';
                }
                if (!tok && ep.playlist && ep.playlist.length) {
                  var e0 = ep.playlist[0] || {};
                  tok = e0.file || e0.hls || e0.src || '';
                }
                if (!tok) { try { dlog('CDNLAND: [index] empty token for ep=' + (ep.id || (S.id + '-' + (e+1))) + ' tr=' + tid); } catch(_) {} }
                Ss.episodes.push({ id: (ep.id || (S.id + '-' + (e+1))), title: etitle, display: (tname || ''), token: tok, poster: eposter });
              }
            }
          }
          try {
            var trDiag = [];
            for (var k in trIndex) {
              var o = trIndex[k];
              trDiag.push({tr:k, name:o.name, seasons:Object.keys(o.seasons).length});
            }
            dlog('CDNLAND: translators collected ' + JSON.stringify(trDiag));
          } catch(_trd) {}
          // Store in a lightweight cache for drill-down routes
          if (!this._cdnlandCache) { this._cdnlandCache = {}; this._cdnlandCacheSeq = 1; }
          var cacheId = 'c' + (this._cdnlandCacheSeq++);
          this._cdnlandCache[cacheId] = { title: title, icon: icon, poster: poster, seasons: seasons, translators: trIndex, csrfToken: csrfToken, baseOrigin: baseOrigin, usedUrl: usedUrl };
          // Mirror cache to a global map to ensure availability across route contexts
          try { CDNLAND_CACHE = CDNLAND_CACHE || {}; CDNLAND_CACHE[cacheId] = this._cdnlandCache[cacheId]; } catch(_gcache) {}
          try { dlog('CDNLAND: cached playlist index as ' + cacheId + ', translators=' + Object.keys(trIndex).length); } catch(_cdbg) {}
          // UI: show translations section
          try { page.appendItem('', 'separator', { title: new RichText('Переводы') }); } catch(_sep2) {}
          var trKeys = Object.keys(trIndex).sort(function(a,b){ var A=trIndex[a].name||'', B=trIndex[b].name||''; return A.localeCompare(B); });
          var navAdded = 0;
          for (var ti = 0; ti < trKeys.length; ti++) {
            var T2 = trIndex[trKeys[ti]];
            var seasonsCount = Object.keys(T2.seasons).length;
            var epCount = 0; try { for (var sk in T2.seasons) epCount += (T2.seasons[sk].episodes||[]).length; } catch(_ec) {}
            try {
              page.appendItem(PREFIX + ':cdnland_tr:' + cacheId + '~' + encodeURIComponent(T2.id), 'directory', {
                title: new RichText((T2.name || ('Перевод ' + T2.id)) + ' (' + seasonsCount + ' сез., ' + epCount + ' сер.)'),
                icon: icon,
                backdrops: poster ? [{url: poster}] : [{url: icon}],
                tagline: new RichText(coloredStr(title, gray))
              });
              navAdded++;
            } catch(_ai) {}
          }
          totalAppended += navAdded;
          // In test mode, stop here to avoid further work
          if (stopAfterFirst && totalAppended > 0) {
            try { dlog('CDNLAND: early exit after building translations (test mode)'); } catch(_eet) {}
            page.loading = false;
            return;
          }
        } else {
          // Single movie or flat playlist of qualities/files
          var arr = items.length ? items : [json];
          var earlyStop2 = false;
          for (var k = 0; k < arr.length && !earlyStop2; k++) {
            var it2 = arr[k] || {};
            var innerList = (it2.playlist || it2.folder || []);
            if (innerList && innerList.length) {
              for (var kq = 0; kq < innerList.length; kq++) {
                var pit = innerList[kq] || {};
                var inc3 = appendFileOrQualityList(page, pit.file || '', pit.comment || pit.title || '', title, icon, poster, '', '', '', '');
                totalAppended += inc3;
                if (stopAfterFirst) { earlyStop2 = true; break; }
              }
              if (earlyStop2) break;
            } else {
              var inc4 = appendFileOrQualityList(page, it2.file || '', it2.comment || it2.title || '', title, icon, poster, '', '', '', '');
              totalAppended += inc4;
              if (stopAfterFirst) { earlyStop2 = true; break; }
            }
          }
        }
        // If test mode is on and we appended something, return immediately to surface the item
        if (stopAfterFirst && totalAppended > 0) {
          try { dlog('CDNLAND: early exit after first item (test mode)'); } catch(_ee) {}
          page.loading = false;
          return;
        }
      }

  try { dlog('CDNLAND: token stats seen=' + dbgTokensSeen + ' resolved=' + dbgTokensResolved); } catch(_tstat) {}

  if (!totalAppended && !stopAfterFirst) {
        // Fallback to legacy regex-based parsers
        var isSeries = /tv_series|\{"id":".*?","comment":".*?".*?file":"|"playlist"\s*:\s*\[/i.test(payload);
        try { dlog('CDNLAND: detected ' + (isSeries ? 'series' : 'single') + ' playlist (legacy)'); } catch(_pt) {}
        var poster = icon;
        var before = page.entries || 0;
        if (isSeries) scrapercdnlandseries(page, payload, title, icon, poster, '');
        else scrapercdnland(page, payload, title, icon, poster, '');
        var after = page.entries || 0;
        totalAppended = Math.max(0, (after - before));
      } else if (!totalAppended && stopAfterFirst) {
        try { dlog('CDNLAND: stop-after-first: skipping legacy fallback'); } catch(_sk) {}
      }

      try { dlog('CDNLAND: appended items = ' + totalAppended); } catch(_pa) {}
      if (!totalAppended) {
        try { page.error('Не удалось распаковать источники этого плеера (все ссылки токенизированы). Попробуйте другой источник или другой домен/UA.'); } catch(_pe2) {}
      }
      page.loading = false;
      return;
    } catch (fatal) {
      try { dlog('CDNLAND: fatal parse error: ' + fatal); } catch(_fe) {}
      try { page.error('Ошибка при разборе плейлиста этого плеера'); } catch(_pe) {}
      page.loading = false;
      return;
    }
  }

  // If everything fails, show a friendly error with hints
  page.error('Не удалось загрузить плейлист этого плеера. Попробуйте другие источники или измените домен/UA в настройках.');
  page.loading = false;
  return;
});

// Drill-down: show seasons for a selected translator
new page.Route(PREFIX + ':cdnland_tr:(.*)~(.*)', function (page, cacheId, translatorIdEnc) {
  page.loading = true;
  try {
    page.type = 'directory';
    if (page.model && page.model.contents !== undefined) page.model.contents = 'list'; else page.contents = 'items';
  } catch(__ui) {}
  try {
    var translatorId = decodeURIComponent(translatorIdEnc || '');
    var cache = (this._cdnlandCache || {})[cacheId];
    if (!cache) { page.error('Истек кэш плейлиста'); page.loading = false; return; }
    var T = (cache.translators || {})[translatorId];
    if (!T) { page.error('Перевод не найден'); page.loading = false; return; }
    var seasonsKeys = Object.keys(T.seasons || {}).sort(function(a,b){ var ai=parseInt(a,10)||0, bi=parseInt(b,10)||0; return ai-bi; });
    try { page.metadata.title = new RichText('Перевод: ' + (T.name || translatorId)); } catch(_) {}
    for (var i=0;i<seasonsKeys.length;i++) {
      var sid = seasonsKeys[i];
      var S = T.seasons[sid];
      var label = 'Сезон ' + (S.id || sid) + (S.label ? (' | ' + S.label) : '');
      page.appendItem(PREFIX + ':cdnland_tr_season:' + cacheId + '~' + encodeURIComponent(translatorId) + '~' + encodeURIComponent(sid), 'directory', {
        title: new RichText(label),
        icon: cache.icon,
        backdrops: cache.poster ? [{url: cache.poster}] : [{url: cache.icon}],
        tagline: new RichText(coloredStr((cache.title || ''), gray))
      });
    }
  } catch(e) { try { dlog('CDNLAND tr route error: ' + e); } catch(_) {} }
  page.loading = false;
});

// Drill-down: list episodes within a translator + season (URLs are deferred)
new page.Route(PREFIX + ':cdnland_tr_season:(.*)~(.*)~(.*)', function (page, cacheId, translatorIdEnc, seasonIdEnc) {
  page.loading = true;
  try {
    page.type = 'directory';
    if (page.model && page.model.contents !== undefined) page.model.contents = 'list'; else page.contents = 'items';
  } catch(__ui) {}
  try {
    var translatorId = decodeURIComponent(translatorIdEnc || '');
    var seasonId = decodeURIComponent(seasonIdEnc || '');
    var cache = (this._cdnlandCache || {})[cacheId];
    if (!cache) { page.error('Истек кэш плейлиста'); page.loading = false; return; }
    var T = (cache.translators || {})[translatorId];
    if (!T) { page.error('Перевод не найден'); page.loading = false; return; }
    var S = (T.seasons || {})[seasonId];
    if (!S) { page.error('Сезон не найден'); page.loading = false; return; }
    try { page.metadata.title = new RichText('Перевод: ' + (T.name||translatorId) + ' • Сезон ' + (S.id||seasonId)); } catch(_) {}
    var eps = S.episodes || [];
    // Sort by episode number if parsable
    eps.sort(function(a,b){
      var na = parseInt((a.title||'').match(/\d+/),10) || 0;
      var nb = parseInt((b.title||'').match(/\d+/),10) || 0;
      if (na!==nb) return na-nb; return (a.title||'').localeCompare(b.title||'');
    });
    for (var i=0;i<eps.length;i++) {
      var E = eps[i];
      var etitle = E.title || ('Серия ' + (i+1));
      // Defer actual URL retrieval; link to a placeholder route
      var playUri = PREFIX + ':cdnland_play:' + cacheId + '~' + encodeURIComponent(translatorId) + '~' + encodeURIComponent(seasonId) + '~' + encodeURIComponent(E.id||('ep'+i));
      page.appendItem(playUri, service.list, {
        title: new RichText(etitle),
        icon: cache.icon,
        backdrops: cache.poster ? [{url: cache.poster}] : [{url: cache.icon}],
        source: new RichText(coloredStr('Перевод: ', gray) + coloredStr((T.name||translatorId), blue)),
        tagline: new RichText(coloredStr((cache.title||''), gray))
      });
    }
  } catch(e) { try { dlog('CDNLAND tr season route error: ' + e); } catch(_) {} }
  page.loading = false;
});

// Resolve a single episode on click and start playback immediately
new page.Route(PREFIX + ':cdnland_play:(.*)~(.*)~(.*)~(.*)', function (page, cacheId, translatorIdEnc, seasonIdEnc, epIdEnc) {
  page.loading = true;
  var translatorId = decodeURIComponent(translatorIdEnc || '');
  var seasonId = decodeURIComponent(seasonIdEnc || '');
  var epId = decodeURIComponent(epIdEnc || '');
  // Try both instance and global cache fallback
  var cacheMap = this._cdnlandCache || (typeof CDNLAND_CACHE !== 'undefined' ? CDNLAND_CACHE : {});
  var cache = (cacheMap || {})[cacheId];
  if (!cache) { try { dlog('CDNLAND: [play] cache not found for ' + cacheId); } catch(_) {} page.error('Истек кэш плейлиста'); page.loading = false; return; }
  var T = (cache.translators || {})[translatorId];
  if (!T) { try { dlog('CDNLAND: [play] translator not found: ' + translatorId); } catch(_) {} page.error('Перевод не найден'); page.loading = false; return; }
  var S = (T.seasons || {})[seasonId];
  if (!S) { try { dlog('CDNLAND: [play] season not found: ' + seasonId); } catch(_) {} page.error('Сезон не найден'); page.loading = false; return; }
  var E = null;
  try {
    var arr = S.episodes || [];
    for (var i=0;i<arr.length;i++) if ((arr[i].id||'') === epId) { E = arr[i]; break; }
    if (!E && arr.length) E = arr[0];
  } catch(_se) {}
  if (!E) { try { dlog('CDNLAND: [play] episode not found: ' + epId); } catch(_) {} page.error('Эпизод не найден'); page.loading = false; return; }
  var tokenOrFile = E.token || E.file || '';
  try { dlog('CDNLAND: [play] resolving ep=' + epId + ' tokenOrFile=' + (tokenOrFile ? tokenOrFile.substring(0,64) + (tokenOrFile.length>64?'…':'') : '(empty)')); } catch(_) {}
  // Minimal helpers to reuse token resolution logic with cached context
  function tryParsePlayerJSON(txt) {
    if (!txt) return null; var s = (''+txt).trim(); var m = s.match(/(\{[\s\S]*\}|\[[\s\S]*\])/); if (!m) return null; try { return JSON.parse(m[1]); } catch(e1){} try { return JSON.parse(m[1].replace(/\\"/g,'"')); } catch(e2){} return null;
  }
  function buildTokenPlaylistUrl(baseOrigin, tok) {
    var token = tok.charAt(0) === '~' ? tok.substr(1) : tok;
    var hasBangBang = /!!$/.test(token);
    var base = baseOrigin || 'https://vid11.entouaedon.com';
    var url = base + (base.charAt(base.length-1) === '/' ? '' : '/') + 'playlist/' + token + (hasBangBang ? '' : '!!') + '.txt';
    return url;
  }
  function fetchTokenFile(baseOrigin, csrfToken, tok) {
    var u = buildTokenPlaylistUrl(baseOrigin, tok);
    try { dlog('CDNLAND: [play] fetching token playlist: ' + u); } catch(_) {}
    var payload = '';
    function req(method, url, addHeaders) {
      try {
        var headers = {
          'User-Agent': UA,
          'Accept': '*/*',
          'Origin': (HTTPS + BASE_URL),
          'Referer': REFERER,
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
        };
        // Server often expects AJAX semantics for token POST
        if (method === 'POST') {
          headers['X-Requested-With'] = 'XMLHttpRequest';
          headers['Content-Type'] = 'text/plain; charset=UTF-8';
        }
        if (addHeaders) for (var k in addHeaders) headers[k] = addHeaders[k];
        var resp = http.request(url, { method: method, debug:true, noFail:true, compression:true, headers: headers, postdata: (method === 'POST' ? '' : null) });
        if (resp && resp.statuscode >= 200 && resp.statuscode < 300) return resp.toString();
      } catch(e) { /* ignore */ }
      return '';
    }
    if (csrfToken) payload = req('POST', u, {'X-CSRF-TOKEN': csrfToken, 'X-CSRF-Token': csrfToken, 'x-csrf-token': csrfToken});
    if (!payload) payload = req('GET', u);
    if (!payload) payload = req('GET', u + (u.indexOf('?')>=0?'&':'?') + 'cb=' + Date.now());
    if (!payload) payload = req('POST', u);
  payload = (payload || '');
  try { dlog('CDNLAND: [play] token payload len=' + payload.length + (payload.length<64? (', body=' + JSON.stringify(payload)) : '')); } catch(_) {}
    if (payload.length < 4) return '';
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
        var rel = mrel[1].trim();
        var mh = rel.match(/\/(?:stream2?|hls)\/((?:b|cdn)-\d{1,4})\//i);
        var host = mh && mh[1] ? (mh[1] + '.entouaedon.com') : '';
        if (host) { if (rel.charAt(0) !== '/') rel = '/' + rel; return 'https://' + host + rel; }
      }
      return '';
    }
    var m2 = txt.match(/https?:\/\/[^\s"']+/i);
    if (m2 && m2[0]) return m2[0];
    return txt;
  }
  var finalUrl = '';
  try {
    var t = tokenOrFile || '';
    if (/^~/.test(t)) {
      finalUrl = fetchTokenFile(cache.baseOrigin, cache.csrfToken, t);
      // If token likely failed due to stale CSRF (tiny '10' response etc.), try to refresh CSRF from baseOrigin and retry once
      if (!finalUrl && cache.baseOrigin) {
        try {
          var rootHtml = http.request(cache.baseOrigin + '/', {debug:true, noFail:true, compression:true, headers:{
            'User-Agent': UA,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Origin': (HTTPS + BASE_URL),
            'Referer': REFERER,
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
          }}).toString();
          var m = rootHtml && rootHtml.match(/<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/i);
          if (m && m[1]) {
            cache.csrfToken = m[1];
            try { dlog('CDNLAND: [play] refreshed csrfToken from baseOrigin'); } catch(_) {}
            finalUrl = fetchTokenFile(cache.baseOrigin, cache.csrfToken, t);
          }
        } catch(_refCsrf) {}
      }
    } else if (/\[[^\]]+\]/.test(t)) {
      var mOne = t.match(/\[(.*?)\]([^,\n\r"']+)/);
      if (mOne && mOne[2]) { finalUrl = mOne[2].trim().replace(/\\\//g,'/'); }
    } else if (/^https?:\/\//i.test(t)) {
      finalUrl = t;
    }
  } catch(_rf) {}
  if (!finalUrl) { page.error('Не удалось получить ссылку для эпизода'); page.loading = false; return; }
  // hls: prefix not needed; use plain URL
  // if (/\.m3u8(\?|$)/i.test(finalUrl)) finalUrl = 'hls:' + finalUrl;
  try { dlog('CDNLAND: [play] start ' + finalUrl.substr(0,160) + (finalUrl.length>160?'…':'')); } catch(_) {}
  // Start playback immediately (redirect for better compatibility)
  page.type = 'video';
  try { page.redirect(finalUrl); } catch(_redir) { page.source = finalUrl; }
  page.loading = false;
});
//plugin.addURI(PREFIX + ':takedwnpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':takedwnpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  var uri;
  uri = PREFIX + ':takedwnpage:' + url + '~' + title + '~' + icon;
//  uri = PREFIX + ':takedwnpage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//  uri = PREFIX + ':takedwnpage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
  optionsmovianDRM(page, uri);
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
    var doc = html.match(/makePlayer\(\{([\s\S]*?)\}\);/);
    if (doc) {
      var series = doc[1].match(/seasons:\[/);
      if (series) {
//        var poster = doc[1].match(/poster: "(.*?)\.jpg\?.*?"/);
//        var poster = doc[1].match(/poster: "(.*?)\?/);
        var poster = doc[1].match(/poster: "(.*?)"/);
//        var poster = doc[1].match(/poster: "([^"]+)"/);
        try {
          poster = poster[1];
          if (/http.*?:\/\//.test(poster)) {
            poster = poster;
//            poster = poster + '.jpg';
          }
          else {
            poster = HTTPS + poster;
//            poster = HTTPS + poster + '.jpg';
          }
          if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(poster)) {
            poster = poster;
          }
          else {
            poster = icon;
//            poster = LOGOICON;
//            poster = LOGOLOGO;
//            poster = LOGONONE;
//            poster = '';
          }
        }
        catch (err) {
          poster = icon;
//          poster = LOGOICON;
//          poster = LOGOLOGO;
//          poster = LOGONONE;
//          poster = '';
        }
//        poster = showtime.entityDecode(poster);
//        poster = unescape(poster);
//        poster = decodeURIComponent(poster);
//        var re = /son":([\S\s]*?),[\S\s]*?"episodes":\[([\S\s]*?)(\]\},\{"sea|\]\}\])/g;
        var re = /son":(.*?),.*?"episodes":\[(.*?)(\]\},\{"sea|\]\}\])/g;
//        var re = /son":([^"]+),.*?"episodes":\[([^"]+)(\]\},\{"sea|\]\}\])/g;
        var match = re.exec(doc[1]);
        var seasons = [];
        while (match) {
          var seasonLabel = '';
          try { seasonLabel = (match[1] || '').toString().trim(); } catch (err) { seasonLabel = ''; }
          // Prefer numeric parse directly; fallback to first number in label
          var seasonNum = parseInt(seasonLabel, 10);
          if (isNaN(seasonNum)) {
            var sn = seasonLabel.match(/(\d{1,3})/);
            seasonNum = sn && sn[1] ? parseInt(sn[1], 10) : 0;
          }
          try { dlog('Takedwn series: seasonLabel=' + seasonLabel + ', seasonNum=' + seasonNum); } catch (e) {}
          seasons.push({
            seasonLabel: seasonLabel,
            seasonNum: isNaN(seasonNum) ? 0 : seasonNum,
            episodesBlock: match[2],
            index: seasons.length
          });
          match = re.exec(doc[1]);
        }
        // Sort by season number ascending; stable fallback by original order
        seasons.sort(function(a, b) {
          if (a.seasonNum !== b.seasonNum) return a.seasonNum - b.seasonNum;
          return a.index - b.index;
        });
        for (var i = 0; i < seasons.length; i++) {
          var s = seasons[i];
          page.appendItem('', 'separator', {
            title: new RichText('Сезон ' + (s.seasonLabel ? s.seasonLabel : '')),
          });
          scrapertakedwn(page, s.episodesBlock, title, icon, poster, s.seasonLabel);
        }
      }
      else {
        var name = doc[1].match(/title: "(.*?)"/);
//        var name = doc[1].match(/title: "([^"]+)"/);
        try {
          name = name[1];
        }
        catch (err) {
          name = title;
//          name = '';
        }
//        name = showtime.entityDecode(name);
//        name = unescape(name);
//        name = decodeURIComponent(name);
//        var poster = doc[1].match(/poster: "(.*?)\.jpg\?.*?"/);
//        var poster = doc[1].match(/poster: "(.*?)\?/);
        var poster = doc[1].match(/poster: "(.*?)"/);
//        var poster = doc[1].match(/poster: "([^"]+)"/);
        try {
          poster = poster[1];
          if (/http.*?:\/\//.test(poster)) {
            poster = poster;
//            poster = poster + '.jpg';
          }
          else {
            poster = HTTPS + poster;
//            poster = HTTPS + poster + '.jpg';
          }
          if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(poster)) {
            poster = poster;
          }
          else {
            poster = icon;
//            poster = LOGOICON;
//            poster = LOGOLOGO;
//            poster = LOGONONE;
//            poster = '';
          }
        }
        catch (err) {
          poster = icon;
//          poster = LOGOICON;
//          poster = LOGOLOGO;
//          poster = LOGONONE;
//          poster = '';
        }
//        poster = showtime.entityDecode(poster);
//        poster = unescape(poster);
//        poster = decodeURIComponent(poster);
        var backdrops = [];
        try {
          backdrops.push({url: icon});
//          backdrops.push({url: poster});
//          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
        }
        catch (err) {
          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
//          backdrops.push({url: ''});
        }
        var translation = doc[1].match(/audio: \{"names":\[(.*?)\]/);
        try {
          translation = translation[1];
//          translation = translation.replace(/"/g, '').trim();
        }
        catch (err) {
          translation = '';
        }
//        translation = showtime.entityDecode(translation);
//        translation = unescape(translation);
//        translation = decodeURIComponent(translation);
//        var playlisturl = doc[1].match(/hls: "(.*?)\.m3u8/);
        var playlisturl = doc[1].match(/hls: "(.*?)"/);
//        var playlisturl = doc[1].match(/hls: "([^"]+)"/);
        try {
          playlisturl = playlisturl[1];
          if (/http.*?:\/\//.test(playlisturl)) {
            playlisturl = playlisturl;
//            playlisturl = playlisturl + '.m3u8';
          }
          else {
            playlisturl = HTTPS + playlisturl;
//            playlisturl = HTTPS + playlisturl + '.m3u8';
          }
        }
        catch (err) {
          playlisturl = '';
        }
//        playlisturl = showtime.entityDecode(playlisturl);
//        playlisturl = unescape(playlisturl);
//        playlisturl = decodeURIComponent(playlisturl);
        var uri;
        uri = playlisturl;
//        uri = escape(playlisturl);
//        uri = encodeURIComponent(playlisturl);
        if (/\.m3u8/.test(playlisturl)) {
//          uri = uri;
          // hls: prefix not needed; use plain URL
          // uri = 'hls:' + uri;
//          uri = 'movianDRM:hls:' + uri;
          if (service.movianDRM) {
//            uri = 'movianDRM:hls:' + uri;
            uri = 'movianDRM:' + uri;
          }
        }
//        else if (/\.mp4/.test(playlisturl)) {
//          uri = uri;
//        }
        else if (/\.mpd/.test(playlisturl)) {
          uri = 'movianDRM:dash:' + uri;
        }
        else {
          uri = uri;
        }
        if (/movianDRM:/.test(uri)) {
//        if (service.movianDRM && /\.(m3u8|mpd)/.test(playlisturl)) {
          uri += '::';
          uri += name ? name : '';
          uri += ' ';
//          uri += '(';
          uri += '[';
//          uri += '«';
//          uri += ' ';
          uri += translation ? translation : '';
//          uri += ')';
          uri += ']';
//          uri += '»';
//          uri += '::close';
          uri = uri.replace(/<.*?>/g, '').trim();
//          uri = uri.replace(/http:\/\//g, 'https://').trim();
//          uri = uri.replace(/https:\/\//g, 'http://').trim();
          uri = uri.replace(/(     |    |   |  )/g, ' ').trim();
//          uri = showtime.entityDecode(uri);
//          uri = unescape(uri);
//          uri = decodeURIComponent(uri);
//          uri = escape(uri);
//          uri = encodeURIComponent(uri);
        }
//        page.appendItem(uri, 'directory', {
//        page.appendItem(uri, 'video', {
        page.appendItem(uri, service.list, {
//          title: new showtime.RichText(title),
//          title: new RichText(title),
//          title: new showtime.RichText(name),
          title: new RichText(name),
          icon: icon,
//          icon: poster,
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: logoquality,
//          icon: '',
          backdrops: backdrops,
//          source: new showtime.RichText(translation ? translation : ''),
//          source: new RichText(translation ? translation : ''),
//          source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
          source: new RichText(translation ? coloredStr(translation, blue) : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//          tagline: new showtime.RichText(coloredStr(title, gray)),
          tagline: new RichText(coloredStr(title, gray)),
//          tagline: new showtime.RichText(coloredStr(name, gray)),
//          tagline: new RichText(coloredStr(name, gray)),
//          description: new showtime.RichText(coloredStr(title, gray)),
//          description: new RichText(coloredStr(title, gray)),
//          description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//          description: new RichText(name ? coloredStr(name, gray) : ''),
//          description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
          description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//          description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//          description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
        });
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
//plugin.addURI(PREFIX + ':kpappspage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':kpappspage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
//    var doc = html.match(/var config = \{([\s\S]*?)\};/);
//    var doc = html.match(/file: \[([\s\S]*?)\],/);
    var doc = html.match(/file: \[(.*?)\],/);
//    var doc = html.match(/file: \[([^"]+)\],/);
    if (doc) {
      var series = doc[1].match(/"folder":\[/);
      if (series) {
//        var re = /\{"title":"([\s\S]*?)", "folder":\[([\s\S]*?),\]\},/g;
        var re = /\{"title":"(.*?)", "folder":\[(.*?),\]\},/g;
//        var re = /\{"title":"([^"]+)", "folder":\[([^"]+),\]\},/g;
        var match = re.exec(doc[1]);
        while (match) {
          try {
            var season = match[1];
          }
          catch (err) {
//            season = 0;
            season = '';
          }
//          season = showtime.entityDecode(season);
//          season = unescape(season);
//          season = decodeURIComponent(season);
          page.appendItem('', 'separator', {
//            title: new showtime.RichText(season),
            title: new RichText(season),
          });
          scraperkpappsseries(page, match[2], title, icon, season);
          match = re.exec(doc[1]);
        }
      }
      else {
//        var re = /\{title: "([\s\S]*?)", file: "([\s\S]*?)\}/g;
        var re = /\{title: "(.*?)", file: "(.*?)\}/g;
//        var re = /\{title: "([^"]+)", file: "([^"]+)\}/g;
        var match = re.exec(doc[1]);
        while (match) {
          try {
            var translation = match[1];
          }
          catch (err) {
            translation = '';
          }
//          translation = showtime.entityDecode(translation);
//          translation = unescape(translation);
//          translation = decodeURIComponent(translation);
          page.appendItem('', 'separator', {
//            title: new showtime.RichText(translation),
            title: new RichText(translation),
          });
          scraperkpapps(page, match[2], title, icon, translation);
          match = re.exec(doc[1]);
        }
      }
    }
//    var cdnland = html.match(/cloud\.cdnland\.in/);
    var cdnland = html.match(/<input type="hidden" id="videoType"/);
    if (cdnland) {
//      var dom = html.match(/<body>([\s\S]*?)<\/body>/);
//      var dom = html.match(/<body>([\s\S]*?)<script/);
      var dom = html.match(/<body>(.*?)<script/);
//      var dom = html.match(/<body>([^"]+)<script/);
//      var translations = dom[1].match(/<div class="translations">([\s\S]*?)<\/div>/);
      var translations = dom[1].match(/<div class="translations">(.*?)<\/div>/);
//      var translations = dom[1].match(/<div class="translations">([^"]+)<\/div>/);
      if (translations) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Переводы:'),
          title: new RichText('Переводы:'),
        });
//        var re = /<option[\S\s]*?value="([\S\s]*?)"[\S\s]*?>([\S\s]*?)<\/option>/g;
        var re = /<option.*?value="(.*?)".*?>(.*?)<\/option>/g;
//        var re = /<option.*?value="([^"]+)".*?>([^"]+)<\/option>/g;
        var match = re.exec(translations[1]);
        while (match) {
          try {
            var translationsid = match[1];
          }
          catch (err) {
            translationsid = '';
          }
//          translationsid = showtime.entityDecode(translationsid);
//          translationsid = unescape(translationsid);
//          translationsid = decodeURIComponent(translationsid);
          try {
            var translation = match[2];
            translation = translation.replace(/<br>/g, '').trim();
          }
          catch (err) {
            translation = '';
          }
//          translation = showtime.entityDecode(translation);
//          translation = unescape(translation);
//          translation = decodeURIComponent(translation);
          page.appendPassiveItem('directory', '', {
//          page.appendPassiveItem('video', '', {
//          page.appendPassiveItem(service.list, '', {
//            title: new showtime.RichText('[' + translationsid + ']' + ' ' + translation),
            title: new RichText('[' + translationsid + ']' + ' ' + translation),
//            icon: icon,
//            icon: LOGOICON,
//            icon: LOGOLOGO,
//            icon: LOGONONE,
//            icon: logoquality,
            icon: '',
          });
          match = re.exec(translations[1]);
        }
      }
//      var files = dom[1].match(/<input type="hidden" id="files" value="([\s\S]*?)">/);
      var files = dom[1].match(/<input type="hidden" id="files" value="(.*?)">/);
//      var files = dom[1].match(/<input type="hidden" id="files" value="([^"]+)">/);
      var series = dom[1].match(/"tv_series"/);
      if (series) {
//        var re = /&quot;([\s\S]*?)&quot;:&quot;\[([\s\S]*?)\]&quot;(,|\})/g;
        var re = /&quot;(.*?)&quot;:&quot;\[(.*?)\]&quot;(,|\})/g;
//        var re = /&quot;([^"]+)&quot;:&quot;\[([^"]+)\]&quot;(,|\})/g;
      }
      else {
//        re = /&quot;([\S\s]*?)&quot;:&quot;([\s\S]*?)&quot;(,|\})/g;
        re = /&quot;(.*?)&quot;:&quot;(.*?)&quot;(,|\})/g;
//        re = /&quot;([^"]+)&quot;:&quot;([^"]+)&quot;(,|\})/g;
      }
      var match = re.exec(files[1]);
      while (match) {
        try {
          var translationid = match[1];
        }
        catch (err) {
//          translationid = 0;
          translationid = '';
        }
//        translationid = showtime.entityDecode(translationid);
//        translationid = unescape(translationid);
//        translationid = decodeURIComponent(translationid);
        if (translations) {
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Перевод ' + (translationid ? '[' + translationid + ']' : '')),
            title: new RichText('Перевод ' + (translationid ? '[' + translationid + ']' : '')),
          });
        }
        var poster = icon;
//        poster = showtime.entityDecode(poster);
//        poster = unescape(poster);
//        poster = decodeURIComponent(poster);
        if (series) {
          scrapercdnlandseries(page, match[2], title, icon, poster, translationid);
        }
        else {
          scrapercdnland(page, match[2], title, icon, poster, translationid);
        }
        match = re.exec(files[1]);
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
//plugin.addURI(PREFIX + ':sundbpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':sundbpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
//    var doc = html.match(/let player = new Playerjs\(\{id:"player", file:'\[([\s\S]*?)\]'\}\);/);
//    var doc = html.match(/file:'\[([\s\S]*?)\]'/);
    var doc = html.match(/file:'\[(.*?)\]'/);
//    var doc = html.match(/file:'\[([^"]+)\]'/);
    if (doc) {
      var files = doc[1].match(/"file"/);
      if (files) {
        scrapersundb(page, doc[1], title, icon);
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
//plugin.addURI(PREFIX + ':imagespage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':imagespage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
//  page.model.contents = 'list';
  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
//    var doc = html.match(/<div class="fposter img-wide".*?>[\s\S]*?<img([\s\S]*?)<\/div>/)[1];
    var doc = html.match(/("fullimg"|"kino-desc__img-box")([\s\S]*?)"description"/)[2];
//    var re = /src=[ '|'| "|"| |]+(.*?)('|"| )/g;
//    var re = /src=[ '|'| "|"| |]+([^"]+)('|"| )/g;
//    var re = /src=( '|'| "|"| |)(.*?)('|"| )/g;
//    var re = /src=( '|'| "|"| |)([^"]+)('|"| )/g;
    var re = /(href|src)=( '|'| "|"| |)(.*?)('|"| )/g;
    var match = re.exec(doc);
    while (match) {
      try {
//        var screenshot = match[1];
//        var screenshot = match[2];
        var screenshot = match[3];
        screenshot = screenshot.replace(/('|"| )/g, '').trim();
        if (/http.*?:\/\//.test(screenshot)) {
          screenshot = screenshot;
        }
        else {
          screenshot = HTTPS + BASE_URL + screenshot;
//          screenshot = HTTPS + BASE_URL + '///' + screenshot;
        }
//        screenshot = screenshot.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//        if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(screenshot)) {
        if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(screenshot) && !/\.webp/.test(screenshot)) {
          screenshot = screenshot;
        }
        else {
          screenshot = icon;
//          screenshot = LOGOICON;
//          screenshot = LOGOLOGO;
//          screenshot = LOGONONE;
//          screenshot = '';
        }
      }
      catch (err) {
        screenshot = icon;
//        screenshot = LOGOICON;
//        screenshot = LOGOLOGO;
//        screenshot = LOGONONE;
//        screenshot = '';
      }
//      screenshot = showtime.entityDecode(screenshot);
//      screenshot = unescape(screenshot);
//      screenshot = decodeURIComponent(screenshot);
      page.appendItem(screenshot, 'image');
      match = re.exec(doc);
    }
  }
  catch (err) {}
  page.loading = false;
});
//plugin.addURI(PREFIX + ':personspage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':personspage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
//    var director = html.match(/<li><span>Режисс[е|ё]+р.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//    var director = html.match(/<li><span>Режисс[е|ё]+р.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//    var director = html.match(/<li><span>Режисс(е|ё)р.*?> (.*?)<\/li>/);
    var director = html.match(/<li><span>Режисс(е|ё)р.*?>(.*?)<\/li>/);
//    var director = html.match(/<li><span>Режисс(е|ё)р.*?>([^"]+)<\/li>/);
    if (director) {
//      var dir = director[1].match(/<a href.*?>[^"]+<\/a>/);
      var dir = director[2].match(/<a href.*?>[^"]+<\/a>/);
      if (dir) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Режиссер:'),
          title: new RichText('Режиссер:'),
        });
//        scrapertag(page, director[1]);
        scrapertag(page, director[2]);
      }
    }
//    var actor = html.match(/<li><span>[Акт|.*?рол]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//    var actor = html.match(/<li><span>[Акт|.*?рол]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//    var actor = html.match(/<li><span>(Акт|.*?рол).*?> (.*?)<\/li>/);
    var actor = html.match(/<li><span>(Акт|.*?рол).*?>(.*?)<\/li>/);
//    var actor = html.match(/<li><span>(Акт|.*?рол).*?>([^"]+)<\/li>/);
    if (actor) {
//      var act = actor[1].match(/<a href.*?>[^"]+<\/a>/);
      var act = actor[2].match(/<a href.*?>[^"]+<\/a>/);
      if (act) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Актеры:'),
          title: new RichText('Актеры:'),
//          title: new showtime.RichText('В ролях:'),
//          title: new RichText('В ролях:'),
        });
//        scrapertag(page, actor[1]);
        scrapertag(page, actor[2]);
      }
    }
//    var translation = html.match(/<li>.*?<span>.*?[звуч|еревод]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//    var translation = html.match(/<li>.*?<span>.*?[звуч|еревод]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//    var translation = html.match(/<li>.*?<span>.*?(звуч|еревод).*?> (.*?)<\/li>/);
//    var translation = html.match(/<li>.*?<span>.*?(звуч|еревод).*?>(.*?)<\/li>/);
//    var translation = html.match(/<li>.*?<span>.*?(звуч|еревод).*?>([^"]+)<\/li>/);
    var translation = html.match(/<span>.*?(звуч|еревод).*?>(.*?)<\/li>/);
//    var translation = html.match(/<span>.*?(звуч|еревод).*?>([^"]+)<\/li>/);
    if (translation) {
//      var tra = translation[1].match(/<a href.*?>[^"]+<\/a>/);
      var tra = translation[2].match(/<a href.*?>[^"]+<\/a>/);
      if (tra) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Перевод:'),
          title: new RichText('Перевод:'),
        });
//        scrapertag(page, translation[1]);
        scrapertag(page, translation[2]);
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
//plugin.addURI(PREFIX + ':categoriespage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':categoriespage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
//    var year = html.match(/<li><span>[Год|Дата|Премьера]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//    var year = html.match(/<li><span>[Год|Дата|Премьера]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//    var year = html.match(/<li><span>(Год|Дата|Премьера).*?> (.*?)<\/li>/);
    var year = html.match(/<li><span>(Год|Дата|Премьера).*?>(.*?)<\/li>/);
//    var year = html.match(/<li><span>(Год|Дата|Премьера).*?>([^"]+)<\/li>/);
    if (year) {
//      var yea = year[1].match(/<a href.*?>[^"]+<\/a>/);
      var yea = year[2].match(/<a href.*?>[^"]+<\/a>/);
      if (yea) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Год:'),
          title: new RichText('Год:'),
        });
//        scrapertag(page, year[1]);
        scrapertag(page, year[2]);
      }
    }
//    var country = html.match(/<li><span>Страна.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//    var country = html.match(/<li><span>Страна.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//    var country = html.match(/<li><span>Страна.*?> (.*?)<\/(span|li)>/);
    var country = html.match(/<li><span>Страна.*?>(.*?)<\/(span|li)>/);
//    var country = html.match(/<li><span>Страна.*?>([^"]+)<\/(span|li)>/);
    if (country) {
      var cou = country[1].match(/<a href.*?>[^"]+<\/a>/);
      if (cou) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Страна:'),
          title: new RichText('Страна:'),
        });
        scrapertag(page, country[1]);
      }
    }
//    var genre = html.match(/<li><span>[Жанр|Категори]+.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//    var genre = html.match(/<li><span>[Жанр|Категори]+.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//    var genre = html.match(/<li><span>(Жанр|Категори).*?> (.*?)<\/li>/);
    var genre = html.match(/<li><span>(Жанр|Категори).*?>(.*?)<\/li>/);
//    var genre = html.match(/<li><span>(Жанр|Категори).*?>([^"]+)<\/li>/);
    if (genre) {
//      var gen = genre[1].match(/<a href.*?>[^"]+<\/a>/);
      var gen = genre[2].match(/<a href.*?>[^"]+<\/a>/);
      if (gen) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Жанр:'),
          title: new RichText('Жанр:'),
        });
//        scrapertag(page, genre[1]);
        scrapertag(page, genre[2]);
      }
    }
//    var channel = html.match(/<li><span>Канал.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//    var channel = html.match(/<li><span>Канал.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//    var channel = html.match(/<li><span>Канал.*?> (.*?)<\/li>/);
    var channel = html.match(/<li><span>Канал.*?>(.*?)<\/li>/);
//    var channel = html.match(/<li><span>Канал.*?>([^"]+)<\/li>/);
    if (channel) {
      var cha = channel[1].match(/<a href.*?>[^"]+<\/a>/);
      if (cha) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Канал:'),
          title: new RichText('Канал:'),
        });
        scrapertag(page, channel[1]);
      }
    }
//    var compilation = html.match(/<li><span>.*?одбор.*?:<\/span> <span itemprop=".*?">(.*?)<\/span><\/li>/);
//    var compilation = html.match(/<li><span>.*?одбор.*?:<\/span> <.*?>(.*?)<\/span><\/li>/);
//    var compilation = html.match(/<li><span>.*?одбор.*?> (.*?)<\/li>/);
    var compilation = html.match(/<li><span>.*?одбор.*?>(.*?)<\/li>/);
//    var compilation = html.match(/<li><span>.*?одбор.*?>([^"]+)<\/li>/);
    if (compilation) {
      var set = compilation[1].match(/<a href.*?>[^"]+<\/a>/);
      if (set) {
        page.appendItem('', 'separator', {
//          title: new showtime.RichText('Подборка:'),
          title: new RichText('Подборка:'),
        });
        scrapertag(page, compilation[1]);
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
/*
//plugin.addURI(PREFIX + ':tagpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':tagpage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
*/
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
/*
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
    var doc = html.match(/<div class="speedbar nowrap">([\s\S]*?)<\/div>/);
    if (doc) {
      var tag = doc[1].match(/<a href.*?>[^"]+<\/a>/);
      if (tag) {
//        scrapertag(page, doc[1]);
        scrapertag(page, doc[1], true);
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
*/
//plugin.addURI(PREFIX + ':relpage:(.*)~(.*)', function (page, url, title) {
new page.Route(PREFIX + ':relpage:(.*)~(.*)', function (page, url, title) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
    var doc = html.match(/<div class="sect( frels|-cont sect-items clearfix)">([\s\S]*?)<(\/article|\/main|!-- END CONTENT --|footer class="footer fx-row")>/);
    if (doc) {
      var rel = doc[2].match(/<div class="(th-item|popular-item)"[\s\S]*?".*?title.*?>[^"]+<\/div>/);
      if (rel) {
//        scraper(page, doc[2]);
        scraper(page, doc[2], true);
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
//plugin.addURI(PREFIX + ':poppage:(.*)~(.*)', function (page, url, title) {
new page.Route(PREFIX + ':poppage:(.*)~(.*)', function (page, url, title) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
/*
//  html = showtime.httpReq(url).toString();
  html = http.request(url).toString();
*/
//  html = showtime.httpReq(url, {
  html = http.request(url, {
    debug: true,
//    debug: false,
//    noFollow: true,
//    noFollow: false,
    noFail: true,
//    noFail: false,
    compression: true,
//    compression: false,
//    caching: true,
//    caching: false,
//    cacheTime: 3600,
//    cacheTime: 6000,
//    postdata: postdata,
//    postdata: {},
//    headers: headers,
//    headers: {},
//  });
  }).toString();
//  }).convertFromEncoding('utf-8').toString();
//  }).convertFromEncoding('windows-1251').toString();
  try {
    var doc = html.match(/<div class="popular clearfix">([\s\S]*?)<\/div>/);
    if (doc) {
      var pop = doc[1].match(/<li><a href.*?>[^"]+<\/a>/);
      if (pop) {
//        scraperpop(page, doc[1]);
        scraperpop(page, doc[1], true);
      }
    }
  }
  catch (err) {}
  page.loading = false;
});
//plugin.addURI(PREFIX + ':compage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
new page.Route(PREFIX + ':compage:(.*)~(.*)~(.*)', function (page, url, title, icon) {
  page.loading = true;
//  url = showtime.entityDecode(url);
//  url = unescape(url);
//  url = decodeURIComponent(url);
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  page.metadata.logo = LOGO;
//  page.metadata.logo = icon;
//  page.metadata.icon = LOGO;
//  page.metadata.icon = icon;
//  page.metadata.title = title;
//  page.metadata.title = new showtime.RichText(title);
  page.metadata.title = new RichText(title);
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  try {
    page.entries = 0;
    var tryToSearch = true;
    function loader() {
      if (!tryToSearch) return false;
      page.loading = true;
/*
//      html = showtime.httpReq(url).toString();
      html = http.request(url).toString();
*/
//      html = showtime.httpReq(url, {
      html = http.request(url, {
        debug: true,
//        debug: false,
//        noFollow: true,
//        noFollow: false,
        noFail: true,
//        noFail: false,
        compression: true,
//        compression: false,
//        caching: true,
//        caching: false,
//        cacheTime: 3600,
//        cacheTime: 6000,
//        postdata: postdata,
//        postdata: {},
//        headers: headers,
//        headers: {},
//      });
      }).toString();
//      }).convertFromEncoding('utf-8').toString();
//      }).convertFromEncoding('windows-1251').toString();
//      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">([\s\S]*?)<\/span>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<div id='comm-id-.*?'>([\s\S]*?)<\/div>([\s\S]*?)>Ответить<\/a>/g;
      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">(.*?)<\/span>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<div id='comm-id-.*?'>(.*?)<\/div>([\s\S]*?)>Ответить<\/a>/g;
//      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">([^"]+)<\/span>[\s\S]*?<span>([^"]+)<\/span>[\s\S]*?<div id='comm-id-.*?'>([^"]+)<\/div>([\s\S]*?)>Ответить<\/a>/g;
//      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">(.*?)<\/span>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<div id='comm-id-.*?'>(.*?)<\/div>/g;
//      var re = /<div id='comment-id-.*?'>[\s\S]*?<span class="comm-author">([^"]+)<\/span>[\s\S]*?<span>([^"]+)<\/span>[\s\S]*?<div id='comm-id-.*?'>([^"]+)<\/div>/g;
      var match = re.exec(html);
      var first = true;
      while (match) {
        try {
          var user = match[1];
//          user = user.replace(/<.*?>/g, '').trim();
        }
        catch (err) {
          user = '';
        }
//        user = showtime.entityDecode(user);
//        user = unescape(user);
//        user = decodeURIComponent(user);
        try {
          var date = match[2];
//          date = date.replace(/<.*?>/g, '').trim();
        }
        catch (err) {
//          date = '00-00-0000';
          date = '';
        }
//        date = showtime.entityDecode(date);
//        date = unescape(date);
//        date = decodeURIComponent(date);
        try {
          var comment = match[3];
//          comment = comment.replace(/<.*?>/g, '').trim();
          comment = comment.replace(/<br>/g, ' ').trim();
          comment = comment.replace(/(    |   |  )/g, ' ').trim();
        }
        catch (err) {
          comment = '';
        }
//        comment = showtime.entityDecode(comment);
//        comment = unescape(comment);
//        comment = decodeURIComponent(comment);
        var comrating = match[4].match(/<span class="ratingtypeplusminus.*?>(.*?)<\/span>/);
//        var comrating = match[4].match(/<span class="ratingtypeplusminus.*?>([^"]+)<\/span>/);
        try {
          comrating = comrating[1];
          comrating = comrating.replace(/<.*?>/g, '').trim();
          if (/\+/.test(comrating)) {
            comrating = coloredStr(comrating, green);
          }
          else if (/-/.test(comrating)) {
            comrating = coloredStr(comrating, red);
          }
          else {
            comrating = coloredStr(comrating, yellow);
          }
        }
        catch (err) {
//          comrating = 0;
          comrating = '';
        }
//        comrating = showtime.entityDecode(comrating);
//        comrating = unescape(comrating);
//        comrating = decodeURIComponent(comrating);
        page.loading = false;
        if (first) {
          var cname = 'Комментарии';
//          cname = showtime.entityDecode(cname);
//          cname = unescape(cname);
//          cname = decodeURIComponent(cname);
          var pages = html.match(/<div class="navigation">.*?<span>(.*?)<\/span>/);
//          var pages = html.match(/<div class="navigation">.*?<span>([^"]+)<\/span>/);
          try {
            pages = pages[1];
          }
          catch (err) {
//            pages = 0;
//            pages = 1;
            pages = '';
          }
//          pages = showtime.entityDecode(pages);
//          pages = unescape(pages);
//          pages = decodeURIComponent(pages);
          page.appendItem('', 'separator', {
//            title: new showtime.RichText('Комментарии:'),
//            title: new RichText('Комментарии:'),
//            title: new showtime.RichText(cname ? cname + ':' : ''),
//            title: new RichText(cname ? cname + ':' : ''),
//            title: new showtime.RichText('Комментарии' + (pages ? ' (' + pages + ')' : '') + ':'),
//            title: new RichText('Комментарии' + (pages ? ' (' + pages + ')' : '') + ':'),
//            title: new showtime.RichText((cname ? cname : '') + (pages ? ' (' + pages + ')' : '') + ':'),
            title: new RichText((cname ? cname : '') + (pages ? ' (' + pages + ')' : '') + ':'),
          });
//          first = true;
          first = false;
        }
//        var avatar = LOGOAVATAR;
        var avatar = LOGOAVATARS;
        var backdrops = [];
        try {
          backdrops.push({url: icon});
//          backdrops.push({url: avatar});
//          backdrops.push({url: LOGOAVATAR});
//          backdrops.push({url: LOGOAVATARS});
//          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
        }
       catch (err) {
//          backdrops.push({url: icon});
//          backdrops.push({url: avatar});
//          backdrops.push({url: LOGOAVATAR});
//          backdrops.push({url: LOGOAVATARS});
          backdrops.push({url: LOGOICON});
//          backdrops.push({url: LOGOLOGO});
//          backdrops.push({url: LOGO});
//          backdrops.push({url: ''});
        }
//        page.appendPassiveItem('directory', '', {
//        page.appendPassiveItem('video', '', {
        page.appendPassiveItem(service.list, '', {
//          title: new showtime.RichText((user ? coloredStr(user, orange) : '') + ' ' + (date ? date : '')),
          title: new RichText((user ? coloredStr(user, orange) : '') + ' ' + (date ? date : '')),
//          icon: icon,
          icon: avatar,
//          icon: LOGOAVATAR,
//          icon: LOGOAVATARS,
//          icon: LOGOICON,
//          icon: LOGOLOGO,
//          icon: LOGONONE,
//          icon: LOGOFOLDER,
//          icon: LOGOARROW,
//          icon: '',
          backdrops: backdrops,
//          genre: new showtime.RichText(comrating ? comrating : ''),
          genre: new RichText(comrating ? comrating : ''),
//          genre: new showtime.RichText(comrating ? coloredStr(comrating, yellow) : ''),
//          genre: new RichText(comrating ? coloredStr(comrating, yellow) : ''),
//          source: new showtime.RichText(date ? coloredStr(date, orange) : ''),
          source: new RichText(date ? coloredStr(date, orange) : ''),
//          tagline: new showtime.RichText(user ? coloredStr(user, gray) : ''),
          tagline: new RichText(user ? coloredStr(user, gray) : ''),
//          description: new showtime.RichText(comment ? comment : ''),
          description: new RichText(comment ? comment : ''),
        });
        match = re.exec(html);
      }
//      var more = html.match(/<div class="pagi-load icon-left" id="pagi-load"><a href=( '|'| "|"| |)(.*?)('|"| ).*?><span class="fa fa-refresh"><\/span>Загрузить еще<\/a><\/div>/);
//      var more = html.match(/<div class="pagi-load icon-left" id="pagi-load"><a href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = html.match(/<div class="pagi-load.*?href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = html.match(/<div class="navigation">.*?<span>.*?<\/span> <a href=( '|'| "|"| |)(.*?)('|"| ).*?>.*?<\/a>/);
//      var more = html.match(/<div class="pnext"><a href=( '|'| "|"| |)(.*?)('|"| ).*?><span class="fa fa-angle-right"><\/span><\/a><\/div>/);
//      var more = html.match(/<div class="pnext"><a href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = html.match(/<div class="pnext".*?href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = html.match(/["pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> ]+<a href=( '|'| "|"| |)(.*?)('|"| )/);
      var more = html.match(/("pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> )<a href=( '|'| "|"| |)(.*?)('|"| )/);
//      var more = html.match(/("pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> )<a href=( '|'| "|"| |)([^"]+)('|"| )/);
      if (!more) return tryToSearch = false;
      try {
//        url = more[2];
        url = more[3];
        url = url.replace(/(#comment|'|"| )/g, '').trim();
        if (/http.*?:\/\//.test(url)) {
          url = url;
        }
        else {
          url = HTTPS + BASE_URL + url;
//          url = HTTPS + BASE_URL + '///' + url;
        }
//        url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      }
      catch (err) {
        url = '';
      }
//      url = showtime.entityDecode(url);
//      url = unescape(url);
//      url = decodeURIComponent(url);
      return true;
    };
    loader();
    page.paginator = loader;
  }
  catch (err) {}
  page.loading = false;
});
//function search(page, query) {
function search(page, query, url, doc) {
//  query = query.replace(/ /g, '+').trim();
//  query = query.replace(/\s/g, '\+').trim();
//  query = showtime.entityDecode(query);
//  query = unescape(query);
//  query = decodeURIComponent(query);
//  query = utf8to1251urlencode(query);
//  query = utf8to1251decode(query);
//  query = escape(query);
//  query = encodeURIComponent(query);
  page.entries = 0;
//  var fromPage = 0;
  var fromPage = 1;
  var tryToSearch = true;
  function loader() {
    if (!tryToSearch) return false;
    page.loading = true;
//    url = HTTPS + BASE_URL + '/index.php?story=' + query + '&do=search&subaction=search';
//    url = HTTPS + BASE_URL + '/xfsearch/' + query;
    url = HTTPS + BASE_URL + '/xfsearch/' + query + '/page/' + fromPage + '/';
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
/*
//    doc = showtime.httpReq(url).toString();
    doc = http.request(url).toString();
*/
//    doc = showtime.httpReq(url, {
    doc = http.request(url, {
      debug: true,
//      debug: false,
//      noFollow: true,
//      noFollow: false,
      noFail: true,
//      noFail: false,
      compression: true,
//      compression: false,
//      caching: true,
//      caching: false,
//      cacheTime: 3600,
//      cacheTime: 6000,
//      postdata: postdata,
//      postdata: {},
//      headers: headers,
//      headers: {},
//    });
    }).toString();
//    }).convertFromEncoding('utf-8').toString();
//    }).convertFromEncoding('windows-1251').toString();
/*
//    var name = doc.match(/<h1>Смотреть (.*?) HD онлайн<\/h1>/);
    var name = doc.match(/<h1>(.*?)<\/h1>/);
//    var name = doc.match(/<h1>([^"]+)<\/h1>/);
//    var name = doc.match(/<input type="text" name="story" id="searchinput" value="(.*?)"/);
//    var name = doc.match(/<title>(.*?) &raquo;/);
    try {
      name = name[1];
      name = name.replace(/(Смотреть | HD онлайн)/g, '').trim();
    }
    catch (err) {
//      name = coloredStr('Неопределенное', red);
      name = query;
//      name = '';
    }
//    name = showtime.entityDecode(name);
//    name = unescape(name);
//    name = decodeURIComponent(name);
*/
    var pages = doc.match(/<div class="navigation">.*?<span>(.*?)<\/span>/);
//    var pages = doc.match(/<div class="navigation">.*?<span>([^"]+)<\/span>/);
    try {
      pages = pages[1];
    }
    catch (err) {
//      pages = 0;
//      pages = 1;
      pages = '';
    }
//    pages = showtime.entityDecode(pages);
//    pages = unescape(pages);
//    pages = decodeURIComponent(pages);
    page.loading = false;
    page.appendItem('', 'separator', {
//      title: new showtime.RichText(query),
//      title: new RichText(query),
//      title: new showtime.RichText(coloredStr(query, gray)),
//      title: new RichText(coloredStr(query, gray)),
//      title: new showtime.RichText(query + ' (' + fromPage + ')'),
//      title: new RichText(query + ' (' + fromPage + ')'),
//      title: new showtime.RichText(coloredStr(query + ' (' + fromPage + ')', gray)),
//      title: new RichText(coloredStr(query + ' (' + fromPage + ')', gray)),
//      title: new showtime.RichText(coloredStr(query, gray) + ' ' + colorStr(fromPage, gray)),
//      title: new RichText(coloredStr(query, gray) + ' ' + colorStr(fromPage, gray)),
//      title: new showtime.RichText(query + ' ' + (pages ? '(' + pages + ')' : '')),
//      title: new RichText(query + ' ' + (pages ? '(' + pages + ')' : '')),
//      title: new showtime.RichText(coloredStr(query, gray) + ' ' + (pages ? colorStr(pages, gray) : '')),
      title: new RichText(coloredStr(query, gray) + ' ' + (pages ? colorStr(pages, gray) : '')),
//      title: new showtime.RichText(name ? name : ''),
//      title: new RichText(name ? name : ''),
//      title: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//      title: new RichText(name ? coloredStr(name, gray) : ''),
//      title: new showtime.RichText(name ? name + ' (' + fromPage + ')' : ''),
//      title: new RichText(name ? name + ' (' + fromPage + ')' : ''),
//      title: new showtime.RichText((name ? name + ' ' : '') + '(' + fromPage + ')'),
//      title: new RichText((name ? name + ' ' : '') + '(' + fromPage + ')'),
//      title: new showtime.RichText(name ? coloredStr(name + ' (' + fromPage + ')', gray) : ''),
//      title: new RichText(name ? coloredStr(name + ' (' + fromPage + ')', gray) : ''),
//      title: new showtime.RichText((name ? coloredStr(name, gray) + ' ' : '') + colorStr(fromPage, gray)),
//      title: new RichText((name ? coloredStr(name, gray) + ' ' : '') + colorStr(fromPage, gray)),
//      title: new showtime.RichText((name ? name + ' ' : '') + (pages ? '(' + pages + ')' : '')),
//      title: new RichText((name ? name + ' ' : '') + (pages ? '(' + pages + ')' : '')),
//      title: new showtime.RichText((name ? coloredStr(name, gray) + ' ' : '') + (pages ? colorStr(pages, gray) : '')),
//      title: new RichText((name ? coloredStr(name, gray) + ' ' : '') + (pages ? colorStr(pages, gray) : '')),
    });
    var scr = doc.replace(/owl-carousel[\s\S]*?<(div class="content"|main class="main"|div class="sect"|div class="sect-cont sect-items clearfix"|div class="speedbar nowrap")>/g, '').trim();
    scraper(page, scr);
//    scraper(page, doc);
/*
//    var more = doc.match(/<div class="pagi-load icon-left" id="pagi-load"><a href=( '|'| "|"| |)(.*?)('|"| ).*?><span class="fa fa-refresh"><\/span>Загрузить еще<\/a><\/div>/);
//    var more = doc.match(/<div class="pagi-load icon-left" id="pagi-load"><a href=( '|'| "|"| |)(.*?)('|"| )/);
//    var more = doc.match(/<div class="pagi-load.*?href=( '|'| "|"| |)(.*?)('|"| )/);
//    var more = doc.match(/<div class="navigation">.*?<span>.*?<\/span> <a href=( '|'| "|"| |)(.*?)('|"| ).*?>.*?<\/a>/);
//    var more = doc.match(/<div class="pnext"><a href=( '|'| "|"| |)(.*?)('|"| ).*?><span class="fa fa-angle-right"><\/span><\/a><\/div>/);
//    var more = doc.match(/<div class="pnext"><a href=( '|'| "|"| |)(.*?)('|"| )/);
//    var more = doc.match(/<div class="pnext".*?href=( '|'| "|"| |)(.*?)('|"| )/);
//    var more = doc.match(/["pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> ]+<a href=( '|'| "|"| |)(.*?)('|"| )/);
    var more = doc.match(/("pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> )<a href=( '|'| "|"| |)(.*?)('|"| )/);
//    var more = doc.match(/("pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> )<a href=( '|'| "|"| |)([^"]+)('|"| )/);
    if (!more) return tryToSearch = false;
    try {
//      url = more[2];
      url = more[3];
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
        url = HTTPS + BASE_URL + url;
//        url = HTTPS + BASE_URL + '///' + url;
      }
//      url = url + '///';
//      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
*/
//    if (!doc.match(/["pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> ]+<a href/)) return tryToSearch = false;
    if (!doc.match(/("pagi-load">|"pnext">|"navigation">.*?<span>.*?<\/span> )<a href/)) return tryToSearch = false;
    fromPage++;
    return true;
  };
  loader();
  page.paginator = loader;
};
function scrapermain(page, doc) {
//  var re = /<(td class="item"|li)><a href=( '|'| "|"| |)([\s\S]*?)('|"| ).*?>([\s\S]*?)<\/a><(\/td|li)>/g;
  var re = /<(td class="item"|li)><a href=( '|'| "|"| |)(.*?)('|"| ).*?>(.*?)<\/a>/g;
//  var re = /<(td class="item"|li)><a href=( '|'| "|"| |)([^"]+)('|"| ).*?>([^"]+)<\/a>/g;
  var match = re.exec(doc);
  while (match) {
    try {
      var url = match[3];
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
        url = HTTPS + BASE_URL + url;
//        url = HTTPS + BASE_URL + '///' + url;
      }
//      url = url + '///';
//      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
    try {
      var title = match[5];
      title = title.replace(/<.*?>/g, '').trim();
    }
   catch (err) {
//      title = coloredStr('Неопределенное', red);
      title = '';
    }
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
    var uri;
    uri = PREFIX + ':browse:' + url + '~' + title;
//    uri = PREFIX + ':browse:' + escape(url) + '~' + escape(title);
//    uri = PREFIX + ':browse:' + encodeURIComponent(url) + '~' + encodeURIComponent(title);
    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
//    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
      title: new RichText(title),
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
      icon: LOGOFOLDER,
//      icon: LOGOARROW,
//      icon: '',
//      tagline: new showtime.RichText(coloredStr(title, gray)),
//      tagline: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
//      description: new RichText(coloredStr(title, gray)),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
function scrapercat(page, doc) {
//  var re = /<(li|td)><a href=( '|'| "|"| |)([\s\S]*?)('|"| ).*?>([\s\S]*?)<\/a><(\/li|td)>/g;
  var re = /<(li|td)><a href=( '|'| "|"| |)(.*?)('|"| ).*?>(.*?)<\/a>/g;
//  var re = /<(li|td)><a href=( '|'| "|"| |)([^"]+)('|"| ).*?>([^"]+)<\/a>/g;
  var match = re.exec(doc);
  while (match) {
    try {
      var url = match[3];
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
//        url = HTTPS + BASE_URL + url;
        url = HTTPS + BASE_URL + '///' + url;
      }
      url = url + '///';
      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
    try {
      var title = match[5];
      title = title.replace(/<.*?>/g, '').trim();
    }
   catch (err) {
//      title = coloredStr('Неопределенное', red);
      title = '';
    }
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
    var uri;
    uri = PREFIX + ':browse:' + url + '~' + title;
//    uri = PREFIX + ':browse:' + escape(url) + '~' + escape(title);
//    uri = PREFIX + ':browse:' + encodeURIComponent(url) + '~' + encodeURIComponent(title);
    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
//    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
      title: new RichText(title),
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
      icon: LOGOFOLDER,
//      icon: LOGOARROW,
//      icon: '',
//      tagline: new showtime.RichText(coloredStr(title, gray)),
//      tagline: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
//      description: new RichText(coloredStr(title, gray)),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
//function scrapertag(page, doc) {
function scrapertag(page, doc, section) {
//  var re = /<a href=( '|'| "|"| |)([\s\S]*?)('|"| ).*?>([\s\S]*?)<\/a>/g;
  var re = /<a href=( '|'| "|"| |)(.*?)('|"| ).*?>(.*?)<\/a>/g;
//  var re = /<a href=( '|'| "|"| |)([^"]+)('|"| ).*?>([^"]+)<\/a>/g;
  var match = re.exec(doc);
  while (match) {
    try {
      var url = match[2];
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
//        url = HTTPS + BASE_URL + url;
        url = HTTPS + BASE_URL + '///' + url;
      }
      url = url + '///';
      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
    try {
      var title = match[4];
      title = title.replace(/<.*?>/g, '').trim();
    }
   catch (err) {
//      title = coloredStr('Неопределенное', red);
      title = '';
    }
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
    var icon = LOGOICON;
//    var icon = LOGOLOGO;
//    var icon = LOGONONE;
//    var icon = '';
    var backdrops = [];
    try {
      backdrops.push({url: icon});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
    }
    catch (err) {
      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: ''});
    }
    var name = 'Метки';
//    name = showtime.entityDecode(name);
//    name = unescape(name);
//    name = decodeURIComponent(name);
    if (section && page.entries == 0)
    page.appendItem('', 'separator', {
//      title: new showtime.RichText('Метки:'),
//      title: new RichText('Метки:'),
//      title: new showtime.RichText(name ? name + ':' : ''),
      title: new RichText(name ? name + ':' : ''),
    });
    var uri;
    uri = PREFIX + ':browse:' + url + '~' + title;
//    uri = PREFIX + ':browse:' + escape(url) + '~' + escape(title);
//    uri = PREFIX + ':browse:' + encodeURIComponent(url) + '~' + encodeURIComponent(title);
//    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
      title: new RichText(title),
      icon: icon,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: LOGOFOLDER,
//      icon: LOGOARROW,
//      icon: '',
      backdrops: backdrops,
//      tagline: new showtime.RichText(coloredStr(title, gray)),
//      tagline: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
      description: new RichText(coloredStr(title, gray)),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
//function scraperpop(page, doc) {
function scraperpop(page, doc, section) {
//  var re = /<li><a href=( '|'| "|"| |)([\s\S]*?)('|"| ).*?title="([\s\S]*?)">([\s\S]*?)<\/a><\/li>/g;
  var re = /<li><a href=( '|'| "|"| |)(.*?)('|"| ).*?>(.*?)<\/a>/g;
//  var re = /<li><a href=( '|'| "|"| |)([^"]+)('|"| ).*?>([^"]+)<\/a>/g;
  var match = re.exec(doc);
  while (match) {
    try {
      var url = match[2];
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
        url = HTTPS + BASE_URL + url;
//        url = HTTPS + BASE_URL + '///' + url;
      }
//      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
    try {
      var title = match[4];
//      var title = match[5];
      title = title.replace(/<.*?>/g, '').trim();
    }
   catch (err) {
//      title = coloredStr('Неопределенное', red);
      title = '';
    }
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
    var icon = LOGOICON;
//    var icon = LOGOLOGO;
//    var icon = LOGONONE;
//    var icon = '';
    var backdrops = [];
    try {
      backdrops.push({url: icon});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
    }
    catch (err) {
      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: ''});
    }
    var name = 'Популярное';
//    name = showtime.entityDecode(name);
//    name = unescape(name);
//    name = decodeURIComponent(name);
    if (section && page.entries == 0)
    page.appendItem('', 'separator', {
//      title: new showtime.RichText('Популярное:'),
//      title: new RichText('Популярное:'),
//      title: new showtime.RichText(name ? name + ':' : ''),
      title: new RichText(name ? name + ':' : ''),
    });
    var uri;
    uri = PREFIX + ':moviepage:' + url + '~' + title + '~' + icon;
//    uri = PREFIX + ':moviepage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//    uri = PREFIX + ':moviepage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
//    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
      title: new RichText(title),
      icon: icon,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: logoquality,
//      icon: '',
      backdrops: backdrops,
//      tagline: new showtime.RichText(coloredStr(title, gray)),
//      tagline: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
      description: new RichText(coloredStr(title, gray)),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
function scrapercar(page, doc) {
  var re = /"(inner|top-carou img-box|carou img-box)"([\s\S]*?)<\/a>/g;
  var match = re.exec(doc);
  while (match) {
    var url = void(0);
    try {
      var expressions = [
        {wh: match[2], th: /href=( '|'| "|"| |)(.*?)('|"| )/},
        {wh: match[2], th: /data-link=( '|'| "|"| |)(.*?)('|"| )/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        url = expressions[i].wh.match(expressions[i].th);
        if (url) {
          url = url[2];
          break;
        }
      }
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
        url = HTTPS + BASE_URL + url;
//        url = HTTPS + BASE_URL + '///' + url;
      }
//      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
/*
//    var xurl = match[2].match(/href=( '|'| "|"| |)(.*?)('|"| )/);
//    var xurl = match[2].match(/href=( '|'| "|"| |)([^"]+)('|"| )/);
    var xurl = match[2].match(/data-link=( '|'| "|"| |)(.*?)('|"| )/);
//    var xurl = match[2].match(/data-link=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      xurl = xurl[2];
      xurl = xurl.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(xurl)) {
        xurl = xurl;
      }
      else {
        xurl = HTTPS + BASE_URL + xurl;
//        xurl = HTTPS + BASE_URL + '///' + xurl;
      }
//      xurl = xurl.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
//      xurl = url;
      xurl = '';
    }
//    xurl = showtime.entityDecode(xurl);
//    xurl = unescape(xurl);
//    xurl = decodeURIComponent(xurl);
    var url = match[2].match(/href=( '|'| "|"| |)(.*?)('|"| )/);
//    var url = match[2].match(/href=( '|'| "|"| |)([^"]+)('|"| )/);
//    var url = match[2].match(/data-link=( '|'| "|"| |)(.*?)('|"| )/);
//    var url = match[2].match(/data-link=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      url = url[2];
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
        url = HTTPS + BASE_URL + url;
//        url = HTTPS + BASE_URL + '///' + url;
      }
//      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = xurl;
//      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
*/
    var title = void(0);
    try {
      var expressions = [
        {wh: match[2], th: /title="(.*?)"/},
        {wh: match[2], th: /alt="(.*?)"/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        title = expressions[i].wh.match(expressions[i].th);
        if (title) {
          title = title[1];
          break;
        }
      }
    }
    catch (err) {
//      title = coloredStr('Неопределенное', red);
      title = '';
    }
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
/*
//    var xtitle = match[2].match(/title="(.*?)"/);
//    var xtitle = match[2].match(/title="([^"]+)"/);
    var xtitle = match[2].match(/alt="(.*?)"/);
//    var xtitle = match[2].match(/alt="([^"]+)"/);
    try {
      xtitle = xtitle[1];
    }
    catch (err) {
//      xtitle = coloredStr('Неопределенное', red);
//      xtitle = title;
      xtitle = '';
    }
//    xtitle = showtime.entityDecode(xtitle);
//    xtitle = unescape(xtitle);
//    xtitle = decodeURIComponent(xtitle);
    var title = match[2].match(/title="(.*?)"/);
//    var title = match[2].match(/title="([^"]+)"/);
//    var title = match[2].match(/alt="(.*?)"/);
//    var title = match[2].match(/alt="([^"]+)"/);
    try {
      title = title[1];
    }
    catch (err) {
//      title = coloredStr('Неопределенное', red);
      title = xtitle;
//      title = '';
    }
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
*/
    var icon = void(0);
//    var icon = LOGOICON;
//    var icon = LOGOLOGO;
//    var icon = LOGONONE;
//    var icon = '';
    try {
      var expressions = [
        {wh: match[2], th: /data-src=( '|'| "|"| |)(.*?)('|"| )/},
        {wh: match[2], th: /src=( '|'| "|"| |)(.*?)('|"| )/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        icon = expressions[i].wh.match(expressions[i].th);
        if (icon) {
          icon = icon[2];
          break;
        }
      }
      icon = icon.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(icon)) {
        icon = icon;
      }
      else {
        icon = HTTPS + BASE_URL + icon;
//        icon = HTTPS + BASE_URL + '///' + icon;
      }
//      icon = icon.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(icon)) {
      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(icon) && !/\.webp/.test(icon)) {
        icon = icon;
      }
      else {
        icon = LOGOICON;
//        icon = LOGOLOGO;
//        icon = LOGONONE;
//        icon = '';
      }
    }
    catch (err) {
      icon = LOGOICON;
//      icon = LOGOLOGO;
//      icon = LOGONONE;
//      icon = '';
    }
//    icon = showtime.entityDecode(icon);
//    icon = unescape(icon);
//    icon = decodeURIComponent(icon);
/*
//    var xicon = match[2].match(/data-src=( '|'| "|"| |)(.*?)('|"| )/);
//    var xicon = match[2].match(/data-src=( '|'| "|"| |)([^"]+)('|"| )/);
    var xicon = match[2].match(/src=( '|'| "|"| |)(.*?)('|"| )/);
//    var xicon = match[2].match(/src=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      xicon = xicon[2];
      xicon = xicon.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(xicon)) {
        xicon = xicon;
      }
      else {
        xicon = HTTPS + BASE_URL + xicon;
//        xicon = HTTPS + BASE_URL + '///' + xicon;
      }
//      xicon = xicon.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(xicon)) {
        xicon = xicon;
      }
      else {
//        xicon = icon;
        xicon = LOGOICON;
//        xicon = LOGOLOGO;
//        xicon = LOGONONE;
//        xicon = '';
      }
    }
    catch (err) {
//      xicon = icon;
      xicon = LOGOICON;
//      xicon = LOGOLOGO;
//      xicon = LOGONONE;
//      xicon = '';
    }
//    xicon = showtime.entityDecode(xicon);
//    xicon = unescape(xicon);
//    xicon = decodeURIComponent(xicon);
    var icon = match[2].match(/data-src=( '|'| "|"| |)(.*?)('|"| )/);
//    var icon = match[2].match(/data-src=( '|'| "|"| |)([^"]+)('|"| )/);
//    var icon = match[2].match(/src=( '|'| "|"| |)(.*?)('|"| )/);
//    var icon = match[2].match(/src=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      icon = icon[2];
      icon = icon.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(icon)) {
        icon = icon;
      }
      else {
        icon = HTTPS + BASE_URL + icon;
//        icon = HTTPS + BASE_URL + '///' + icon;
      }
//      icon = icon.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(icon)) {
        icon = icon;
      }
      else {
        icon = xicon;
//        icon = LOGOICON;
//        icon = LOGOLOGO;
//        icon = LOGONONE;
//        icon = '';
      }
    }
    catch (err) {
      icon = xicon;
//      icon = LOGOICON;
//      icon = LOGOLOGO;
//      icon = LOGONONE;
//      icon = '';
    }
//    icon = showtime.entityDecode(icon);
//    icon = unescape(icon);
//    icon = decodeURIComponent(icon);
*/
    var quality = match[2].match(/quality.*?>(.*?)<\/div>/);
//    var quality = match[2].match(/quality.*?>([^"]+)<\/div>/);
    try {
      quality = quality[1];
      quality = quality.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      quality = '';
    }
//    quality = showtime.entityDecode(quality);
//    quality = unescape(quality);
//    quality = decodeURIComponent(quality);
    var logoquality;
//    logoquality = LOGOHD;
    if (/720/.test(quality)) {
      logoquality = LOGO720;
    }
    else if (/1080/.test(quality)) {
      logoquality = LOGO1080;
    }
    else if (/2160/.test(quality)) {
      logoquality = LOGO4K;
    }
    else {
      logoquality = LOGONONE;
//      logoquality = LOGOHD;
    }
    var backdrops = [];
    try {
      backdrops.push({url: icon});
//      backdrops.push({url: xicon});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: logoquality});
    }
    catch (err) {
//      backdrops.push({url: icon});
//      backdrops.push({url: xicon});
      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: logoquality});
//      backdrops.push({url: ''});
    }
    var uri;
    uri = PREFIX + ':moviepage:' + url + '~' + title + '~' + icon;
//    uri = PREFIX + ':moviepage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//    uri = PREFIX + ':moviepage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
//    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
      title: new RichText(title),
      icon: icon,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: logoquality,
//      icon: '',
      backdrops: backdrops,
//      genre: new showtime.RichText(quality ? quality : ''),
//      genre: new RichText(quality ? quality : ''),
//      genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
      genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//      tagline: new showtime.RichText(coloredStr(title, gray)),
//      tagline: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
      description: new RichText(coloredStr(title, gray)),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
//function scraper(page, doc) {
function scraper(page, doc, section) {
  var re = /(<div class=".*?shortstorytitle">|<div class="kino-title">|<div class="films-title">|<article class="short">)([\s\S]*?)(<div class="shortstory">|<div class="kino-item ignore-select kino-fix">|<div class="films-item ignore-select">|<div style="clear:both">|<div class="bot-left">|<div class="pagi-nav clearfix ignore-select">|<div class="clr">|<div class="border-side">|<!--hikinogo_icons2-->|<!--icons-->|<span class="editicon" title="Редактировать">|<\/article>)/g;
  var match = re.exec(doc);
  while (match) {
    var url = void(0);
    try {
      var expressions = [
        {wh: match[2], th: /<h2.*?href=( '|'| "|"| |)(.*?)('|"| )/},
        {wh: match[2], th: /data-link=( '|'| "|"| |)(.*?)('|"| )/},
        {wh: match[2], th: /data-href=( '|'| "|"| |)(.*?)('|"| )/},
        {wh: match[2], th: /<a href=( '|'| "|"| |)(.*?)('|"| )/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        url = expressions[i].wh.match(expressions[i].th);
        if (url) {
          url = url[2];
          break;
        }
      }
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
        url = HTTPS + BASE_URL + url;
//        url = HTTPS + BASE_URL + '///' + url;
      }
//      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
/*
//    var x1url = match[2].match(/<h2.*?href=( '|'| "|"| |)(.*?)('|"| )/);
//    var x1url = match[2].match(/<h2.*?href=( '|'| "|"| |)([^"]+)('|"| )/);
//    var x1url = match[2].match(/data-link=( '|'| "|"| |)(.*?)('|"| )/);
//    var x1url = match[2].match(/data-link=( '|'| "|"| |)([^"]+)('|"| )/);
//    var x1url = match[2].match(/data-href=( '|'| "|"| |)(.*?)('|"| )/);
//    var x1url = match[2].match(/data-href=( '|'| "|"| |)([^"]+)('|"| )/);
    var x1url = match[2].match(/<a href=( '|'| "|"| |)(.*?)('|"| )/);
//    var x1url = match[2].match(/<a href=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      x1url = x1url[2];
      x1url = x1url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(x1url)) {
        x1url = x1url;
      }
      else {
        x1url = HTTPS + BASE_URL + x1url;
//        x1url = HTTPS + BASE_URL + '///' + x1url;
      }
//      x1url = x1url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
//      x1url = url;
//      x1url = xurl;
//      x1url = x0url;
      x1url = '';
    }
//    x1url = showtime.entityDecode(x1url);
//    x1url = unescape(x1url);
//    x1url = decodeURIComponent(x1url);
//    var x0url = match[2].match(/<h2.*?href=( '|'| "|"| |)(.*?)('|"| )/);
//    var x0url = match[2].match(/<h2.*?href=( '|'| "|"| |)([^"]+)('|"| )/);
//    var x0url = match[2].match(/data-link=( '|'| "|"| |)(.*?)('|"| )/);
//    var x0url = match[2].match(/data-link=( '|'| "|"| |)([^"]+)('|"| )/);
    var x0url = match[2].match(/data-href=( '|'| "|"| |)(.*?)('|"| )/);
//    var x0url = match[2].match(/data-href=( '|'| "|"| |)([^"]+)('|"| )/);
//    var x0url = match[2].match(/<a href=( '|'| "|"| |)(.*?)('|"| )/);
//    var x0url = match[2].match(/<a href=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      x0url = x0url[2];
      x0url = x0url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(x0url)) {
        x0url = x0url;
      }
      else {
        x0url = HTTPS + BASE_URL + x0url;
//        x0url = HTTPS + BASE_URL + '///' + x0url;
      }
//      x0url = x0url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
//      x0url = url;
//      x0url = xurl;
      x0url = x1url;
//      x0url = '';
    }
//    x0url = showtime.entityDecode(x0url);
//    x0url = unescape(x0url);
//    x0url = decodeURIComponent(x0url);
//    var xurl = match[2].match(/<h2.*?href=( '|'| "|"| |)(.*?)('|"| )/);
//    var xurl = match[2].match(/<h2.*?href=( '|'| "|"| |)([^"]+)('|"| )/);
    var xurl = match[2].match(/data-link=( '|'| "|"| |)(.*?)('|"| )/);
//    var xurl = match[2].match(/data-link=( '|'| "|"| |)([^"]+)('|"| )/);
//    var xurl = match[2].match(/data-href=( '|'| "|"| |)(.*?)('|"| )/);
//    var xurl = match[2].match(/data-href=( '|'| "|"| |)([^"]+)('|"| )/);
//    var xurl = match[2].match(/<a href=( '|'| "|"| |)(.*?)('|"| )/);
//    var xurl = match[2].match(/<a href=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      xurl = xurl[2];
      xurl = xurl.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(xurl)) {
        xurl = xurl;
      }
      else {
        xurl = HTTPS + BASE_URL + xurl;
//        xurl = HTTPS + BASE_URL + '///' + xurl;
      }
//      xurl = xurl.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
//      xurl = url;
      xurl = x0url;
//      xurl = x1url;
//      xurl = '';
    }
//    xurl = showtime.entityDecode(xurl);
//    xurl = unescape(xurl);
//    xurl = decodeURIComponent(xurl);
    var url = match[2].match(/<h2.*?href=( '|'| "|"| |)(.*?)('|"| )/);
//    var url = match[2].match(/<h2.*?href=( '|'| "|"| |)([^"]+)('|"| )/);
//    var url = match[2].match(/data-link=( '|'| "|"| |)(.*?)('|"| )/);
//    var url = match[2].match(/data-link=( '|'| "|"| |)([^"]+)('|"| )/);
//    var url = match[2].match(/data-href=( '|'| "|"| |)(.*?)('|"| )/);
//    var url = match[2].match(/data-href=( '|'| "|"| |)([^"]+)('|"| )/);
//    var url = match[2].match(/<a href=( '|'| "|"| |)(.*?)('|"| )/);
//    var url = match[2].match(/<a href=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      url = url[2];
      url = url.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(url)) {
        url = url;
      }
      else {
        url = HTTPS + BASE_URL + url;
//        url = HTTPS + BASE_URL + '///' + url;
      }
//      url = url.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
    }
    catch (err) {
      url = xurl;
//      url = x0url;
//      url = x1url;
//      url = '';
    }
//    url = showtime.entityDecode(url);
//    url = unescape(url);
//    url = decodeURIComponent(url);
*/
    var title = void(0);
    try {
      var expressions = [
        {wh: match[2], th: /<h2[\s\S]*?href.*?>(.*?)<\/a>/},
        {wh: match[2], th: /data-link.*?title="(.*?)"/},
        {wh: match[2], th: /data-src.*?title="(.*?)"/},
        {wh: match[2], th: /data-src.*?alt="(.*?)"/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        title = expressions[i].wh.match(expressions[i].th);
        if (title) {
          title = title[1];
          break;
        }
      }
      title = title.replace(/<.*?>/g, '').trim();
      title = title.replace(/( - смотреть онлайн.*?| смотреть онлайн.*?| онлайн бесплатно.*?)/g, '').trim();
    }
    catch (err) {
//      title = coloredStr('Неопределенное', red);
      title = '';
    }
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
/*
//    var x1title = match[2].match(/<h2[\s\S]*?href.*?>(.*?)<\/a>/);
//    var x1title = match[2].match(/<h2[\s\S]*?href.*?>([^"]+)<\/a>/);
//    var x1title = match[2].match(/data-link.*?title="(.*?)"/);
//    var x1title = match[2].match(/data-link.*?title="([^"]+)"/);
//    var x1title = match[2].match(/data-src.*?title="(.*?)"/);
//    var x1title = match[2].match(/data-src.*?title="([^"]+)"/);
    var x1title = match[2].match(/data-src.*?alt="(.*?)"/);
//    var x1title = match[2].match(/data-src.*?alt="([^"]+)"/);
    try {
      x1title = x1title[1];
//      x1title = x1title.replace(/<.*?>/g, '').trim();
      x1title = x1title.replace(/( - смотреть онлайн.*?| смотреть онлайн.*?| онлайн бесплатно.*?)/g, '').trim();
    }
    catch (err) {
//      x1title = coloredStr('Неопределенное', red);
//      x1title = title;
//      x1title = xtitle;
//      x1title = x0title;
      x1title = '';
    }
//    x1title = showtime.entityDecode(x1title);
//    x1title = unescape(x1title);
//    x1title = decodeURIComponent(x1title);
//    var x0title = match[2].match(/<h2[\s\S]*?href.*?>(.*?)<\/a>/);
//    var x0title = match[2].match(/<h2[\s\S]*?href.*?>([^"]+)<\/a>/);
//    var x0title = match[2].match(/data-link.*?title="(.*?)"/);
//    var x0title = match[2].match(/data-link.*?title="([^"]+)"/);
    var x0title = match[2].match(/data-src.*?title="(.*?)"/);
//    var x0title = match[2].match(/data-src.*?title="([^"]+)"/);
//    var x0title = match[2].match(/data-src.*?alt="(.*?)"/);
//    var x0title = match[2].match(/data-src.*?alt="([^"]+)"/);
    try {
      x0title = x0title[1];
//      x0title = x0title.replace(/<.*?>/g, '').trim();
      x0title = x0title.replace(/( - смотреть онлайн.*?| смотреть онлайн.*?| онлайн бесплатно.*?)/g, '').trim();
    }
    catch (err) {
//      x0title = coloredStr('Неопределенное', red);
//      x0title = title;
//      x0title = xtitle;
      x0title = x1title;
//      x0title = '';
    }
//    x0title = showtime.entityDecode(x0title);
//    x0title = unescape(x0title);
//    x0title = decodeURIComponent(x0title);
//    var xtitle = match[2].match(/<h2[\s\S]*?href.*?>(.*?)<\/a>/);
//    var xtitle = match[2].match(/<h2[\s\S]*?href.*?>([^"]+)<\/a>/);
    var xtitle = match[2].match(/data-link.*?title="(.*?)"/);
//    var xtitle = match[2].match(/data-link.*?title="([^"]+)"/);
//    var xtitle = match[2].match(/data-src.*?title="(.*?)"/);
//    var xtitle = match[2].match(/data-src.*?title="([^"]+)"/);
//    var xtitle = match[2].match(/data-src.*?alt="(.*?)"/);
//    var xtitle = match[2].match(/data-src.*?alt="([^"]+)"/);
    try {
      xtitle = xtitle[1];
//      xtitle = xtitle.replace(/<.*?>/g, '').trim();
      xtitle = xtitle.replace(/( - смотреть онлайн.*?| смотреть онлайн.*?| онлайн бесплатно.*?)/g, '').trim();
    }
    catch (err) {
//      xtitle = coloredStr('Неопределенное', red);
//      xtitle = title;
      xtitle = x0title;
//      xtitle = x1title;
//      xtitle = '';
    }
//    xtitle = showtime.entityDecode(xtitle);
//    xtitle = unescape(xtitle);
//    xtitle = decodeURIComponent(xtitle);
    var title = match[2].match(/<h2[\s\S]*?href.*?>(.*?)<\/a>/);
//    var title = match[2].match(/<h2[\s\S]*?href.*?>([^"]+)<\/a>/);
//    var title = match[2].match(/data-link.*?title="(.*?)"/);
//    var title = match[2].match(/data-link.*?title="([^"]+)"/);
//    var title = match[2].match(/data-src.*?title="(.*?)"/);
//    var title = match[2].match(/data-src.*?title="([^"]+)"/);
//    var title = match[2].match(/data-src.*?alt="(.*?)"/);
//    var title = match[2].match(/data-src.*?alt="([^"]+)"/);
    try {
      title = title[1];
      title = title.replace(/<.*?>/g, '').trim();
      title = title.replace(/( - смотреть онлайн.*?| смотреть онлайн.*?| онлайн бесплатно.*?)/g, '').trim();
    }
    catch (err) {
//      title = coloredStr('Неопределенное', red);
      title = xtitle;
//      title = x0title;
//      title = x1title;
//      title = '';
    }
//    title = showtime.entityDecode(title);
//    title = unescape(title);
//    title = decodeURIComponent(title);
*/
    var icon = void(0);
//    var icon = LOGOICON;
//    var icon = LOGOLOGO;
//    var icon = LOGONONE;
//    var icon = '';
    try {
      var expressions = [
        {wh: match[2], th: /data-src=( '|'| "|"| |)(.*?)('|"| )/},
        {wh: match[2], th: /shortimg[\s\S]*?src=( '|'| "|"| |)(.*?)('|"| )/},
        {wh: match[2], th: /img-box[\s\S]*?src=( '|'| "|"| |)(.*?)('|"| )/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        icon = expressions[i].wh.match(expressions[i].th);
        if (icon) {
          icon = icon[2];
          break;
        }
      }
      icon = icon.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(icon)) {
        icon = icon;
      }
      else {
        icon = HTTPS + BASE_URL + icon;
//        icon = HTTPS + BASE_URL + '///' + icon;
      }
//      icon = icon.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
//      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(icon)) {
      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(icon) && !/\.webp/.test(icon)) {
        icon = icon;
      }
      else {
        icon = LOGOICON;
//        icon = LOGOLOGO;
//        icon = LOGONONE;
//        icon = '';
      }
    }
    catch (err) {
      icon = LOGOICON;
//      icon = LOGOLOGO;
//      icon = LOGONONE;
//      icon = '';
    }
//    icon = showtime.entityDecode(icon);
//    icon = unescape(icon);
//    icon = decodeURIComponent(icon);
/*
//    var x0icon = match[2].match(/data-src=( '|'| "|"| |)(.*?)('|"| )/);
//    var x0icon = match[2].match(/data-src=( '|'| "|"| |)([^"]+)('|"| )/);
//    var x0icon = match[2].match(/shortimg[\s\S]*?src=( '|'| "|"| |)(.*?)('|"| )/);
//    var x0icon = match[2].match(/shortimg[\s\S]*?src=( '|'| "|"| |)([^"]+)('|"| )/);
    var x0icon = match[2].match(/img-box[\s\S]*?src=( '|'| "|"| |)(.*?)('|"| )/);
//    var x0icon = match[2].match(/img-box[\s\S]*?src=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      x0icon = x0icon[2];
      x0icon = x0icon.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(x0icon)) {
        x0icon = x0icon;
      }
      else {
        x0icon = HTTPS + BASE_URL + x0icon;
//        x0icon = HTTPS + BASE_URL + '///' + x0icon;
      }
//      x0icon = x0icon.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(x0icon)) {
        x0icon = x0icon;
      }
      else {
//        x0icon = icon;
//        x0icon = xicon;
        x0icon = LOGOICON;
//        x0icon = LOGOLOGO;
//        x0icon = LOGONONE;
//        x0icon = '';
      }
    }
    catch (err) {
//      x0icon = icon;
//      x0icon = xicon;
      x0icon = LOGOICON;
//      x0icon = LOGOLOGO;
//      x0icon = LOGONONE;
//      x0icon = '';
    }
//    x0icon = showtime.entityDecode(x0icon);
//    x0icon = unescape(x0icon);
//    x0icon = decodeURIComponent(x0icon);
//    var xicon = match[2].match(/data-src=( '|'| "|"| |)(.*?)('|"| )/);
//    var xicon = match[2].match(/data-src=( '|'| "|"| |)([^"]+)('|"| )/);
    var xicon = match[2].match(/shortimg[\s\S]*?src=( '|'| "|"| |)(.*?)('|"| )/);
//    var xicon = match[2].match(/shortimg[\s\S]*?src=( '|'| "|"| |)([^"]+)('|"| )/);
//    var xicon = match[2].match(/img-box[\s\S]*?src=( '|'| "|"| |)(.*?)('|"| )/);
//    var xicon = match[2].match(/img-box[\s\S]*?src=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      xicon = xicon[2];
      xicon = xicon.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(xicon)) {
        xicon = xicon;
      }
      else {
        xicon = HTTPS + BASE_URL + xicon;
//        xicon = HTTPS + BASE_URL + '///' + xicon;
      }
//      xicon = xicon.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(xicon)) {
        xicon = xicon;
      }
      else {
//        xicon = icon;
        xicon = x0icon;
//        xicon = LOGOICON;
//        xicon = LOGOLOGO;
//        xicon = LOGONONE;
//        xicon = '';
      }
    }
    catch (err) {
//      xicon = icon;
      xicon = x0icon;
//      xicon = LOGOICON;
//      xicon = LOGOLOGO;
//      xicon = LOGONONE;
//      xicon = '';
    }
//    xicon = showtime.entityDecode(xicon);
//    xicon = unescape(xicon);
//    xicon = decodeURIComponent(xicon);
    var icon = match[2].match(/data-src=( '|'| "|"| |)(.*?)('|"| )/);
//    var icon = match[2].match(/data-src=( '|'| "|"| |)([^"]+)('|"| )/);
//    var icon = match[2].match(/shortimg[\s\S]*?src=( '|'| "|"| |)(.*?)('|"| )/);
//    var icon = match[2].match(/shortimg[\s\S]*?src=( '|'| "|"| |)([^"]+)('|"| )/);
//    var icon = match[2].match(/img-box[\s\S]*?src=( '|'| "|"| |)(.*?)('|"| )/);
//    var icon = match[2].match(/img-box[\s\S]*?src=( '|'| "|"| |)([^"]+)('|"| )/);
    try {
      icon = icon[2];
      icon = icon.replace(/('|"| )/g, '').trim();
      if (/http.*?:\/\//.test(icon)) {
        icon = icon;
      }
      else {
        icon = HTTPS + BASE_URL + icon;
//        icon = HTTPS + BASE_URL + '///' + icon;
      }
//      icon = icon.replace(/(\/\/\/\/|\/\/\/)/g, '/').trim();
      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(icon)) {
        icon = icon;
      }
      else {
        icon = xicon;
//        icon = x0icon;
//        icon = LOGOICON;
//        icon = LOGOLOGO;
//        icon = LOGONONE;
//        icon = '';
      }
    }
    catch (err) {
      icon = xicon;
//      icon = x0icon;
//      icon = LOGOICON;
//      icon = LOGOLOGO;
//      icon = LOGONONE;
//      icon = '';
    }
//    icon = showtime.entityDecode(icon);
//    icon = unescape(icon);
//    icon = decodeURIComponent(icon);
*/
    var year = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />Год.*?>(.*?)<(br|\/span|\/li|\/a)>/},
        {wh: match[2], th: />Год.*?>(.*?)<\/div>/},
        {wh: match[2], th: />Год.*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        year = expressions[i].wh.match(expressions[i].th);
        if (year) {
          year = year[1];
          break;
        }
      }
      year = year.replace(/(<.*?>|<br>)/g, '').trim();
      year = year.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      year = '';
    }
//    year = showtime.entityDecode(year);
//    year = unescape(year);
//    year = decodeURIComponent(year);
/*
//    var year = match[2].match(/>Год.*?>([\S\s]*?)<(br|\/span|\/li|\/a|\/div)>/);
    var year = match[2].match(/>Год.*?>(.*?)<(br|\/span|\/li|\/a|\/div)>/);
//    var year = match[2].match(/>Год.*?>([^"]+)<(br|\/span|\/li|\/a|\/div)>/);
    try {
      year = year[1];
      year = year.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      year = '';
    }
//    year = showtime.entityDecode(year);
//    year = unescape(year);
//    year = decodeURIComponent(year);
*/
    var country = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />Страна.*?>(.*?)<(br|\/span|\/li)>/},
        {wh: match[2], th: />Страна.*?>(.*?)<\/div>/},
        {wh: match[2], th: />Страна.*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        country = expressions[i].wh.match(expressions[i].th);
        if (country) {
          country = country[1];
          break;
        }
      }
      country = country.replace(/(<.*?>|<br>)/g, '').trim();
      country = country.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      country = '';
    }
//    country = showtime.entityDecode(country);
//    country = unescape(country);
//    country = decodeURIComponent(country);
/*
//    var country = match[2].match(/>Страна.*?>([\S\s]*?)<(br|\/span|\/li|\/div)>/);
    var country = match[2].match(/>Страна.*?>(.*?)<(br|\/span|\/li|\/div)>/);
//    var country = match[2].match(/>Страна.*?>([^"]+)<(br|\/span|\/li|\/div)>/);
    try {
      country = country[1];
      country = country.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      country = '';
    }
//    country = showtime.entityDecode(country);
//    country = unescape(country);
//    country = decodeURIComponent(country);
*/
    var description = void(0);
    try {
      var expressions = [
        {wh: match[2], th: /<div id="news-id-.*?>(.*?)<\/div>/},
        {wh: match[2], th: /<div class=".*?desc.*?>(.*?)<\/div>/},
        {wh: match[2], th: /<div class=".*?desc.*?>([\S\s]*?)<\/div>/},
        {wh: match[2], th: /<!--noindex-->(.*?)<br>/},
        {wh: match[2], th: /<!--noindex-->([\S\s]*?)<br>/},
        {wh: match[2], th: /<br>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        description = expressions[i].wh.match(expressions[i].th);
        if (description) {
          description = description[1];
          break;
        }
      }
      description = description.replace(/(<.*?>|<br>|Описание:)/g, '').trim();
      description = description.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      description = '';
    }
//    description = showtime.entityDecode(description);
//    description = unescape(description);
//    description = decodeURIComponent(description);
/*
//    var x1description = match[2].match(/<div id="news-id-.*?>(.*?)<\/div>/);
//    var x1description = match[2].match(/<div id="news-id-.*?>([^"]+)<\/div>/);
//    var x1description = match[2].match(/<div class=".*?desc.*?>([\S\s]*?)<\/div>/);
//    var x1description = match[2].match(/<div class=".*?desc.*?>(.*?)<\/div>/);
//    var x1description = match[2].match(/<!--noindex-->([\S\s]*?)<br>/);
//    var x1description = match[2].match(/<!--noindex-->(.*?)<br>/);
    var x1description = match[2].match(/<br>([\S\s]*?)<br>/);
    try {
      x1description = x1description[1];
      x1description = x1description.replace(/(<.*?>|<br>|Описание:)/g, '').trim();
      x1description = x1description.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
//      x1description = description;
//      x1description = xdescription;
//      x1description = x0description;
      x1description = '';
    }
//    x1description = showtime.entityDecode(x1description);
//    x1description = unescape(x1description);
//    x1description = decodeURIComponent(x1description);
//    var x0description = match[2].match(/<div id="news-id-.*?>(.*?)<\/div>/);
//    var x0description = match[2].match(/<div id="news-id-.*?>([^"]+)<\/div>/);
//    var x0description = match[2].match(/<div class=".*?desc.*?>([\S\s]*?)<\/div>/);
//    var x0description = match[2].match(/<div class=".*?desc.*?>(.*?)<\/div>/);
    var x0description = match[2].match(/<!--noindex-->([\S\s]*?)<br>/);
//    var x0description = match[2].match(/<!--noindex-->(.*?)<br>/);
//    var x0description = match[2].match(/<br>([\S\s]*?)<br>/);
    try {
      x0description = x0description[1];
      x0description = x0description.replace(/(<.*?>|<br>|Описание:)/g, '').trim();
      x0description = x0description.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
//      x0description = description;
//      x0description = xdescription;
      x0description = x1description;
//      x0description = '';
    }
//    x0description = showtime.entityDecode(x0description);
//    x0description = unescape(x0description);
//    x0description = decodeURIComponent(x0description);
//    var xdescription = match[2].match(/<div id="news-id-.*?>(.*?)<\/div>/);
//    var xdescription = match[2].match(/<div id="news-id-.*?>([^"]+)<\/div>/);
    var xdescription = match[2].match(/<div class=".*?desc.*?>([\S\s]*?)<\/div>/);
//    var xdescription = match[2].match(/<div class=".*?desc.*?>(.*?)<\/div>/);
//    var xdescription = match[2].match(/<!--noindex-->([\S\s]*?)<br>/);
//    var xdescription = match[2].match(/<!--noindex-->(.*?)<br>/);
//    var xdescription = match[2].match(/<br>([\S\s]*?)<br>/);
    try {
      xdescription = xdescription[1];
      xdescription = xdescription.replace(/(<.*?>|<br>|Описание:)/g, '').trim();
      xdescription = xdescription.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
//      xdescription = description;
      xdescription = x0description;
//      xdescription = x1description;
//      xdescription = '';
    }
//    xdescription = showtime.entityDecode(xdescription);
//    xdescription = unescape(xdescription);
//    xdescription = decodeURIComponent(xdescription);
    var description = match[2].match(/<div id="news-id-.*?>(.*?)<\/div>/);
//    var description = match[2].match(/<div id="news-id-.*?>([^"]+)<\/div>/);
//    var description = match[2].match(/<div class=".*?desc.*?>([\S\s]*?)<\/div>/);
//    var description = match[2].match(/<div class=".*?desc.*?>(.*?)<\/div>/);
//    var description = match[2].match(/<!--noindex-->([\S\s]*?)<br>/);
//    var description = match[2].match(/<!--noindex-->(.*?)<br>/);
//    var description = match[2].match(/<br>([\S\s]*?)<br>/);
    try {
      description = description[1];
      description = description.replace(/(<.*?>|<br>|Описание:)/g, '').trim();
      description = description.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      description = xdescription;
//      description = x0description;
//      description = x1description;
//      description = '';
    }
//    description = showtime.entityDecode(description);
//    description = unescape(description);
//    description = decodeURIComponent(description);
*/
    var slogan = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />Слоган.*?>(.*?)<(br|\/span|\/li|\/a)>/},
        {wh: match[2], th: />Слоган.*?>(.*?)<\/div>/},
        {wh: match[2], th: />Слоган.*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        slogan = expressions[i].wh.match(expressions[i].th);
        if (slogan) {
          slogan = slogan[1];
          break;
        }
      }
      slogan = slogan.replace(/(<.*?>|<br>)/g, '').trim();
      slogan = slogan.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      slogan = '';
    }
//    slogan = showtime.entityDecode(slogan);
//    slogan = unescape(slogan);
//    slogan = decodeURIComponent(slogan);
/*
//    var slogan = match[2].match(/>Слоган.*?>([\S\s]*?)<(br|\/span|\/li|\/a|\/div)>/);
    var slogan = match[2].match(/>Слоган.*?>(.*?)<(br|\/span|\/li|\/a|\/div)>/);
//    var slogan = match[2].match(/>Слоган.*?>([^"]+)<(br|\/span|\/li|\/a|\/div)>/);
    try {
      slogan = slogan[1];
      slogan = slogan.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      slogan = '';
    }
//    slogan = showtime.entityDecode(slogan);
//    slogan = unescape(slogan);
//    slogan = decodeURIComponent(slogan);
*/
    var genre = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />Жанр.*?>(.*?)<(br|\/span|\/li)>/},
        {wh: match[2], th: />Жанр.*?>(.*?)<\/div>/},
        {wh: match[2], th: />Жанр.*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        genre = expressions[i].wh.match(expressions[i].th);
        if (genre) {
          genre = genre[1];
          break;
        }
      }
      genre = genre.replace(/(<.*?>|<br>)/g, '').trim();
      genre = genre.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      genre = '';
    }
//    genre = showtime.entityDecode(genre);
//    genre = unescape(genre);
//    genre = decodeURIComponent(genre);
/*
//    var genre = match[2].match(/>Жанр.*?>([\S\s]*?)<(br|\/span|\/li|\/div)>/);
    var genre = match[2].match(/>Жанр.*?>(.*?)<(br|\/span|\/li|\/div)>/);
//    var genre = match[2].match(/>Жанр.*?>([^"]+)<(br|\/span|\/li|\/div)>/);
    try {
      genre = genre[1];
      genre = genre.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      genre = '';
    }
//    genre = showtime.entityDecode(genre);
//    genre = unescape(genre);
//    genre = decodeURIComponent(genre);
*/
    var director = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />Режисс.*?>(.*?)<(br|\/span|\/li)>/},
        {wh: match[2], th: />Режисс.*?>(.*?)<\/div>/},
        {wh: match[2], th: />Режисс.*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        director = expressions[i].wh.match(expressions[i].th);
        if (director) {
          director = director[1];
          break;
        }
      }
      director = director.replace(/(<.*?>|<br>)/g, '').trim();
      director = director.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      director = '';
    }
//    director = showtime.entityDecode(director);
//    director = unescape(director);
//    director = decodeURIComponent(director);
/*
//    var director = match[2].match(/>Режисс.*?>([\S\s]*?)<(br|\/span|\/li|\/div)>/);
    var director = match[2].match(/>Режисс.*?>(.*?)<(br|\/span|\/li|\/div)>/);
//    var director = match[2].match(/>Режисс.*?>([^"]+)<(br|\/span|\/li|\/div)>/);
    try {
      director = director[1];
      director = director.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      director = '';
    }
//    director = showtime.entityDecode(director);
//    director = unescape(director);
//    director = decodeURIComponent(director);
*/
    var actor = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />В ролях.*?>(.*?)<(br|\/span|\/li)>/},
        {wh: match[2], th: />В ролях.*?>(.*?)<\/div>/},
        {wh: match[2], th: />В ролях.*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        actor = expressions[i].wh.match(expressions[i].th);
        if (actor) {
          actor = actor[1];
          break;
        }
      }
      actor = actor.replace(/(<.*?>|<br>)/g, '').trim();
      actor = actor.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      actor = '';
    }
//    actor = showtime.entityDecode(actor);
//    actor = unescape(actor);
//    actor = decodeURIComponent(actor);
/*
//    var actor = match[2].match(/>В ролях.*?>([\S\s]*?)<(br|\/span|\/li|\/div)>/);
    var actor = match[2].match(/>В ролях.*?>(.*?)<(br|\/span|\/li|\/div)>/);
//    var actor = match[2].match(/>В ролях.*?>([^"]+)<(br|\/span|\/li|\/div)>/);
    try {
      actor = actor[1];
      actor = actor.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      actor = '';
    }
//    actor = showtime.entityDecode(actor);
//    actor = unescape(actor);
//    actor = decodeURIComponent(actor);
*/
    var translation = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />(Озвучка|Перевод).*?>(.*?)<(br|\/span|\/li)>/},
        {wh: match[2], th: />(Озвучка|Перевод).*?>(.*?)<\/div>/},
        {wh: match[2], th: />(Озвучка|Перевод).*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        translation = expressions[i].wh.match(expressions[i].th);
        if (translation) {
          translation = translation[2];
          break;
        }
      }
      translation = translation.replace(/(<.*?>|<br>)/g, '').trim();
      translation = translation.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      translation = '';
    }
//    translation = showtime.entityDecode(translation);
//    translation = unescape(translation);
//    translation = decodeURIComponent(translation);
/*
//    var translation = match[2].match(/>(Озвучка|Перевод).*?>([\S\s]*?)<(br|\/span|\/li|\/div)>/);
    var translation = match[2].match(/>(Озвучка|Перевод).*?>(.*?)<(br|\/span|\/li|\/div)>/);
//    var translation = match[2].match(/>(Озвучка|Перевод).*?>([^"]+)<(br|\/span|\/li|\/div)>/);
    try {
      translation = translation[2];
      translation = translation.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      translation = '';
    }
//    translation = showtime.entityDecode(translation);
//    translation = unescape(translation);
//    translation = decodeURIComponent(translation);
*/
    var type = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />Качество.*?>(.*?)<(br|\/span|\/li|\/a)>/},
        {wh: match[2], th: />Качество.*?>(.*?)<\/div>/},
        {wh: match[2], th: />Качество.*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        type = expressions[i].wh.match(expressions[i].th);
        if (type) {
          type = type[1];
          break;
        }
      }
      type = type.replace(/(<.*?>|<br>)/g, '').trim();
      type = type.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      type = '';
    }
//    type = showtime.entityDecode(type);
//    type = unescape(type);
//    type = decodeURIComponent(type);
/*
//    var type = match[2].match(/>Качество.*?>([\S\s]*?)<(br|\/span|\/li|\/a|\/div)>/);
    var type = match[2].match(/>Качество.*?>(.*?)<(br|\/span|\/li|\/a|\/div)>/);
//    var type = match[2].match(/>Качество.*?>([^"]+)<(br|\/span|\/li|\/a|\/div)>/);
    try {
      type = type[1];
      type = type.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
//      type = quality;
      type = '';
    }
//    type = showtime.entityDecode(type);
//    type = unescape(type);
//    type = decodeURIComponent(type);
*/
    var quality = match[2].match(/quality.*?>(.*?)<\/(div|span)>/);
//    var quality = match[2].match(/quality.*?>([^"]+)<\/(div|span)>/);
    try {
      quality = quality[1];
      quality = quality.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      quality = type;
//      quality = '';
    }
//    quality = showtime.entityDecode(quality);
//    quality = unescape(quality);
//    quality = decodeURIComponent(quality);
    var logoquality;
//    logoquality = LOGOHD;
    if (/720/.test(quality)) {
      logoquality = LOGO720;
    }
    else if (/1080/.test(quality)) {
      logoquality = LOGO1080;
    }
    else if (/2160/.test(quality)) {
      logoquality = LOGO4K;
    }
    else {
      logoquality = LOGONONE;
//      logoquality = LOGOHD;
    }
    var backdrops = [];
    try {
      backdrops.push({url: icon});
//      backdrops.push({url: xicon});
//      backdrops.push({url: x0icon});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: logoquality});
    }
    catch (err) {
//      backdrops.push({url: icon});
//      backdrops.push({url: xicon});
//      backdrops.push({url: x0icon});
      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: logoquality});
//      backdrops.push({url: ''});
    }
    var duration = void(0);
    try {
      var expressions = [
        {wh: match[2], th: />Продолжительность.*?>(.*?)<(br|\/span|\/li)>/},
        {wh: match[2], th: />Продолжительность.*?>(.*?)<\/div>/},
        {wh: match[2], th: />Продолжительность.*?>([\S\s]*?)<br>/},
      ],
      i, length = expressions.length;
      for (i = 0; i < length; i++) {
        duration = expressions[i].wh.match(expressions[i].th);
        if (duration) {
          duration = duration[1];
          break;
        }
      }
      duration = duration.replace(/(<.*?>|<br>)/g, '').trim();
      duration = duration.replace(/(    |   |  )/g, ' ').trim();
    }
    catch (err) {
      duration = '';
    }
//    duration = showtime.entityDecode(duration);
//    duration = unescape(duration);
//    duration = decodeURIComponent(duration);
/*
//    var duration = match[2].match(/>Продолжительность.*?>([\S\s]*?)<(br|\/span|\/li|\/div)>/);
    var duration = match[2].match(/>Продолжительность.*?>(.*?)<(br|\/span|\/li|\/div)>/);
//    var duration = match[2].match(/>Продолжительность.*?>([^"]+)<(br|\/span|\/li|\/div)>/);
    try {
      duration = duration[1];
      duration = duration.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      duration = '';
    }
//    duration = showtime.entityDecode(duration);
//    duration = unescape(duration);
//    duration = decodeURIComponent(duration);
*/
    var kinopoisk = match[2].match(/(КП:|>КП|>KP|"KP">)(.*?)<\//);
//    var kinopoisk = match[2].match(/(КП:|>КП|>KP|"KP">)([^"]+)<\//);
    try {
      kinopoisk = kinopoisk[2];
      kinopoisk = kinopoisk.replace(/(<.*?>|-| )/g, '').trim();
//      kinopoisk = kinopoisk.replace(/,/g, '.').trim();
    }
    catch (err) {
//      kinopoisk = 0;
      kinopoisk = '';
    }
//    kinopoisk = showtime.entityDecode(kinopoisk);
//    kinopoisk = unescape(kinopoisk);
//    kinopoisk = decodeURIComponent(kinopoisk);
    var IMDB = match[2].match(/(IMDB:|>IMBD|>IMDB|"IMDB">)(.*?)<\//);
//    var IMDB = match[2].match(/(IMDB:|>IMBD|>IMDB|"IMDB">)([^"]+)<\//);
    try {
      IMDB = IMDB[2];
      IMDB = IMDB.replace(/(<.*?>|-| )/g, '').trim();
//      IMDB = IMDB.replace(/,/g, '.').trim();
    }
    catch (err) {
//      IMDB = 0;
      IMDB = '';
    }
//    IMDB = showtime.entityDecode(IMDB);
//    IMDB = unescape(IMDB);
//    IMDB = decodeURIComponent(IMDB);
    var KGO = match[2].match(/>KGO(.*?)<\//);
//    var KGO = match[2].match(/>KGO([^"]+)<\//);
    try {
      KGO = KGO[1];
      KGO = KGO.replace(/(<.*?>|-| )/g, '').trim();
//      KGO = KGO.replace(/,/g, '.').trim();
    }
    catch (err) {
//      KGO = 0;
      KGO = '';
    }
//    KGO = showtime.entityDecode(KGO);
//    KGO = unescape(KGO);
//    KGO = decodeURIComponent(KGO);
//    var rating = match[2].match(/<li.*?class="current-rating" style=".*?">(.*?)<\/li>/);
    var rating = match[2].match(/class="current-rating".*?>(.*?)<\/li>/);
//    var rating = match[2].match(/class="current-rating".*?>([^"]+)<\/li>/);
    try {
      rating = rating[1];
//      rating = rating.replace(/(<.*?>|-)/g, '').trim();
      rating = rating.replace(/,/g, '.').trim();
    }
    catch (err) {
      if (!KGO) {
//        rating = 10 * IMDB;
        rating = 10 * IMDB.replace(/,/g, '.').trim();
      }
      else if (!IMDB) {
//        rating = 10 * kinopoisk;
        rating = 10 * kinopoisk.replace(/,/g, '.').trim();
      }
      else {
//        rating = 10 * KGO;
        rating = 10 * KGO.replace(/,/g, '.').trim();
      }
//      rating = 10 * kinopoisk;
//      rating = 10 * kinopoisk.replace(/,/g, '.').trim();
//      rating = 10 * IMDB;
//      rating = 10 * IMDB.replace(/,/g, '.').trim();
//      rating = 10 * KGO;
//      rating = 10 * KGO.replace(/,/g, '.').trim();
//      rating = 0;
//      rating = '';
    }
//    rating = showtime.entityDecode(rating);
//    rating = unescape(rating);
//    rating = decodeURIComponent(rating);
    var xrating = match[2].match(/<span class="ratingtypeplusminus.*?>(.*?)<\/span>/);
//    var xrating = match[2].match(/<span class="ratingtypeplusminus.*?>([^"]+)<\/span>/);
    try {
      xrating = xrating[1];
      if (/\+/.test(xrating)) {
        xrating = coloredStr(xrating, green);
      }
      else if (/-/.test(xrating)) {
        xrating = coloredStr(xrating, red);
      }
      else {
        xrating = coloredStr(xrating, yellow);
      }
    }
    catch (err) {
//      xrating = 0;
      xrating = '';
    }
//    xrating = showtime.entityDecode(xrating);
//    xrating = unescape(xrating);
//    xrating = decodeURIComponent(xrating);
/*
    var serie = match[2].match(/<div class="cont">(.*?)<\/div>/);
//    var serie = match[2].match(/<div class="cont">([^"]+)<\/div>/);
    try {
      serie = serie[1];
      serie = serie.replace(/<.*?>/g, '').trim();
    }
    catch (err) {
      serie = '';
    }
//    serie = showtime.entityDecode(serie);
//    serie = unescape(serie);
//    serie = decodeURIComponent(serie);
*/
//    var name = 'Смотрите также';
    var name = doc.match(/<div class="frels-title">(.*?)<\/div>/);
//    var name = doc.match(/<div class="frels-title">([^"]+)<\/div>/);
    try {
      name = name[1];
      name = name.replace(/:/g, '').trim();
      if (/[^"]+/.test(name)) {
        name = name;
      }
      else {
        name = 'Смотрите также';
//        name = '';
      }
    }
    catch (err) {
      name = 'Смотрите также';
//      name = '';
    }
//    name = showtime.entityDecode(name);
//    name = unescape(name);
//    name = decodeURIComponent(name);
    if (section && page.entries == 0)
    page.appendItem('', 'separator', {
//      title: new showtime.RichText('Смотрите также:'),
//      title: new RichText('Смотрите также:'),
//      title: new showtime.RichText(name ? name + ':' : ''),
      title: new RichText(name ? name + ':' : ''),
    });
    var uri;
    uri = PREFIX + ':moviepage:' + url + '~' + title + '~' + icon;
//    uri = PREFIX + ':moviepage:' + escape(url) + '~' + escape(title) + '~' + escape(icon);
//    uri = PREFIX + ':moviepage:' + encodeURIComponent(url) + '~' + encodeURIComponent(title) + '~' + encodeURIComponent(icon);
//    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
      title: new RichText(title),
      icon: icon,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: logoquality,
//      icon: '',
      backdrops: backdrops,
//      genre: new showtime.RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//      genre: new RichText(actor ? coloredStr('Актеры: ', gray) + actor : ''),
//      genre: new showtime.RichText(quality ? quality : ''),
//      genre: new RichText(quality ? quality : ''),
//      genre: new showtime.RichText(quality ? coloredStr(quality, orange) : ''),
//      genre: new RichText(quality ? coloredStr(quality, orange) : ''),
//      genre: new showtime.RichText(serie ? serie : ''),
//      genre: new RichText(serie ? serie : ''),
//      genre: new showtime.RichText(serie ? coloredStr(serie, orange) : ''),
//      genre: new RichText(serie ? coloredStr(serie, orange) : ''),
//      genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//      genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//      genre: new showtime.RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new RichText((kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new showtime.RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//      genre: new RichText((serie ? coloredStr(serie, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + '<br>' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) + '<br>' : '') + (xrating ? xrating : '')),
//      genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//      genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//      genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//      genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + ' ' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (type ? coloredStr(type, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (type ? coloredStr('Тип: ', gray) + coloredStr(type, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//      genre: new showtime.RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
      genre: new RichText((duration ? coloredStr(duration, blue) + coloredStr(' * ', gray) : '') + (quality ? coloredStr(quality, blue) : '') + '<br>' + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (xrating ? xrating : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (quality ? coloredStr('Качество: ', gray) + coloredStr(quality, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (rating ? coloredStr('Рейтинг: ', gray) + coloredStr(rating, gray) : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '') + '<br>' + (rating ? coloredStr(rating, gray) : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (translation ? coloredStr(translation, blue) + '<br>' : '') + (kinopoisk ? coloredStr('Кинопоиск: ', gray) + coloredStr(kinopoisk, yellow) + ' ' : '') + (IMDB ? coloredStr('IMDB: ', gray) + coloredStr(IMDB, yellow) : '')),
      rating: rating ? 1 * rating : void(0),
//      rating: 1 * rating,
//      source: new showtime.RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//      source: new RichText(director ? coloredStr('Режиссер: ', gray) + director : ''),
//      source: new showtime.RichText(translation ? translation : ''),
//      source: new RichText(translation ? translation : ''),
//      source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//      source: new RichText(translation ? coloredStr(translation, blue) : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      source: new showtime.RichText(genre ? coloredStr(genre, orange) : ''),
//      source: new RichText(genre ? coloredStr(genre, orange) : ''),
//      source: new showtime.RichText(country ? country : ''),
//      source: new RichText(country ? country : ''),
//      source: new showtime.RichText(country ? coloredStr(country , orange) : ''),
//      source: new RichText(country ? coloredStr(country, orange) : ''),
//      source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//      source: new RichText(country ? coloredStr('Страна: ', gray) + country : ''),
//      source: new showtime.RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//      source: new RichText(country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : ''),
//      source: new showtime.RichText(year ? year : ''),
//      source: new RichText(year ? year : ''),
//      source: new showtime.RichText(year ? coloredStr(year, orange) : ''),
//      source: new RichText(year ? coloredStr(year, orange) : ''),
//      source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//      source: new RichText((year ? coloredStr('Год выхода: ', gray) + year + ' ' : '') + (country ? coloredStr('Страна: ', gray) + country : '')),
//      source: new showtime.RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//      source: new RichText((year ? coloredStr('Год выхода: ', gray) + coloredStr(year, orange) + ' ' : '') + (country ? coloredStr('Страна: ', gray) + coloredStr(country, orange) : '')),
//      source: new showtime.RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
      source: new RichText((year ? coloredStr(year, orange) + ' ' : '') + (country ? coloredStr(country, orange) : '')),
//      source: new showtime.RichText((country ? country + ', ' : '') + (year ? year : '')),
//      source: new RichText((country ? country + ', ' : '') + (year ? year : '')),
//      source: new showtime.RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//      source: new RichText((country ? coloredStr(country + ', ', orange) : '') + (year ? coloredStr(year, orange) : '')),
//      tagline: new showtime.RichText(coloredStr(title, gray)),
      tagline: new RichText(coloredStr(title, gray)),
//      tagline: new showtime.RichText(genre ? coloredStr(genre, gray) : ''),
//      tagline: new RichText(genre ? coloredStr(genre, gray) : ''),
//      description: new showtime.RichText(coloredStr(title, gray)),
//      description: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(genre ? genre : ''),
//      description: new RichText(genre ? genre : ''),
//      description: new showtime.RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//      description: new RichText(genre ? coloredStr('Жанр: ', gray) + genre : ''),
//      description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText(description ? description : ''),
//      description: new RichText(description ? description : ''),
//      description: new showtime.RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//      description: new RichText(description ? coloredStr('Описание: ', gray) + description : ''),
//      description: new showtime.RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//      description: new RichText((title ? coloredStr('Название: ', gray) + title + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//      description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//      description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//      description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//      description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan : '')),
//      description: new showtime.RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
      description: new RichText((genre ? coloredStr('Жанр: ', gray) + genre + '<br>' : '') + (slogan ? coloredStr('Слоган: ', gray) + slogan + '<br>' : '') + (description ? coloredStr('Описание: ', gray) + description : '')),
//      description: new showtime.RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
//      description: new RichText((director ? coloredStr('Режиссер: ', gray) + director + '<br>' : '') + (actor ? coloredStr('Актеры: ', gray) + actor : '')),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
/*
//function scraperplaylist(page, doc) {
function scraperplaylist(page, doc, title, icon) {
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
//~
};
*/
//function scrapercdnlandseries(page, doc) {
function scrapercdnlandseries(page, doc, title, icon, poster, translationid) {
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
//  poster = showtime.entityDecode(poster);
//  poster = unescape(poster);
//  poster = decodeURIComponent(poster);
//  translationid = showtime.entityDecode(translationid);
//  translationid = unescape(translationid);
//  translationid = decodeURIComponent(translationid);
//  var re = /\{\\&quot;id\\&quot;:\\&quot;([\s\S]*?)\\&quot;,\\&quot;comment\\&quot;:\\&quot;([\s\S]*?)&lt;br&gt;&lt;i&gt;([\s\S]*?)&lt;\\\\\\\/i&gt;\\&quot;,\\&quot;file\\&quot;:\\&quot;([\s\S]*?)poster\\&quot;:\\&quot;([\s\S]*?)\\&quot;\}/g;
//  var re = /\{\\&quot;id(.*?)comment\\&quot;:\\&quot;(.*?)&lt;br&gt;&lt;i&gt;(.*?)&lt;\\\\\\\/i&gt;\\&quot;,\\&quot;file\\&quot;:\\&quot;(.*?)poster\\&quot;:\\&quot;(.*?)\\&quot;\}/g;
//  var re = /id\\&quot;:\\&quot;(.*?)\\&quot;,\\&quot;comment\\&quot;:\\&quot;(.*?) (.*?)file\\&quot;:\\&quot;(.*?)poster\\&quot;:\\&quot;(.*?)\\&quot;\}/g;
//  var re = /id(.*?)comment(.*?) .*?i&gt;(.*?)&lt;.*?file(.*?)poster\\&quot;:\\&quot;(.*?)\\&quot;\}/g;
//  var re = /id([^"]+)comment([^"]+) .*?i&gt;([^"]+)&lt;.*?file([^"]+)poster\\&quot;:\\&quot;([^"]+)\\&quot;\}/g;
//  var re = /id(.*?)comment(.*?) (.*?)file(.*?)\\&quot;\}/g;
//  var re = /id([^"]+)comment([^"]+) ([^"]+)file([^"]+)\\&quot;\}/g;
  var re = /\{"id":"(.*?)","comment":"(.*?) (.*?)"file":"(\.*?)("download"|\}\})/g;
//  var re = /\{"id":"([^"]+)","comment":"([^"]+) ([^"]+)"file":"([^"]+)("download"|\}\})/g;
  var match = re.exec(doc);

  // Collect all seasons first to sort deterministically by season number
  var seasons = [];
  while (match) {
    // Extract season identifier
    var season = '';
    try {
      season = match[1];
      season = season.replace(/(_.*)/g, '').trim();
    } catch (err) { season = ''; }

    // Extract season label (often contains "Сезон N" or episode range)
    var serie = '';
    try {
      serie = match[2];
      serie = serie.replace(/(:|,|\"|\\&quot;)/g, '').trim();
    } catch (err) { serie = ''; }

    // Extract translation from italic tag
    var translationMatch = null;
    var translation = '';
    try {
      translationMatch = match[3].match(/<i>(.*?)<\\\/i>/);
      translation = translationMatch ? translationMatch[1] : '';
    } catch (err) { translation = ''; }

    // Normalize translation via JSON escape/unescape roundtrip (kept from original)
    translation = escape(translation);
    translation = { translation: translation ? translation : void(0) };
    translation = JSON.stringify(translation);
    translation = unescape(translation);
    translation = JSON.parse(translation);
    translation = translation.translation;

    // Extract poster within this block
    var posterMatch = match[4].match(/"poster":"(.*?)"/);
    var seasonPoster = icon;
    try {
      seasonPoster = posterMatch[1].replace(/\\\//g, '/').trim();
      if (/http.*?:\/\//.test(seasonPoster)) {
        // keep as is
      } else if (/\/\//.test(seasonPoster)) {
        seasonPoster = HTTPS + seasonPoster.replace(/(http:|https:|\/\/)/g, '').trim();
      } else {
        seasonPoster = HTTPS + BASE_URL + seasonPoster;
      }
      if (!/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(seasonPoster)) {
        seasonPoster = icon;
      }
    } catch (err) {
      seasonPoster = icon;
    }

    // Compute numeric season for sorting.
    // 1) Prefer an explicit "Сезон N" (or English "Season N") pattern in the label to avoid
    //    accidentally picking up episode numbers like "1-13".
    // 2) Fallback to the first digits found in the id if the explicit pattern is absent.
    var seasonNum = 0;
    var seasonFromLabel = null;
    try {
      // Try "Сезон 12" or "Season 12"
      seasonFromLabel = (serie || '').match(/(?:Сезон|Season)\s*(\d{1,3})/i);
      if (!seasonFromLabel) {
        // Try "12 сезон" or "12 season"
        seasonFromLabel = (serie || '').match(/(\d{1,3})\s*(?:сезон|season)/i);
      }
    } catch (e) { seasonFromLabel = null; }
    if (seasonFromLabel && seasonFromLabel[1]) {
      seasonNum = parseInt(seasonFromLabel[1], 10);
    } else {
      // Try to extract from id forms like s12, season_12, sezon-12, сезон12
      var idForm = (season || '').match(/(?:season|sezon|сезон|s)[_\s-]*?(\d{1,3})/i);
      if (idForm && idForm[1]) {
        seasonNum = parseInt(idForm[1], 10);
      } else {
        // As a last resort, drop ranges like "1-13" and pick a standalone number
        var cleanedSerie = (serie || '').replace(/\d+\s*[-–—]\s*\d+/g, '');
        var lone = cleanedSerie.match(/(?:^|\D)(\d{1,3})(?:\D|$)/);
        seasonNum = lone && lone[1] ? parseInt(lone[1], 10) : 0;
      }
    }

    try { dlog('CDNLAND series: label="' + (serie||'') + '", id="' + (season||'') + '", seasonNum=' + seasonNum); } catch (e) {}

    seasons.push({
      season: season,
      seasonNum: isNaN(seasonNum) ? 0 : seasonNum,
      serie: serie,
      translation: translation,
      posterBlock: match[4],
      seasonPoster: seasonPoster,
      index: seasons.length
    });

    match = re.exec(doc);
  }

  // Sort seasons by numeric value ascending; keep stable order when numbers equal
  seasons.sort(function(a, b) {
    if (a.seasonNum !== b.seasonNum) return a.seasonNum - b.seasonNum;
    return a.index - b.index;
  });

  // Append in sorted order
  for (var i = 0; i < seasons.length; i++) {
    var s = seasons[i];
    page.appendItem('', 'separator', {
      title: new RichText('Сезон ' + (s.season ? s.season : '') + ' | Серия ' + (s.serie ? s.serie : '') + (s.translation ? ' [' + s.translation + ']' : '')),
    });
    scrapercdnland(page, s.posterBlock, title, icon, s.seasonPoster, translationid, s.season, s.serie, s.translation);
    page.entries++;
  }
};
//function scrapercdnland(page, doc) {
function scrapercdnland(page, doc, title, icon, poster, translationid, season, serie, translation) {
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
//  poster = showtime.entityDecode(poster);
//  poster = unescape(poster);
//  poster = decodeURIComponent(poster);
//  translationid = showtime.entityDecode(translationid);
//  translationid = unescape(translationid);
//  translationid = decodeURIComponent(translationid);
//  season = showtime.entityDecode(season);
//  season = unescape(season);
//  season = decodeURIComponent(season);
//  serie = showtime.entityDecode(serie);
//  serie = unescape(serie);
//  serie = decodeURIComponent(serie);
//  translation = showtime.entityDecode(translation);
//  translation = unescape(translation);
//  translation = decodeURIComponent(translation);
//  var re = /\[(.*?)\](.*?)(\?| )/g;
//  var re = /\[([^"]+)\]([^"]+)(\?| )/g;
//  var re = /\[(.*?)\](.*?)\.mp4/g;
//  var re = /\[([^"]+)\]([^"]+)\.mp4/g;
  var re = /\[(.*?)\](.*?\.mp4)/g;
//  var re = /\[([^"]+)\]([^"]+\.mp4)/g;
  var match = re.exec(doc);
  while (match) {
//    var qualityname = match[2].match(/\/(.*?)\.mp4/);
//    var qualityname = match[2].match(/\/([^"]+)\.mp4/);
    try {
      var qualityname = match[1];
//      qualityname = qualityname[1];
    }
    catch (err) {
//      qualityname = coloredStr('Неопределенное', red);
      qualityname = '';
    }
//    qualityname = showtime.entityDecode(qualityname);
//    qualityname = unescape(qualityname);
//    qualityname = decodeURIComponent(qualityname);
    try {
      var qualityurl = match[2];
//      qualityurl = qualityurl.replace(/(\\\\\\\/\\\\\\\/|\\\/\\\/|\\)/g, '').trim();
      qualityurl = qualityurl.replace(/\\\//g, '/').trim();
      if (/http.*?:\/\//.test(qualityurl)) {
        qualityurl = qualityurl;
//        qualityurl = qualityurl + '.mp4';
      }
      else if (/\/\//.test(qualityurl)) {
        qualityurl = HTTPS + qualityurl.replace(/(http:|https:|\/\/)/g, '').trim();
//        qualityurl = HTTPS + qualityurl.replace(/(http:|https:|\/\/)/g, '').trim() + '.mp4';
      }
      else {
        qualityurl = HTTPS + BASE_URL + qualityurl;
//        qualityurl = HTTPS + BASE_URL + qualityurl + '.mp4';
      }
    }
    catch (err) {
      qualityurl = '';
    }
//    qualityurl = showtime.entityDecode(qualityurl);
//    qualityurl = unescape(qualityurl);
//    qualityurl = decodeURIComponent(qualityurl);
    var logoquality;
//    logoquality = LOGOHD;
    if (/720/.test(qualityname)) {
      logoquality = LOGO720;
    }
    else if (/1080/.test(qualityname)) {
      logoquality = LOGO1080;
    }
    else if (/2160/.test(qualityname)) {
      logoquality = LOGO4K;
    }
    else {
      logoquality = LOGONONE;
//      logoquality = LOGOHD;
    }
    var backdrops = [];
    try {
//      backdrops.push({url: icon});
      backdrops.push({url: poster});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
    }
    catch (err) {
      backdrops.push({url: icon});
//      backdrops.push({url: poster});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: ''});
    }
    var uri;
    uri = qualityurl;
//    uri = escape(qualityurl);
//    uri = encodeURIComponent(qualityurl);
//    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
//      title: new RichText(title),
//      title: new showtime.RichText(qualityname),
      title: new RichText(qualityname),
      icon: icon,
//      icon: poster,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: logoquality,
//      icon: '',
      backdrops: backdrops,
//      genre: new showtime.RichText((season ? season + ' / ' : '') + (serie ? serie : '')),
//      genre: new RichText((season ? season + ' / ' : '') + (serie ? serie : '')),
//      genre: new showtime.RichText((season ? coloredStr(season + ' / ', orange) : '') + (serie ? coloredStr(serie, orange) : '')),
//      genre: new RichText((season ? coloredStr(season + ' / ', orange) : '') + (serie ? coloredStr(serie, orange) : '')),
//      genre: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie : '')),
//      genre: new RichText((season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie : '')),
//      genre: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
      genre: new RichText((season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
//      source: new showtime.RichText(translationid ? translationid : ''),
//      source: new RichText(translationid ? translationid : ''),
//      source: new showtime.RichText(translationid ? coloredStr(translationid, blue) : ''),
//      source: new RichText(translationid ? coloredStr(translationid, blue) : ''),
//      source: new showtime.RichText(translationid ? coloredStr('Перевод: ', gray) + translationid : ''),
//      source: new RichText(translationid ? coloredStr('Перевод: ', gray) + translationid : ''),
//      source: new showtime.RichText(translationid ? coloredStr('Перевод: ', gray) + coloredStr(translationid, blue) : ''),
//      source: new RichText(translationid ? coloredStr('Перевод: ', gray) + coloredStr(translationid, blue) : ''),
//      source: new showtime.RichText(translation ? translation : ''),
//      source: new RichText(translation ? translation : ''),
//      source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
//      source: new RichText(translation ? coloredStr(translation, blue) : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      source: new showtime.RichText((translationid ? translationid : '') + (translation ? ' [' + translation + ']' : '')),
//      source: new RichText((translationid ? translationid : '') + (translation ? ' [' + translation + ']' : '')),
//      source: new showtime.RichText((translationid ? coloredStr(translationid, blue) : '') + (translation ? coloredStr(' [' + translation + ']', blue) : '')),
//      source: new RichText((translationid ? coloredStr(translationid, blue) : '') + (translation ? coloredStr(' [' + translation + ']', blue) : '')),
//      source: new showtime.RichText((translationid ? coloredStr('Перевод: ', gray) + translationid : '') + (translation ? ' [' + translation + ']' : '')),
//      source: new RichText((translationid ? coloredStr('Перевод: ', gray) + translationid : '') + (translation ? ' [' + translation + ']' : '')),
//      source: new showtime.RichText((translationid ? coloredStr('Перевод: ', gray) + coloredStr(translationid, blue) : '') + (translation ? coloredStr(' [' + translation + ']', blue) : '')),
      source: new RichText((translationid ? coloredStr('Перевод: ', gray) + coloredStr(translationid, blue) : '') + (translation ? coloredStr(' [' + translation + ']', blue) : '')),
//      tagline: new showtime.RichText(coloredStr(title, gray)),
      tagline: new RichText(coloredStr(title, gray)),
//      tagline: new showtime.RichText(coloredStr(qualityname, gray)),
//      tagline: new RichText(coloredStr(qualityname, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
//      description: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(qualityname ? coloredStr(qualityname, gray) : ''),
//      description: new RichText(qualityname ? coloredStr(qualityname, gray) : ''),
//      description: new showtime.RichText(qualityname ? coloredStr('Качество: ', gray) + qualityname : ''),
//      description: new RichText(qualityname ? coloredStr('Качество: ', gray) + qualityname : ''),
//      description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((qualityname ? coloredStr(qualityname, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText((qualityname ? coloredStr(qualityname, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translationid ? coloredStr('Перевод: ', gray) + translationid + '<br>' : '') + (qualityname ? coloredStr('Качество: ', gray) + qualityname : '')),
//      description: new RichText((season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translationid ? coloredStr('Перевод: ', gray) + translationid + '<br>' : '') + (qualityname ? coloredStr('Качество: ', gray) + qualityname : '')),
//      description: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '') + '<br>' + (qualityname ? coloredStr('Качество: ', gray) + qualityname : '')),
//      description: new RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '') + '<br>' + (qualityname ? coloredStr('Качество: ', gray) + qualityname : '')),
//      description: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translationid ? coloredStr('Перевод: ', gray) + translationid : '') + (translation ? ' [' + translation + ']' : '') + '<br>' + (qualityname ? coloredStr('Качество: ', gray) + qualityname : '')),
      description: new RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translationid ? coloredStr('Перевод: ', gray) + translationid : '') + (translation ? ' [' + translation + ']' : '') + '<br>' + (qualityname ? coloredStr('Качество: ', gray) + qualityname : '')),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
//function scrapertakedwn(page, doc) {
function scrapertakedwn(page, doc, title, icon, poster, season) {
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
//  poster = showtime.entityDecode(poster);
//  poster = unescape(poster);
//  poster = decodeURIComponent(poster);
//  season = showtime.entityDecode(season);
//  season = unescape(season);
//  season = decodeURIComponent(season);
/*
  var posters = doc.match(/"poster"/);
  if (posters) {
//    var re = /\{"episode":"([\s\S]*?)"[\s\S]*?"hls":"([\s\S]*?)","audio":\{"names":\[([\s\S]*?)\][\s\S]*?"duration":([\s\S]*?),"title":"([\s\S]*?)"[\s\S]*?"poster":"([\s\S]*?)"\}/g;
//    var re = /\{"episode":"(.*?)".*?"hls":"(.*?)\.m3u8","audio":\{"names":\[(.*?)\].*?"duration":(.*?),"title":"(.*?)".*?"poster":"(.*?)"\}/g;
    var re = /\{"episode":"(.*?)".*?"hls":"(.*?)","audio":\{"names":\[(.*?)\].*?"duration":(.*?),"title":"(.*?)".*?"poster":"(.*?)"\}/g;
//    var re = /\{"episode":"([^"]+)".*?"hls":"([^"]+)","audio":\{"names":\[([^"]+)\].*?"duration":([^"]+),"title":"([^"]+)".*?"poster":"([^"]+)"\}/g;
  }
  else {
//    re = /\{"episode":"([\s\S]*?)"[\s\S]*?"hls":"([\s\S]*?)","audio":\{"names":\[([\s\S]*?)\][\s\S]*?"duration":([\s\S]*?),"title":"([\s\S]*?)"([\s\S]*?)/g;
//    re = /\{"episode":"(.*?)".*?"hls":"(.*?)\.m3u8","audio":\{"names":\[(.*?)\].*?"duration":(.*?),"title":"(.*?)"(.*?)/g;
    re = /\{"episode":"(.*?)".*?"hls":"(.*?)","audio":\{"names":\[(.*?)\].*?"duration":(.*?),"title":"(.*?)"(.*?)/g;
//    re = /\{"episode":"([^"]+)".*?"hls":"([^"]+)","audio":\{"names":\[([^"]+)\].*?"duration":([^"]+),"title":"([^"]+)"([^"]+)/g;
  }
*/
//  var re = /\{"episode":"([\s\S]*?)"[\s\S]*?"hls":"([\s\S]*?)","audio":\{"names":\[([\s\S]*?)\][\s\S]*?"duration":([\s\S]*?),"title":"([\s\S]*?)"[\s\S]*?"sections":\[[\s\S]*?\]([\s\S]*?)\}/g;
//  var re = /\{"episode":"(.*?)".*?"hls":"(.*?)\.m3u8","audio":\{"names":\[(.*?)\].*?"duration":(.*?),"title":"(.*?)".*?"sections":\[.*?\](.*?)\}/g;
//  var re = /\{"episode":"(.*?)".*?"hls":"(.*?)","audio":\{"names":\[(.*?)\].*?"duration":(.*?),"title":"(.*?)".*?"sections":\[.*?\](.*?)\}/g;
//  var re = /\{"episode":"([^"]+)".*?"hls":"([^"]+)","audio":\{"names":\[([^"]+)\].*?"duration":([^"]+),"title":"([^"]+)".*?"sections":\[.*?\]([^"]+)\}/g;
  var re = /\{"episode":"(.*?)".*?"hls":"(.*?)","audio":\{"names":\[(.*?)\].*?"duration":(.*?),"title":"(.*?)"(.*?)/g;
//  var re = /\{"episode":"([^"]+)".*?"hls":"([^"]+)","audio":\{"names":\[([^"]+)\].*?"duration":([^"]+),"title":"([^"]+)"([^"]+)\}/g;
  var match = re.exec(doc);
  while (match) {
    try {
      var serie = match[1];
    }
    catch (err) {
//      serie = 0;
      serie = '';
    }
//    serie = showtime.entityDecode(serie);
//    serie = unescape(serie);
//    serie = decodeURIComponent(serie);
    try {
      var playlisturl = match[2];
      if (/http.*?:\/\//.test(playlisturl)) {
        playlisturl = playlisturl;
//        playlisturl = playlisturl + '.m3u8';
      }
      else {
        playlisturl = HTTPS + playlisturl;
//        playlisturl = HTTPS + playlisturl + '.m3u8';
      }
    }
    catch (err) {
      playlisturl = '';
    }
//    playlisturl = showtime.entityDecode(playlisturl);
//    playlisturl = unescape(playlisturl);
//    playlisturl = decodeURIComponent(playlisturl);
    try {
      var translation = match[3];
//      translation = translation.replace(/"/g, '').trim();
    }
    catch (err) {
      translation = '';
    }
//    translation = showtime.entityDecode(translation);
//    translation = unescape(translation);
//    translation = decodeURIComponent(translation);
    try {
//        var duration = match[4];
        var duration = match[4] + ' сек.';
    }
    catch (err) {
//      duration = '00:00:00';
      duration = '';
    }
//    duration = showtime.entityDecode(duration);
//    duration = unescape(duration);
//    duration = decodeURIComponent(duration);
    try {
      var name = match[5];
    }
    catch (err) {
//      name = coloredStr('Неопределенное', red);
      name = '';
    }
//    name = showtime.entityDecode(name);
//    name = unescape(name);
//    name = decodeURIComponent(name);
//    var poster = match[6].match(/"poster":"(.*?)\.jpg\?.*?"/);
//    var poster = match[6].match(/"poster":"(.*?)\?/);
    var poster = match[6].match(/"poster":"(.*?)"/);
//    var poster = match[6].match(/"poster":"([^"]+)"/);
    try {
      poster = poster[1];
      if (/http.*?:\/\//.test(poster)) {
        poster = poster;
//        poster = poster + '.jpg';
      }
      else {
        poster = HTTPS + poster;
//        poster = HTTPS + poster + '.jpg';
      }
      if (/\.(jpg|jpe|jpeg|jfif|png|bmp|dib|svg|gif)/.test(poster)) {
        poster = poster;
      }
      else {
        poster = icon;
//        poster = LOGOICON;
//        poster = LOGOLOGO;
//        poster = LOGONONE;
//        poster = '';
      }
    }
    catch (err) {
      poster = icon;
//      poster = LOGOICON;
//      poster = LOGOLOGO;
//      poster = LOGONONE;
//      poster = '';
    }
//    poster = showtime.entityDecode(poster);
//    poster = unescape(poster);
//    poster = decodeURIComponent(poster);
    var backdrops = [];
    try {
      backdrops.push({url: icon});
//      backdrops.push({url: poster});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
    }
    catch (err) {
//      backdrops.push({url: icon});
//      backdrops.push({url: poster});
      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: ''});
    }
    var uri;
    uri = playlisturl;
//    uri = escape(playlisturl);
//    uri = encodeURIComponent(playlisturl);
    if (/\.m3u8/.test(playlisturl)) {
//      uri = uri;
  // hls: prefix not needed; use plain URL
  // uri = 'hls:' + uri;
//      uri = 'movianDRM:hls:' + uri;
      if (service.movianDRM) {
//        uri = 'movianDRM:hls:' + uri;
        uri = 'movianDRM:' + uri;
      }
    }
//    else if (/\.mp4/.test(playlisturl)) {
//      uri = uri;
//    }
    else if (/\.mpd/.test(playlisturl)) {
      uri = 'movianDRM:dash:' + uri;
    }
    else {
      uri = uri;
    }
    if (/movianDRM:/.test(uri)) {
//    if (service.movianDRM && /\.(m3u8|mpd)/.test(playlisturl)) {
      uri += '::';
      uri += name ? name : '';
      uri += ' ';
//      uri += '(';
      uri += '[';
//      uri += '«';
//      uri += ' ';
      uri += translation ? translation : '';
//      uri += ')';
      uri += ']';
//      uri += '»';
//      uri += '::close';
      uri = uri.replace(/<.*?>/g, '').trim();
//      uri = uri.replace(/http:\/\//g, 'https://').trim();
//      uri = uri.replace(/https:\/\//g, 'http://').trim();
      uri = uri.replace(/(     |    |   |  )/g, ' ').trim();
//      uri = showtime.entityDecode(uri);
//      uri = unescape(uri);
//      uri = decodeURIComponent(uri);
//      uri = escape(uri);
//      uri = encodeURIComponent(uri);
    }
//    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
//      title: new RichText(title),
//      title: new showtime.RichText(name),
//      title: new RichText(name),
//      title: new showtime.RichText('Серия ' + (serie ? serie : '')),
      title: new RichText('Серия ' + (serie ? serie : '')),
      icon: icon,
//      icon: poster,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: logoquality,
//      icon: '',
      backdrops: backdrops,
//      genre: new showtime.RichText(duration ? duration : ''),
//      genre: new RichText(duration ? duration : ''),
//      genre: new showtime.RichText(duration ? coloredStr(duration, orange) : ''),
//      genre: new RichText(duration ? coloredStr(duration, orange) : ''),
//      genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + duration : ''),
//      genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + duration : ''),
//      genre: new showtime.RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//      genre: new RichText(duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) : ''),
//      genre: new showtime.RichText((season ? season + ' / ' : '') + (serie ? serie : '')),
//      genre: new RichText((season ? season + ' / ' : '') + (serie ? serie : '')),
//      genre: new showtime.RichText((season ? coloredStr(season + ' / ', orange) : '') + (serie ? coloredStr(serie, orange) : '')),
//      genre: new RichText((season ? coloredStr(season + ' / ', orange) : '') + (serie ? coloredStr(serie, orange) : '')),
//      genre: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie : '')),
//      genre: new RichText((season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie : '')),
//      genre: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
//      genre: new RichText((season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
//      genre: new showtime.RichText((duration ? duration + '<br>' : '') + (season ? season + ' / ' : '') + (serie ? serie : '')),
//      genre: new RichText((duration ? duration + '<br>' : '') + (season ? season + ' / ' : '') + (serie ? serie : '')),
//      genre: new showtime.RichText((duration ? coloredStr(duration, orange) + '<br>' : '') + (season ? coloredStr(season + ' / ', orange) : '') + (serie ? coloredStr(serie, orange) : '')),
      genre: new RichText((duration ? coloredStr(duration, orange) + '<br>' : '') + (season ? coloredStr(season + ' / ', orange) : '') + (serie ? coloredStr(serie, orange) : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie : '')),
//      genre: new showtime.RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
//      genre: new RichText((duration ? coloredStr('Продолжительность: ', gray) + coloredStr(duration, orange) + '<br>' : '') + (season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
//      source: new showtime.RichText(translation ? translation : ''),
//      source: new RichText(translation ? translation : ''),
//      source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
      source: new RichText(translation ? coloredStr(translation, blue) : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      tagline: new showtime.RichText(coloredStr(title, gray)),
      tagline: new RichText(coloredStr(title, gray)),
//      tagline: new showtime.RichText(coloredStr(name, gray)),
//      tagline: new RichText(coloredStr(name, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
//      description: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(name ? coloredStr(name, gray) : ''),
//      description: new RichText(name ? coloredStr(name, gray) : ''),
//      description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((name ? coloredStr(name, gray) + '<br>' : '') + (season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
      description: new RichText((name ? coloredStr(name, gray) + '<br>' : '') + (season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (duration ? coloredStr('Продолжительность: ', gray) + duration + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
//function scraperkpappsseries(page, doc) {
function scraperkpappsseries(page, doc, title, icon, season) {
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
//  season = showtime.entityDecode(season);
//  season = unescape(season);
//  season = decodeURIComponent(season);
//  var re = /\{"title":"([\s\S]*?)","folder":\[([\s\S]*?)\]\}/g;
  var re = /\{"title":"(.*?)","folder":\[(.*?)\]\}/g;
// var re = /\{"title":"([^"]+)","folder":\[([^"]+)\]\}/g;
  var match = re.exec(doc);
  while (match) {
    try {
      var serie = match[1];
    }
    catch (err) {
//      serie = 0;
      serie = '';
    }
//    serie = showtime.entityDecode(serie);
//    serie = unescape(serie);
//    serie = decodeURIComponent(serie);
    page.appendItem('', 'separator', {
//      title: new showtime.RichText(serie),
      title: new RichText(serie),
    });
    scraperkpappstransl(page, match[2], title, icon, season, serie);
    page.entries++;
    match = re.exec(doc);
  }
};
//function scraperkpappstransl(page, doc) {
function scraperkpappstransl(page, doc, title, icon, season, serie) {
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
//  season = showtime.entityDecode(season);
//  season = unescape(season);
//  season = decodeURIComponent(season);
//  serie = showtime.entityDecode(serie);
//  serie = unescape(serie);
//  serie = decodeURIComponent(serie);
//  var re = /\{"comment":"([\s\S]*?)","file":"([\s\S]*?)\}/g;
  var re = /\{"comment":"(.*?)","file":"(.*?)\}/g;
// var re = /\{"comment":"([^"]+)","file":"([^"]+)\}/g;
  var match = re.exec(doc);
  while (match) {
    try {
      var translation = match[1];
    }
    catch (err) {
      translation = '';
    }
//    translation = showtime.entityDecode(translation);
//    translation = unescape(translation);
//    translation = decodeURIComponent(translation);
    page.appendItem('', 'separator', {
//      title: new showtime.RichText(translation),
      title: new RichText(translation),
    });
    scraperkpapps(page, match[2], title, icon, translation, season, serie);
    page.entries++;
    match = re.exec(doc);
  }
};
//function scraperkpapps(page, doc) {
function scraperkpapps(page, doc, title, icon, translation, season, serie) {
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
//  translation = showtime.entityDecode(translation);
//  translation = unescape(translation);
//  translation = decodeURIComponent(translation);
//  season = showtime.entityDecode(season);
//  season = unescape(season);
//  season = decodeURIComponent(season);
//  serie = showtime.entityDecode(serie);
//  serie = unescape(serie);
//  serie = decodeURIComponent(serie);
  var re = /\[(.*?)\](.*?)(,|")/g;
//  var re = /\[([^"]+)\]([^"]+)(,|")/g;
//  var re = /\[(.*?)\](.*?)\.(mp4|m3u8)/g;
//  var re = /\[([^"]+)\]([^"]+)\.(mp4|m3u8)/g;
  var match = re.exec(doc);
  while (match) {
//    var qualityname = match[2].match(/\/(.*?)\.(mp4|m3u8)/);
//    var qualityname = match[2].match(/\/([^"]+)\.(mp4|m3u8)/);
    try {
      var qualityname = match[1];
//      qualityname = qualityname[1];
    }
    catch (err) {
//      qualityname = coloredStr('Неопределенное', red);
      qualityname = '';
    }
//    qualityname = showtime.entityDecode(qualityname);
//    qualityname = unescape(qualityname);
//    qualityname = decodeURIComponent(qualityname);
    try {
      var qualityurl = match[2];
      if (/http.*?:\/\//.test(qualityurl)) {
        qualityurl = qualityurl;
//        qualityurl = qualityurl + '.mp4';
//        qualityurl = qualityurl + '.m3u8';
      }
      else {
        qualityurl = HTTPS + qualityurl;
//        qualityurl = HTTPS + qualityurl + '.mp4';
//        qualityurl = HTTPS + qualityurl + '.m3u8';
      }
    }
    catch (err) {
      qualityurl = '';
    }
//    qualityurl = showtime.entityDecode(qualityurl);
//    qualityurl = unescape(qualityurl);
//    qualityurl = decodeURIComponent(qualityurl);
    var logoquality;
//    logoquality = LOGOHD;
    if (/720/.test(qualityname)) {
      logoquality = LOGO720;
    }
    else if (/1080/.test(qualityname)) {
      logoquality = LOGO1080;
    }
    else if (/2160/.test(qualityname)) {
      logoquality = LOGO4K;
    }
    else {
      logoquality = LOGONONE;
//      logoquality = LOGOHD;
    }
    var backdrops = [];
    try {
      backdrops.push({url: icon});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
    }
    catch (err) {
      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: ''});
    }
    var uri;
    uri = qualityurl;
//    uri = escape(qualityurl);
//    uri = encodeURIComponent(qualityurl);
//    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
//      title: new RichText(title),
//      title: new showtime.RichText(qualityname),
      title: new RichText(qualityname),
      icon: icon,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: logoquality,
//      icon: '',
      backdrops: backdrops,
//      genre: new showtime.RichText((season ? season + ' / ' : '') + (serie ? serie : '')),
//      genre: new RichText((season ? season + ' / ' : '') + (serie ? serie : '')),
//      genre: new showtime.RichText((season ? coloredStr(season + ' / ', orange) : '') + (serie ? coloredStr(serie, orange) : '')),
      genre: new RichText((season ? coloredStr(season + ' / ', orange) : '') + (serie ? coloredStr(serie, orange) : '')),
//      genre: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie : '')),
//      genre: new RichText((season ? coloredStr('Сезон: ', gray) + season + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + serie : '')),
//      genre: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
//      genre: new RichText((season ? coloredStr('Сезон: ', gray) + coloredStr(season, orange) + '<br>' : '') + (serie ? coloredStr('Серия: ', gray) + coloredStr(serie, orange) : '')),
//      source: new showtime.RichText(translation ? translation : ''),
//      source: new RichText(translation ? translation : ''),
//      source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
      source: new RichText(translation ? coloredStr(translation, blue) : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      tagline: new showtime.RichText(coloredStr(title, gray)),
      tagline: new RichText(coloredStr(title, gray)),
//      tagline: new showtime.RichText(coloredStr(qualityname, gray)),
//      tagline: new RichText(coloredStr(qualityname, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
//      description: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(qualityname ? coloredStr(qualityname, gray) : ''),
//      description: new RichText(qualityname ? coloredStr(qualityname, gray) : ''),
//      description: new showtime.RichText(qualityname ? coloredStr('Качество: ', gray) + qualityname : ''),
//      description: new RichText(qualityname ? coloredStr('Качество: ', gray) + qualityname : ''),
//      description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((qualityname ? coloredStr(qualityname, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText((qualityname ? coloredStr(qualityname, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new showtime.RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (qualityname ? coloredStr('Качество: ', gray) + qualityname : '')),
//      description: new RichText((season ? coloredStr('Сезон: ', gray) + season + ' ' : '') + (serie ? coloredStr('Серия: ', gray) + serie + '<br>' : '') + (translation ? coloredStr('Перевод: ', gray) + translation + '<br>' : '') + (qualityname ? coloredStr('Качество: ', gray) + qualityname : '')),
//      description: new showtime.RichText((season ? coloredStr(season + ' / ', gray) : '') + (serie ? coloredStr(serie, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ' + translation, gray) + '<br>' : '') + (qualityname ? coloredStr('Качество: ' + qualityname, gray) : '')),
      description: new RichText((season ? coloredStr(season + ' / ', gray) : '') + (serie ? coloredStr(serie, gray) + '<br>' : '') + (translation ? coloredStr('Перевод: ' + translation, gray) + '<br>' : '') + (qualityname ? coloredStr('Качество: ' + qualityname, gray) : '')),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
//function scrapersundb(page, doc) {
function scrapersundb(page, doc, title, icon) {
//  title = showtime.entityDecode(title);
//  title = unescape(title);
//  title = decodeURIComponent(title);
//  icon = showtime.entityDecode(icon);
//  icon = unescape(icon);
//  icon = decodeURIComponent(icon);
//  var re = /\{"title":"([\s\S]*?)",[\s\S]*?"file":"([\s\S]*?)"\}/g;
//  var re = /"title":"([\s\S]*?)"[\s\S]*?"file":"([\s\S]*?)"/g;
  var re = /"title":"(.*?)".*?"file":"(.*?)"/g;
// var re = /"title":"([^"]+)".*?"file":"([^"]+)"/g;
//  var re = /"title":"(.*?)".*?"file":"(.*?)\.m3u8/g;
// var re = /"title":"([^"]+)".*?"file":"([^"]+)\.m3u8/g;
  var match = re.exec(doc);
  while (match) {
    try {
      var translation = match[1];
    }
    catch (err) {
      translation = '';
    }
//    translation = showtime.entityDecode(translation);
//    translation = unescape(translation);
//    translation = decodeURIComponent(translation);
    try {
      var playlisturl = match[2];
      if (/http.*?:\/\//.test(playlisturl)) {
        playlisturl = playlisturl;
//        playlisturl = playlisturl + '.m3u8';
      }
      else {
        playlisturl = HTTPS + playlisturl;
//        playlisturl = HTTPS + playlisturl + '.m3u8';
      }
    }
    catch (err) {
      playlisturl = '';
    }
//    playlisturl = showtime.entityDecode(playlisturl);
//    playlisturl = unescape(playlisturl);
//    playlisturl = decodeURIComponent(playlisturl);
    var backdrops = [];
    try {
      backdrops.push({url: icon});
//      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
    }
    catch (err) {
      backdrops.push({url: LOGOICON});
//      backdrops.push({url: LOGOLOGO});
//      backdrops.push({url: LOGO});
//      backdrops.push({url: ''});
    }
    var uri;
    uri = playlisturl;
//    uri = escape(playlisturl);
//    uri = encodeURIComponent(playlisturl);
//    page.appendItem(uri, 'directory', {
//    page.appendItem(uri, 'video', {
    page.appendItem(uri, service.list, {
//      title: new showtime.RichText(title),
//      title: new RichText(title),
//      title: new showtime.RichText(translation),
      title: new RichText(translation),
      icon: icon,
//      icon: LOGOICON,
//      icon: LOGOLOGO,
//      icon: LOGONONE,
//      icon: logoquality,
//      icon: '',
      backdrops: backdrops,
//      source: new showtime.RichText(translation ? translation : ''),
//      source: new RichText(translation ? translation : ''),
//      source: new showtime.RichText(translation ? coloredStr(translation, blue) : ''),
      source: new RichText(translation ? coloredStr(translation, blue) : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      source: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      source: new RichText(translation ? coloredStr('Перевод: ', gray) + coloredStr(translation, blue) : ''),
//      tagline: new showtime.RichText(coloredStr(title, gray)),
      tagline: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(coloredStr(title, gray)),
//      description: new RichText(coloredStr(title, gray)),
//      description: new showtime.RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
      description: new RichText(translation ? coloredStr('Перевод: ', gray) + translation : ''),
//      description: new showtime.RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
//      description: new RichText(coloredStr(title, gray) + '<br>' + (translation ? coloredStr('Перевод: ', gray) + translation : '')),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
function optionsmovianDRM(page, uri) {
//  uri = showtime.entityDecode(uri);
//  uri = unescape(uri);
//  uri = decodeURIComponent(uri);
//  uri = escape(uri);
//  uri = encodeURIComponent(uri);
  page.options.createAction('movianDRM', 'Сменить проигрыватель', function () {
    if (!service.movianDRM) {
      service.movianDRM = true;
    }
    else if (service.movianDRM) {
      service.movianDRM = false;
    }
    page.flush();
    page.redirect(uri);
  });
/*
  page.options.createBool('movianDRM', 'Проигрыватель Movian DRM',
    service.movianDRM,
//    true,
//    false,
    function (v) {
      service.movianDRM = v;
//      if (page.asyncPaginator) {
//      if (page.paginator) {
      if (page.loading == false) {
        page.flush();
        page.redirect(uri);
      }
    }
//    }, true
//    }, false
  );
//  page.options.createInfo('movianDRMinfo', null, 'для применения перезагрузить страницу' + '\n \n');
*/
};
function utf8to1251urlencode(aa) {
  var bb = '', c = 0;
  for (var i = 0; i < aa.length; i++) {
    c = aa.charCodeAt(i);
    if (c > 127) {
      if (c > 1024) {
        if (c == 1025) {
          c = 1016;
        }
        else
        if (c == 1105) {
          c = 1032;
        }
        bb += '%' + (c - 848).toString(16);
      }
    }
    else {
      bb += aa[i];
    }
  }
  return bb;
};
function utf8to1251decode(aa) {
  var bb = '', c = 0;
  for (var i = 0; i < aa.length; i++) {
    c = aa.charCodeAt(i);
    if (c > 127) {
      if (c > 1024) {
        if (c == 1025) {
          c = 1016;
        }
        else
        if (c == 1105) {
          c = 1032;
        }
        bb += String.fromCharCode(c - 848);
      }
    }
    else {
      bb += aa.charAt(i);
    }
  }
  return bb;
};
//function oprint(o) {print(showtime.JSONEncode(o, null, 4))};
function oprint(o) {print(JSON.stringify(o, null, 4))};
function d(sBase64) {return String(Duktape.dec('base64', sBase64))};
var exist = function (x) {
  return x != null && typeof (x) != 'undefined' && x != 'undefined';
};
//})(this);