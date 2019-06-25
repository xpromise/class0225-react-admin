import React, { Component } from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd';

import { reqCategories, reqAddCategory } from '../../api';
import MyButton from '../../components/my-button';
import AddCategoryForm from './add-category-form';
import './index.less';

export default class Category extends Component {
  state = {
    categories: [], // 一级分类列表
    isShowAddCategory: false, // 显示添加品类
  }

  async componentDidMount() {
    const result = await reqCategories('0');
    if (result) {
      this.setState({categories: result});
    }
  }

  /**
   * 显示添加品类
   */
  showAddCategory = () => {
    this.setState({
      isShowAddCategory: true
    })
  };

  /**
   * 隐藏添加品类
   */
  hideAddCategory = () => {
    this.setState({
      isShowAddCategory: false
    })
  }

  /**
   * 添加品类
   */
  addCategory = () => {
    // 1. 表单校验
    // 2. 收集表单数据
    // console.log(this.addCategoryForm);
    const { form } = this.addCategoryForm.props;

    form.validateFields(async (err, values) => {
      if (!err) {
        // 校验通过
        console.log(values);
        const { parentId, categoryName } = values;
        const result = await reqAddCategory(parentId, categoryName);

        if (result) {
          // 添加分类成功~
          message.success('添加分类成功~', 2);
          // 清空表单数据
          form.resetFields(['parentId', 'categoryName']);

          /*
            如果是一级分类：就在一级分类列表中展示
            如果是二级分类：就在二级分类中展示，而一级分类是不需要的
           */

          const options = {
            isShowAddCategory: false
          };

          if (result.parentId === '0') {
            options.categories = [...this.state.categories, result];
          }

          // 统一更新
          this.setState(options);

        }
      }
    })
    // 3. 发送请求
  };

  render() {
    const { categories, isShowAddCategory } = this.state;

    // 决定表头内容
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        className: 'category-operation',
        // 改变当列的显示
        render: text => {
          console.log(text);
          return <div>
            <MyButton>修改名称</MyButton>
            <MyButton>查看其子品类</MyButton>
          </div>
        },
      },
    ];
    // 决定表格里面数据
    /*const data = [
      {
        key: '1',
        categoryName: '手机',
        // operation: 'xxxxx',
      },
      {
        key: '2',
        categoryName: '电脑',
        // operation: 'yyyy',
      },
      {
        key: '3',
        categoryName: '耳机',
        // operation: 'zzzzzz',
      },
      {
        key: '4',
        categoryName: '鼠标',
        // operation: 'zzzzzz',
      },
    ];*/

    return <Card title="一级分类列表" extra={<Button type="primary" onClick={this.showAddCategory}><Icon type="plus" />添加品类</Button>}>
      <Table
        columns={columns}
        dataSource={categories}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          showQuickJumper: true
        }}
        rowKey="_id"
      />
      <Modal
        title="添加分类"
        visible={isShowAddCategory}
        onOk={this.addCategory}
        onCancel={this.hideAddCategory}
        okText="确认"
        cancelText="取消"
      >
        <AddCategoryForm categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
      </Modal>

    </Card>;
  }
}
