import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers } from "redux";
import testReducer from "./test.reducer";

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    test: testReducer,
  });
export default createRootReducer;
