<template>
  <div class="page" ref="app">
    <header-back :backStyle="backStyle" :backWord="backWord" :iscenter="iscenter" :goRouterWord="goRouterWord" :isIcon="isIcon"
        @backBtn="backBtngo"
        @goRoute="goRoute"
    ></header-back>
    <div class="line-bas">
       <div class="line-derection">
         <div class="station-name">
           <span>{{linedata.firstStationName}}</span>
           <span class="iconfont icon-jiang-copy"></span>
           <span>{{linedata.lastStationName}}</span>
         </div>
         <div class="station-change iconfont icon-shuangxiangjiantou" @click="changeStation"></div>
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
              <div class="tow-right" v-if="towStationList[0].busPosition[1].status * 1 !== 0 && towStationList[0].busPosition[1].distance > 200">
                <div class="station-num">
                    <span class="num-line" v-if="towStationList[0].busPosition[1].seq">{{currentStationNum - towStationList[0].busPosition[1].seq}}</span>
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
    <div class="flow-box">
       <div class="flow-line-box wrapper">
        <flow-line ref="flowLine" :linedata.sync="busStations" :postionbusdata.sync="postionbusdata" @selectStation="selectStation"></flow-line>
      </div>
    </div>

     <loading :show="showLoading" :text="textLoading"></loading>
     <toast v-model="showPositionValue" type="text" :time="2000"  :text="toastText" :position="position"></toast>
  </div>
</template>
<script>
import {setLocalStorage, getLocalStorage} from '@/utils/session.js'
import BScroll from 'better-scroll'
import { Loading, Toast } from 'vux'
import headerBack from '@/components/headerBack/index'
import flowLine from '@/components/flowLine/index'
// api
import {infoBasic, positionBus, lineStationPosition} from '@/api/home'
// 解密 + GPS转高德
import {decodeBusSeq, decodeLatLng, gps84ToGcj02} from '@/utils/debounce.js'
export default {
  name: 'lineDetails',
  components: {headerBack, flowLine, Loading, Toast, BScroll},
  data () {
    return {
      // 头部back
      backStyle: 'icon-fanhui', // 返回icon 配置
      backWord: '线路详情', // 头部名称
      iscenter: true, // 头部名称是否居中
      goRouterWord: '', // 头部去往的页面名称
      isIcon: 'icon-ditu', // 头部去往的页面名称是icon
      lineparams: {}, // 页面传递过来的数据
      currentStationNum: null,
      lineStationId: '', // 上下行线路id
      page: '',
      stationName: '',
      linedata: {}, // 线路的数据
      busStations: [], //
      towStationList: [], // 下两站的信息
      postionbusdata: [], // 车辆的数据
      timerfirst: null, // 计时器
      showLoading: true, // 显示loading
      textLoading: '加载中',
      showPositionValue: false, // 是否显示提示
      position: 'center', // 提示信息的位置
      toastText: '', // 提示文本
      currentStationParams: {}, // 当前选中站点的参数
      clientHeight: null, // 屏幕高度
      scrollHeight: null, // 滚动区域高度
      scrollAllHeight: null, // 滚动区域总高度高度
      targetHeight: null // 当前目标的高度
    }
  },
  created () {
    this.getLineParans()
  },
  mounted () {
    // 判断机型
    const navigator = getLocalStorage('navigator')
    if (navigator === 'ios') {
      this.backStyle = ''
    }
    // 微信隐藏基础类
    this.$wxHide()
    // 微信分享
    const link = window.location.href.split('#')[0] + '#home'
    const opstion = {
      title: '线路详情', // 分享标题
      desc: link, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '' // 分享图标
    }
    this.$wxShare(opstion)
    // 获取线路的数据
    this.getLineData()
    // 获取车的实时位置
    this.getpositionBus()
    if (this.timerfirst) {
      clearInterval(this.timerfirst)
    }
    // 再次启动计时器
    this.openSetInterval(this.lineparams.lineId, this.lineparams.lineType)
    this.$nextTick(() => {
      // 获取浏览器可视区域高度
      this.clientHeight = `${window.screen.availHeight}` // document.body.clientWidth;

      setTimeout(() => {
        // 滚动区域高度
        this.scrollHeight = Math.round(this.clientHeight * 72 / 100)
        // 当前目标的高度
        this.targetHeight = 3 * 16 * this.lineparams.seq
        // 滚动区域总高度高度
        this.scrollAllHeight = this.$refs.flowLine.$el.scrollHeight
        this.scrollCurrentH(this.targetHeight, this.scrollAllHeight, this.scrollHeight)
      }, 300)
    })
  },
  methods: {
    // 获取其他页面的数据
    async getLineParans () {
      const lineParams = getLocalStorage('lineParams')
      const backPageName = getLocalStorage('backPageName')
      this.lineparams = this.$route.params.lineParams || lineParams
      this.page = this.$route.params.page || backPageName
      this.stationName = this.$route.params.stationName
    },
    // 头部返回的事件
    backBtngo () {
      clearInterval(this.timerfirst)
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      if (this.page) {
        this.$router.push({name: this.page, params: {stationName: this.stationName}})
      } else {
        this.$router.go(-1)
      }
    },
    // 头部去往其他页面的事件
    goRoute () {
      clearInterval(this.timerfirst)
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      setLocalStorage('mapParams', this.lineparams)
      setLocalStorage('currentStationParams', this.currentStationParams)
      this.$router.push({name: 'lineMap', params: {lineParams: this.lineparams, page: this.page, stationName: this.stationName, currentStationParams: this.currentStationParams}})
    },
    // 获取线路的数据
    getLineData (lineId, lineType, index) {
      const params = {
        lineId: lineId || this.lineparams.lineId, // 线路id
        lineType: lineType || this.lineparams.lineType // 线路上下行
      }
      // 3.4 获取线路的基础数据
      infoBasic(params).then(res => {
        this.showLoading = false
        this.linedata = res
        const busStations = res.busStations.map((item, i) => {
          // 选中第几站
          if (index || index === 0) {
            if (i === index) {
              // 当前站的序号
              this.currentStationNum = item.seq
              this.lineStationId = item.lineStationId
              this.currentStationParams = item
              return Object.assign({}, item, {active: true})
            } else {
              return Object.assign({}, item, {active: false})
            }
          } else {
            // 是否在反向线路中有同名站点  0 没有  1 有同名站
            if (this.lineparams.isSameStationInReverse * 1 === 0) {
              // 序号是否存在
              if (item.seq * 1 === this.lineparams.seq * 1) {
                // 当前站的序号
                this.currentStationNum = item.seq
                this.lineStationId = item.lineStationId
                this.currentStationParams = item
                return Object.assign({}, item, {active: true})
              } else {
                return Object.assign({}, item, {active: false})
              }
            } else {
              // 站点是否存在
              if (item.stationName === this.lineparams.stationName) {
                // 当前站的序号
                this.currentStationNum = item.seq
                this.lineStationId = item.lineStationId
                this.currentStationParams = item
                return Object.assign({}, item, {active: true})
              } else {
                return Object.assign({}, item, {active: false})
              }
            }
          }
        })
        // GPS转高德
        const a = busStations.map(item => {
          let latLngArr = gps84ToGcj02(item.latitude * 1, item.longitude * 1)
          return Object.assign({}, item, {'latitude': latLngArr[0]}, {'longitude': latLngArr[1]})
        })
        this.busStations = a
        this.backWord = res.lineName + '详情'
        let lineStationId = this.lineStationId || this.lineparams.lineStationId
        // 获取下两趟的数据u
        this.getTowStaionInfo(lineId, lineType, lineStationId)
      })
    },
    // 获取下两趟的数据u
    getTowStaionInfo (lineId, lineType, lineStationId) {
      // this.towStationList = []
      const params = [{
        lineId: lineId || this.lineparams.lineId, // 线路id
        lineType: lineType || this.lineparams.lineType, // 线路上下行
        lineStationId: lineStationId
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
      // this.postionbusdata = []
      const params = {
        lineId: lineId || this.lineparams.lineId, // 线路id
        lineType: lineType || this.lineparams.lineType// 线路上下行
      }
      // 3.5 线路上车辆运行位置
      positionBus(params).then(res => {
        if (res && res.length) {
          let a = res.map((item) => {
            // 解析站序 和 经纬度
            let seq = decodeBusSeq(item.seq)
            let lat = decodeLatLng(item.latitude)
            let lng = decodeLatLng(item.longitude)
            // GPS转高德
            let latLngArr = gps84ToGcj02(lat * 1, lng * 1)
            return Object.assign({}, item, {'seq': seq + ''}, {'latitude': latLngArr[0]}, {'longitude': latLngArr[1]})
            // decodeBusSeq(item.seq)
            // decodeLatLng(item.latitude)
            // decodeLatLng(item.longitude)
            // let latLngArr = gps84ToGcj02(item.latitude, item.longitude)
            // return Object.assign({}, item, {'latitude': latLngArr[0]}, {'longitude': latLngArr[1]})
          })
          this.postionbusdata = a
        }
      })
    },
    // 切换站点
    changeStation () {
      this.showLoading = true
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      if (this.linedata.isOneWay * 1 === 1) {
        this.switchStatus('此线路为单向线路')
      } else {
        var str = ''
        if (this.linedata.lineType * 1 === 1) {
          str = '2'
        } else {
          str = '1'
        }
        this.lineparams = Object.assign({}, this.lineparams, {'lineType': str})
        this.getLineData(this.lineparams.lineId, str)
        this.getpositionBus(this.lineparams.lineId, str)
        setTimeout(() => {
          // 当前目标的高度
          this.targetHeight = 3 * 16 * this.currentStationNum
          this.scrollCurrentH(this.targetHeight, this.scrollAllHeight, this.scrollHeight)
        }, 800)
        // 启动计时器
        setTimeout(() => {
          this.openSetInterval(this.lineparams.lineId, str)
        }, 1000 * 6)
      }
    },
    // 再次启动计时器
    openSetInterval (lineId, lineType, index) {
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      this.timerfirst = setInterval(() => {
        this.getLineData(lineId, lineType, index)
        this.getpositionBus(lineId, lineType)
      }, 6 * 1000)
    },
    // 提示语
    switchStatus (text) {
      this.showLoading = false
      this.showPositionValue = true
      this.toastText = text
    },
    // 选中当前站
    selectStation (item, index) {
      this.showLoading = true
      if (this.timerfirst) {
        clearInterval(this.timerfirst)
      }
      // 当前站的序号
      this.currentStationNum = item.seq
      this.lineparams = Object.assign({}, this.lineparams, {'lineStationId': item.lineStationId}, {'seq': item.seq}, {'stationName': item.stationName})
      this.getLineData(this.lineparams.lineId, this.linedata.lineType, index)
      this.getpositionBus(this.lineparams.lineId, this.linedata.lineType)
      // 启动计时器
      setTimeout(() => {
        this.openSetInterval(this.lineparams.lineId, this.linedata.lineType, index)
      }, 1000 * 6)
    },
    scrollCurrentH (targetH, scrollAllH, scrollH) {
      // targetH, scrollAllH, scrollH 当前目标的高度 滚动区域总高度高度 滚动区域高度
      let scroll = new BScroll('.wrapper', {
        click: true,
        tap: true
      })
      scroll.refresh()
      if (scrollAllH === 0) {
        setTimeout(() => {
        // 滚动区域高度
          this.scrollHeight = Math.round(this.clientHeight * 72 / 100)
          // 当前目标的高度
          this.targetHeight = 3 * 16 * this.lineparams.seq
          // 滚动区域总高度高度
          this.scrollAllHeight = this.$refs.flowLine.$el.scrollHeight
          this.scrollCurrentH(this.targetHeight, this.scrollAllHeight, this.scrollHeight)
        }, 300)
      }
      if (scrollAllH > scrollH) {
        if (targetH > scrollH) {
          if ((scrollAllH - targetH) < scrollH) {
            let h = scrollAllH - scrollH
            scroll.scrollTo(0, -h, 1000, 'ease-in-out')
          } else {
            let h = targetH - ((scrollH / 10) * 5)
            scroll.scrollTo(0, -h, 1000, 'ease-in-out')
          }
        }
      }
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
        height: inherit;
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
        height: inherit;
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
  .flow-box{
    width: 100%;
    height: 75vh;
    margin-top: 1vh;
    background: @bg-white;
    position: relative;
    overflow: hidden;
    .flow-line-box{
      position:absolute;
      top: 0;
      bottom:0;
      left:0;
      right:0;
      overflow:hidden;
    }
  }

}
</style>
