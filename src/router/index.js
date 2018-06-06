import React, { Component } from 'react';
import {HashRouter,Switch,Route} from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Navigate from './Navigate';
class RouterConfig extends Component {
  render() {
    return(
      <HashRouter>
        <Switch>
            <Route exact path="/" component={Navigate} />
            <Route path="/home" component={Home} />
            <Route path="/login" component={Login} />
        </Switch>
      </HashRouter>
    )
  }
}
export default RouterConfig;