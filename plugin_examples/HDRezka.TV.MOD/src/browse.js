/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-var */
var moviepage = require('./moviepage');

var russian_genre = 'russian/';
var ukrainian_genre = 'ukrainian/';

films_cat = [
  ['', 'Все', true],
  ['arthouse/', 'Арт-хаус'],
  ['biographical/', 'Биографические'],
  ['action/', 'Боевики'],
  ['western/', 'Вестерны'],
  ['military/', 'Военные'],
  ['detective/', 'Детективы'],
  ['kids/', 'Детские'],
  ['documentary/', 'Документальные'],
  ['drama/', 'Драмы'],
  ['historical/', 'Исторические'],
  ['comedy/', 'Комедии'],
  ['concert/', 'Концерт'],
  ['short/', 'Короткометражные'],
  ['crime/', 'Криминал'],
  ['melodrama/', 'Мелодрамы'],
  ['musical/', 'Мюзиклы'],
  ['cognitive/', 'Познавательные'],
  ['adventures/', 'Приключения'],
  ['travel/', 'Путешествия'],
  ['family/', 'Семейные'],
  ['sport/', 'Спортивные'],
  ['standup/', 'Стендап'],
  ['theatre/', 'Театр'],
  ['thriller/', 'Триллеры'],
  ['horror/', 'Ужасы'],
  ['fiction/', 'Фантастика'],
  ['fantasy/', 'Фэнтези'],
  ['erotic/', 'Эротика'],
  ['foreign/', 'Зарубежные'],
  [russian_genre, 'Русские'],
  [ukrainian_genre, 'Украинские'],
];
series_cat = [
  ['', 'Все', true],
  ['foreign/', 'Зарубежные'],
  ['russian/', 'Русские'],
  ['ukrainian/', 'Украинские'],
  ['arthouse/', 'Арт-хаус'],
  ['biographical/', 'Биографические'],
  ['action/', 'Боевики'],
  ['western/', 'Вестерны'],
  ['military/', 'Военные'],
  ['detective/', 'Детективы'],
  ['documentary/', 'Документальные'],
  ['drama/', 'Драмы'],
  ['historical/', 'Исторические'],
  ['comedy/', 'Комедии'],
  ['crime/', 'Криминал'],
  ['melodrama/', 'Мелодрамы'],
  ['musical/', 'Музыкальные'],
  ['adventures/', 'Приключения'],
  ['realtv/', 'Реальное ТВ'],
  ['family/', 'Семейные'],
  ['sport/', 'Спортивные'],
  ['standup/', 'Стендап'],
  ['telecasts/', 'Телепередачи'],
  ['thriller/', 'Триллеры'],
  ['horror/', 'Ужасы'],
  ['fiction/', 'Фантастика'],
  ['fantasy/', 'Фэнтези'],
  ['erotic/', 'Эротика'],
];
cartoons_cat = [
  ['', 'Все', true],
  ['anime/', 'Аниме'],
  ['arthouse/', 'Арт-хаус'],
  ['biographical/', 'Биографические'],
  ['action/', 'Боевики'],
  ['western/', 'Вестерны'],
  ['military/', 'Военные'],
  ['detective/', 'Детективы'],
  ['kids/', 'Детские'],
  ['adult/', 'Для взрослых'],
  ['documentary/', 'Документальные'],
  ['drama/', 'Драмы'],
  ['historical/', 'Исторические'],
  ['comedy/', 'Комедии'],
  ['short/', 'Короткометражные'],
  ['crime/', 'Криминал'],
  ['melodrama/', 'Мелодрамы'],
  ['multseries/', 'Мультсериалы'],
  ['musical/', 'Мюзиклы'],
  ['cognitive/', 'Познавательные'],
  ['full-length/', 'Полнометражные'],
  ['adventures/', 'Приключения'],
  ['family/', 'Семейные'],
  ['fairytale/', 'Сказки'],
  ['sport/', 'Спортивные'],
  ['thriller/', 'Триллеры'],
  ['horror/', 'Ужасы'],
  ['fiction/', 'Фантастика'],
  ['fantasy/', 'Фэнтези'],
  ['erotic/', 'Эротика'],
  ['foreign/', 'Зарубежные'],
  [russian_genre, 'Русские'],
  ['soyzmyltfilm/', 'Советские'],
  [ukrainian_genre, 'Украинские'],
];
animation_cat = [
  ['', 'Все', true],
  ['action/', 'Боевики'],
  ['fighting/', 'Боевые искусства'],
  ['military/', 'Военные'],
  ['detective/', 'Детективы'],
  ['kids/', 'Детские'],
  ['drama/', 'Драмы'],
  ['historical/', 'Исторические'],
  ['kodomo/', 'Кодомо'],
  ['comedy/', 'Комедии'],
  ['mahoushoujo/', 'Махо-сёдзё'],
  ['mecha/', 'Меха'],
  ['mystery/', 'Мистические'],
  ['musical/', 'Музыкальные'],
  ['educational/', 'Образовательные'],
  ['parody/', 'Пародия'],
  ['everyday/', 'Повседневность'],
  ['adventures/', 'Приключения'],
  ['romance/', 'Романтические'],
  ['samurai/', 'Самурайский боевик'],
  ['shoujo/', 'Сёдзё'],
  ['shoujoai/', 'Сёдзё-ай'],
  ['shounen/', 'Сёнэн'],
  ['shounenai/', 'Сёнэн-ай'],
  ['fairytale/', 'Сказки'],
  ['sport/', 'Спортивные'],
  ['thriller/', 'Триллеры'],
  ['horror/', 'Ужасы'],
  ['fiction/', 'Фантастика'],
  ['fantasy/', 'Фэнтези'],
  ['school/', 'Школа'],
  ['erotic/', 'Эротика'],
  ['ecchi/', 'Этти'],
];

var categories = [
  { hrefPrefix: '/films/', cat: films_cat },
  { hrefPrefix: '/series/', cat: series_cat },
  { hrefPrefix: '/cartoons/', cat: cartoons_cat },
  { hrefPrefix: '/animation/', cat: animation_cat },
];

var skip_country_filter = false;
data = {};
//data = [];
function scrapeList(page, href, pageHtml) {
  var returnValue = [];
  content = pageHtml.dom.getElementByClassName('b-content__inline_items');
  var filterCountriesPage = !skip_country_filter &&  page.model.options.filterCountries && page.model.options.filterCountries.value == '1';
//  document.getElementsByClassName('b-content__inline_item')
  if ((elements = pageHtml.dom.getElementByClassName('b-content__inline_item'))) {
    for (i = 0; i < elements.length; i++) {
      element = elements[i];
      // Safely extract link href and fall back if match fails
      var aElem = element.getElementByTagName('a')[0];
      var hrefVal = (aElem && aElem.attributes && aElem.attributes.getNamedItem('href')) ? aElem.attributes.getNamedItem('href').value : '';
      var m = hrefVal.match(/https?:\/\/[^\/]+(\/.*)/);
      var relPath = m ? m[1] : hrefVal;
      var imgElem = element.getElementByTagName('img')[0];
      var iconVal = (imgElem && imgElem.attributes && imgElem.attributes.getNamedItem('src')) ? imgElem.attributes.getNamedItem('src').value : null;
      var titleElem = element.getElementByClassName('b-content__inline_item-link')[0];
      var titleText = (titleElem && titleElem.getElementByTagName('a')[0]) ? titleElem.getElementByTagName('a')[0].textContent : '';
      var descrText = (titleElem && titleElem.children[1] && titleElem.children[1].textContent) ? titleElem.children[1].textContent.trim() : null;
      var yearMatch = descrText ? descrText.match(/^\d+/) : null;
      var yearVal = yearMatch ? parseInt(yearMatch[0], 10) : null;

      // If this is a Best view and the page-level country filter is enabled, filter list items
      var skipMovie = false;
      if (filterCountriesPage) {
        var countries = ['Россия', 'Казахстан', 'Китай', 'Корея Южная'];
        var desc = descrText.toLowerCase();
        for (var ci = 0; ci < countries.length; ci++) {
          skipMovie = desc.indexOf(countries[ci].toLowerCase()) !== -1;
          if (skipMovie)
             break;
        }
      }

      if(skipMovie)
        continue;

      returnValue.push({
        url: BASE_URL + relPath,
        id: (element.attributes && element.attributes.getNamedItem('data-id')) ? element.attributes.getNamedItem('data-id').value : null,
        icon: iconVal,
        title: titleText,
        year: yearVal,
        description: descrText,
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

function startsWith(str, prefix, position) {
  position = position || 0;
  if (str.length < prefix.length + position)
    return false;

  for (var i = 0; i < prefix.length; i++) {
    if (str[position + i] !== prefix[i])
      return false;
  }
  return true;
}

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
      list = scrapeList(page, url, pageHtml);
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
  var initialization = true;

  var result = null;
  for (var i = 0; i < categories.length; i++) {
    if (startsWith(params.href, categories[i].hrefPrefix)) {
      result = categories[i];
      break;
    }
  }

  // Detect if current href is a "best" view (contains /best/<year>/ or /best/<genre>/<year>/)
  var isBestView = result && startsWith(params.href, 'best/', result.hrefPrefix.length);
  var genre = null;
  function page_reload() {
    if (!initialization ) {
      var genreFilter = page.model.options.genres;
      var genreTitle = genreFilter && genreFilter.current.title;
      page.metadata.title = params.title
          + (genre ?  ' - ' + genreTitle : '')
      ;

      if (isBestView) {
        page.metadata.title += ' (' + store.yearPage + ')';
        //[series/films/cartoons/animation]/[genre/]
        //[series/films/cartoons/animation]/best/[genre/][year/]
        params.href = result.hrefPrefix + 'best/'
            + (genre ? genre + '/' : '')
            + store.yearPage + '/';
      }
      if (page.asyncPaginator)
        reload();
    }
  }

  // If this is a best view, expose a page-level year selector in page options
  if (isBestView) {
    // Compute default year = current date minus 4 months
    var now = new Date();
    var dt_minus4 = new Date(now.getFullYear(), now.getMonth() - 4, 1);
    var defaultYear = dt_minus4.getFullYear();
    var currentYear = now.getFullYear();

    page.options.createInt('bestYear', 'Год', defaultYear, currentYear - 100, currentYear, 1, ' г.', function (v) {
      store.yearPage = v;
      page_reload();
    });
    // Page-level option: filter by countries in item description
    // When enabled, only show items whose description contains one of the specified countries
    page.options.createBool('filterCountries', 'Фильтр стран', store.filterCountriesPage == true, function (v) {
      store.filterCountriesPage = v;
      page_reload();
    });
  }

  var cat_new = params.href == '/new/';
  if (cat_new) {
    type = [
      ['0', 'Все', true],
      ['1', 'Фильмы'],
      ['2', 'Сериалы'],
      ['3', 'Мультфильмы'],
      ['82', 'Аниме'],
      ['4', 'Передачи и шоу'],
    ];
    page.options.createMultiOpt('genre', 'Тип', type, function (genre) {
      genre > 0 ? (params.args.genre = genre) : delete params.args.genre;
      page_reload();
    }, true);
  }
  if (cat_new || !/.*?do=search.*/.test(params.href)) {
    // Do not show "Выбрать" (order) when browsing Best pages
    if (!isBestView) {
      order = [
        ['last', 'Последние поступления', true],
        ['popular', 'Популярные'],
        ['watching', 'Сейчас смотрят'],
        ['soon', 'В ожидании'],
      ];
      page.options.createMultiOpt('order', 'Выбрать', order, function (filter) {
        params.args.filter = filter;
        page_reload();
      }, true);
    }

    if (result) {
      page.options.createMultiOpt('genres', 'Жанры', result.cat, function (v) {
        genre = v;
        params.href = result.hrefPrefix + (genre ? genre : '');

        skip_country_filter = genre === russian_genre  || genre === ukrainian_genre;
        page_reload();
      }, true);
    }
  }

  initialization = false;
  page_reload();
}
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
      list = scrapeList(page, url, pageHtml);
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
//    log.d(day);
//    [... i.children[1].children].forEach(function (i) {
//      log.d(title = i.textContent);
//      log.d(i.getElementsByTagName('a')[0].href)
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
  page.metadata.title = moviepage.getTitleYear(data) + ' | ' + data.season_title;
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
    log.d('Last watched episode found for season page:', lastWatchedEpisode);
    episodes.forEach(function (episodeElement, episodeIndex) {
      if (episodeElement.episode_id == lastWatchedEpisode.episode_id) {
        focusEpisodeIndex = episodeIndex;
        log.d('Found last watched episode at index:', episodeIndex);
      }
    });
  } else {
    log.d('No last watched episode found for series:', data.id);
  }

  // Display episodes for this season
  episodes.forEach(function (episodeElement, episodeIndex) {
    var episode_title = episodeElement.title;
    var season_id = data.season_id;
    var episode_id = episodeElement.episode_id;

    var uriData = {
      season_id: season_id,
      episode_id: episode_id,
      title: episode_title,
      series_id: data.id,
      translator_id: data.translator_id,
      type: 'serial'
    };
    var uri = JSON.stringify(uriData);
    var item = page.appendItem(PREFIX + ':play:' + uri, service.list, {
      title: episode_title,
      icon: data.icon,
      autofocus: (episodeIndex === focusEpisodeIndex),
      focusable: (episodeIndex === focusEpisodeIndex) ? 1.5 : 1.0,
    });
    moviepage.bindPlayInfo(item, uriData);

    if (episodeIndex === focusEpisodeIndex) {
      log.d('Setting autofocus on episode:', episode_title);
    }

  if (service.tvdb) {
    item.bindVideoMetadata({
          title: (data.title_en ? data.title_en : data.title) +
              ' S' + (season_id < 10 ? '0' + season_id : season_id) +
              'E' + (episode_id < 10 ? '0' + episode_id : episode_id),
          // Adding year breaks metadata lookup for some reason, so skipping it for now
          // year: +data.year,
          // season: season_id,
          // episode: +episode_id
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









