'use strict';
import assignObject from './assignObject';
import setZeroTimeout from './setZeroTimeout';
import { EventEmitter } from 'events';
import { h, diff, patch, create as createVirtualElement } from 'virtual-dom';
import svg from 'virtual-dom/virtual-hyperscript/svg';

export setZeroTimeout from './setZeroTimeout';
export { EventEmitter } from 'events';

export function createElement(type, props, ...children) {
  return create(type, props, children);
}

export class BaseComponent extends EventEmitter {
  static appendDOM = attach;
  static assignObject = assignObject;
  static createElement = createElement;
  static mixin(constructor) {
    let prototype = constructor.prototype;
    if (prototype && constructor.mixins && !constructor.mixins.done) {
      constructor.assignObject(prototype, ...constructor.mixins);
      constructor.mixins.done = true;
    }
  }
  static removeDOM = detach;
  static resolveDOM = resolve;
  assignObject = this.constructor.assignObject;
  resolveDOM = this.constructor.resolveDOM;
  constructor() {
    super();
    this.props = this.props || {};
    this.state = this.state || {};
    this.context = this.context || {};
    this.next = {};
    this.assignObject(this.props, this.constructor.defaultProps, this.props);
    this.constructor.mixin && this.constructor.mixin(this.constructor);
  }
  cancelUpdate() {
    if (this.boundUpdate) {
      unsetZeroTimeout(this.boundUpdate);
      this.boundUpdate = null;
    }
    return this;
  }
  isUpdating = false;
  mergeObjectProperty(property, value) {
    let changes = this.next[property] = this.next[property] || [];
    changes.push(value);
  }
  mount(parent) {
    this.refs = {};
    this.componentWillMount && this.componentWillMount();
    this.update(true);
    let finishMount = () => {
      // TODO: might need a timeout here
      this.componentDidMount && this.componentDidMount();
      this.emit('mount');
    }
    if (parent) {
      this.constructor.appendDOM(this.domNode, parent);
      return finishMount();
    }
    return finishMount;
  }
  replaceObjectProperty(property, value) {
    let changes = this.next[property] = this.next[property] || [];
    changes.push(null);
    changes.push(value);
  }
  safeRender() { return this.render(this.constructor); }
  safeUpdate(force) { (force || this.boundUpdate) && this.cancelUpdate().update(force); }
  setupContext(rootComponent, parentComponent) {
    this.rootComponent = rootComponent;
    this.parentComponent = parentComponent;
    this.context = this.assignObject({},
      rootComponent.context,
      rootComponent && rootComponent.getChildContext());
    if (parentComponent && parentComponent !== rootComponent) {
      this.assignObject(this.context, parentComponent.getChildContext());
    }
  }
  unmount() {
    this.componentWillUnmount && this.componentWillUnmount();
    this.lastVirtualElement = this.virtualElement;
    this.virtualElement = null;
    this.domNode = this.resolveDOM(this);
    this.lastVirtualElement = null;
    let parent = this.domNode && this.domNode.parentNode;
    if (parent) this.constructor.removeDOM(this.domNode);
    this.componentDidUnmount && this.componentDidUnmount();
    this.emit('unmount');
    if (this.domNode) {
      this.domNode.component = null;
      this.domNode = null;
    }
  }
  queueUpdate(callback) {
    if (callback) this.once('update', callback);
    if (this.boundUpdate) return;
    this.boundUpdate = this.update.bind(this);
    setZeroTimeout(this.boundUpdate);
  }
  update(force) {
    this.boundUpdate = null;
    this.isUpdating = true;
    let next = this.next,
        temp = {props: this.props, state: this.state};
    this.next = {};
    ['props', 'state'].forEach(property => {
      let changes = next[property] || [],
          lastNull = changes.lastIndexOf(null);
      if (lastNull !== -1) {
        changes = changes.slice(lastNull + 1);
        temp[property] = {};
      }
      if (temp[property] === this[property] && changes.length) {
        temp[property] = this.assignObject({}, temp[property]);
      }
      changes.forEach(change => {
        if (property === 'state' && typeof change === 'function') {
          change = change.call(this, temp.state, temp.props);
        }
        this.assignObject(temp[property], change);
      });
    });
    if (!force && this.shouldComponentUpdate &&
        !this.shouldComponentUpdate(temp.props, temp.state)) return;
    this.assignObject(this, temp);
    !force && this.componentWillUpdate && this.componentWillUpdate(this.props, this.state);
    this.refs = {};
    this.lastVirtualElement = this.virtualElement;
    let afterRender = () => {
      // this.virtualElement.properties.key = this.virtualElement.properties.key || this.props.key;
      // this.virtualElement.key = this.virtualElement.key || this.props.key;
      if (this.domNode) delete this.domNode.component;
      this.domNode = this.resolveDOM(this);
      let finishUpdate = () => {
        !force && this.componentDidUpdate && this.componentDidUpdate();
        this.emit('update');
        this.isUpdating = false;
        this.lastComponent = null;
      };
      setZeroTimeout(finishUpdate);
    };
    if (this.renderAsync) {
      this.renderAsync(this.constructor, (newVirtualElement) => {
        this.virtualElement = newVirtualElement;
        afterRender();
      });
    }
    else {
      this.virtualElement = this.safeRender();
      afterRender();
    }
  }
}

export default class ReactComponent extends BaseComponent {
  static Component = ReactComponent;
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
  autoUpdateWhenPropsChange = true;
  constructor(props, context) {
    super();
    props && this.assignObject(this.props, props);
    context && this.assignObject(this.context, context);
  }
  forceUpdate() { this.update(true); }
  get displayName() { return this.constructor.name; }
  getChildContext() { return this.childContext || {}; }
  getDOMNode() { return this.domNode; }
  isMounted() { return this.domNode && this.domNode.parentNode; }
  replaceProps(newProps, callback) {
    this.replaceObjectProperty('props', newProps);
    this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
  }
  replaceState(newState, callback) {
    this.replaceObjectProperty('state', newState);
    this.queueUpdate(callback);
  }
  setProps(nextProps, callback) {
    this.componentWillReceiveProps && this.componentWillReceiveProps(nextProps);
    this.mergeObjectProperty('props', nextProps);
    this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
  }
  setState(nextState, callback) {
    this.componentWillReceiveState && this.componentWillReceiveState(nextState);
    this.mergeObjectProperty('state', nextState);
    this.queueUpdate(callback);
  }
}

export let Component = ReactComponent;

export class ComponentWidget {
  type = 'Widget';
  constructor(Component, props, children, context) {
    props = props || {};
    props.children = props.children ? props.children.concat(children) : children;
    this.component = new Component(props, context);
    this.name = this.component.displayName;
    this.id = this.name;
  }
  init() {
    let componentDidMount = this.component.mount();
    if (!this.component.domNode) return;
    setZeroTimeout(componentDidMount);
    this.component.domNode.component = this.component;
    this.refHook(this.component.domNode);
    return this.component.domNode;
  }
  update(previous, domNode) {
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
  destroy(domNode) {
    this.component.unmount();
    delete domNode.component;
  }
  refHook(domNode) {
    if (this.component.props.refHook) {
      this.component.props.refHook.hook(this.component.domNode || domNode);
    }
  }
}

export class RefHook {
  constructor(name, rootComponent) {
    this.name = name;
    this.rootComponent = rootComponent;
  }
  hook(domNode) {
    let refs = this.rootComponent.refs;
    if (this.name.charAt(0) === '$') {
      refs[this.name] = refs[this.name] || [];
      if (domNode) refs[this.name].push(domNode.component || domNode);
    }
    else refs[this.name] = domNode.component || domNode || refs[this.name];
  }
}

export class HtmlHook {
  constructor(value) { this.value = value; }
  hook(domNode) {
    let html = this.value && this.value.__html || this.value;
    if (typeof html === 'string') domNode.innerHTML = html;
  }
}

export class OnChangeHook {
  constructor(handler) { this.handler = handler; }
  onFocus(event) {
    this.changeInterval = setInterval(this.detectChange.bind(this, event), 100);
  }
  onBlur(event) {
    this.detectChange(event);
    this.cancelInterval();
  }
  detectChange(event) {
    if (event.target.value !== this.lastValue) {
      this.lastValue = event.target.value;
      this.handler(event);
    }
  }
  cancelInterval() { clearInterval(this.changeInterval); }
  hook(domNode, previous) {
    this.lastValue = domNode.value;

    // TODO: this is causing a memory leak
    let onFocusHandler = event => { this.onFocus(event); },
        onBlurHandler = event => { this.onBlur(event); };
    addEvent(domNode, 'focus', onFocusHandler);
    addEvent(domNode, 'blur', onBlurHandler)

    if (this.remove) this.remove();
    this.remove = () => {
      this.cancelInterval();
      removeEvent(domNode, 'focus', onFocusHandler);
      removeEvent(domNode, 'blur', onBlurHandler);
    };
  }
  unhook(domNode) {
    this.remove();
  }
}

export function addEvent(elem, event, fn) {
  if (elem.addEventListener) elem.addEventListener(event, fn, false);
  else elem.attachEvent('on' + event, () => fn.call(elem, window.event));
}

export function removeEvent(elem, event, fn) {
  if (elem.addEventListener) elem.removeEventListener(event, fn, false);
  else elem.detachEvent('on' + event, () => fn.call(elem, window.event));
}

export function attach(element, parent) {
  if (element && parent && parent.appendChild) return parent.appendChild(element);
  if (element) throw new Error('Failed to attach element.');
}

export function detach(element) {
  if (element && element.parentNode) return element.parentNode.removeChild(element);
  if (element) throw new Error('Failed to detach element.');
}

export function create(element, props, children, context) {
  let definition = element,
      type = typeof element;
  props = fixProps(props || {});
  if (type === 'string') {
    if (props.cssSelector) element += cssSelector;
    // TODO: you have to make sure to add svg={true} to every svg element or else it wont work
    definition = (props.svg ? svg : h)(element, props, children);
  }
  else if (type === 'function') {
    definition = (element.prototype && element.prototype.displayName) ?
      new ComponentWidget(element, props, children, context) : element(props);
  }
  return definition;
}

export function fixProps(props) {
  let newProps = {};
  Object.keys(props).forEach(prop => {
    if (prop === 'dangerouslySetInnerHTML') {
      newProps.htmlHook = new HtmlHook(props[prop]);
    }
    if (prop === 'defaultValue') {
      newProps.value = props.value || props.defaultValue;
    }
    if (prop === 'defaultChecked') {
      newProps.checked = typeof props.checked === 'boolean' ?
        props.checked : props.defaultChecked;
    }
    if (prop === 'style') {
      let styles = props[prop];
      if (Array.isArray(styles)) {
        if (styles.__cssMergeCache__) styles = styles.__cssMergeCache__;
        else styles = styles.__cssMergeCache__ = Object.assign({}, ...styles);
      }
      newProps[prop] = typeof styles === 'string' ? styles : fixProps.fixStyles(styles);
      return;
    }
    if (prop === 'onChange') {
      newProps.onChangeHook = new OnChangeHook(props.onChange);
      return;
    }
    if (prop.indexOf('on') === 0) {
      let handler = props[prop];
      prop = prop.toLowerCase();
      newProps[prop] = handler;
      return;
    }
    newProps[prop] = props[prop];
  });
  return newProps;
}

// TODO: guard against css properties that do not use a unit.
const autoMap = {_off:0, _on:1, width:0, height:0}; // on by default
fixProps.fixStyles = function fixStyles(styles) {
  if (styles) Object.keys(styles).forEach(key => {
    if (autoMap[key]) return;
    if (typeof styles[key] === 'number') styles[key] += 'px';
  });

  return styles;
};

export function render(virtualElement, parentDomNode, callback, delay) {
  let detacher;

  if (virtualElement.component && virtualElement.component.mount) {
    virtualElement.component.mount(parentDomNode);
    detacher = virtualElement.component.unmount.bind(virtualElement.component);
  }

  else {
    let domNode = createVirtualElement(virtualElement);

    attach(domNode, parentDomNode);

    detacher = function () {
      let changes = diff(virtualElement, null);
      domNode = patch(domNode, changes);
      detach(domNode, parentDomNode);
    }
  }

  if (callback) setTimeout(callback, delay || 0);

  return detacher;
}

export function resolve(component, rootComponent) {
  walkVirtual(component.virtualElement, (def, rootComponent, parentComponent) => {
    if (def) {
      if (def.component) {
        if (def.component.setupContext) {
          def.component.setupContext(rootComponent, parentComponent);
        }
        if (def.component.props && def.component.props.ref) {
          def.component.props.refHook =
            def.component.props.refHook || new RefHook(def.component.props.ref, rootComponent);
        }
      }
      else if (def.properties && def.properties.ref) {
        def.properties.refHook =
          def.properties.refHook || new RefHook(def.properties.ref, rootComponent);
      }
    }
  }, component);

  let domNode = component.domNode ||
    component.lastComponent && component.lastComponent.domNode;

  let lastDomNode = domNode;

  if (!domNode) {
    domNode = createVirtualElement(component.virtualElement);
    if (domNode) domNode.component = component;
  }

  else {
    let changes = diff(component.lastVirtualElement, component.virtualElement);
    domNode.component = component;
    domNode = patch(domNode, changes);
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

export function walkVirtual(definition, iterator, rootComponent, parentComponent) {
  let children = [];

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
    children.forEach(child => walkVirtual(child, iterator, rootComponent, definition.component || parentComponent));
  }
}
