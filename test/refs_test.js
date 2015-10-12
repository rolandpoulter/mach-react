'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class RefTest extends Component {
  componentWillMount() {
    this.context.expose('refTest', this);
  }

  render() {
    return (
      <div ref="refRoot">
        <NestedRefTest ref="nestedRef1">
          <NestedRefTest ref="nestedRef2" />
          <div ref="nestedElement" />
        </NestedRefTest>
        <div ref="element" />
        {this.props.children}
      </div>
    );
  }
}

class NestedRefTest extends Component {
  render() {
    return (
      <div ref="nestedRoot">{this.props.children}</div>
    );
  }
}

describe('Component.refs', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    return (
      <RefTest></RefTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.refTest).to.be.ok
  });

  describe('nested', function () {
    it('links a nested component with a ref', function () {
      expect(this.refTest.refs.nestedRef2).to.be.ok
    });

    it('links a nested element with a ref', function () {
      expect(this.refTest.refs.nestedElement).to.be.ok
    });
  });

  it('links a component with a ref', function () {
    expect(this.refTest.refs.nestedRef1).to.be.ok
    expect(!this.refTest.refs.nestedRef1.refs.nestedRef2).to.be.ok
  });

  it('links an element with a ref', function () {
    expect(this.refTest.refs.element).to.be.ok
  });
});
