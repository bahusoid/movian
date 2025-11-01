/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-var */
exports.call = function (page, URL, args, callback) {
  var opts = {
    method: 'GET',
    headers: {
      'User-Agent': UA,
//      'Referer': URL.match('moonwalk')? referer = 'https://rezka.ag': referer,
//      'Referer': referer,
    },
    args: [args || {}],
    debug: service.debug,
    noFail: true,
//    compression: true,
    caching: true,
    cacheTime: 1000,
  };
  log.d({
    'make request for': URL,
    'with opts': opts,
  });
//  showtime.httpReq(URL, opts, function (err, result) {
  http.request(URL, opts, function (err, result) {
    if (page) page.loading = false;
    if (err) {
      if (page) page.error(err);
      else console.error(err);
    }
    else {
      try {
//        var pageHtml = {
//          text: result,
//          dom: html.parse(result).root,
//        };
        callback(pageHtml = {
          text: result,
          dom: html.parse(result).root,
        });
      } 
      catch (e) {
        if (page) page.error(e);
        throw (e);
      }
    }
  });
  log.d('set referer to last requestet url:' + URL);
//  referer = URL;
};