'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';

class ContextTest extends Component {
  getChildContext() {
    return {
      parent: this
    }
  }

  componentWillMount() {
    this.context.expose('contextTest', this);
  }

  render() {
    return (
      <div>
        <ChildContext ref="child" />
      </div>
    );
  }
}

class ChildContext extends Component {
  render() {
    return <div>Child Context</div>;
  }
}

describe('Component.context', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    return (
      <ContextTest></ContextTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.contextTest).to.be.ok;
  });

  it('is generated and accessible.', function () {
    expect(this.contextTest.refs.child.context.parent).to.be.ok;
  });
});
