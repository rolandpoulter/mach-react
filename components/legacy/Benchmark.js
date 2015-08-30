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

  return class Benchmark extends Component {
    static mixins = [ Point ]

    type = ((_React === RealReact) ? 'Real' : 'Mach');
    state = {
      times: [],
      message: 'Hello World'
    };

    componentWillMount() {
      console.log('WILL MOUNT', this.type, this.refs);
      if (this.isMounted) console.log(this.isMounted());
      console.log(this.x, this.y)
    }

    componentDidMount() {
      console.log('DID MOUNT', this.type, this.refs);
      if (this.isMounted) console.log(this.isMounted());
      this.benchmark();
    }

    componentWillReceiveState(nextState) {
      console.log('GET STATE');
    }

    componentWillReceiveProps(nextProps) {
      console.log('GET PROPS');
    }

    componentWillUpdate(nextProps, nextState) {
      console.log('WILL UPDATE', this.type, this.refs);
    }

    componentDidUpdate(prevProps, prevState) {
      console.log('DID UPDATE', this.type, this.refs);
    }

    componentWillUnmount() {
      console.log('WILL UNMOUNT', this.type, this.refs);
      if (this.isMounted) console.log(this.isMounted());
    }

    componentDidUnmount() {
      console.log('DID UNMOUNT', this.type, this.refs);
      if (this.isMounted) console.log(this.isMounted());
    }

    shouldComponentUpdate(nextProps, nextState) {
      console.log('SHOULD UPDATE?');
      return true;
    }

    childContext = {
      testComponent: this
    };

    render(React=_React) {
      let times = this.state.times;
      return (
        <div>
          <p>{times.length}</p>
          <p>{times.join(' , ')}</p>
          {times.length ? times.reduce((a, b) => a + b) / times.length : 0}
          <TodoApp ref="todo"/>
          <br/>
          <span onClick={this.testClick.bind(this)}>{this.state.message}</span>
          <span dangerouslySetInnerHTML={{__html: 'HTML'}} />
          {this.props.children}
        </div>
      )
    }

    testClick() {
      clearTimeout(this.removeTimer);
      this.removeTimer = setTimeout(this.unmount.bind(this), 1000);
    }

    start = window.performance.now();

    benchmark() {
      this.perfStart();
      this.refs.todo.stressTest(() => {
        let check = () => {
          let ul = document.body.querySelector('ul');
          if (ul && ul.childNodes.length) {
            setTimeout(() => {
              this.refs.todo.clearTest(() => {
                this.perfEnd();
                let finish = () => {
                  let ul = document.body.querySelector('ul');
                  if (ul && !ul.childNodes.length) {
                    let diff = window.performance.now() - this.start;
                    if (diff <= 5000) setTimeout(this.benchmark.bind(this), 0);
                  }
                  else setTimeout(finish, 0);
                };
                finish();
              });
            }, 0);
          }
          else setTimeout(check, 0);
        };
        check();
      });
    }

    perfStart(callback) {
      this.setState({
        start: window.performance.now(),
        onUpdated: () => {
          callback();
          this.setState({onUpdated: null});
        }
      });
    }

    perfEnd(callback) {
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
