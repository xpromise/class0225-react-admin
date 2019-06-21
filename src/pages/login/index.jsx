import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';

// 引入图片资源：在React脚手架中图片必须引入才会打包
import logo from './logo.png';
// import 必须在最上面
import './index.less';

// 缓存一下
const Item = Form.Item;

class Login extends Component {

  login = (e) => {
    e.preventDefault();

  }

  render() {
    // getFieldDecorator也是一个高阶组件
    const { getFieldDecorator } = this.props.form;

    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form onSubmit={this.login} className="login-form">
          <Item>
            {
              getFieldDecorator(
                'username',
                {
                  rules: [
                    {required: true, message: '请输入用户名！'},
                    {min: 4, message: '用户名必须大于4位'},
                    {max: 15, message: '用户名必须小于15位'},
                    {pattern: /^[a-zA-Z_0-9]+$/, message: '用户名只能包含英文字母、数字和下划线'}
                  ]
                }
              )(
                <Input className="login-input" prefix={<Icon type="user" />} placeholder="用户名"/>
              )
            }
          </Item>
          <Item>
            <Input className="login-input" prefix={<Icon type="lock" />} placeholder="密码" type="password"/>
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
          </Item>
        </Form>
      </section>
    </div>;
  }
}

// 返回值是一个包装组件   <Form(Login)><Login><Form(Login)>
// 通过Form(Login)包装组件向Login组件中传递form属性
export default Form.create()(Login);