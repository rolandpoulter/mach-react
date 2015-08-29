'use strict';

import React, { Component } from '../src/index';

export default class Expect extends Component {
  render(React) {
    return <div>assert{this.props.children}</div>;
  }
}
