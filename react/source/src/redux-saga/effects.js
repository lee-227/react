import * as effectTypes from './effect-types'

export function take(actionType) {
  return { type: effectTypes.TAKE, actionType }
}
export function put(action) {
  return { type: effectTypes.PUT, action }
}
export function fork(saga) {
  return { type: effectTypes.FORK, saga }
}
export function takeEvery(pattern, saga) {
  function* takeEveryHelper() {
    while (true) {
      yield take(pattern)
      yield fork(saga)
    }
  }
  return fork(takeEveryHelper)
}
export function call(fn, ...args) {
  return { type: effectTypes.CALL, fn, args }
}
export function cps(fn, ...args) {
  return { type: effectTypes.CPS, fn, args }
}
export function all(effects) {
  return { type: effectTypes.ALL, effects }
}
export default function delayP(ms, val = true) {
  const promise = new Promise((resolve) => {
    setTimeout(resolve, ms, val)
  })
  return promise
}
export const delay = call.bind(null, delayP)
export function cancel(task) {
  return { type: effectTypes.CANCEL, task }
}
