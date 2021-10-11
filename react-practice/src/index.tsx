import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './Routes'
import store from './store/index'
import { history } from './store'
import './style.css'
import AnotherStore from './anotherStore'
import Pipeline from './pipeline'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AnotherStore>
        <Routes />
      </AnotherStore>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
)
// ReactDOM.render(
//   <Pipeline
//     pipeline={{
//       stages: [
//         {
//           title: '阶段1',
//           jobs: [
//             {
//               name: '任务1',
//               time: 111,
//               status: 'success',
//             },
//           ],
//         },
//         {
//           title: '阶段2',
//           jobs: [
//             {
//               name: '任务2',
//               time: 222,
//               status: 'fail',
//             },
//             {
//               name: '任务3',
//               time: 333,
//               status: 'fail',
//             },
//           ],
//         },
//       ],
//     }}
//   ></Pipeline>,
//   document.getElementById('root'),
// )
