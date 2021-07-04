import React from 'react';
import RouterContext from './RouterContext';
import Lifecycle from './Lifecycle';

function Redirect({ to }) {
  return (
    <RouterContext.Consumer>
      {(contextValue) => {
        const { history } = contextValue;
        return <Lifecycle onMount={() => history.push(to)} />;
      }}
    </RouterContext.Consumer>
  );
}
export default Redirect;
