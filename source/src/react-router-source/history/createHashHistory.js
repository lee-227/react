function createHashHistory(props) {
  let confirm = props.getUserConfirmation
    ? props.getUserConfirmation()
    : window.confirm;
  let message;
  let stack = [];
  let index = -1;
  let action; //最新的动作
  let state; //这是最新的状态
  let listeners = [];
  function listen(listener) {
    listeners.push(listener);
    return function () {
      //unlisten
      listeners = listeners.filter((l) => l !== listener);
    };
  }
  function go(n) {
    action = 'POP';
    index += n;
    let nextLocation = stack[index];
    state = nextLocation.state;
    window.location.hash = nextLocation.pathname;
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  window.addEventListener('hashchange', () => {
    let pathname = window.location.hash.slice(1);
    Object.assign(history, { action, location: { pathname, state } });
    if (action === 'PUSH') {
      stack[++index] = history.location;
    }
    listeners.forEach((listener) => listener(history.location));
  });
  function push(pathname, nextState) {
    action = 'PUSH';
    if (typeof pathname === 'object') {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    if (message) {
      let showMessage = message({ pathname });
      let allow = confirm(showMessage);
      if (!allow) {
        return;
      }
    }
    window.location.hash = pathname;
  }
  function block(newMessage) {
    message = newMessage;
    return () => (message = null);
  }
  const history = {
    action: 'POP', //默认是POP
    go,
    goBack,
    goForward,
    push,
    listen,
    block,
    location: { pathname: '/', state: undefined },
  };
  history.location.pathname = window.location.hash
    ? window.location.hash.slice(1)
    : '/';
  return history;
}

export default createHashHistory;
