'use strict';

import { Component } from '../src/index';

export default class ImmutableComponent extends Component {

  autoUpdateWhenPropsChange = false;

  setProps(nextProps, callback) {
    // TODO:
    return super.replaceProps(nextProps, callback);
  }

  setState(nextState, callback) {
    // TODO:
    return super.replaceState(nextState, callback);
  }

}
