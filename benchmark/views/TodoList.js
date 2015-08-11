'use strict';

export default function (Component, _React) {
  return class TodoList extends Component {
    componentWillReceiveProps() {
      // console.log('list props');
    }

    componentWillUpdate() {
      // console.log('list will update');
    }

    render(React=_React) {
      // console.log(this.props.items);
      let createItem = (itemText, index) => {
        return <li key={index + itemText}>{itemText}</li>;
      };
      return <ul>{this.props.items.map(createItem)}</ul>;
    }
  }
}
