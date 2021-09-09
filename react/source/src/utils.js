import { useContext, useLayoutEffect, useMemo, useReducer, useRef } from "react";

function useSelector(selector){
  const {store} = useContext('context')
  let preState = store.getState()
  const ref = useRef(null)
  let selectState = useMemo(()=>{
    return selector(preState)
  },[preState,selector])
  const [,render] = useReducer(x=>x+1,0)
  useLayoutEffect(()=>{
    store.subscribe(()=>{
      if(ref.current === selectState){
        ref.current = selectState
        render()
      }
    })
  },store)
  return selectState
} 