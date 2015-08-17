'use strict';

import RealReact from 'react';

import TodoAppFactory from './TodoApp';

export let Point = {
  0: 0, 1: 0, length: 2,
  get x() { return this[0]; },
  get y() { return this[1]; },
  set x(v) { this[0] = v; },
  set y(v) { this[1] = v; }
};

export default function (Component, _React) {
  let TodoApp = TodoAppFactory(Component, _React);

  return class TestComponent extends Component {
    static mixins = [ Point ]

    type = _React === RealReact ? 'Real' : 'Mach';
    state = {
      times: [],
      message: 'Hello World'
    };

    componentWillMount() {
      console.log(this.x, this.y)
      // console.log('WILL MOUNT', this.type, this.refs);
    }

    componentDidMount() {
      // console.log('DID MOUNT', this.type, this.refs);
      if (typeof this.isMounted === 'function') {
        if (!this.isMounted()) throw new Error('Unmounted');
      }
      // setTimeout(() => {
      //   this.setState({
      //     message: 'Hello World!!!'
      //   });
      // }, 1000);
      // debugger;
      this.benchmark();
    }

    componentWillReceiveState(nextState) {
      // console.log('GET STATE');
    }

    componentWillReceiveProps(nextProps) {
      // console.log('GET PROPS');
    }

    componentWillUpdate(nextProps, nextState) {
      // console.log('WILL UPDATE', this.type, this.refs);
    }

    componentDidUpdate(prevProps, prevState) {
      // console.log('DID UPDATE', this.type, this.refs);
    }

    componentWillUnmount() {
      // console.log('WILL UNMOUNT', this.type, this.refs);
    }

    componentDidUnmount() {
      // console.log('DID UNMOUNT', this.type, this.refs);
    }

    shouldComponentUpdate(nextProps, nextState) {
      // console.log('SHOULD UPDATE?');
      return true;
    }

    // getChildContext() {
    //   return {
    //     testComponent: this
    //   }
    // }

    render(React=_React) {
      // console.log(this.state);
      // debugger;
      let times = this.state.times.map(t => t - 32);
      return (
        <div>
          <p>{times.length}</p>
          <p>{times.join(' , ')}</p>
          {times.length ? times.reduce((a, b) => a + b) / times.length : 0}
          <TodoApp ref="todo"/>

          {false ? [
            <br/>,
            <span onClick={this.testClick.bind(this)}>{this.state.message}</span>,
            <span dangerouslySetInnerHTML={{__html: 'HTML'}} />,
            this.props.children
          ] : null}
        </div>
      )
    }

    testClick() {
      // console.log('got here!');
      clearTimeout(this.removeTimer);
      this.removeTimer = setTimeout(this.unmount.bind(this), 1000);
    }

    start = window.performance.now();
    benchmark() {
      this.perfStart();
      this.refs.todo.stressTest(() => {
        setTimeout(() => {
          this.refs.todo.clearTest(() => {
            this.perfEnd();
            let diff = window.performance.now() - this.start;
            if (diff <= 5000) {
              setTimeout(this.benchmark.bind(this), 32);
            }
          });
        }, 32);
      });
    }

    perfStart(callback) {
      // console.log('start');
      this.setState({
        start: window.performance.now(),
        onUpdated: () => {
          callback();
          this.setState({onUpdated: null});
        }
      });
    }

    perfEnd(callback) {
      // console.log('end');
      let newTimes = (this.state.times || []).slice(0);
      newTimes.push(window.performance.now() - this.state.start);
      this.setState({
        times: newTimes,
        onUpdated: () => {
          callback();
          this.setState({onUpdated: null});
        }
      });
    }
  }
}
