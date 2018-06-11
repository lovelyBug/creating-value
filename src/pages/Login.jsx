import React, { Component } from 'react';
import {Form} from 'antd';
import { Redirect,Switch,Route } from 'react-router-dom';
import '../css/pages/Login.css';
import Cookies from '../cookie/Cookies';
import UserLOgin from '../components/UserLogin';
import UserRegister from '../components/UserRegister';
import ForgotPassword from '../components/ForgotPassword';

const Login = Form.create()(
  class extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="container">
          <Switch>
            <Route exact  path='/login/register' component={UserRegister} />
            <Route path='/login/userlogin' component={UserLOgin} />
            <Route path='/login/forgotpwd' component={ForgotPassword} />
            <Route component={UserLOgin} />
          </Switch>
        </div>
      );
    }
  }
);
export default Login;