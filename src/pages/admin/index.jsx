import React, { Component, Fragment } from 'react';
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
    isLoading: true,
    success: []
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
      // console.log(result);

      if (result) {
        let menus = user.role.menus;

        if (user.username === 'admin') {
          // 就是admin
          menus = [
            '/home',
            '/products',
            '/category',
            '/product',
            '/user',
            '/role',
            '/charts',
            '/charts/line',
            '/charts/bar',
            '/charts/pie',
          ]
        }

        return this.setState({
          isLoading: false,
          success: menus.reverse()
        })
      }

    }

    this.setState({
      isLoading: false,
      success: []
    })

  }

  render() {
    const { collapsed, isLoading, success } = this.state;

    if (isLoading) return null;

    return success.length ? <Layout style={{ minHeight: '100vh' }}>
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
              {
                success.map((item) => {
                  switch (item) {
                    case '/category' :
                      return <Route key={item} path="/category" component={Category}/>;
                    case '/product' :
                      return  <Route key={item} path="/product" component={Product}/>;
                    case '/user' :
                      return <Route key={item} path="/user" component={User}/>;
                    case '/role' :
                      return <Route key={item} path="/role" component={Role}/>;
                    case '/charts/line' :
                      return <Route key={item} path="/charts/line" component={Line}/>;
                    case '/charts/bar' :
                      return <Route key={item} path="/charts/bar" component={Bar}/>;
                    case '/charts/pie' :
                      return <Route key={item} path="/charts/pie" component={Pie}/>;
                    case '/home' :
                      return <Fragment key={item}><Route path="/home" component={Home}/><Redirect to="/home"/></Fragment>;
                    default :
                      return null;
                  }
                })
              }
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          推荐使用谷歌浏览器，可以获得更佳页面操作体验
        </Footer>
      </Layout>
    </Layout> : <Redirect to='/login'/>;
  }
}