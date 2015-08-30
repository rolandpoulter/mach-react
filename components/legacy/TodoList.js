'use strict';

export default function (Component, _React) {
  return class TodoList extends Component {
    render(React=_React) {
      debugger;
      let createItem = (itemText, index) => {
        return <li key={index + itemText}>{itemText}</li>;
      };
      return <ul>{this.props.items.map(createItem)}</ul>;
    }
  }
}
