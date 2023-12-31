function createBrowserHistory(props) {
  let confirm = props.getUserConfirmation
    ? props.getUserConfirmation()
    : window.confirm;
  let globalHistory = window.history;
  let listeners = [];
  let message;
  function go(n) {
    globalHistory.go(n);
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  function listen(listener) {
    listeners.push(listener);
    return function () {
      //unlisten
      listeners = listeners.filter((l) => l !== listener);
    };
  }
  window.addEventListener('popstate', (e) => {
    setState({
      action: e.type,
      location: { state: e.state, pathname: window.location.pathname },
    });
  });
  function setState(newState) {
    Object.assign(history, newState);
    history.length = globalHistory.length;
    listeners.forEach((listener) => listener(history.location));
  }
  /**
   * @param {*} pathname 可能是对象，也可能是字符串
   * @param {*} state 这个路径的状态对象是什么,只是一个路径的描述信息，可以放任何
   */
  function push(pathname, state) {
    const action = 'PUSH'; //表示发了什么动作引起了路径变化 POP PUSH
    if (typeof pathname === 'object') {
      state = pathname.state;
      pathname = pathname.pathname;
    }
    if (message) {
      let showMessage = message({ pathname });
      let allow = confirm(showMessage);
      if (!allow) {
        return;
      }
    }
    globalHistory.pushState(state, null, pathname);
    let location = { state, pathname };
    setState({ action, location });
  }
  function block(newMessage) {
    message = newMessage;
    return () => (message = null);
  }
  const history = {
    action: 'POP',
    go,
    goBack,
    goForward,
    listen,
    block,
    location: {
      pathname: window.location.pathname,
      state: globalHistory.state,
    },
    push,
  };
  return history;
}

export default createBrowserHistory;
