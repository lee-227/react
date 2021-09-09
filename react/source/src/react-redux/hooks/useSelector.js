import { useContext, useLayoutEffect, useReducer, useRef } from 'react'
import ReactReduxContext from '../ReactReduxContext'
function useSelectorWithStore(selector, store) {
  let lastSelectedState = useRef(null);
  let [, forceRender] = useReducer((x) => x + 1, 0) //useState
  let storeState = store.getState() //获取总状态
  let selectedState = selector(storeState)
  useLayoutEffect(() => {
    return store.subscribe(()=>{
      let selectedState = selector(store.getState());
      if(shallowEqual(lastSelectedState.current,selectedState)){
        forceRender()
        lastSelectedState.current = selectedState
      }
    })
  }, [store,selector])
  return selectedState
}
function useSelector(selector) {
  const { store } = useContext(ReactReduxContext)
  const selectedState = useSelectorWithStore(
    //选择器 比较两个值是否相等
    selector,
    store
  )
  return selectedState
}
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) {
      return true;
  }
  if (typeof obj1 != "object" || obj1 === null || typeof obj2 != "object" || obj2 === null) {
      return false;
  }
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
      return false;
  }
  for (let key of keys1) {
      if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
          return false;
      }
  }
  return true;
}
export default useSelector
