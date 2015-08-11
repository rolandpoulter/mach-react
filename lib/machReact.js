'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createElement = createElement;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _virtualDOM = require('./virtualDOM');

Object.defineProperty(exports, 'render', {
  enumerable: true,
  get: function get() {
    return _virtualDOM.render;
  }
});

var _VirtualDOM = _interopRequireWildcard(_virtualDOM);

exports.VirtualDOM = _VirtualDOM;

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

exports.Component = _Component3['default'];

function createElement(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return (0, _virtualDOM.create)(type, props, children);
}