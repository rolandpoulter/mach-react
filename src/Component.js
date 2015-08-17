'use strict';

import { EventEmitter } from 'events';
import { resolve, attach, detach } from './virtualDOM';
import * as machReact from './machReact';
import setZeroTimeout, { unsetZeroTimeout } from './setZeroTimeout';

// NOTE: BaseComponent is extended to make ReactComponent.

export class BaseComponent extends EventEmitter {
  static appendDOM = attach;
  static assignObject = Object.assign;
  static machReact = machReact;
  static mixin(constructor) {
    let prototype = constructor.prototype;
    if (prototype && constructor.mixins && !constructor.mixins.done) {
      constructor.assignObject(prototype, ...constructor.mixins);
      constructor.mixins.done = true;;
    }
  }
  static removeDOM = detach;
  static resolveDOM = resolve;
  assignObject = this.constructor.assignObject;
  machReact = this.constructor.machReact;
  resolveDOM = this.constructor.resolveDOM;
  constructor() {
    super();
    if (this.constructor.mixin) { this.constructor.mixin(this.constructor); }
  }
  childContext = {}
  context = {}
  props = {}
  state = {}
  replaceObjectProperty(property, value, callback) {
    this[property] = this.assignObject({}, value);
  }

  mergeObjectProperty(property, value, callback) {
    this[property] = this.assignObject(this[property], value);
  }

  setupContext(parentComponent, rootComponent) {
    this.mergeObjectProperty('context', rootComponent.context);
    this.mergeObjectProperty('context', rootComponent.getChildContext());
    if (parentComponent && rootComponent !== parentComponent) {
      this.mergeObjectProperty('context', parentComponent.getChildContext());
    }
  }

  mount(parent) {
    this.refs = {};
    this.componentWillMount();
    this.update(true);
    this.emit('mount');
    if (parent) {
      this.constructor.appendDOM(this.domNode, parent);
      this.componentDidMount();
    }
    else return this.componentDidMount.bind(this);
  }

  unmount() {
    this.componentWillUnmount();
    this.lastVirtualElement = this.virtualElement;
    this.virtualElement = null;
    this.domNode = this.resolveDOM(this);
    this.lastVirtualElement = null;
    let parent = this.domNode && this.domNode.parentNode;
    if (parent) this.constructor.removeDOM(this.domNode);
    this.componentDidUnmount();
    if (this.domNode) {
      this.domNode.component = null;
      this.domNode = null;
    }
    this.emit('unmount');
  }

  isUpdating = false;
  queueUpdate(callback) {
    if (callback) this.once('updated', callback);
    if (this.isUpdating) return;
    this.updateFunc = this.update.bind(this);
    this.isUpdating = true;
    setZeroTimeout(this.updateFunc);
  }
  cancelUpdate() {
    if (this.isUpdating) {
      unsetZeroTimeout(this.updateFunc);
      this.isUpdating = false;
      this.updateFunc = null;
    }
    return this;
  }
  update(force) {
    if (!force) {
      if (!this.shouldComponentUpdate(this.props, this.state)) return;
      this.componentWillUpdate(this.props, this.state);
    }
    this.refs = {};
    this.lastVirtualElement = this.virtualElement;
    this.virtualElement = this.safeRender();
    this.domNode = this.resolveDOM(this);
    let finishUpdate = () => {
      if (!force) this.componentDidUpdate();
      this.emit('updated');
      this.isUpdating = false;
      this.updateFunc = null;
    };
    setZeroTimeout(finishUpdate);
  }
  safeRender() { return this.render(this.machReact); }
  safeUpdate(force) {
    if (force || !this.isUpdating) this.cancelUpdate().update(force)
  }
}

export default class ReactComponent extends BaseComponent {
  autoUpdateWhenPropsChange = true;
  componentDidMount() {}
  componentDidUnmount() {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {}
  componentWillReceiveState(nextState) {}
  componentWillUnmount() {}
  componentWillUpdate(nextProps, nextState) {}
  constructor(props, context) {
    super();
    if (props) this.props = this.assignObject(this.props, props);
    if (context) this.context = this.assignObject(this.context, context);
  }
  forceUpdate() { this.update(true); }
  get displayName() { return this.constructor.name; }
  getChildContext() { return this.childContext || {}; }
  getDOMNode() { return this.domNode; }
  isMounted() { return this.domNode && this.domNode.parentNode; }
  render(React) { return null; }
  replaceProps(newProps, callback) {
    this.replaceObjectProperty('props', newProps);
    if (this.autoUpdateWhenPropsChange) this.queueUpdate();
  }
  replaceState(newState, callback) {
    this.replaceObjectProperty('state', newState);
    this.queueUpdate(callback);
  }
  setProps(nextProps, callback) {
    this.componentWillReceiveProps(nextProps);
    this.mergeObjectProperty('props', nextProps);
    if (this.autoUpdateWhenPropsChange) this.queueUpdate();
  }
  setState(nextState, callback) {
    if (typeof nextState === 'function') nextState = nextState(this.state, this.props);
    this.componentWillReceiveState(nextState);
    this.mergeObjectProperty('state', nextState);
    this.queueUpdate(callback);
  }
  shouldComponentUpdate(nextProps, nextState) { return true; }
}
