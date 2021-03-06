import React, { Component } from 'react';
import { Icon, Menu } from "antd";
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import menuList from '../../config/menu-config';
import { getItem } from '../../utils/storage-tools';

import './index.less';
import logo from '../../assets/images/logo.png';

const { SubMenu, Item } = Menu;

class LeftNav extends Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired
  };

  createMenu = (menu) => {
    return <Item key={menu.key}>
      <Link to={menu.key}>
        <Icon type={menu.icon} />
        <span>{menu.title}</span>
      </Link>
    </Item>
  };

  // render 之前只做一次
  componentWillMount() {
    let { pathname } = this.props.location;
    let { role : { menus }, username } = getItem();

    if (username === 'admin') {
      // 就是admin
      menus = [
        '/home',
        '/products',
        '/category',
        '/product',
        '/user',
        '/role',
        '/charts',
        '/charts/line',
        '/charts/bar',
        '/charts/pie',
      ]
    }

    /*
      pathname: '/product/saveupdate'  --> '/product'
    */

    const pathnameReg = /^\/product\//;

    if (pathnameReg.test(pathname)) {
      pathname = pathname.slice(0, 8);
    }

    let isHome = true;
    // 根据menuList生成菜单
    this.menus = menuList.reduce((prev, curr) => {
      // 判断是一级菜单还是二级菜单
      const children = curr.children;

      if (children) {
        let isShowSubMenu = false;
        // 二级菜单
        /*
          内容变 长度不变 用map
          内容不变 长度变 用filter
          内容变 长度变 用reduce
         */
        const subMenu = <SubMenu
          key={curr.key}
          title={
            <span>
              <Icon type={curr.icon} />
              <span>{curr.title}</span>
            </span>
          }
        >
          {
            children.reduce((prev, current) => {
              const menu = menus.find((menu) => menu === current.key);
              if (menu) {
                if (current.key === pathname) {
                  // 说明当前地址是一个二级菜单，需要展开一级菜单
                  // 初始化展开的菜单
                  this.openKey = curr.key;
                  isHome = false;
                }
                // 找到了显示
                isShowSubMenu = true;
                return [...prev, this.createMenu(current)];
              } else {
                return prev;
              }
            }, [])
          }
        </SubMenu>;

        return isShowSubMenu ? [...prev, subMenu] : prev;
      } else {
        // 一级菜单
        // 从权限数组找是否匹配上一级菜单
        const menu = menus.find((menu) => menu === curr.key);

        if (menu) {
          if (curr.key === pathname) isHome = false;
          // 匹配上就添加进行，将来会显示菜单
          return [...prev, this.createMenu(curr)];
        } else {
          return prev;
        }
      }
    }, []);

    /*this.menus = menuList.map((menu) => {
      // 判断是一级菜单还是二级菜单
      const children = menu.children;

      if (children) {
        // 二级菜单
        return <SubMenu
          key={menu.key}
          title={
            <span>
              <Icon type={menu.icon} />
              <span>{menu.title}</span>
            </span>
          }
        >
          {
            children.map((item) => {
              if (item.key === pathname) {
                // 说明当前地址是一个二级菜单，需要展开一级菜单
                // 初始化展开的菜单
                this.openKey = menu.key;
                isHome = false;
              }
              return this.createMenu(item);
            })
          }
        </SubMenu>;
      } else {
        if (menu.key === pathname) isHome = false;
        // 一级菜单
        return this.createMenu(menu);
      }
    });*/
    // 初始化选中菜单
    this.selectedKey = isHome ? '/home' : pathname;
  }

  render() {
    const { collapsed } = this.props;

    return <div>
      <Link className="left-nav-logo" to='/home'>
        <img src={logo} alt="logo"/>
        <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
      </Link>
      <Menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
        {
          this.menus
        }
        {/*<Item key="/home">
          <Link to="/home">
            <Icon type="home" />
            <span>首页</span>
          </Link>
        </Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="appstore" />
              <span>商品</span>
            </span>
          }

        >
          <Item key="/category">
            <Link to="/category">
              <Icon type="bars" />
              <span>品类管理</span>
            </Link>
          </Item>
          <Item key="4">
            <Icon type="tool" />
            <span>商品管理</span>
          </Item>
        </SubMenu>
        <Item key="5">
          <Icon type="user" />
          <span>用户管理</span>
        </Item>
        <Item key="6">
          <Icon type="user" />
          <span>权限管理</span>
        </Item>
        <SubMenu
          key="sub2"
          title={
            <span>
                <Icon type="team" />
                <span>图形图表</span>
              </span>
          }
        >
          <Item key="7">
            <Icon type="team" />
            <span>柱形图</span>
          </Item>
          <Item key="8">
            <Icon type="team" />
            <span>折线图</span>
          </Item>
          <Item key="9">
            <Icon type="team" />
            <span>饼图</span>
          </Item>
        </SubMenu>*/}
      </Menu>
    </div>;
  }
}

// withRouter是一个高阶组件，向非路由组件传递三大属性：history、location、match
export default withRouter(LeftNav);