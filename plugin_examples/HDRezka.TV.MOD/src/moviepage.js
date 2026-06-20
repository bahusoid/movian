var metadata = require('native/metadata');

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
  log.d('moviepage.contentPage called with mdata:', mdata);
  log.d('Parsed data:', data);
  
  // Extract series/film ID from URL if not already present
  if (data.url && !data.id) {
    var idMatch = data.url.match(/\/(\d+)-[^\/]+\.html$/);
    if (idMatch) {
      data.id = idMatch[1];
      log.d('Extracted ID from URL:', data.id);
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

function getTitleYear(data) {
  if(data.title_year)
    return data.title_year;
  return data.title + (data.year ? ' (' + data.year + ')' : '');
}

function getCanonicalUrl(data) {
  return PREFIX + ':play:'
      + 'type=' + data.type
      + '&id=' + (data.series_id || data.id)
      + '&tr_id=' + data.translator_id
      + '&s=' + (data.season_id || '')
      + '&e=' + (data.episode_id || '');
}
exports.getCanonicalUrl = getCanonicalUrl;
function bindPlayInfo(item, data) {
  item.root.canonical_url = getCanonicalUrl(data);
  metadata.bindPlayInfo(item.root, item.root.canonical_url);
}
exports.bindPlayInfo = bindPlayInfo;

function moviePage(page, data) {
  log.d({
    function: 'moviePage(page, data)',
    data: data,
  });
  if (!data.url)
    return;

  api.call(page, data.url, null, function (pageHtml) {
    getOrigtitle();
    getYear();
    getIcon();
    getkpID();
    var desc = pageHtml.dom.getElementByClassName('b-post__description_text')[0].textContent;
    data.description = desc;
    yoData = {
      title: data.title,
      icon: data.icon,
      title_en: data.title_en,
      kpID: data.kpID,
      favs: /favs.*?="([^"]+)/.exec(pageHtml.text.toString())[1]
    };
    data.yoData = yoData;
    data.title_year = getTitleYear(data);
    page.metadata.title = data.title_year;
    page.metadata.logo = data.icon;
    page.type = 'directory';
    data.type = /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.test(pageHtml.text.toString()) ? 'serial' : 'movie';
//      log.d({data77: data});
//      data.favs = /favs.*?="([^"]+)/.exec(pageHtml.text.toString())[1];
//      log.d({data79: data});
    if (data.trID) {
      page.metadata.title = page.metadata.title + ' | ' + data.trID.translator_title;
      data.translator_id = data.trID.translator_id; // Update translator_id for selected translator
      if (data.type == 'serial') {
        dom = getSeriesDom(data.id, data.trID.translator_id, null);//,data.favs);
      }
      data_(dom);
    } else {
      dom = pageHtml.dom;
      if (null !== (m = /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.exec(pageHtml.text.toString()))) {
        data.translator_id = m[2];
      }
    }
    data_(dom);
    display_season(page);
    display_translate(page);
//      if (null !== (m = /sof\.tv\.initCDNMoviesEvents\((\d+).*?(\d+).*?({.*?})\);/gm.exec(pageHtml.text.toString()))) {
    if (data.season) {
    } //Skip Видео: section
    else if (data.play_active_is_premium && !service.Premium) {
      log.d('Default active translator is premium and Premium is disabled — skipping movie "Видео:" section');
    } else if (null !== (m = /sof.tv.initCDNMoviesEvents\((\d+).*?(\d+).*?(\{.*?})\);/gm.exec(pageHtml.text.toString()))) {
      var active_translator_title =
          (data.play_active && data.play_active.translator_title) || '';
      if (active_translator_title)
         active_translator_title = '  | ' + active_translator_title;
      page.appendItem('', 'separator', {title: 'Видео' + active_translator_title + ':'});
//        log.d({data94: data});
      log.d({data100: data});
      data.translator_id = m[2];
      if (undefined !== data.play_active) {
        playData = data.play_active;
        log.e('********************************');
//          log.e({'playData106': playData});
//          log.e({'playData107': playData});
      } else {
        playData = {
          type: data.type,
          id: data.id,
//            favs: data.favs,
//            favs: yoData.favs,
          translator_id: data.translator_id,
          title: data.title,
          year: data.year,
          description: data.description,
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
      log.d({playData157: playData});
      var item = page.appendItem(PREFIX + ':play:' + uri, service.list, {
        title: data.title,
//          icon: pageHtml.dom.getElementByTagName('img')[0].attributes.getNamedItem('src').value,
        icon: data.icon,
//          url: 'url',
        description: data.description,
        /*
                rating: pageHtml.dom.getElementByClassName('bold')[0].textContent*10,
        */
      });
      bindPlayInfo(item, data);
      //console.log("MOVIE CANONICAL URL: " + item.root.canonical_url);

      if (service.tvdb) {
        item
            .bindVideoMetadata({
              title: data.title_en ? data.title_en : data.title,
              year: +data.year,
            });
      }
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
        log.d(plist);
        plist.forEach(function (person) {
          log.d(person.textContent);
          log.d(person.attributes.getNamedItem('href').value);
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
        log.d(pi);
        pi.forEach(function (pi) {
          log.d(pi.textContent);
          log.d(pi.attributes.getNamedItem('href').value);
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
    page.appendItem('search:' + data.title + ' ' + data.year, 'directory', {
//        title: 'найти ' + data.title + ' ' + data.year + ' в других плагинах',
      title: 'Найти в мовиан',
//        icon: '',
      icon: LOGOARROW,
    });
    /*
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
*/
    display_franchise(page, pageHtml.dom);
    page.loading = false;
  });
}
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
      log.d(person.textContent);
      log.d(person.attributes.getNamedItem('href').value);
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
      log.d(person.textContent);
      log.d(person.attributes.getNamedItem('href').value);
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

function getSeriesDom(id, translator_id, season_index) {
  var resp = http.request(BASE_URL + '/ajax/get_cdn_series/?t=' + new Date().getTime(), {
    debug: 1,
    headers: {
      'user-agent': UA,
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
      action: 'get_episodes',
    },
  }).toString();
  var respJson = JSON.parse(resp);
  log.d('getSeriesDom response:', respJson);
  var dom;
  if (season_index !== null) {
    var episodes = '<div id="simple-episodes-tabs">' + respJson.episodes + '</div>';
    dom = '<html><body>' + episodes + '</body></html>';
  } else {
    var seasons = '<ul id="simple-seasons-tabs" class="b-simple_seasons__list clearfix">' + respJson.seasons + '</ul>';
    dom = '<html><body>' + seasons + '</body></html>';
  }
 
  return html.parse(dom).root;
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
      // Detect if the default/active translator is a premium one (even if we skip it)
      var classAttr = element.attributes.getNamedItem('class') ? element.attributes.getNamedItem('class').value : '';
      if (/b-prem_translator/.test(classAttr) && /active/.test(classAttr)) {
        data.play_active_is_premium = true;
      }
      // Skip premium translators when Premium setting is false
      if (!service.Premium && /b-prem_translator/.test(classAttr)) {
        log.d('Skipping premium translator due to Premium setting: ' + (element.attributes.getNamedItem('data-translator_id') ? element.attributes.getNamedItem('data-translator_id').value : 'unknown'));
        return; // continue to next element
      }
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
        //Seems it's enough to have season_index but for now emulate episodes data-season_id from response 
        season_id: index + 1,
        ep: [],
      };
    });
  }
//   [... document.getElementById('simple-episodes-tabs').children].forEach(function (stab){log.d(eptab.children)})
//   [... document.getElementById('simple-episodes-tabs').children].forEach(function (stab, index){log.d(elist = eptab.children)})

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
      var serial = data.type === 'serial';
      if (serial) {
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

      var item = page.appendItem(uri, service.list, {
        title: tr.translator_title,
        icon: data.icon,
        description: data.description,
      });
      if (!serial)
        bindPlayInfo(item, epData);
    });
  }
};

function normalizeFranchiseUrl(url) {
  if (!url) return null;

  if (/^https?:\/\//.test(url)) {
    var match = url.match(/^https?:\/\/[^/]+(\/.*)$/);
    return match ? BASE_URL + match[1] : url;
  }

  return url.charAt(0) === '/' ? BASE_URL + url : BASE_URL + '/' + url;
};

function getFranchiseItems(pageDom) {
  var franchise = [];
  var blocks = pageDom.getElementByClassName('b-post__partcontent');

  if (!blocks || !blocks.length) {
    return franchise;
  }

  var items = blocks[0].getElementByClassName('b-post__partcontent_item');
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemClass = item.attributes.getNamedItem('class');
    var isCurrent = itemClass && /current/.test(itemClass.value);

    var title = '';
    var links = item.getElementByTagName('a');
    if (links && links.length) {
      title = links[0].textContent;
    }

    if (!title && item.getElementByClassName('title').length) {
      title = item.getElementByClassName('title')[0].textContent;
    }

    title = title ? title.trim() : '';

    var itemUrl = null;
    if (item.attributes.getNamedItem('data-url')) {
      itemUrl = item.attributes.getNamedItem('data-url').value;
    }
    if (!itemUrl && links && links.length && links[0].attributes.getNamedItem('href')) {
      itemUrl = links[0].attributes.getNamedItem('href').value;
    }

    itemUrl = normalizeFranchiseUrl(itemUrl);
    if ((!itemUrl && !isCurrent) || !title) {
      continue;
    }

    var year = '';
    if (item.getElementByClassName('year').length) {
      year = item.getElementByClassName('year')[0].textContent.trim();
    }

    var rating = '';
    if (item.getElementByClassName('rating').length) {
      rating = item.getElementByClassName('rating')[0].textContent.trim();
      if (!rating || !(rating[0] >= '0' && rating[0] <= '9')) {
        rating = '';
      }
    }

    franchise.push({
      title: title,
      url: itemUrl,
      year: year,
      rating: rating,
      isCurrent: isCurrent,
    });
  }

  return franchise;
};

function display_franchise(page, pageDom) {
  var franchiseItems = getFranchiseItems(pageDom);

  if (!franchiseItems.length) {
    return;
  }

  page.appendPassiveItem('separator', null, {title: 'Все части'});
  franchiseItems.forEach(function (item) {
    var itemTitle = item.title;
    if (item.year) {
      itemTitle += ' (' + item.year + ')';
    }
    if (item.rating) {
      itemTitle += ' (' + item.rating + ')';
    }

    if (item.isCurrent) {
      var currentTitle = itemTitle;
      if (typeof RichText !== 'undefined' && typeof coloredStr === 'function') {
        currentTitle = new RichText(coloredStr(itemTitle, green));
      }

      page.appendPassiveItem('directory', '', {
        title: currentTitle,
        icon: data.icon,
      });
      return;
    }

    var franchiseData = {
      url: item.url,
      title: item.title,
    };

    page.appendItem(PREFIX + ':moviepage:' + JSON.stringify(franchiseData), 'directory', {
      title: itemTitle,
      icon: LOGOARROW,
    });
  });
};

function display_season(page) {
  log.d('display_season called with data:', {
    id: data.id,
    title: data.title,
    type: data.type,
    season_count: data.season ? data.season.length : 0
  });
  // If the page's default/active translator is a premium translator and Premium is disabled,
  // do not display the default "Сезоны:" section — show only available translations.
  if (data.play_active_is_premium && !service.Premium && data.season) {
    log.d('Default active translator is premium and Premium is disabled — skipping seasons display');
  }
  else
  if (data.season) {
    page.appendPassiveItem('separator', null, {title: 'Сезоны:'});

    // Check for last watched episode to focus on the correct season
    var lastWatchedKey = 'lastWatched_' + data.id;
    var lastWatchedEpisode = resumeStore[lastWatchedKey];
    var focusSeasonIndex = -1;

    if (lastWatchedEpisode) {
      log.d('Last watched episode found:', lastWatchedEpisode);
      // Find which season contains the last watched episode
      data.season.forEach(function (seasonElement, seasonIndex) {
        if (seasonElement.season_id == lastWatchedEpisode.season_id) {
          focusSeasonIndex = seasonIndex;
          log.d('Found last watched episode in season index:', seasonIndex);
        }
      });
    } else {
      log.d('No last watched episode found for series:', data.id);
    }

    data.season.forEach(function (seasonElement, seasonIndex) {
      // Create season data for navigation
      var seasonData = {
        id: data.id,
        title: data.title,
        title_en: data.title_en,
        year: data.year,
        icon: data.icon,
        translator_id: data.translator_id,
        season_index: seasonIndex,
        season_title: seasonElement.title,
        season_id: seasonElement.season_id,
//        episodes: seasonElement.ep,
        type: 'serial'
      };

      var uri = PREFIX + ':SEASON:' + JSON.stringify(seasonData);

      var item = page.appendItem(uri, service.list, {
        title: seasonElement.title,
        icon: data.icon,
        description: data.description,
        autofocus: (seasonIndex === focusSeasonIndex),
        focusable: (seasonIndex === focusSeasonIndex) ? 1.5 : 1.0,
      });

      if (seasonIndex === focusSeasonIndex) {
        log.d('Setting autofocus on season:', seasonElement.title);
      }
    });
  } else {
    log.d('No seasons data found');
  }
};

// Export getSeriesDom for use in other modules
exports.getSeriesDom = getSeriesDom;
exports.getTitleYear = getTitleYear;