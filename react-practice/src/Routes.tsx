import { HashRouter, Route, Switch } from "react-router-dom";
import Home from "./components/core/Home";
import List from "./components/core/List";

const Routes = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path='/' exact component={Home}></Route>
        <Route path='/list' component={List}></Route>
      </Switch>
    </HashRouter>
  );
};
export default Routes;
