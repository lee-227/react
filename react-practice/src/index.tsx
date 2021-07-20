import { ConnectedRouter } from "connected-react-router";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Routes from "./Routes";
import store, { history } from "./store";

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes></Routes>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root"),
);
