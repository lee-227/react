// jsx 会在编译时被转换成 React.createElement js 语法
// 通过该方法生虚拟 dom
export const createElement = (type, props, ...children) => {
  const childElements = children.reduce((arr, child) => {
    if (
      child !== false &&
      child !== true &&
      child !== undefined &&
      child !== null
    ) {
      if (child instanceof Array) {
        child.forEach((c) => arr.push(c))
      } else if (child instanceof Object) {
        arr.push(child)
      } else {
        // 文本节点特殊处理 {type:'text',props:{textContent: 'str'}}
        arr.push(createElement('text', { textContent: child }))
      }
    }
    return arr
  }, [])
  delete props.__source
  delete props.__self
  return {
    type,
    props: Object.assign({ children: childElements }, props),
    children: childElements
  }
}
const React = { createElement }
export default React
