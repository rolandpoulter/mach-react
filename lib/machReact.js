'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.createElement = createElement;
exports.addEvent = addEvent;
exports.removeEvent = removeEvent;
exports.attach = attach;
exports.detach = detach;
exports.create = create;
exports.fixProps = fixProps;
exports.render = render;
exports.resolve = resolve;
exports.walkVirtual = walkVirtual;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _assignObject = require('./assignObject');

var _assignObject2 = _interopRequireDefault(_assignObject);

var _setZeroTimeout2 = require('./setZeroTimeout');

var _setZeroTimeout3 = _interopRequireDefault(_setZeroTimeout2);

var _events = require('events');

var _virtualDom = require('virtual-dom');

var _virtualDomVirtualHyperscriptSvg = require('virtual-dom/virtual-hyperscript/svg');

var _virtualDomVirtualHyperscriptSvg2 = _interopRequireDefault(_virtualDomVirtualHyperscriptSvg);

var _setZeroTimeout4 = _interopRequireDefault(_setZeroTimeout2);

exports.setZeroTimeout = _setZeroTimeout4['default'];
Object.defineProperty(exports, 'EventEmitter', {
  enumerable: true,
  get: function get() {
    return _events.EventEmitter;
  }
});

function createElement(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return create(type, props, children);
}

var BaseComponent = (function (_EventEmitter) {
  _inherits(BaseComponent, _EventEmitter);

  _createClass(BaseComponent, null, [{
    key: 'mixin',
    value: function mixin(constructor) {
      var prototype = constructor.prototype;
      if (prototype && constructor.mixins && !constructor.mixins.done) {
        constructor.assignObject.apply(constructor, [prototype].concat(_toConsumableArray(constructor.mixins)));
        constructor.mixins.done = true;
      }
    }
  }, {
    key: 'appendDOM',
    value: attach,
    enumerable: true
  }, {
    key: 'assignObject',
    value: _assignObject2['default'],
    enumerable: true
  }, {
    key: 'createElement',
    value: createElement,
    enumerable: true
  }, {
    key: 'removeDOM',
    value: detach,
    enumerable: true
  }, {
    key: 'resolveDOM',
    value: resolve,
    enumerable: true
  }]);

  function BaseComponent() {
    _classCallCheck(this, BaseComponent);

    _get(Object.getPrototypeOf(BaseComponent.prototype), 'constructor', this).call(this);
    this.assignObject = this.constructor.assignObject;
    this.resolveDOM = this.constructor.resolveDOM;
    this.isUpdating = false;
    this.props = this.props || {};
    this.state = this.state || {};
    this.context = this.context || {};
    this.next = {};
    this.assignObject(this.props, this.constructor.defaultProps, this.props);
    this.constructor.mixin && this.constructor.mixin(this.constructor);
  }

  _createClass(BaseComponent, [{
    key: 'cancelUpdate',
    value: function cancelUpdate() {
      if (this.boundUpdate) {
        unsetZeroTimeout(this.boundUpdate);
        this.boundUpdate = null;
      }
      return this;
    }
  }, {
    key: 'mergeObjectProperty',
    value: function mergeObjectProperty(property, value) {
      var changes = this.next[property] = this.next[property] || [];
      changes.push(value);
    }
  }, {
    key: 'mount',
    value: function mount(parent) {
      var _this = this;

      this.refs = {};
      this.componentWillMount && this.componentWillMount();
      this.update(true);
      var finishMount = function finishMount() {
        // TODO: might need a timeout here
        _this.componentDidMount && _this.componentDidMount();
        _this.emit('mount');
      };
      if (parent) {
        this.constructor.appendDOM(this.domNode, parent);
        return finishMount();
      }
      return finishMount;
    }
  }, {
    key: 'replaceObjectProperty',
    value: function replaceObjectProperty(property, value) {
      var changes = this.next[property] = this.next[property] || [];
      changes.push(null);
      changes.push(value);
    }
  }, {
    key: 'safeRender',
    value: function safeRender() {
      return this.render(this.constructor);
    }
  }, {
    key: 'safeUpdate',
    value: function safeUpdate(force) {
      (force || this.boundUpdate) && this.cancelUpdate().update(force);
    }
  }, {
    key: 'setupContext',
    value: function setupContext(rootComponent, parentComponent) {
      this.rootComponent = rootComponent;
      this.parentComponent = parentComponent;
      this.context = this.assignObject({}, rootComponent.context, rootComponent && rootComponent.getChildContext());
      if (parentComponent && parentComponent !== rootComponent) {
        this.assignObject(this.context, parentComponent.getChildContext());
      }
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      this.componentWillUnmount && this.componentWillUnmount();
      this.lastVirtualElement = this.virtualElement;
      this.virtualElement = null;
      this.domNode = this.resolveDOM(this);
      this.lastVirtualElement = null;
      var parent = this.domNode && this.domNode.parentNode;
      if (parent) this.constructor.removeDOM(this.domNode);
      this.componentDidUnmount && this.componentDidUnmount();
      this.emit('unmount');
      if (this.domNode) {
        this.domNode.component = null;
        this.domNode = null;
      }
    }
  }, {
    key: 'queueUpdate',
    value: function queueUpdate(callback) {
      if (callback) this.once('update', callback);
      if (this.boundUpdate) return;
      this.boundUpdate = this.update.bind(this);
      (0, _setZeroTimeout3['default'])(this.boundUpdate);
    }
  }, {
    key: 'update',
    value: function update(force) {
      var _this2 = this;

      this.boundUpdate = null;
      this.isUpdating = true;
      var next = this.next,
          temp = { props: this.props, state: this.state };
      this.next = {};
      ['props', 'state'].forEach(function (property) {
        var changes = next[property] || [],
            lastNull = changes.lastIndexOf(null);
        if (lastNull !== -1) {
          changes = changes.slice(lastNull + 1);
          temp[property] = {};
        }
        if (temp[property] === _this2[property] && changes.length) {
          temp[property] = _this2.assignObject({}, temp[property]);
        }
        changes.forEach(function (change) {
          if (property === 'state' && typeof change === 'function') {
            change = change.call(_this2, temp.state, temp.props);
          }
          _this2.assignObject(temp[property], change);
        });
      });
      if (!force && this.shouldComponentUpdate && !this.shouldComponentUpdate(temp.props, temp.state)) return;
      this.assignObject(this, temp);
      !force && this.componentWillUpdate && this.componentWillUpdate(this.props, this.state);
      this.refs = {};
      this.lastVirtualElement = this.virtualElement;
      this.virtualElement = this.safeRender();
      // this.virtualElement.properties.key = this.virtualElement.properties.key || this.props.key;
      // this.virtualElement.key = this.virtualElement.key || this.props.key;
      if (this.domNode) delete this.domNode.component;
      this.domNode = this.resolveDOM(this);
      var finishUpdate = function finishUpdate() {
        !force && _this2.componentDidUpdate && _this2.componentDidUpdate();
        _this2.emit('update');
        _this2.isUpdating = false;
        _this2.lastComponent = null;
      };
      (0, _setZeroTimeout3['default'])(finishUpdate);
    }
  }]);

  return BaseComponent;
})(_events.EventEmitter);

exports.BaseComponent = BaseComponent;

var ReactComponent = (function (_BaseComponent) {
  _inherits(ReactComponent, _BaseComponent);

  _createClass(ReactComponent, null, [{
    key: 'Component',
    value: ReactComponent,

    // componentDidMount() {}
    // componentDidUnmount() {}
    // componentDidUpdate(prevProps, prevState) {}
    // componentWillMount() {}
    // componentWillReceiveProps(nextProps) {}
    // componentWillReceiveState(nextState) {}
    // componentWillUnmount() {}
    // componentWillUpdate(nextProps, nextState) {}
    // render(React) { return null; }
    // shouldComponentUpdate(nextProps, nextState) { return true; }
    enumerable: true
  }]);

  function ReactComponent(props, context) {
    _classCallCheck(this, ReactComponent);

    _get(Object.getPrototypeOf(ReactComponent.prototype), 'constructor', this).call(this);
    this.autoUpdateWhenPropsChange = true;
    props && this.assignObject(this.props, props);
    context && this.assignObject(this.context, context);
  }

  _createClass(ReactComponent, [{
    key: 'forceUpdate',
    value: function forceUpdate() {
      this.update(true);
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return this.childContext || {};
    }
  }, {
    key: 'getDOMNode',
    value: function getDOMNode() {
      return this.domNode;
    }
  }, {
    key: 'isMounted',
    value: function isMounted() {
      return this.domNode && this.domNode.parentNode;
    }
  }, {
    key: 'replaceProps',
    value: function replaceProps(newProps, callback) {
      this.replaceObjectProperty('props', newProps);
      this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
    }
  }, {
    key: 'replaceState',
    value: function replaceState(newState, callback) {
      this.replaceObjectProperty('state', newState);
      this.queueUpdate(callback);
    }
  }, {
    key: 'setProps',
    value: function setProps(nextProps, callback) {
      this.componentWillReceiveProps && this.componentWillReceiveProps(nextProps);
      this.mergeObjectProperty('props', nextProps);
      this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
    }
  }, {
    key: 'setState',
    value: function setState(nextState, callback) {
      this.componentWillReceiveState && this.componentWillReceiveState(nextState);
      this.mergeObjectProperty('state', nextState);
      this.queueUpdate(callback);
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
var Component = ReactComponent;

exports.Component = Component;

var ComponentWidget = (function () {
  function ComponentWidget(Component, props, children, context) {
    _classCallCheck(this, ComponentWidget);

    this.type = 'Widget';

    props = props || {};
    props.children = props.children ? props.children.concat(children) : children;
    this.component = new Component(props, context);
    this.name = this.component.displayName;
    this.id = this.name;
  }

  _createClass(ComponentWidget, [{
    key: 'init',
    value: function init() {
      var componentDidMount = this.component.mount();
      if (!this.component.domNode) return;
      (0, _setZeroTimeout3['default'])(componentDidMount);
      this.component.domNode.component = this.component;
      this.refHook(this.component.domNode);
      return this.component.domNode;
    }
  }, {
    key: 'update',
    value: function update(previous, domNode) {
      this.component.lastComponent = domNode.component || previous.component;
      this.component.virtualElement = this.component.lastComponent.virtualElement;
      this.component.assignObject(this.component.state, previous.component.state);
      this.component.update();
      if (this.component.domNode) {
        this.component.domNode.component = this.component;
      }
      this.refHook(domNode);
      return this.component.domNode;
    }
  }, {
    key: 'destroy',
    value: function destroy(domNode) {
      this.component.unmount();
      delete domNode.component;
    }
  }, {
    key: 'refHook',
    value: function refHook(domNode) {
      if (this.component.props.refHook) {
        this.component.props.refHook.hook(this.component.domNode || domNode);
      }
    }
  }]);

  return ComponentWidget;
})();

exports.ComponentWidget = ComponentWidget;

var RefHook = (function () {
  function RefHook(name, rootComponent) {
    _classCallCheck(this, RefHook);

    this.name = name;
    this.rootComponent = rootComponent;
  }

  _createClass(RefHook, [{
    key: 'hook',
    value: function hook(domNode) {
      var refs = this.rootComponent.refs;
      if (this.name.charAt(0) === '$') {
        refs[this.name] = refs[this.name] || [];
        if (domNode) refs[this.name].push(domNode.component || domNode);
      } else refs[this.name] = domNode.component || domNode || refs[this.name];
    }
  }]);

  return RefHook;
})();

exports.RefHook = RefHook;

var HtmlHook = (function () {
  function HtmlHook(value) {
    _classCallCheck(this, HtmlHook);

    this.value = value;
  }

  _createClass(HtmlHook, [{
    key: 'hook',
    value: function hook(domNode) {
      var html = this.value && this.value.__html || this.value;
      if (typeof html === 'string') domNode.innerHTML = html;
    }
  }]);

  return HtmlHook;
})();

exports.HtmlHook = HtmlHook;

var OnChangeHook = (function () {
  function OnChangeHook(handler) {
    _classCallCheck(this, OnChangeHook);

    this.handler = handler;
  }

  _createClass(OnChangeHook, [{
    key: 'onFocus',
    value: function onFocus(event) {
      this.changeInterval = setInterval(this.detectChange.bind(this, event), 100);
    }
  }, {
    key: 'onBlur',
    value: function onBlur(event) {
      this.detectChange(event);
      this.cancelInterval();
    }
  }, {
    key: 'detectChange',
    value: function detectChange(event) {
      if (event.target.value !== this.lastValue) {
        this.lastValue = event.target.value;
        this.handler(event);
      }
    }
  }, {
    key: 'cancelInterval',
    value: function cancelInterval() {
      clearInterval(this.changeInterval);
    }
  }, {
    key: 'hook',
    value: function hook(domNode, previous) {
      var _this3 = this;

      this.lastValue = domNode.value;

      // TODO: this is causing a memory leak
      var onFocusHandler = function onFocusHandler(event) {
        _this3.onFocus(event);
      },
          onBlurHandler = function onBlurHandler(event) {
        _this3.onBlur(event);
      };
      addEvent(domNode, 'focus', onFocusHandler);
      addEvent(domNode, 'blur', onBlurHandler);

      if (this.remove) this.remove();
      this.remove = function () {
        _this3.cancelInterval();
        removeEvent(domNode, 'focus', onFocusHandler);
        removeEvent(domNode, 'blur', onBlurHandler);
      };
    }
  }, {
    key: 'unhook',
    value: function unhook(domNode) {
      this.remove();
    }
  }]);

  return OnChangeHook;
})();

exports.OnChangeHook = OnChangeHook;

function addEvent(elem, event, fn) {
  if (elem.addEventListener) elem.addEventListener(event, fn, false);else elem.attachEvent('on' + event, function () {
    return fn.call(elem, window.event);
  });
}

function removeEvent(elem, event, fn) {
  if (elem.addEventListener) elem.removeEventListener(event, fn, false);else elem.detachEvent('on' + event, function () {
    return fn.call(elem, window.event);
  });
}

function attach(element, parent) {
  if (element && parent && parent.appendChild) return parent.appendChild(element);
  if (element) throw new Error('Failed to attach element.');
}

function detach(element) {
  if (element && element.parentNode) return element.parentNode.removeChild(element);
  if (element) throw new Error('Failed to detach element.');
}

function create(element, props, children, context) {
  var definition = element,
      type = typeof element;
  props = fixProps(props || {});
  if (type === 'string') {
    if (props.cssSelector) element += cssSelector;
    // TODO: you have to make sure to add svg={true} to every svg element or else it wont work
    definition = (props.svg ? _virtualDomVirtualHyperscriptSvg2['default'] : _virtualDom.h)(element, props, children);
  } else if (type === 'function') {
    definition = element.prototype && element.prototype.displayName ? new ComponentWidget(element, props, children, context) : element(props);
  }
  return definition;
}

function fixProps(props) {
  var newProps = {};
  Object.keys(props).forEach(function (prop) {
    if (prop === 'dangerouslySetInnerHTML') {
      newProps.htmlHook = new HtmlHook(props[prop]);
    }
    if (prop === 'defaultValue') {
      newProps.value = props.value || props.defaultValue;
    }
    if (prop === 'defaultChecked') {
      newProps.checked = typeof props.checked === 'boolean' ? props.checked : props.defaultChecked;
    }
    if (prop === 'style') {
      var styles = props[prop];
      if (Array.isArray(styles)) {
        if (styles.__cssMergeCache__) styles = styles.__cssMergeCache__;else styles = styles.__cssMergeCache__ = Object.assign.apply(Object, [{}].concat(_toConsumableArray(styles)));
      }
      newProps[prop] = typeof styles === 'string' ? styles : fixProps.fixStyles(styles);
      return;
    }
    if (prop === 'onChange') {
      newProps.onChangeHook = new OnChangeHook(props.onChange);
      return;
    }
    if (prop.indexOf('on') === 0) {
      var handler = props[prop];
      prop = prop.toLowerCase();
      newProps[prop] = handler;
      return;
    }
    newProps[prop] = props[prop];
  });
  return newProps;
}

// TODO: guard against css properties that do not use a unit.
var autoMap = { _off: 0, _on: 1, width: 0, height: 0 }; // on by default
fixProps.fixStyles = function fixStyles(styles) {
  if (styles) Object.keys(styles).forEach(function (key) {
    if (autoMap[key]) return;
    if (typeof styles[key] === 'number') styles[key] += 'px';
  });

  return styles;
};

function render(virtualElement, parentDomNode, callback, delay) {
  var detacher = undefined;

  if (virtualElement.component && virtualElement.component.mount) {
    virtualElement.component.mount(parentDomNode);
    detacher = virtualElement.component.unmount.bind(virtualElement.component);
  } else {
    (function () {
      var domNode = (0, _virtualDom.create)(virtualElement);

      attach(domNode, parentDomNode);

      detacher = function () {
        var changes = (0, _virtualDom.diff)(virtualElement, null);
        domNode = (0, _virtualDom.patch)(domNode, changes);
        detach(domNode, parentDomNode);
      };
    })();
  }

  if (callback) setTimeout(callback, delay || 0);

  return detacher;
}

function resolve(component, rootComponent) {
  walkVirtual(component.virtualElement, function (def, rootComponent, parentComponent) {
    if (def) {
      if (def.component) {
        if (def.component.setupContext) {
          def.component.setupContext(rootComponent, parentComponent);
        }
        if (def.component.props && def.component.props.ref) {
          def.component.props.refHook = def.component.props.refHook || new RefHook(def.component.props.ref, rootComponent);
        }
      } else if (def.properties && def.properties.ref) {
        def.properties.refHook = def.properties.refHook || new RefHook(def.properties.ref, rootComponent);
      }
    }
  }, component);

  var domNode = component.domNode || component.lastComponent && component.lastComponent.domNode;

  var lastDomNode = domNode;

  if (!domNode) {
    domNode = (0, _virtualDom.create)(component.virtualElement);
    if (domNode) domNode.component = component;
  } else {
    var changes = (0, _virtualDom.diff)(component.lastVirtualElement, component.virtualElement);
    domNode.component = component;
    domNode = (0, _virtualDom.patch)(domNode, changes);
    if (domNode) domNode.component = component;
  }

  if (lastDomNode && lastDomNode !== domNode) {
    if (lastDomNode.component && lastDomNode.component.domNode === lastDomNode) {
      lastDomNode.component.domNode = null;
    }
    lastDomNode.component = null;
  }

  return domNode;
}

function walkVirtual(definition, iterator, rootComponent, parentComponent) {
  var children = [];

  if (!definition || typeof definition !== 'object') return;
  if (definition.constructor.name === 'VirtualText') return;

  iterator(definition, rootComponent, parentComponent);

  if (Array.isArray(definition)) {
    children = definition.slice(0);
  }
  if (definition.component) {
    if (definition.component.props) {
      children = children.concat(definition.component.props.children || []);
    }
  }
  if (Array.isArray(definition.children)) {
    children = children.concat(definition.children);
  }

  if (Array.isArray(children)) {
    children.forEach(function (child) {
      return walkVirtual(child, iterator, rootComponent, definition.component || parentComponent);
    });
  }
}