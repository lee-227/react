// import React from 'react'
// import ReactDOM from 'react-dom'

import React from './react-source/react'
import ReactDOM from './react-source/react-dom'



// import ClassComponent from './test/ClassComponent';
// import Ref from './test/Ref';
// import LifeCycle from './test/LifeCycle';
// import Route from './test/Route';



// let element = <ClassComponent title='计数器'>world</ClassComponent>;
// let element = <Ref></Ref>;
// let element = <LifeCycle></LifeCycle>;
// let element = <Route></Route>;

// 1. 虚拟 dom 测试 第一次挂载 以及更新
// import { virtualDOM, modifyDOM } from './test/virtualDOM'
// ReactDOM.render(virtualDOM, document.getElementById('root'))
// setTimeout(() => {
//   ReactDOM.render(modifyDOM, document.getElementById('root'))
// }, 1000)

import FunctionComponent from './test/FunctionComponent';
let element = <FunctionComponent name='hello'>world</FunctionComponent>;
ReactDOM.render(element, document.getElementById('root'))