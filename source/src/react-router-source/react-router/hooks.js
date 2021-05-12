import React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';
export function useParams() {
  let match = React.useContext(RouterContext).match;
  return match ? match.params : {};
}
export function useLocation() {
  return React.useContext(RouterContext).location;
}
export function useHistory() {
  return React.useContext(RouterContext).history;
}
export function useRouteMatch(path) {
  const location = useLocation(); //获取当前的路径pathname代表当前的路径名
  let match = React.useContext(RouterContext).match; //获得匹配结果
  return path ? matchPath(location.pathname, path) : match;
}
