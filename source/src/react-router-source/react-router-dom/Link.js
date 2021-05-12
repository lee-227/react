import React from 'react';
import { __RouterContext as RouterContext } from '../react-router';
export default function Link(props) {
  return (
    <RouterContext.Consumer>
      {(contextValue) => {
        return (
          <a
            {...props}
            onClick={(event) => {
              event.preventDefault();
              contextValue.history.push(props.to);
            }}
          >
            {props.children}
          </a>
        );
      }}
    </RouterContext.Consumer>
  );
}
