<template>
  <div class="page" ref="page">
    <div class="search">
      <div class="search-input" @click="goToSearch">
        <span class="iconfont icon-sousuo"></span>
        <span class="search-pl">搜索公交线路、车站</span>
      </div>
    </div>
    <div class="content">
      <!-- <grid-home :gridData="gridData"></grid-home>
      <grid-post class="margin-item"></grid-post> -->
      <station-item :stationList="stationList" :lineListItem="lineListItem" :lineList="lineList"></station-item>
    </div>
    <footer-home :isfirstShow="true"></footer-home>
    <loading :show="showLoading" :text="textLoading"></loading>
  </div>
</template>
<script>
import {setLocalStorage, getLocalStorage} from '@/utils/session.js'
import { mapGetters } from 'vuex'
import { ButtonTab, ButtonTabItem, Loading } from 'vux'
// 引入微信
import wx from 'weixin-js-sdk'
// components
import footerHome from '@/components/footerhome/index'
import stationItem from '@/components/stationItem/index'
// import gridHome from './Components/gridhome/index'
// import gridPost from './Components/gridpost/index'
// api
import { nearByStation, lineStationPosition } from '@/api/home'
import {signAccesstoken} from '@/api/user'
// 高德转GPS
// import {gcj02ToGps84} from '@/utils/debounce.js'

export default {
  components: { ButtonTab, ButtonTabItem, Loading, stationItem, footerHome },
  data () {
    return {
      autoFixed: false,
      gridData: [ // grid 九宫格
        // {label: '随心行', link: '/lineGuide', font: 'iconfont icon-shoutixiang-', key: 1},
        // {label: '公共自行车', link: '/lineGuide', font: 'iconfont icon-zihangche', key: 2},
        // {label: '意见反馈', link: '/lineGuide', font: 'iconfont icon-yijianfankui', key: 3},
        // {label: '失物招领', link: '/lineGuide', font: 'iconfont icon-xingzhuang9kaobei', key: 4}
      ],
      stationList: [], // 所有站点信息
      lineListItem: [], // 第一条站点的线路数据
      lineList: [], // 第一条站点的线路的车辆数据
      index: 1,
      showLoading: true,
      textLoading: '加载中'
    }
  },
  created () {
    const link = window.location.href
    const opstion = {
      title: '西安公交', // 分享标题
      desc: link, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '' // 分享图标
    }
    // 模拟登陆获取基本参数
    this.login(opstion)
    // 判断机型
    const navigator = getLocalStorage('navigator')
    if (!navigator) {
      if (this.isAndroid_ios()) {
        setLocalStorage('navigator', 'android')
      } else {
        setLocalStorage('navigator', 'ios')
      }
    }
    this.getHomeData()
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'upStation',
      'downStation'
    ])
  },
  mounted () {
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}` // document.body.clientWidth;
    this.$refs.page.style.minHeight = this.clientHeight + 'px'
  },
  methods: {
    getHomeData (lat = '34.3412700000', lng = '108.9398400000') {
      // 3.1 首页附近站点查询   经纬度后期处理
      const params = {
        latitude: lat, // 纬度
        longitude: lng // 经度
      }
      // 延安：36.5965370000 109.4908100000
      // 西安：34.3412700000 108.9398400000
      nearByStation(params).then(res => {
        if (res && res.length) {
          const stationList = res.map((item, index) => {
            if (index === 0) {
              return Object.assign({}, item, {showContent: true})
            } else {
              return Object.assign({}, item, {showContent: false})
            }
          })
          // 站点以及该站点的线路数据
          this.stationList = stationList
          this.showLoading = false
        }
        if (this.stationList[0].lineStations.length) {
        //  获取第一个站点的所用线路信息当作参数
          if (this.stationList[0].lineStations.length > 3) {
            for (var i = 0; i < 3; i++) {
              this.lineListItem.push(this.stationList[0].lineStations[i])
            }
          } else {
            this.lineListItem = this.stationList[0].lineStations
          }
          this.getTime(this.lineListItem)
        }
      })
    },
    // 获取实时时间
    getTime (arr) {
      const firstStationlineList = arr.map(item => {
        return Object.assign({}, { lineId: item.lineId, lineType: item.lineType, lineStationId: item.lineStationId })
      })
      // 3.3 获取多条线路的最近两辆车辆到站情况
      lineStationPosition(firstStationlineList).then(res => {
        this.lineList = res
      })
    },
    login (opstion = {}) {
      const url = encodeURIComponent(window.location.href.split('#')[0])
      const params = {
        tokenUrl: url
      }
      signAccesstoken(params).then(res => {
        if (res) {
          this.$store.dispatch('getaccessToken', res.accessToken)
          const data = res
          wx.config({
            debug: false,
            appId: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: [
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'onMenuShareWeibo',
              'getLocation',
              'openLocation',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareQZone',
              'hideOptionMenu', // 界面操作接口1
              'showOptionMenu', // 界面操作接口2
              'closeWindow', /// /界面操作接口3
              'hideMenuItems', /// /界面操作接口4
              'showMenuItems', /// /界面操作接口5
              'hideAllNonBaseMenuItem', /// /界面操作接口6
              'showAllNonBaseMenuItem'/// /界面操作接口7
            ]
          })

          // wx.onMenuShareTimeline、wx.onMenuShareAppMessage、wx.onMenuShareQQ、wx.onMenuShareQZone
          wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: (res) => {
                let latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
                let longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
                const params = {
                  lng: longitude,
                  lat: latitude
                }
                this.$store.dispatch('getLatLng', params)
                // 初始化数据
                this.getHomeData(latitude + '', longitude + '')
                // 本地缓存
                setLocalStorage('LatLng', params)
              }
            })
            wx.updateAppMessageShareData({
              title: opstion.title, // 分享标题
              desc: opstion.desc, // 分享描述
              link: opstion.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: opstion.imgUrl, // 分享图标
              success: function () {
              // 设置成功
              }
            })
            wx.updateTimelineShareData({
              title: opstion.title, // 分享标题
              link: opstion.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: opstion.imgUrl, // 分享图标
              success: function () {
              // 设置成功
              }
            })
            wx.onMenuShareWeibo({
              title: opstion.title, // 分享标题
              desc: opstion.desc, // 分享描述
              link: opstion.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: opstion.imgUrl, // 分享图标
              success: function () {
              // 用户确认分享后执行的回调函数
              },
              cancel: function () {
              // 用户取消分享后执行的回调函数
              }
            })
            wx.onMenuShareTimeline({
              title: opstion.title, // 分享标题
              link: opstion.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: opstion.imgUrl, // 分享图标
              success: function () {
              // 用户点击了分享后执行的回调函数
              }
            })
            wx.onMenuShareAppMessage({
              title: opstion.title, // 分享标题
              desc: opstion.desc, // 分享描述
              link: opstion.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: opstion.imgUrl, // 分享图标
              type: 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
              // 用户点击了分享后执行的回调函数
              }
            })
            wx.onMenuShareQQ({
              title: opstion.title, // 分享标题
              desc: opstion.desc, // 分享描述
              link: opstion.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: opstion.imgUrl, // 分享图标
              success: function () {
              // 用户确认分享后执行的回调函数
              },
              cancel: function () {
              // 用户取消分享后执行的回调函数
              }
            })
            wx.onMenuShareQZone({
              title: opstion.title, // 分享标题
              desc: opstion.desc, // 分享描述
              link: opstion.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: opstion.imgUrl, // 分享图标
              success: function () {
              // 用户确认分享后执行的回调函数
              },
              cancel: function () {
              // 用户取消分享后执行的回调函数
              }
            })
            wx.hideMenuItems({
              // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
              menuList: [
                'menuItem:share:appMessage',
                'menuItem:share:timeline',
                'menuItem:share:qq',
                'menuItem:share:weiboApp',
                'menuItem:favorite',
                'menuItem:share:facebook',
                'menuItem:share:QZone',
                'menuItem:editTag',
                'menuItem:delete',
                'menuItem:copyUrl',
                'menuItem:originPage',
                'menuItem:readMode',
                'menuItem:openWithQQBrowser',
                'menuItem:openWithSafari',
                'menuItem:share:email',
                'menuItem:share:brand'
              ]
            })
            // “基本类”按钮详见附录3
            // wx.hideAllNonBaseMenuItem()
          })
        }
      })
    },
    goToSearch () {
      this.$router.push('homeToSearch')
    },
    // 判断是否是安卓还是ios
    isAndroid_ios () {
      let u = navigator.userAgent
      // let app = navigator.appVersion
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端或者uc浏览器
      // let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      return isAndroid === true
    }

  }
}
</script>
<style lang="less" scoped>
.page{
  width: 100%;
  height: auto;
  overflow: auto;
  background: @bg-white;
  .search {
    width: 100%;
    height: 2.5rem;
    background: @bg-color;
    overflow: hidden;
    .search-input{
      width: 90%;
      height: 2rem;
      line-height: 2rem;
      background: @bg-white;
      border-radius: 1.25rem;
      margin: 0.25rem 3% 0rem 3%;
      padding: 0rem 2%;
      float: left;
      .icon-sousuo{
         margin-left: .3125rem;
         margin-top: .3125rem;
      }
      .search-pl{
        font-size: @font-size-middle;
      }
    }
  }
  .content{
    width: 100%;
    height: auto;
    margin-bottom: 2.9rem;
  }
  .margin-item{
    margin-top: @margin-top;
  }
}
.routeTab{
  background: @bg-white;
  border-radius: @border-radius;
  padding: 0.3rem 0.5rem;
  position: relative;
  .btn-tab-box{
    width: 100%;
    height: 1.5625rem;
    position: relative;
    .btn-tab{
      width: 60%;
      float: left;
    }
    .stationMap{
      width: 25%;
      height: 1.5625rem;
      font-size: @font-size;
      line-height: 1.5625rem;
      float: right;
      text-align: right;
      .icon-yousanjiao{
        color: @font-color;
        font-size: @font-size;
      }
    }
  }
  .vux-button-group > a {
    height: 1.5625rem;
    font-size: @font-size;
    line-height: 1.5625rem;
  }

}

</style>
