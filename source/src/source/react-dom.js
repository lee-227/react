import { addEvent } from './event';
// 渲染函数，根据虚拟 dom 生成真实节点 挂载在 container 上
function render(vdom, container) {
  const dom = createDOM(vdom);
  container.appendChild(dom);
}
export function createDOM(vdom) {
  // 文本节点
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom);
  }
  let { type, props, ref } = vdom;
  let dom;
  // 函数组件 或者 类组件
  if (typeof type === 'function') {
    // 根据 isReactComponent 字段判断是否是类组件，该字段由 React.Component 为所有的类组件添加
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    // 普通 html 节点
    dom = document.createElement(type);
  }
  // 第一次创建节点 向节点添加属性
  updateProps(dom, {}, props);

  if (
    typeof props.children === 'string' ||
    typeof props.children === 'number'
  ) {
    // 子元素是文本节点
    dom.textContent = props.children;
  } else if (typeof props.children == 'object' && props.children.type) {
    // 子元素只有一个
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    // 多个子元素
    reconcileChildren(props.children, dom);
  } else {
    // 其余情况 当做文本子节点处理
    dom.textContent = props.children ? props.children.toString() : '';
  }
  // 在改虚拟 dom 上映射一个 dom 属性 值为对应的真实 dom
  vdom.dom = dom;
  // 真实 dom 生成后，如果该虚拟 DOM 使用了 ref 为 ref 赋值
  if (ref) ref.current = dom;
  return dom;
}
function mountClassComponent(vdom) {
  const { type, props } = vdom;
  // 根据 type 获取组件类，实例化该组件
  const classInstance = new type(props);
  // 在组件虚拟 dom 上映射该实例
  vdom.classInstance = classInstance;
  classInstance.ownVdom = vdom;
  // 在组件 render 之前 触发 componentWillMount 钩子
  if (classInstance.componentWillMount) classInstance.componentWillMount();
  // 调用组件实例的 render 方法 获取组件要渲染的元素虚拟 dom
  const renderVdom = classInstance.render();
  // 生成真实 dom
  const dom = createDOM(renderVdom);
  // 在组件虚拟 dom 跟 组件要渲染的元素虚拟 dom 上映射真实 dom
  vdom.dom = renderVdom.dom = dom;
  // 在实例上添加oldVdom 赋值为 第一次生成的虚拟dom
  classInstance.oldVdom = renderVdom;
  // 组件挂载完成 触发 componentDidMount 钩子
  if (classInstance.componentDidMount) classInstance.componentDidMount();
  return dom;
}
function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  // 根据 type 获取组件函数 调用后得到虚拟dom
  const renderVdom = type(props);
  // 根据虚拟 dom 生成函数组件的真实节点
  return createDOM(renderVdom);
}
function updateProps(dom, oldProps, newProps) {
  // 更新属性
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
      // react 重新实现了元素事件的触发方式，详情 event.js
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}
function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    // 多个子元素时 render 递归调用 创建真实节点
    let childVdom = childrenVdom[i];
    render(childVdom, parentDOM);
  }
}
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextVdom) {
  if (!oldVdom && !newVdom) {
    //新老都是null
    return null;
  } else if (oldVdom && !newVdom) {
    //老的有节点,新的没有,直接删除旧节点
    let currentDOM = oldVdom.dom;
    currentDOM.parentNode.removeChild(currentDOM);
    // 如果是类组件 触发 componentWillUnmount 钩子
    if (oldVdom.classInstance.componentWillUnmount)
      oldVdom.classInstance.componentWillUnmount();
    return null;
  } else if (!oldVdom && newVdom) {
    //老的是null,新的有 创建新节点
    let newDOM = createDOM(newVdom);
    if (nextVdom) parentDOM.insertBefore(newDOM, nextVdom.dom);
    else parentDOM.appendChild(newDOM);
    newVdom.dom = newDOM;
    return newVdom;
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    //新老节点都有,但是类型不同,也不能复用,所以删除建新的
    let oldDOM = oldVdom.dom;
    let newDOM = createDOM(newVdom);
    newVdom.dom = newDOM;
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);
    // 如果是类组件 触发 componentWillUnmount 钩子
    if (oldVdom.classInstance.componentWillUnmount)
      oldVdom.classInstance.componentWillUnmount();
    return newVdom;
  } else {
    // domdiff
    updateElement(oldVdom, newVdom);
    return newVdom;
  }
}
function updateElement(oldVdom, newVdom) {
  if (typeof oldVdom.type === 'string') {
    //原生的DOM类型
    let currentDOM = (newVdom.dom = oldVdom.dom); //获取 老的真实DOM
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {
    //就是类组件了
    if (oldVdom.type.isReactComponent) {
      //说明它是一个类组件的实例
      newVdom.classInstance = oldVdom.classInstance;
      newVdom.dom = oldVdom.dom;
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
