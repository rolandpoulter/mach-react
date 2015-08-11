'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var _virtualDom = require('virtual-dom');

var _setZeroTimeout = require('./setZeroTimeout');

var _setZeroTimeout2 = _interopRequireDefault(_setZeroTimeout);

var ComponentThunk = (function () {
  function ComponentThunk(Component, props, children, context) {
    _classCallCheck(this, ComponentThunk);

    this.type = 'Thunk';
    this.isComponent = true;

    props = props || {};
    props.children = props.children ? [props.children, children] : children;
    this.component = new Component(props, context);
  }

  _createClass(ComponentThunk, [{
    key: 'render',
    value: function render(previous) {
      if (previous && previous.component) {
        if (previous.component.displayName !== this.component.displayName) {
          // TODO: leave this in to see if this ever happens.
          throw new Error('Component mismatch!');
        } else {
          previous.component.context = this.component.context;
          // previous.component.replaceState(this.component.state);
          previous.component.replaceProps(this.component.props);
          this.component = previous.component;
        }
      }
      return new ComponentWidget(this.component);
    }
  }]);

  return ComponentThunk;
})();

var ComponentWidget = (function () {
  function ComponentWidget(component) {
    _classCallCheck(this, ComponentWidget);

    this.type = 'Widget';

    this.component = component;
  }

  _createClass(ComponentWidget, [{
    key: 'init',
    value: function init() {
      var componentDidMount = this.component.mount();
      // HACK: To get componentDidMount to be called after it isMounted,
      //       since it isn't called when mount is not given a parent element.
      (0, _setZeroTimeout2['default'])(componentDidMount);
      this.component.domNode.component = this.component;
      // NOTE: since this is using thunk and a widget to render, virtual-dom
      //       will not consider any props in the component automatically.
      //       This is why the hook is applied manually,
      if (this.component.props.refHook) {
        this.component.props.refHook.hook(this.component.domNode, 'ref');
      }
      return this.component.domNode;
    }
  }, {
    key: 'update',
    value: function update(previous, domNode) {
      this.component.safeUpdate();
      if (this.component.domNode) {
        this.component.domNode.component = this.component;
        if (this.component.props.refHook) {
          this.component.props.refHook.hook(this.component.domNode, 'ref', previous);
        }
      }
      return this.component.domNode;
    }
  }, {
    key: 'destroy',
    value: function destroy(domNode) {
      this.component.unmount();
    }
  }]);

  return ComponentWidget;
})();

var HtmlHook = (function () {
  function HtmlHook(value) {
    _classCallCheck(this, HtmlHook);

    this.value = value;
  }

  _createClass(HtmlHook, [{
    key: 'hook',
    value: function hook(domNode, propName, previousValue) {
      var html = this.value && this.value.__html || this.value;
      if (typeof html === 'string') domNode.innerHTML = html;
    }
  }]);

  return HtmlHook;
})();

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

var RefHook = (function () {
  function RefHook(name, component) {
    _classCallCheck(this, RefHook);

    this.name = name;
    this.component = component;
  }

  _createClass(RefHook, [{
    key: 'hook',
    value: function hook(domNode, propName, previousValue) {
      this.component.refs[this.name] = domNode.component || domNode;
    }
  }]);

  return RefHook;
})();

function addEvent(elem, event, fn) {
  if (elem.addEventListener) elem.addEventListener(event, fn, false);else elem.attachEvent('on' + event, function () {
    return fn.call(elem, window.event);
  });
}

function removeEvent(elem, event, fn) {
  if (elem.addEventListener) elem.addEventListener(event, fn, false);else elem.attachEvent('on' + event, function () {
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
    definition = (0, _virtualDom.h)(type, props, children);
    definition.context = context;
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
      if (Array.isArray(styles)) styles = Object.assign.apply(Object, _toConsumableArray(styles));
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
  walkVirtual(component.virtualElement, function (def, parent, root, parentComponent) {
    if (def) {
      if (def.component) {
        if (def.component.props.ref) {
          def.component.props.refHook = new RefHook(def.component.props.ref, component);
        }
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
      // TODO: leave this in to confirm that we ever get here. Then take it out.
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
  } else children = definition.children;
  if (Array.isArray(children)) {
    children.forEach(function (child) {
      return walkVirtual(child, iterator, definition, root, parentComponent);
    });
  }
}