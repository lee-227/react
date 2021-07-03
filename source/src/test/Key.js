import React from "../react-source/react";
export default class KeyDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [
        {
          id: 1,
          name: "张三",
        },
        {
          id: 2,
          name: "李四",
        },
        {
          id: 3,
          name: "王五",
        },
        {
          id: 4,
          name: "赵六",
        },
      ],
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    const newState = JSON.parse(JSON.stringify(this.state));
    // newState.persons.push(newState.persons.shift());
    newState.persons.splice(1, 0, { id: 100, name: "李逵" });
    // newState.persons.pop();
    this.setState(newState);
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.persons.map((person) => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
        <button onClick={this.handleClick}>按钮</button>
      </div>
    );
  }
}
