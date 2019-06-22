import axios from 'axios';
import { message } from "antd";


/**
 * 统一处理错误响应结果
 *
 * @param url
 * @param data
 * @param method
 * @returns 返回值一定成功状态promise（请求成功里面有数据，请求失败里面没有）
 */
export default function ajax(url, data = {}, method = 'get') {
  // 初始化请求参数
  let reqParams = data;
  // 转化为小写，在进行比较
  method = method.toLowerCase();

  if (method === 'get') {
    reqParams = {
      params: data
    }
  }

  // 将后面表达式整体结果返回
  // 后面表达式结果看then/catch返回值
  return axios[method](url, reqParams)
    .then((res) => {
      const { data } = res;

      if (data.status === 0) {
        return data.data;
      } else {
        // 请求失败。给用户提示错误信息
        message.error(data.msg, 2);
      }
    })
    .catch((err) => {
      // 请求失败：网络错误、服务器内部错误等
      message.error('网络出现异常，请刷新重试~', 2);
    })
}