'use strict';
var utils = require('./utils');
var CookieManager = function() {
    this._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');
};
var CMProto = CookieManager.prototype;

CMProto._encodeCookie = function(value) {
    if (utils.typeCheck(value) !== 'string') {
        value = JSON.stringify(value);
    }
    return encodeURIComponent(value);
};

CMProto._decodeCookie = function(value) {
    value = decodeURIComponent(value);
    return utils.isJSON(value) ? JSON.parse(value) : value;
};

CMProto._cookieExpirationDate = function(stale) {
    var _this = this;
    var expires;
    var staleTypes = {
        'number': function() {
            expires = stale === Infinity ?
                "expires=" + _this._maxExpireDate :
                "max-age=" + stale; // max-age is in seconds
        },
        'string': function() {
            expires = "expires=" + new Date(stale).toUTCString();
        },
        'date': function() {
            expires = "expires=" + stale.toUTCString();
        }
    };
    return stale && staleTypes[utils.typeCheck(stale)].call() || expires;

};

CMProto.get = function(key) {
    var arr = document.cookie.split(/; */);
    var i = arr.length;
    var val;
    var idx;
    utils.assert(this.exists(key), 'No cookie found');
    while (i--) {
        idx = arr[i].indexOf('=');
        val = arr[i].substr(++idx, arr[i].length).trim();
        if (arr[i].indexOf(key) > -1) {
            return utils.parse(val);
        }
    }
};

CMProto.set = function(key, val, opt) {
    var pairs;
    var _this = this;
    opt = opt || {};

    pairs = [key + '=' + this._encodeCookie(val)];

    pairs.push(_this._cookieExpirationDate(val === undefined ? -1 : opt.staleIn));
    pairs.push(opt.path && 'path=' + opt.path);
    pairs.push(opt.domain && 'domain=' + opt.domain);
    pairs.push(opt.secure && 'secure'); // only over https

    pairs = pairs.filter(Boolean);
    document.cookie = pairs.join('; ');
};

CMProto.remove = function(key, opt) {
    this.set(key, undefined, opt);
    return true;
};
CMProto.exists = function(key) {
    return document.cookie.indexOf(key + '=') >= 0;
};
CMProto.keys = function() {
    var cookies = document.cookie.split(/; */);
    return cookies.map(function(cookie) {
        var idx = cookie.indexOf('=');
        return cookie.substr(0, idx).trim();
    });
};


module.exports = new CookieManager();