import React from 'react';
import ReactDOM from 'react-dom';

// import React from './source/react';
// import ReactDOM from './source/react-dom';

import FunctionComponent from './test/FunctionComponent';
import ClassComponent from './test/ClassComponent';
import Ref from './test/Ref';
import LifeCycle from './test/LifeCycle';

import UseState from './hook/UseState';

// let element = <FunctionComponent name='hello'>world</FunctionComponent>;
// let element = <ClassComponent title='计数器'>world</ClassComponent>;
// let element = <Ref></Ref>;
// let element = <LifeCycle></LifeCycle>;
let element = <UseState></UseState>;
ReactDOM.render(element, document.getElementById('root'));
