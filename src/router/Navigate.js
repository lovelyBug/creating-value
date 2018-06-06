import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from '../cookie/Cookies';
export default class Home extends Component{
    render(){
        return(
            Cookies.getCookie('name').length === 0 ?
            <Redirect to="/login"/>:
            <Redirect to="/home"/>
        )
    }
}