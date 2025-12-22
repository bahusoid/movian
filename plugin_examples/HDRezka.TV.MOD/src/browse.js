/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-var */
var moviepage = require('./moviepage');

data = {};
//data = [];
function scrapeList(href, pageHtml) {
  var returnValue = [];
  content = pageHtml.dom.getElementByClassName('b-content__inline_items');
//  document.getElementsByClassName('b-content__inline_item')
  if ((elements = pageHtml.dom.getElementByClassName('b-content__inline_item'))) {
    for (i = 0; i < elements.length; i++) {
      element = elements[i];
      returnValue.push({
        url: BASE_URL + element.getElementByTagName('a')[0].attributes.getNamedItem('href').value.match(/http.*?\/\/.*?(\/.*)/)[1],
        id: element.attributes.getNamedItem('data-id').value,
        icon: element.getElementByTagName('img')[0].attributes.getNamedItem('src').value,
        title: element.getElementByClassName('b-content__inline_item-link')[0].getElementByTagName('a')[0].textContent,
        year: +element.getElementByClassName('b-content__inline_item-link')[0].children[1].textContent.match(/^\d+/),
//        description: element.getElementByClassName('b-content__inline_item-link')[0].children[1].textContent,
      });
    }
  }
//  endOfData = document.getElementsByClassName('navigation').length ? document.getElementsByClassName('pagesList')[0].children[document.getElementsByClassName('pagesList')[0].children.length - 2].nodeName !== 'A' : true
//  document.getElementsByClassName('pagination').length ? document.getElementsByClassName('pagination')[0].getElementsByTagName('a')[document.getElementsByClassName('pagination')[0].getElementsByTagName('a').length - 2].attributes.length > 1 : true
//  !document.getElementsByClassName('navibut')[0].children[1].getElementsByTagName('a').length
//  if (pageHtml.dom.getElementByClassName('nnext').length !== 0) {
//    returnValue.endOfData = !pageHtml.dom.getElementByClassName('nnext')[0].getElementByTagName('a').length;
//  }
//  else returnValue.endOfData = true;
  if ((navigation = pageHtml.dom.getElementByClassName('b-navigation')[0])) {
    returnValue.endOfData = navigation.children[navigation.children.length - 1].attributes[0].value == 'no-page';
  }
  else returnValue.endOfData = true;
  log.d(returnValue.endOfData);
  return returnValue;
};
function populateItemsFromList(page, list) {
//  page.metadata.logo ='https://static.hdrezka.ac/i/2016/10/25/r7ee1f9b6161fvo87q99i.jpg';
  page.metadata.logo = LOGO;
  log.d({
    function: 'populateItemsFromList',
    list: list,
  });
  page.entries = 0;
  for (i = 0; i < list.length; i++) {
//    page.appendItem(PREFIX + ':moviepage:' + showtime.JSONEncode(list[i]), 'video', {
//    page.appendItem(PREFIX + ':moviepage:' + JSON.stringify(list[i]), 'video', {
//    page.appendItem(PREFIX + ':moviepage:' + showtime.JSONEncode(list[i]), service.list, {
    page.appendItem(PREFIX + ':moviepage:' + JSON.stringify(list[i]), service.list, {
      title: list[i].title,
      description: list[i].description,
      icon: /^http/.test(list[i].icon) ? list[i].icon : BASE_URL + list[i].icon,
    });
    page.entries++;
  }
};
exports.searcher = function (page, params) {
  log.d('exports.searcher');
  log.d(params);
  page.loading = true;
//  page.metadata.logo = LOGO;
  page.model.contents = 'grid';
  page.type = 'directory';
  page.entries = 0;
  var nPage = 1;
  params.args = {};
//  query = params.href.replace('/?do=search&subaction=search&q=', '');
//  page.appendItem(PREFIX + ':search:' + query, 'video', {
//  page.appendItem(PREFIX + ':search:' + query, service.list, {
//    title: 'Покажи мне больше',
//    description: '',
//  });
  function loader() {
    log.d(params);
    url = params.page ? params.href + params.page : params.href; // + "/";
    log.d('url=' + url);
    api.call(page, BASE_URL + url, params.args, function (pageHtml) {
      list = scrapeList(url, pageHtml);
      populateItemsFromList(page, list);
      nPage++;
      params.page = '&page=' + nPage;
      page.haveMore(list.endOfData !== undefined && !list.endOfData);
    });
  };
  page.asyncPaginator = loader;
  loader();
};
function select_cat(params, page, reload) {
  if (params.href == '/new/') {
    type = [
      ['0', 'Все', true],
      ['1', 'Фильмы'],
      ['2', 'Сериалы'],
      ['3', 'Мультфильмы'],
      ['82', 'Аниме'],
//      ['4', 'ТВ шоу'],
      ['4', 'Передачи и шоу'],
    ];
    page.options.createMultiOpt('genre', 'Тип', type, function (genre) {
      genre > 0 ? (params.args.genre = genre) : delete params.args.genre;
      if (page.asyncPaginator) reload();
    }, true);
  }
  if (params.href == '/new/' || !/.*?do=search.*/.test(params.href)) {
    order = [
      ['last', 'Последние поступления', true],
      ['popular', 'Популярные'],
      ['watching', 'Сейчас смотрят'],
      ['soon', 'В ожидании'],
    ];
    page.options.createMultiOpt('order', 'Выбрать', order, function (filter) {
      params.args.filter = filter;
      if (page.asyncPaginator) {
        reload();
      }
    }, true);
    cat = '';
    films_cat = [
      ['/films/', 'Все', true],
      ['/films/foreign/', 'Зарубежные'],
//      ['/films/our/', 'Наши'],
      ['/films/our/', 'Отечественные'],
      ['/films/ukrainian/', 'Украинские'],
      ['/films/arthouse/', 'Арт-хаус'],
      ['/films/biographical/', 'Биографические'],
      ['/films/action/', 'Боевики'],
      ['/films/western/', 'Вестерны'],
      ['/films/military/', 'Военные'],
      ['/films/detective/', 'Детективы'],
      ['/films/kids/', 'Детские'],
      ['/films/documentary/', 'Документальные'],
      ['/films/drama/', 'Драмы'],
      ['/films/historical/', 'Исторические'],
      ['/films/comedy/', 'Комедии'],
      ['/films/concert/', 'Концерт'],
      ['/films/short/', 'Короткометражные'],
      ['/films/crime/', 'Криминал'],
      ['/films/melodrama/', 'Мелодрамы'],
      ['/films/musical/', 'Мюзиклы'],
      ['/films/cognitive/', 'Познавательные'],
      ['/films/adventures/', 'Приключения'],
      ['/films/travel/', 'Путешествия'],
      ['/films/family/', 'Семейные'],
      ['/films/sport/', 'Спортивные'],
      ['/films/standup/', 'Стендап'],
      ['/films/theatre/', 'Театр'],
      ['/films/thriller/', 'Триллеры'],
      ['/films/horror/', 'Ужасы'],
      ['/films/fiction/', 'Фантастика'],
      ['/films/fantasy/', 'Фэнтези'],
      ['/films/erotic/', 'Эротика'],
    ];
    series_cat = [
      ['/series/', 'Все', true],
      ['/series/foreign/', 'Зарубежные'],
//      ['/series/russian/', 'Русские'],
      ['/series/russian/', 'Отечественные'],
      ['/series/ukrainian/', 'Украинские'],
      ['/series/arthouse/', 'Арт-хаус'],
      ['/series/biographical/', 'Биографические'],
      ['/series/action/', 'Боевики'],
      ['/series/western/', 'Вестерны'],
      ['/series/military/', 'Военные'],
      ['/series/detective/', 'Детективы'],
      ['/series/documentary/', 'Документальные'],
      ['/series/drama/', 'Драмы'],
      ['/series/historical/', 'Исторические'],
      ['/series/comedy/', 'Комедии'],
      ['/series/crime/', 'Криминал'],
      ['/series/melodrama/', 'Мелодрамы'],
      ['/series/musical/', 'Музыкальные'],
      ['/series/adventures/', 'Приключения'],
      ['/series/realtv/', 'Реальное ТВ'],
      ['/series/family/', 'Семейные'],
      ['/series/sport/', 'Спортивные'],
      ['/series/standup/', 'Стендап'],
      ['/series/telecasts/', 'Телепередачи'],
      ['/series/thriller/', 'Триллеры'],
      ['/series/horror/', 'Ужасы'],
      ['/series/fiction/', 'Фантастика'],
      ['/series/fantasy/', 'Фэнтези'],
      ['/series/erotic/', 'Эротика'],
    ];
    cartoons_cat = [
      ['/cartoons/', 'Все', true],
      ['/cartoons/foreign/', 'Зарубежные'],
//      ['/cartoons/our/', 'Наши'],
      ['/cartoons/our/', 'Отечественные'],
      ['/cartoons/soyzmyltfilm/', 'Советские'],
      ['/cartoons/ukrainian/', 'Украинские'],
      ['/cartoons/anime/', 'Аниме'],
      ['/cartoons/arthouse/', 'Арт-хаус'],
      ['/cartoons/biographical/', 'Биографические'],
      ['/cartoons/action/', 'Боевики'],
      ['/cartoons/western/', 'Вестерны'],
      ['/cartoons/military/', 'Военные'],
      ['/cartoons/detective/', 'Детективы'],
      ['/cartoons/kids/', 'Детские'],
      ['/cartoons/adult/', 'Для взрослых'],
      ['/cartoons/documentary/', 'Документальные'],
      ['/cartoons/drama/', 'Драмы'],
      ['/cartoons/historical/', 'Исторические'],
      ['/cartoons/comedy/', 'Комедии'],
      ['/cartoons/short/', 'Короткометражные'],
      ['/cartoons/crime/', 'Криминал'],
      ['/cartoons/melodrama/', 'Мелодрамы'],
      ['/cartoons/multseries/', 'Мультсериалы'],
      ['/cartoons/musical/', 'Мюзиклы'],
      ['/cartoons/cognitive/', 'Познавательные'],
      ['/cartoons/full-length/', 'Полнометражные'],
      ['/cartoons/adventures/', 'Приключения'],
      ['/cartoons/family/', 'Семейные'],
      ['/cartoons/fairytale/', 'Сказки'],
      ['/cartoons/sport/', 'Спортивные'],
      ['/cartoons/thriller/', 'Триллеры'],
      ['/cartoons/horror/', 'Ужасы'],
      ['/cartoons/fiction/', 'Фантастика'],
      ['/cartoons/fantasy/', 'Фэнтези'],
      ['/cartoons/erotic/', 'Эротика'],
    ];
    animation_cat = [
      ['/animation/', 'Все', true],
      ['/animation/action/', 'Боевики'],
      ['/animation/fighting/', 'Боевые искусства'],
      ['/animation/military/', 'Военные'],
      ['/animation/detective/', 'Детективы'],
      ['/animation/kids/', 'Детские'],
      ['/animation/drama/', 'Драмы'],
      ['/animation/historical/', 'Исторические'],
      ['/animation/kodomo/', 'Кодомо'],
      ['/animation/comedy/', 'Комедии'],
      ['/animation/mahoushoujo/', 'Махо-сёдзё'],
      ['/animation/mecha/', 'Меха'],
      ['/animation/mystery/', 'Мистические'],
      ['/animation/musical/', 'Музыкальные'],
      ['/animation/educational/', 'Образовательные'],
      ['/animation/parody/', 'Пародия'],
      ['/animation/everyday/', 'Повседневность'],
      ['/animation/adventures/', 'Приключения'],
      ['/animation/romance/', 'Романтические'],
      ['/animation/samurai/', 'Самурайский боевик'],
      ['/animation/shoujo/', 'Сёдзё'],
      ['/animation/shoujoai/', 'Сёдзё-ай'],
      ['/animation/shounen/', 'Сёнэн'],
      ['/animation/shounenai/', 'Сёнэн-ай'],
      ['/animation/fairytale/', 'Сказки'],
      ['/animation/sport/', 'Спортивные'],
      ['/animation/thriller/', 'Триллеры'],
      ['/animation/horror/', 'Ужасы'],
      ['/animation/fiction/', 'Фантастика'],
      ['/animation/fantasy/', 'Фэнтези'],
      ['/animation/school/', 'Школа'],
      ['/animation/erotic/', 'Эротика'],
      ['/animation/ecchi/', 'Этти'],
    ];
    if (/films/.test(params.href)) {
      cat = films_cat;
    }
    if (/series/.test(params.href)) {
      cat = series_cat;
    }
    if (/cartoons/.test(params.href)) {
      cat = cartoons_cat;
    }
    if (/animation/.test(params.href)) {
      cat = animation_cat;
    }
    if (cat) {
      page.options.createMultiOpt('genres', 'Жанры', cat, function (newhref) {
        log.d(params);
        log.d('params inside genres');
        params.href = newhref;
        if (page.asyncPaginator) {
          reload();
        }
      }, true);
    }
  }
};
exports.list = function (page, params) {
  page.loading = true;
  page.metadata.icon = LOGO;
  page.metadata.title = params.title;
  page.model.contents = 'grid';
  page.type = 'directory';
  page.entries = 0;
  log.d('exports.list');
  log.d(params);
  log.d('params.args:' + params.args);
  var nPage = 1;
  params.args = {};
  function loader() {
    log.d(params);
    url = params.page ? params.href + params.page : params.href; // + "/";
    log.d('url=' + url);
    api.call(page, BASE_URL + url, params.args, function (pageHtml) {
      if (/person/.test(url)) {
        page.metadata.icon = pageHtml.dom.getElementByTagName('img')[0].attributes.getNamedItem('src').value;
      }
      list = scrapeList(url, pageHtml);
      populateItemsFromList(page, list);
      nPage++;
      params.page = 'page/' + nPage + '/';
      page.haveMore(list.endOfData !== undefined && !list.endOfData);
    });
  };
  function reload() {
    log.d(params);
    log.d('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzreload');
    delete params.page;
    nPage = 1;
    page.flush();
    loader();
  };
  select_cat(params, page, reload);
  page.asyncPaginator = loader;
  loader();
};
exports.updates = function (page, params) {
  page.loading = true;
  page.metadata.logo = LOGO;
  page.metadata.title = params.title;
  page.type = 'directory';
  url = params.page ? params.href + params.page : params.href;
  api.call(page, BASE_URL + url, params.args, function (pageHtml) {
//  items = document.getElementsByClassName('b-seriesupdate__block');
    items = pageHtml.dom.getElementByClassName('b-seriesupdate__block');
    items.forEach(function (i) {
      day = i.children[0].textContent;
      page.appendItem('', 'separator', {title: day});
      i.children[1].children.forEach(function (i) {
        if (i.getElementByTagName('a').length !== 0 && i.textContent) {
          title = i.textContent;
          href = i.getElementByTagName('a')[0].attributes.getNamedItem('href').value;
          id = /(\d+)/.exec(href)[1];
          data = {
            url: BASE_URL + href,
            id: id,
            icon: null,
            title: title.split('(')[0],
            year: null,
          };
//          page.appendItem(PREFIX + ':moviepage:' + showtime.JSONEncode(data), 'directory', {
          page.appendItem(PREFIX + ':moviepage:' + JSON.stringify(data), 'directory', {
//          page.appendItem(PREFIX + ':moviepage:' + showtime.JSONEncode(data), service.list, {
//          page.appendItem(PREFIX + ':moviepage:' + JSON.stringify(data), service.list, {
            title: title,
//            icon: data.icon,
//            icon: LOGOARROW,
            icon: LOGOFOLDER,
          });
        }
      });
    });
  });
//  [... items].forEach(function (i) {
//    day = i.children[0].textContent;
//    console.log(day);
//    [... i.children[1].children].forEach(function (i) {
//      console.log(title = i.textContent);
//      console.log(i.getElementsByTagName('a')[0].href)
//    });
//  })
  page.loading = false;
};
exports.season = function (page, data) {
  data = JSON.parse(data);
  log.d({
    route: 'season',
    data: data,
  });
  page.loading = true;
  page.type = 'directory';
  page.metadata.title = data.title_year + ' | ' + data.season_title;
  page.metadata.logo = data.icon;

  // Load episodes dynamically
  var dom = moviepage.getSeriesDom(data.id, data.translator_id, data.season_index);
  var episodes = [];
  var seasonEpisodesDom = dom.getElementById('simple-episodes-tabs').children[data.season_index];
  if (seasonEpisodesDom) {
    seasonEpisodesDom.children.forEach(function (ep) {
      var epData = {
        title: ep.textContent,
        //translator_id: data.translator_id,
        //season_id: ep.attributes.getNamedItem('data-season_id').value,
        episode_id: ep.attributes.getNamedItem('data-episode_id').value,
      };
      episodes.push(epData);
    });
  }
  

  // Check for last watched episode in this season
  var lastWatchedKey = 'lastWatched_' + data.id;
  var lastWatchedEpisode = resumeStore[lastWatchedKey];
  var focusEpisodeIndex = -1;

  if (lastWatchedEpisode && data.season_id == lastWatchedEpisode.season_id) {
    console.log('Last watched episode found for season page:', lastWatchedEpisode);
    episodes.forEach(function (episodeElement, episodeIndex) {
      if (episodeElement.episode_id == lastWatchedEpisode.episode_id) {
        focusEpisodeIndex = episodeIndex;
        console.log('Found last watched episode at index:', episodeIndex);
      }
    });
  } else {
    console.log('No last watched episode found for series:', data.id);
  }

  // Display episodes for this season
  episodes.forEach(function (episodeElement, episodeIndex) {
    var episodeTitle = episodeElement.title;

    var episodeData = {
      season_id: data.season_id,
      episode_id: episodeElement.episode_id,
      title: episodeTitle,
      series_id: data.id,
      translator_id: data.translator_id,
      type: 'serial'
    };

    var uri = JSON.stringify(episodeData);

    var item = page.appendItem(PREFIX + ':play:' + uri, service.list, {
      title: episodeTitle,
      icon: data.icon,
      autofocus: (episodeIndex === focusEpisodeIndex),
      focusable: (episodeIndex === focusEpisodeIndex) ? 1.5 : 1.0,
    });

    if (episodeIndex === focusEpisodeIndex) {
      console.log('Setting autofocus on episode:', episodeTitle);
    }

    if (service.tvdb) {
      item.bindVideoMetadata({
        title: (data.title_en ? data.title_en : data.title) +
        ' S' + (data.season_id < 10 ? '0' + data.season_id : data.season_id) +
        'E' + (episodeElement.episode_id < 10 ? '0' + episodeElement.episode_id : episodeElement.episode_id),
      });
    }
  });

  page.loading = false;
};
//function link(e, t, n) {
//  var r = '/serial/' + n + '/iframe';
//  var i = '';
//  80 != options.port && (i = ':' + options.port);
//  var o = 1 == options.nocontrols ? '1' : '';
//  var s = 1 == options.nocontrols_translations ? '1' : '';
//  var a = 1 == options.nocontrols_seasons ? '1' : '';
//  var u = '?season=' + e + '&episode=' + t; // + '&nocontrols=' + o + '&nocontrols_translations=' + s + '&nocontrols_seasons=' + a
//  return options.proto + options.host + i + r + u;
//};
function fix_0(n) {return n > 9 ? '' + n : '0' + n};