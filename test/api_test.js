'use strict';

import { setup, cleanup } from './helpers';

import React, { Component } from '../src/index';

let { BaseComponent } = React;

let mixinObject = {
  property: 'property'
}

// class MixinClass {
//   static _static () {}
//
//   method() {}
// }

let assignObjectSpy = chai.spy();

class ApiTest extends Component {
  static assignObject(target, ...mixins) {
    assignObjectSpy(target, ...mixins);
    return BaseComponent.assignObject.apply(this, arguments);
  }

  static mixins = [mixinObject];//, MixinClass];

  static mixin(constructor) {
    BaseComponent.mixin(constructor);
  }

  constructor(props, context) {
    super(props, context);
    props.api.constructor.apply(this, arguments);
  }

  componentDidMount() {
    this.props.api.componentDidMount.apply(this, arguments);
  }

  componentDidUnmount() {
    this.props.api.componentDidUnmount.apply(this, arguments);
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.api.componentDidUpdate.apply(this, arguments);
  }

  componentWillMount() {
    this.context.expose('apiTest', this);
    this.props.api.componentWillMount.apply(this, arguments);
  }

  componentWillReceiveProps(nextProps) {
    this.props.api.componentWillReceiveProps.apply(this, arguments);
  }

  componentWillReceiveState(nextState) {
    this.props.api.componentWillReceiveState.apply(this, arguments);
  }

  componentWillUnmount() {
    this.props.api.componentWillUnmount.apply(this, arguments);
  }

  componentWillUpdate(nextProps, nextState) {
    this.props.api.componentWillUpdate.apply(this, arguments);
  }

  render(React) {
    return this.props.api.render.apply(this, arguments);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.api.shouldComponentUpdate.apply(this, arguments);
  }
}

describe('API', function () {
  afterEach(cleanup);

  beforeEach(setup(function () {
    let api = this.api = {
      constructor: chai.spy(function () {
        expect(api.componentWillMount).to.not.have.been.called();
      }),

      componentDidMount: chai.spy(function () {
        expect(api.componentWillUpdate).to.not.have.been.called();
        this.setState({key: 'value'});
        this.setProps({api: this.props.api, key: 'value'});
      }),

      componentDidUnmount: chai.spy(),

      componentDidUpdate: chai.spy(function () {
        expect(api.componentWillUnmount).to.not.have.been.called();
        this.unmount();
      }),

      componentWillMount: chai.spy(function () {
        expect(api.componentWillUnmount).to.not.have.been.called();
      }),

      componentWillReceiveProps: chai.spy(function () {
        expect(api.shouldComponentUpdate).to.not.have.been.called();
      }),

      componentWillReceiveState: chai.spy(function () {
        expect(api.shouldComponentUpdate).to.not.have.been.called();
      }),

      componentWillUnmount: chai.spy(function () {
        expect(api.componentDidUnmount).to.not.have.been.called();
      }),

      componentWillUpdate: chai.spy(function () {
        expect(api.componentDidUpdate).to.not.have.been.called();
      }),

      render: chai.spy(function () {
        return (
          <div></div>
        );
      }),

      shouldComponentUpdate: chai.spy(function () {
        expect(api.componentWillUpdate).to.not.have.been.called();
        return true;
      })
    };

    return (
      <ApiTest api={this.api}></ApiTest>
    );
  }, 10));

  it('is ready to test.', function () {
    expect(this.harness).to.be.ok;
    expect(this.apiTest).to.be.ok;
  });

  it('constructor', function () {
    expect(this.api.constructor).to.have.been.called();
  });

  it('mixin', function () {
    expect(this.apiTest.property).to.equal('property');
    // expect(this.apiTest.method).to.be.ok;
    // expect(this.apiTest.constructor._static).to.equal('_static');
  });

  it('componentDidMount', function () {
    expect(this.api.componentDidMount).to.have.been.called();
  });

  it('componentDidUnmount', function () {
    expect(this.api.componentDidUnmount).to.have.been.called();
  });

  it('componentDidUpdate', function () {
    expect(this.api.componentDidUpdate).to.have.been.called();
  });

  it('componentWillMount', function () {
    expect(this.api.componentWillMount).to.have.been.called();
  });

  it('componentWillReceiveProps', function () {
    expect(this.api.componentWillReceiveProps).to.have.been.called();
  });

  it('componentWillReceiveState', function () {
    expect(this.api.componentWillReceiveState).to.have.been.called();
  });

  it('componentWillUnmount', function () {
    expect(this.api.componentWillUnmount).to.have.been.called();
  });

  it('componentWillUpdate', function () {
    expect(this.api.componentWillUpdate).to.have.been.called();
  });

  it('render', function () {
    expect(this.api.render).to.have.been.called();
  });

  it('shouldComponentUpdate', function () {
    expect(this.api.shouldComponentUpdate).to.have.been.called();
  });

  // TOOD:
  // autoUpdateWhenPropsChange;
  // forceUpdate()
  // get displayName()
  // getChildContext()
  // getDOMNode()
  // isMounted()
  // replaceProps(newProps, callback)
  // replaceState(newState, callback)
  // setProps(nextProps, callback)
  // setState(nextState, callback)
});
