import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import { Redirect } from 'react-router-dom';
import '../css/pages/Login.css';
import Cookies from '../cookie/Cookies';
const FormItem = Form.Item;

const Login = Form.create()(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: '',
         redirect: false,
         checked: false,
        };
        //提示信息属性配置
        message.config({
          top: 50,
          duration: 1,
          maxCount: 3
        });
    }
    /**
     * 点击登陆时触发的事件
     */
    handleSubmit = (e) => {
      const { userName,password,checked } = this.state;
      //如果登陆成功
      if(checked){
        //如果选择记住我登陆，将登录信息保存至cookie里，时长一天
        Cookies.setCookie("name",userName,1,"/");
      }else{
        //如果未选择记住我登陆，将之前保存在cookie里的用户信息清除
        Cookies.setCookie("name",userName,-1,"/");
      }
      //将此次登录信息保存至sessionStorage，关闭页面或者登出后自动清除sessionStorage里的用户信息
      sessionStorage.setItem("name",userName);
      message.success('登陆成功！');
      //登陆成功后重定向至主页面
      this.setState({ redirect: true });
    }
    /**
     * 输入信息时触发的事件
     */
    handleInput = (e) => {
      let inputValue = e.target.value;
      switch(e.target.type){
        case 'text':
          this.setState({ userName: inputValue });
          break;
        case 'password':
          this.setState({ password: inputValue });
          break;
        default:
          break;
      } 
    }
    /**
     * 清空输入框里的输入信息
     */
    emitEmpty = () => {
      this.userNameInput.focus();
      this.setState({ userName: '' });
    }
    /**
     * 复选框选中与否
     */
    onCheckBoxChange = (e) => {
      this.setState({
        checked: e.target.checked
      });
    }
    /**
     * 点击忘记密码触发的事件
     */
    handleALabelClick = (e) => {
      e.preventDefault();
      alert('尚未有此功能！');
    }
    /**
     * 根据输入信息判断是否让登陆按钮可点
     */
    hasErrors = (fieldsError) => {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    }
    render() {
      const { userName,password,redirect } = this.state;
      if(redirect){
        return(
          <Redirect push to="/home" />
        );
      }
      const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
      // 只有在输入框被点击后才会验证并且显示
      const userNameError = isFieldTouched('userName') && getFieldError('userName');
      const passwordError = isFieldTouched('password') && getFieldError('password');
      //const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
      return (
        <div className="container">
          <h1 className="login-title">Creating Value</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem
              validateStatus={userNameError ? 'error' : ''}
              help={userNameError || ''}
            >
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入正确的邮箱地址！',type: 'email' }],
              })(
                <Input
                  value={userName}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  //suffix={suffix}
                  placeholder="账号"
                  onChange={this.handleInput}
                  ref={node => this.userNameInput = node}
                  size="large"
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={passwordError ? 'error' : ''}
              help={passwordError || ''}
            >
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入长度大于6位的密码！',min: 6 }],
              })(
                <Input
                  value={password}
                  prefix={<Icon type="lock"
                  style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                  onChange={this.handleInput}
                  size="large"
                />
              )}
            </FormItem>
            <FormItem>
              <Checkbox
                className="login-form-checkbox"
                checked={this.state.checked}
                onChange={this.onCheckBoxChange}
                >
                记住我
              </Checkbox>
              <a href="#" className="login-form-forgot" onClick={this.handleALabelClick}>忘记密码</a>
              <Button type="primary" htmlType="submit" className="login-form-button" disabled={this.hasErrors(getFieldsError())}>
                登陆
              </Button>
            </FormItem>
          </Form>
        </div>
      );
    }
  }
);
export default Login;