import React, { PureComponent } from 'react'
import { connect, ReactReduxContext } from 'react-redux'
import { Router } from 'react-router'
import { onLocationChanged } from './actions'

class ConnectedRouter extends PureComponent {
  static contextType = ReactReduxContext
  constructor(props) {
    super(props)
    const { history, onLocationChanged } = props
    this.unlisten = history.listen(onLocationChanged)
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { history, children } = this.props
    return <Router history={history}>{children}</Router>
  }
}

const mapDispatchToProps = (dispatch) => ({
  onLocationChanged: (location, action) =>
    dispatch(onLocationChanged(location, action)),
})

export default connect(null, mapDispatchToProps)(ConnectedRouter)
