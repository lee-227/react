import { updateQueue } from "./component";

export function addEvent(dom, type, handler) {
  let store = dom.store || (dom.store = {});
  store[type] = handler;
  if (!document[type]) {
    document[type] = dispatchEvent;
  }
}
export function removeEvent(dom, type, handler) {
  let store = dom.store;
  store[type] = null;
}
function dispatchEvent(e) {
  let { target, type } = e;
  let eventType = "on" + type;
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(e);
  while (target) {
    let { store } = target;
    let listener = store && store[eventType];
    listener && listener.call(target, syntheticEvent);
    target = target.parentNode;
  }
  for (const key in syntheticEvent) {
    if (Object.hasOwnProperty.call(syntheticEvent, key)) {
      syntheticEvent[key] = null;
    }
  }
  updateQueue.batchUpdate();
}
function createSyntheticEvent(e) {
  let syntheticEvent = {};
  for (const key in e) {
    if (Object.hasOwnProperty.call(e, key)) {
      syntheticEvent[key] = e[key];
    }
  }
  return syntheticEvent;
}
