/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-var */
exports.contentPage = function (page, mdata) {
//  if (/{/.test(mdata)) data = showtime.JSONDecode(mdata);
//  if (/{/.test(mdata)) data = JSON.parse(mdata);
//  if (/\{/.test(mdata)) data = showtime.JSONDecode(mdata);
  if (/\{/.test(mdata)) data = JSON.parse(mdata);
//  /{"url":"/.test(mdata) ? (data = showtime.JSONDecode(mdata)) : (data.url = mdata);
//  /{"url":"/.test(mdata) ? (data = JSON.parse(mdata)) : (data.url = mdata);
  console.log('moviepage.contentPage called with mdata:', mdata);
  console.log('Parsed data:', data);
  
  // Extract series/film ID from URL if not already present
  if (data.url && !data.id) {
    var idMatch = data.url.match(/\/(?:series|films)\/[^/]+\/(\d+)-/);
    if (idMatch) {
      data.id = idMatch[1];
      console.log('Extracted ID from URL:', data.id);
    }
  }
  
  log.d({
    function: 'moviepage',
//    mdata: showtime.JSONDecode(mdata),
    mdata: JSON.parse(mdata),
    data: data,
  });
  page.metadata.logo = data.icon;
  moviePage(page, data);
};
function getOrigtitle() {
  if (pageHtml.dom.getElementByClassName('b-post__origtitle').length) {
    data.title_en = pageHtml.dom
    .getElementByClassName('b-post__origtitle')[0]
    .textContent.split('/')
    .pop();
  }
};
function getYear() {
//  document.body.innerHTML.match(/year\/([^/]+)/)[1]
  if (/year\/([^/]+)/.exec(pageHtml.text)) data.year = /year\/([^/]+)/.exec(pageHtml.text)[1];
};
function getIcon() {
  if (pageHtml.dom.getElementByClassName('b-sidecover').length) {
    data.icon = pageHtml.dom.getElementByClassName('b-sidecover')[0].getElementByTagName('img')[0].attributes.getNamedItem('src').value;
  }
  data.icon = /^http/.test(data.icon) ? data.icon : BASE_URL + data.icon;
};
function getkpID() {
  if (null != pageHtml.dom.getElementByClassName('kp') && pageHtml.dom.getElementByClassName('kp').length > 0) {
    data.kpID = pageHtml.dom.getElementByClassName('kp');
    data.kpID = pageHtml.dom.getElementByClassName('kp')[0].getElementByTagName('a')[0].attributes.getNamedItem('href').value;
    data.kpID = (/help\/([^/]+)/.exec(data.kpID) || [])[1];
    data.kpID = decodeURIComponent(d(data.kpID));
    data.kpID = data.kpID.match(/[0-9]+/)[0];
  }
};
function moviePage(page, data) {
  log.d({
    function: 'moviePage(page, data)',
    data: data,
  });
  if (data.url) {
    api.call(page, data.url, null, function(pageHtml) {
      getOrigtitle();
      getYear();
      getIcon();
      getkpID();
      yoData = {
        title: data.title,
        icon: data.icon,
        title_en: data.title_en,
        kpID: data.kpID,
        favs: /favs.*?="([^"]+)/.exec(pageHtml.text.toString())[1]
      };
      data.yoData = yoData;
      data.title_year = data.title + (data.year ? ' (' + data.year + ')' : '');
      page.metadata.title = data.title_year;
      page.metadata.logo = data.icon;
      page.type = 'directory';
      data.type = /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.test(pageHtml.text.toString()) ? 'serial' : 'movie';
//      log.d({data77: data});
//      data.favs = /favs.*?="([^"]+)/.exec(pageHtml.text.toString())[1];
//      log.d({data79: data});
      if (data.trID) {
        page.metadata.title = page.metadata.title + ' | ' + data.trID.translator_title;
        if (data.type == 'serial') {
          dom = getSeriesDom(data.id, data.trID.translator_id);//,data.favs);
        }
        data_(dom);
      }
      else {
        dom = pageHtml.dom;
        if (null !== (m = /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.exec(pageHtml.text.toString()))) {
          data.translator_id = m[2];
        }
      }
      data_(dom);
      display_season(page);
      display_translate(page);
//      if (null !== (m = /sof\.tv\.initCDNMoviesEvents\((\d+).*?(\d+).*?({.*?})\);/gm.exec(pageHtml.text.toString()))) {
      if (null !== (m = /sof.tv.initCDNMoviesEvents\((\d+).*?(\d+).*?(\{.*?})\);/gm.exec(pageHtml.text.toString()))) {
        page.metadata.title = page.metadata.title + (undefined == data.play_active ? '' : ' | ' + data.play_active.translator_title);
        page.appendItem('', 'separator', {title: 'Видео:'});
//        log.d({data94: data});
        log.d({data100: data});
        data.translator_id = m[2];
        if (undefined !== data.play_active) {
          playData = data.play_active;
          log.e('********************************');
//          log.e({'playData106': playData});
//          log.e({'playData107': playData});
        }
        else {
          playData = {
            type: data.type,
            id: data.id,
//            favs: data.favs,
//            favs: yoData.favs,
            translator_id: data.translator_id,
            title: data.title,
            year: data.year,
//            icon: pageHtml.dom.getElementByTagName('img')[0].attributes.getNamedItem('src').value,
//            icon: data.icon,
          };
//          log.e({'playData117': playData});
        }
//            title: data.title,
//            id: data.id,
//            translator_id: m[2],
//            type: 'movie',
//            icon: data.icon,
//          };
//          log.d({
//            epData: epData,
//            epData2: epData2,
//          });
//          'play:data': {
//            'id': '39707',
//            'translator_id': '88',
//            'translator_title': 'SDI Media',
//            'camrip': '0',
//            'ads': '0',
//            'director': '0',
//            'type': 'movie',
//            'cdn_url': 0,
//            'active': 1,
//            'title': 'Безумен, но не болен',
//            'icon': 'https://static.hdrezka.ac/i/2021/5/19/pb6235e2c13f4yz70d37i.png',
//          }
//          postdata = {
//            id: data.id,
//            translator_id: data.translator_id,
//            is_camrip: data.camrip,
//            is_ads: data.ads,
//            is_director: data.director,
//            action: 'get_movie',
//          };
//        uri = showtime.JSONEncode(playData);
        uri = JSON.stringify(playData);
//        log.d({playData: playData});
//        log.d({playData147: playData});
        log.d({playData157: playData});
//         item =
//        page.appendItem(PREFIX + ':play:' + uri, 'video', {
        page.appendItem(PREFIX + ':play:' + uri, service.list, {
          title: data.title,
//          icon: pageHtml.dom.getElementByTagName('img')[0].attributes.getNamedItem('src').value,
          icon: data.icon,
//          url: 'url',
/*~
          description: pageHtml.dom.getElementByClassName('b-post__description_text')[0].textContent,
          rating: pageHtml.dom.getElementByClassName('bold')[0].textContent*10,
*/
        })
//  .bindVideoMetadata({filename: data.filename})
            .bindVideoMetadata({
              title: data.title_en ? data.title_en : data.title,
              year: +data.year,
            });
      }
      getPerson(page, data);
/*~
      plist = dom.getElementByClassName('b-post__info');
      var bob = plist[0].getElementByTagName('td').length;
      var re = /\/\/[\s\S]*?\/([\s\S]*?)$/;
      plist = plist[0].getElementByTagName('td')[bob-2].getElementByTagName('a');
      if (plist.length >0) {
        page.appendItem('', 'separator', {title: 'Из серии:'});  
      }
      console.log(plist);
      plist.forEach(function (person) {
        console.log(person.textContent);
        console.log(person.attributes.getNamedItem('href').value);
        page.appendItem(PREFIX + ':list:' +  '/' + re.exec(person.attributes.getNamedItem('href').value)[1] + ':' + person.textContent, 'directory', {title: person.textContent});
//        page.appendItem(PREFIX + ':list:' +  '/' + re.exec(person.attributes.getNamedItem('href').value)[1] + ':' + person.textContent, service.list, {title: person.textContent});
      });
*/
/*
      var pi = dom.getElementByClassName('b-post__info');
      var td = pi[0].getElementByTagName('td').length;
      var piretd = /\/\/[\s\S]*?\/([\s\S]*?)$/;
      var pi = pi[0].getElementByTagName('td')[td-2].getElementByTagName('a');
      if (pi.length >0) {
        page.appendItem('', 'separator', {title: 'Из серии:'});  
      }
      console.log(pi);
      pi.forEach(function (pi) {
        console.log(pi.textContent);
        console.log(pi.attributes.getNamedItem('href').value);
        page.appendItem(PREFIX + ':list:' +  '/' + piretd.exec(pi.attributes.getNamedItem('href').value)[1] + ':' + pi.textContent, 'directory', {title: pi.textContent});
//        page.appendItem(PREFIX + ':list:' +  '/' + piretd.exec(pi.attributes.getNamedItem('href').value)[1] + ':' + pi.textContent, service.list, {title: pi.textContent});
      });
*/
//      page.appendItem('', 'separator', {title: 'ну или:'});
      page.appendItem('', 'separator', {title: 'Поиск:'});
      page.appendItem(PREFIX + ':search:' + data.title, 'directory', {
        title: 'Найти в плагине',
//        icon: '',
        icon: LOGOARROW,
      });
      page.appendItem(PREFIX + ':trackersearch:' + data.title, 'directory', {
        title: 'Найти на трекере',
//        icon: '',
        icon: LOGOARROW,
      });
      page.appendItem('search:' + data.title + ' ' + data.year, 'directory', {
//        title: 'найти ' + data.title + ' ' + data.year + ' в других плагинах',
        title: 'Найти в мовиан',
//        icon: '',
        icon: LOGOARROW,
      });
      page.appendItem('youtube:search:' + data.title + ' ' + data.year, 'directory', {
//        title: '\u043d\u0430\u0439\u0442\u0438 \u043d\u0430 YouTube',
        title: 'Найти на YouTube',
//        icon: '',
        icon: LOGOARROW,
      });
      log.d({yoData139: yoData});
//      page.appendItem('yo:search:' + showtime.JSONEncode(yoData), 'directory', {
      page.appendItem('yo:search:' + JSON.stringify(yoData), 'directory', {
//        title: 'найти другой плеер',
        title: 'Найти из Yohoho',
//        icon: '',
        icon: LOGOARROW,
      });
    });
  }
};
function getPerson(page) {
  log.d({
    function: 'getPerson185',
  });
  try {
    if ((plist = dom.getElementByClassName('persons-list-holder')).length) {
      plist.forEach(function (i) {
        page.appendItem('', 'separator', {
//          title: i.textContent.search(':') >= 0 ? 'В ролях актеры:' : 'Режиссер:',
          title: i.textContent.search(':') >= 0 ? 'Актеры:' : 'Режиссер:',
        });
        i.getElementByClassName('item').forEach(function (person) {
          if (person.getElementByTagName('a').length) {
            id = person.getElementByClassName('person-name-item')[0].attributes.getNamedItem('data-id').value;
            pid = person.getElementByClassName('person-name-item')[0].attributes.getNamedItem('data-pid').value;
            icon = person.getElementByClassName('person-name-item')[0].attributes.getNamedItem('data-photo').value;
            href = person.getElementByTagName('a')[0].attributes.getNamedItem('href').value;
//            href = person.getElementByTagName('a')[0].attributes.getNamedItem('href').value.replace(BASE_URL, '');
            href = href.replace(/http.*?:\/\/.*?\//g, '/').trim();
            title = person.getElementByClassName('person-name-item')[0].textContent;
            URI = PREFIX + ':list:' + href + ':' + title;
/*
//            var personpage = showtime.httpReq(encodeURI(href));
//            var personpage = http.request(encodeURI(href));
//            var personpage = showtime.httpReq(encodeURI(BASE_URL + href));
            var personpage = http.request(encodeURI(BASE_URL + href));
//            var personicon = /sidecover[\s\S]*?src="([\s\S]*?)"/g.exec(personpage)[1];
            var personicon = /sidecover.*?src="(.*?)"/g.exec(personpage)[1];
*/
//            page.appendItem(URI, 'directory', {
//            page.appendItem(URI, 'video', {
            page.appendItem(URI, service.list, {
              title: title,
//              icon: pageHtml.dom.getElementByTagName('img')[0].attributes.getNamedItem('src').value,
              icon: icon,
//              icon: data.icon,
//              icon: LOGOARROW,
//              icon: LOGOFOLDER,
//              icon: personicon,
            });
          }
        });
      });
    }
  }
  catch (error) {
    console.error('error in getPerson');
    console.error('Line #' + error.lineNumber);
    console.error(error.stack);
  }
};
/*~
function getPerson(page, data) {
  if ((plist = dom.getElementByClassName('persons-list-holder')).length) {
    plistd = plist[0].getElementByTagName('a');
    page.appendItem('', 'separator', {title: 'Режиссер:'});
    plistd.forEach(function (person) {
      console.log(person.textContent);
      console.log(person.attributes.getNamedItem('href').value);
      var re = /[\s\S]*?\/\/[\s\S]*?\/([\s\S]*?)$/g;
      personurl = re.exec(person.attributes.getNamedItem('href').value)[1];
//      showtime.notify(personurl,5);
//      popup.notify(personurl,5);
//      var kinopage = showtime.httpReq(encodeURI(BASE_URL + '/' + personurl));
      var kinopage = http.request(encodeURI(BASE_URL + '/' + personurl));
      var kinoface = /sidecover[\s\S]*?src="([\s\S]*?)"/g.exec(kinopage)[1];
//      var iconurl = /actor\/+([\d]+).jpg/;
      var iconurl = /ищете[\s\S]*?href="\/name\/([\s\S]*?)\//;
      var kinopoisk = 'https://www.kinopoisk.ru/index.php?kp_query=';
//      page.appendItem(PREFIX + ':list:' + '/' + personurl + ':' + person.textContent, 'video', {
      page.appendItem(PREFIX + ':list:' + '/' + personurl + ':' + person.textContent, service.list, {
        title: person.textContent,
//        icon: 'https://st.kp.yandex.net/images/sm_actor/21459.jpg',
        icon: kinoface,
      });
    });
    plista = plist[1].getElementByTagName('a');
    page.appendItem('', 'separator', {title: 'Актеры:'});
    plista.forEach(function (person) {
      console.log(person.textContent);
      console.log(person.attributes.getNamedItem('href').value);
      var re = /[\s\S]*?\/\/[\s\S]*?\/([\s\S]*?)$/g;
      personurl = re.exec(person.attributes.getNamedItem('href').value)[1];
//      showtime.notify(personurl,5);
//      popup.notify(personurl,5);
//      var kinopage = showtime.httpReq(encodeURI(BASE_URL + '/' + personurl));
      var kinopage = http.request(encodeURI(BASE_URL + '/' + personurl));
      var kinoface = /sidecover[\s\S]*?src="([\s\S]*?)"/g.exec(kinopage)[1];
//      var iconurl = /actor\/+([\d]+).jpg/;
      var iconurl = /ищете[\s\S]*?href="\/name\/([\s\S]*?)\//;
      var kinopoisk = 'https://www.kinopoisk.ru/index.php?kp_query=';
//      page.appendItem(PREFIX + ':list:' + '/' + personurl + ':' + person.textContent, 'video', {
      page.appendItem(PREFIX + ':list:' + '/' + personurl + ':' + person.textContent, service.list, {
        title: person.textContent,
        icon: kinoface,
      });
    });
  }
};
*/
// getSeries(page, id, trId);
function getSeriesDom(id, translator_id) {
//  resp = showtime.httpReq(BASE_URL + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
  resp = http.request(BASE_URL + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
    debug: 1,
//     arg: {t: new Date().getTime()},
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
      'accept': '*/*',
      'accept-language': 'ru,en-US;q=0.9,en;q=0.8,zh;q=0.7',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'pragma': 'no-cache',
      'x-requested-with': 'XMLHttpRequest',
    },
    postdata: {
      id: id,
      translator_id: translator_id,
      favs: yoData.favs,
      action: 'get_episodes',
    },
  }).toString();
  log.d({
    '229resp': resp,
  });
  data.translator_id = translator_id;
//  seasons = '<ul id="simple-seasons-tabs" class="b-simple_seasons__list clearfix">' + showtime.JSONDecode(resp).seasons + '</ul>';
  seasons = '<ul id="simple-seasons-tabs" class="b-simple_seasons__list clearfix">' + JSON.parse(resp).seasons + '</ul>';
//  episodes = '<div id="simple-episodes-tabs">' + showtime.JSONDecode(resp).episodes + '</div>';
  episodes = '<div id="simple-episodes-tabs">' + JSON.parse(resp).episodes + '</div>';
  dom = '<html><body>' + seasons + episodes + '</body></html>';
  dom = html.parse(dom).root;
  return dom;
};
function data_(dom) {
//  log.e({'data256': data});
  log.e({'261 Function data_(dom)': data});
  log.e('*************************');
  log.e(dom);
  log.e('*************************');
  log.e(data);
  log.e('*************************');
  log.e(yoData);
  log.e('*************************');
  if (null !== (tlist = dom.getElementById('translators-list'))) {
    data.tr = [];
    data.type = /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.test(pageHtml.text.toString()) ? 'serial' : 'movie';
    tlist.children.forEach(function (element, index) {
      if (data.type == 'movie') {
        data.tr[index] = {
          title: data.title,
          id: element.attributes.getNamedItem('data-id').value,
          translator_id: element.attributes.getNamedItem('data-translator_id').value,
          translator_title: element.attributes.getNamedItem('title').value,
          icon: data.icon,
          camrip: element.attributes.getNamedItem('data-camrip').value,
          ads: element.attributes.getNamedItem('data-ads').value,
          director: element.attributes.getNamedItem('data-director').value,
          type: /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.test(pageHtml.text.toString()) ? 'serial' : 'movie',
          cdn_url: element.attributes.getNamedItem('data-cdn_url') == null ? 0 : element.attributes.getNamedItem('data-cdn_url').value,
          active: 0,
        };
      }
      else {
        data.tr[index] = {
//           title: element.attributes.getNamedItem('title').value,
          id: data.id,
          translator_id: element.attributes.getNamedItem('data-translator_id').value,
          translator_title: element.attributes.getNamedItem('title').value,
          type: /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.test(pageHtml.text.toString()) ? 'serial' : 'movie',
          cdn_url: element.attributes.getNamedItem('data-cdn_url') == null ? 0 : element.attributes.getNamedItem('data-cdn_url').value,
          active: 0,
        };
      }
      if ((/active/).test(element.attributes.getNamedItem('class').value)) {
        data.tr[index].active = 1;
        data.translator_id = element.attributes.getNamedItem('data-translator_id').value;
        data.play_active = data.tr[index];
        data.play_active.title = data.title;
        data.play_active.icon = data.icon;
      }
    });
  }
  if (null !== (slist = dom.getElementById('simple-seasons-tabs'))) {
    data.season = [];
    slist.children.forEach(function (element, index) {
      data.season[index] = {
        title: element.textContent,
        ep: [],
      };
    });
  }
//   [... document.getElementById('simple-episodes-tabs').children].forEach(function (stab){console.log(eptab.children)})
//   [... document.getElementById('simple-episodes-tabs').children].forEach(function (stab, index){console.log(elist = eptab.children)})
  if (null !== dom.getElementById('simple-episodes-tabs')) {
    if (data.season == undefined) {
      data.season = [];
      data.season[0] = {
        title: '',
        ep: [],
      };
    }
    dom.getElementById('simple-episodes-tabs').children.forEach(function (stab, index) {
      eplist = stab.children;
      eplist.forEach(function (ep) {
        epData = {
          title: ep.textContent,
//          icon: data.icon,
          translator_id: data.translator_id,
//           cdn_url: ep.attributes.getNamedItem('data-cdn_url').value,
          id: ep.attributes.getNamedItem('data-id').value,
          season_id: ep.attributes.getNamedItem('data-season_id').value,
          episode_id: ep.attributes.getNamedItem('data-episode_id').value,
//          favs: data.favs,
//          favs: yoData.favs,
        };
        data.season[index].ep.push(epData);
      });
    });
  }
  //log.e({'data335': data});
};
function display_translate(page) {
  if (data.tr) {
    page.appendPassiveItem('separator', null, {title: 'В русской озвучке от:'});
    data.tr.forEach(function (tr, index) {
      trData = {
        title: data.title,
        id: data.id,
//         tr: data.tr,
        url: data.url,
        trID: tr,
        type: data.type,
      };
      epData = data.tr[index];
      if (data.type == 'serial') {
//        uri = PREFIX + ':moviepage:' + showtime.JSONEncode(trData);
        uri = PREFIX + ':moviepage:' + JSON.stringify(trData);
      }
      else {
//        uri = PREFIX + ':play:' + showtime.JSONEncode(epData);
        uri = PREFIX + ':play:' + JSON.stringify(epData);
      }
//       uri = PREFIX + ':moviepage:' + showtime.JSONEncode(trData);
//       uri = PREFIX + ':moviepage:' + JSON.stringify(trData);
//      page.appendItem(uri, 'video', {
//      page.appendItem(uri, 'directory', {
      page.appendItem(uri, service.list, {
        title: tr.translator_title,
        icon: data.icon,
        description: tr,
      });
    });
  }
};
function display_season(page) {
  console.log('display_season called with data:', {
    id: data.id,
    title: data.title,
    type: data.type,
    season_count: data.season ? data.season.length : 0
  });

  if (data.season) {
    page.appendPassiveItem('separator', null, {title: 'Сезоны:'});

    // Check for last watched episode to focus on the correct season
    var lastWatchedKey = 'lastWatched_' + data.id;
    var lastWatchedEpisode = resumeStore[lastWatchedKey];
    var focusSeasonIndex = -1;

    if (lastWatchedEpisode) {
      console.log('Last watched episode found:', lastWatchedEpisode);
      // Find which season contains the last watched episode
      data.season.forEach(function (seasonElement, seasonIndex) {
        var found = seasonElement.ep.some(function (episode) {
          return episode.season_id == lastWatchedEpisode.season_id &&
                 episode.episode_id == lastWatchedEpisode.episode_id;
        });
        if (found) {
          focusSeasonIndex = seasonIndex;
          console.log('Found last watched episode in season index:', seasonIndex);
        }
      });
    } else {
      console.log('No last watched episode found for series:', data.id);
    }

    data.season.forEach(function (seasonElement, seasonIndex) {
      // Create season data for navigation
      var seasonData = {
        id: data.id,
        title: data.title,
        title_year: data.title_year,
        icon: data.icon,
        translator_id: data.translator_id,
        season_index: seasonIndex,
        season_title: seasonElement.title,
        episodes: seasonElement.ep,
        type: 'serial'
      };

      var uri = PREFIX + ':SEASON:' + JSON.stringify(seasonData);

      var item = page.appendItem(uri, service.list, {
        title: seasonElement.title,
        icon: data.icon,
        description: seasonElement.ep.length + ' эпизодов',
        autofocus: (seasonIndex === focusSeasonIndex)
      });

      if (seasonIndex === focusSeasonIndex) {
        console.log('Setting autofocus on season:', seasonElement.title);
      }
    });
  } else {
    console.log('No seasons data found');
  }
  page.loading = false;
};