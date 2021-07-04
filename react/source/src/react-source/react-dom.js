import { addEvent, removeEvent } from "./event";
import { isFunction } from "./util";
// render 函数 最终将虚拟 dom 生成真实 dom
export const render = (
  virtualDOM,
  container,
  oldDom = container.firstChild,
) => {
  // 核心算法 负责第一次挂载 跟 后续更新
  diff(virtualDOM, container, oldDom);
};

export function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM;
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component;
  if (!oldDOM) {
    // 没有旧节点 说明是第一次挂载
    mountElement(virtualDOM, container);
  } else if (
    virtualDOM.type !== oldVirtualDOM.type &&
    !isFunction(virtualDOM)
  ) {
    // 更新操作 type不一样时 不可复用 直接使用新节点
    const newElement = createDOMElement(virtualDOM);
    oldDOM.parentNode.replaceChild(newElement, oldDOM);
  } else if (isFunction(virtualDOM)) {
    diffComponent(virtualDOM, oldComponent, oldDOM, container);
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    // type一致是 虚拟 dom 对比 复用节点
    if (virtualDOM.type === "text") {
      // 都是文本节点 更新文本即可
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM);
    } else {
      // 普通元素 更新属性
      updateProps(oldDOM, virtualDOM, oldVirtualDOM);
    }
    let keyedElements = {};
    for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
      let element = oldDOM.childNodes[i];
      if (element.nodeType === 1) {
        let key = element.getAttribute("key");
        if (key) {
          keyedElements[key] = element;
        }
      }
    }
    const noKey = Reflect.ownKeys(keyedElements).length === 0;
    if (noKey) {
      // 递归子元素
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i]);
      });
    } else {
      virtualDOM.children.forEach((child, i) => {
        let key = child.props.key;
        if (key) {
          let currentDom = keyedElements[key];
          if (currentDom) {
            if (oldDOM.childNodes[i] && currentDom !== oldDOM.childNodes[i]) {
              oldDOM.insertBefore(currentDom, oldDOM.childNodes[i]);
            }
          } else {
            mountElement(child, oldDOM, oldDOM.childNodes[i]);
          }
        }
      });
    }
    // 删除节点
    // 获取旧节点
    let oldChildNodes = oldDOM.childNodes;
    // 判断旧节点的数量
    if (oldChildNodes.length > virtualDOM.children.length) {
      if (noKey) {
        // 有节点需要被删除
        for (
          let i = oldChildNodes.length - 1;
          i > virtualDOM.children.length - 1;
          i--
        ) {
          unmountNode(oldChildNodes[i]);
        }
      } else {
        // 通过key属性删除节点
        for (let i = 0; i < oldChildNodes.length; i++) {
          let oldChild = oldChildNodes[i];
          let oldChildKey = oldChild._virtualDOM.props.key;
          let found = false;
          for (let n = 0; n < virtualDOM.children.length; n++) {
            if (oldChildKey === virtualDOM.children[n].props.key) {
              found = true;
              break;
            }
          }
          if (!found) {
            unmountNode(oldChild);
          }
        }
      }
    }
  }
}
function unmountNode(node) {
  // 获取节点的 _virtualDOM 对象
  const virtualDOM = node._virtualDOM;
  // 1. 文本节点可以直接删除
  if (virtualDOM.type === "text") {
    // 删除直接
    node.remove();
    // 阻止程序向下执行
    return;
  }
  // 2. 看一下节点是否是由组件生成的
  let component = virtualDOM.component;
  // 如果 component 存在 就说明节点是由组件生成的
  if (component) {
    component.componentWillUnmount();
  }
  // 3. 看一下节点身上是否有ref属性
  if (virtualDOM.props && virtualDOM.props.ref) {
    if (typeof virtualDOM.props.ref === "function") {
      virtualDOM.props.ref(null);
    } else {
      virtualDOM.props.ref.current = null;
    }
  }
  // 4. 看一下节点的属性中是否有事件属性
  Object.keys(virtualDOM.props).forEach((propName) => {
    if (propName.slice(0, 2) === "on") {
      const eventName = propName.toLowerCase().slice(0, 2);
      const eventHandler = virtualDOM.props[propName];
      node.removeEventListener(eventName, eventHandler);
    }
  });

  // 5. 递归删除子节点
  if (node.childNodes.length > 0) {
    for (let i = 0; i < node.childNodes.length; i++) {
      unmountNode(node.childNodes[i]);
      i--;
    }
  }
  // 删除节点
  node.remove();
}
function updateTextNode(virtualDOM, oldVirtualDOM, oldDOM) {
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    oldDOM.textContent = virtualDOM.props.textContent;
    oldDOM._virtualDOM = virtualDOM;
  }
}
function mountElement(virtualDOM, container, oldDOM) {
  // 判断是普通元素 还是 组件
  if (isFunction(virtualDOM)) {
    mountComponent(virtualDOM, container, oldDOM);
  } else {
    // 挂载原生普通元素
    mountNativeElement(virtualDOM, container, oldDOM);
  }
}
function diffComponent(virtualDOM, oldComponent, oldDOM, container) {
  if (virtualDOM.type === oldComponent.constructor) {
    oldComponent.componentWillReceiveProps(virtualDOM.props);
    oldComponent.updater.emitUpdate(virtualDOM.props);
    // if (oldComponent.shouldComponentUpdate(virtualDOM.props)) {
    //   let oldProps = oldComponent.props;
    //   oldComponent.componentWillUpdate(virtualDOM.props);
    //   oldComponent.updateProps(virtualDOM.props);
    //   let nextVirtualDOM = oldComponent.render();
    //   nextVirtualDOM.component = oldComponent;
    //   diff(nextVirtualDOM, container, oldDOM);
    //   oldComponent.componentDidUpdate(oldProps);
    // }
  } else {
    mountElement(virtualDOM, container, oldDOM);
  }
}
function mountComponent(virtualDOM, container, oldDOM) {
  let nextVirtualDOM;
  if (isFunctionComponent(virtualDOM)) {
    nextVirtualDOM = virtualDOM.type(virtualDOM.props || {});
  } else {
    let component = new virtualDOM.type(virtualDOM.props || {});
    component.componentWillMount();
    nextVirtualDOM = component.render();
    nextVirtualDOM.component = component;
  }
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container, oldDOM);
  } else {
    mountNativeElement(nextVirtualDOM, container, oldDOM);
  }
  if (nextVirtualDOM.component) {
    nextVirtualDOM.component.componentDidMount();
    if (nextVirtualDOM.component.props && nextVirtualDOM.component.props.ref) {
      let ref = nextVirtualDOM.component.props.ref;
      if (typeof ref === "function") {
        ref(nextVirtualDOM.component);
      } else {
        ref.current = nextVirtualDOM.component;
      }
    }
  }
}
function isFunctionComponent(virtualDOM) {
  return (
    virtualDOM &&
    isFunction(virtualDOM) &&
    !(virtualDOM.type.prototype && virtualDOM.type.prototype.render)
  );
}
function mountNativeElement(virtualDOM, container, oldDOM) {
  // 创建阶段 挂载节点
  let element = createDOMElement(virtualDOM);

  if (oldDOM) {
    container.insertBefore(element, oldDOM);
  } else {
    container.appendChild(element);
  }

  // 获取类组件实例对象
  let component = virtualDOM.component;
  // 如果类组件实例对象存在
  if (component) {
    // 将DOM对象存储在类组件实例对象中
    component.setDOM(element);
    if (oldDOM) {
      unmountNode(oldDOM);
    }
  }
}
function createDOMElement(virtualDOM) {
  // 根据虚拟dom 生成真实dom 返回该节点
  let element;
  if (virtualDOM.type === "text") {
    element = document.createTextNode(virtualDOM.props.textContent);
  } else {
    element = document.createElement(virtualDOM.type);
    updateProps(element, virtualDOM);
  }
  // 将真实 dom 与虚拟 dom 对应 为后续的更新 dom 做准备
  element._virtualDOM = virtualDOM;
  // 递归子元素
  virtualDOM.children.forEach((child) => {
    return mountElement(child, element);
  });
  if (virtualDOM.props && virtualDOM.props.ref) {
    let ref = virtualDOM.props.ref;
    if (typeof ref === "function") {
      ref(element);
    } else {
      ref.current = element;
    }
  }
  return element;
}
// 更新属性
function updateProps(newElement, virtualDOM, oldVirtualDOM = {}) {
  const newProps = virtualDOM.props || {};
  const oldProps = oldVirtualDOM.props || {};
  let newKeys = Reflect.ownKeys(newProps);
  newKeys.forEach((key) => {
    let newPropsValue = newProps[key];
    let oldPropsValue = oldProps[key];
    if (key === "children") return;
    if (key === "className") {
      newElement.setAttribute("class", newPropsValue);
    } else if (key === "value" || key === "checked") {
      newElement[key] = newPropsValue;
    } else if (key.slice(0, 2) === "on") {
      if (oldPropsValue !== newPropsValue) {
        addEvent(newElement, key.toLocaleLowerCase(), newPropsValue);
      }
    } else if (key === "style") {
      let value = Reflect.ownKeys(newPropsValue).reduce((str, key) => {
        str += key + ":" + newPropsValue[key] + ";";
        return str;
      }, "");
      newElement.setAttribute("style", value);
    } else {
      newElement.setAttribute(key, newPropsValue);
    }
  });
  let oldKeys = Reflect.ownKeys(oldProps);
  oldKeys.forEach((propName) => {
    const newPropsValue = newProps[propName];
    const oldPropsValue = oldProps[propName];
    if (!newPropsValue) {
      if (propName.slice(0, 2) === "on") {
        removeEvent(newElement, propName.toLocaleLowerCase(), oldPropsValue);
      } else if (propName !== "children") {
        newElement.removeAttribute(propName);
      }
    }
  });
}

const ReactDom = {
  render,
};
export default ReactDom;
