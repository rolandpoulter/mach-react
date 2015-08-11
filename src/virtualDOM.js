'use strict';

import { h, diff, patch, create as createElement } from 'virtual-dom';
import setZeroTimeout from './setZeroTimeout';

class ComponentThunk {
  type = 'Thunk';
  isComponent = true;

  constructor(Component, props, children, context) {
    props = props || {};
    props.children = props.children ? [props.children, children] : children;
    this.component = new Component(props, context);
  }

  render(previous) {
    if (previous && previous.component) {
      if (previous.component.displayName !== this.component.displayName) {
        // TODO: leave this in to see if this ever happens.
        throw new Error('Component mismatch!');
      }
      else {
        previous.component.context = this.component.context;
        // previous.component.replaceState(this.component.state);
        previous.component.replaceProps(this.component.props);
        this.component = previous.component;
      }
    }
    return new ComponentWidget(this.component);
  }
}

class ComponentWidget {
  type = 'Widget';

  constructor(component) {
    this.component = component;
  }

  init() {
    let componentDidMount = this.component.mount();
    // HACK: To get componentDidMount to be called after it isMounted,
    //       since it isn't called when mount is not given a parent element.
    setZeroTimeout(componentDidMount);
    this.component.domNode.component = this.component;
    // NOTE: since this is using thunk and a widget to render, virtual-dom
    //       will not consider any props in the component automatically.
    //       This is why the hook is applied manually,
    if (this.component.props.refHook) {
      this.component.props.refHook.hook(this.component.domNode, 'ref');
    }
    return this.component.domNode;
  }

  update(previous, domNode) {
    this.component.safeUpdate();
    if (this.component.domNode) {
      this.component.domNode.component = this.component;
      if (this.component.props.refHook) {
        this.component.props.refHook.hook(this.component.domNode, 'ref', previous);
      }
    }
    return this.component.domNode;
  }

  destroy(domNode) {
    this.component.unmount();
  }
}

class HtmlHook {
  constructor(value) { this.value = value; }

  hook(domNode, propName, previousValue) {
    let html = this.value && this.value.__html || this.value;
    if (typeof html === 'string') domNode.innerHTML = html;
  }
}

class OnChangeHook {
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

class RefHook {
  constructor(name, component) {
    this.name = name;
    this.component = component;
  }

  hook(domNode, propName, previousValue) {
    this.component.refs[this.name] = domNode.component || domNode;
  }
}

export function addEvent(elem, event, fn) {
  if (elem.addEventListener) elem.addEventListener(event, fn, false);
  else elem.attachEvent('on' + event, () => fn.call(elem, window.event));
}

export function removeEvent(elem, event, fn) {
  if (elem.addEventListener) elem.addEventListener(event, fn, false);
  else elem.attachEvent('on' + event, () => fn.call(elem, window.event));
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
    definition = h(type, props, children);
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
      if (Array.isArray(styles)) styles = Object.assign(...styles);
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
    let domNode = createElement(virtualElement);
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
    domNode = createElement(component.virtualElement);
    if (domNode) domNode.component = component;
  }
  else {
    let changes = diff(component.lastVirtualElement, component.virtualElement);
    domNode.component = component;
    domNode = patch(domNode, changes);
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
