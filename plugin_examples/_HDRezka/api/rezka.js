/* api/rezka.js - Network layer for HDRezka */
/* eslint-disable no-var */

var http = require('movian/http');
var service = require('movian/service');
var log = require('../utils/log');
var dom = require('../utils/dom');
var parser = require('../parsers/rezkaParser');
var constants = require('../constants');
var encoding = require('../utils/encoding');
var crypto = require('../utils/crypto');

var UA = constants.UA;

function request(url, opts, cb) {
    if (typeof opts === 'function') { cb = opts; opts = {}; }
    opts = opts || {};

    var baseUrl = opts.baseUrl || service.domain;// || 'https://hdrezka.me';
    if (url.indexOf('http') !== 0) url = baseUrl + (url[0] === '/' ? url : '/' + url);

    var ctrl = {
        method: opts.method || 'GET',
        headers: opts.headers || { 'User-Agent': UA },
        noFail: true
    };

    // Кэширование (только для GET без postdata)
    if (opts.caching) {
        ctrl.caching = true;
        if (opts.cacheTime) ctrl.cacheTime = opts.cacheTime;
    }

    if (opts.body) {
        if (typeof opts.body === 'object') {
            var p = [];
            for (var k in opts.body) p.push(encodeURIComponent(k) + '=' + encodeURIComponent(opts.body[k]));
            ctrl.postdata = p.join('&');
        } else ctrl.postdata = opts.body;
        ctrl.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    log.d('[api] ' + ctrl.method + ' ' + url);
    http.request(url, ctrl, function (err, res) {
        if (err) return cb(err);
        var isCache = res.statuscode === 0;
        if (res.statuscode !== 200 && !isCache) return cb('HTTP ' + res.statuscode);

        // Debug: показать источник данных
        var shortUrl = url.length > 50 ? url.substring(0, 50) + '...' : url;
        log.d('[api] ' + shortUrl + ' -> ' + (isCache ? '[CACHE]' : '[HTTP]'));

        var data = res.toString();
        log.d('[api] Response length: ' + data.length);
        log.d('[api] Response preview: ' + data.substring(0, 100));
        if (opts.parseJson) {
            try { data = JSON.parse(data); } catch (e) { return cb('JSON Parse error'); }
        }
        cb(null, data, isCache);
    });
}

/**
 * Extract encryption keys from HTML
 */
function extractKeysFromHtml(html, cb) {
    var m = /src="(\/templates\/.*?playerjs[^"]+)/.exec(html);
    if (!m) return cb('PlayerJS not found');
    request(m[1], { caching: true, cacheTime: 60 * 60 * 24 }, function (err, js) {
        if (err) return cb(err);
        log.d('[api] extractKeys/playerjs loaded');
        var unpacked = encoding.unpacker.unpack(js);
        var keys = crypto.extractKeys(unpacked);
        if (!keys) return cb('Failed to extract keys');
        cb(null, keys);
    });
}

module.exports = {
    fetchList: function (url, cb) {
        request(url, { caching: true, cacheTime: 60 * 2 }, function (err, html, fromCache) {
            if (err) return cb(err);
            log.d('[api] fetchList fromCache=' + fromCache);
            var doc = dom.parse(html);
            if (!doc) return cb('Parse error');
            var items = [];
            var els = dom.getElByClass(doc, 'b-content__inline_item');
            for (var i = 0; i < els.length; i++) {
                var item = parser.parseListItem(els[i]);
                if (item) items.push(item);
            }
            var nav = dom.getElByClass(doc, 'b-navigation');
            items.endOfData = true;
            if (nav.length && nav[0].children && nav[0].children.length) {
                var lastChild = nav[0].children[nav[0].children.length - 1];
                var classAttr = dom.getAttr(lastChild, 'class') || '';
                items.endOfData = classAttr.indexOf('no-page') !== -1;
            }
            log.d('[api] items=' + items.length + ', endOfData=' + items.endOfData);
            cb(null, items, fromCache);
        });
    },

    fetchUpdates: function (cb) {
        request('/', { caching: true, cacheTime: 60 * 2 }, function (err, html, fromCache) {
            if (err) return cb(err);
            log.d('[api] fetchUpdates fromCache=' + fromCache);
            var doc = dom.parse(html);
            if (!doc) return cb('Parse error');
            var items = [];
            var blocks = dom.getElByClass(doc, 'b-seriesupdate__block');
            for (var i = 0; i < blocks.length; i++) {
                var blockItems = parser.parseUpdateBlock(blocks[i]);
                items = items.concat(blockItems);
            }
            cb(null, items);
        });
    },

    fetchDetails: function (url, id, cb) {
        request(url, { caching: true, cacheTime: 60 * 5 }, function (err, html, fromCache) {
            if (err) return cb(err);
            log.d('[api] fetchDetails fromCache=' + fromCache);
            var doc = dom.parse(html);
            if (!doc) return cb('Parse error');
            var data = parser.extractDetails(doc, html, url);
            if (id) data.id = id;
            cb(null, data, fromCache);
        });
    },

    fetchPerson: function (url, cb) {
        request(url, { caching: true, cacheTime: 60 * 60 }, function (err, html, fromCache) {
            if (err) return cb(err);
            log.d('[api] fetchPerson fromCache=' + fromCache);
            var doc = dom.parse(html);
            if (!doc) return cb('Parse error');
            var data = parser.extractPerson(doc, html, url);
            cb(null, data, fromCache);
        });
    },

    fetchEpisodes: function (id, translator_id, favs, cb) {
        request('/ajax/get_cdn_series/?t=' + Date.now(), {
            method: 'POST',
            body: { id: id, translator_id: translator_id, favs: favs || '', action: 'get_episodes' },
            parseJson: true
        }, function (err, json, fromCache) {
            if (err) return cb(err);
            log.d('[api] fetchEpisodes fromCache=' + fromCache + ' (POST - should be false)');
            if (!json.episodes) return cb('No episodes in response');
            var html = '<div>' + (json.seasons || '') + json.episodes + '</div>';
            var doc = dom.parse(html);
            cb(null, parser.parseEpisodes(doc, { id: id, translator_id: translator_id, favs: favs }));
        });
    },

    fetchStream: function (payload, cb) {
        request('/ajax/get_cdn_series/?t=' + Date.now(), {
            method: 'POST',
            body: payload,
            parseJson: true
        }, cb);
    },

    initKeys: function (cb) {
        request('/', function (err, html, fromCache) {
            if (err) return cb(err);
            log.d('[api] initKeys/main fromCache=' + fromCache);
            extractKeysFromHtml(html, cb);
        });
    },

    initKeysFromHtml: function (html, cb) {
        extractKeysFromHtml(html, cb);
    },

    fetchMainPage: function (cb) {
        request('/', { caching: false }, cb);
    },

    isLoginPage: function (html) {
        if (!html) return false;
        // 1. Заголовок "Sign In" — уникальный маркер зеркала с логином
        if (html.indexOf('<title>Sign In</title>') > -1) return true;
        // 2. Короткая страница + форма логина в основном контенте
        if (html.length < 15000 && html.indexOf('action="/ajax/login/"') > -1) return true;
        // 3. Нет основного контента + кнопка check-submit
        if (html.indexOf('class="check-submit"') > -1 &&
            html.indexOf('b-content__inline_item') === -1) return true;
        return false;
    },

    login: function (username, password, cb) {
        request('/ajax/login/', {
            method: 'POST',
            caching: false,
            body: { login_name: username, login_password: password, login_not_save: 0 },
            parseJson: true
        }, function (err, result) {
            if (err) return cb(err, false);
            if (result && result.success) {
                log.d('[api] login success');
                return cb(null, true);
            }
            cb(result && result.message || 'Login failed', false);
        });
    },

    logout: function (cb) {
        request('/logout/', { method: 'GET', caching: false }, function (err) {
            if (err) log.e('[api] logout error: ' + err);
            cb && cb(err);
        });
    },

    raw: request
};
