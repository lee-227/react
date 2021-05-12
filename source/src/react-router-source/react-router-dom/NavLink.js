import React from 'react';
import { Link } from './';
import { __RouterContext as RouterContext, matchPath } from '../react-router';
function NavLink(props) {
  let context = React.useContext(RouterContext);
  let { pathname } = context.location;
  const {
    to: path, //Link的to属性，指的对应的路径
    className: classNameProp = '', //自定义类名
    activeClassName = 'active', //激活类名
    style: styleProp = {}, //普通样式
    activeStyle = {}, //只有路径匹配的才会生效
    children,
    exact,
  } = props;
  let isActive = matchPath(pathname, { path, exact });
  let className = isActive
    ? joinClassnames(classNameProp, activeClassName)
    : classNameProp;
  let style = isActive ? { ...styleProp, ...activeStyle } : styleProp;
  let linkProps = {
    className,
    style,
    to: path,
    children,
  };
  return <Link {...linkProps} />;
}
function joinClassnames(...classnames) {
  return classnames.filter((c) => c).join(' ');
}
export default NavLink;
