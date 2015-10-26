'use strict';

// Based on:
// http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Router = (function () {
  function Router() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Router);

    var routes = options.routes;
    var mode = options.mode;
    var root = options.root;

    this.routes = routes || [];
    this.mode = mode === 'history' && history.pushState ? 'history' : 'hash';
    this.root = root ? '/' + this.clearSlashes(root) + '/' : '/';
  }

  _createClass(Router, [{
    key: 'config',
    value: function config(options) {
      this.constructor(options);
      return this;
    }
  }, {
    key: 'clearSlashes',
    value: function clearSlashes(path) {
      return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }
  }, {
    key: 'add',
    value: function add(re, handler) {
      if (typeof re === 'function') {
        handler = re;re = '';
      }
      this.routes.push({ re: re, handler: handler });
      return this;
    }
  }, {
    key: 'remove',
    value: function remove(param) {
      this.routes = this.routes.filter(function (route) {
        return route.handler !== param && route.re.toString() !== param.toString();
      });
      return this;
    }
  }, {
    key: 'flush',
    value: function flush() {
      return this.config({ routes: [] });
    }
  }, {
    key: 'check',
    value: function check() {
      var fragment = arguments.length <= 0 || arguments[0] === undefined ? this.fragment : arguments[0];

      this.routes.some(function (route) {
        var match = fragment.match(route.re);
        if (match) {
          match.shift();
          route.handler(match);
          return true;
        }
      });
      return this;
    }
  }, {
    key: 'listen',
    value: function listen(initCheck) {
      var _this = this;

      var last = this.fragment;
      if (initCheck) this.check(last);
      var fn = function fn() {
        var current = _this.fragment;
        if (last !== current) {
          _this.check(current);
          last = current;
        }
      };
      this.stop();
      this.interval = setInterval(fn, 50);
      return this;
    }
  }, {
    key: 'stop',
    value: function stop() {
      clearInterval(this.interval);
      return this;
    }
  }, {
    key: 'navigate',
    value: function navigate(path) {
      path = path ? path : '';
      if (this.mode === 'history') {
        history.pushState(null, null, this.root + this.clearSlashes(path));
      } else {
        window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
      }
      return this;
    }
  }, {
    key: 'fragment',
    get: function get() {
      var fragment = '';
      if (this.mode === 'history') {
        fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
        fragment = fragment.replace(/\?(.*)$/, '');
        fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
      } else {
        var match = window.location.href.match(/#(.*)$/);
        fragment = match ? match[1] : '';
      }
      return this.clearSlashes(fragment);
    }
  }]);

  return Router;
})();

exports['default'] = Router;
module.exports = exports['default'];