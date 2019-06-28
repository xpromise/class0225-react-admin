import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

const Item = Form.Item;
const Option = Select.Option;

class AddUserForm extends Component {
  static propTypes = {
    roles: PropTypes.array.isRequired
  };

  validator = (rule, value, callback) => {
    // callback必须调用
    // console.log(rule, value);

    const name = rule.fullField === 'username' ? '用户名' : '密码';

    if (!value) {
      // 没有输入
      callback();
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

  };

  render () {
    const {getFieldDecorator} = this.props.form;
    
    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'username',
              {
                rules: [
                  {required: true, message: '必须输入用户名'},
                  {validator: this.validator}
                ]
              }
            )(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        <Item label='密码' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'password',
              {
                rules: [
                  {required: true, message: '必须输入密码'},
                  {validator: this.validator}
                ]
              }
            )(
              <Input placeholder='请输入密码' type='password'/>
            )
          }
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'phone',
              {
                rules: [
                  {required: true, message: '必须输入手机号'}
                ]
              }
            )(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'email',
              {
                rules: [
                  {required: true, message: '必须输入邮箱'}
                ]
              }
            )(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'role_id',
              {
                rules: [
                  {required: true, message: '必须选择角色'}
                ]
              }
            )(
              <Select placeholder='请选择角色'>
                {
                  this.props.roles.map((role) => {
                    return <Option value={role._id} key={role._id}>{role.name}</Option>
                  })
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUserForm);