'use strict';

import React, { Component } from '../src/index';

export default class It extends Component {
  componentDidMount() {
    this.run();
  }

  getChildContext() {
    return {
      describe: this
    };
  }

  render(React) {
    return <div>it{this.props.children}</div>;
  }

  run() {}
}
