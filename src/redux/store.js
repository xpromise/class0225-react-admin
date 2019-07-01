/*
  用来集中式管理状态数据
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));