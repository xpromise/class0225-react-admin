import React from 'react';
import ReactDOM from 'react-dom';
// 引入react-router-dom中BrowserRouter，重命名为Router
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
// 在index.js和app.jsx都行，样式是公共样式
import './assets/less/index.less';

ReactDOM.render(<Router><App/></Router>, document.getElementById('root'));