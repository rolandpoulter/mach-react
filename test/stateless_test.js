'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';

describe('Stateless Component', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    let StatelessTest = (props, children) => {
      return <div>{props.name} {children}</div>;
    };
    this.statelessTest = <StatelessTest name={'Name'}>Hello World</StatelessTest>;
    return this.statelessTest;
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.statelessTest).to.be.ok;
  });

  it('generates a valid document.', function () {
    expect(this.statelessTest.tagName).to.equal('DIV');
    expect(this.statelessTest.children[0]).to.be.ok;
  })
});
