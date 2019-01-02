<template>
  <div class="line-box">
    <header-back class="header-back" :backStyle="backStyle" :backWord="backWord" :iscenter="iscenter" :goRouterWord="goRouterWord" :isIcon="isIcon"
      @backBtn="backBtngo"
      @goRoute="goRoute"
    ></header-back>
    <search :startStation.sync="startStation" :endStation.sync="endStation" @searchStation="searchStation" @changeStation="changeStation" @selectBus="selectBus"></search>
    <div id="container"></div>
    <div class="line-list">
      <div id="routeInfo" ref="panel"></div>
    </div>
    <popup-picker class="picker" :show="isShow"  :data="list" v-model="value" @on-hide="handlePicker" ></popup-picker>
  </div>
</template>
<script>
import { PopupPicker } from 'vux'
import {getLocalStorage} from '@/utils/session.js'
import { mapGetters } from 'vuex'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import headerBack from '@/components/headerBack/index'
import Search from './Components/Search/index'
export default {
  name: 'mapSearchLine',
  components: {headerBack, Search, AMap, AMapUI, PopupPicker},
  data () {
    return {
      startStation: { // 搜索返回的开始站点
        name: '',
        address: '',
        lat: '',
        lng: ''
      },
      endStation: { // 搜索返回的结束站点
        name: '',
        address: '',
        lat: '',
        lng: ''
      },
      // 头部back
      backStyle: 'icon-48copy17-copy', // 返回icon 配置
      backWord: '搜索列表', // 头部名称
      iscenter: true, // 头部名称是否居中
      goRouterWord: '', // 头部去往的页面名称
      isIcon: '', // 头部去往的页面名称是icon
      map: null, // 高德地图
      transferPolicyStr: 5,
      isShow: false,
      list: [['最经济模式', '最快捷模式', '最少换乘模式']],
      // listbus: ['NO_SUBWAY', 'LEAST_TIME', 'LEAST_FEE', 'LEAST_TRANSFER', 'LEAST_WALK', 'MOST_COMFORT'],
      listbus: [5, 0, 2],
      value: ['最经济模式']
    }
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'upStation',
      'downStation'
    ])
  },
  created () {
    this.getSearchStation()
  },
  mounted () {
    this.$wxHide()
    const navigator = getLocalStorage('navigator')
    if (navigator === 'ios') {
      this.backStyle = ''
    }
    const link = window.location.href.split('#')[0] + '#home'
    const url = window.location.href
    const opstion = {
      title: '地图导航', // 分享标题
      desc: url, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '' // 分享图标
    }
    this.$wxShare(opstion)
    this.initMap()
  },
  methods: {
    // 获取其他页面的数据
    async getSearchStation () {
      const upStation = this.$route.params.startStation
      const downStation = this.$route.params.endStation
      let backParams = this.$route.params.backSearchObj
      if (backParams) {
        if (backParams.type === 'up') {
          // 上车点
          this.startStation.name = backParams.name || this.upStation.name
          this.startStation.address = backParams.address || this.upStation.address
          this.startStation.lat = backParams.lat || this.upStation.lat
          this.startStation.lng = backParams.lng || this.upStation.lng
          // 下车点
          this.endStation.name = this.downStation.name
          this.endStation.address = this.downStation.address
          this.endStation.lat = this.downStation.lat
          this.endStation.lng = this.downStation.lng
        } else if (backParams.type === 'down') {
          // 上车点
          this.startStation.name = this.upStation.name
          this.startStation.address = this.upStation.address
          this.startStation.lat = this.upStation.lat
          this.startStation.lng = this.upStation.lng
          // 下车点
          this.endStation.name = backParams.name || this.downStation.name
          this.endStation.address = backParams.address || this.downStation.address
          this.endStation.lat = backParams.lat || this.downStation.lat
          this.endStation.lng = backParams.lng || this.downStation.lng
        }
      } else {
        // 上车点
        this.startStation.name = upStation.name
        this.startStation.address = upStation.address
        this.startStation.lat = upStation.lat
        this.startStation.lng = upStation.lng
        // 下车点
        this.endStation.name = downStation.name
        this.endStation.address = downStation.address
        this.endStation.lat = downStation.lat
        this.endStation.lng = downStation.lng
      }
    },
    // 初始化地图
    initMap () {
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 14 // 地图显示的缩放级别
      })
      this.busList()
    },
    // 头部返回的事件
    backBtngo () {
      // 清空缓存的全局数据
      const upParams = {
        type: '',
        name: '我的位置',
        address: '',
        lat: '',
        lng: ''
      }
      const downParams = {
        type: '',
        name: '你要去哪里？',
        address: '',
        lat: '',
        lng: ''
      }
      this.$store.dispatch('storageUpStation', upParams)
      this.$store.dispatch('storageDownStation', downParams)
      this.$router.push({name: 'lineGuide'})
    },
    // 头部去往其他页面的事件
    goRoute () {
    },
    // 二次搜索
    searchStation (val) {
      this.$router.push({name: 'searchStation', params: {type: val, backpage: 'mapSearchLine'}})
    },
    // 选择其他出行方式
    selectBus () {
      this.isShow = true
    },
    handlePicker (val) {
      this.isShow = false
      if (val) {
        for (var i = 0; i < this.list[0].length; i++) {
          if (this.list[0][i] === this.value[0]) {
            this.transferPolicyStr = this.listbus[i]
            // 销毁地图和清空元素
            this.map.destroy()
            this.$refs.panel.innerHTML = ''
            // 重新拉去地图数据
            this.initMap()
          }
        }
      }
    },
    // 公交出行路线
    busList () {
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.ControlBar', 'AMap.Geolocation', 'AMap.Transfer'], () => {
        // this.map.addControl(new AMap.ToolBar())
        // this.map.addControl(new AMap.Scale())
        // this.map.addControl(new AMap.ControlBar())
        this.map.addControl(new AMap.Geolocation())
        const TransferOptions = {
          city: '西安', // 公交换乘的城市，支持城市名称、城市区号、电话区号，此项为必填
          policy: this.transferPolicyStr, // 公交换乘策略 TransferPolicy 对象
          nightflag: false, // 是否计算夜班车，默认为不计算 true：计算，false：不计算
          extensions: 'all', // 返回结果控制可选值：base/all base:返回基本信息 all:返回全部信息 默认值 ：base
          map: this.map, // AMap.Map对象, 展现结果的地图实例。当指定此参数后，搜索结果的标注、线路等均会自动添加到此地图上。可选参数
          panel: 'routeInfo', // 结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示。可选参数
          hideMarkers: false, // 设置隐藏路径规划的起始点图标，设置为true：隐藏图标；设置false：显示图标 默认值为：false
          autoFitView: true // 用于控制在路径规划结束后，是否自动调整地图视野使绘制的路线处于视口的可见范围
        }
        // 构造公交换乘类
        let transfer = new AMap.Transfer(TransferOptions)
        // 根据起、终点坐标查询公交换乘路线,使用父组件传入的起终点经纬度
        transfer.search(new AMap.LngLat(this.startStation.lng, this.startStation.lat), new AMap.LngLat(this.endStation.lng, this.endStation.lat))
        // 返回出行方式信息
        AMap.event.addListener(transfer, 'complete', (res) => {
          // console.log('complete', res)
        })
        // 返回出行方式信息出错信息
        AMap.event.addListener(transfer, 'error', (err) => {
          console.log(err)
        })
      })
    },
    // 自行车出行路线
    bikeList () {

    },
    // 地铁出行路线
    subwayList () {

    },
    // 切换站点
    changeStation (startStation, endStation) {
      if (startStation.lat && startStation.lng && endStation.lat && endStation.lng) {
        this.changeHandle(startStation, endStation)
      } else {
        console.log('无数据')
      }
    },
    // 切换站点handle
    changeHandle (startStation, endStation) {
      // 起点信息
      let startStationName = startStation.name
      let startStationAddress = startStation.address
      let startStationLat = startStation.lat
      let startStationLng = startStation.lng
      // 终点信息
      let endStationName = endStation.name
      let endStationAddress = endStation.address
      let endStationLat = endStation.lat
      let endStationLng = endStation.lng
      // 切换站点后
      this.startStation.name = endStationName
      this.startStation.address = endStationAddress
      this.startStation.lat = endStationLat
      this.startStation.lng = endStationLng

      this.endStation.name = startStationName
      this.endStation.address = startStationAddress
      this.endStation.lat = startStationLat
      this.endStation.lng = startStationLng
      // 设置全局搜索返回的站点信息
      const upParams = {
        type: 'up',
        name: this.startStation.name,
        address: this.startStation.address,
        lat: this.startStation.lat,
        lng: this.startStation.lng
      }
      const downParams = {
        type: 'down',
        name: this.endStation.name,
        address: this.endStation.address,
        lat: this.endStation.lat,
        lng: this.endStation.lng
      }
      this.$store.dispatch('storageUpStation', upParams)
      this.$store.dispatch('storageDownStation', downParams)
      // 销毁地图和清空元素
      this.map.destroy()
      this.$refs.panel.innerHTML = ''
      // 重新拉去地图数据
      this.initMap()
    }

  }
}
</script>
<style lang="less" scoped>
.line-box{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .header-back {
    border-bottom: 1px solid #dddddd;
  }
  #container {
    width: 100%;
    height: 50vh;
    overflow: hidden;
  }
  #routeInfo{
    width: 100%;
    height: 34vh;
    overflow: auto;
  }
  .picker {
    width: 1px;
    height: 1px;
    overflow: hidden;
    background: #ffffff;
    position: absolute;
    top: 4rem;
    right: 8%;
    z-index: 100;
  }
}

</style>
