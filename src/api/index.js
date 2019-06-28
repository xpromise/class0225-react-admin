import jsonp from 'jsonp';
import { message } from 'antd';
import ajax from './ajax';

// export const reqLogin = (data) => ajax('/login', data, 'POST');
// 请求参数3-4个以上使用
// export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST');
// 请求参数1-2个使用
/**
 * 请求登录函数
 * @param username 用户名
 * @param password 密码
 * @returns {返回值一定成功状态promise（请求成功里面有数据，请求失败里面没有）}
 */
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');

/**
 * 请求验证用户信息
 * @param id
 * @returns {返回值一定成功状态promise（请求成功里面有数据，请求失败里面没有）}
 */
export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');

/**
 * 请求天气
 * @returns {Promise<any>}
 */
export const reqWeather = function () {
  let cancel = null;
  const promise = new Promise((resolve, reject) => {
    cancel = jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`, {}, function (err, data) {
      try {
        if (!err) {
          const { dayPictureUrl, weather } = data.results[0].weather_data[0];
          resolve({
            weatherImg: dayPictureUrl,
            weather
          });
        } else {
          message.error('请求天气信息失败~请刷新试试~');
          resolve();
        }
      } catch (e) {
        message.error('请求天气信息失败~请刷新试试~');
        resolve();
      }
    });
  });

  return {
    promise,
    cancel
  }
};

export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId});

export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST');

export const reqUpdateCategoryName = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST');

export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize});

export const reqAddProduct = ({name, desc, price, categoryId, pCategoryId, detail}) => ajax('/manage/product/add', {name, desc, price, categoryId, pCategoryId, detail}, 'POST');

export const reqUpdateProduct = ({name, desc, price, categoryId, pCategoryId, detail, _id}) => ajax('/manage/product/update', {name, desc, price, categoryId, pCategoryId, detail, _id}, 'POST');

export const reqDeleteProductImg = (name, id) => ajax('/manage/img/delete', {name, id}, 'POST');

export const reqSearchProduct = ({searchType, searchContent, pageSize, pageNum}) => ajax('/manage/product/search', {[searchType]: searchContent, pageSize, pageNum});

export const reqUpdateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST');

export const reqGetRoles = () => ajax('/manage/role/list');

export const reqAddRole = (name) => ajax('/manage/role/add', {name}, 'POST');

export const reqUpdateRole = (_id, auth_name, menus) => ajax('/manage/role/update', {_id, auth_name, menus: JSON.stringify(menus)}, 'POST');