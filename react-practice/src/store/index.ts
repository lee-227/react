import { applyMiddleware, createStore } from "redux";
import createRootReducer from "./reducers";
import { createHashHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
export const history = createHashHistory();
const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(routerMiddleware(history))),
);
export default store;
