import React from 'react';
import ReactDOM from 'react-dom';
// 引入react-router-dom中BrowserRouter，重命名为Router
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';
// 在index.js和app.jsx都行，样式是公共样式
import './assets/less/index.less';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('root'));