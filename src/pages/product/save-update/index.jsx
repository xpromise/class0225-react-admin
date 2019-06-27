import React, { Component } from 'react';
import { Card, Icon, Form, Input, Button, Cascader, InputNumber  } from 'antd';
import draftToHtml from "draftjs-to-html";
import {convertToRaw} from "draft-js";

import { reqCategories, reqAddProduct, reqUpdateProduct } from '../../../api';
import RichTextEditor from './rich-text-editor';
import PictureWall from './picture-wall';

import './index.less';

const { Item } = Form;

class SaveUpdate extends Component {

  state = {
    options: []
  };
  /*
    ref获取普通标签，就是拿到真实DOM元素
    获取组件，就是拿到组件的实例对象
   */
  richTextEditorRef = React.createRef();

  getCategories = async (parentId) => {
    const result = await reqCategories(parentId);

    if (result) {
      // 判断如果是二级分类
      if (parentId === '0') {
        this.setState({
          options: result.map((item) => {
            return {
              value: item._id,
              label: item.name,
              isLeaf: false,
            }
          })
        })
      } else {
        this.setState({
          options: this.state.options.map((item) => {
            if (item.value === parentId) {
              item.children = result.map((item) => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            }
            return item;
          })
        })
      }
    }
  }

  async componentDidMount() {
    this.getCategories('0');

    /*
      如果是一级分类：pCategoryId: 0  categoryId: 一级分类id
      如果是二级分类：pCategoryId:一级分类id  categoryId: 二级分类id
     */
    const product = this.props.location.state;

    let categoriesId = [];
    if (product) {
      if (product.pCategoryId !== '0') {
        categoriesId.push(product.pCategoryId);
        // 请求二级分类数据
        this.getCategories(product.pCategoryId);
      }
      categoriesId.push(product.categoryId);
    }

    this.categoriesId = categoriesId;
  };

  /**
   * 加载二级分类数据
   * @param selectedOptions
   */
  loadData = async selectedOptions => {
    // 获取数组最后一项
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // 显示loading图标
    targetOption.loading = true;
    // 发送请求、请求二级分类数据
    const result = await reqCategories(targetOption.value);

    if (result) {
      // 将loading改为false
      targetOption.loading = false;

      targetOption.children = result.map((item) => {
        return {
          label: item.name,
          value: item._id,
        }
      });
      // 更新状态
      this.setState({
        options: [...this.state.options],
      });
    }

  };

  addProduct = (e) => {
    e.preventDefault();

    // 验证表单和收集数据
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { editorState } = this.richTextEditorRef.current.state;
        const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        const { name, desc, price, categoriesId } = values;

        let pCategoryId = '0';
        let categoryId = '';

        if (categoriesId.length === 1) {
          categoryId = categoriesId[0];
        } else {
          pCategoryId = categoriesId[0];
          categoryId = categoriesId[1];
        }

        let promise = null;

        const product = this.props.location.state;
        const options = { name, desc, price, categoryId, pCategoryId, detail };

        // 发送请求
        if (product) {
          // 更新/修改
          options._id = product._id;
          promise = reqUpdateProduct(options);
        } else {
          // 添加
          promise = reqAddProduct(options);
        }

        const result = await promise;

        if (result) {
          // 请求成功~
          // 返回到index页面，并且要显示商品
          this.props.history.push('/product/index');
        }

      }
    })

  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { options } = this.state;
    const { getFieldDecorator } = this.props.form;
    // 如果是添加产品，product是undefined，如果是修改产品，product是对象
    const product = this.props.location.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    return <Card title={<div className="product-title"><Icon type="arrow-left" className='arrow-icon' onClick={this.goBack}/><span>添加商品</span></div>}>
      <Form {...formItemLayout} onSubmit={this.addProduct}>
        <Item label="商品名称">
          {
            getFieldDecorator(
              'name',
              {
                rules: [
                  {required: true, message: '请输入商品名称'}
                ],
                initialValue: product ? product.name : ''
              }
            )(
              <Input placeholder="请输入商品名称"/>
            )
          }
        </Item>
        <Item label="商品描述">
          {
            getFieldDecorator(
              'desc',
              {
                rules: [
                  {required: true, message: '请输入商品描述'}
                ],
                initialValue: product ? product.desc : ''
              }
            )(
              <Input placeholder="请输入商品描述"/>
            )
          }
        </Item>
        <Item label="选择分类" wrapperCol={{span: 5}}>
          {
            getFieldDecorator(
              'categoriesId',
              {
                rules: [
                  {required: true, message: '请选择分类'}
                ],
                initialValue: this.categoriesId
              }
            )(
              <Cascader
                options={options}
                loadData={this.loadData}
                changeOnSelect
                placeholder="请选择分类"
              />
            )
          }
        </Item>
        <Item label="商品价格">
          {
            getFieldDecorator(
              'price',
              {
                rules: [
                  {required: true, message: '请输入商品价格'}
                ],
                initialValue: product ? product.price : ''
              }
            )(
              <InputNumber
                // 格式化，对输入的数据进行格式化
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/￥\s?|(,*)/g, '')}
                className="input-number"
              />
            )
          }
        </Item>
        <Item label="商品图片" >
          <PictureWall imgs={product ? product.imgs : []} id={product ? product._id : ''}/>
        </Item>
        <Item label="商品详情" wrapperCol={{span: 20}}>
          <RichTextEditor ref={this.richTextEditorRef} detail={product ? product.detail : ''}/>
        </Item>
        <Item>
          <Button type="primary" className="add-product-btn" htmlType="submit">提交</Button>
        </Item>
      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate);