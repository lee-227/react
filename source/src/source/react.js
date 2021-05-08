import Component from './Component';
// 所有的 jsx 语法中的 html元素 都会经过 react-babel 转译成 React.createElement()
/**
 *
 * @param {*} type 表示该元素类型
 * @param {*} config 该元素传入的所有属性
 * @param {*} children 该元素的子元素
 */
function createElement(type, config, children) {
  let ref;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
  }
  let props = { ...config };
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2);
  }
  props.children = children;
  // jax 代码中的元素 实际就是这样的一个对象，有 type 标识该元素的类型，props 代表改元素的属性
  return {
    type,
    props,
    ref,
  };
}
function createContext() {
  function Provider(props) {
    Provider._value = props.value;
    return props.children;
  }
  function Consumer(props) {
    return props.children(Provider._value);
  }
  return {
    Provider,
    Consumer,
  };
}
// 返回一个带有 current 属性的对象，在元素创建完毕后 会把该元素赋值给 current 属性
function createRef() {
  return { current: null };
}
const React = {
  createElement,
  Component,
  createRef,
  createContext,
};
export default React;
