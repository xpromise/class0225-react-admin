import React, { Component } from 'react';
import { Card, Button, Icon, Table } from 'antd';

import { reqCategories } from '../../api';
import MyButton from '../../components/my-button';
import './index.less';

export default class Category extends Component {
  state = {
    categories: [], // 一级分类列表
  }

  async componentDidMount() {
    const result = await reqCategories('0');
    if (result) {
      this.setState({categories: result});
    }
  }

  render() {
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

    return <Card title="一级分类列表" extra={<Button type="primary"><Icon type="plus" />添加品类</Button>}>
      <Table
        columns={columns}
        dataSource={this.state.categories}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          showQuickJumper: true
        }}
        rowKey="_id"
      />
    </Card>;
  }
}