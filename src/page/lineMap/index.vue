<template>
  <div class="page" id="mapLine">
    <header-back :backStyle="backStyle" :backWord="backWord" :iscenter="iscenter" :goRouterWord="goRouterWord" :isIcon="isIcon"
        @backBtn="backBtngo"
        @goRoute="goRoute"
    ></header-back>
    <div id="container"></div>
    <div class="line-bas">
       <div class="line-derection">
         <div class="station-name">
           <span>{{linedata.firstStationName}}</span>
           <span class="iconfont icon-jiang-copy"></span>
           <span>{{linedata.lastStationName}}</span>
         </div>
         <div class="station-change iconfont icon-yulanxuanzhuan" @click="pullData"></div>
       </div>
       <div class="line-basic-info">
         <span>全程{{linedata.omnidistance}}公里</span>
         <span>票价:{{linedata.basicPrice}}</span>
         <span>首班{{linedata.firstBusTime}} 末班{{linedata.lastBusTime}}</span>
       </div>
       <div class="tow-station">
          <div class="station-left" v-if="towStationList[0] && towStationList[0].busPosition.length !== 0">
            <div class="tow-left" v-if="towStationList[0].busPosition[0].status * 1 !== 0 && towStationList[0].busPosition[0].distance * 1 > 200">
              <div>最近一趟</div>
              <div v-if="towStationList[0].busPosition[0].distance * 1 < 1000">{{towStationList[0].busPosition[0].distance}}米</div>
              <div v-if="towStationList[0].busPosition[0].distance * 1 > 1000">{{(towStationList[0].busPosition[0].distance * 1 / 1000).toFixed(1)}}公里</div>
            </div>
            <div class="tow-right" v-if="towStationList[0].busPosition[0].status * 1 !== 0 && towStationList[0].busPosition[0].distance * 1 > 200">
              <div class="station-num">
                  <span class="num-line" v-if="towStationList[0].busPosition[0].seq">{{currentStationNum - towStationList[0].busPosition[0].seq}}</span>
                  <span class="num-icon">
                    <div class="iconfont icon-status_wifi"></div>
                    <div>站</div>
                  </span>
              </div>
            </div>
            <div v-if="towStationList[0].busPosition[0].status * 1 !== 0 && towStationList[0].busPosition[0].distance * 1 < 200 && towStationList[0].busPosition[0].distance * 1 > 50" class="current-station">
              即将到站
            </div>
            <div v-if="towStationList[0].busPosition[0].status * 1 !== 0 && towStationList[0].busPosition[0].distance * 1 < 50 && towStationList[0].busPosition[0].distance * 1 >= 0" class="current-station">
              已到站
            </div>
            <div class="no-data" v-if="towStationList[0].busPosition[0].status * 1 === 0">
                <div>--</div>
            </div>
          </div>
          <div class="station-right" v-if="towStationList[0] && towStationList[0].busPosition.length > 1">
            <div class="tow-left" v-if="towStationList[0].busPosition[1].status * 1 !== 0 && towStationList[0].busPosition[1].distance * 1 > 200">
              <div>第二趟</div>
              <div v-if="towStationList[0].busPosition[1].distance* 1 < 1000">{{towStationList[0].busPosition[1].distance}}米</div>
              <div v-if="towStationList[0].busPosition[1].distance * 1 > 1000">{{(towStationList[0].busPosition[1].distance * 1 / 1000).toFixed(1)}}公里</div>
            </div>
            <div class="tow-right" v-if="towStationList[0].busPosition[1].status * 1 !== 0 && towStationList[0].busPosition[1].distance * 1 > 200">
              <div class="station-num">
                  <span class="num-line" v-if="towStationList[0].busPosition[1].seq">{{currentStationNum- towStationList[0].busPosition[1].seq}}</span>
                  <span class="num-icon">
                    <div class="iconfont icon-status_wifi"></div>
                    <div>站</div>
                  </span>
              </div>
            </div>
            <div v-if="towStationList[0].busPosition[1].status * 1 !== 0 && towStationList[0].busPosition[1].distance * 1 < 200 && towStationList[0].busPosition[1].distance * 1 > 50" class="current-station">
               即将到站
            </div>
            <div v-if="towStationList[0].busPosition[1].status * 1 !== 0 && towStationList[0].busPosition[1].distance * 1 < 50 && towStationList[0].busPosition[1].distance * 1 >= 0" class="current-station">
               已到站
            </div>
            <div class="no-data" v-if="towStationList[0].busPosition[1].status * 1 === 0">
               <div>--</div>
            </div>
          </div>
       </div>
    </div>
    <loading :show="showLoading" :text="textLoading"></loading>
     <toast v-model="showPositionValue" type="text" :time="2000"  :text="toastText" :position="position"></toast>
  </div>
</template>
<script>
import {getLocalStorage} from '@/utils/session.js'
import { Loading, Toast } from 'vux'
import { mapGetters } from 'vuex'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import headerBack from '@/components/headerBack/index'
// api
import {infoBasic, positionBus, lineStationPosition} from '@/api/home'
// 解密 + GPS转高德
import {decodeBusSeq, decodeLatLng, gps84ToGcj02} from '@/utils/debounce.js'
import imgbus from '@/assets/images/bus-map.png'
export default {
  name: 'lineMap',
  components: {headerBack, AMap, AMapUI, Loading, Toast},
  data () {
    return {
      // 头部back
      backStyle: 'icon-fanhui', // 返回icon 配置
      backWord: '地图详情', // 头部名称
      iscenter: true, // 头部名称是否居中
      goRouterWord: '', // 头部去往的页面名称
      isIcon: 'icon-fanhuishouye', // 头部去往的页面名称是icon
      lineparams: {}, // 页面传递过来的数据
      currentStationNum: null,
      lineStationId: '', // 上下行线路id
      page: '',
      stationName: '',
      linedata: {}, // 线路的数据
      towStationList: [], // 下两站的信息
      postionbusdata: [], // 车辆的数据
      map: null,
      timerfirst: null,
      showLoading: true,
      textLoading: '加载中',
      showPositionValue: false, // 是否显示提示
      position: 'center', // 提示信息的位置
      toastText: '', // 提示文本
      currentStationParams: {}, // 选中站点的信息
      busmarker: [],
      buscircle: [],
      bustext: []
    }
  },
  created () {
    this.getLineParans()
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'lat',
      'lng'
    ])
  },
  mounted () {
    this.$wxHide()
    const navigator = getLocalStorage('navigator')
    if (navigator === 'ios') {
      this.backStyle = ''
    }
    this.currentStationNum = this.currentStationParams.seq
    const link = window.location.href.split('#')[0] + '#home'
    const opstion = {
      title: '地图详情', // 分享标题
      desc: link, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '' // 分享图标
    }
    this.$wxShare(opstion)
    if (this.timerfirst) {
      clearInterval(this.timerfirst)
    }
    // 获取线路的数据
    this.getLineData(this.lineparams.lineId, this.lineparams.lineType)
    // 获取车的实时位置
    this.getpositionBus(this.lineparams.lineId, this.lineparams.lineType)
    // 初始化地图
    this.initMap()
    // 计时器
    // this.openSetInterval(this.lineparams.lineId, this.lineparams.lineType)
  },
  methods: {
    // 获取其他页面的数据
    async getLineParans () {
      const lineParams = getLocalStorage('mapParams')
      const currentStationParams = this.$route.params.currentStationParams || getLocalStorage('currentStationParams')
      const currentLine = this.$route.params.lineParams || lineParams
      this.page = this.$route.params.page
      this.stationName = this.$route.params.stationName
      // GPS转高德
      let latLngArr = gps84ToGcj02(currentStationParams.latitude * 1, currentStationParams.longitude * 1)
      this.currentStationParams = Object.assign({}, currentStationParams, {'latitude': latLngArr[0]}, {'longitude': latLngArr[1]})
      this.lineparams = Object.assign({}, currentLine, {'seq': currentStationParams.seq})
    },
    // 功能：将浮点数四舍五入，取小数点后2位
    toDecimal (x) {
      var f = parseFloat(x)
      if (isNaN(f)) {
        return
      }
      f = (Math.round(x * 10000000) / 10000000)
      return f
    },
    // 头部返回的事件
    backBtngo () {
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      this.$router.push({name: 'lineDetails', params: {lineParams: this.lineparams, page: this.page, stationName: this.stationName}})
    },
    // 头部去往其他页面的事件
    goRoute () {
      // 回首页
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      this.$router.push({name: 'home'})
    },
    // 获取线路的数据
    getLineData (lineId, lineType) {
      const params = {
        lineId: lineId || this.lineparams.lineId, // 线路id
        lineType: lineType || this.lineparams.lineType // 线路上下行
      }
      // 3.4 获取线路的基础数据
      infoBasic(params).then(res => {
        if (res) {
          this.showLoading = false
          this.linedata = res
          this.backWord = res.lineName + '详情'
          // 绘制线路
          this.drawLine(res)
          // 绘制站点
          this.drawStation(res)
          // 插入起始站点
          this.markerUpandDown(res)
          // 插入文本
          this.markerText(res)
          // 获取下两趟的数据u
          if (res.busStations && res.busStations.length) {
            res.busStations.forEach((item) => {
              // GPS转高德
              let latLngArr = gps84ToGcj02(item.latitude * 1, item.longitude * 1)
              if (latLngArr[0] === this.currentStationParams.latitude * 1 && latLngArr[1] === this.currentStationParams.longitude * 1) {
                // 获取下两趟的数据u
                this.currentStationNum = item.seq
                this.lineStationId = item.lineStationId
                this.getTowStaionInfo(lineId, lineType, item.lineStationId)
              }
            })
          }
        }
      })
    },
    // 获取下两趟的数据u
    getTowStaionInfo (lineId, lineType, lineStationId) {
      const params = [{
        lineId: lineId || this.lineparams.lineId, // 线路id
        lineType: lineType || this.lineparams.lineType, // 线路上下行
        lineStationId: lineStationId || this.currentStationParams.lineStationId
      }]
      // 3.3 获取多条线路的最近两辆车辆到站情况
      lineStationPosition(params).then(res => {
        if (res && res.length) {
          this.towStationList = res
        }
      })
    },
    // 获取车的实时位置
    getpositionBus (lineId, lineType) {
      const params = {
        lineId: lineId || this.lineparams.lineId, // 线路id
        lineType: lineType || this.lineparams.lineType // 线路上下行
      }
      positionBus(params).then(res => {
        if (res && res.length) {
          let a = res.map((item) => {
            // 解析站序 和 经纬度
            let seq = decodeBusSeq(item.seq)
            let lat = decodeLatLng(item.latitude)
            let lng = decodeLatLng(item.longitude)
            // GPS转高德
            let latLngArr = gps84ToGcj02(lat, lng)
            return Object.assign({}, item, {'seq': seq + ''}, {'latitude': latLngArr[0]}, {'longitude': latLngArr[1]})
            // decodeBusSeq(item.seq)
            // decodeLatLng(item.latitude)
            // decodeLatLng(item.longitude)
            // let latLngArr = gps84ToGcj02(item.latitude, item.longitude)
            // return Object.assign({}, item, {'latitude': latLngArr[0]}, {'longitude': latLngArr[1]})
          })
          this.postionbusdata = a
          // 插入小车
          this.markerBus(a)
        }
      })
    },
    // 初始化地图
    initMap () {
      let lat = this.currentStationParams.latitude
      let lng = this.currentStationParams.longitude
      let latLngArr = gps84ToGcj02(lat * 1, lng * 1)
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: [latLngArr[1] || this.lng || 108.9398400000, latLngArr[0] || this.lat || 34.3412700000], // 地图中心点
        zoom: 15 // 地图显示的缩放级别
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation'], () => {
        this.map.addControl(new AMap.Geolocation())
      })
    },
    // 绘制线路
    drawLine (res) {
      var path = []
      if (res.trace && res.trace.length) {
        res.trace.forEach(item => {
          // GPS转高德
          let latLngArr = gps84ToGcj02(item.latitude * 1, item.longitude * 1)
          path.push([latLngArr[1], latLngArr[0]])
        })
        var polyline = new AMap.Polyline({
          path: path,
          isOutline: true,
          outlineColor: '#409EFF',
          borderWeight: 3,
          strokeColor: '#409EFF',
          strokeOpacity: 1,
          strokeWeight: 3,
          // 折线样式还支持 'dashed'
          strokeStyle: 'solid',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 10,
          showDir: true
        })
        polyline.setMap(this.map)
        // 缩放地图到合适的视野级别
        // this.map.setFitView([ polyline ])
      }
    },
    // 绘制站点
    drawStation (res) {
      // 清除上次的圆
      if (this.buscircle && this.buscircle.length) {
        this.buscircle.forEach(item => {
          this.map.remove(item)
        })
      }
      var path = []
      if (res.busStations && res.busStations.length) {
        res.busStations.forEach(item => {
          // GPS转高德
          let latLngArr = gps84ToGcj02(item.latitude * 1, item.longitude * 1)
          path.push([latLngArr[1], latLngArr[0]])
        })
        let lat = this.currentStationParams.latitude
        let lng = this.currentStationParams.longitude
        // let currentlatLngArr = gps84ToGcj02(lat * 1, lng * 1)
        path.map(item => {
          if (item[0] * 1 === lng * 1 && item[1] === lat * 1) {
            // 当前选中的站点
            let circle = new AMap.CircleMarker({
              map: this.map,
              zIndex: 20,
              center: [item[0], item[1]],
              radius: 10, // 半径
              fillColor: '#ffffff',
              strokeWeight: 4,
              strokeColor: '#25E32F'
            })
            circle.setMap(this.map)
            circle.on('click', (val) => {
              let latLng = circle.getCenter()
              this.currentStationParams = Object.assign({}, this.currentStationParams, {'latitude': latLng.P}, {'longitude': this.toDecimal(latLng.R)})
              this.resetStation()
            })
            this.buscircle.push(circle)
          } else {
            // 其他的站点
            let circle = new AMap.CircleMarker({
              map: this.map,
              zIndex: 20,
              center: [item[0], item[1]],
              radius: 5, // 半径
              fillColor: '#ffffff',
              strokeWeight: 4,
              strokeColor: '#DE1FDB'
            })
            circle.setMap(this.map)
            circle.on('click', (val) => {
              let latLng = circle.getCenter()
              this.currentStationParams = Object.assign({}, this.currentStationParams, {'latitude': latLng.P}, {'longitude': this.toDecimal(latLng.R)})
              this.resetStation()
            })
            this.buscircle.push(circle)
          }
        })
      }
    },
    // 插入文本
    markerText (res) {
      // 清除上次的文本
      if (this.bustext && this.bustext.length) {
        this.bustext.forEach(item => {
          this.map.remove(item)
        })
      }
      var path = []
      if (res.busStations && res.busStations.length) {
        res.busStations.forEach(item => {
          // GPS转高德
          let latLngArr = gps84ToGcj02(item.latitude * 1, item.longitude * 1)
          path.push([latLngArr[1], latLngArr[0], item.stationName])
        })
        let lat = this.currentStationParams.latitude
        let lng = this.currentStationParams.longitude
        // let currentlatLngArr = gps84ToGcj02(lat, lng)
        path.map(item => {
          if (item[0] * 1 === lng * 1 && item[1] === lat * 1) {
            // 当前选中的站点
            let text = new AMap.Text({
              map: this.map,
              text: item[2],
              position: [item[0], item[1]],
              textAlign: 'center', // 'left' 'right', 'center',
              verticalAlign: 'middle', // middle 、bottom
              offset: new AMap.Pixel(0, 25),
              cursor: 'pointer',
              zIndex: 20,
              autoRotation: true, // 是否自动旋转。
              clickable: true,
              style: {
                'padding': '0.2rem 0.5rem',
                'margin-bottom': '0.3rem',
                'border-radius': '.25rem',
                'background-color': '#28b0ec',
                'max-width': '10rem',
                'border-width': 0,
                'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '12px',
                'color': '#ffffff'
              }
            })
            text.setMap(this.map)
            text.on('click', (val) => {
              let latLng = text.getPosition()
              this.currentStationParams = Object.assign({}, this.currentStationParams, {'latitude': latLng.P}, {'longitude': this.toDecimal(latLng.R)})
              this.resetStation()
            })
            this.bustext.push(text)
          } else {
            // 其他站点
            let text = new AMap.Text({
              map: this.map,
              text: item[2],
              position: [item[0], item[1]],
              textAlign: 'center', // 'left' 'right', 'center',
              verticalAlign: 'middle', // middle 、bottom
              offset: new AMap.Pixel(0, 20),
              cursor: 'pointer',
              zIndex: 20,
              autoRotation: true, // 是否自动旋转。
              clickable: true,
              style: {
                'padding': '0.2rem 0.5rem',
                'margin-bottom': '0.3rem',
                'border-radius': '.25rem',
                'background-color': '#ffffff',
                'max-width': '10rem',
                'border-width': 0,
                'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '12px',
                'color': '#000000'
              }
            })
            text.setMap(this.map)
            text.on('click', (val) => {
              let latLng = text.getPosition()
              this.currentStationParams = Object.assign({}, this.currentStationParams, {'latitude': latLng.P}, {'longitude': this.toDecimal(latLng.R)})
              this.resetStation()
            })
            this.bustext.push(text)
          }
        })
      }
    },
    // 插入起始站点
    markerUpandDown (res) {
      if (res.busStations && res.busStations.length) {
        const up = res.busStations[0]
        const down = res.busStations[res.busStations.length - 1]
        // GPS转高德
        let latLngArrup = gps84ToGcj02(up.latitude * 1, up.longitude * 1)
        // GPS转高德
        let latLngArrdown = gps84ToGcj02(down.latitude * 1, down.longitude * 1)
        let markerup = new AMap.Marker({
          icon: '//webapi.amap.com/theme/v1.3/markers/n/start.png',
          position: [latLngArrup[1], latLngArrup[0]],
          offset: new AMap.Pixel(-13, -30)
        })
        let markerdown = new AMap.Marker({
          icon: '//webapi.amap.com/theme/v1.3/markers/n/end.png',
          position: [latLngArrdown[1], latLngArrdown[0]],
          offset: new AMap.Pixel(-13, -30)
        })
        markerup.setMap(this.map)
        markerdown.setMap(this.map)
      }
    },
    // 插入小车
    markerBus (res) {
      // 清除上次的小车
      if (this.busmarker && this.busmarker.length) {
        this.busmarker.forEach(item => {
          this.map.remove(item)
        })
      }
      // 渲染小车
      if (res && res.length) {
        let startIcon = new AMap.Icon({
          size: new AMap.Size(20, 20),
          image: imgbus,
          imageSize: new AMap.Size(20, 20),
          imageOffset: new AMap.Pixel(0, 0)
        })
        res.forEach((item) => {
          let marker = new AMap.Marker({
            map: this.map,
            icon: startIcon,
            position: [item.longitude, item.latitude],
            offset: new AMap.Pixel(-10, -10),
            autoRotation: true
          })
          // 设置label标签
          // marker.setLabel({
          //   offset: new AMap.Pixel(-65, -20),
          //   content: item.busNum,
          //   clickable: true
          // })
          this.busmarker.push(marker)
        })
      }
    },
    // 提示语
    switchStatus (text) {
      this.showPositionValue = true
      this.toastText = text
    },
    // 刷新站点
    pullData () {
      // 获取车的实时位置
      this.getpositionBus(this.lineparams.lineId, this.lineparams.lineType)
      this.getTowStaionInfo(this.lineparams.lineId, this.lineparams.lineType, this.lineStationId)
    },
    // 重置站点信息
    resetStation () {
      // 获取线路的数据
      this.getLineData(this.lineparams.lineId, this.lineparams.lineType)
      // 获取车的实时位置
      this.getpositionBus(this.lineparams.lineId, this.lineparams.lineType)
      setTimeout(() => {
        var markerPosition = [this.currentStationParams.longitude * 1, this.currentStationParams.latitude * 1]
        this.map.panTo(markerPosition)
      }, 300)
    },
    // 切换站点
    changeStation () {
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      if (this.linedata.isOneWay * 1 === 1) {
        this.switchStatus('此线路为单向线路')
      } else {
        if (this.timerfirst) {
          clearInterval(this.timerfirst)
        }
        var str = ''
        if (this.linedata.lineType * 1 === 1) {
          str = '2'
        } else {
          str = '1'
        }
        // 销毁地图和清空元素
        this.map.destroy()
        this.initMap()
        this.getLineData(str)
        this.getTowStaionInfo(str)
        this.getpositionBus(str)
        // 启动计时器
        // setTimeout(() => {
        //   this.openSetInterval(str)
        // }, 1000 * 6)
      }
    },
    // 再次启动计时器
    openSetInterval (val) {
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      let str = val || this.lineparams.lineType
      this.timerfirst = setInterval(() => {
        this.getpositionBus(this.lineparams.lineId, str)
        this.getTowStaionInfo(this.lineparams.lineId, str, this.lineStationId)
      }, 6 * 1000)
    }

  }
}
</script>
<style lang="less" scoped>
.page{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .line-bas{
    padding: .3125rem .625rem;
    height: 16vh;
    border-top: 1px solid #f1f1f1;
    background: @bg-white;
    .line-derection {
      width: 100%;
      height: 4vh;
      line-height: 4vh;
      overflow: hidden;

      .station-name{
        width: 90%;
        float: left;
        font-size: 1rem;
        color: @color-black;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
      .station-change{
        width: 10%;
        float: left;
        text-align: center;
      }
    }
    .line-basic-info{
      width: 100%;
      height: 3vh;
      line-height: 3vh;
      overflow: hidden;
      font-size: @font-size;
      span{
        margin-right: .9375rem;
      }
    }
    .tow-station{
      width: 100%;
      overflow: hidden;
      font-size: @font-size;
      margin-top: 1vh;
      height: 7vh;
      .station-left{
        width: 50%;
        float: left;
        height: 7vh;
        border-right: 1px solid #f1f1f1;
        .tow-left{
          width: 40%;
          float: left;
          height: inherit;
          padding-left: 10%;
        }
        .tow-right{
          width: 50%;
         float: left;
         height: inherit;
         text-align: center;
         .station-num{
            font-size: @font-size;
            .num-line{
              font-size: 1.5rem;
              display: inline-block;
              color: @bg-color;
            }
            .num-icon{
              display: inline-block;
              .icon-status_wifi{
                font-size: .5rem;
                color: @bg-color;
              }
            }
          }
        }
      }
      .station-right{
        width: 49.5%;
        float: left;
        height: 7vh;
        .tow-left{
          width: 40%;
          float: left;
          height: inherit;
          padding-left: 10%;
        }
        .tow-right{
          width: 50%;
         float: left;
         height: inherit;
         text-align: center;
         .station-num{
            font-size: @font-size;
            .num-line{
              font-size: 1.5rem;
              display: inline-block;
              color: @bg-color;
            }
            .num-icon{
              display: inline-block;
              .icon-status_wifi{
                font-size: .5rem;
                color: @bg-color;
              }
            }
          }
        }
      }
      .current-station{
        height: 7vh;
        line-height: 7vh;
        text-align: center;
        font-size: 1rem;
        color: @bg-green;
      }
      .no-data{
        text-align: center;
        color: @font-color;
        height: inherit;
        line-height: 200%;
        div {
          height: 7vh;
          line-height: 7vh;
        }
      }
    }
  }
  #container{
    width: 100%;
    height: 76vh;
    overflow: hidden;
  }
}
</style>
