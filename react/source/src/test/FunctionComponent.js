import React from '../react-source/react';

export default function FunctionComponent(props) {
  return (
    <div className='title' style={{ color: 'red' }}>
      <h1>函数组件</h1>
      <span>{props.name}</span>
      {props.children}
    </div>
  );
}
