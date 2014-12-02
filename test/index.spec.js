'use strict';
var cm = require('../lib/index');
setup(function() {
    // create a document.cookie mock
    // since in node there's no
    // document property
    global.document = {
        _value: '',
        get cookie() {
            return this._value;
        },
        set cookie(value) {
            this._value += value + ';';
        }
    };

});

suite('set method', function() {
    test('setting one cookie, the name should be at position 0', function() {
        cm.set('myCookie', 'my cookie');
        return document.cookie.indexOf('myCookie=').should.equal(0);
    });


    test('setting values with spaces should be encoded', function() {
        cm.set('someCookie', 'hello world');
        document.cookie.split('=')[1].should.contain('hello%20world');
    });

    test('setting a object value should JSON.stringify before encoding', function() {
        var obj = {
            a: 'b',
            d: 'e'
        };
        var encode = function(val){
            val = JSON.stringify(val);
            return encodeURIComponent(val);
        };
        cm.set('jsonCookie', obj);
        document.cookie.split('=')[1].should.contain(encode(obj));
    });
});

suite('get method', function() {
    test('calling get method with a value should return cookie value', function() {
        cm.set('someCookie', 'hello world');
        return cm.get('someCookie').should.equal('hello world');
    });

    test('getting a json value should parse it before returning it', function(){
        var obj = {
            a: 'b',
            d: 'e'
        };
        cm.set('jsonCookie', JSON.stringify(obj));
        cm.get('jsonCookie').should.eql(obj);
    });
});

suite('remove method', function() {
    test('calling remove method the mock cookie should contain epoch time', function() {
        cm.set('someCookie', 'hello');
        cm.remove('someCookie');
        return document.cookie.should.contain('max-age=-1');
    });

});

suite('keys method', function() {
    test('calling keys method should return an array', function() {
        cm.set('someCookie', 'hello');
        cm.set('anotherCookie', 'ahh');
        return cm.keys().should.be.an.Array;
    });


    test('calling keys method should return an array of cookie names', function() {
        cm.set('someCookie', 'hello');
        cm.set('anotherCookie', 'ahh');
        return cm.keys().should.include.members(['someCookie', 'anotherCookie']);
    });
});

suite('exists method', function() {
    test('calling exists method should return truthy if cookie is present', function() {
        cm.set('someCookie', 'hello');
        cm.set('anotherCookie', 'ahh');
        return cm.exists('anotherCookie').should.be.true;
    });

    test('calling exists method should return falsey if cookie is not present', function() {
        cm.set('someCookie', 'hello');
        cm.set('anotherCookie', 'ahh');
        return cm.exists('cookieMonster').should.be.false;
    });
});