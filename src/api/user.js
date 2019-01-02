import http from '@/utils/http'
/**
 * USER API
 */
// 1.3 微信token获取
export function signAccesstoken (params) {
  return http.post(
    '/wechat/accesstoken/sign',
    params
  )
}
// 1.6 获取网页授权的access_token 和openId
export function tokenAnOpendId (params) {
  return http.get(
    '/api/user/tokenAnOpendId',
    params
  )
}
// 1.7 获取用户基本信息（包括UnionID机制）
export function userInfo (params) {
  return http.post(
    '/api/user/userInfo',
    params
  )
}
