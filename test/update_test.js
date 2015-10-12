'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class UpdateTest extends Component {
  componentWillMount() {
    this.context.expose('updateTest', this);
  }

  render() {
    return this.props.updateSpy(
      <div>
        {this.props.children}
      </div>
    );
  }
}

describe('Component.update', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    this.updateSpy = chai.spy(function (v) { return v; });
    return (
      <UpdateTest updateSpy={this.updateSpy}></UpdateTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.updateTest).to.be.ok
  });

  it('occurs immediately after state changes', function (done) {
    let updateSpy = this.updateSpy;
    this.updateTest.setState({}, function () {
      expect(updateSpy).to.have.been.called();
      done();
    });
  });

  it('occurs immediately after props changes', function (done) {
    let updateSpy = this.updateSpy;
    this.updateTest.setProps({}, function () {
      expect(updateSpy).to.have.been.called();
      done();
    });
  });
});
