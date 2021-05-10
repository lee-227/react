import React from 'react';

let hookStates = [];
let hookIndex = 0;
export function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  let currentIndex = hookIndex;
  function setState(newState) {
    hookStates[currentIndex] = newState;
  }
  return [hookStates[hookIndex++], setState];
}
export function useMemo(factory, deps) {
  if (hookStates[hookIndex]) {
    let [lastMemo, lastDeps] = hookStates[hookIndex];
    let same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastMemo;
    } else {
      let newMemo = factory();
      hookStates[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    let newMemo = factory();
    hookStates[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
export function useCallback(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastCallback, lastDeps] = hookStates[hookIndex];
    let same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastCallback;
    } else {
      hookStates[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    hookStates[hookIndex++] = [callback, deps];
    return callback;
  }
}

class PureComponent extends React.Component {
  shouldComponentUpdate(newProps, nextState) {
    return (
      !shallowEqual(this.props, newProps) ||
      !shallowEqual(this.state, nextState)
    );
  }
}
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  if (
    typeof obj1 != 'object' ||
    obj1 === null ||
    typeof obj2 != 'object' ||
    obj2 === null
  ) {
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
export function memo(OldComponent) {
  return class extends PureComponent {
    render() {
      return <OldComponent {...this.props} />;
    }
  };
}

export function useReducer(reducer, initialState, init) {
  hookStates[hookIndex] =
    hookStates[hookIndex] || (init ? init(initialState) : initialState);
  let currentIndex = hookIndex;
  function dispatch(action) {
    hookStates[currentIndex] = reducer
      ? reducer(hookStates[currentIndex], action)
      : action;
  }
  return [hookStates[hookIndex++], dispatch];
}

export function useEffect(callback, dependencies) {
  if (hookStates[hookIndex]) {
    let lastDeps = hookStates[hookIndex];
    let same = dependencies.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
    } else {
      hookStates[hookIndex++] = dependencies;
      setTimeout(callback);
    }
  } else {
    hookStates[hookIndex++] = dependencies;
    setTimeout(callback);
  }
}
