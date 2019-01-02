import http from '@/utils/http'
/**
 * USER API
 */

/**
 * 用户登录
 *
 * @export
 * @param {any} params
 * @returns
 */
// 3.1 首页附近站点查询
export function nearByStation (params) {
  return http.post(
    '/line/station/nearby',
    params
  )
}

// 3.2 地图附近站点查询
export function nearByMap (params) {
  return http.post(
    '/line/map/nearby',
    params
  )
}
// 3.3 获取多条线路的最近两辆车辆到站情况
export function lineStationPosition (params) {
  return http.post(
    '/line/bus/lineStationPosition',
    params
  )
}
// 3.4 获取线路的基础数据
export function infoBasic (params) {
  return http.post(
    '/line/basic/info',
    params
  )
}

// 3.5 线路上车辆运行位置
export function positionBus (params) {
  return http.post(
    '/line/bus/position',
    params
  )
}
