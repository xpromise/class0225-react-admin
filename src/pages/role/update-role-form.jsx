import React, {Component} from 'react';
import {Form, Input, Tree} from 'antd';
import PropTyeps from 'prop-types';

import menuList from '../../config/menu-config';

const Item = Form.Item;
const { TreeNode } = Tree;

class UpdateRoleForm extends Component {
  static propTypes = {
    name: PropTyeps.string.isRequired
  };

  state = {
    checkedKeys: [],
  };

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {
            this.renderTreeNodes(item.children)
          }
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });
  
  render () {
    const { getFieldDecorator } = this.props.form;
    
    return (
      <Form>
        <Item label='角色名称'>
          {
            getFieldDecorator(
              'name',
              {
                initialValue: this.props.name
              }
            )(
              <Input placeholder='请输入角色名称' disabled/>
            )
          }
        </Item>
        <Item>
          <Tree
            checkable
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            defaultExpandAll={true}
          >
            {this.renderTreeNodes(menuList)}
          </Tree>
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateRoleForm);