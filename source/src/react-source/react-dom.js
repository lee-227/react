import { isFunction } from './util'
// render 函数 最终将虚拟 dom 生成真实 dom
export const render = (
  virtualDOM,
  container,
  oldDom = container.firstChild
) => {
  // 核心算法 负责第一次挂载 跟 后续更新
  diff(virtualDOM, container, oldDom)
}

function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  if (!oldDOM) {
    // 没有旧节点 说明是第一次挂载
    mountElement(virtualDOM, container)
  } else if (
    virtualDOM.type !== oldVirtualDOM.type &&
    !isFunction(virtualDOM.type)
  ) {
    // 更新操作 type不一样时 不可复用 直接使用新节点
    const newElement = createDOMElement(virtualDOM)
    oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    // type一致是 虚拟 dom 对比 复用节点
    if (virtualDOM.type === 'text') {
      // 都是文本节点 更新文本即可
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 普通元素 更新属性
      updateProps(oldDOM, virtualDOM, oldVirtualDOM)
    }
    let keyedElements = {}
    for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
      let element = oldDOM.childNodes[i]
      if (element.nodeType === 1) {
        let key = element.getAttribute('key')
        if (key) {
          keyedElements[key] = element
        }
      }
    }
    const noKey = Reflect.ownKeys(keyedElements).length === 0
    if (noKey) {
      // 递归子元素
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i])
      })
    }
    // 老节点有剩余 删除老节点
    let oldChildNodes = oldDOM.childNodes
    if (oldChildNodes.length > virtualDOM.children.length) {
      if (noKey) {
        for (
          let i = oldChildNodes.length - 1;
          i > virtualDOM.children.length - 1;
          i--
        ) {
          unmountNode(oldChildNodes[i])
        }
      }
    }
  }
}
function unmountNode(node) {
  const virtualDOM = node._virtualDOM
  // 1. 文本节点直接删除
  if (virtualDOM.type === 'text') {
    node.remove()
    return
  }
  // 2. 普通元素节点 先删除他的事件处理函数
  Object.keys(virtualDOM.props).forEach((propName) => {
    if (propName.slice(0, 2) === 'on') {
      const eventName = propName.toLowerCase().slice(0, 2)
      const eventHandler = virtualDOM.props[propName]
      node.removeEventListener(eventName, eventHandler)
    }
  })
  // 3. 递归删除子节点
  if (node.childNodes.length > 0) {
    for (let i = 0; i < node.childNodes.length; i++) {
      unmountNode(node.childNodes[i])
      i--
    }
  }
  // 删除节点
  node.remove()
}
function updateTextNode(virtualDOM, oldVirtualDOM, oldDOM) {
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    oldDOM.textContent = virtualDOM.props.textContent
    oldDOM._virtualDOM = virtualDOM
  }
}
function mountElement(virtualDOM, container) {
  // 判断是普通元素 还是 组件
  if (isFunction(virtualDOM)) {
    mountComponent(virtualDOM, container)
  } else {
    // 挂载原生普通元素
    mountNativeElement(virtualDOM, container)
  }
}
function mountComponent(virtualDOM, container) {
  let nextVirtualDOM
  if (isFunctionComponent(virtualDOM)) {
    nextVirtualDOM = virtualDOM.type(virtualDOM.props || {})
  }
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container)
  } else {
    mountNativeElement(nextVirtualDOM, container)
  }
}
function isFunctionComponent(virtualDOM) {
  return (
    virtualDOM &&
    isFunction(virtualDOM) &&
    !(virtualDOM.type.prototype && virtualDOM.type.prototype.render)
  )
}
function mountNativeElement(virtualDOM, container) {
  // 创建阶段 挂载节点
  let element = createDOMElement(virtualDOM)
  container.appendChild(element)
}
function createDOMElement(virtualDOM) {
  // 根据虚拟dom 生成真实dom 返回该节点
  let element
  if (virtualDOM.type === 'text') {
    element = document.createTextNode(virtualDOM.props.textContent)
  } else {
    element = document.createElement(virtualDOM.type)
    updateProps(element, virtualDOM)
  }
  // 将真实 dom 与虚拟 dom 对应 为后续的更新 dom 做准备
  element._virtualDOM = virtualDOM
  // 递归子元素
  virtualDOM.children.forEach((child) => {
    return mountElement(child, element)
  })
  return element
}
// 更新属性
function updateProps(newElement, virtualDOM, oldVirtualDOM = {}) {
  const newProps = virtualDOM.props || {}
  const oldProps = oldVirtualDOM.props || {}
  let newKeys = Reflect.ownKeys(newProps)
  newKeys.forEach((key) => {
    let newPropsValue = newProps[key]
    let oldPropsValue = oldProps[key]
    if (key === 'children') return
    if (key === 'className') {
      newElement.setAttribute('class', newPropsValue)
    } else if (key === 'value' || key === 'checked') {
      newElement[key] = newPropsValue
    } else if (key.slice(0, 2) === 'on') {
      newElement.addEventListener(key.slice(2).toLowerCase(), newPropsValue)
      if (oldPropsValue) {
        newElement.removeEventListener(
          key.slice(2).toLowerCase(),
          oldPropsValue
        )
      }
    } else if (key === 'style') {
      let value = Reflect.ownKeys(newPropsValue).reduce((str, key) => {
        str += key + ':' + newPropsValue[key] + ';'
        return str
      }, '')
      newElement.setAttribute('style', value)
    } else {
      newElement.setAttribute(key, newPropsValue)
    }
  })
  let oldKeys = Reflect.ownKeys(oldProps)
  oldKeys.forEach((propName) => {
    const newPropsValue = newProps[propName]
    const oldPropsValue = oldProps[propName]
    if (!newPropsValue) {
      if (propName.slice(0, 2) === 'on') {
        const eventName = propName.toLowerCase().slice(2)
        newElement.removeEventListener(eventName, oldPropsValue)
      } else if (propName !== 'children') {
        newElement.removeAttribute(propName)
      }
    }
  })
}

const ReactDom = {
  render
}
export default ReactDom
