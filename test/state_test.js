'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class StateTest extends Component {
  componentWillMount() {
    this.context.expose('stateTest', this);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

describe('Component.state', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    return (
      <StateTest></StateTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.stateTest).to.be.ok
  });

  it('can be set', function (done) {
    this.stateTest.state.invalid = true;
    expect(this.stateTest.state.state).to.not.be.ok;
    this.stateTest.setState({state: 'state'}, function () {
      expect(this.state.invalid).to.be.ok;
      expect(this.state.state).to.equal('state');
      done();
    });
  });

  it('can be replaced', function (done) {
    this.stateTest.state.invalid = true;
    expect(this.stateTest.state.state).to.not.be.ok;
    this.stateTest.replaceState({state: 'state'}, function () {
      expect(this.state.invalid).to.not.be.ok;
      expect(this.state.state).to.equal('state');
      done();
    });
  });
});
