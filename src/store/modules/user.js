// 获取token文件的func
import { getToken, setToken, removeToken } from '@/utils/auth'
// 获取Api 用户分享
// import { signAccesstoken, userInfo } from '@/api/user'
/**
 * User STORE
 */

const user = {
  state: {
    token: getToken(),
    openId: '',
    unionid: '',
    nickname: '',
    location: '',
    lng: '',
    lat: ''
  },
  mutations: {
    // 设置token
    SET_TOKEN (state, token) {
      if (token) {
        state.token = token
        setToken(token)
      }
    },
    // 移除token
    REMOVE_TOKEN (state, data) {
      state.token = null
      removeToken()
    },
    // 设置经纬度
    SET_LATLNG (state, data) {
      state.lng = data.lng
      state.lat = data.lat
    },
    // 设置openid和unionid
    SET_OPENID (state, data) {
      state.openId = data.openId
      state.unionid = data.unionid
    }
  },
  actions: {
    /**
     * 用户授权
     * 需要通过mutation在浏览器中创建Token cookie保证一定的授权实效性;
     *
     * @param {any} {commit}
     * @param {any} params
     * @returns
     */
    // userAuthorization ({commit, state}, params) {
    //   return new Promise((resolve, reject) => {
    //     // 用户签名Api
    //     signAccesstoken(params)
    //       .then(res => {
    //         // 存储Token 和config mutations：设置token
    //         commit('SET_TOKEN', res.accessToken)
    //         commit('SET_CONFIG', res)
    //         resolve(res)
    //       }).catch(err => {
    //         reject(err)
    //       })
    //   })
    // },
    // 保存token
    getaccessToken ({commit, state}, token) {
      commit('SET_TOKEN', token)
    },
    // 获取经纬度
    getLatLng ({commit, state}, params) {
      commit('SET_LATLNG', params)
    }
    /**
     * 获取用户信息
     * 返回当前用户的基础信息
     *
     * @param {any} {commit}
     * @param {any} params
     * @returns
     */
    // getUserInfo ({commit, state}, params) {
    //   return new Promise((resolve, reject) => {
    //     // 用户信息Api
    //     userInfo(params)
    //       .then(res => {
    //         // 提交用户信息
    //         commit('SET_OPENID', res)
    //         resolve(res)
    //       }).catch(err => {
    //         reject(err)
    //       })
    //   })
    // }
  }

}
export default user
