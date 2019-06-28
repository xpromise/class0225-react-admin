import React, { Component } from 'react';
import { Card, Button, Icon, Table, Select, Input, message } from 'antd';

import MyButton from '../../../components/my-button';
import { reqProducts, reqSearchProduct, reqUpdateProductStatus, reqCategories } from '../../../api';
import './index.less';

const { Option } = Select;

export default class Index extends Component {
  state = {
    products: [],
    total: 0,
    loading: true,
    searchType: 'productName',
    searchContent: '',
    pageSize: 3,
    pageNum: 1
  };

  componentDidMount() {
    this.getProducts(1, 3);
  };

  getProducts = async (pageNum, pageSize) => {

    this.setState({
      loading: true
    });

    const { searchContent, searchType } = this.state;

    let promise = null;

    if (this.isSearch && searchContent) {
      promise = reqSearchProduct({
        searchType, searchContent, pageSize, pageNum
      });
    } else {
      promise = reqProducts(pageNum, pageSize);
    }

    const result = await promise;

    if (result) {
      this.setState({
        total: result.total,
        products: result.list,
        loading: false,
        pageNum,
        pageSize
      })
    }

  };

  showAddProduct = () => {
    this.props.history.push('/product/saveupdate');
  };

  showProduct = (path, product) => {
    return () => {
      this.props.history.push(path, product);
    }
  };

  handleChange = (stateName) => {
    return (e) => {
      let value = '';
      if (stateName === 'searchType') {
        value = e;
      } else {
        // searchContent 一定是输入框的变化
        value = e.target.value;
        if (!value) this.isSearch = false;
      }
      this.setState({[stateName]: value})
    }
  };

  search = async () => {
    // 收集数据
    const { searchContent, pageSize, pageNum } = this.state;
    // 收集pageNum、pageSize
    // console.log(searchType, searchContent, pageSize, pageNum);

    if (searchContent) {
      // 发送请求，请求数据
      this.isSearch = true;
      this.getProducts(pageNum, pageSize);
    } else {
      message.warn('请输入搜索内容~', 2);
    }

  };

  updateProductStatus = (product) => {
    return async () => {
      // 发送请求更新状态
      const status = 3 - product.status;
      const productId = product._id;

      const result = await reqUpdateProductStatus(productId, status);

      if (result) {
        message.success('更新商品状态成功~');

        this.setState({
          products: this.state.products.map((product) => {
            if (product._id === productId) {
              return {...product, status};
            }
            return product;
          })
        })
      }
    }
  };

  render() {

    const { products, total, loading } = this.state;

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        className: 'product-status',
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          return product.status === 1
            ? <div><Button type="primary" onClick={this.updateProductStatus(product)}>上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
            : <div><Button type="primary" onClick={this.updateProductStatus(product)}>下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
        }
      },
      {
        className: 'product-status',
        title: '操作',
        render: (product) => {
          return <div>
            <MyButton onClick={this.showProduct('/product/detail', product)}>详情</MyButton>
            <MyButton onClick={this.showProduct('/product/saveupdate', product)}>修改</MyButton>
          </div>
        }
      },
    ];

    return <Card
      title={
        <div>
          <Select defaultValue="productName" onChange={this.handleChange('searchType')}>
            <Option key={0} value="productName">根据商品名称</Option>
            <Option key={1} value="productDesc">根据商品描述</Option>
          </Select>
          <Input placeholder="关键字" className="search-input" onChange={this.handleChange('searchContent')}/>
          <Button type="primary" onClick={this.search}>搜索</Button>
        </div>
      }
      extra={<Button type="primary" onClick={this.showAddProduct}><Icon type="plus"/>添加产品</Button>}
    >
      <Table
        columns={columns}
        dataSource={products}
        bordered
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          total,
          onChange: this.getProducts,
          onShowSizeChange: this.getProducts
        }}
        rowKey="_id"
        loading={loading}
      />
    </Card>;
  }
}