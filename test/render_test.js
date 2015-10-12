'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class RenderTest extends Component {
  componentWillMount() {
    this.context.expose('renderTest', this);
  }

  render() {
    return this.props.renderSpy(
      <div>
        {this.props.children}
      </div>
    );
  }
}

describe('Component Rendering', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    this.renderSpy = chai.spy(function (v) { return v; });
    return (
      <RenderTest renderSpy={this.renderSpy}></RenderTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.renderTest).to.be.ok
  });

  it('occurs immediately when mounted.', function () {
    expect(this.renderSpy).to.have.been.called();
  });
});
