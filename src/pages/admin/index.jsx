import React, { Component } from 'react';
import { Layout } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Line from '../charts/line';
import Bar from '../charts/bar';
import Pie from '../charts/pie';
import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';
import { getItem } from '../../utils/storage-tools';
import { reqValidateUserInfo } from '../../api';

const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  async componentWillMount() {
    // 判断登录是否成功
    const user = getItem();

    // 用户是刷新进来的
    if (user && user._id) {
      // 发送请求验证 用户信息是否合法
      // 如果用户是登录进来的，就不需要。如果用户是使用之前的值，刷新访问进行来，就需要
      const result = await reqValidateUserInfo(user._id);
      /*
        // 验证用户信息 - 服务器代码  位置：routers/index.js
        router.post('/validate/user', (req, res) => {
          const { id } = req.body;

          UserModel.findById({_id: id}, (err, user) => {
            if (!err && user) {
              // 找到了用户数据
              res.json({
                status: 0,
                data: {}
              });
            } else {
              // 没有找到或者报错了
              res.json({
                status: 1,
                msg: '没有找到该用户'
              })
            }
          })
        })
       */

      if (result) return;
    }

    this.props.history.replace('/login');
  }

  render() {
    const { collapsed } = this.state;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, minHeight: 100 }}>
            <HeaderMain />
          </Header>
          <Content style={{ margin: '25px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/category" component={Category}/>
                <Route path="/product" component={Product}/>
                <Route path="/user" component={User}/>
                <Route path="/role" component={Role}/>
                <Route path="/charts/line" component={Line}/>
                <Route path="/charts/bar" component={Bar}/>
                <Route path="/charts/pie" component={Pie}/>
                <Redirect to="/home"/>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}