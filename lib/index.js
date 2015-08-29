'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _machReact2 = require('./machReact');

var machReact = _interopRequireWildcard(_machReact2);

var _machRadium = require('./machRadium');

var _machRadium2 = _interopRequireDefault(_machRadium);

var _machReact = _interopRequireWildcard(_machReact2);

exports.machReact = _machReact;

var React = machReact;
exports['default'] = React;
var Component = React.Component;

exports.Component = Component;
if (!global.React) global.React = machReact;
global.machReact = machReact;