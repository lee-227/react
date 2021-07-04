import React, { useContext, useMemo, useLayoutEffect, useReducer } from 'react'
import { bindActionCreators } from '../redux'
import ReactReduxContext from './ReactReduxContext'
export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    return function (props) {
      const { store } = useContext(ReactReduxContext)
      const { getState, dispatch, subscribe } = store
      const prevState = getState()
      const stateProps = useMemo(() => mapStateToProps(prevState), [prevState])
      const dispatchProps = useMemo(() => {
        let dispatchProps
        if (typeof mapDispatchToProps === 'object') {
          dispatchProps = bindActionCreators(mapDispatchToProps, dispatch)
        } else if (typeof mapDispatchToProps === 'function') {
          dispatchProps = mapDispatchToProps(dispatch, props)
        } else {
          dispatchProps = { dispatch }
        }
        return dispatchProps
      }, [dispatch, props])
      const [, forceUpdate] = useReducer((x) => x + 1, 0)
      useLayoutEffect(() => subscribe(forceUpdate), [subscribe])
      return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />
    }
  }
}
