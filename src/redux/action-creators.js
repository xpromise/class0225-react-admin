/*
  用来生产action对象的工厂函数模块：
    同步：返回值是action对象
    异步：返回值是函数
 */
import { reqCategories, reqAddCategory } from '../api';
import { CATEGORIES_FAILED, GET_CATEGORIES_SUCCESS, Add_CATEGORY_SUCCESS } from './action-types';

// 同步action
export const getCategoriesSuccess = (data) => ({type: GET_CATEGORIES_SUCCESS, data});
export const addCategorySuccess = (data) => ({type: Add_CATEGORY_SUCCESS, data});
export const categoriesFailed = (data) => ({type: CATEGORIES_FAILED, data});

// 异步action
export const getCategoriesAsync = (parentId) => {
  return async (dispatch) => {
    // 执行异步操作
    reqCategories(parentId)
      .then((data) => {
        // 成功，调用dispatch(成功action)
        dispatch(getCategoriesSuccess(data));
      })
      .catch((error) => {
        // 失败，调用dispatch(失败action)
        dispatch(categoriesFailed(error));
      })
  }
};

export const addCategoryAsync = (parentId, categoryName) => {
  return async (dispatch) => {
    // 执行异步操作
    reqAddCategory(parentId, categoryName)
      .then((data) => {
        // 成功，调用dispatch(成功action)
        dispatch(addCategorySuccess(data));
      })
      .catch((error) => {
        // 失败，调用dispatch(失败action)
        dispatch(categoriesFailed(error));
      })
  }
};