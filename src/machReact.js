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
    this.next = {};
    this.last = {};
    this.state = {};
    this.context = {};
    this.pending = {};
    this.constructor.mixin && this.constructor.mixin(this.constructor);
  }
  cancelUpdate() {
    if (this.isUpdating) {
      unsetZeroTimeout(this.updateFunc);
      this.isUpdating = false;
      this.updateFunc = null;
    }
    return this;
  }
  isUpdating = false;
  mergeObjectProperty(property, value) {
    // this.last[property] = this.assignObject(this.last[property] || {}, this[property]);
    // this.assignObject(this[property], value);
    // this.next[property] = this.assignObject(this.next[property] || {}, this[property]);
    // this.pending[property] = Date.now();
    let target = this[property] ? this.next : this;
    target[property] = this.assignObject(this.next[property] || {}, this[property], value);
    this.pending[property] = Date.now();
    this.last[property] = this[property];
    this[property] = target[property];
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
  queueUpdate(callback) {
    if (callback) this.once('update', callback);
    if (this.isUpdating) return;
    this.updateFunc = this.update.bind(this);
    this.isUpdating = true;
    setZeroTimeout(this.updateFunc);
  }
  replaceObjectProperty(property, value) {
    // this.mergeObjectProperty(property, value);
    let target = this[property] ? this.next : this;
    target[property] = this.assignObject({}, value);
    this.pending[property] = Date.now();
    this.last[property] = this[property];
    this[property] = target[property];
  }
  safeRender() { return this.render(this.constructor); }
  safeUpdate(force) { (force || !this.isUpdating) && this.cancelUpdate().update(force); }
  setupContext(parentComponent, rootComponent) {
    this.mergeObjectProperty('context', rootComponent.context);
    this.mergeObjectProperty('context', rootComponent.getChildContext());
    if (parentComponent && rootComponent !== parentComponent) {
      this.mergeObjectProperty('context', parentComponent.getChildContext());
    }
    // this.context = this.next.context;
    // this.next.context = null;
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
  update(force) {
    this.assignObject(this, this.last);
    if (!force) {
      if (this.shouldComponentUpdate &&
          !this.shouldComponentUpdate(this.next.props || this.props,
                                      this.next.state || this.state)) return;
      this.componentWillUpdate && this.componentWillUpdate(this.props, this.state);
    }
    this.assignObject(this, this.next);
    this.next = {};
    this.refs = {};
    this.lastVirtualElement = this.virtualElement;
    this.virtualElement = this.safeRender();
    // TODO: apply hooks to virtualElement here, Instead of calling them manually?
    this.virtualElement.key = this.virtualElement.key || this.props.key;
    // console.log('virtual render', this.virtualElement);
    this.domNode = this.resolveDOM(this);
    let finishUpdate = () => {
      !force && this.componentDidUpdate && this.componentDidUpdate();
      this.emit('update');
      this.pending = {};
      this.isUpdating = false;
      this.updateFunc = null;
    };
    setZeroTimeout(finishUpdate);
  }
}

// TODO: add Component.prototype.defaultProps to make it easier to declare props defaults.
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
    props && this.mergeObjectProperty('props', props);
    context && this.mergeObjectProperty('context', context);
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
    if (typeof nextState === 'function') nextState = nextState(this.state, this.props);
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
    props.children = props.children ? [props.children, children] : children;
    this.component = new Component(props, context);
  }
  render(previous) {
    debugger;
    if (previous && previous.component) {
      let prev = previous.component,
          next = this.component;
      if (previous.component.displayName !== this.component.displayName) {
        previous.component.unmount();
      }
      else {
        // let other = previous.component,
        //     prev = previous.vnode.component,
        //     next = this.component;
        prev.replaceObjectProperty('context', next.context);
        prev.replaceObjectProperty('props', next.props);
        prev.mergeObjectProperty('state', next.state);
        // previous.vnode.update();
        // return previous.vnode;
        previous.component.update();
        return previous.component.virtualElement;
      }
    }
    let componentDidMount = this.component.mount();
    if (!this.component.domNode) return;
    setZeroTimeout(componentDidMount);
    this.component.domNode.component = this.component;
    debugger;
    // console.log('init', this.component.props.refHook);
    // if (this.component.props.refHook) {
    //   this.component.props.refHook.hook(this.component.domNode, 'ref');
    // }
    return this.component.virtualElement;
  }
}

// export class ComponentThunk {
//   type = 'Thunk';
//   isComponent = true;
//   constructor(Component, props, children, context) {
//     props = props || {};
//     props.children = props.children ? [props.children, children] : children;
//     this.component = new Component(props, context);
//   }
//   render(previous) {
//     if (previous && previous.component) {
//       if (previous.component.displayName !== this.component.displayName) {
//         throw new Error('ComponentThunk: ' + previous.component.displayName + ': component mismatch');
//       }
//       let other = previous.component,
//           prev = previous.vnode.component,
//           next = this.component;
//       // console.log('Render', prev.displayName);
//       // console.log('===', prev === other, prev === next, next === other);
//       // console.log('pending', prev.pending, next.pending, other.pending);
//       // console.log('context', prev.context, next.context, other.context);
//       // console.log('props', prev.props, next.props, other.props);
//       // console.log('state', prev.state, next.state, other.state);
//       // console.log('refs', prev.refs, next.refs, other.refs);
//       prev.replaceObjectProperty('context', next.context);
//       prev.replaceObjectProperty('props', next.props);
//       // prev.mergeObjectProperty('state', next.state);
//       previous.vnode.update();
//       return previous.vnode;
//     }
//     return new ComponentWidget(this.component);
//   }
// }

// export class ComponentWidget {
//   type = 'Widget';
//   constructor(component) {
//     this.component = component;
//   }
//   init() {
//     let componentDidMount = this.component.mount();
//     if (!this.component.domNode) return;
//     setZeroTimeout(componentDidMount);
//     this.component.domNode.component = this.component;
//     console.log('init', this.component.props.refHook);
//     if (this.component.props.refHook) {
//       this.component.props.refHook.hook(this.component.domNode, 'ref');
//     }
//     return this.component.domNode;
//   }
//   update(previous, domNode) {
//     this.component.safeUpdate();
//     console.log('update');
//     if (this.component.domNode) {
//       this.component.domNode.component = this.component;
//       console.log('update2', this.component.props.refHook);
//       if (this.component.props.refHook) {
//         this.component.props.refHook.hook(this.component.domNode, 'ref');
//       }
//     }
//     return this.component.domNode;
//   }
//   destroy(domNode) {
//     this.component.unmount();
//   }
// }

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

// TODO: refs are not being declared corrent, they work on the parent component, and not the component where they were defined in render()
export class RefHook {
  constructor(name, component) {
    this.name = name;
    this.component = component;
  }
  hook(domNode, propName, previousValue) {
    let refs = this.component.refs;
    if (this.name.charAt(0) === '$') {
      refs[this.name] = refs[this.name] || []
      refs[this.name].push(domNode.component || domNode);
    }
    else refs[this.name] = domNode.component || domNode;
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
    definition.context = context;
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
  walkVirtual(component.virtualElement, (def, parent, root, parentComponent) => {
    if (def) {
      if (def.component) {
        console.log('got here', def.component.props.ref);
        if (def.component.props.ref) {
          def.component.props.refHook = new RefHook(def.component.props.ref, component);
        }
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
  }
  else children = definition.children;
  if (Array.isArray(children)) {
    children.forEach(child => walkVirtual(child, iterator, definition, root, parentComponent));
  }
}
