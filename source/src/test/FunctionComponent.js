import React from '../source/react';

export default function FunctionComponent(props) {
  return (
    <div className='title' style={{ color: 'red' }}>
      <span>{props.name}</span>
      {props.children}
    </div>
  );
}
