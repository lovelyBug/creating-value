import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password:'',
            username: '',
            phone: '',
            confirmDirty: false,
            autoCompleteResult: [],
            redirect: false,
            checked: false,
            isLoginEnabled: false,
            captcha: '',
            remoteCaptcha: 'captcha',
            isRegister: false,
            isForgotPwd: false,
            countDownSeconds: 60,
            isCaptchaBtnEnable: true,
            isLoginDisable: true,
            };
    }
    /**
     * 处理提交信息
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            fetch("http://cv.pgbkb.top/index/index/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
                userEmail: this.state.email,
                userName: this.state.username,
                password: this.state.password,
                conform: this.state.password,
            }),
            })
            .then((res)=> {
                res.json().then((data)=> {
                    alert(data.msg);
                });
                },function(e){
                    alert('failed');
            })
            .catch((e)=>{
                alert('failed');
            })
        }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
        callback('您两次输入的密码不同！');
        } else {
        callback();
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    /**
     * 获取验证码
     */
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
                to:'esx56487@qq.com',
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
                });
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
    /**
     * 处理用户输入的email
     */
    handleEmailInput = (e) => {
        this.setState({email: e.target.value});
    }
    /**
     * 处理用户输入的pwd
     */
    handlePwdInput = (e) => {
        this.setState({password: e.target.value});
    }
    /**
     * 处理用户输入的用户名
     */
    handleUsernameInput = (e) => {
        this.setState({username: e.target.value});
    }
    /**
     * 处理用户输入的手机号
     */
    handlePhoneInput = (e) => {
        this.setState({phone: e.target.value});
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
        };
        const tailFormItemLayout = {
        wrapperCol: {
            xs: {
            span: 24,
            offset: 0,
            },
            sm: {
            span: 16,
            offset: 8,
            },
        },
        };
        const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '86',
        })(
        <Select style={{ width: 70 }}>
            <Option value="86">+86</Option>
        </Select>
        );

        const websiteOptions = autoCompleteResult.map(website => (
        <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <div className="container">
                <Form onSubmit={this.handleSubmit} className="register-form">
                    <FormItem
                        {...formItemLayout}
                        label="邮箱"
                        >
                        {getFieldDecorator('email', {
                            rules: [{
                            type: 'email', message: '您输入的邮箱格式是不合法的！',
                            }, {
                            required: true, message: '请输入您的邮箱！',
                            }],
                        })(
                            <Input
                                value={this.state.email}
                                placeholder="账号"
                                onChange={this.handleEmailInput}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                        >
                        {getFieldDecorator('password', {
                            rules: [{
                            required: true, message: '密码长度在6-30位之间！',min: 6,
                            max: 30
                            }, {
                            validator: this.validateToNextPassword,
                            
                            }],
                        })(
                            <Input
                                type="password"
                                value={this.state.password}
                                placeholder="密码"
                                onChange={this.handlePwdInput}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码"
                        >
                        {getFieldDecorator('confirm', {
                            rules: [{
                            required: true, message: '请确认您的密码！',
                            }, {
                            validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input 
                                type="password" 
                                onBlur={this.handleConfirmBlur} 
                                placeholder="确认密码"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            用户名&nbsp;
                            <Tooltip title="您想给自己起个什么样的用户名呢？">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                            </span>
                        )}
                        >
                        {getFieldDecorator('nickname', {
                            rules: [{ required: true, message: '请输入用户名！', whitespace: true }],
                        })(
                            <Input
                                value={this.state.username}
                                placeholder="用户名"
                                onChange={this.handleUsernameInput}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                        >
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: '请输入您的手机号码！' }],
                        })(
                            <Input
                                addonBefore={prefixSelector}
                                style={{ width: '100%' }}
                                placeholder="手机号码"
                                onChange={this.handlePhoneInput}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="验证码"
                        extra="防止机器人攻击，我们必须确认您的身份！"
                        >
                        <Row gutter={8}>
                            <Col span={12}>
                            {getFieldDecorator('captcha', {
                                rules: [{ required: true, message: '请输入验证码！' }],
                            })(
                                <Input
                                    placeholder='验证码'
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
                    <FormItem {...tailFormItemLayout}>
                        <Button className="login-form-button" type="primary" htmlType="submit">注册</Button>
                    </FormItem>
                </Form>
            </div>
        
        );
    }
}
export default Form.create()(RegistrationForm);
