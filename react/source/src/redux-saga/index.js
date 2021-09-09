import createChannel from './createChannel'
import runSaga from './run-saga'
export default function createSagaMiddleware() {
  let bindRunSaga
  let channel = createChannel()
  let sagaMiddleWate = ({ dispatch, getState }) => {
    bindRunSaga = runSaga.bind(null, { dispatch, channel, getState })
    return (next) => (action) => {
      const result = next(action)
      channel.put(action)
      return result
    }
  }
  sagaMiddleWate.run = (saga) => bindRunSaga(saga)
  return sagaMiddleWate
}
