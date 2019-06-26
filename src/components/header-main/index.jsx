import React, { Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import MyButton from '../my-button';
import { getItem, removeItem } from '../../utils/storage-tools';
import { reqWeather } from '../../api';
import menuList from '../../config/menu-config';

import './index.less';

class HeaderMain extends Component {
  state = {
    sysTime: Date.now(),
    weather: '晴',
    weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png'
  };

  componentWillMount() {
    // 只要读取一次
    this.username = getItem().username;
    this.title = this.getTitle(this.props);
  }

  async componentDidMount() {
    this.timeId = setInterval(() => {
      this.setState({
        sysTime: Date.now()
      })
    }, 1000);

    // 发送请求，请求天气
    const { promise, cancel } = reqWeather();

    this.cancel = cancel;

    const result = await promise;

    if (result) {
      this.setState(result);
    }

  }

  componentWillReceiveProps(nextProps) {
    this.title = this.getTitle(nextProps);
  }

  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.timeId);
    // 取消了ajax请求
    this.cancel();
  }

  /**
   * 登出
   */
  logout = () => {
    Modal.confirm({
      title: '您确认要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 清空本地数据
        removeItem();
        // 退出登录
        this.props.history.replace('/login');
      }
    })
  };

  /**
   * 获取title
   * @returns {string|*}
   */
  getTitle = (nextProps) => {
    // console.log('getTitle()');

    let { pathname } = nextProps.location;
    /*
      pathname: '/product/saveupdate'  --> '/product'
    */
    const pathnameReg = /^\/product\//;

    if (pathnameReg.test(pathname)) {
      pathname = pathname.slice(0, 8);
    }

    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      if (menu.children) {

        for (let j = 0; j < menu.children.length; j++) {
          const item = menu.children[j];
          if (item.key === pathname) {
            return item.title;
          }
        }

      } else {
        if (menu.key === pathname) {
          return menu.title;
        }
      }
    }
  };

  render() {
    const { sysTime, weather, weatherImg } = this.state;

    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">{this.title}</span>
        <div className="header-main-right">
          <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={weatherImg} alt="weatherImg"/>
          <span>{weather}</span>
        </div>
      </div>
    </div>;
  }
}

export default withRouter(HeaderMain);
