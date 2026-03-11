/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-var */
data = {};
// data = [];

function scrapeList(href, pageHtml) {
  var returnValue = [];
  content = pageHtml.dom.getElementByClassName('b-content__inline_items');
  // document.getElementsByClassName('b-content__inline_item')
  if ((elements = pageHtml.dom.getElementByClassName('b-content__inline_item'))) {
    for (i = 0; i < elements.length; i++) {
      element = elements[i];

      returnValue.push({
        url: BASE_URL + element.getElementByTagName('a')[0].attributes.getNamedItem('href').value.match(/http.*?\/\/.*?(\/.*)/)[1],
        id: element.attributes.getNamedItem('data-id').value,
        icon: element.getElementByTagName('img')[0].attributes.getNamedItem('src').value,
        title: element.getElementByClassName('b-content__inline_item-link')[0].getElementByTagName('a')[0].textContent,
        year: +element.getElementByClassName('b-content__inline_item-link')[0].children[1].textContent.match(/^\d+/),
        // description: element.getElementByClassName("b-content__inline_item-link")[0].children[1].textContent
      });
    }
  }
  // endOfData = document.getElementsByClassName('navigation').length ? document.getElementsByClassName('pagesList')[0].children[document.getElementsByClassName('pagesList')[0].children.length - 2].nodeName !== 'A' : true
  // document.getElementsByClassName('pagination').length ? document.getElementsByClassName('pagination')[0].getElementsByTagName('a')[document.getElementsByClassName('pagination')[0].getElementsByTagName('a').length - 2].attributes.length > 1 : true
  // !document.getElementsByClassName('navibut')[0].children[1].getElementsByTagName('a').length
  // if (pageHtml.dom.getElementByClassName("nnext").length !== 0) {
  //     returnValue.endOfData = !pageHtml.dom.getElementByClassName("nnext")[0].getElementByTagName("a").length;
  // } else returnValue.endOfData = true;
  if ((navigation = pageHtml.dom.getElementByClassName('b-navigation')[0])) {
    returnValue.endOfData = navigation.children[navigation.children.length - 1].attributes[0].value == 'no-page';
  } else returnValue.endOfData = true;
  log.d(returnValue.endOfData);
  return returnValue;
}
function populateItemsFromList(page, list) {
  page.metadata.logo ='https://static.hdrezka.ac/i/2016/10/25/r7ee1f9b6161fvo87q99i.jpg';
  log.d({
    function: 'populateItemsFromList',
    list: list,
  });
  page.entries = 0;
  for (i = 0; i < list.length; i++) {
    page.appendItem(PREFIX + ':moviepage:' + JSON.stringify(list[i]), 'video', {
      title: list[i].title,
      description: list[i].description,
      icon: /^http/.test(list[i].icon) ? list[i].icon : BASE_URL + list[i].icon,
    });
    page.entries++;
  }
}
exports.searcher = function(page, params) {
  log.d('exports.searcher');
  log.d(params);

  page.loading = true;
  page.metadata.logo = LOGO;
  page.model.contents = 'grid';
  page.type = 'directory';
  page.entries = 0;

  var nPage = 1;
  params.args = {};

  // query = params.href.replace('/?do=search&subaction=search&q=', '');
  // page.appendItem(PREFIX + ':search:' + query, 'video', {
  //     title: 'Show me more',
  //     description: ''
  // });
  function loader() {
    log.d(params);
    url = params.page ? params.href + params.page : params.href; // + "/";
    // https://rezka.ag/index.php?do=search&subaction=search&q=lost&page=1
    log.d('url=' + url);
    api.call(page, BASE_URL + url, params.args, function(pageHtml) {
      list = scrapeList(url, pageHtml);
      populateItemsFromList(page, list);
      nPage++;
      // https://rezka.ag/index.php?do=search&subaction=search&q=lost&page=1
      params.page = '&page=' + nPage;
      page.haveMore(list.endOfData !== undefined && !list.endOfData);
    });
  }
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
      ['4', 'ТВ шоу'],
      ['82', 'Аниме'],
    ];
    page.options.createMultiOpt('genre', 'Type', type, function(genre) {
      genre > 0 ? (params.args.genre = genre) : delete params.args.genre;
      if (page.asyncPaginator) reload();
    }, true);
  }
  if (params.href == '/new/' || !/.*?do=search.*/.test(params.href)) {
    order = [
      ['last', 'Последние поступления', true],
      ['popular', 'Популярные'],
      ['watching', 'Сейчас смотрят'],
    ];
    page.options.createMultiOpt('order', 'Order by', order, function(filter) {
      params.args.filter = filter;
      if (page.asyncPaginator) {
        reload();
      }
    }, true);
    cat = '';
    films_cat = [
      ['/films/', 'Any', true],
      ['/films/arthouse/', 'Арт-хаус'],
      ['/films/biographical/', 'Биографические'],
      ['/films/action/', 'Боевики'],
      ['/films/western/', 'Вестерны'],
      ['/films/military/', 'Военные'],
      ['/films/detective/', 'Детективы'],
      ['/films/kids/', 'Детские'],
      ['/films/documentary/', 'Документальные'],
      ['/films/drama/', 'Драмы'],
      ['/films/foreign/', 'Зарубежные'],
      ['/films/historical/', 'Исторические'],
      ['/films/comedy/', 'Комедии'],
      ['/films/short/', 'Короткометражные'],
      ['/films/crime/', 'Криминал'],
      ['/films/melodrama/', 'Мелодрамы'],
      ['/films/musical/', 'Мюзиклы'],
      ['/films/our/', 'Наши'],
      ['/films/cognitive/', 'Познавательные'],
      ['/films/adventures/', 'Приключения'],
      ['/films/travel/', 'Путешествия'],
      ['/films/family/', 'Семейные'],
      ['/films/sport/', 'Спортивные'],
      ['/films/thriller/', 'Триллеры'],
      ['/films/horror/', 'Ужасы'],
      ['/films/ukrainian/', 'Украинские'],
      ['/films/fiction/', 'Фантастика'],
      ['/films/fantasy/', 'Фэнтези'],
      ['/films/erotic/', 'Эротика'],
    ];
    series_cat = [
      ['/series/', 'Any', true],
      ['/series/arthouse/', 'Арт-хаус'],
      ['/series/biographical/', 'Биографические'],
      ['/series/action/', 'Боевики'],
      ['/series/western/', 'Вестерны'],
      ['/series/military/', 'Военные'],
      ['/series/detective/', 'Детективы'],
      ['/series/documentary/', 'Документальные'],
      ['/series/drama/', 'Драмы'],
      ['/series/foreign/', 'Зарубежные'],
      ['/series/historical/', 'Исторические'],
      ['/series/comedy/', 'Комедии'],
      ['/series/crime/', 'Криминал'],
      ['/series/melodrama/', 'Мелодрамы'],
      ['/series/musical/', 'Музыкальные'],
      ['/series/adventures/', 'Приключения'],
      ['/series/realtv/', 'Реальное ТВ'],
      ['/series/russian/', 'Русские'],
      ['/series/family/', 'Семейные'],
      ['/series/sport/', 'Спортивные'],
      ['/series/telecasts/', 'Телепередачи'],
      ['/series/thriller/', 'Триллеры'],
      ['/series/horror/', 'Ужасы'],
      ['/series/ukrainian/', 'Украинские'],
      ['/series/fiction/', 'Фантастика'],
      ['/series/fantasy/', 'Фэнтези'],
      ['/series/erotic/', 'Эротика'],
    ];
    cartoons_cat = [
      ['/cartoons/', 'Any', true],
      ['/cartoons/anime/', 'Аниме'],
      ['/cartoons/action/', 'Боевики'],
      ['/cartoons/kids/', 'Детские'],
      ['/cartoons/adult/', 'Для взрослых'],
      ['/cartoons/drama/', 'Драмы'],
      ['/cartoons/foreign/', 'Зарубежные'],
      ['/cartoons/comedy/', 'Комедии'],
      ['/cartoons/multseries/', 'Мультсериалы'],
      ['/cartoons/our/', 'Наши'],
      ['/cartoons/cognitive/', 'Познавательные'],
      ['/cartoons/full-length/', 'Полнометражные'],
      ['/cartoons/adventures/', 'Приключения'],
      ['/cartoons/family/', 'Семейные'],
      ['/cartoons/fairytale/', 'Сказки'],
      ['/cartoons/soyzmyltfilm/', 'Советские'],
      ['/cartoons/sport/', 'Спортивные'],
      ['/cartoons/fiction/', 'Фантастика'],
      ['/cartoons/fantasy/', 'Фэнтези'],
    ];
    animation_cat = [
      ['/animation/', 'Any', true],
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
      ['/animation/fairytale/', 'Сказки'],
      ['/animation/sport/', 'Спортивные'],
      ['/animation/shoujo/', 'Сёдзё'],
      ['/animation/shoujoai/', 'Сёдзё-ай'],
      ['/animation/shounen/', 'Сёнэн'],
      ['/animation/shounenai/', 'Сёнэн-ай'],
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
      page.options.createMultiOpt('genres', 'Genres', cat, function(newhref) {
        log.d(params);
        log.d('params inside genres');
        params.href = newhref;
        if (page.asyncPaginator) {
          reload();
        }
      }, true);
    }
    // console.log(params)
  }
}
exports.list = function(page, params) {
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
    // http://hdrezka.me/new/page/2/?filter=last&genre=2
    log.d('url=' + url);
    api.call(page, BASE_URL + url, params.args, function(pageHtml) {
      if (/person/.test(url)) {
        page.metadata.icon = pageHtml.dom.getElementByTagName('img')[0].attributes.getNamedItem('src').value;
      }
      list = scrapeList(url, pageHtml);
      populateItemsFromList(page, list);
      nPage++;
      // http://hdrezka.me/new/page/2/?filter=last&genre=2
      params.page = 'page/' + nPage + '/';
      page.haveMore(list.endOfData !== undefined && !list.endOfData);
    });
  }

  // ///
  function reload() {
    log.d(params);
    log.d('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzreload');
    delete params.page;
    nPage = 1;
    page.flush();
    loader();
  }


  select_cat(params, page, reload);
  page.asyncPaginator = loader;
  loader();
};
exports.updates = function(page, params) {
  page.loading = true;
  page.metadata.logo = LOGO;
  page.metadata.title = params.title;
  page.type = 'directory';
  url = params.page ? params.href + params.page : params.href;

  api.call(page, BASE_URL + url, params.args, function(pageHtml) {
    // items = document.getElementsByClassName("b-seriesupdate__block")
    items = pageHtml.dom.getElementByClassName('b-seriesupdate__block');
    items.forEach(function(i) {
      day = i.children[0].textContent;
      page.appendItem('', 'separator', {
        title: day,
      });
      i.children[1].children.forEach(function(i) {
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
          page.appendItem(PREFIX + ':moviepage:' + JSON.stringify(data), 'directory', {
            title: title,
          });
        }
      });
    });
  });

  // [... items].forEach(function (i){
  //     day = i.children[0].textContent;
  //     console.log(day);
  //     [... i.children[1].children].forEach(function(i){
  //     console.log(title = i.textContent);
  //     console.log(i.getElementsByTagName('a')[0].href)
  //     });
  //     })
  page.loading = false;
};
// exports.season = function (page, data) {
//   data = JSON.parse(data);
//   log.d({
//     route: 'season',
//     data: data,
//   });

//   page.loading = true;
//   page.type = 'directory';
//   page.metadata.title = data.title_year;

//   referer = BASE_URL;
//   api.call(page, data.url /* .replace(/\d+&e=\d+/, sN)*/, null, function (pageHtml) {
//     resp = pageHtml.text.toString();
//     // https://regex101.com/r/3BPUoK/1/
//     VideoBalancer = /video_balancer_options([^\;]+})/.exec(resp)[1];
//     log.p('VideoBalancer:\n' + VideoBalancer);
//     eval('options' + VideoBalancer);
//     log.p({
//       label: 'VideoBalancer',
//       options: options,
//     });
//     log.d('^^^^^^^^^^options has been update^^^^^^^^^');
//     log.d('count episode: ' + options.episodes.length);
//     //        iframe = data.url.replace(/\d+&e=\d+/, sN);
//     for (i = 0; i < options.episodes.length; i++) {
//       data.url = link(options.season, options.episodes[i], options.serial_token);
//       // data.ref = "&ref=" + options.ref,
//       log.d({
//         uri: 'PREFIX + ":play:" + ',
//         data: data,
//       });
//       item = page.appendItem(PREFIX + ':play:' + JSON.stringify(data), 'video', {
//         episode: {
//           number: fix_0(options.episodes[i]),
//         },
//         title: fix_0(options.episodes[i]) +
//           ' \u0441\u0435\u0440\u0438\u044f',
//         icon: data.icon,
//       });
//       item.bindVideoMetadata({
//         title: (data.title_en ? data.title_en : data.title) + ' S' + fix_0(options.season) + 'E' + fix_0(options.episodes[i]),
//       });
//     }

//     page.loading = false;
//     page.metadata.title += ' | ' + options.season + ' \u0441\u0435\u0437\u043e\u043d';
//   });
// };

// function link(e, t, n) {
//   var r = '/serial/' + n + '/iframe';
//   var i = '';
//   80 != options.port && (i = ':' + options.port);
//   var o = 1 == options.nocontrols ? '1' : '';
//   var s = 1 == options.nocontrols_translations ? '1' : '';
//   var a = 1 == options.nocontrols_seasons ? '1' : '';
//   var u = '?season=' + e + '&episode=' + t; // + "&nocontrols=" + o + "&nocontrols_translations=" + s + "&nocontrols_seasons=" + a
//   return options.proto + options.host + i + r + u;
// }

function fix_0(n) {
  return n > 9 ? '' + n : '0' + n;
}
