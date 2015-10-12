'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class SvgTest extends Component {
  componentWillMount() {
    this.context.expose('svgTest', this);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

describe('SVG Elements', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    return (
      <SvgTest></SvgTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.svgTest).to.be.ok
  });

  it('can render an svg element');

  it('automatically propagates svg=true to children');
});
