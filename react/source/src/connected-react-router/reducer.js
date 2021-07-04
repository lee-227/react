import { LOCATION_CHANGE } from './actions'

const createRouterReducer = (history) => {
  const initialRouterState = {
    location: history.location,
    action: history.action,
  }
  return (state = initialRouterState, { type, payload } = {}) => {
    if (type === LOCATION_CHANGE) {
      const { location, action } = payload
      return { ...state, location, action }
    }
    return state
  }
}

export default createRouterReducer
