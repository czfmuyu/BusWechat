import axios from 'axios'
import store from '@/store'
import { BASE_PER_FIX_URL } from './baseUrl.js'
// 发送接口的链接前半部分
const basePerfix = BASE_PER_FIX_URL
//  http request 请求拦截器，有token值则配置上token值
// openId, // unionid,
axios.interceptors.request.use(config => {
  // 配置全局请求token
  if (store.getters.token) {
    config.headers['checkCode'] = store.getters.token
    config.headers['deviceId'] = store.getters.token
  }
  if (store.getters.lat && store.getters.lng) {
    config.headers['realLatitude'] = store.getters.lat
    config.headers['realLongitude'] = store.getters.lng
  }
  // 配置Headers其他参数
  config.headers['osType'] = '3'
  config.headers['versionName'] = '1.0.0'
  config.headers['versionCode'] = '1'
  config.headers['deviceBrand'] = 'wechat'
  config.headers['systemVersion'] = '3.5'
  config.headers['channel'] = '100'
  return config
}, error => Promise.reject(error))
// http response 服务器响应拦截器
axios.interceptors.response.use(response => {
  // do sth befor response

  return response
}, error => Promise.reject(error.response))

// check response code
function checkResponseStatus (response) {
  if (response.status === 200 || response.status === 304) {
    return response.data
  }
  return response
}
function cactchError (error) {
  if (error.status === 400 || error.status === 404 || error.status === 500) {
    // return Toast({
    //   message: `服务器访问出错`,
    //   type: 'error',
    //   duration: 5000
    // })
  }
}
// check server response
function checkResponseCode (response) {
  if (response.code * 1 === 0 || response.code * 1 === 1) {
    return response.data || {error: false}
  } else if (response.code * 1 === 2 || response.code * 1 === 3) {
    return this.$vux.toast.text('参数有误', 'top')
  } else {
    return this.$vux.toast.text('异常情况', 'top')
  }
}
/*
 * 这里定义的接口都应该符合RESTFul规范
*/
export default {
  // normal method
  get (url, params) {
    if (!url) return
    return axios.get(basePerfix + url, params)
      .then(checkResponseStatus)
      .then(checkResponseCode)
      .catch(cactchError)
  },
  // post request
  post (url, data) {
    if (!url) return
    return axios.post(basePerfix + url, data)
      .then(checkResponseStatus)
      .then(checkResponseCode)
      .catch(cactchError)
  },
  // update request for All data
  put (url, data) {
  },
  // update request path data
  patch (url, data) {
  },
  // delete request
  delete (url, data) {
  },
  // head
  head (url, data) {
  }
}
