'use strict';

import React, { Component } from '../src/index';

class Harness extends Component {
  context = {
    expose: (name, value) => {
      this[name] = value;
      this.props.scope[name] = value;
    }
  };

  getChildContext() {
    return this.context;
  }

  constructor(props, context) {
    super(props, context);
    props.scope.harness = this;
  }

  render() {
    return (
      <div class="Harness">{this.props.children}</div>
    );
  }
}

let cleanup = null;

export function setup (children, delay) {
  return function (done) {
    if (cleanup) { cleanup(); }
    React.setZeroTimeout(() => {
      let harness = <Harness scope={this}>{children.call(this)}</Harness>;
      cleanup = React.render(harness, document.body, () => {
        React.setZeroTimeout(done);
      }, delay);
    });
  };
}

export function cleanup (done) {
  React.setZeroTimeout(() => {
    if (cleanup) {
      cleanup();
    }
    cleanup = null;
    React.setZeroTimeout(done);
  });
}
