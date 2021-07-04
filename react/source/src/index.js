// import React from 'react'
// import ReactDOM from 'react-dom'

import React from "./react-source/react";
import ReactDOM from "./react-source/react-dom";

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
import KeyDemo from "./test/Key";
ReactDOM.render(<KeyDemo></KeyDemo>, document.getElementById("root"));
