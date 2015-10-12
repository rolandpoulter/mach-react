'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class StyleTest extends Component {
  componentWillMount() {
    this.context.expose('styleTest', this);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

describe('Element.style', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    return (
      <StyleTest></StyleTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.styleTest).to.be.ok
  });

  it('adds px to appropriate css properties.');

  describe('auto-prefixing', function () {});

  describe('mixins', function () {
    it('merges an array of styles.');
  });
});
