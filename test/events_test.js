'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';


class EventsTest extends Component {
  componentWillMount() {
    this.context.expose('eventsTest', this);
  }

  render() {
    return (
      <div onChange={this.props.onChange}>
        {this.props.children}
      </div>
    );
  }
}

describe('Component DOM Events', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    this.onChange = chai.spy();
    return (
      <EventsTest onChange={this.onChange}></EventsTest>
    );
  }));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.eventsTest).to.be.ok
  });

  xdescribe('onChange', function () {
    it('can detect change events.');
    it('can detect value changes between change events.');
  });

  describe('cleanup', function () {
    beforeEach(cleanup);

    xit('removes all event listeners', function () {});
  });
});
