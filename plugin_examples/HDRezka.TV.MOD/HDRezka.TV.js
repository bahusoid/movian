/**
 *  HDRezka.TV plugin for Movian
 *
 *  Copyright (C) 2014-2025 Buksa (fix by kovalDN) (bahusoid mod)
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
var LOGIN_STATE_REGEX = /\/logout\b/;
//var service = require('showtime/service');
var service = require('movian/service');
//var service = plugin.createService(config.TTL, config.PREFIX + ':start', 'video', true, config.LOGO);
//var service = plugin.createService(TTL, PREFIX + ':start', 'video', true, LOGO);
//require('showtime/service').create(TTL, PREFIX + ':start', 'video', true, LOGO);
//require('movian/service').create(TTL, PREFIX + ':start', 'video', true, LOGO);
service.create(TTL, PREFIX + ':start', 'video', true, LOGO);
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
var t = 'Based on HDRezka.TV v2.6.10.1  by Buksa (fix by kovalDN)';
settings.createInfo('info', LOGO, 'Plugin developed by ' + AUT + ', \n' + t +  ', \n' + 'ver. ' + VER + ' \n');
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
// Premium filter: when false, filter out premium-only translators
settings.createBool('Premium', 'Premium', false, function (v) {service.Premium = v});

settings.createString("bestPageCountryFilter", "Фильтр стран (Лучшие)", "Россия, Казахстан, Китай, Корея Южная", function (v) {service.filterCountries = v.split(',').map(function(item) { return item.trim(); });});
function printDebug(message) {
//  if (store.debug) console.error(message);
  if (service.debug) console.error(message);
};
settings.createString('domain0', 'Пользовательский домен', 'https://rezka.ag', function (v) {
  service.domain0 = v.replace(/\/+$/, "");
  if(service.isCustomDomain) {
    service.domain = v;
    BASE_URL = v;
    referer = v;
  }
});

settings.createMultiOpt('domain', 'Выбор домена', [
  ['custom', 'Пользовательский домен', true],
  ['https://rezkify.com', 'https://rezkify.com'],
  ['https://rezka.ag', 'https://rezka.ag'],
  ['https://rezka-ua.org', 'https://rezka-ua.org'],
  ['https://rezka-ua.pub', 'https://rezka-ua.pub'],
],
  function (v) {
    service.isCustomDomain = v === 'custom';
  if (service.isCustomDomain) {
    service.domain = service.domain0;
  } else {
    service.domain = v;
  }
  BASE_URL = service.domain; // Update BASE_URL immediately
  referer = service.domain; // Update referer too
});

var BASE_URL = service.domain;
var referer = service.domain;

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
  service.list = v;
});
settings.createBool('Show_META', 'Показ информации из базы данных thetvdb', false, function (v) {service.tvdb = v});
//settings.createBool('cp', 'Непрерывное воспроизведение', false, function (v) {service.cp = v});
settings.createBool('movianDRM', 'Проигрыватель Movian DRM', true, function (v) {service.movianDRM = v});

// Quality settings
settings.createBool('askQuality', 'Спрашивать качество каждый раз', false, function (v) {store.askQuality = v});
settings.createMultiOpt('qualityResolution', 'Предпочтительное разрешение', [
  ['4k', '4K'],
  ['1080p ultra', '1080p Ultra'],
  ['1080p', '1080p', true],
  ['720p', '720p'],
  ['sd', 'SD'],
], function (v) {store.qualityResolution = v});
settings.createMultiOpt('qualityFormat', 'Предпочтительный формат', [
  ['hls', 'HLS', true],
  ['mp4', 'MP4'],
  ['drm', 'DRM'],
], function (v) {store.qualityFormat = v});
settings.createMultiOpt('preferredCdn', 'Предпочтительный CDN', [
  ['default', 'Default', true],
  ['voidboost.cc', 'voidboost.cc'],
  ['ukrtelcdn.net', 'ukrtelcdn.net'],
  ['All', 'All'],
], function (v) {store.preferredCdn = v});

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
      'User-Agent': UA,
    },
    noFail: true,
  });
  if (response.statuscode === 503) {
    m = /var s,t,o,p,b,r,e,a,k,i,n,g,f, ([^;]+)[\s\S]+?challenge-form'\)[\s\S]+?;(.*?.toFixed\(10\);)/.exec(response.toString());
    t = BASE_URL;
    r = t.match(/https?:\/\//)[0];
    t = t.substr(r.length);
    t = t.substr(0, t.length - 1);
    log.d(eval(m[1]));
    log.d(eval(m[2].replace('a.value', 'jschl_answer')));
    log.d(jschl_answer);
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
          'User-Agent': UA,
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
//  setPageHeader(page, TTL);
  page.metadata.logo = LOGO;
  page.metadata.icon = LOGO;
  page.metadata.title = TTL;
  page.type = 'directory';
  page.model.contents = 'list';
//  page.model.contents = 'grid';
// Check login status
  var loginstate = LOGIN_STATE_REGEX.test(response.toString());
  var user = 'Авторизация';
  if (loginstate) {
    user = currentUser || 'Пользователь';

    //Plugin data reset?
    if(!currentUser)
      store.currentUser = currentUser = user;

  }
//  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + PREFIX});
  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + BASE_URL});
//  page.appendItem(PREFIX + ':search:', 'search', {title: 'Поиск на ' + PREFIX + ' (' + BASE_URL + ')'});
  if (loginstate) {
    page.appendItem(PREFIX + ':continue', 'directory', {
      title: 'Продолжить просмотр',
      icon: LOGOFOLDER,
    });
  }
  // Best (Лучшие) shortcuts for films/series/cartoons — use last used year (stored) or default (current date - 4 months)
  // Append entries that point to category/best/<year>/ — browse.list handles the rest
  page.appendItem(PREFIX + ':list:/films/best/:Лучшие фильмы', 'directory', {title: 'Лучшие фильмы', icon: LOGOFOLDER});
  page.appendItem(PREFIX + ':list:/series/best/:Лучшие сериалы', 'directory', {title: 'Лучшие сериалы', icon: LOGOFOLDER});
  page.appendItem(PREFIX + ':list:/cartoons/best/:Лучшие мультфильмы', 'directory', {title: 'Лучшие мультфильмы', icon: LOGOFOLDER});
//  navmenu = document.getElementById('topnav-menu')
//  for (i = 0;  i < navmenu.children.length; i++) {
//    e = navmenu.children[i]
//    href = e.getElementsByClassName('b-topnav__item-link')[0].attributes[1].textContent;
//    title = e.getElementsByClassName('b-topnav__item-link')[0].textContent.trim();
//    log.d('page.appendItem(PREFIX + ":list:' + href + ':' + title + '", "directory", {title: "' + title + '"});')
//    log.d("page.appendItem(PREFIX + ':list:' + href + ':' + title + '', 'directory', {title: '' + title + ''});")
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
  }
  /*
//  page.appendItem(PREFIX + ':list:/collections/:Подборки', 'directory', {title: 'Подборки'});
//  page.appendItem(PREFIX + ':list:/collections/:Подборки', 'directory', {title: 'Подборки', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/collections/:Подборки', 'directory', {title: 'Подборки', icon: LOGOFOLDER});
  page.appendItem(null, 'separator', {title: 'Подборки'});
//  page.appendItem(PREFIX + ':list:/collections/1876-multfilmy-netflix/:Мультфильмы Netflix', 'directory', {title: 'Мультфильмы Netflix'});
//  page.appendItem(PREFIX + ':list:/collections/1876-multfilmy-netflix/:Мультфильмы Netflix', 'directory', {title: 'Мультфильмы Netflix', icon: LOGOARROW});
  page.appendItem(PREFIX + ':list:/collections/1876-multfilmy-netflix/:Мультфильмы Netflix', 'directory', {title: 'Мультфильмы Netflix', icon: LOGOFOLDER});
*/
  page.loading = false;
});
//plugin.addURI(PREFIX + ':search:(.*)', function (page, query) {
new page.Route(PREFIX + ':search:(.*)', function (page, query) {
  page.loading = true;
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
    var url = BASE_URL + '/ajax/login/';
    // Prefer AJAX login endpoint which returns JSON
    var ent = http.request(url, {
      debug: service.debug,
      noFollow: true,
      noFail: true,
      postdata: {
        login_name: credentials.username,
        login_password: credentials.password,
        login_not_save: '0',
      },
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': UA,
        'Referer': BASE_URL,
      },
    });

    try {
      var respText = ent.toString();
      var json = null;
      try { json = JSON.parse(respText); } catch (e) { json = null; }
      if (json && json.success === true) {
        log.d('Login successful (ajax)');
        currentUser = credentials.username;
        store.currentUser = credentials.username;
      } else {
        // Fallback: if server returned HTML redirect or status 200, try to detect login state
        var body = respText || '';
        if (ent.statuscode === 200 && LOGIN_STATE_REGEX.test(body)) {
          log.d('Login successful (detected in HTML)');
          currentUser = credentials.username;
          store.currentUser = credentials.username;
        } else {
          var msg = (json && json.message) ? json.message : 'Login failed';
          popup.notify('Login failed: ' + msg, 5);
          log.e('Login error: ' + respText);
        }
      }
    } catch (e) {
      log.e('Exception while processing login response: ' + e);
    }

  }
  page.redirect(PREFIX + ':start');
});
// Logout route
new page.Route(PREFIX + ':logout', function (page) {
  page.loading = true;
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
    log.d('Continue page response length:', responseText.length);
    
    // Find the first occurrence of videosaves-list id and start regex matching from there
    var listIndex = responseText.indexOf('id="videosaves-list"');
    if (listIndex !== -1) {
      log.d('Found videosaves-list at position:', listIndex);

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

      log.d('Found', aMatches.length, '<a> tags after videosaves-list');

      // Log first few <a> tags for debugging
      for (var i = 0; i < Math.min(5, aMatches.length); i++) {
        log.d('A tag', i + 1, ':', aMatches[i].substring(0, 200) + (aMatches[i].length > 200 ? '...' : ''));
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
          log.d('Processing item:', title, 'href:', href, 'cover:', coverUrl);

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
      log.d('videosaves-list not found in response');
    }
    
    log.d('Added', foundItems, 'continue watching items');
    
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

new page.Route(PREFIX + ':moviepage:(.*)', function (page, data) {
  page.loading = true;
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
  page.loading = true;
  page.type = 'directory';
//  page.type = 'video';
//  data = showtime.JSONDecode(data);
  data = JSON.parse(data);
  log.d('Play route received data:', JSON.stringify(data, null, 2));
  log.d({
    'play:data': data
  });

  var canonicalUrl = moviepage.getCanonicalUrl(data);
  page.metadata.canonical_url = canonicalUrl;

  // Store last watched episode for resume functionality
  if (data.type === 'serial' && data.season_id && data.episode_id && (data.series_id || data.id)) {
    var seriesId = data.series_id || data.id;
    var lastWatchedKey = 'lastWatched_' + seriesId;
    resumeStore[lastWatchedKey] = {
      season_id: data.season_id,
      episode_id: data.episode_id,
      timestamp: new Date().getTime()
    };
    log.d('Stored last watched episode:', lastWatchedKey, 'season:', data.season_id, 'episode:', data.episode_id, 'series_id:', seriesId);
    //log.d('Available service keys after storage:', Object.keys(service).filter(k => k.startsWith('lastWatched_')));
  }

  if (!data.cdn_url) {
    // Send async send_save request before playback
    if (currentUser) {
      function sendSaveAsync() {
        //TODO: duration is missing
        var duration = 0;
        if (data.metadata && data.metadata.duration) {
          duration = data.metadata.duration;
        }
        var saveData = {
          post_id: data.series_id || data.id,
          translator_id: data.translator_id,
          season: data.season_id,
          episode: data.episode_id,
          current_time: 50 + Math.floor(Math.random() * 100) + Math.random().toFixed(5),
          duration: duration
        };
        try {
          http.request(BASE_URL + '/ajax/send_save/?t=' + new Date().getTime(), {
            method: 'POST',
            headers: {
              'Accept': '*/*',
              'Accept-Language': 'ru,en;q=0.9,en-US;q=0.8,uk;q=0.7',
              'Connection': 'keep-alive',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'Origin': BASE_URL,
              'Referer': BASE_URL + '/',
              'User-Agent': UA,
              'X-Requested-With': 'XMLHttpRequest',
            },
            postdata: saveData,
            async: true
          });
          log.d({send_save: saveData});
        } catch (e) {
          log.e('send_save async error: ' + e);
        }
      }
      // Skip it to avoid account ban
      // Use at own risk, to update watch history on site
      sendSaveAsync();
    }

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
    if (data.type === 'movie') {
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
    log.d('API response parsed:', JSON.stringify(resp, null, 2));
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
    requestHeaders: {
      'Origin': BASE_URL,
      'Referer': BASE_URL + '/',
      'Accept-Encoding': 'gzip, deflate, br'
    },
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
  var preferredCdn = store.preferredCdn || 'default';

  var bestQuality = selectBestQuality(list, qualityResolution, qualityFormat, preferredCdn);
  var selectedItem = bestQuality.item;
  try {
    if (!askQuality) {
      // Auto-select best quality based on settings
      if (selectedItem) {
        if (preferredCdn === 'All') {
          var sources = [];
          var urlMap = null;
          var formatPrefix = '';
          if (qualityFormat === 'hls' || qualityFormat === 'drm') {
            urlMap = selectedItem.hlsUrls;
            formatPrefix = 'hls:';
          } else if (qualityFormat === 'mp4') {
            urlMap = selectedItem.mp4Urls;
          }
          if (urlMap) {
            var cdns = Object.keys(urlMap);
            for (var c = 0; c < cdns.length; c++) {
              sources.push({
                url: formatPrefix + urlMap[cdns[c]],
                quality: selectedItem.q
              });
            }
          }
          if (sources.length > 0) {
            videoparams.sources = sources;
            videoparams.quality = selectedItem.q;
            video = 'videoparams:' + JSON.stringify(videoparams);
            page.redirect(video);
            return;
          }
        } else {
          var url;
          if (qualityFormat === 'hls') {
            url = 'hls:' + bestQuality.itemUrl;
          } else if(qualityFormat === 'drm') {
            url = 'hls:' + bestQuality.itemUrl;
            if (service.movianDRM) {
              url = 'movianDRM:' + url + '::HLS ' + selectedItem.q + ' | ' + data.title;
              page.redirect(url);
            }
          }
          else if (qualityFormat === 'mp4')
          {
            url = bestQuality.itemUrl;
          }
          if(url) {
            videoparams.sources = [{
              url: url
            }];
            video = 'videoparams:' + JSON.stringify(videoparams);
            page.redirect(video);
            return;
          }
        }
      }
    }

    var preferredItem = selectedItem;

    //HLS options
    for (i = 0; i < list.length; i++) {
        var hlsCdns = Object.keys(list[i].hlsUrls || {});
        if (preferredCdn === 'All') {
          var sources = [];
          for (var ci = 0; ci < hlsCdns.length; ci++) {
            sources.push({ url: 'hls:' + list[i].hlsUrls[hlsCdns[ci]], quality: list[i].q });
          }
          videoparams.sources = sources;
          videoparams.quality = list[i].q;
          video = 'videoparams:' + JSON.stringify(videoparams);
          var isPreferred = preferredItem === list[i] && (qualityFormat === 'hls' || !service.movianDRM);
          page.appendItem(video, 'item', {
            title: 'HLS ' + list[i].q + ' (All CDNs) | ' + data.title,
            description: '',
            icon: data.icon,
            autofocus: isPreferred
          });
          page.entries++;
        } else {
          // Resolve effective CDN: preferred if available, else first
          for (var ci = 0; ci < hlsCdns.length; ci++) {
            var cdn = hlsCdns[ci];
            var itemUrl = list[i].hlsUrls[cdn];
            videoparams.sources = [{
              url: 'hls:' + itemUrl,
            }];
            video = 'videoparams:' + JSON.stringify(videoparams);
            var isPreferred =  preferredItem === list[i] &&  bestQuality.itemUrl === itemUrl && (qualityFormat === 'hls' || !service.movianDRM);
            page.appendItem(video, 'item', {
              title: 'HLS ' + list[i].q + ' (' + cdn + ') | ' + data.title,
              description: '',
              icon: data.icon,
              autofocus: isPreferred
            });
            page.entries++;
          }
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
      // Show all DRM quality options
      for (i = 0; i < list.length; i++) {
        var drmHlsCdns = Object.keys(list[i].hlsUrls || {});
        if (preferredCdn === 'All') {
          var sources = [];
          for (var ci = 0; ci < drmHlsCdns.length; ci++) {
            sources.push({ url: 'movianDRM:hls:' + list[i].hlsUrls[drmHlsCdns[ci]] + '::', quality: list[i].q });
          }
          videoparams.sources = sources;
          videoparams.quality = list[i].q;
          video = 'videoparams:' + JSON.stringify(videoparams);
          var isPreferred = preferredItem === list[i] && qualityFormat === 'drm';
          page.appendItem(video, 'item', {
            title: 'DRM ' + list[i].q + ' (All CDNs) | ' + data.title,
            description: '',
            icon: data.icon,
            autofocus: isPreferred,
            focusable: isPreferred ? 1.5 : 1.0,
          });
          page.entries++;
        } else {
          // Resolve effective CDN: preferred if available, else first
          var drmEffectiveCdn = list[i].hlsUrls[preferredCdn] ? preferredCdn : (drmHlsCdns[0] || null);
          for (var dci = 0; dci < drmHlsCdns.length; dci++) {
            var drmCdn = drmHlsCdns[dci];
            var itemUrl = list[i].hlsUrls[drmCdn];
            var uri = 'movianDRM:hls:' + itemUrl;
            uri += '::';
            videoparams.sources = [{
              url: uri,
            }];
            video = 'videoparams:' + JSON.stringify(videoparams);
            var isPreferred =  preferredItem === list[i] &&  bestQuality.itemUrl === itemUrl && (qualityFormat === 'hls' || !service.movianDRM);
            page.appendItem(video, 'item', {
              title: 'DRM ' + list[i].q + ' (' + drmCdn + ') | ' + data.title,
              description: '',
              icon: data.icon,
              autofocus: isPreferred,
              focusable: isPreferred ? 1.5 : 1.0,
            });
            page.entries++;
          }
        }
      }
    }
    catch (error) {
      log.e('oshibka pri vyvode variantov hls-drm');
      log.e(error.stack);
    }
  }
  try {
    // Show all MP4 quality options
    for (i = 0; i < list.length; i++) {
      var mp4Cdns = Object.keys(list[i].mp4Urls || {});
      if (preferredCdn === 'All') {
        var sources = [];
        for (var ci = 0; ci < mp4Cdns.length; ci++) {
          sources.push({ url: list[i].mp4Urls[mp4Cdns[ci]], quality: list[i].q });
        }
        videoparams.sources = sources;
        videoparams.quality = list[i].q;
        video = 'videoparams:' + JSON.stringify(videoparams);
        var isPreferred = preferredItem === list[i] && qualityFormat === 'mp4';
        page.appendItem(video, 'item', {
          title: 'MP4 ' + list[i].q + ' (All CDNs) | ' + data.title,
          description: '',
          icon: data.icon,
          autofocus: isPreferred,
          focusable: isPreferred ? 1.5 : 1.0,
        });
        page.entries++;
      } else {
        // Resolve effective CDN: preferred if available, else first
        var mp4EffectiveCdn = list[i].mp4Urls[preferredCdn] ? preferredCdn : (mp4Cdns[0] || null);
        for (var mci = 0; mci < mp4Cdns.length; mci++) {
          var mp4Cdn = mp4Cdns[mci];
          var itemUrl = list[i].mp4Urls[mp4Cdn];
          videoparams.sources = [{
            url: itemUrl,
          }];
          video = 'videoparams:' + JSON.stringify(videoparams);
          var isPreferred =  preferredItem === list[i] &&  bestQuality.itemUrl === itemUrl && (qualityFormat === 'hls' || !service.movianDRM);
          page.appendItem(video, 'item', {
            title: 'MP4 ' + list[i].q + ' (' + mp4Cdn + ') | ' + data.title,
            description: '',
            icon: data.icon,
            autofocus: isPreferred,
            focusable: isPreferred ? 1.5 : 1.0,
          });
          page.entries++;
        }
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
    log.d('clearUrl called with undefined/null url');
    return '';
  }
  service.keys = cache.keys;
  const decoded_url = fd2(url);
  if (!decoded_url)
    return url;
  function fd2(x) {
    if (!x) {
      log.d('fd2 called with undefined/null x');
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
//      log.d(unescape(str));
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
  var blocks = streams.split(/,(?=\[)/);
  for (var b = 0; b < blocks.length; b++) {
    var block = blocks[b];
    var qMatch = block.match(/^(\[.*?\])([\s\S]*)$/);
    if (!qMatch) continue;
    //var q = qMatch[1];
    var q = qMatch[1].match(/\d+[pP]( Ultra)?/)[0] || qMatch[1];
    var urlList = qMatch[2].split(' or ');
    var hlsUrls = {};
    var mp4Urls = {};
    for (var u = 0; u < urlList.length; u++) {
      var url = urlList[u].trim();
      if (!url) continue;
      var isHls = url.indexOf(':hls:') !== -1;
      var hostMatch = url.match(/https?:\/\/([^\/]+)/);
      var cdn = hostMatch ? hostMatch[1] : 'unknown';
      if (cdn.indexOf('voidboost') !== -1) cdn = 'voidboost.cc';
      else if (cdn.indexOf('ukrtelcdn') !== -1) cdn = 'ukrtelcdn.net';
      if (isHls) {
        hlsUrls[cdn] = url;
      } else {
        mp4Urls[cdn] = url;
      }
    }
    returnValue.push({
      q: q,
      hlsUrls: hlsUrls,
      mp4Urls: mp4Urls,
    });
  }
  return returnValue;
};
function getUrlForCdn(urlMap, preferredCdn) {
  if (!urlMap) return null;
  if (urlMap[preferredCdn]) return urlMap[preferredCdn];
  var keys = Object.keys(urlMap);
  return keys.length > 0 ? urlMap[keys[0]] : null;
};
function selectBestQuality(list, maxResolution, preferredFormat, preferredCdn) {
  // Define resolution hierarchy (higher index = better quality)
  var resolutionOrder = ['360p', '480p', '720p', '1080p', '1080p ultra', '4k'];
  if(maxResolution === 'sd')
  {
    maxResolution = '480p';
  }
  var maxResIndex = resolutionOrder.indexOf(maxResolution);
  preferredCdn = preferredCdn || 'default`';
  
  var bestMatch = null;
  var bestResIndex = -1;
  
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    //var quality = item.q.replace(/\[|\]/g, '').toLowerCase();
    var resIndex = resolutionOrder.indexOf(item.q.toLowerCase());

    // Check if this quality is within our limit and better than current best
    if (resIndex <= maxResIndex && resIndex > bestResIndex) {
      // Check if preferred format is available
      var cdnUrl = null;
      if (preferredFormat === 'hls' || preferredFormat === 'drm') {
        cdnUrl = getUrlForCdn(item.hlsUrls, preferredCdn);
        } else if (preferredFormat === 'mp4') {
        cdnUrl = getUrlForCdn(item.mp4Urls, preferredCdn);
      }
      if(cdnUrl) {
        bestMatch = item;
        bestResIndex = resIndex;
      }
    }
  }
  
  return {
    item: bestMatch,
    itemUrl: cdnUrl
  };
}
function scrapeSourceSub(streams) {
  var returnValue = [];
//  var regex = /(\[.\d+p.*?\])(.*?) or (.*?\d+.mp4)/gm;
  var regex = /(\[.*?\])(.*?vtt)/gm;
  while ((m = regex.exec(streams)) !== null) {
//    log.d(m);
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
