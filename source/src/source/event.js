import { updateQueue } from './Component';

// react 的事件处理方式
export function addEvent(dom, eventType, listener) {
  // 在要添加事件的真实 dom 上添加 store 属性，存储事件处理函数
  let store = dom.store || (dom.store = {});
  // 根据类型存储
  store[eventType] = listener;
  if (!document[eventType]) {
    // 判断 document 上是否存在该类型的事件，没有就添加
    // 通过 dispatchEvent 实现事件分发
    // 将元素上的事件代理到 document 上 提高性能
    document[eventType] = dispatchEvent;
  }
}
let syntheticEvent = {};
function dispatchEvent(event) {
  // 根据事件对象 获取触发对象，事件类型
  let { target, type } = event;
  let eventType = `on${type}`;
  // 为防止在事件中多次 setState 会进行多次更新，将 isBatchingUpdate 赋值为false，组织组件的立即更新。
  updateQueue.isBatchingUpdate = true;
  // react 创建了自己的事件对象 代替原生事件对象
  let syntheticEvent = createSyntheticEvent(event);
  // 通过冒泡的方式 从触发对象查找对象对应类型的事件处理函数 触发函数
  while (target) {
    let { store } = target; // 再为元素添加事件时 存储的事件处理函数
    let listener = store && store[eventType];
    listener && listener.call(target, syntheticEvent); // 找到对应的函数执行 传入自己的事件对象
    target = target.parentNode;
  }
  // 事件全部触发完成后 清空自己创建的事件对象
  for (let key in syntheticEvent) {
    syntheticEvent[key] = null;
  }
  // 触发 updateQueue 的 batchUpdate 方法 更新所有组件
  updateQueue.batchUpdate();
}
function createSyntheticEvent(nativeEvent) {
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
  return syntheticEvent;
}
