import React, { Component } from 'react';
import { Layout,Menu,Input,Avatar,Affix,Dropdown,message } from 'antd';
import '../css/pages/Home.css';
import { Redirect } from 'react-router-dom';
import Cookies from '../cookie/Cookies';

const { Header, Content, Footer } = Layout;
const Search = Input.Search;
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isToLogin: false,
       userName: '',
      };
    //全局提示信息属性配置
    message.config({
      top: 100,
      duration: 1,
      maxCount: 3
    });
  }
  /**
   * 生命周期函数，初始加载页面时执行的方法，依据session和cookie进行用户信息的判断，是否重定向至登录界面
   */
  componentWillMount(){
    if(sessionStorage.getItem("name") !== null || Cookies.getCookie('name').length !== 0){
      this.setState({
        isToLogin: false,
        userName: Cookies.getCookie('name') || sessionStorage.getItem("name")
      });
    }else{
      this.setState({
        isToLogin: true,
      });
    }
  }
  /**
   * 退出登录
   */
  userLogOut(){
    message.success('登出成功！');
    sessionStorage.removeItem("name");
    this.setState({
      isToLogin: true,
    });
  }
  /**
   * Home页面导航栏
   */
  headerNavigation(){
      return(
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px',float: 'left'}}
        >
            <Menu.Item key="1">导航栏</Menu.Item>
            <Menu.Item key="2">导航栏</Menu.Item>
            <Menu.Item key="3">导航栏</Menu.Item>
        </Menu>
      );
  }
  /**
   * Home页面右上角用户信息
   */
  userInfoView(){
    return(
      <Dropdown
        overlay={
        <Menu>
          <Menu.Item key="1">
            {this.state.userName}
          </Menu.Item>
          <Menu.Item key="2" onClick={()=>{this.userLogOut()}}>
            登出
          </Menu.Item>
        </Menu>
      }
        placement="bottomCenter">
        <Avatar style={{ backgroundColor: '#1DA57A' }} icon="user" />
      </Dropdown>
    )
  }
  /**
   * Home页面搜索框
   */
  searchInfoView(){
    return(
      <Search
        placeholder="输入搜索信息..."
        onSearch={value => message.success(value)}
        enterButton/>
    )
  }
  render() {
    if(this.state.isToLogin){
      return(
        <Redirect push to="/login" />
      );
    }
    return (
      <Layout>
        <Affix>
          <Header className="header">
            <div className="logo-text" >CREATING VALUE</div>
            <div className="user-info" >
              {this.userInfoView()}
            </div>
            {this.headerNavigation()}
            <div className="search-input" >
              {this.searchInfoView()}
            </div>
          </Header>
        </Affix>
        <Content style={{ padding: '0' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Content style={{ padding: '0', minHeight: 800 }}>
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Creating Value ©2018 Created by Wp Clf
        </Footer>
      </Layout>
    );
  }
}
export default Home;