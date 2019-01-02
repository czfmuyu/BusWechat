/**
 * tabbar STORE
 */
const station = {
  state: {
    upStation: {},
    downStation: {},
    stationName: '' // 站点列表的参数
  },
  mutations: {
    STORAGE_UPSTATION (state, data) {
      state.upStation = data
    },
    STORAGE_DOWNSTATION (state, data) {
      state.downStation = data
    },
    SET_STATIONNAME (state, data) {
      state.stationName = data
    }
  },
  actions: {
    /**
     * @param {any} {commit}
     */
    storageUpStation ({commit, state}, params) {
      commit('STORAGE_UPSTATION', params)
    },
    storageDownStation ({commit, state}, params) {
      commit('STORAGE_DOWNSTATION', params)
    },
    setStationName ({commit, state}, params) {
      commit('SET_STATIONNAME', params)
    }

  }

}
export default station
