const getters = {
  // 用户信息
  token: state => state.user.token,
  openId: state => state.user.openId,
  unionid: state => state.user.unionid,
  nickname: state => state.user.nickname,
  location: state => state.user.location,
  lng: state => state.user.lng,
  lat: state => state.user.lat,
  // 搜索起始站点
  upStation: state => state.station.upStation,
  downStation: state => state.station.downStation,
  stationName: state => state.station.stationName
}
export default getters
