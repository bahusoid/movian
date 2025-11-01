/**
 *  HDRezka.TV plugin for Movian
 *
 *  Copyright (C) 2014-2024 Buksa (fix by kovalDN)
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
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
// ver. 2.6.10.1
//~/* eslint-disable camelcase */
//~/* eslint-disable new-cap */
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
  LOGO: Plugin.path + 'HDRezka.TV.png',
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
//var LOGO = Plugin.path + 'HDRezka.TV.png';
var LOGO = Plugin.path + plugin.icon;
var LOGOBACKGROUND = Plugin.path + 'src/back.jpg';
var LOGOTRACKER = Plugin.path + 'src/tracker.png';
var LOGOARROW = Plugin.path + 'src/arrow.png';
var LOGOFOLDER = Plugin.path + 'src/folder.png';
var LOGOICON = Plugin.path + 'src/icon.png';
//var LOGOBOOKMARKS = Plugin.path + 'src/bookmarks.png';
var LOGOEXIT = Plugin.path + 'src/exit.png';
var LOGO1080 = Plugin.path + 'src/1080.png';
var LOGO720 = Plugin.path + 'src/720.png';
var LOGONONE = Plugin.path + 'src/none.png';
var LOGO4K = Plugin.path + 'src/4k.png';
//var listview = Plugin.path + 'src/list.view';
var NAME = 'hdrezka';
//var service = require('showtime/service');
var service = require('movian/service');
//var service = plugin.createService(config.TTL, config.PREFIX + ':start', 'video', true, config.LOGO);
//var service = plugin.createService(TTL, PREFIX + ':start', 'video', true, LOGO);
//require('showtime/service').create(TTL, PREFIX + ':start', 'video', true, LOGO);
//require('movian/service').create(TTL, PREFIX + ':start', 'video', true, LOGO);
console.log(service);
service.create(TTL, PREFIX + ':start', 'video', true, LOGO);
console.log(service);
//var cache = require('showtime/store').create('cache');
var cache = require('movian/store').create('cache');
var resumeStore = require('movian/store').create('resume');
var store = require('movian/store').create('config');
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
var currentUser = store.currentUser || null;
var result = '';
var data = {};
var items = [];
var api = require('./src/api');
var browse = require('./src/browse');
var log = require('./src/log');
var moviepage = require('./src/moviepage');
var decodeps = require('./utils/decodeps').unpacker;
var DeanEdwardsUnpacker = require('./utils/Dean-Edwards-Unpacker').unpacker;
var atob = require('./utils/atob');
var btoa = require('./utils/btoa');
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
settings.createString('baseURL', 'Базовый URL (без завершающего "/")', '', function (v) {service.baseURL = v});
//settings.createString('domain', 'Базовый URL (без завершающего "/")', 'https://rezka.ag', function (v) {service.domain = v});
//settings.createString('domain', 'Домен', 'https://rezka.ag', function (v) {service.domain = v});
//settings.createString('domain', '\u0414\u043e\u043c\u0435\u043d', 'http://hdrezkayou.com', function (v) {service.domain = v});
//settings.createString('domain', '\u0414\u043e\u043c\u0435\u043d', 'http://kinopub.me', function (v) {service.domain = v});
//settings.createString('domain', 'Домен', 'rezka.ag', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без "http://" и завершающего "/" в конце)', 'rezka.ag', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'http://rezka.ag', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без "https://" и завершающего "/" в конце)', 'rezka.ag', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'https://rezka.ag', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'http://hdrezkayou.com', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'http://aghdrezka.com', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'http://metaivi.com', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'http://cokinopoisk.com', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'http://kinopub.me', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'http://rezkify.com', function (v) {service.domain = v});
//settings.createString('domain', 'Домен (базовый URL без завершающего "/" в конце)', 'https://rezkify.com', function (v) {service.domain = v});
settings.createString('domain0', 'Домен (базовый URL без завершающего "/" в конце)', 'http://rezka.ag', function (v) {service.domain0 = v});
settings.createMultiOpt('domain', 'Выбор домена', [
//  [service.domain0, service.domain0],
  [service.domain0, service.domain0, true],
  ['https://rezkify.com', 'https://rezkify.com'],
  ['http://rezkify.com', 'http://rezkify.com'],
  ['http://kinopub.me', 'http://kinopub.me'],
  ['http://cokinopoisk.com', 'http://cokinopoisk.com'],
  ['http://metaivi.com', 'http://metaivi.com'],
  ['http://aghdrezka.com', 'http://aghdrezka.com'],
  ['http://hdrezkayou.com', 'http://hdrezkayou.com'],
  ['http://rezka.ag', 'http://rezka.ag'],
  ['https://rezka.ag', 'https://rezka.ag'],
  ],
  function (v) {
  printDebug('Установите домен на ' + v);
  service.domain = v;
});
//var BASE_URL = 'http://rezka.ag';
var BASE_URL = service.baseURL && service.baseURL.trim() ? service.baseURL : service.domain;
//var referer = service.domain;
var referer = BASE_URL;
//settings.createString('baseTURL', 'Базовый трекер URL (без завершающего "/")', BASE_TURL, function (v) {service.baseTURL = v});
//settings.createString('tracker', 'Базовый трекер URL (без завершающего "/")', 'https://hdrezka.download', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер', 'https://hdrezka.download', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер', 'hdrezka', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер (базовый URL без "http://" и завершающего "/" в конце)', 'hdrezka.download', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер (базовый URL без завершающего "/" в конце)', 'https://hdrezka.download', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер (базовый URL без "https://" и завершающего "/" в конце)', 'hdrezka.download', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер (базовый URL без завершающего "/" в конце)', 'http://hdrezka.download', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер (базовый URL без завершающего "/" в конце)', 'http://rezka.tv', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер (базовый URL без завершающего "/" в конце)', 'https://rezka.tv', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер (базовый URL без завершающего "/" в конце)', 'http://rezka.land', function (v) {service.tracker = v});
//settings.createString('tracker', 'Трекер (базовый URL без завершающего "/" в конце)', 'https://rezka.cc', function (v) {service.tracker = v});
settings.createString('tracker0', 'Трекер (базовый URL без завершающего "/" в конце)', 'http://rezka.tv', function (v) {service.tracker0 = v});
settings.createMultiOpt('tracker', 'Выбор трекера', [
//  [service.tracker0, service.tracker0],
  [service.tracker0, service.tracker0, true],
  ['http://rezka.tv', 'http://rezka.tv'],
  ['https://rezka.tv', 'https://rezka.tv'],
  ['http://rezka.land', 'http://rezka.land'],
  ['https://rezka.cc', 'https://rezka.cc'],
  ],
  function (v) {
  printDebug('Установите трекер на ' + v);
  service.tracker = v;
});

//var BASE_TURL = 'https://hdrezka.download';
var BASE_TURL = service.tracker;
//var inspect_url = BASE_URL.replace(/^http.*(\w{4,15}.\w{2,3})$/gm,'.*\.$1') + '.*';
//print(inspect_url)
//io.httpInspectorCreate(inspect_url, function (ctrl) {
io.httpInspectorCreate('http.*load.hdrezka-ag.net.*', function (ctrl) {
//io.httpInspectorCreate('.*load.hdrezka-ag.net.*', function (ctrl) {
  ctrl.setHeader('User-Agent', UA);
//  ctrl.setHeader('Origin', 'https://rezka.ag');
//  ctrl.setHeader('Referer', 'https://rezka.ag/');
//  ctrl.setHeader('Referer', 'https://rezka.ag');
//  ctrl.setHeader('Referer', BASE_URL);
//  ctrl.setHeader('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');
//  ctrl.setHeader('Accept-Encoding', 'gzip, deflate');
//  ctrl.setHeader('Accept-Language', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7');
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
//io.httpInspectorCreate('http.*.m3u8', function (ctrl) {
//  ctrl.setHeader('Content-Type', 'application/x-mpegURL');
//  return 0;
//});
//io.httpInspectorCreate('http.*stream.voidboost.cc.*', function (ctrl) {
//io.httpInspectorCreate(/^http.*stream.voidboost.cc.*/, function(ctrl) {
io.httpInspectorCreate(/^http.*stream.voidboost.cc(.*)/, function(ctrl) {
  ctrl.setHeader('User-Agent', UA);
  ctrl.setHeader('Referer', referer);
  return 0;
});
//io.httpInspectorCreate('https://www.safebrowse.io.*', function(ctrl) {
//  oprint(ctrl);
//  log.d(ctrl);
//  ctrl.setHeader('User-Agent', UA);
//  ctrl.setHeader('Referer', referer);
//  return 0;
//});
//new page.Route('https://www.safebrowse.io.*', function(page, url) {
//  print('######################');
//  var x = showtime.httpReq(url);
//  var x = http.request(url);
//  var url = /file: '([^']+)/.exec(x)[1];
//  var url = showtime.httpReq(url, {
//  var url = http.request(url, {
//    noFollow: true,
//  }).headers.Location;
//  var x = showtime.httpReq(url);
//  var x = http.request(url);
//  var str = x.bytes.toString().replace(/\.\/\d+.mp4/g, url.match(/.*\d+.mp4/)[0]);
//  var str = Duktape.enc('base64', str);
//  page.redirect('hls:data:application/vnd.apple.mpegurl;base64,' + str);
//});
settings.createMultiOpt('list', 'Отображение списка', [
  ['directory', 'Общим списком'],
  ['video', 'Списком с данными', true],
  ],
  function (v) {
  printDebug('Установите список на ' + v);
  service.list = v;
});
settings.createBool('Show_META', 'Показ информации из базы данных thetvdb', true, function (v) {service.tvdb = v});
//settings.createBool('Show_META', 'Показ информации из базы данных thetvdb', false, function (v) {service.tvdb = v});
//settings.createBool('cp', 'Непрерывное воспроизведение', true, function (v) {service.cp = v});
settings.createBool('cp', 'Непрерывное воспроизведение', false, function (v) {service.cp = v});
settings.createBool('movianDRM', 'Проигрыватель Movian DRM', true, function (v) {service.movianDRM = v});

// Quality settings
settings.createBool('askQuality', 'Спрашивать качество каждый раз', true, function (v) {store.askQuality = v});
settings.createMultiOpt('qualityResolution', 'Предпочтительное разрешение', [
  ['1080p', '1080p', true],
  ['720p', '720p'],
  ['sd', 'SD'],
  ['4k', '4K'],
], function (v) {store.qualityResolution = v});
settings.createMultiOpt('qualityFormat', 'Предпочтительный формат', [
  ['hls', 'HLS', true],
  ['mp4', 'MP4'],
  ['drm', 'DRM'],
], function (v) {store.qualityFormat = v});

//settings.createBool('movianDRM', 'Проигрыватель Movian DRM', false, function (v) {service.movianDRM = v});
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
    page.metadata.background = LOGOBACKGROUND;
    page.metadata.logo = LOGO;
    page.metadata.icon = LOGO;
//    page.metadata.title = title;
//    page.metadata.title = showtime.entityDecode(title);
//    page.metadata.title = new showtime.RichText(title);
    page.metadata.title = new RichText(title);
//    page.metadata.title = TTL;
  }
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
//  var response = showtime.httpReq(BASE_URL, {
  var response = http.request(BASE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
    },
    noFail: true,
  });
  if (response.statuscode === 503) {
    m = /var s,t,o,p,b,r,e,a,k,i,n,g,f, ([^;]+)[\s\S]+?challenge-form'\)[\s\S]+?;(.*?.toFixed\(10\);)/.exec(response.toString());
    t = BASE_URL;
    r = t.match(/https?:\/\//)[0];
    t = t.substr(r.length);
    t = t.substr(0, t.length - 1);
    console.log(eval(m[1]));
    console.log(eval(m[2].replace('a.value', 'jschl_answer')));
    console.log(jschl_answer);
    url = /action="\/([^"]+)/.exec(response.toString())[1];
    pass = /name="pass" value="([^"]+)/.exec(response.toString())[1];
    r = /name="r" value="([^"]+)/.exec(response.toString())[1];
    jschl_vc = /name="jschl_vc" value="([^"]+)/.exec(response.toString())[1];
    postdata = {
      r: r,
      jschl_vc: jschl_vc,
      pass: pass,
      jschl_answer: jschl_answer,
    };
    setTimeout(function () {
//      var resp = showtime.httpReq(BASE_URL, {
      var resp = http.request(BASE_URL, {
        'debug': 1,
        'postdata': postdata,
        'headers': {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'ru,en-US;q=0.9,en;q=0.8,zh;q=0.7',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
          'upgrade-insecure-requests': '1',
        },
      });
    }, 4000);
  }
  if (!cache.keys) {
    var v = getKeys(response);
//    v = {
//      'file3_separator': '//_//',
//      'bk0': '$$#!!@#!@##', // 11
//      'bk1': '^^^!@##!!##', // 11
//      'bk2': '####^!!##!@@', // 12
//      'bk3': '@@@@@!##!^^^', // 12
//      'bk4': '$$!!@$$@^!@#$$@', // 15
//    };
    log.d({'file3_separator': v.file3_separator, 'bk0': v.bk0, 'bk1': v.bk1, 'bk2': v.bk2, 'bk3': v.bk3, 'bk4': v.bk4});
    service.keys = {'file3_separator': v.file3_separator, 'bk0': v.bk0, 'bk1': v.bk1, 'bk2': v.bk2, 'bk3': v.bk3, 'bk4': v.bk4};
    cache.keys = service.keys;
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
// Check login status
  var loginstate = response.toString().match(/logout|Выйти|Кабинет|Мой профиль/);
  var user = 'Авторизация';
  if (loginstate) {
    user = currentUser || 'Пользователь';
  }
//  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + PREFIX});
  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + BASE_URL});
//  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + PREFIX + ' (' + BASE_URL + ')'});
  if (!loginstate) {
    page.appendItem(PREFIX + ':login', 'directory', {
      title: new RichText(coloredStr('Войти [ ' + user + ' ]', 'EE0000')),
      icon: LOGOICON,
    });
  } else {
    page.appendItem(PREFIX + ':logout', 'directory', {
      title: new RichText(coloredStr('Выйти [ ' + user + ' ]', '555555')),
      icon: LOGOEXIT,
    });
    page.appendItem(PREFIX + ':continue', 'directory', {
      title: 'Продолжить просмотр',
      icon: LOGOFOLDER,
    });
  };
//  navmenu = document.getElementById('topnav-menu')
//  for (i = 0;  i < navmenu.children.length; i++) {
//    e = navmenu.children[i]
//    href = e.getElementsByClassName('b-topnav__item-link')[0].attributes[1].textContent;
//    title = e.getElementsByClassName('b-topnav__item-link')[0].textContent.trim();
//    console.log('page.appendItem(PREFIX + ":list:' + href + ':' + title + '", "directory", {title: "' + title + '"});')
//    console.log("page.appendItem(PREFIX + ':list:' + href + ':' + title + '', 'directory', {title: '' + title + ''});")
//  }
/*
  page.appendItem(null, 'separator', {title: 'Главная'});
//  page.appendItem(PREFIX + ':list:/continue/:Досмотреть', 'directory', {title: 'Досмотреть'});
//  page.appendItem(PREFIX + ':list:/continue/:Досмотреть', 'directory', {title: 'Досмотреть', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/continue/:Досмотреть', 'directory', {title: 'Досмотреть', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/favorites/:Закладки', 'directory', {title: 'Закладки'});
//  page.appendItem(PREFIX + ':list:/favorites/:Закладки', 'directory', {title: 'Закладки', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/favorites/:Закладки', 'directory', {title: 'Закладки', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/?filter=watching:Сейчас смотрят', 'directory', {title: 'Сейчас смотрят'});
//  page.appendItem(PREFIX + ':list:/?filter=watching:Сейчас смотрят', 'directory', {title: 'Сейчас смотрят', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/?filter=watching:Сейчас смотрят', 'directory', {title: 'Сейчас смотрят', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/?filter=popular:Популярные', 'directory', {title: 'Популярные'});
//  page.appendItem(PREFIX + ':list:/?filter=popular:Популярные', 'directory', {title: 'Популярные', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/?filter=popular:Популярные', 'directory', {title: 'Популярные', icon: LOGOFOLDER});
*/
//  page.appendItem(PREFIX + ':list:/?filter=last:Последние поступления', 'directory', {title: 'Последние поступления'});
//  page.appendItem(PREFIX + ':list:/?filter=last:Последние поступления', 'directory', {title: 'Последние поступления', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/?filter=last:Последние поступления', 'directory', {title: 'Последние поступления', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':updates:/:Горячие обновления сериалов', 'directory', {title: 'Горячие обновления сериалов'});
//  page.appendItem(PREFIX + ':updates:/:Горячие обновления сериалов', 'directory', {title: 'Горячие обновления сериалов', icon: LOGOARROW});
  page.appendItem(PREFIX + ':updates:/:Горячие обновления сериалов', 'directory', {title: 'Горячие обновления сериалов', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/new/:Новинки', 'directory', {title: 'Новинки'});
//  page.appendItem(PREFIX + ':list:/new/:Новинки', 'directory', {title: 'Новинки', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/new/:Новинки', 'directory', {title: 'Новинки', icon: LOGOFOLDER});
/*
//  page.appendItem(PREFIX + ':list:/?filter=soon:В ожидании', 'directory', {title: 'В ожидании'});
//  page.appendItem(PREFIX + ':list:/?filter=soon:В ожидании', 'directory', {title: 'В ожидании', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/?filter=soon:В ожидании', 'directory', {title: 'В ожидании', icon: LOGOFOLDER});
*/
//  page.appendItem(PREFIX + ':list:/announce/:Анонсы', 'directory', {title: 'Анонсы'});
//  page.appendItem(PREFIX + ':list:/announce/:Анонсы', 'directory', {title: 'Анонсы', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/announce/:Анонсы', 'directory', {title: 'Анонсы', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/films/:Фильмы', 'directory', {title: 'Фильмы'});
//  page.appendItem(PREFIX + ':list:/films/:Фильмы', 'directory', {title: 'Фильмы', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/films/:Фильмы', 'directory', {title: 'Фильмы', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/series/:Сериалы', 'directory', {title: 'Сериалы'});
//  page.appendItem(PREFIX + ':list:/series/:Сериалы', 'directory', {title: 'Сериалы', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/series/:Сериалы', 'directory', {title: 'Сериалы', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/cartoons/:Мультфильмы', 'directory', {title: 'Мультфильмы'});
//  page.appendItem(PREFIX + ':list:/cartoons/:Мультфильмы', 'directory', {title: 'Мультфильмы', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/cartoons/:Мультфильмы', 'directory', {title: 'Мультфильмы', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/animation/:Аниме', 'directory', {title: 'Аниме'});
//  page.appendItem(PREFIX + ':list:/animation/:Аниме', 'directory', {title: 'Аниме', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/animation/:Аниме', 'directory', {title: 'Аниме', icon: LOGOFOLDER});
//  page.appendItem(PREFIX + ':list:/show/:Передачи и шоу', 'directory', {title: 'Передачи и шоу'});
//  page.appendItem(PREFIX + ':list:/show/:Передачи и шоу', 'directory', {title: 'Передачи и шоу', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/show/:Передачи и шоу', 'directory', {title: 'Передачи и шоу', icon: LOGOFOLDER});
/*
//  page.appendItem(PREFIX + ':list:/collections/:Подборки', 'directory', {title: 'Подборки'});
//  page.appendItem(PREFIX + ':list:/collections/:Подборки', 'directory', {title: 'Подборки', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/collections/:Подборки', 'directory', {title: 'Подборки', icon: LOGOFOLDER});
  page.appendItem(null, 'separator', {title: 'Подборки'});
//  page.appendItem(PREFIX + ':list:/collections/1876-multfilmy-netflix/:Мультфильмы Netflix', 'directory', {title: 'Мультфильмы Netflix'});
//  page.appendItem(PREFIX + ':list:/collections/1876-multfilmy-netflix/:Мультфильмы Netflix', 'directory', {title: 'Мультфильмы Netflix', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/collections/1876-multfilmy-netflix/:Мультфильмы Netflix', 'directory', {title: 'Мультфильмы Netflix', icon: LOGOFOLDER});
*/
//  page.appendItem(PREFIX + ':tracker:Трекер', 'directory', {title: 'Трекер'});
//  page.appendItem(PREFIX + ':tracker:Трекер', 'directory', {title: 'Трекер', icon: LOGOARROW});
  page.appendItem(PREFIX + ':tracker:Трекер', 'directory', {title: 'Трекер', icon: LOGOFOLDER});
  page.loading = false;
});
//plugin.addURI(PREFIX + ':search:(.*)', function (page, query) {
new page.Route(PREFIX + ':search:(.*)', function (page, query) {
  page.loading = true;
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
//  page.model.contents = 'list';
  page.model.contents = 'grid';
  page.entries = 0;
  browse.searcher(page, {
    href: '/search/?do=search&subaction=search&q=' + encodeURIComponent(query),
    title: PREFIX + ' - ' + query,
  });
  page.loading = false;
});
//plugin.addSearcher(PREFIX, LOGO, function (page, query) {
//new page.Searcher(PREFIX, LOGO, function (page, query) {
//plugin.addSearcher(PREFIX + ' - результат', LOGO, function (page, query) {
//new page.Searcher(PREFIX + ' - результат', LOGO, function (page, query) {
//plugin.addSearcher(TTL + ': результат', LOGO, function (page, query) {
new page.Searcher(TTL + ': результат', LOGO, function (page, query) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, TTL);
//  setPageHeader(page, TTL + ': результат');
//  page.metadata.logo = LOGO;
//  page.metadata.icon = LOGO;
//  page.metadata.title = TTL;
  page.metadata.title = TTL + ': результат';
  page.type = 'directory';
//  page.model.contents = 'list';
  page.model.contents = 'grid';
  page.entries = 0;
  browse.searcher(page, {
    href: '/search/?do=search&subaction=search&q=' + encodeURIComponent(query),
    title: PREFIX + ' - ' + query,
  });
  page.loading = false;
});
// Login route
new page.Route(PREFIX + ':login', function (page) {
  page.metadata.background = LOGOBACKGROUND;
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
  page.metadata.title = TTL;
  var name = TTL + ' (' + BASE_URL + ')';
  var text = 'Требуется авторизация, введите логин и пароль';
  var credentials = popup.getAuthCredentials(name, text, 1, null, true);
  if (credentials.rejected) {
    return page.redirect(PREFIX + ':start');
  }
  if (credentials.username && credentials.password) {
    var url = BASE_URL;
    var ent = http.request(url, {
      debug: service.debug,
      noFollow: true,
      noFail: true,
      postdata: {
        login_name: credentials.username,
        login_password: credentials.password,
        login: 'submit',
      },
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': UA,
        'Referer': BASE_URL,
      },
    });
    if (ent.statuscode === 200) {
      console.log('Login successful');
      currentUser = credentials.username; // Store the username
      store.currentUser = credentials.username; // Persist the username
    }
  }
  page.redirect(PREFIX + ':start');
});
// Logout route
new page.Route(PREFIX + ':logout', function (page) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
  page.metadata.title = TTL;
  var url = BASE_URL + '/logout/';
  http.request(url);
  currentUser = null; // Clear the username
  delete store.currentUser; // Clear persisted username
  page.loading = false;
  page.redirect(PREFIX + ':start');
});
// Continue watching route
new page.Route(PREFIX + ':continue', function (page) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
  page.metadata.title = 'Продолжить просмотр';
  page.type = 'directory';
  page.model.contents = 'grid';
  page.entries = 0;

  var response = http.request(BASE_URL + '/continue/', {
    headers: {
      'User-Agent': UA,
    },
    noFail: true,
  });

  try {
    var responseText = response.toString();
    console.log('Continue page response length:', responseText.length);
    
    // Find the first occurrence of videosaves-list id and start regex matching from there
    var listIndex = responseText.indexOf('id="videosaves-list"');
    if (listIndex !== -1) {
      console.log('Found videosaves-list at position:', listIndex);

      // Find all <a> tags starting from the videosaves-list position
      var aTagPattern = /<a[^>]*>[\s\S]*?<\/a>/g;
      aTagPattern.lastIndex = listIndex; // Start matching from videosaves-list position

      var aMatches = [];
      var match;
      while ((match = aTagPattern.exec(responseText)) !== null) {
        aMatches.push(match[0]);
        // Prevent infinite loop in case of issues
        if (aMatches.length > 100) break;
      }

      console.log('Found', aMatches.length, '<a> tags after videosaves-list');

      // Log first few <a> tags for debugging
      for (var i = 0; i < Math.min(5, aMatches.length); i++) {
        console.log('A tag', i + 1, ':', aMatches[i].substring(0, 200) + (aMatches[i].length > 200 ? '...' : ''));
      }

      // Process each <a> tag to extract href, title, and cover_url (limit to 10 for debugging)
      var foundItems = 0;
      for (var i = 0; i < aMatches.length; i++) {
        var aTag = aMatches[i];

        // Extract data-cover_url
        var coverMatch = aTag.match(/data-cover_url="([^"]*)"/);
        var coverUrl = coverMatch ? coverMatch[1] : '';
        if(!coverUrl)
          continue;

        // Extract href
        var hrefMatch = aTag.match(/href="([^"]*)"/);
        var href = hrefMatch ? hrefMatch[1] : '';

        // Extract title (content between tags)
        var titleMatch = aTag.match(/>([^<]*)</);
        var title = titleMatch ? titleMatch[1].trim() : '';

        if (href && title && coverUrl) {
          console.log('Processing item:', title, 'href:', href, 'cover:', coverUrl);

          // Create item data similar to other movie items
          var itemData = {
            url: href,
            icon: coverUrl || 'none.png',
            title: title,
            type: 'continue'
          };

          page.appendItem(PREFIX + ':moviepage:' + JSON.stringify(itemData), service.list, {
            title: title,
            icon: coverUrl || 'none.png',
          });
          page.entries++;
          foundItems++;
        }
      }
    } else {
      console.log('videosaves-list not found in response');
    }
    
    console.log('Added', foundItems, 'continue watching items');
    
  } catch (e) {
    console.error('Error parsing continue page:', e);
    console.error('Response status:', response.statuscode);
    page.error('Ошибка загрузки страницы продолжить просмотр');
  }

  page.loading = false;
});
//plugin.addURI(PREFIX + ':list:(.*):(.*)', function (page, href, title) {
new page.Route(PREFIX + ':list:(.*):(.*)', function (page, href, title) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, href);
//  setPageHeader(page, title);
//  setPageHeader(page, params.title);
//  setPageHeader(page, TTL);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
//  page.metadata.title = href;
//  page.metadata.title = title;
//  page.metadata.title = params.title;
//  page.metadata.title = TTL;
  page.type = 'directory';
//  page.model.contents = 'list';
  page.model.contents = 'grid';
  browse.list(page, {
    href: href,
    title: title,
  });
  page.loading = false;
});
//plugin.addURI(PREFIX + ':updates:(.*):(.*)', function (page, href, title) {
new page.Route(PREFIX + ':updates:(.*):(.*)', function (page, href, title) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, href);
//  setPageHeader(page, title);
//  setPageHeader(page, params.title);
//  setPageHeader(page, TTL);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
//  page.metadata.title = href;
//  page.metadata.title = title;
//  page.metadata.title = params.title;
//  page.metadata.title = TTL;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  browse.updates(page, {
    href: href,
    title: title,
  });
  page.loading = false;
});
//plugin.addURI(PREFIX + ':tracker:(.*)', function (page, title) {
new page.Route(PREFIX + ':tracker:(.*)', function (page, title) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, title);
//  setPageHeader(page, TTL);
  page.metadata.logo = LOGOTRACKER;
  page.metadata.icon = LOGOTRACKER;
  page.metadata.title = title;
//  page.metadata.title = TTL;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
//  page.appendItem(PREFIX + ':trackersearch:', 'search', {title: 'Поиск на ' + PREFIX + '.Tracker'});
  page.appendItem(PREFIX + ':trackersearch:', 'search', {title: 'Поиск на ' + BASE_TURL});
//  page.appendItem(PREFIX + ':trackersearch:', 'search', {title: 'Поиск на ' + PREFIX + '.Tracker' + ' (' + BASE_TURL + ')'});
  var pages = [
    {url: '', name: 'Новинки'},
    {url: '/films', name: 'Фильмы'},
    {url: '/series', name: 'Сериалы'},
    {url: '/cartoons', name: 'Мультфильмы'},                
    {url: '/animation', name: 'Аниме'},
  ],
  i, length = pages.length;
//  page.appendItem('', 'separator', {title: 'Разделы'});
  for (i = 0; i < length; i++) {
    page.appendItem(PREFIX + ':trackerlist:' + pages[i].url + ':' + pages[i].name, 'directory', {
//    page.appendItem(PREFIX + ':trackerlist:' + pages[i].url + ':' + pages[i].name, service.list, {
      title: pages[i].name,
//      icon: LOGOARROW,
      icon: LOGOFOLDER,
    });
  }
  page.loading = false;
});
//plugin.addURI(PREFIX + ':trackersearch:(.*)', function (page, query) {
new page.Route(PREFIX + ':trackersearch:(.*)', function (page, query) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, 'Результаты поиска для: ' + query + ' (' + page.entries + ')');
//  setPageHeader(page, 'Результаты поиска для: ' + query);
//  setPageHeader(page, 'Результат поиска по запросу : ' + query + ' (' + page.entries + ')');
//  setPageHeader(page, 'Результат поиска по запросу : ' + query);
//  page.metadata.logo = LOGOTRACKER;
//  page.metadata.icon = LOGOTRACKER;
//  page.metadata.title = 'Результаты поиска для: ' + query + ' (' + page.entries + ')';
  page.metadata.title = 'Результаты поиска для: ' + query;
//  page.metadata.title = 'Результат поиска по запросу : ' + query + ' (' + page.entries + ')';
//  page.metadata.title = 'Результат поиска по запросу : ' + query;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  var url = '/ajax_search?q=';
  var fromPage = 1, tryToSearch = true;
//  page.entries = 0;
//  var doc = showtime.httpReq(BASE_TURL + url).toString();
//  var doc = http.request(BASE_TURL + url).toString();
  function loader() {
//    var doc = showtime.httpReq(BASE_TURL + url + encodeURIComponent(query), {
    var doc = http.request(BASE_TURL + url + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
      }
    }).toString();
//    doc = doc.match(/<div class="cardlist[\s\S]*?<div/);
    console.log(url + encodeURIComponent(query));
    if (doc) {
      var re = /<body>/g;
      var match = re.exec(doc);
      while (match) {
//        page.appendItem('', 'separator', {title: new showtime.RichText(url)});
//        page.appendItem('', 'separator', {title: new RichText(url)});
        trackersearch(page, match[1]);
        match = re.exec(doc);
      }
    };
    {trackersearch(page, doc)};
    fromPage++;
    return false;
  };
  loader();
  page.asyncPaginator = loader;
  page.loading = false;
});
//plugin.addSearcher(PREFIX + '.Tracker', LOGOTRACKER, function (page, query) {
//new page.Searcher(PREFIX + '.Tracker', LOGOTRACKER, function (page, query) {
//plugin.addSearcher(PREFIX + '.Tracker' + ' - результат', LOGOTRACKER, function (page, query) {
//new page.Searcher(PREFIX + '.Tracker' + ' - результат', LOGOTRACKER, function (page, query) {
//plugin.addSearcher(TTL + '.Tracker' + ': результат', LOGOTRACKER, function (page, query) {
new page.Searcher(TTL + '.Tracker' + ': результат', LOGOTRACKER, function (page, query) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, TTL + '.Tracker');
//  setPageHeader(page, TTL + '.Tracker' + ': результат');
//  page.metadata.logo = LOGOTRACKER;
//  page.metadata.icon = LOGOTRACKER;
//  page.metadata.title = TTL + '.Tracker';
  page.metadata.title = TTL + '.Tracker' + ': результат';
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  page.entries = 0;
  var fromPage = 0, tryToSearch = true;
  function loader() {
    if (!tryToSearch) return false;
    page.loading = true;
    var url = '/ajax_search?q=';
//    var doc = showtime.httpReq(BASE_TURL + '/search/' + fromPage + '/0/000/0/' + query.replace(/\s/g, '\+')).toString();
//    var doc = http.request(BASE_TURL + '/search/' + fromPage + '/0/000/0/' + query.replace(/\s/g, '\+')).toString();
//    var doc = showtime.httpReq(BASE_TURL + '/search/' + fromPage + '/0/000/0/' + query.replace(/\s/g, + '\')).toString();
//    var doc = http.request(BASE_TURL + '/search/' + fromPage + '/0/000/0/' + query.replace(/\s/g, + '\')).toString();
//    var doc = showtime.httpReq(BASE_TURL + url + encodeURIComponent(query), {
    var doc = http.request(BASE_TURL + url + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
      }
    }).toString();
    page.loading = false;
    trackersearch(page, doc);
    if (!doc.match(/downgif/)) return tryToSearch = false;
    fromPage++;
    return true;
  };
  loader();
  page.asyncPaginator = loader;
});
//plugin.addURI(PREFIX + ':trackerlist:(.*):(.*)', function (page, url, name) {
new page.Route(PREFIX + ':trackerlist:(.*):(.*)', function (page, url, name) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, name);
//  setPageHeader(page, TTL);
  page.metadata.logo = LOGOTRACKER;
  page.metadata.icon = LOGOTRACKER;
  page.metadata.title = name;
//  page.metadata.title = TTL;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  var fromPage = 1, tryToSearch = true;
  page.entries = 0;
//  var doc = showtime.httpReq(BASE_TURL + url).toString();
//  var doc = http.request(BASE_TURL + url).toString();
  function loader() {
//    var doc = showtime.httpReq(BASE_TURL + url + '/page/' + fromPage, {
    var doc = http.request(BASE_TURL + url + '/page/' + fromPage, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
      }
    }).toString();
//    doc = doc.match(/<div class="cardlist[\s\S]*?<div/);
    console.log(url);
    if (doc) {
      var re = /<h1 class="h1__">([\s\S]*?)</g;
      var match = re.exec(doc);
      while (match) {
//        page.appendItem('', 'separator', {title: new showtime.RichText(url)});
//        page.appendItem('', 'separator', {title: new RichText(url)});
        torrentpage(page, match[1]);
        match = re.exec(doc);
      }
    };
    {torrentpage(page, doc)};
    fromPage++;
    return true;
  }
  loader();
  page.paginator = loader;
  page.loading = false;
}); 
//plugin.addURI(PREFIX + ':moviepage:(.*)', function (page, data) {
new page.Route(PREFIX + ':moviepage:(.*)', function (page, data) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, data.title);
//  setPageHeader(page, TTL);
//  page.metadata.logo = data.icon;
//  page.metadata.logo = LOGO;
//  page.metadata.icon = data.icon;
//  page.metadata.icon = LOGO;
//  page.metadata.title = data.title;
//  page.metadata.title = TTL;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  moviepage.contentPage(page, data);
  page.loading = false;
});
//plugin.addURI(PREFIX + ':SEASON:(.*)', function (page, data) {
new page.Route(PREFIX + ':SEASON:(.*)', function (page, data) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, data.title);
//  setPageHeader(page, TTL);
//  page.metadata.logo = data.icon;
//  page.metadata.logo = LOGO;
//  page.metadata.icon = data.icon;
//  page.metadata.icon = LOGO;
//  page.metadata.title = data.title;
//  page.metadata.title = TTL;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  browse.season(page, data);
  page.loading = false;
});
//'play:data': {
//  'id': '39707',
//  'translator_id': '88',
//  'title': 'Безумен, но не болен',
//  'icon': 'https://static.hdrezka.ac/i/2021/5/19/pb6235e2c13f4yz70d37i.png'
//  'type': 'movie',
//  'camrip': '0',
//  'ads': '0',
//  'director': '0',
//  'cdn_url': 0,
//  'type': 'serial',
//  season: data.season_id,
//  episode: data.episode_id,
//}
//plugin.addURI(PREFIX + ':play:(.*)', function (page, data) {
new page.Route(PREFIX + ':play:(.*)', function (page, data) {
  var canonicalUrl = PREFIX + ':play:' + data;
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
  page.type = 'directory';
//  page.type = 'video';
//  data = showtime.JSONDecode(data);
  data = JSON.parse(data);
  console.log('Play route received data:', JSON.stringify(data, null, 2));
  log.d({
    'play:data': data
  });

  // Store last watched episode for resume functionality
  if (data.type === 'serial' && data.season_id && data.episode_id && (data.series_id || data.id)) {
    var seriesId = data.series_id || data.id;
    var lastWatchedKey = 'lastWatched_' + seriesId;
    resumeStore[lastWatchedKey] = {
      season_id: data.season_id,
      episode_id: data.episode_id,
      timestamp: new Date().getTime()
    };
    console.log('Stored last watched episode:', lastWatchedKey, 'season:', data.season_id, 'episode:', data.episode_id, 'series_id:', seriesId);
    //console.log('Available service keys after storage:', Object.keys(service).filter(k => k.startsWith('lastWatched_')));
  }

  if (!data.cdn_url) {
    if (data.translator_id) {
      postdata = {
        id: data.series_id || data.id,
        translator_id: data.translator_id,
        season: data.season_id,
        episode: data.episode_id,
//        favs: data.favs,
        favs: data.favs,
        action: 'get_stream',
      };
    }
    if (data.type == 'movie') {
      postdata = {
        id: data.series_id || data.id,
        translator_id: data.translator_id,
        is_camrip: data.camrip ? data.camrip : 0,
        is_ads: data.ads ? data.ads : 0,
        is_director: data.director ? data.director : 0,
//        favs: data.favs,
        favs: data.favs,
        action: 'get_movie',
      };
    }
    log.d({
      postdata: postdata,
    });
//    resp = showtime.httpReq(BASE_URL + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
    resp = http.request(BASE_URL + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
//    resp = showtime.httpReq('http://arial.trymeter.org/' + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
//    resp = http.request('http://arial.trymeter.org/' + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
//    resp = showtime.httpReq('http://arial.trymeter.org' + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
//    resp = http.request('http://arial.trymeter.org' + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
      'debug': 1,
//      arg: {t: new Date().getTime()},
      'headers': {
        'origin': BASE_URL,
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'ru,en-US;q=0.9,en;q=0.8,zh;q=0.7',
        'x-requested-with': 'XMLHttpRequest',
//        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
        'user-agent': UA,
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'accept': '*/*',
      },
      'referrer': BASE_URL,
      'postdata': postdata,
    });
//    log.e('###############################################');
//    log.d(resp.toString());
//    resp = showtime.JSONDecode(resp);
    resp = JSON.parse(resp);
    console.log('API response parsed:', JSON.stringify(resp, null, 2));
//    streams = resp.url;
    streams = clearUrl(resp.url);
    log.e(streams);
    data.subtitle = resp.subtitle;
  }
  else streams = data.cdn_url;
//  dom = html.parse('<html><body>' + seasons + episodes + '</body></html>').root;
  log.e({canonicalUrl269: canonicalUrl});
  var videoparams = {
    canonicalUrl: canonicalUrl,
    no_fs_scan: true,
//    icon: data.icon,
    icon: data.icon,
    title: data.title,
    year: data.year ? data.year : 0,
//    season: data.season ? data.season : -1,
    season: data.season_id ? data.season_id : -1,
//    episode: data.episode ? data.episode : -1,
    episode: data.episode_id ? data.episode_id : -1,
    sources: [{
      url: [],
    }],
//    subtitles: [{
//      url: resp.subtitle.match(/(\[.*\])(.*)/)[2],
//      language: resp.subtitle.match(/(\[.*\])(.*)/)[1],
//      title: resp.subtitle.match(/(\[.*\])(.*)/)[1],
//    }],
  };
  list = scrapeSourceLinks(streams);
  videoparams.subtitles = scrapeSourceSub(data.subtitle);
  
  // Check quality settings
  var askQuality = store.askQuality !== undefined ? store.askQuality : false;
  var qualityResolution = store.qualityResolution || '1080p';
  var qualityFormat = store.qualityFormat || 'hls';
  
  try {
    if (!askQuality) {
      // Auto-select best quality based on settings
      var selectedItem = selectBestQuality(list, qualityResolution, qualityFormat);
      if (selectedItem) {
        if (selectedItem.hls && qualityFormat === 'hls') {
          videoparams.sources = [{
            url: 'hls:' + selectedItem.hls,
          }];
          video = 'videoparams:' + JSON.stringify(videoparams);
          page.redirect(video);
          return;
        } else if (selectedItem.mp4 && qualityFormat === 'mp4') {
          page.redirect('mp4:' + selectedItem.mp4);
          return;
        }
        // For DRM, fall back to showing options
      }
    }
    
    // Find preferred quality for highlighting when asking
    var preferredItem = null;
    if (askQuality) {
      preferredItem = selectBestQuality(list, qualityResolution, qualityFormat);
    }
    
    // Show all quality options (old behavior or fallback)
    for (i = 0; i < list.length; i++) {
      if (list[i].hls) {
        videoparams.sources = [{
          url: 'hls:' + list[i].hls,
        }];
        video = 'videoparams:' + JSON.stringify(videoparams);
        
        // Check if this is the preferred quality when asking
        var isPreferred = askQuality && preferredItem && 
                         ((preferredItem.hls && list[i].hls === preferredItem.hls) || 
                          (preferredItem.mp4 && list[i].mp4 === preferredItem.mp4));
        
        page.appendItem(video, 'item', {
          title: 'HLS ' + list[i].q + ' | ' + data.title,
          description: '',
          icon: data.icon,
          autofocus: isPreferred
        });
        page.entries++;
      }
    }
  }
  catch (error) {
    log.e('oshibka pri vyvode variantov m3u8');
    log.e(error.stack);
  }
  optionsmovianDRM(page, canonicalUrl);
  if (service.movianDRM) {
    try {
      if (!askQuality && qualityFormat === 'drm') {
        // Auto-select best DRM quality
        var selectedItem = selectBestQuality(list, qualityResolution, 'hls'); // DRM uses HLS streams
        if (selectedItem && selectedItem.hls) {
          var uri = 'movianDRM:hls:' + selectedItem.hls + '::HLS ' + selectedItem.q + ' | ' + data.title;
          page.redirect(uri);
          return;
        }
      }
      
      // Show all DRM quality options
      for (i = 0; i < list.length; i++) {
        if (list[i].hls) {
          var uri = 'movianDRM:hls:' + list[i].hls;
          uri += '::';
//          uri += 'DRM';
//          uri += ' ';
          uri += 'HLS';
          uri += ' ';
          uri += list[i].q;
          uri += ' | ';
          uri += data.title;
//          uri += '::close';
//          uri = uri.replace(/<.*?>/g, '').trim();
//          uri = uri.replace(/http:\/\//g, 'https://').trim();
//          uri = uri.replace(/https:\/\//g, 'http://').trim();
//          uri = uri.replace(/(     |    |   |  )/g, ' ').trim();
//          uri = showtime.entityDecode(uri);
//          uri = unescape(uri);
//          uri = decodeURIComponent(uri);
//          uri = escape(uri);
//          uri = encodeURIComponent(uri);
          
          // Check if this is the preferred DRM quality when asking
          var isPreferred = askQuality && preferredItem && 
                           ((preferredItem.hls && list[i].hls === preferredItem.hls) || 
                            (preferredItem.mp4 && list[i].mp4 === preferredItem.mp4));
          
          page.appendItem(uri, 'item', {
            title: 'DRM ' + list[i].q + ' | ' + data.title,
            description: '',
            icon: data.icon,
            autofocus: isPreferred
          });
          page.entries++;
        }
      }
    }
    catch (error) {
      log.e('oshibka pri vyvode variantov hls-drm');
      log.e(error.stack);
    }
  }
  try {
    if (!askQuality && qualityFormat === 'mp4') {
      // Auto-select best MP4 quality
      var selectedItem = selectBestQuality(list, qualityResolution, 'mp4');
      if (selectedItem && selectedItem.mp4) {
        page.redirect(selectedItem.mp4);
        return;
      }
    }
    
    // Show all MP4 quality options
    for (i = 0; i < list.length; i++) {
      if (list[i].mp4) {
        videoparams.sources = [{
          url: list[i].mp4,
        }];
        video = 'videoparams:' + JSON.stringify(videoparams);
        
        // Check if this is the preferred MP4 quality when asking
        var isPreferred = askQuality && preferredItem && 
                         ((preferredItem.hls && list[i].hls === preferredItem.hls) || 
                          (preferredItem.mp4 && list[i].mp4 === preferredItem.mp4));
        
        page.appendItem(video, 'item', {
          title: 'MP4 ' + list[i].q + ' | ' + data.title,
          description: '',
          icon: data.icon,
          autofocus: isPreferred
        });
        page.entries++;
      }
    }
  }
  catch (error) {
    log.d('oshibka v MP4');
    log.d(error.stack);
  }
//  null != this.options.subtitles && (r = [], null != this.options.subtitles.master_vtt && r.push({
//    on_start: !0,
//    srclang: 'ru',
//    label: 'Russian',
//    src: this.options.subtitles.master_vtt,
//  }),
//  null != this.options.subtitles.slave_vtt && r.push({
//    srclang: 'en',
//    label: 'English',
//    src: this.options.subtitles.slave_vtt,
//~  }));
//~}
  page.loading = false;
});
//plugin.addURI(PREFIX + ':torrentpage:(.*):(.*)', function (page, url, title) {
new page.Route(PREFIX + ':torrentpage:(.*):(.*)', function (page, url, title) {
  page.loading = true;
  page.metadata.background = LOGOBACKGROUND;
//  setPageHeader(page, unescape(title));
//  setPageHeader(page, TTL);
//  page.metadata.logo = LOGOTRACKER;
//  page.metadata.icon = LOGOTRACKER;
  page.metadata.title = unescape(title);
//  page.metadata.title = TTL;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
  page.appendItem('', 'separator', {title: 'Торренты:'});
//  var doc = showtime.httpReq(url).toString();
//  var doc = http.request(url).toString();
//  var doc = showtime.httpReq(url, {
  var doc = http.request(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
    }
  }).toString();
  torrentscraper(page, doc);
  page.appendItem('', 'separator', {title: 'Поиск:'});
  page.appendItem(PREFIX + ':search:' + unescape(title), 'directory', {
    title: 'Найти в плагине',
//    icon: '',
    icon: LOGOARROW,
  });
  page.appendItem(PREFIX + ':trackersearch:' + unescape(title), 'directory', {
    title: 'Найти на трекере',
//    icon: '',
    icon: LOGOARROW,
  });
  page.appendItem('search:' + unescape(title), 'directory', {
    title: 'Найти в мовиан',
//    icon: '',
    icon: LOGOARROW,
  });
  page.appendItem('youtube:search:' + unescape(title), 'directory', {
    title: 'Найти на YouTube',
//    icon: '',
    icon: LOGOARROW,
  });
  page.appendItem('yo:search:' + unescape(title), 'directory', {
    title: 'Найти из Yohoho',
//    icon: '',
    icon: LOGOARROW,
  });
  page.loading = false;
});
function getKeys(response) {
  console.error('#######################################################################');
  console.error('#######################################################################');
  console.error('#######################################################################');
  console.error('#######################################################################');
  console.error('#######################################################################');
  console.error('#######################################################################');
  var playerjs = /src="(\/templates\/.*?playerjs[^"]+)/.exec(response.toString())[1];
//  var packed = showtime.httpReq(BASE_URL + playerjs, {
  var packed = http.request(BASE_URL + playerjs, {
    headers: {
      'Referer': BASE_URL,
      'User-Agent': UA,
    }}).toString();
//  var unpacked = decodeps.unpack(packed);
  var unpacked = DeanEdwardsUnpacker.unpack(packed);
  match = /u:.*?'([^']+)[\s\S]+?y:.*?'([^']+)/g.exec(unpacked);
  o = {};
  o.y = match[2];
  u = match[1];
  var dechar = function (x) {
    return String.fromCharCode(x);
  };
  var abc = String.fromCharCode(65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122);
  var salt = {
    _keyStr: abc + '0123456789+/=',
    e: function (e) {
      var t = '';
      var n;
      var r;
      var i;
      var s;
      var o;
      var u;
      var a;
      var f = 0;
      e = salt._ue(e);
      while (f < e.length) {
        n = e.charCodeAt(f++);
        r = e.charCodeAt(f++);
        i = e.charCodeAt(f++);
        s = n >> 2;
        o = (n & 3) << 4 | r >> 4;
        u = (r & 15) << 2 | i >> 6;
        a = i & 63;
        if (isNaN (r)) {
          u = a = 64;
        }
        else
        if (isNaN (i)) {
          a = 64;
        }
        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
      }
      return t;
    },
    d: function (e) {
      var t = '';
      var n;
      var r;
      var i;
      var s;
      var o;
      var u;
      var a;
      var f = 0;
      e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      while (f < e.length) {
        s = this._keyStr.indexOf(e.charAt(f++));
        o = this._keyStr.indexOf(e.charAt(f++));
        u = this._keyStr.indexOf(e.charAt(f++));
        a = this._keyStr.indexOf(e.charAt(f++));
        n = s << 2 | o >> 4;
        r = (o & 15) << 4 | u >> 2;
        i = (u & 3) << 6 | a;
        t = t + dechar(n);
        if (u != 64) {
          t = t + dechar(r);
        }
        if (a != 64) {
          t = t + dechar(i);
        }
      }
      t = salt._ud(t);
      return t;
    },
    _ue: function (e) {
      e = e.replace(/\r\n/g, '\n');
      var t = '';
      for (var n = 0; n < e.length; n++) {
        var r = e.charCodeAt(n);
        if (r < 128) {
          t += dechar(r);
        }
        else
        if (r > 127 && r < 2048) {
          t += dechar(r >> 6 | 192);
          t += dechar(r & 63 | 128);
        }
        else {
          t += dechar(r >> 12 | 224);
          t += dechar(r >> 6 & 63 | 128);
          t += dechar(r & 63 | 128);
        }
      }
      return t;
    },
    _ud: function (e) {
      var t = '';
      var n = 0;
      var r = 0;
      var c1 = 0;
      var c2 = 0;
      while (n < e.length) {
        r = e.charCodeAt(n);
        if (r < 128) {
          t += dechar(r);
          n++;
        }
        else
        if (r > 191 && r < 224) {
          c2 = e.charCodeAt(n + 1);
          t += dechar((r & 31) << 6 | c2 & 63);
          n += 2;
        }
        else {
          c2 = e.charCodeAt(n + 1);
          c3 = e.charCodeAt(n + 2);
          t += dechar((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          n += 3;
        }
      }
      return t;
    },
  };
  var pepper = function (s, n) {
    s = s.replace(/\+/g, '#');
    s = s.replace(/#/g, '+');
//    var a = sugar(o.y) * n;
    print(o.y);
    var a = sugar(o.y) * n;
    if (n < 0) {
      a += abc.length / 2;
    }
    var r = abc.substr(a * 2) + abc.substr(0, a * 2);
    return s.replace(/[A-Za-z]/g, function(c) {
      return r.charAt(abc.indexOf(c));
    });
  };
  var sugar = function (x) {
    x = x.split(dechar(61));
    var result = '';
    var c1 = dechar(120);
    var chr;
    for (var i in x) {
      if (x.hasOwnProperty(i)) {
        var encoded = '';
        for (var j in x[i]) {
          if (x[i].hasOwnProperty(j)) {
            encoded += (x[i][j] == c1) ? dechar(49) : dechar(48);
          }
        }
        chr = parseInt (encoded, 2);
        result += dechar(chr.toString(10));
      }
    }
    return result.substr(0, result.length - 1);
  };
  var decode = function (x) {
    if (x.substr(0, 2) == '#1') {
      return salt.d(pepper(x.substr(2), -1));
    }
    else
    if (x.substr(0, 2) == '#0') {
      return salt.d(x.substr(2));
    }
    else {
      return x;
    }
  };
  u = /u:.*?'([^']+)/gm.exec(unpacked)[1];
//  return (showtime.JSONDecode(decode(u)));
  return (JSON.parse(decode(u)));
};
function clearUrl(url) {
  if (!url) {
    console.log('clearUrl called with undefined/null url');
    return '';
  }
  service.keys = cache.keys;
  log.d(service.keys);
  url = fd2(url);
  function fd2(x) {
    if (!x) {
      console.log('fd2 called with undefined/null x');
      return '';
    }
    var a;
    a = x.substr(2);
    for (var i = 4; i > -1; i--) {
      if (exist(service.keys['bk' + i])) {
        if (service.keys['bk' + i] != '') {
          a = a.replace(service.keys.file3_separator + b1(service.keys['bk' + i]), '');
        }
      }
    }
    try {
      a = b2(a);
    }
    catch (e) {
      a = '';
    }
    function b1(str) {
//      console.log(unescape(str));
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
          }));
    }
    function b2(str) {
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    }
    return a;
  }
  return url;
};
function scrapeSourceLinks(streams) {
  var returnValue = [];
//  var regex = /(\[.\d+p.*?\])(.*?) or (.*?\d+.mp4)/gm;
  var regex = /(\[.\d+p.*?\])(.*?) or (.*?\.*?\.mp4)/gm;
  while ((m = regex.exec(streams)) !== null) {
//    console.log(m);
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    returnValue.push({
      q: m[1],
      hls: m[2],
      mp4: m[3],
    });
  }
  return returnValue;
};
function selectBestQuality(list, maxResolution, preferredFormat) {
  // Define resolution hierarchy (higher index = better quality)
  var resolutionOrder = ['sd', '720p', '1080p', '4k'];
  var maxResIndex = resolutionOrder.indexOf(maxResolution);
  
  var bestMatch = null;
  var bestResIndex = -1;
  
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var quality = item.q.replace(/\[|\]/g, '').toLowerCase();
    var resIndex = resolutionOrder.indexOf(quality);
    
    // Check if this quality is within our limit and better than current best
    if (resIndex <= maxResIndex && resIndex > bestResIndex) {
      // Check if preferred format is available
      if ((preferredFormat === 'hls' && item.hls) || 
          (preferredFormat === 'mp4' && item.mp4)) {
        bestMatch = item;
        bestResIndex = resIndex;
      }
    }
  }
  
  return bestMatch;
};
function scrapeSourceSub(streams) {
  var returnValue = [];
//  var regex = /(\[.\d+p.*?\])(.*?) or (.*?\d+.mp4)/gm;
  var regex = /(\[.*?\])(.*?vtt)/gm;
  while ((m = regex.exec(streams)) !== null) {
//    console.log(m);
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    returnValue.push({
      language: m[1],
      url: m[2],
      title: m[1],
    });
  }
  return returnValue;
};
function torrentpage(page, doc) {
  var doc = doc.match(/ <h1 class="h1[\s\S]*?<\/html>/g);
  var re = /<a href="([\s\S]*?)" class="card-item">[\s\S]*?card-item-type[\s\S]*?">([\s\S]*?)<\/span><img src="([\s\S]*?)" alt="([\s\S]*?)"[\s\S]*?title="([\s\S]*?)"[\s\S]*?ci-param">([\s\S]*?)</g;
  var match = re.exec(doc);
  while (match) {
    var url = BASE_TURL + match[1];
//    page.appendItem(PREFIX + ':torrentpage:' + url + ':' + escape(match[4]) + ' (' + escape(match[6]) + ')', 'video', {
    page.appendItem(PREFIX + ':torrentpage:' + url + ':' + escape(match[4]) + ' (' + escape(match[6]) + ')', service.list, {
//      title: new showtime.RichText(match[4] + coloredStr(' (', orange) + coloredStr(match[6], orange) + coloredStr(')', orange)),
      title: new RichText(match[4] + coloredStr(' (', orange) + coloredStr(match[6], orange) + coloredStr(')', orange)),
//      title: match[4] + ' (' + match[6] + ')', 
      icon: match[3],
    });
//    console.log(match[1]);
    page.entries++;
    match = re.exec(doc);
  }
};
function torrentscraper(page, doc) {
  var head = /<div class="si-cover">[\s\S]*?<img src="([\s\S]*?)"[\s\S]*?<h1 class="si-title">([\s\S]*?)<[\s\S]*?<div class="si-param">([\s\S]*?)<[\s\S]*?<div class="si-date">([\s\S]*?)<[\s\S]*?<li>([\s\S]*?)<[\s\S]*?<li>([\s\S]*?)<[\s\S]*?<li>([\s\S]*?)<[\s\S]*?<li>([\s\S]*?)<[\s\S]*?/g;
//  var head = /<div class="si-cover">[\s\S]*?<img src="([\s\S]*?)"[\s\S]*?<h1 class="si-title">([\s\S]*?)<[\s\S]*?<div class="si-param">([\s\S]*?)<[\s\S]*?<div class="si-date">([\s\S]*?)<[\s\S]*?<li>([\s\S]*?)<[\s\S]*?<li>([\s\S]*?)<[\s\S]*?<li>([\s\S]*?)<[\s\S]*?<li>([\s\S]*?)<[\s\S]*?dwn-list-none_collapser">([\s\S]*?)<[\s\S]*?<div class=\"dwn-links-list\">\n([\s\S]*?)\n/g;
  var docref = doc.match(/<div class=\"dwn-links-list\">\n([\s\S]*?)\n/g).toString();
  var fyefyedfy = /a href="([\s\S]*?)" class="dwn-links-item">([\s\S]*?)</g;
//  console.log('torref[1]=' + torref[1]);
  var desc = /<div class="si-story">([\s\S]*?)<[\s\S]*?/;
//  var match2 = docref.exec(doc);
  var match1 = head.exec(doc);
//  console.log('docref: ' + docref[1]);
  var torref = fyefyedfy.exec(docref);
  console.log('docref: ' + torref[1]);
  while (torref) {
    var url = BASE_TURL + torref[1];
//    var film = match1[9];
//    if (/Скачать через торрент/.test(film)) {
//      film = 'Фильм';
//    }
//    page.appendItem('torrent:browse:' + url, 'video', {
    page.appendItem('torrent:browse:' + url, service.list, {
//      title: new showtime.RichText(coloredStr(match1[2], orange) + ' (' + torref[2] + ')'),  
      title: new RichText(coloredStr(match1[2], orange) + ' (' + torref[2] + ')'),  
//      description: new showtime.RichText(match1[8]),
      description: new RichText(match1[8]),
      icon: match1[1],
    });
    page.entries++;
    torref = fyefyedfy.exec(docref);
  }
  var actors = /жиссер[\s\S]*?(?:ктеры|ролях)+[<>:\/b ]{2,7}[\s\S]*?\B[А-я][\s\S]*?<br \/>/;
  var actors1 = /([А-я \-\.]+(?: (([А-Я][а-я\-\.]*){1,3}(?:\(I*\))?)))/g;
  var match2 = actors.exec(doc);
  var error = false;
  try {var match3 = actors1.exec(match2)}
  catch (e) {var error = true}
  var iconurl = /actor\/+([\d]+).jpg/;
  var kinopoisk = 'https://www.kinopoisk.ru/index.php?kp_query=';
  if (!error)
  try {{
    while (match3) {
      var url = '/search/0/0/010/2/' + encodeURI(match3[1]);
//      var kinopage = showtime.httpReq(kinopoisk + (match3[1]));
      var kinopage = http.request(kinopoisk + (match3[1]));
//      page.appendItem(PREFIX + ':trackerlist:' + url + ':' + encodeURI(match3[1]), 'video', {
      page.appendItem(PREFIX + ':trackerlist:' + url + ':' + encodeURI(match3[1]), service.list, {
//        title: new showtime.RichText(coloredStr(match3[1], orange)),
        title: new RichText(coloredStr(match3[1], orange)),
        icon: 'https://st.kp.yandex.net/images/sm_actor/' + iconurl.exec(kinopage)[1] + '.jpg',
      });
      page.entries++;
      match3 = actors1.exec(match2);
    }
  }}
  catch (e) {popup.notify(e,5)}
  var re = /<tr class="[gai|tum]+"><td>([\s\S]*?)<\/td>[\s\S]*?href="([\s\S]*?)"[\s\S]*?<a href[\s\S]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>([\s\S]*?)<\/tr>/g;
  var match = re.exec(doc);
  while (match) {
    if (match[5].match(/alt="C"/)) {
      var end = match[5].match(/[\s\S]*?<td align="right">[\s\S]*?<td align="right">([\s\S]*?)<[\s\S]*?nbsp;([\s\S]*?)<\/span>[\s\S]*?nbsp;([\s\S]*?)<\/span>/);
      var comments = match[5].match(/[\s\S]*?<td align="right">([\s\S]*?)</)[1];
    }
    else
    var end = match[5].match(/[\s\S]*?<td align="right">([\s\S]*?)<[\s\S]*?nbsp;([\s\S]*?)<\/span>[\s\S]*?nbsp;([\s\S]*?)<\/span>/);
    var url = BASE_TURL + match[3];
    if (match[3].match(/http:\/\//))
    url = match[3].match(/(\/download.*)/)[1];
    page.appendItem(PREFIX + ':torrentpage:' + url, 'directory', {
//    page.appendItem(PREFIX + ':torrentpage:' + url, service.list, {
//      title: new showtime.RichText(coloredStr(match[1], orange) + ' ' + match[4] + coloredStr(end[2], green) + '/' + coloredStr(end[3], red) + colorStr(end[1], blue) + (comments ? colorStr(comments, orange) : '')),
      title: new RichText(coloredStr(match[1], orange) + ' ' + match[4] + coloredStr(end[2], green) + '/' + coloredStr(end[3], red) + colorStr(end[1], blue) + (comments ? colorStr(comments, orange) : '')),
    });
    page.entries++;
    match = re.exec(doc);
  }
};
function trackersearch(page, doc) {
//  var doc = doc.match(/<body>[\s\S]*?<\/html>/g);
//  var re = /<a href="([\s\S]*?)" class="card-item">[\s\S]*?card-item-type[\s\S]*?">([\s\S]*?)<\/span><img src="([\s\S]*?)" alt="([\s\S]*?)"[\s\S]*?title="([\s\S]*?)"[\s\S]*?ci-param">([\s\S]*?)</g;
  var re = /<a href="([\s\S]*?)" class="sr-item">[\s\S]*?<div class="sr-cover"><img src="([\s\S]*?)" alt="([\s\S]*?)"[\s\S]*?<div class="sr-param">([\s\S]*?)</g;
  var match = re.exec(doc);
  while (match) { 
    var url = BASE_TURL + match[1];
//    сonsole.log(url);
//    page.appendItem(PREFIX + ':torrentpage:' + url + ':' + escape(match[3]) + ' (' + escape(match[4]) + ')', 'video', {
    page.appendItem(PREFIX + ':torrentpage:' + url + ':' + escape(match[3]) + ' (' + escape(match[4]) + ')', service.list, {
//      title: new showtime.RichText(match[3] + coloredStr(' (', orange) + coloredStr(match[4], orange) + coloredStr(')', orange)),
      title: new RichText(match[3] + coloredStr(' (', orange) + coloredStr(match[4], orange) + coloredStr(')', orange)),
//      title: match[4] + ' (' + match[6] + ')', 
      icon: match[2],
    });
//    console.log(match[1]);
    page.entries++;
    match = re.exec(doc);
  }
};
//function oprint(o) {print(showtime.JSONEncode(o, null, 4))};
function oprint(o) {print(JSON.stringify(o, null, 4))};
function d(sBase64) {return String(Duktape.dec('base64', sBase64))};
var exist = function (x) {
  return x != null && typeof (x) != 'undefined' && x != 'undefined';
};
function optionsmovianDRM(page, uri) {
//  uri = showtime.entityDecode(uri);
//  uri = unescape(uri);
//  uri = decodeURIComponent(uri);
//  uri = escape(uri);
//  uri = encodeURIComponent(uri);
/*
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
*/
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
};
//})(this);
