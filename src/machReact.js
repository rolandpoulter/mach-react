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
    this.props = this.assignObject({}, this.constructor.defaultProps, this.props);
    this.props.key = this.props.key || (Math.floor(1024 + Math.random() * 31743)).toString(32);
    this.state = {};
    this.context = {};
    this.next = {};
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
  markVolatile() {
    if (!this.isVolatile) {
      this.isVolatile = true;
      this.once('update', () => {this.isVolatile = false});
    }
  }
  mergeObjectProperty(property, value) {
    let changes = this.next[property] = this.next[property] || [];
    changes.push(value);
  }
  mount(parent) {
    this.refs = {};
    this.componentWillMount && this.componentWillMount();
    this.update(true);
    let finishMount = () => {
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
  setupContext(parentComponent, rootComponent) {
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
    this.componentWillUnmount && his.componentWillUnmount();
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
    // this.refs = {};
    this.lastVirtualElement = this.virtualElement;
    this.virtualElement = this.safeRender();
    // let componentHook = new ComponentHook(this, this.virtualElement);
    // this.virtualElement.hooks = this.virtualElement.hooks || {};
    // this.virtualElement.hooks.componentHook =
    // this.virtualElement.properties.componentHook = componentHook;
    // TODO: apply hooks to virtualElement here, Instead of calling them manually?
    this.virtualElement.properties.key = this.virtualElement.properties.key || this.props.key;
    this.virtualElement.key = this.virtualElement.key || this.props.key;
    this.domNode = this.resolveDOM(this);
    let finishUpdate = () => {
      !force && this.componentDidUpdate && this.componentDidUpdate();
      this.emit('update');
      this.isUpdating = false;
    };
    setZeroTimeout(finishUpdate);
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
    this.markVolatile();
    this.replaceObjectProperty('state', newState);
    this.queueUpdate(callback);
  }
  setProps(nextProps, callback) {
    this.componentWillReceiveProps && this.componentWillReceiveProps(nextProps);
    this.mergeObjectProperty('props', nextProps);
    this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
  }
  setState(nextState, callback) {
    this.markVolatile();
    this.componentWillReceiveState && this.componentWillReceiveState(nextState);
    this.mergeObjectProperty('state', nextState);
    this.queueUpdate(callback);
  }
}

export let Component = ReactComponent;

export class ComponentThunk {
  type = 'Thunk';
  isComponent = true;
  constructor(Component, props, children, context) {
    props = props || {};
    props.children = props.children ? props.children.concat(children) : children;
    this.component = new Component(props, context);
  }
  render(previous) {
    if (previous && previous.component) {
      let prev = previous.vnode.component,
          next = this.component;
      if (prev && prev.key !== next.key) return new ComponentWidget(next);
      prev.assignObject(prev.context, next.context);
      prev.replaceProps(next.props);
      if (next.isVolatile) prev.setState(next.state);
      return previous.vnode;
    }
    return new ComponentWidget(this.component);
  }
}

export class ComponentWidget {
  type = 'Widget';
  constructor(component) {
    this.component = component;
    this.name = true;
    this.id = this.component.props.key;
  }
  init() {
    let componentDidMount = this.component.mount();
    if (!this.component.domNode) return;
    setZeroTimeout(componentDidMount);
    this.component.domNode.component = this.component;
    this.refHook();
    return this.component.domNode;
  }
  update(previous, domNode) {
    // this.component.safeUpdate();
    this.component.update();
    if (this.component.domNode) {
      this.component.domNode.component = this.component;
      this.refHook()
    }
    return this.component.domNode;
  }
  destroy(domNode) {
    this.component.unmount();
  }
  refHook() {
    if (this.component.props.ref) {
      RefHook.prototype.hook.call(
        {component: this.component.rootComponent, name: this.component.props.ref},
        this.component.domNode);
    }
  }
}

// export class ComponentHook {
//   constructor(component) {
//     this.component = component;
//   }
//   hook(domNode, propName, previousValue) {
//     debugger;
//     if (this.component.props.ref) {
//       this.name = this.component.props.ref;
//       RefHook.prototype.hook.call(this, domNode, propName, previousValue);
//     }
//   }
// }

export class RefHook {
  constructor(name, component) {
    this.name = name;
    this.component = component;
  }
  hook(domNode, propName, previousValue) {
    let refs = this.component.refs;
    if (this.name.charAt(0) === '$') {
      refs[this.name] = refs[this.name] || [];
      if (domNode) refs[this.name].push(domNode.component || domNode);
    }
    else refs[this.name] = domNode.component || domNode || refs[this.name];
  }
}

export class HtmlHook {
  constructor(value) { this.value = value; }
  hook(domNode, propName) {
    let html = this.value && this.value.__html || this.value;
    if (typeof html === 'string') domNode.innerHTML = html;
  }
}

export class OnChangeHook {
  onFocusHandler = this.onFocus.bind(this);
  onBlurHandler = this.onBlur.bind(this);
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
  hook(domNode, propName, previousValue) {
    this.lastValue = domNode.value;
    addEvent(domNode, 'focus', this.onFocusHandler);
    addEvent(domNode, 'blur', this.onBlurHandler)
  }
  unhook(domNode, propName) {
    this.cancelInterval();
    removeEvent(domNode, 'focus', this.onFocusHandler);
    removeEvent(domNode, 'blur', this.onBlurHandler);
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

export function create(type, props, children, context) {
  let definition;
  props = fixProps(props || {});
  if (typeof type === 'string') {
    if (props.cssSelector) type += cssSelector;
    // TODO: you have to make sure to add svg={true} to every svg element or else it wont work
    definition = (props.svg ? svg : h)(type, props, children);
    // definition.context = context;
  }
  else {
    definition = new ComponentThunk(type, props, children, context);
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
      if (Array.isArray(styles)) styles = Object.assign({}, ...styles);
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

fixProps.fixStyles = function fixStyles(styles) {
  if (styles) Object.keys(styles).forEach(key => {
    if (typeof styles[key] === 'number') styles[key] += 'px';
  });
  return styles;
};

export function render(virtualElement, parentDomNode, callback, delay) {
  let detacher;
  if (virtualElement.isComponent) {
    virtualElement.component.mount(parentDomNode);
    detacher = virtualElement.component.unmount.bind(virtualElement.component);
  }
  else {
    let domNode = createVirtualElement(virtualElement);
    attach(domNode, parentDomNode);
    detacher = function () {
      diff(virtualElement, null);
      domNode = patch(domNode, changes);
      detach(domNode, parentDomNode);
    }
  }
  if (callback) setTimeout(callback, delay || 0);
  return detacher;
}

export function resolve(component) {
  // TODO: refs are not being declared correctly, they work on the parent component, and not the component where they were defined in render()
  walkVirtual(component.virtualElement, (def, parent, root, parentComponent) => {
    if (def) {
      if (def.component) {
        def.component.setupContext(parentComponent, component);
      }
      else if (def.props && def.props.ref) {
        def.props.refHook = new RefHook(def.props.ref, component);
      }
    }
  });
  let domNode = component.domNode;
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
    // if (component.domNode !== domNode && component.domNode.parentNode && !domNode.parentNode) {
    //   console.warn(new Error(component.displayName + ': will replace domNode.').stack);
    //   component.domNode.parentNode.replaceNode(domNode, component.domNode);
    // }
  }
  if (lastDomNode && lastDomNode !== domNode) {
    if (lastDomNode.component && lastDomNode.component.domNode === lastDomNode) {
      lastDomNode.component.domNode = null;
    }
    lastDomNode.component = null;
  }
  return domNode;
}

export function walkVirtual(definition, iterator, parent, root, parentComponent) {
  root = root || definition;
  let children = null;
  if (!definition || typeof definition !== 'object') return;
  if (definition.constructor.name === 'VirtualText') return;
  iterator(definition, parent, root)
  if (Array.isArray(definition)) children = definition;
  else if (definition.isComponent) {
    parentComponent = definition;
    children = definition.component.props.children;
    // console.log(children, definition.component.next.props);
  }
  else children = definition.children;
  if (Array.isArray(children)) {
    children.forEach(child => walkVirtual(child, iterator, definition, root, parentComponent));
  }
}
