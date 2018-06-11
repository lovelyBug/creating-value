import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox,message,Row,Col } from 'antd';
import { Redirect } from 'react-router-dom';
import '../css/pages/Login.css';
import Cookies from '../cookie/Cookies';
const FormItem = Form.Item;
const UserLOgin = Form.create()(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
         email: '',
         password: '',
         redirect: false,
         checked: false,
         isLoginEnabled: false,
         captcha: undefined,
         remoteCaptcha: 'captcha',
         isRegister: false,
         isForgotPwd: false,
         countDownSeconds: 60,
         isCaptchaBtnEnable: true,
         isLoginDisable: true,
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
        const { email,password,checked,captcha,remoteCaptcha } = this.state;
        // if(captcha == undefined){
        //     message.warning('请输入验证码！');
        // }
        
        if(captcha !== remoteCaptcha){
            message.warning('请输入正确的验证码！');
            return;
        }
        //如果登陆成功
        if(checked){
            //如果选择记住我登陆，将登录信息保存至cookie里，时长一天
            Cookies.setCookie("name",email,1,"/");
        }else{
            //如果未选择记住我登陆，将之前保存在cookie里的用户信息清除
            Cookies.setCookie("name",email,-1,"/");
        }
        //将此次登录信息保存至sessionStorage，关闭页面或者登出后自动清除sessionStorage里的用户信息
        sessionStorage.setItem("name",email);
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
          this.setState({ email: inputValue });
          break;
        case 'password':
          this.setState({ password: inputValue });
          break;
        default:
          break;
      } 
    }
    /**
     * 填写验证码时触发的信息
     */
    handleCaptcha= (e) => {
        this.setState({captcha: e.target.value});
        if(e.target.value === this.state.remoteCaptcha){
            this.setState({
                isLoginDisable: false,
            });
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
    handleRegister = (e) => {
      e.preventDefault();
      this.setState({isRegister: true})
    }
    /**
     * 根据输入信息判断是否让登陆按钮可点
     */
    hasErrors = (fieldsError) => {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    }
    getCaptcha(){
        //正则验证邮箱格式
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!reg.test(this.state.email)){
            message.warning('请输入正确格式的邮箱！');
            return;
        }
        this.countDown();
        fetch("http://cv.pgbkb.top/Index/index/sendCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "to=esx56487@qq.com",
            })
            .then((res)=> {
                res.json().then( (data)=> {
                    alert(data.data);
                    this.setState({remoteCaptcha: data.data});
                });
                },function(e){
            })
            .catch((e)=>{
              alert('failed');
          })
        }
    /**
     * 验证码再次获取倒计时
     */
    countDown = () =>{
        var count =  setInterval(()=>{
            this.setState({countDownSeconds: this.state.countDownSeconds - 1});
        },1000);
        setTimeout(()=>{
            clearInterval(count);
            this.setState({countDownSeconds: 60});
        },60000);
    }
    handleALabelClick=() =>{
      message.warning('暂未有此功能！');
    }
    render() {
      if(this.state.isRegister){
        return(
            <Redirect push to="/login/register" />
        )
      }
      const { userName,password,redirect,captcha } = this.state;
      if(redirect){
        return(
          <Redirect push to="/home" />
        );
      }
      const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
      // 只有在输入框被点击后才会验证并且显示
      const userNameError = isFieldTouched('userName') && getFieldError('userName');
      const passwordError = isFieldTouched('password') && getFieldError('password');
      return (
        <div className="container">
          <h1 className="login-title">用户登录</h1>
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
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('captcha', {
                    rules: [{ required: true, message: '请输入您获取的验证码' }],
                  })(
                    <Input
                      value={captcha}
                      placeholder="验证码"
                      onChange={this.handleCaptcha}
                     />
                  )}
                </Col>
                <Col span={12}>
                  <Button
                    style={{width: 100}}
                    disabled={this.state.countDownSeconds !== 60} 
                    onClick={()=>{this.getCaptcha()}}
                  >
                    {this.state.countDownSeconds === 60 ? '获取验证码' : this.state.countDownSeconds + 's'}
                  </Button>
                </Col>
              </Row>
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
              <a href="#" className="login-form-forgot"  onClick={this.handleRegister}><pre>立即注册  </pre></a>
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
export default UserLOgin;