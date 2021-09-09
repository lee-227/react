import * as effectTypes from './effect-types'
const TASK_CANCEL = Symbol('TASK_CANCEL')
export default function runSaga(env, saga, cb) {
  let task = { cancel: () => next(TASK_CANCEL) }
  let { channel, dispatch } = env
  let it = typeof saga === 'function' ? saga() : saga
  function next(data, isErr) {
    let result
    if (isErr) {
      result = it.throw(data)
    } else if (data === TASK_CANCEL) {
      result = it.return(data)
    } else {
      result = it.next(data)
    }
    let { done, value: effect } = result
    if (!done) {
      if (typeof effect[Symbol.iterator] === 'function') {
        runSaga(env, effect)
        next()
      } else if (effect.then) {
        effect.then(next)
      } else {
        switch (effect.type) {
          case effectTypes.TAKE:
            channel.take(effect.actionType, next)
            break
          case effectTypes.PUT:
            dispatch(effect.action)
            next()
            break
          case effectTypes.FORK:
            let task = runSaga(env, effect.saga)
            next(task)
            break
          case effectTypes.CALL:
            effect.fn(...effect.args).then(next)
            break
          case effectTypes.CPS:
            effect.fn(...effect.args, (err, val) => {
              if (err) {
                next(err, true)
              } else {
                next(val)
              }
            })
            break
          case effectTypes.ALL:
            let result = []
            let complete = 0
            let effects = effect.effects
            effects.forEach((effect, index) => {
              runSaga(env, effect, (res) => {
                result[index] = res
                if (++complete === effects.length) {
                  next(result)
                }
              })
            })
            break
          case effectTypes.CANCEL:
            effect.task.cancel()
            next()
            break
          default:
            break
        }
      }
    } else {
      cb && cb(result)
    }
  }
  next()
  return task
}
