'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class PropsTest extends Component {
  componentWillMount() {
    this.context.expose('propsTest', this);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

describe('Component.props', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    return (
      <PropsTest></PropsTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.propsTest).to.be.ok
  });

  it('can be set', function (done) {
    this.propsTest.props.invalid = true;
    expect(this.propsTest.props.props).to.not.be.ok;
    this.propsTest.setProps({prop: 'prop'}, function () {
      expect(this.props.invalid).to.be.ok;
      expect(this.props.prop).to.equal('prop');
      done();
    });
  });

  it('can be replaced', function (done) {
    this.propsTest.props.invalid = true;
    expect(this.propsTest.props.props).to.not.be.ok;
    this.propsTest.replaceProps({prop: 'prop'}, function () {
      expect(this.props.invalid).to.not.be.ok;
      expect(this.props.prop).to.equal('prop');
      done();
    });
  });
});
