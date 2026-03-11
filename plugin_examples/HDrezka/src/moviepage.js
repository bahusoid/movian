/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-var */

exports.contentPage = function(page, mdata) {
  if (/{/.test(mdata)) data = JSON.parse(mdata);
  //  /{"url":"/.test(mdata) ? (data = JSON.parse(mdata)) : (data.url = mdata);

  log.d({
    function: 'moviepage',
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
}

function getYear() {
  // document.body.innerHTML.match(/year\/([^/]+)/)[1]
  if (/year\/([^/]+)/.exec(pageHtml.text)) data.year = /year\/([^/]+)/.exec(pageHtml.text)[1];
}

function getIcon() {
  if (pageHtml.dom.getElementByClassName('b-sidecover').length) {
    data.icon = pageHtml.dom.getElementByClassName('b-sidecover')[0].getElementByTagName('img')[0].attributes.getNamedItem('src').value;
  }
  data.icon = /^http/.test(data.icon) ? data.icon : BASE_URL + data.icon;
}

function getkpID() {
  if (null != pageHtml.dom.getElementByClassName('kp') && pageHtml.dom.getElementByClassName('kp').length > 0) {
    data.kpID = pageHtml.dom.getElementByClassName('kp');
    data.kpID = pageHtml.dom.getElementByClassName('kp')[0].getElementByTagName('a')[0].attributes.getNamedItem('href').value;
    data.kpID = (/help\/([^/]+)/.exec(data.kpID) || [])[1];
    data.kpID = decodeURIComponent(d(data.kpID));
    data.kpID = data.kpID.match(/[0-9]+/)[0];
  }
}

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
      };
      data.yoData = yoData;

      data.title_year = data.title + (data.year ? ' (' + data.year + ')' : '');
      page.metadata.title = data.title_year;
      page.metadata.logo = data.icon;
      page.type = 'directory';
      data.type = /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.test(pageHtml.text.toString()) ? 'serial' : 'movie';
      log.d({data77: data});
      if (data.trID) {
        page.metadata.title = page.metadata.title + ' | ' + data.trID.translator_title;
        if (data.type == 'serial') {
          dom = getSeriesDom(data.id, data.trID.translator_id);
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

      if (null !== (m = /sof\.tv\.initCDNMoviesEvents\((\d+).*?(\d+).*?({.*?})\);/gm.exec(pageHtml.text.toString()))) {
        page.metadata.title = page.metadata.title + (undefined == data.play_active ? '' : ' | ' + data.play_active.translator_title);
        page.appendItem('', 'separator', {
          title: 'Video:',
        });
        log.d({data94: data});
        data.translator_id = m[2];
        if (undefined !== data.play_active) {
          playData = data.play_active;
        } else {
          playData = {
            type: data.type,
            id: data.id,
            translator_id: data.translator_id,
            title: data.title,
            year: data.year,
            icon: data.icon,
          };
        }
        //   title: data.title,
        //   id: data.id,
        //   translator_id: m[2],
        //   type: 'movie',
        //   icon: data.icon,
        // };
        // log.d({
        //   epData: epData,
        //   epData2: epData2
        // });

        // "play:data": {
        //   "id": "39707",
        //   "translator_id": "88",
        //   "translator_title": "SDI Media",
        //   "camrip": "0",
        //   "ads": "0",
        //   "director": "0",
        //   "type": "movie",
        //   "cdn_url": 0,
        //   "active": 1,
        //   "title": "Безумен, но не болен",
        //   "icon": "https://static.hdrezka.ac/i/2021/5/19/pb6235e2c13f4yz70d37i.png"
        // }
        // postdata = {
        //   id: data.id,
        //   translator_id: data.translator_id,
        //   is_camrip: data.camrip,
        //   is_ads: data.ads,
        //   is_director: data.director,
        //   action: 'get_movie',
        // };
        uri = JSON.stringify(playData);
        log.d({playData: playData});
        // item =
		rating1 = '';
		try{rating1 = pageHtml.dom.getElementByClassName('bold')[0].textContent*10} catch(err){}
		
		page.appendItem(PREFIX + ':play:' + uri, 'video', {
            title: data.title,
            icon: data.icon,
            description: pageHtml.dom.getElementByClassName('b-post__description_text')[0].textContent,
		rating: rating1
          }) 
      }

      // елемент с класом persons-list-holder
      // вернет HTMLCollection(2)
      getPerson(page, data);

plist = dom.getElementByClassName('b-post__info');
   var bob=plist[0].getElementByTagName('td').length;
   var re=/\/\/[\s\S]*?\/([\s\S]*?)$/;
   plist = plist[0].getElementByTagName('td')[bob-2].getElementByTagName('a');
   
   if (plist.length >0){
    page.appendItem('', 'separator', {title: 'Из серии:', });  
   }
    console.log(plist);
   plist.forEach(function(person) {
    // имя
    console.log(person.textContent);
    // линк
 
    console.log(person.attributes.getNamedItem('href').value);
 page.appendItem(PREFIX + ':list:' +  '/'+re.exec(person.attributes.getNamedItem('href').value)[1]+':'+person.textContent, 'directory', {title: person.textContent,});
  });


      page.appendItem('', 'separator', {
        title: 'ну или:',
      }); page.appendItem('youtube:search:' + data.title + ' ' + data.year, 'directory', {
        title: '\u043d\u0430\u0439\u0442\u0438 \u043d\u0430 YouTube',
      }); page.appendItem('search:' + data.title + ' ' + data.year, 'directory', {
        title: 'найти ' + data.title + ' ' + data.year + ' в других плагинах',
      }); log.d({
        yoData139: yoData,
      }); page.appendItem('yo:search:' + JSON.stringify(yoData), 'directory', {
        title: 'найти другой плеер',
      });
    });
  }
}

function getPerson(page, data) {
  try {
	if ((plist = dom.getElementByClassName('persons-list-holder')).length) {
   plistd = plist[0].getElementByTagName('a');
    page.appendItem('', 'separator', {
      title: 'Режиссер:',
    });
      plistd.forEach(function(person) {
        // имя
        console.log(person.textContent);
        // линк
        console.log(person.attributes.getNamedItem('href').value);
  
  var re=/[\s\S]*?\/\/[\s\S]*?\/([\s\S]*?)$/g;
  personurl= re.exec(person.attributes.getNamedItem('href').value)[1];
  //popup.notify(personurl,5);
  var kinopage = http.request(encodeURI(service.domain + '/' + personurl));
  var kinoface= /sidecover[\s\S]*?src="([\s\S]*?)"/g.exec(kinopage)[1] ;
  
  //var iconurl = /actor\/+([\d]+).jpg/;
  var iconurl = /ищете[\s\S]*?href="\/name\/([\s\S]*?)\//;
  var kinopoisk = 'https://www.kinopoisk.ru/index.php?kp_query=';
   
        page.appendItem(PREFIX + ':list:' + '/'+ personurl+':'+person.textContent, 'video', {
          title: person.textContent,
    
    //icon: 'https://st.kp.yandex.net/images/sm_actor/21459.jpg',
  
    icon: kinoface,
    
        })  ;
  
      });
 plista = plist[1].getElementByTagName('a');
    page.appendItem('', 'separator', {
      title: 'Актеры:',
    });
 plista.forEach(function(person) {
        // имя
        console.log(person.textContent);
        // линк
        console.log(person.attributes.getNamedItem('href').value);
  
  var re=/[\s\S]*?\/\/[\s\S]*?\/([\s\S]*?)$/g;
  personurl= re.exec(person.attributes.getNamedItem('href').value)[1];
  //popup.notify(personurl,5);
  var kinopage = http.request(encodeURI(service.domain + '/' + personurl));
  var kinoface= /sidecover[\s\S]*?src="([\s\S]*?)"/g.exec(kinopage)[1] ;
  
  //var iconurl = /actor\/+([\d]+).jpg/;
  var iconurl = /ищете[\s\S]*?href="\/name\/([\s\S]*?)\//;
  var kinopoisk = 'https://www.kinopoisk.ru/index.php?kp_query=';
   
        page.appendItem(PREFIX + ':list:' + '/'+ personurl+':'+person.textContent, 'video', {
          title: person.textContent,
    icon: kinoface,
    
        })  ;
  
      });
  }
} catch(error){}
}

// getSeries(page, id, trId);
// http://prohdrezka.com/ajax/get_cdn_series/?t=1574793441160
function getSeriesDom(id, translator_id) {
  resp = http.request('https://arial.trymeter.org/ajax/get_cdn_series/?t=' + new Date().getTime(), {
    debug: 1,
    // arg: {t: new Date().getTime()},
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
      action: 'get_episodes',
    },
  }).toString();
  log.d({
    '229resp': resp,
  });
  data.translator_id = translator_id;
  seasons = '<ul id="simple-seasons-tabs" class="b-simple_seasons__list clearfix">' + JSON.parse(resp).seasons + '</ul>';
  episodes = '<div id="simple-episodes-tabs">' + JSON.parse(resp).episodes + '</div>';
  dom = '<html><body>' + seasons + episodes + '</body></html>';
  dom = html.parse(dom).root;
  return dom;
}

function data_(dom) {
  // translate
  if (null !== (tlist = dom.getElementById('translators-list'))) {
    data.tr = [];
    data.type = /sof\.tv\.initCDNSeriesEvents\((\d+), (\d+)/.test(pageHtml.text.toString()) ? 'serial' : 'movie';
    tlist.children.forEach(function(element, index) {
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
      } else {
        data.tr[index] = {
          // title: element.attributes.getNamedItem('title').value,
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
  // season
  if (null !== (slist = dom.getElementById('simple-seasons-tabs'))) {
    data.season = [];
    slist.children.forEach(function(element, index) {
      data.season[index] = {
        title: element.textContent,
        ep: [],
      };
    });
  }
  // [... document.getElementById('simple-episodes-tabs').children].forEach(function (stab){console.log(eptab.children)})
  // [... document.getElementById('simple-episodes-tabs').children].forEach(function (stab, index){console.log(elist = eptab.children)})
  // and episodes
  if (null !== dom.getElementById('simple-episodes-tabs')) {
    if (data.season == undefined) {
      data.season = [];
      data.season[0] = {
        title: '',
        ep: [],
      };
    }

    dom.getElementById('simple-episodes-tabs').children.forEach(function(stab, index) {
      eplist = stab.children;
      eplist.forEach(function(ep) {
        epData = {
          title: ep.textContent,
          icon: data.icon,
          translator_id: data.translator_id,
          // cdn_url: ep.attributes.getNamedItem('data-cdn_url').value,
          id: ep.attributes.getNamedItem('data-id').value,
          season_id: ep.attributes.getNamedItem('data-season_id').value,
          episode_id: ep.attributes.getNamedItem('data-episode_id').value,
        };
        data.season[index].ep.push(epData);
      });
    });
  }
}

function display_translate(page) {
  if (data.tr) {
    page.appendPassiveItem('separator', null, {
      title: 'В русской озвучке от:',
    });
    data.tr.forEach(function(tr, index) {
      trData = {
        title: data.title,
        id: data.id,
        // tr: data.tr,
        url: data.url,
        trID: tr,
        type: data.type,
      };
      epData = data.tr[index];
      if (data.type == 'serial') {
        uri = PREFIX + ':moviepage:' + JSON.stringify(trData);
      } else {
        uri = PREFIX + ':play:' + JSON.stringify(epData);
      }

      // uri = PREFIX + ':moviepage:' + JSON.stringify(trData);
      page.appendItem(uri, 'directory', {
        title: tr.translator_title,
        icon: data.icon,
        description: tr,
      });
    });
  }
}
function display_season(page) {
  if (data.season) {
    data.season.forEach(function(element) {
      page.appendPassiveItem('separator', null, {
        title: element.title,
      });
      element.ep.forEach(function(element) {
        uri = JSON.stringify(element);
        item = page.appendItem(PREFIX + ':play:' + uri, 'video', {
            title: data.title,
            icon: data.icon,
            description: pageHtml.dom.getElementByClassName('b-post__description_text')[0].textContent,
  rating: pageHtml.dom.getElementByClassName('bold')[0].textContent*10
          })
      
      });
    });
  }
}
