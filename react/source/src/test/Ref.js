import React from "../react-source/react";

export default class Sum extends React.Component {
  constructor(props) {
    super(props);
    this.a = React.createRef();
    this.b = React.createRef();
  }
  handleAdd = () => {
    let a = this.a.current.value;
    let b = this.b.current.value;
    console.log(this.result);
    this.result.handleInput(a, b);
  };
  render() {
    return (
      <div>
        <input ref={this.a} />+<input ref={this.b} />
        <button onClick={this.handleAdd}>=</button>
        <Input
          ref={(result) => {
            console.log(result);
            this.result = result;
          }}
        ></Input>
      </div>
    );
  }
}
class Input extends React.Component {
  handleInput(a, b) {
    this.input.value = a + b;
  }
  render() {
    return (
      <input
        ref={(input) => {
          this.input = input;
        }}
      />
    );
  }
}
