'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class KeyTest extends Component {
  componentWillMount() {
    this.context.expose('keyTest', this);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

describe('Component/Element Keys', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    return (
      <KeyTest>
        <span key="1"></span>
        <span key="2"></span>
        <span key="3"></span>
      </KeyTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.keyTest).to.be.ok
  });

  it('does not generate a new node.', function () {});

  it('knows how to deal with re-ordered keys.', function () {});
});
