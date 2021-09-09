import { createStore, applyMiddleware } from 'redux'
import { connect, Provider } from 'react-redux'

import React from 'react'
import ReactDOM from 'react-dom'

// import React from "./react-source/react";
// import ReactDOM from "./react-source/react-dom";

// import Route from './test/Route';
// let element = <Route></Route>;

// 1. 虚拟 dom 测试 第一次挂载 以及更新
// import { virtualDOM, modifyDOM } from './test/virtualDOM'
// ReactDOM.render(virtualDOM, document.getElementById('root'))
// setTimeout(() => {
//   ReactDOM.render(modifyDOM, document.getElementById('root'))
// }, 1000)

// 2. 函数组件挂载
// import FunctionComponent from './test/FunctionComponent';
// let element = <FunctionComponent name='hello'>world</FunctionComponent>;
// ReactDOM.render(element, document.getElementById('root'))

// 3. 类组件
// import ClassComponent, { ClassComponent2 } from "./test/ClassComponent";
// ReactDOM.render(
//   <ClassComponent title='计数器'>world1</ClassComponent>,
//   document.getElementById("root"),
// );
// setTimeout(() => {
//   ReactDOM.render(
//     <ClassComponent2 title='计数器123'>world2</ClassComponent2>,
//     document.getElementById("root"),
//   );
// }, 2000);

// 4. 生命周期
// import LifeCycle from "./test/LifeCycle";
// ReactDOM.render(<LifeCycle></LifeCycle>, document.getElementById("root"));

// 5. ref
// import Ref from "./test/Ref";
// ReactDOM.render(<Ref></Ref>, document.getElementById("root"));

// 6. key
// import KeyDemo from "./test/Key";
// ReactDOM.render(<KeyDemo></KeyDemo>, document.getElementById("root"));

// saga
import createSagaMiddleware from './redux-saga'
import {
  take,
  put,
  takeEvery,
  delay,
  cps,
  all,
  fork,
  cancel,
} from './redux-saga/effects'
const ASYNC_ADD = 'ASYNC_ADD'
const ADD = 'ADD'
const STOP_ADD = 'STOP_ADD'

const actions = {
  add() {
    return { type: ASYNC_ADD }
  },
  stop() {
    return { type: STOP_ADD }
  },
}

function reducer(state = { number: 0 }, action) {
  switch (action.type) {
    case ADD:
      return { number: state.number + 1 }
    default:
      return state
  }
}
let sagaMiddleware = createSagaMiddleware()
let store = applyMiddleware(sagaMiddleware)(createStore)(reducer)

function* rootSaga() {
  yield all([watcherAdd(), allSagaTest()])
  console.log(123)
}
function* allSagaTest() {
  yield delay(1000)
  console.log('allSagaTest')
}
function* adding() {
  while (true) {
    yield delay(1000)
    yield put({ type: ADD })
  }
}
function* watcherAdd() {
  yield take(ASYNC_ADD)
  yield put({ type: ADD })
  yield takeEvery(ASYNC_ADD, workAdd)
  let task = yield fork(adding)
  yield take(STOP_ADD)
  yield cancel(task)
}
function cpsTest(name, callback) {
  setTimeout(() => {
    callback(null, name)
  }, 1000)
}
function* workAdd() {
  let name = yield cps(cpsTest, 'lee')
  console.log(name)
  yield delay(2000)
  yield put({ type: ADD })
}

sagaMiddleware.run(rootSaga)

class Counter extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.number}</p>
        <button onClick={this.props.add}>+</button>
        <button onClick={this.props.stop}>stop</button>
      </div>
    )
  }
}
Counter = connect((state) => state, actions)(Counter)

ReactDOM.render(
  <Provider store={store}>
    <Counter />
  </Provider>,
  document.querySelector('#root'),
)
