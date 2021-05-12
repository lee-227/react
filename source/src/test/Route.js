import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
  NavLink,
  Prompt,
} from '../react-router-source';
export default function () {
  return (
    <Router>
      <li>
        <NavLink
          className='strong'
          style={{ textDecoration: 'line-through' }}
          activeStyle={{ color: 'red' }}
          to='/'
          exact
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeStyle={{ color: 'red' }} to='/user'>
          User
        </NavLink>
      </li>
      <li>
        <NavLink activeStyle={{ color: 'red' }} to='/profile'>
          Profile
        </NavLink>
      </li>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/user' component={User} />
        <Route exact path='/profile' component={Profile} />
        <Redirect to='/'></Redirect>
      </Switch>
    </Router>
  );
}
function Home() {
  return <h1>home</h1>;
}
function User(props) {
  return (
    <div>
      <ul>
        <li>
          <Link to='/user/list'>用户列表</Link>
        </li>
        <li>
          <Link to='/user/add'>添加用户</Link>
        </li>
      </ul>
      <div>
        <Route path='/user/add' component={UserAdd} />
        <Route path='/user/list' component={UserList} />
        <Route path='/user/detail/:id' component={UserDetail} />
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div>
      <Prompt
        when={true}
        message={(location) => `请问你确定要跳转到${location.pathname}吗?`}
      />
      <h1>Profile</h1>
    </div>
  );
}
function UserAdd(props) {
  function click() {
    props.history.go(-1);
  }
  return <h2 onClick={click}>UserAdd</h2>;
}
function UserList() {
  return <h2>UserList</h2>;
}
function UserDetail() {
  return <h2>UserDetail</h2>;
}
