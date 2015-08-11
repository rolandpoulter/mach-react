'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./polyfill');

var _machRadium = require('./machRadium');

var _machRadium2 = _interopRequireDefault(_machRadium);

var _machReact = require('./machReact');

var machReact = _interopRequireWildcard(_machReact);

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

exports.Component = _Component3['default'];

var React = machReact;
exports['default'] = React;

var _mixin2 = require('./mixin');

var _mixin3 = _interopRequireDefault(_mixin2);

exports.mixin = _mixin3['default'];

if (!global.React) global.React = machReact;
global.machReact = machReact;