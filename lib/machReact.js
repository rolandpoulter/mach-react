'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
    this.props = this.assignObject({}, this.constructor.defaultProps, this.props);
    this.props.key = this.props.key || Math.floor(1024 + Math.random() * 31743).toString(32);
    this.state = {};
    this.context = {};
    this.next = {};
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
    key: 'markVolatile',
    value: function markVolatile() {
      var _this = this;

      if (!this.isVolatile) {
        this.isVolatile = true;
        this.once('update', function () {
          _this.isVolatile = false;
        });
      }
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
      var _this2 = this;

      this.refs = {};
      this.componentWillMount && this.componentWillMount();
      this.update(true);
      var finishMount = function finishMount() {
        _this2.componentDidMount && _this2.componentDidMount();
        _this2.emit('mount');
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
    value: function setupContext(parentComponent, rootComponent) {
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
      this.componentWillUnmount && his.componentWillUnmount();
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
      var _this3 = this;

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
        changes.forEach(function (change) {
          if (property === 'state' && typeof change === 'function') {
            change = change.call(_this3, temp.state, temp.props);
          }
          _this3.assignObject(temp[property], change);
        });
      });
      if (!force && this.shouldComponentUpdate && !this.shouldComponentUpdate(temp.props, temp.state)) return;
      this.assignObject(this, temp);
      !force && this.componentWillUpdate && this.componentWillUpdate(this.props, this.state);
      this.refs = {};
      this.lastVirtualElement = this.virtualElement;
      this.virtualElement = this.safeRender();
      this.virtualElement.properties.key = this.virtualElement.properties.key || this.props.key;
      this.virtualElement.key = this.virtualElement.key || this.props.key;
      this.domNode = this.resolveDOM(this);
      var finishUpdate = function finishUpdate() {
        !force && _this3.componentDidUpdate && _this3.componentDidUpdate();
        _this3.emit('update');
        _this3.isUpdating = false;
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
      this.markVolatile();
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
      this.markVolatile();
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

var ComponentThunk = (function () {
  function ComponentThunk(Component, props, children, context) {
    _classCallCheck(this, ComponentThunk);

    this.type = 'Thunk';
    this.isComponent = true;

    props = props || {};
    props.children = props.children ? props.children.concat(children) : children;
    this.component = new Component(props, context);
  }

  _createClass(ComponentThunk, [{
    key: 'render',
    value: function render(previous) {
      if (previous && previous.component) {
        var prev = previous.vnode.component,
            next = this.component;
        if (prev && prev.key !== next.key) return new ComponentWidget(next);
        prev.assignObject(prev.context, next.context);
        prev.replaceProps(next.props);
        if (next.isVolatile) prev.setState(next.state);
        previous.vnode.refHook();
        return previous.vnode;
      }
      return new ComponentWidget(this.component);
    }
  }]);

  return ComponentThunk;
})();

exports.ComponentThunk = ComponentThunk;

var ComponentWidget = (function () {
  function ComponentWidget(component) {
    _classCallCheck(this, ComponentWidget);

    this.type = 'Widget';

    this.component = component;
    this.name = true;
    this.id = this.component.props.key;
  }

  _createClass(ComponentWidget, [{
    key: 'init',
    value: function init() {
      var componentDidMount = this.component.mount();
      if (!this.component.domNode) return;
      (0, _setZeroTimeout3['default'])(componentDidMount);
      this.component.domNode.component = this.component;
      this.refHook();
      return this.component.domNode;
    }
  }, {
    key: 'update',
    value: function update(previous, domNode) {
      this.component.update();
      if (this.component.domNode) {
        this.component.domNode.component = this.component;
        this.refHook();
      }
      return this.component.domNode;
    }
  }, {
    key: 'destroy',
    value: function destroy(domNode) {
      this.component.unmount();
    }
  }, {
    key: 'refHook',
    value: function refHook() {
      if (this.component.props.ref) {
        RefHook.prototype.hook.call({ component: this.component.rootComponent, name: this.component.props.ref }, this.component.domNode);
      }
    }
  }]);

  return ComponentWidget;
})();

exports.ComponentWidget = ComponentWidget;

var RefHook = (function () {
  function RefHook(name, component) {
    _classCallCheck(this, RefHook);

    this.name = name;
    this.component = component;
  }

  _createClass(RefHook, [{
    key: 'hook',
    value: function hook(domNode, propName, previousValue) {
      var refs = this.component.refs;
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
    value: function hook(domNode, propName) {
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

    this.onFocusHandler = this.onFocus.bind(this);
    this.onBlurHandler = this.onBlur.bind(this);
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
    value: function hook(domNode, propName, previousValue) {
      this.lastValue = domNode.value;
      addEvent(domNode, 'focus', this.onFocusHandler);
      addEvent(domNode, 'blur', this.onBlurHandler);
    }
  }, {
    key: 'unhook',
    value: function unhook(domNode, propName) {
      this.cancelInterval();
      removeEvent(domNode, 'focus', this.onFocusHandler);
      removeEvent(domNode, 'blur', this.onBlurHandler);
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

function create(type, props, children, context) {
  var definition = undefined;
  props = fixProps(props || {});
  if (typeof type === 'string') {
    if (props.cssSelector) type += cssSelector;
    // TODO: you have to make sure to add svg={true} to every svg element or else it wont work
    definition = (props.svg ? _virtualDomVirtualHyperscriptSvg2['default'] : _virtualDom.h)(type, props, children);
    // definition.context = context;
  } else {
      definition = new ComponentThunk(type, props, children, context);
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
      if (Array.isArray(styles)) styles = Object.assign.apply(Object, [{}].concat(_toConsumableArray(styles)));
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

fixProps.fixStyles = function fixStyles(styles) {
  if (styles) Object.keys(styles).forEach(function (key) {
    if (typeof styles[key] === 'number') styles[key] += 'px';
  });
  return styles;
};

function render(virtualElement, parentDomNode, callback, delay) {
  var detacher = undefined;
  if (virtualElement.isComponent) {
    virtualElement.component.mount(parentDomNode);
    detacher = virtualElement.component.unmount.bind(virtualElement.component);
  } else {
    (function () {
      var domNode = (0, _virtualDom.create)(virtualElement);
      attach(domNode, parentDomNode);
      detacher = function () {
        (0, _virtualDom.diff)(virtualElement, null);
        domNode = (0, _virtualDom.patch)(domNode, changes);
        detach(domNode, parentDomNode);
      };
    })();
  }
  if (callback) setTimeout(callback, delay || 0);
  return detacher;
}

function resolve(component) {
  // TODO: refs are not being declared correctly, they work on the parent component,
  //       and not the component where they were defined in render()
  walkVirtual(component.virtualElement, function (def, parent, root, parentComponent) {
    if (def) {
      if (def.component) {
        def.component.setupContext(parentComponent, component);
      } else if (def.props && def.props.ref) {
        def.props.refHook = new RefHook(def.props.ref, component);
      }
    }
  });
  var domNode = component.domNode;
  var lastDomNode = domNode;
  if (!domNode) {
    domNode = (0, _virtualDom.create)(component.virtualElement);
    if (domNode) domNode.component = component;
  } else {
    var _changes = (0, _virtualDom.diff)(component.lastVirtualElement, component.virtualElement);
    domNode.component = component;
    domNode = (0, _virtualDom.patch)(domNode, _changes);
    if (domNode) domNode.component = component;
    if (component.domNode !== domNode && component.domNode.parentNode && !domNode.parentNode) {
      console.warn(new Error(component.displayName + ': will replace domNode.').stack);
      component.domNode.parentNode.replaceNode(domNode, component.domNode);
    }
  }
  if (lastDomNode && lastDomNode !== domNode) {
    if (lastDomNode.component && lastDomNode.component.domNode === lastDomNode) {
      lastDomNode.component.domNode = null;
    }
    lastDomNode.component = null;
  }
  return domNode;
}

function walkVirtual(definition, iterator, parent, root, parentComponent) {
  root = root || definition;
  var children = null;
  if (!definition || typeof definition !== 'object') return;
  if (definition.constructor.name === 'VirtualText') return;
  iterator(definition, parent, root);
  if (Array.isArray(definition)) children = definition;else if (definition.isComponent) {
    parentComponent = definition;
    children = definition.component.props.children;
    // TODO: getting children from props here might be dangerous
    // console.log(children, definition.component.next.props);
  } else children = definition.children;
  if (Array.isArray(children)) {
    children.forEach(function (child) {
      return walkVirtual(child, iterator, definition, root, parentComponent);
    });
  }
}