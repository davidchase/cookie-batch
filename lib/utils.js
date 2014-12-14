'use strict';
var utils = {};

utils.isJSON = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};
utils.typeCheck = function(value) {
    return ({}).toString.call(value).slice(8, -1).toLowerCase();
};

utils.assert = function(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        throw new Error(message);
    }
};

utils.serialize = function(value) {
    if (utils.typeCheck(value) !== 'string') {
        value = JSON.stringify(value);
    }
    return encodeURIComponent(value);
};

utils.parse = function(value) {
    value = decodeURIComponent(value);
    return utils.isJSON(value) ? JSON.parse(value) : value;
};

utils.inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

module.exports = utils;