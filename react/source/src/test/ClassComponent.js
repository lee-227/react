import React from "../react-source/react";

export default class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
    });
  };
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>number:{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
        {this.props.children}
      </div>
    );
  }
}

export class ClassComponent2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
    });
  };
  render() {
    return (
      <div>
        <p>number:{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
        {this.props.children}
      </div>
    );
  }
}
