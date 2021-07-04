export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

export const onLocationChanged = (location, action) => ({
  type: LOCATION_CHANGE,
  payload: {
    location,
    action,
  },
})

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD'

const updateLocation = (method) => {
  return (...args) => ({
    type: CALL_HISTORY_METHOD,
    payload: {
      method,
      args,
    },
  })
}

export const push = updateLocation('push')
export const replace = updateLocation('replace')
export const go = updateLocation('go')
export const goBack = updateLocation('goBack')
export const goForward = updateLocation('goForward')
