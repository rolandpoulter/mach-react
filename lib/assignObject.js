'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = assignObject;

function assignObject(target) {
  for (var i = 1, l = arguments.length; i < l; i++) {
    var source = arguments[i];
    if (!source) continue;
    for (var key in source) {
      var desc = Object.getOwnPropertyDescriptor(source, key);
      if (desc) Object.defineProperty(target, key, desc);
    }
  }
  return target;
}

module.exports = exports['default'];