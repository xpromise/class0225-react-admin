import React, { Component } from 'react';
import { Card, Icon, Form, Input, Button, Cascader, InputNumber  } from 'antd';
import draftToHtml from "draftjs-to-html";
import {convertToRaw} from "draft-js";

import { reqCategories, reqAddProduct } from '../../../api';
import RichTextEditor from './rich-text-editor';

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

  async componentDidMount() {
    const result = await reqCategories('0');

    if (result) {
      this.setState({
        options: result.map((item) => {
          return {
            value: item._id,
            label: item.name,
            isLeaf: false,
          }
        })

      })
    }
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

        // 发送请求
        const result = await reqAddProduct({ name, desc, price, categoryId, pCategoryId, detail });

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
                ]
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
                ]
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
                ]
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
                ]
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
        <Item label="商品详情" wrapperCol={{span: 20}}>
          <RichTextEditor ref={this.richTextEditorRef}/>
        </Item>
        <Item>
          <Button type="primary" className="add-product-btn" htmlType="submit">提交</Button>
        </Item>
      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate);