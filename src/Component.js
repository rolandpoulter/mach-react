'use strict';

import { EventEmitter } from 'events';
import { resolve, attach, detach } from './virtualDOM';
import * as machReact from './machReact';
import setZeroTimeout, { unsetZeroTimeout } from './setZeroTimeout';

// NOTE: BaseComponent is extended to make ReactComponent.

export class BaseComponent extends EventEmitter {

  machReact = machReact;

  assignObject = Object.assign;

  resolveDOM = resolve;
  appendDOM = attach;
  removeDOM = detach;

  state = {}
  props = {}
  context = {}
  childContext = {}

  // TODO: automatically mixin this.mixins if defined.

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
  }

  mount(parent) {
    this.refs = {};
    this.componentWillMount();
    this.update(true);
    if (parent) {
      this.appendDOM(this.domNode, parent);
      this.componentDidMount();
    }
    else return this.componentDidMount.bind(this);
  }

  unmount() {
    console.log('unmount', new Error().stack);
    this.componentWillUnmount();
    this.lastVirtualElement = this.virtualElement;
    this.virtualElement = null;
    this.domNode = this.resolveDOM(this);
    this.lastVirtualElement = null;
    let parent = this.domNode && this.domNode.parentNode;
    if (parent) this.removeDOM(this.domNode);
    this.componentDidUnmount();
    if (this.domNode) {
      this.domNode.component = null;
      this.domNode = null;
    }
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

  safeRender() {
    if (!this.render) throw new Error('Component missing render method.');
    return this.render(this.machReact);
  }

  safeUpdate(force) {
    if (force || !this.isUpdating) {
      this.cancelUpdate();
      this.update(force)
    }
  }
}

export default class ReactComponent extends BaseComponent {
  constructor(props, context) {
    super();
    if (props) this.props = this.assignObject(this.props, props);
    if (context) this.context = this.assignObject(this.context, context);
  }

  getDOMNode() {
    return this.domNode;
  }

  replaceState(newState, callback) {
    this.replaceObjectProperty('state', newState);
    this.queueUpdate(callback);
  }

  setState(nextState, callback) {
    if (typeof nextState === 'function') nextState = nextState(this.state, this.props);
    this.componentWillReceiveState(nextState);
    this.mergeObjectProperty('state', nextState);
    this.queueUpdate(callback);
  }

  autoUpdateWhenPropsChange = true;

  replaceProps(newProps, callback) { // Not in React anymore
    this.replaceObjectProperty('props', newProps);
    if (this.autoUpdateWhenPropsChange) this.queueUpdate();
  }

  setProps(nextProps, callback) { // Not in React anymore
    this.componentWillReceiveProps(nextProps);
    this.mergeObjectProperty('props', nextProps);
    if (this.autoUpdateWhenPropsChange) this.queueUpdate();
  }

  forceUpdate() {
    this.update(true);
  }

  isMounted() {
    return this.domNode && this.domNode.parentNode;
  }

  getChildContext() {
    return this.childContext || {};
  }

  get displayName() {
    return this.constructor.name;
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveState(nextState) {} // Not from React.
  componentWillReceiveProps(nextProps) {}
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {}
  componentDidUnmount() {} // Not from React.

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render(React) {
    return null;
  }
}
