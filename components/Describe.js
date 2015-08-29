'use strict';

import React, { Component } from '../src/index';

export default class Describe extends Component {
  componentDidMount() {
    this.run();
  }

  render(React) {
    return <div>describe{this.props.children}</div>;
  }
}
