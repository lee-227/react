import React from 'react';
import RouterContext from './RouterContext';
function withRouter(OldComponent) {
  return (props) => {
    return (
      <RouterContext.Consumer>
        {(contextValue) => {
          return <OldComponent {...props} {...contextValue} />;
        }}
      </RouterContext.Consumer>
    );
  };
}

export default withRouter;
