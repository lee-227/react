import React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';
class Route extends React.Component {
  static contextType = RouterContext;
  render() {
    const { history, location } = this.context;
    const { component: RouteComponent, computedMatch, render } = this.props;
    const match = computedMatch
      ? computedMatch
      : matchPath(location.pathname, this.props);
    let routeProps = { history, location };
    let element = null;
    if (match) {
      routeProps.match = match;
      if (RouteComponent) {
        element = <RouteComponent {...routeProps} />;
      } else if (render) {
        element = render(routeProps);
      } else {
        element = null;
      }
    } else {
      element = null;
    }
    return (
      <RouterContext.Provider value={routeProps}>
        {element}
      </RouterContext.Provider>
    );
  }
}
export default Route;
