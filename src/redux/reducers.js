/*
  根据之前的状态和action来生成新状态
 */
import { combineReducers } from 'redux';
import { CATEGORIES_FAILED, GET_CATEGORIES_SUCCESS, Add_CATEGORY_SUCCESS } from './action-types';

function categories(prevState = [], action) {
  switch (action.type) {
    case GET_CATEGORIES_SUCCESS :
      return action.data;
    case Add_CATEGORY_SUCCESS :
      return [...prevState, action.data];
    case  CATEGORIES_FAILED :
      return {err: action.data, category: prevState};
    default :
      return prevState;
  }
}

function roles(prevState = [], action) {
  switch (action.type) {
    default :
      return prevState;
  }
}

/*
  现在store对象中管理的状态数据
  {
    categories: [],
    roles: []
  }
 */
export default combineReducers({
  categories,
  roles
});