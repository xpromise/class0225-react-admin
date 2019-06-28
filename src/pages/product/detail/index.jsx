import React, {Component} from 'react';
import {Card, Icon, List} from 'antd';
import {reqCategories} from "../../../api";

const Item = List.Item;

export default class Detail extends Component {
  state = {
    pCategoryName: ''
  };

  renderItem = (item, index) => {
    switch (index) {
      case 4:
        return <Item>商品图片: {item.map((item, index) => <img key={index} src={'http://localhost:5000/upload/' + item} alt={item}/>)}</Item>;
      case 5:
        return <Item>商品详情: <div dangerouslySetInnerHTML={{__html: item}} /></Item>
      default:
        return <Item>{item}</Item>;
    }
  };

  async componentDidMount() {
    const { pCategoryId } = this.props.location.state;
    if (pCategoryId !== '0') {
      const result = await reqCategories('0');
      const {name} = result.find((item) => item._id === pCategoryId);
      this.setState({
        pCategoryName: name
      })
    }
  }

  render () {
    const {name, desc, price, pCategoryId, imgs, detail} = this.props.location.state;

    let category;
    const pCategoryName = this.state.pCategoryName;

    if (pCategoryId === '0') {
      category = <span>商品分类: {name}</span>;
    } else {
      category = <span>商品分类: {pCategoryName}<Icon type='arrow-right'/>{name}</span>;
    }

    const data = [
      '商品名称: ' + name,
      '商品描述: ' + desc,
      '商品价格: ' + price + '元',
      category,
      imgs,
      detail
    ];

    return (
      <Card
        title={
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Icon onClick={() => this.props.history.goBack()} type='arrow-left' style={{fontSize: 25, marginRight: 10}}/>
            <span>商品详情</span>
          </div>
        }
      >
        <List
          bordered
          size="large"
          dataSource={data}
          renderItem={this.renderItem}
        />
      </Card>
    )
  }
}
