'use strict';

// Based on:
// http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

export default class Router {
  constructor(options = {}) {
    let { routes, mode, root } = options;
    this.routes = routes || [];
    this.mode = mode === 'history' && history.pushState ? 'history' : 'hash';
    this.root = root ? '/' + this.clearSlashes(root) + '/' : '/';
  }

  config(options) {
    this.constructor(options);
    return this;
  }

  clearSlashes(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }

  get fragment() {
    let fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    }
    else {
      let match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  }

  add(re, handler) {
    if (typeof re === 'function') { handler = re; re = ''; }
    this.routes.push({ re, handler });
    return this;
  }

  remove(param) {
    this.routes = this.routes.filter(
      route => route.handler !== param && route.re.toString() !== param.toString()
    );
    return this;
  }

  flush() {
    return this.config({routes: []});
  }

  check(fragment = this.fragment) {
    this.routes.some(route => {
      let match = fragment.match(route.re);
      if (match) {
        match.shift();
        route.handler(match);
        return true;
      }
    });
    return this;
  }

  listen(initCheck) {
    let last = this.fragment;
    if (initCheck) this.check(last);
    let fn = () => {
      let current = this.fragment;
      if (last !== current) {
        this.check(current);
        last = current;
      }
    };
    this.stop();
    this.interval = setInterval(fn, 50);
    return this;
  }

  stop() {
    clearInterval(this.interval);
    return this;
  }

  navigate(path) {
    path = path ? path : '';
    if (this.mode === 'history') {
      history.pushState(null, null, this.root + this.clearSlashes(path));
    }
    else {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  }
}
