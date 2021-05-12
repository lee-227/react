import React from 'react';
class Lifecycle extends React.Component {
  componentDidMount() {
    if (this.props.onMount) this.props.onMount(this);
  }
  componentWillUnmount() {
    if (this.props.onUnmount) this.props.onUnmount(this);
  }
  render() {
    return null;
  }
}
export default Lifecycle;
