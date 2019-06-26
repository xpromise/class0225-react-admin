import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Index from './index/index';
import SaveUpdate from './save-update';
import Detail from './detail';

export default class Product extends Component {
  render() {
    return <Switch>
      <Route path="/product/index" component={Index}/>
      <Route path="/product/saveupdate" component={SaveUpdate}/>
      <Route path="/product/detail" component={Detail}/>
      <Redirect to="/product/index"/>
    </Switch>;
  }
}