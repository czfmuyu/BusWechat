import http from '@/utils/http'
/**
 *
 *
 * @export
 * @param {any} params
 * @returns
 */
// 2.1 基础数据关键字库
export function libBasic (params) {
  return http.post(
    '/search/basic/lib',
    params
  )
}

// 2.2 精确查找线路
export function lineAccurate (params) {
  return http.post(
    '/search/accurate/line',
    params
  )
}
// 2.3 精确查找站点
export function stationAccurate (params) {
  return http.post(
    '/search/accurate/station',
    params
  )
}

// 2.4 模糊查找线路站点信息
export function keywordVague (params) {
  return http.post(
    '/search/vague/keyword',
    params
  )
}
// 2.5 站点换向
export function exchangeAccurate (params) {
  return http.post(
    '/search/accurate/exchange',
    params
  )
}
