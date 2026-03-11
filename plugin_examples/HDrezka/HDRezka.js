/* eslint-disable require-jsdoc */
/* eslint-disable no-var */
/* eslint-disable max-len */
/**
 *  HDRezka plugin for Movian
 *
 *  Copyright (C) 2014-2019 Buksa
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


// ver 2.6.6
var plugin = JSON.parse(Plugin.manifest);
var PREFIX = plugin.id;
var LOGO = Plugin.path + plugin.icon;
var UA = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36';

var page = require('movian/page');
var service = require('movian/service');
var settings = require('movian/settings');
var io = require('native/io');
// var prop = require('movian/prop');
var popup = require('native/popup');
var http = require('movian/http');
var html = require('movian/html');

var log = require('./src/log');
var browse = require('./src/browse');
var moviepage = require('./src/moviepage');
var api = require('./src/api');
var urls = require('url');
var DeanEdwardsUnpacker = require('./utils/Dean-Edwards-Unpacker').unpacker;
var atob = require('./utils/atob');
var btoa = require('./utils/btoa');

var tos = 'The developer has no affiliation with the sites what so ever.\n';
tos += 'Nor does he receive money or any other kind of benefits for them.\n\n';
tos += 'The software is intended solely for educational and testing purposes,\n';
tos += 'and while it may allow the user to create copies of legitimately acquired\n';
tos += 'and/or owned content, it is required that such user actions must comply\n';
tos += 'with local, federal and country legislation.\n\n';
tos += 'Furthermore, the author of this software, its partners and associates\n';
tos += 'shall assume NO responsibility, legal or otherwise implied, for any misuse\n';
tos += 'of, or for any loss that may occur while using plugin.\n\n';
tos += 'You are solely responsible for complying with the applicable laws in your\n';
tos += 'country and you must cease using this software should your actions during\n';
tos += 'plugin operation lead to or may lead to infringement or violation of the\n';
tos += 'rights of the respective content copyright holders.\n\n';
tos += 'plugin is not licensed, approved or endorsed by any online resource\n ';
tos += 'proprietary. Do you accept this terms?';
// https://load.hdrezka-ag.net/
io.httpInspectorCreate('http.*load.hdrezka-ag.net.*', function(ctrl) {
  ctrl.setHeader('User-Agent', UA);
  return 0;
});
// io.httpInspectorCreate('http.*video/[a-f0-9]{16}/.*', function (ctrl) {
//   ctrl.setHeader('User-Agent', UA);
//   return 0;
// });
// // https://streamguard.cc
// io.httpInspectorCreate('http.*streamguard.cc.*', function (ctrl) {
//   ctrl.setHeader('User-Agent', UA);
//   return 0;
// });

// Content-Type: application/x-mpegURL
// io.httpInspectorCreate("http.*.m3u8", function (ctrl) {
//     ctrl.setHeader('Content-Type', 'application/x-mpegURL');
//     return 0;
// });

// Create the service (ie, icon on home screen)
service.create(plugin.title, PREFIX + ':start', 'video', true, LOGO);
settings.globalSettings(plugin.id, plugin.title, LOGO, plugin.synopsis);
settings.createInfo('info', LOGO, 'Plugin developed by ' + plugin.author);
settings.createDivider('Settings:');
settings.createBool('tosaccepted', 'Accepted TOS (available in opening the plugin)', false, function(v) {
  service.tosaccepted = v;
});
settings.createString('domain', '\u0414\u043e\u043c\u0435\u043d', 'http://hdrezkayyhdq3.net', function(v) {
  service.domain = v;
});
settings.createBool('debug', 'Debug', false, function(v) {
  service.debug = v;
});
settings.createBool('Show_META', 'Show more info from thetvdb', true, function(v) {
  service.tvdb = v;
});
settings.createBool('cp', 'Continuous play', false, function(v) {
  service.cp = v;
});
var result = '';
var referer = service.domain;
var data = {};
var BASE_URL = service.domain;

// GET /4/6/0/8/7/3/4c......b20f3:2022010617:cHR.......kE9PQ==/o2vmz.mp4:hls:manifest.m3u8 HTTP/1.1
// Host: stream.voidboost.cc
// Connection: keep-alive
// Pragma: no-cache
// Cache-Control: no-cache
// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36
// Accept: */*
// Sec-GPC: 1
// Origin: http://hdrezkayou.com
// Referer: http://hdrezkayou.com/
// Accept-Encoding: gzip, deflate
// Accept-Language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7
io.httpInspectorCreate('http.*stream.voidboost.cc.*', function(ctrl) {
  ctrl.setHeader('User-Agent', UA);
  ctrl.setHeader('Referer', referer);
  return 0;
});

//
new page.Route(PREFIX + ':list:(.*):(.*)', function(page, href, title) {
  page.loading = true;
  browse.list(page, {
    href: href,
    title: title,
  });
});
//
new page.Route(PREFIX + ':updates:(.*):(.*)', function(page, href, title) {
  page.loading = true;
  browse.updates(page, {
    href: href,
    title: title,
  });
});

//
new page.Route(PREFIX + ':moviepage:(.*)', function(page, data) {
  page.loading = true;
  moviepage.contentPage(page, data);
});
//
new page.Route(PREFIX + ':SEASON:(.*)', function(page, data) {
  browse.season(page, data);
});
//
// "play:data": {
//   "id": "39707",
//   "translator_id": "88",
//   "title": "Безумен, но не болен",
// data.year
//   "icon": "https://static.hdrezka.ac/i/2021/5/19/pb6235e2c13f4yz70d37i.png"


// "type": "movie",
//  "camrip": "0",
//  "ads": "0",
//  "director": "0",
//  "cdn_url": 0,

// "type": "serial",
//  season: data.season_id,
//  episode: data.episode_id,
// }
new page.Route(PREFIX + ':play:(.*)', function(page, data) {
  var canonicalUrl = PREFIX + ':play:' + data;
  page.loading = true;
  page.type = 'directory';
  //  page.type = 'video';
  data = JSON.parse(data);
  log.d({
    'play:data': data,
  });
  if (!data.cdn_url) {
    if (data.translator_id) {
      postdata = {
        id: data.id,
        translator_id: data.translator_id,
        season: data.season_id,
        episode: data.episode_id,
        action: 'get_stream',
      };
    }

    if (data.type == 'movie') {
      postdata = {
        id: data.id,
        translator_id: data.translator_id,
        is_camrip: data.camrip ? data.camrip : 0,
        is_ads: data.ads ? data.ads : 0,
        is_director: data.director ? data.director : 0,
        action: 'get_movie',
      };
    }

    log.d({
      postdata: postdata,
    });

    resp = http.request('https://arial.trymeter.org/ajax/get_cdn_series/?t=' + new Date().getTime(), {
      'debug': 1,
      // arg: {t: new Date().getTime()},
      'headers': {
        'origin': BASE_URL,
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'ru,en-US;q=0.9,en;q=0.8,zh;q=0.7',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': UA,
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'accept': '*/*',
      },
      'referrer': BASE_URL,
      'postdata': postdata,
    });
    log.d(resp.toString());
    resp = JSON.parse(resp);
    streams = clearUrl(resp.url);
    data.subtitle = resp.subtitle;
  } else streams = data.cdn_url;
  // dom = html.parse('<html><body>' + seasons + episodes + '</body></html>').root;

  var videoparams = {
    canonicalUrl: canonicalUrl,
    no_fs_scan: true,
    icon: data.icon,
    title: data.title,
    year: data.year ? data.year : 0,
    season: data.season ? data.season : -1,
    episode: data.episode ? data.episode : -1,
    sources: [{
      url: [],
    }],
    // subtitles: [{
    //   url: resp.subtitle.match(/(\[.*\])(.*)/)[2],
    //   language: resp.subtitle.match(/(\[.*\])(.*)/)[1],
    //   title: resp.subtitle.match(/(\[.*\])(.*)/)[1]
    // }],
  };
  list = scrapeSourceLinks(streams);
  videoparams.subtitles = scrapeSourceSub(data.subtitle);
  try {
    //            videoparams.subtitles.push({
    //     url: BASE_URL + element.attributes.getNamedItem('src').value,
    //     language: element.attributes.getNamedItem('srclang').value,
    //     title: element.attributes.getNamedItem('src').value.match(/file\/\d+\/([^']+)/)[1]
    // });
    for (i = 0; i < list.length; i++) {
      if (list[i].hls) {
        videoparams.sources = [{
          url: 'hls:' + list[i].hls,
        }];
        video = 'videoparams:' + JSON.stringify(videoparams);
        log.d(video);
        log.d(videoparams.canonicalUrl == (PREFIX + ':play:' + JSON.stringify(data)));
        log.d(data);
        page.appendItem(video, 'item', {
          title: 'HLS ' + list[i].q + ' | ' + data.title,
          description: '',
          icon: data.icon,
        });
        page.entries++;
      }
    }
  } catch (error) {
    log.e('oshibka pri vyvode variantov m3u8');
    log.e(error.stack);
  }
  // //MP4
  try {
    for (i = 0; i < list.length; i++) {
      if (list[i].mp4) {
        videoparams.sources = [{
          url: list[i].mp4,
        }];
        video = 'videoparams:' + JSON.stringify(videoparams);
        log.d(video);
        log.d(videoparams.canonicalUrl == (PREFIX + ':play:' + JSON.stringify(data)));
        log.d(data);
        page.appendItem(video, 'item', {
          title: 'MP4 ' + list[i].q + ' | ' + data.title,
          description: '',
          icon: data.icon,
        });
        page.entries++;
      }
    }
  } catch (error) {
    log.d('oshibks v MP4');
    log.d(error.stack);
  }


  // null != this.options.subtitles && (r = [], null != this.options.subtitles.master_vtt && r.push({
  //     on_start: !0,
  //     srclang: "ru",
  //     label: "Russian",
  //     src: this.options.subtitles.master_vtt
  // }), null != this.options.subtitles.slave_vtt && r.push({
  //     srclang: "en",
  //     label: "English",
  //     src: this.options.subtitles.slave_vtt
  // }));
  //  }
  page.loading = false;
});


new page.Route(PREFIX + ':search:(.*)', function(page, query) {
  page.metadata.icon = LOGO;
  page.metadata.title = 'Search results for: ' + query + ' (' + page.entries + ')';
  page.type = 'directory';
  // http://getmovie.cc/query/tron
  // https://rezka.ag/search/?do=search&subaction=search&q=%D0%B0%D0%BC%D0%B5%D1%80%D0%B8%D0%BA%D0%B0%D0%BD%D1%81%D0%BA%D0%B8%D0%B9searchf
  // index.php?do=search&subaction=search&search_start=1&full_search=1&result_from=1&story=lost&titleonly=3&showposts=0
  browse.searcher(page, {
    href: '/search/?do=search&subaction=search&q=' + encodeURIComponent(query),
    title: PREFIX + ' - ' + query,
  });
});
//
new page.Searcher(PREFIX + ' - Result', LOGO, function(page, query) {
  page.metadata.icon = LOGO;

  page.entries = 0;
  browse.searcher(page, {
    href: '/search/?do=search&subaction=search&q=' + encodeURIComponent(query),
    title: PREFIX + ' - ' + query,
  });
});
// Landing page
new page.Route(PREFIX + ':start', function(page) {
  if (!service.tosaccepted) {
    if (popup.message(tos, true, true)) {
      service.tosaccepted = 1;
    } else {
      page.error('TOS not accepted. plugin disabled');
      return;
    }
  }

  var response = http.request(BASE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7',
    },
    noFail: true,
  });
  //
  if (response.statuscode === 503) {
    m = /var s,t,o,p,b,r,e,a,k,i,n,g,f, ([^;]+)[\s\S]+?challenge-form'\)[\s\S]+?;(.*?.toFixed\(10\);)/.exec(response);
    t = BASE_URL;
    r = t.match(/https?:\/\//)[0];
    t = t.substr(r.length);
    t = t.substr(0, t.length - 1);
    console.log(eval(m[1]));
    console.log(eval(m[2].replace('a.value', 'jschl_answer')));
    console.log(jschl_answer);
    url = /action="\/([^"]+)/.exec(response)[1];
    pass = /name="pass" value="([^"]+)/.exec(response)[1];
    r = /name="r" value="([^"]+)/.exec(response)[1];
    jschl_vc = /name="jschl_vc" value="([^"]+)/.exec(response)[1];

    postdata = {
      r: r,
      jschl_vc: jschl_vc,
      pass: pass,
      jschl_answer: jschl_answer,
    };

    setTimeout(function() {
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


  // /////////////////////////////
  var v = getKeys(response);
  // v = {'file3_separator': '//_//',
  //   'bk0': '$$#!!@#!@##', // 11
  //   'bk1': '^^^!@##!!##', // 11
  //   'bk2': '####^!!##!@@', // 12
  //   'bk3': '@@@@@!##!^^^', // 12
  //   'bk4': '$$!!@$$@^!@#$$@', // 15
  // };
  log.d({'file3_separator': v.file3_separator, 'bk0': v.bk0, 'bk1': v.bk1, 'bk2': v.bk2, 'bk3': v.bk3, 'bk4': v.bk4});

  service.keys = {'file3_separator': v.file3_separator, 'bk0': v.bk0, 'bk1': v.bk1, 'bk2': v.bk2, 'bk3': v.bk3, 'bk4': v.bk4};
  // //////////////////////////////////////////////
  page.type = 'directory';
  page.metadata.title = PREFIX;
  page.metadata.icon = LOGO;
  page.appendItem(PREFIX + ':search:', 'search', {
    title: 'Search ' + PREFIX,
  });
  //     navmenu = document.getElementById("topnav-menu")
  //     for (i = 0;  i < navmenu.children.length; i++){
  //         e = navmenu.children[i]
  //         href = e.getElementsByClassName("b-topnav__item-link")[0].attributes[1].textContent;
  //         title = e.getElementsByClassName("b-topnav__item-link")[0].textContent.trim();
  // //        console.log('page.appendItem(PREFIX + ":list:'+href+':'+title+'", "directory", { title: "'+title+'"});')
  //   }
    page.appendItem(PREFIX + ':updates:/:Горячие обновления сериалов', 'directory', {
    title: 'Горячие обновления сериалов',
  });
  page.appendItem(PREFIX + ':list:/new/:Новинки', 'directory', {
    title: 'Новинки',
  });
  page.appendItem(PREFIX + ':list:/announce/:Анонсы', 'directory', {
    title: 'Анонсы',
  });
  page.appendItem(PREFIX + ':list:/films/:Фильмы', 'directory', {
    title: 'Фильмы',
  });
  page.appendItem(PREFIX + ':list:/series/:Сериалы', 'directory', {
    title: 'Сериалы',
  });
  page.appendItem(PREFIX + ':list:/animation/:Аниме', 'directory', {
    title: 'Аниме',
  });
  page.appendItem(PREFIX + ':list:/cartoons/:Мультфильмы', 'directory', {
    title: 'Мультфильмы',
  });
  page.appendItem(PREFIX + ':list:/collections/196-multfilmy-drimvorks/:Мультфильмы Dreamworks', 'directory', {
    title: 'Мультфильмы Dreamworks',
  });
  page.appendItem(PREFIX + ':list:/show/:Передачи и шоу', 'directory', {
    title: 'Передачи и шоу',
  });
  page.appendItem(PREFIX + ':list:/country/Франция/:Франция', 'directory', {
    title: 'Франция',
  });
  page.appendItem(PREFIX + ':list:/collections/1075-filmy-disney/:фильмы Disney ', 'directory', {
    title: 'фильмы Disney ',
  });
  page.appendItem(PREFIX + ':list:/collections/834-filmy-netflix/:фильмы Netflix ', 'directory', {
    title: 'фильмы Netflix ',
  });
  page.appendItem(PREFIX + ':list:/collections/786-ekranizacii-proizvedeniy-stivena-kinga/:Экранизации произведений Стивена Кинга ', 'directory', {
    title: 'Экранизации произведений Стивена Кинга ',
  });
  page.appendItem(PREFIX + ':list:/collections/659-serialy-bbc/:сериалы BBC ', 'directory', {
    title: 'сериалы BBC ',
  });
  page.appendItem(PREFIX + ':list:/collections/640-serialy-netflix/:сериалы Netflix ', 'directory', {
    title: 'сериалы Netflix ',
  });
  page.appendItem(PREFIX + ':list:/collections/317-luchshie-ekranizacii-literaturnyh-proizvedeniy/:лучшие экранизации литературных произведений ', 'directory', {
    title: 'лучшие экранизации литературных произведений ',
  });
  page.appendItem(PREFIX + ':list:/collections/137-filmy-pro-novyy-god-i-rozhdestvo/:фильмы про новый год и рождество', 'directory', {
    title: 'фильмы про новый год и рождество',
  });
  // page.appendItem(PREFIX + ":list:/collections/:Подборки", "directory", {
  //     title: "Подборки"
  // });
});


function getKeys(response) {
  var playerjs = /src="(\/templates\/.*?playerjs[^"]+)/.exec(response.toString())[1];
  var packed = http.request(BASE_URL+playerjs, {
    headers: {
      'Referer': BASE_URL,
      'User-Agent': UA,
    }}).toString();
  var unpacked = DeanEdwardsUnpacker.unpack(packed);
  match = /u:.*?'([^']+)[\s\S]+?y:.*?'([^']+)/g.exec(unpacked);
  o = {};
  o.y = match[2];
  u = match[1];

  var dechar = function(x) {
    return String.fromCharCode(x);
  };

  var abc = String.fromCharCode(65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122);
  var salt = {
    _keyStr: abc + '0123456789+/=',
    e: function(e) {
      var t = '';
      var n; var r; var i; var s; var o; var u; var a;
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
        if (isNaN(r)) {
          u = a = 64;
        } else if (isNaN(i)) {
          a = 64;
        }
        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
      }
      return t;
    },
    d: function(e) {
      var t = '';
      var n; var r; var i;
      var s; var o; var u; var a;
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
    _ue: function(e) {
      e = e.replace(/\r\n/g, '\n');
      var t = '';
      for (var n = 0; n < e.length; n++) {
        var r = e.charCodeAt(n);
        if (r < 128) {
          t += dechar(r);
        } else if (r > 127 && r < 2048) {
          t += dechar(r >> 6 | 192);
          t += dechar(r & 63 | 128);
        } else {
          t += dechar(r >> 12 | 224);
          t += dechar(r >> 6 & 63 | 128);
          t += dechar(r & 63 | 128);
        }
      }
      return t;
    },
    _ud: function(e) {
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
        } else if (r > 191 && r < 224) {
          c2 = e.charCodeAt(n + 1);
          t += dechar((r & 31) << 6 | c2 & 63);
          n += 2;
        } else {
          c2 = e.charCodeAt(n + 1);
          c3 = e.charCodeAt(n + 2);
          t += dechar((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          n += 3;
        }
      }
      return t;
    },
  };
  var pepper = function(s, n) {
    s = s.replace(/\+/g, '#');
    s = s.replace(/#/g, '+');
    // var a = sugar(o.y) * n;
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
  var sugar = function(x) {
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
        chr = parseInt(encoded, 2);
        result += dechar(chr.toString(10));
      }
    }
    return result.substr(0, result.length - 1);
  };

  var decode = function(x) {
    if (x.substr(0, 2) == '#1') {
      return salt.d(pepper(x.substr(2), -1));
    } else if (x.substr(0, 2) == '#0') {
      return salt.d(x.substr(2));
    } else {
      return x;
    }
  };

  u = /u:.*?'([^']+)/gm.exec(unpacked)[1];
  return (JSON.parse(decode(u)));
}

function clearUrl(url) {
  log.d(service.keys);

  url = fd2(url);

  function fd2(x) {
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
    } catch (e) {
      a = '';
    }

    function b1(str) {
      // console.log(unescape(str));
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
          }));
    }

    function b2(str) {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    }
    return a;
  }
  return url;
}

function scrapeSourceLinks(streams) {
  var returnValue = [];
  // var regex = /(\[.\d+p.*?\])(.*?) or (.*?\d+.mp4)/gm;
  var regex = /(\[.\d+p.*?\])(.*?) or (.*?\.*?\.mp4)/gm;
  while ((m = regex.exec(streams)) !== null) {
    // console.log(m);
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    } // The result can be accessed through the `m`-variable.
    returnValue.push({
      q: m[1],
      hls: m[2],
      mp4: m[3],
    });
  }
  return returnValue;
}

function scrapeSourceSub(streams) {
  var returnValue = [];
  // var regex = /(\[.\d+p.*?\])(.*?) or (.*?\d+.mp4)/gm;
  var regex = /(\[.*?\])(.*?vtt)/gm;
  while ((m = regex.exec(streams)) !== null) {
    // console.log(m);
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    } // The result can be accessed through the `m`-variable.


    returnValue.push({
      language: m[1],
      url: m[2],
      title: m[1],
    });
  }
  return returnValue;
}

function d(sBase64) {
  return String(Duktape.dec('base64', sBase64));
}

var exist = function(x) {
  return x != null && typeof (x) != 'undefined' && x != 'undefined';
};
