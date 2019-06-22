import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { reqLogin } from '../../api';

// 引入图片资源：在React脚手架中图片必须引入才会打包
import logo from '../../assets/images/logo.png';
// import 必须在最上面
import './index.less';

// 缓存一下
const Item = Form.Item;

class Login extends Component {

  /**
   * 登录函数
   * @param e
   */
  login = (e) => {
    e.preventDefault();
    // 用来校验表单并获取表单的值
    this.props.form.validateFields(async (error, values) => {
      // console.log(error, values);
      /*
        error 代表表单校验结果
          null 校验通过
          {} 校验失败
       */
      if (!error) {
        // 校验通过
        const { username, password } = values;
        // 发送请求，请求登录
        const result = await reqLogin(username, password);

        if (result) {
          // 登录成功
          this.props.history.replace('/');
        } else {
          // 登录失败
          this.props.form.resetFields(['password']);
        }

      } else {
        // 校验失败
        console.log('登录表单校验失败：', error);
      }
    })
  }

  /**
   * 自定义校验规则函数
   * @returns {*}
   */
  validator = (rule, value, callback) => {
    // callback必须调用
    // console.log(rule, value);

    const name = rule.fullField === 'username' ? '用户名' : '密码';

    if (!value) {
      // 没有输入
      callback(`必须输入${name}！`);
    } else if (value.length < 4) {
      callback(`${name}必须大于4位`);
    } else if (value.length > 15) {
      callback(`${name}必须小于15位`);
    } else if (!/^[a-zA-Z_0-9]+$/.test(value)) {
      callback(`${name}只能包含英文字母、数字和下划线`);
    } else {
      // 不传参代表校验通过，传参代表校验失败
      callback();
    }

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
                    /*{required: true, message: '请输入用户名！'},
                    {min: 4, message: '用户名必须大于4位'},
                    {max: 15, message: '用户名必须小于15位'},
                    {pattern: /^[a-zA-Z_0-9]+$/, message: '用户名只能包含英文字母、数字和下划线'}*/
                    {
                      validator: this.validator
                    }
                  ]
                }
              )(
                <Input className="login-input" prefix={<Icon type="user" />} placeholder="用户名"/>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator(
                'password',
                {
                  rules: [
                    {
                      validator: this.validator
                    }
                  ]
                }
              )(
                <Input className="login-input" prefix={<Icon type="lock" />} placeholder="密码" type="password"/>
              )
            }
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
          </Item>
        </Form>
      </section>
    </div>;
  }
}

// 返回值是一个包装组件   <Form(Login)><Login></Form(Login)>
// 通过Form(Login)包装组件向Login组件中传递form属性
export default Form.create()(Login);