'use strict';

import React, { Component } from '../src/index';

export default class Describe extends Component {
  componentDidMount() {
    this.run();
  }

  getChildContext() {
    return {
      describe: this
    };
  }

  render(React) {
    return (
      <div>
        Describe: A {this.props.a}
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }

  run() {}
}
