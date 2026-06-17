/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-var */
var moviepage = require('./moviepage');

data = {};
//data = [];
function scrapeList(page, href, pageHtml) {
  var returnValue = [];
  content = pageHtml.dom.getElementByClassName('b-content__inline_items');
  var filterCountriesPage = page.model.options.filterCountries && page.model.options.filterCountries.value == '1';
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
  // Detect if current href is a "best" view (contains /best/<year>/ or /best/<genre>/<year>/)
  var bestMatch = (/\/best\/(?:[^\/]+\/)?(\d{4})\/?$/.exec(params.href));
  var isBestView = bestMatch !== null;
  // Compute default year = current date minus 4 months
  var _now = new Date();
  var _dt_minus4 = new Date(_now.getFullYear(), _now.getMonth() - 4, 1);
  var defaultYear = _dt_minus4.getFullYear();
  var currentYear = _now.getFullYear();
  var currentBestYear = isBestView ? parseInt(bestMatch[1], 10) : (store.yearPage || defaultYear);
  // If this is a best view, expose a page-level year selector in page options
    if (isBestView) {
      page.options.createInt('bestYear', 'Год', currentBestYear, currentYear - 100, currentYear, 1, ' г.', function (v) {
        // Coerce and validate the selected value. If reset/invalid, use the defaultYear (current date - 4 months).
        var selYear = parseInt(v, 10);
        // Persist chosen year to store as well
        store.yearPage = selYear;

        // Update params.href to use the selected year. Support both /best/<year>/ and /best/<genre>/<year>/ forms.
        var bestYearRegex = /\/best\/(?:[^\/]+\/)?(\d{4})\/?$/;
        if (bestYearRegex.test(params.href)) {
          // Replace the trailing year component
          params.href = params.href.replace(bestYearRegex, function (match, p1) {
            var prefix = match.replace(/(\d{4})\/?$/, '');
            return prefix + selYear + '/';
          });
        } else if (params.href.indexOf('/best/') !== -1) {
          // If somehow /best/ present but different format, append year
          params.href = params.href.replace(/\/$/, '') + '/' + selYear + '/';
        } else {
          // No best segment present, append standard /best/<year>/ suffix
          params.href = params.href.replace(/\/$/, '') + '/best/' + selYear + '/';
        }

        // Update page title immediately so UI reflects chosen year and genre (if selected)
        try {
          var currentGenreLabel = null;
          try {
            var partsNow = params.href.split('/').filter(function (p) { return p.length; });
            // Expect partsNow like ['films','best','western','2026']
            if (partsNow.length >= 4 && partsNow[1] === 'best') {
              var baseNow = '/' + partsNow[0];
              var genreNow = partsNow[2];
              if (genreNow && cat) {
                var selPathNow = baseNow + '/' + genreNow + '/';
                for (var cj = 0; cj < cat.length; cj++) {
                  if (cat[cj][0] === selPathNow) { currentGenreLabel = cat[cj][1]; break; }
                }
              }
            }
          } catch (e) { /* ignore */ }
          if (currentGenreLabel && currentGenreLabel !== 'Все') {
            page.metadata.title = params.title + ' - ' + currentGenreLabel + ' (' + selYear + ')';
          } else {
            page.metadata.title = params.title + ' (' + selYear + ')';
          }
        } catch (e) {
          // If page isn't fully initialized, ignore
        }
        if (page.asyncPaginator) reload();
      });
      // Page-level option: filter by countries in item description
      // When enabled, only show items whose description contains one of the specified countries
      page.options.createBool('filterCountries', 'Фильтр стран', store.filterCountriesPage == true, function (v) {
        store.filterCountriesPage = v;
        if (page.asyncPaginator) reload();
      });
    }

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
         if (page.asyncPaginator) {
           reload();
         }
       }, true);
    }
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
    // If URL already contains a genre (best or regular), update the page title now to include it
    if (cat) {
      try {
        var partsNow = params.href.split('/').filter(function (p) { return p.length; });
        // Best URL form: ['films','best','western','2026']
        if (partsNow.length >= 4 && partsNow[1] === 'best') {
          var genreNow = partsNow[2];
          var yearNow = partsNow[3];
          var selPathNow = '/' + partsNow[0] + '/' + genreNow + '/';
          var genreLabelNow = null;
          for (var gi = 0; gi < cat.length; gi++) {
            if (cat[gi][0] === selPathNow) { genreLabelNow = cat[gi][1]; break; }
          }
          if (genreLabelNow && genreLabelNow !== 'Все') {
            page.metadata.title = params.title + ' - ' + genreLabelNow + ' (' + yearNow + ')';
          } else if (yearNow) {
            page.metadata.title = params.title + ' (' + yearNow + ')';
          }
        }
        // Regular URL form: ['films','comedy']
        else if (partsNow.length >= 2) {
          var selPathReg = '/' + partsNow[0] + '/' + partsNow[1] + '/';
          var genreLabelReg = null;
          for (var gk = 0; gk < cat.length; gk++) {
            if (cat[gk][0] === selPathReg) { genreLabelReg = cat[gk][1]; break; }
          }
          if (genreLabelReg && genreLabelReg !== 'Все') {
            page.metadata.title = params.title + ' - ' + genreLabelReg;
          }
        }
      } catch (e) { /* ignore */ }
    }
    if (cat) {
      page.options.createMultiOpt('genres', 'Жанры', cat, function (newhref) {
        log.d(params);
        log.d('params inside genres');
        // Preserve /best/<year>/ only if current view is a best view
        if (isBestView) {
          var m = /\/best\/(?:[^\/]+\/)?(\d{4})\/?$/.exec(params.href);
          var yearToUse = m ? m[1] : (store.yearPage || currentBestYear);
          // Build URL as /<category>/best/<genre?>/<year>/
          var parts = newhref.split('/').filter(function (p) { return p.length; });
          var base = parts.length > 0 ? '/' + parts[0] : '';
          var genreSeg = parts.length > 1 ? parts[1] : '';
          if (genreSeg) {
            params.href = base + '/best/' + genreSeg + '/' + yearToUse + '/';
          } else {
            params.href = base + '/best/' + yearToUse + '/';
          }
          // Update page title to include the selected year and genre (if any)
          try {
            var genreLabel = null;
            if (genreSeg && cat) {
              var selPath = base + '/' + genreSeg + '/';
              for (var ci = 0; ci < cat.length; ci++) {
                if (cat[ci][0] === selPath) { genreLabel = cat[ci][1]; break; }
              }
            }
            if (genreLabel && genreLabel !== 'Все') {
              page.metadata.title = params.title + ' - ' + genreLabel + ' (' + yearToUse + ')';
            } else {
              page.metadata.title = params.title + ' (' + yearToUse + ')';
            }
          } catch (e) {
            // ignore if page not ready
          }
        } else {
          params.href = newhref;
          // Not a best view — ensure title is reset to base title
          try {
            page.metadata.title = params.title;
          } catch (e) {}
        }
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
  // If this is a best view, append year to the page title (e.g. "Лучшие фильмы (2026)")
  var bestTitleMatch = /\/best\/(?:[^\/]+\/)?(\d{4})\/?/.exec(params.href);
  if (bestTitleMatch) {
    page.metadata.title = params.title + ' (' + bestTitleMatch[1] + ')';
  } else {
    page.metadata.title = params.title;
  }
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

    var uri = JSON.stringify({
        season_id: season_id,
        episode_id: episode_id,
        title: episode_title,
        series_id: data.id,
        translator_id: data.translator_id,
        type: 'serial'
  });

    var item = page.appendItem(PREFIX + ':play:' + uri, service.list, {
      title: episode_title,
      icon: data.icon,
      autofocus: (episodeIndex === focusEpisodeIndex),
      focusable: (episodeIndex === focusEpisodeIndex) ? 1.5 : 1.0,
    });

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









