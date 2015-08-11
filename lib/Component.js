'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _virtualDOM = require('./virtualDOM');

var _machReact = require('./machReact');

var machReact = _interopRequireWildcard(_machReact);

var _setZeroTimeout = require('./setZeroTimeout');

var _setZeroTimeout2 = _interopRequireDefault(_setZeroTimeout);

// NOTE: BaseComponent is extended to make ReactComponent.

var BaseComponent = (function (_EventEmitter) {
  _inherits(BaseComponent, _EventEmitter);

  function BaseComponent() {
    _classCallCheck(this, BaseComponent);

    _get(Object.getPrototypeOf(BaseComponent.prototype), 'constructor', this).apply(this, arguments);

    this.machReact = machReact;
    this.assignObject = Object.assign;
    this.resolveDOM = _virtualDOM.resolve;
    this.appendDOM = _virtualDOM.attach;
    this.removeDOM = _virtualDOM.detach;
    this.state = {};
    this.props = {};
    this.context = {};
    this.childContext = {};
    this.isUpdating = false;
  }

  _createClass(BaseComponent, [{
    key: 'replaceObjectProperty',
    value: function replaceObjectProperty(property, value, callback) {
      this[property] = this.assignObject({}, value);
    }
  }, {
    key: 'mergeObjectProperty',
    value: function mergeObjectProperty(property, value, callback) {
      this[property] = this.assignObject(this[property], value);
    }
  }, {
    key: 'setupContext',
    value: function setupContext(parentComponent, rootComponent) {
      // TODO: context code testing and cleanup.
      this.mergeObjectProperty('context', rootComponent.context);
      this.mergeObjectProperty('context', rootComponent.getChildContext());
      if (parentComponent && rootComponent !== parentComponent) {
        this.mergeObjectProperty('context', parentComponent.getChildContext());
      }
    }
  }, {
    key: 'queueUpdate',
    value: function queueUpdate(callback) {
      if (callback) this.once('updated', callback);
      if (this.isUpdating) return;
      this.updateFunc = this.update.bind(this);
      this.isUpdating = true;
      (0, _setZeroTimeout2['default'])(this.updateFunc);
    }
  }, {
    key: 'cancelUpdate',
    value: function cancelUpdate() {
      if (this.isUpdating) {
        (0, _setZeroTimeout.unsetZeroTimeout)(this.updateFunc);
        this.isUpdating = false;
        this.updateFunc = null;
      }
    }
  }, {
    key: 'mount',
    value: function mount(parent) {
      this.refs = {};
      this.componentWillMount();
      this.update(true);
      if (parent) {
        this.appendDOM(this.domNode, parent);
        this.componentDidMount();
      } else return this.componentDidMount.bind(this);
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      console.log('unmount', new Error().stack);
      this.componentWillUnmount();
      this.lastVirtualElement = this.virtualElement;
      this.virtualElement = null;
      this.domNode = this.resolveDOM(this);
      this.lastVirtualElement = null;
      var parent = this.domNode && this.domNode.parentNode;
      if (parent) this.removeDOM(this.domNode);
      this.componentDidUnmount();
      if (this.domNode) {
        this.domNode.component = null;
        this.domNode = null;
      }
    }
  }, {
    key: 'update',
    value: function update(force) {
      var _this = this;

      if (!force) {
        if (!this.shouldComponentUpdate(this.props, this.state)) return;
        this.componentWillUpdate(this.props, this.state);
      }
      // NOTE: preserving refs is important for them to be available on did mount.
      this.refs = {};
      this.lastVirtualElement = this.virtualElement;
      this.virtualElement = this.safeRender();
      this.domNode = this.resolveDOM(this);
      var finishUpdate = function finishUpdate() {
        if (!force) _this.componentDidUpdate();
        _this.emit('updated');
        _this.isUpdating = false;
        _this.updateFunc = null;
      };
      (0, _setZeroTimeout2['default'])(finishUpdate);
    }
  }, {
    key: 'safeRender',
    value: function safeRender() {
      if (!this.render) throw new Error('Component missing render method.');
      return this.render(this.machReact);
    }
  }, {
    key: 'safeUpdate',
    value: function safeUpdate(force) {
      if (force || !this.isUpdating) {
        this.cancelUpdate();
        this.update(force);
      }
    }
  }]);

  return BaseComponent;
})(_events.EventEmitter);

exports.BaseComponent = BaseComponent;

var ReactComponent = (function (_BaseComponent) {
  _inherits(ReactComponent, _BaseComponent);

  function ReactComponent(props, context) {
    _classCallCheck(this, ReactComponent);

    _get(Object.getPrototypeOf(ReactComponent.prototype), 'constructor', this).call(this);
    this.autoUpdateWhenPropsChange = true;
    if (props) this.props = this.assignObject(this.props, props);
    if (context) this.context = this.assignObject(this.context, context);
  }

  _createClass(ReactComponent, [{
    key: 'getDOMNode',
    value: function getDOMNode() {
      return this.domNode;
    }
  }, {
    key: 'replaceState',
    value: function replaceState(newState, callback) {
      this.replaceObjectProperty('state', newState);
      this.queueUpdate(callback);
    }
  }, {
    key: 'setState',
    value: function setState(nextState, callback) {
      if (typeof nextState === 'function') nextState = nextState(this.state, this.props);
      this.componentWillReceiveState(nextState);
      this.mergeObjectProperty('state', nextState);
      this.queueUpdate(callback);
    }
  }, {
    key: 'replaceProps',
    value: function replaceProps(newProps, callback) {
      // Not in React anymore
      this.replaceObjectProperty('props', newProps);
      if (this.autoUpdateWhenPropsChange) this.queueUpdate();
    }
  }, {
    key: 'setProps',
    value: function setProps(nextProps, callback) {
      // Not in React anymore
      this.componentWillReceiveProps(nextProps);
      this.mergeObjectProperty('props', nextProps);
      if (this.autoUpdateWhenPropsChange) this.queueUpdate();
    }
  }, {
    key: 'forceUpdate',
    value: function forceUpdate() {
      this.update(true);
    }
  }, {
    key: 'isMounted',
    value: function isMounted() {
      return this.domNode && this.domNode.parentNode;
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return this.childContext || {};
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillReceiveState',
    value: function componentWillReceiveState(nextState) {}
    // Not from React.
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'componentDidUnmount',
    value: function componentDidUnmount() {}
    // Not from React.

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return true;
    }
  }, {
    key: 'render',
    value: function render(React) {
      return null;
    }
  }, {
    key: 'displayName',
    get: function get() {
      return this.constructor.name;
    }
  }]);

  return ReactComponent;
})(BaseComponent);

exports['default'] = ReactComponent;