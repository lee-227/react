import { addEvent } from './event';
function render(vdom, container) {
  const dom = createDOM(vdom);
  container.appendChild(dom);
}
export function createDOM(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom);
  }
  let { type, props, ref } = vdom;
  let dom;
  if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }
  updateProps(dom, {}, props);
  if (
    typeof props.children === 'string' ||
    typeof props.children === 'number'
  ) {
    dom.textContent = props.children;
  } else if (typeof props.children == 'object' && props.children.type) {
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    reconcileChildren(props.children, dom);
  } else {
    dom.textContent = props.children ? props.children.toString() : '';
  }
  vdom.dom = dom;
  if (ref) ref.current = dom;
  return dom;
}
function mountClassComponent(vdom) {
  const { type, props } = vdom;
  const classInstance = new type(props);
  vdom.classInstance = classInstance;
  if (classInstance.componentWillMount) classInstance.componentWillMount();
  const renderVdom = classInstance.render();
  const dom = createDOM(renderVdom);
  vdom.dom = renderVdom.dom = dom;
  classInstance.oldVdom = renderVdom;
  if (classInstance.componentDidMount) classInstance.componentDidMount();
  return dom;
}
function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVdom = type(props);
  return createDOM(renderVdom);
}
function updateProps(dom, oldProps, newProps) {
  for (const key in newProps) {
    if (key === 'children') {
      continue;
    }
    if (key === 'style') {
      let style = newProps[key];
      for (const attr in style) {
        dom.style[attr] = style[attr];
      }
    } else if (key.startsWith('on')) {
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}
function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let childVdom = childrenVdom[i];
    render(childVdom, parentDOM);
  }
}
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextVdom) {
  if (!oldVdom && !newVdom) {
    //新老都是null
    return null;
  } else if (oldVdom && !newVdom) {
    //老的有节点,新的没有
    let currentDOM = oldVdom.dom;
    currentDOM.parentNode.removeChild(currentDOM);
    if (oldVdom.classInstance.componentWillUnmount)
      oldVdom.classInstance.componentWillUnmount();
    return null;
  } else if (!oldVdom && newVdom) {
    //老的是null,新的有的创
    let newDOM = createDOM(newVdom);
    if (nextVdom) parentDOM.insertBefore(newDOM, nextVdom.dom);
    else parentDOM.appendChild(newDOM);
    newVdom.dom = newDOM;
    return newVdom;
    //新老节点都有,但是类型不同,也不能复用,所以删除建新的
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    let oldDOM = oldVdom.dom;
    let newDOM = createDOM(newVdom);
    newVdom.dom = newDOM;
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);
    if (oldVdom.classInstance.componentWillUnmount)
      oldVdom.classInstance.componentWillUnmount();
    return newVdom;
  } else {
    updateElement(oldVdom, newVdom);
    return newVdom;
  }
}
function updateElement(oldVdom, newVdom) {
  if (typeof oldVdom.type === 'string') {
    //原生的DOM类型 div span p
    let currentDOM = (newVdom.dom = oldVdom.dom); //获取 老的真实DOM
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {
    //就是类组件了
    if (oldVdom.type.isReactComponent) {
      //说明它是一个类组件的实例
      newVdom.classInstance = oldVdom.classInstance;
      updateClassInstance(oldVdom, newVdom);
    } else {
      //说明它是一个函数式组件
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}
function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = oldVdom.renderVdom.dom.parentNode;
  let { type, props } = newVdom; //获取新的虚拟函数组件
  let newRenderVdom = type(props); //传入属性对象并执行它,
  newVdom.renderVdom = newRenderVdom;
  compareTwoVdom(parentDOM, oldVdom.renderVdom, newRenderVdom);
}
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  //如果是纯文本则直接改变
  if (
    (typeof oldVChildren === 'string' || typeof oldVChildren === 'number') &&
    (typeof newVChildren === 'string' || typeof newVChildren === 'number')
  ) {
    if (oldVChildren !== newVChildren) {
      parentDOM.textContent = newVChildren;
    }
    return;
  }
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    let nextDOM = oldVChildren.find(
      (item, index) => index > i && item && item.dom
    );
    compareTwoVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      nextDOM && nextDOM.dom
    );
  }
}
function updateClassInstance(oldVdom, newVdom) {
  let classInstance = oldVdom.classInstance;
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props);
}
const ReactDOM = {
  render,
};
export default ReactDOM;
