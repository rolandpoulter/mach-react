'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = mixin;

function mixin() {
  for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
    mixins[_key] = arguments[_key];
  }

  return function decorator(Class) {
    Object.assign.apply(Object, [Class.prototype].concat(mixins));
  };
}

module.exports = exports['default'];