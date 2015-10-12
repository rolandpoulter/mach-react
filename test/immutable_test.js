'use strict';

import { setup, cleanup } from './helpers';

import React from '../src/index';

import ImmutableComponent from '../extras/ImmutableComponent'

class ImmutableTest extends ImmutableComponent {
  componentWillMount() {
    this.context.expose('immutableTest', this);
  }

  render() {
    return (
      <div onChange={this.props.onChange}>
        {this.props.children}
      </div>
    );
  }
}

describe('extras/ImmutableComponent', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    return (
      <ImmutableTest></ImmutableTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.immutableTest).to.be.ok
  });

  it('does not permit dynamic props changes.');

  it('rebuilds the state object every time state is changed.');
});
