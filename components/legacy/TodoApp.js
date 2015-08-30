'use strict';

import TodoListFactory from './TodoList';

export default function (Component, _React) {
  let TodoList = TodoListFactory(Component, _React);

  return class TodoApp extends Component {
    state = {items: [], text: ''};

    onChange(e) {
      this.setState({text: e.target.value});
    }

    handleSubmit(e) {
      e.preventDefault();
      let nextItems = this.state.items.concat([this.state.text]),
          nextText = '';
      this.setState({items: nextItems, text: nextText});
    }

    render(React=_React) {
      return (
        <div>
          <h3>TODO</h3>
          <TodoList items={this.state.items} />
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input onChange={this.onChange.bind(this)} value={this.state.text} />
            <button>{'Add #' + (this.state.items.length + 1)}</button>
          </form>
        </div>
      );
    }

    componentWillUpdate() {
      // debugger;
    }

    componentDidUpdate() {
      if (this.state.onUpdated) {
        this.state.onUpdated();
      }
    }

    stressTest(callback) {
      this.setState({
        onUpdated: () => {
          if (this.state.done) {
            this.setState({onUpdated: null}, callback);
          }
        }
      });
      for (let i = 0, l = 33; i < l; i += 1) {
        this.setState(function (prevState) {
          return {items: prevState.items.concat([
            Math.random(), 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            Math.random(), 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
            Math.random(), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu justo at magna posuere aliquet interdum quis dui. Aenean ante nisi, efficitur quis auctor ut, feugiat ac nibh. Sed nec lorem imperdiet, sollicitudin libero ac, placerat mauris. Fusce non neque feugiat, placerat dolor eu, feugiat arcu. Vestibulum ac urna in diam laoreet pulvinar. Nunc venenatis quam a odio aliquam cursus. Vestibulum sed nibh id ex tincidunt dapibus. Duis venenatis ante velit, aliquam posuere nunc rutrum a. Vestibulum quis turpis dui. Nulla rutrum, felis gravida viverra scelerisque, augue nulla fermentum ante, quis tristique nibh erat ut ipsum. Suspendisse eget efficitur mi. Ut sit amet vulputate eros. Aenean gravida pellentesque tellus sed faucibus. Donec rutrum libero quis nibh rhoncus vulputate. Donec blandit mollis nunc. Phasellus vel augue vitae ipsum tempor congue.'
          ])};
        });
      }
      this.setState({done: true});
    }

    clearTest(callback) {
      this.setState({
        onUpdated: () => {
          this.setState({onUpdated: null});
          callback();
        },
        items: []
      })
    }
  }
}
