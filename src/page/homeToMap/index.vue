<template>
  <div class="page">
    <header-back :backStyle="backStyle" :backWord="backWord" :iscenter="iscenter" :goRouterWord="goRouterWord" :isIcon="isIcon"
        @backBtn="backBtngo"
        @goRoute="goRoute"
      ></header-back>
    <div id="container"></div>
    <div class="first-station" v-if="mapList[0]">
      <div class="station-name"><span class="name">{{mapList[0].stationName}}</span><span>{{mapList[0].distance}}米</span></div>
      <div class="station-li" v-for="(item,index) in mapList[0].lineStations" :key="index"  @click="jumpStationList(item)">
       <span class="line-name">{{item.lineName}}</span>
       <span class="line-go">开往:{{item.lastStationName}}</span>
       <span class="line-details">详情</span>
      </div>
    </div>
    <loading :show="showLoading" :text="textLoading"></loading>
  </div>
</template>
<script>
import {setLocalStorage, getLocalStorage} from '@/utils/session.js'
import { mapGetters } from 'vuex'
import { Loading } from 'vux'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import headerBack from '@/components/headerBack/index'
// api
import { nearByMap } from '@/api/home'
// GPS转高德
import {gps84ToGcj02} from '@/utils/debounce.js'
export default {
  name: 'homeToMap',
  components: {headerBack, AMap, AMapUI, Loading},
  data () {
    return {
      // 头部back
      backStyle: 'icon-fanhui', // 返回icon 配置
      backWord: '站点地图', // 头部名称
      iscenter: true, // 头部名称是否居中
      goRouterWord: '', // 头部去往的页面名称
      isIcon: '', // 头部去往的页面名称是icon
      mapList: [], // 地图数据
      showLoading: true,
      textLoading: '加载中',
      latLng: {}
    }
  },
  created () {},
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'lat',
      'lng'
    ])
  },
  mounted () {
    const navigator = getLocalStorage('navigator')
    if (navigator === 'ios') {
      this.backStyle = ''
    }
    this.latLng = getLocalStorage('LatLng')
    this.$wxHide()
    const link = window.location.href.split('#')[0] + '#home'
    const opstion = {
      title: '', // 分享标题
      desc: '', // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '' // 分享图标
    }
    this.$wxShare(opstion)
    const lat = this.lat + '' || (this.latLng ? this.latLng.lat + '' : '')
    const lng = this.lng + '' || (this.latLng ? this.latLng.lng + '' : '')
    this.getMapData(lat, lng)
  },
  methods: {
    // 获取地图数据
    getMapData (lat, lng) {
      // 3.2 地图附近站点查询
      const params = {
        latitude: lat || '34.3412700000', // 纬度
        longitude: lng || '108.9398400000' // 经度
      }
      // 延安：36.5965370000 109.4908100000
      // 西安：34.3412700000 108.9398400000
      nearByMap(params).then(res => {
        if (res && res.length) {
          // GPS转高德
          let a = res.map((item) => {
            let latLngArr = gps84ToGcj02(item.latitude * 1, item.longitude * 1)
            return Object.assign({}, item, {'latitude': latLngArr[0]}, {'longitude': latLngArr[1]})
          })
          this.mapList = a
          this.initMap()
        }
      })
    },
    // 头部返回的事件
    backBtngo () {
      // this.$router.go(-1)
      this.$router.push({name: 'home'})
    },
    // 头部去往其他页面的事件
    goRoute () {},
    // 初始化地图 并且定位+搜索+选点
    initMap () {
      let map = new AMap.Map('container', {
        resizeEnable: true,
        center: [this.lng || (this.latLng ? this.latLng.lng + '' : '') || 108.9398400000, this.lat || (this.latLng ? this.latLng.lat + '' : '') || 34.3412700000], // 地图中心点
        zoom: 15 // 地图显示的缩放级别
      })
      this.showLoading = false
      // 控件 'AMap.ToolBar'集成了缩放、平移、定位等功能,'AMap.Scale'展示地图在当前层级和纬度下的比例尺 AMap.ControlBar 3D 罗盘控制
      AMap.plugin(['AMap.Geolocation'], () => {
        map.addControl(new AMap.Geolocation())
      })
      // 自动获取当前位置
      // map.plugin(['AMap.Geolocation'], function () {
      //   // 加载定位插件，实现定位功能
      //   var geolocation = new AMap.Geolocation({
      //     enableHighAccuracy: true, // 是否使用高精度定位，默认:true
      //     timeout: 10000, // 超过10秒后停止定位，默认：无穷大
      //     maximumAge: 0, // 定位结果缓存0毫秒，默认：0
      //     convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      //     showButton: true, // 显示定位按钮，默认：true
      //     buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
      //     buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      //     showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
      //     showCircle: false, // 定位成功后用圆圈表示定位精度范围，默认：true
      //     panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
      //     zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      //     useNative: true // 是否使用安卓定位sdk用来进行定位
      //   })
      //   map.addControl(geolocation)
      //   geolocation.getCurrentPosition(function (status, result) {
      //     if (status === 'complete') {
      //       onComplete(result)
      //     } else {
      //       onError(result)
      //     }
      //   })
      //   // 解析定位结果
      //   function onComplete (data) {
      //     // console.log('解析定位结果', data)
      //   }
      //   // 解析定位错误信息
      //   function onError (data) {
      //     // console.log('解析定位错误信息', data)
      //   }
      // })
      let markers = []
      this.mapList.forEach((item, index) => {
        const params = {
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
          position: [item.longitude, item.latitude],
          stationName: item.stationName
        }
        markers.push(params)
      })
      // 添加一些分布不均的点到地图上,地图上添加三个点标记，作为参照
      markers.forEach((item) => {
        let marker = new AMap.Marker({
          map: map,
          icon: item.icon,
          position: [item.position[0], item.position[1]],
          offset: new AMap.Pixel(-13, -30)
        })
        // 设置label标签
        // label默认蓝框白底左上角显示，样式className为：amap-marker-label
        marker.setLabel({
        // 修改label相对于maker的位置
          offset: new AMap.Pixel(-30, 33),
          content: item.stationName,
          clickable: true
        })
        marker.on('click', (val) => {
          const str = val.target.Le.label.content
          // 全局缓存站点名称
          this.$store.dispatch('setStationName', str)
          // 本地缓存
          setLocalStorage('stationName', str)
          this.$router.push({name: 'stationList', params: { stationName: str, pageMap: 'homeToMap' }})
        })
      })
      map.add(markers)
    },
    jumpStationList (obj) {
      // 本地缓存线路详情参数
      setLocalStorage('lineParams', obj)
      setLocalStorage('backPageName', 'homeToMap')
      this.$router.push({name: 'lineDetails', params: {lineParams: obj, page: 'homeToMap'}})
    }
  }
}
</script>
<style lang="less" scoped>
.page{
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
#container{
  width: 100%;
  height: 70vh;
}
.first-station{
  background: @bg-white;
  width: 100%;
  height: 23.5vh;
  overflow: auto;
  .station-name{
    margin: .625rem 0rem;
    padding: 0px 15px;
    font-size: @font-size;
    .name{
      color: @color-black;
      font-size: 1rem;
    }
  }
  .station-li{
    border-top: 1px solid #f1f1f1;
    padding: 0px 15px;
    height: 2.2rem;
    line-height: 2.2rem;
    position: relative;
    font-size: @font-size;
    .line-name{
      font-size: 1rem;
      color: @color-black;
    }
    .line-go{
      color: @color-gray;
    }
    .line-details{
      width: 3rem;
      height: 2.2rem;
      position: absolute;
      top:0rem;
      right: 0rem;
      text-align: center;
      line-height: 2.2rem;
      color: @font-color;
    }
  }
}
</style>
