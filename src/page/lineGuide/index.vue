<template>
  <div>
    <header-back :backStyle="backStyle" :backWord="backWord" :iscenter="iscenter" :goRouterWord="goRouterWord" :isIcon="isIcon"
      @backBtn="backBtngo"
      @goRoute="goRoute"
    ></header-back>
    <search :startStation.sync="startStation" :endStation.sync="endStation" @searchStation="searchStation" @search="search" @changeStation="changeStation"></search>
    <footer-home :isTwoShow="true"></footer-home>
    <toast v-model="showPositionValue" type="text" :time="2000"  :text="toastText" :position="position"></toast>
  </div>
</template>
<script>
// 引入微信
import wx from 'weixin-js-sdk'
import { mapGetters } from 'vuex'
import { Toast } from 'vux'
// components
import headerBack from '@/components/headerBack/index'
import footerHome from '@/components/footerhome/index'
import Search from './Components/Search/index'

export default{
  name: 'LineGuide',
  components: {headerBack, footerHome, Search, Toast},
  data () {
    return {
      // 头部back
      backStyle: '', // 返回icon 配置
      backWord: '线路导乘', // 头部名称
      iscenter: true, // 头部名称是否居中
      goRouterWord: '', // 头部去往的页面名称
      isIcon: '', // 头部去往的页面名称是icon
      // search
      startStation: {
        name: '我的位置',
        address: '',
        lat: '',
        lng: ''
      }, // 搜索返回的开始站点
      endStation: {
        name: '你要去哪里？',
        address: '',
        lat: '',
        lng: ''
      }, // 搜索返回的结束站点
      showPositionValue: false, // 是否显示提示
      position: 'center', // 提示信息的位置
      toastText: '' // 提示文本
    }
  },
  created () {
    this.getSearchStation()
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'upStation',
      'downStation',
      'lat',
      'lng'
    ])
  },
  mounted () {
    this.$wxHide()
    const link = window.location.href.split('#')[0] + '#home'
    const opstion = {
      title: '', // 分享标题
      desc: '', // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '' // 分享图标
    }
    this.$wxShare(opstion)
    wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: (res) => {
          const params = {
            lng: res.longitude,
            lat: res.latitude
          }
          this.$store.dispatch('getLatLng', params)
          if (!this.lat && !this.lng) {
            this.startStation.lat = res.latitude
            this.startStation.lng = res.longitude
          }
        }
      })
    })
  },
  methods: {
    // 获取其他页面的数据
    async getSearchStation () {
      let backParams = this.$route.params.backSearchObj
      if (backParams) {
        if (backParams.type === 'up') {
          // 上车点
          this.startStation.name = backParams.name || this.upStation.name || '我的位置'
          this.startStation.address = backParams.address || this.upStation.address
          this.startStation.lat = backParams.lat || this.upStation.lat || this.lat
          this.startStation.lng = backParams.lng || this.upStation.lng || this.lng
          // 下车点
          this.endStation.name = this.downStation.name || '你要去哪里？'
          this.endStation.address = this.downStation.address
          this.endStation.lat = this.downStation.lat
          this.endStation.lng = this.downStation.lng
          if (this.startStation.name === this.endStation.name && this.startStation.address === this.endStation.address) {
            this.switchStatus('起点和终点相同了')
            this.startStation.name = '我的位置'
            this.startStation.address = ''
            this.startStation.lat = this.lat
            this.startStation.lng = this.lng
            const upParams = {
              type: 'up',
              name: '我的位置',
              address: '',
              lat: this.lat,
              lng: this.lng
            }
            this.$store.dispatch('storageUpStation', upParams)
          }
        } else if (backParams.type === 'down') {
          // 上车点
          this.startStation.name = this.upStation.name || '我的位置'
          this.startStation.address = this.upStation.address
          this.startStation.lat = this.upStation.lat || this.lat
          this.startStation.lng = this.upStation.lng || this.lng
          // 下车点
          this.endStation.name = backParams.name || this.downStation.name || '你要去哪里？'
          this.endStation.address = backParams.address || this.downStation.address
          this.endStation.lat = backParams.lat || this.downStation.lat
          this.endStation.lng = backParams.lng || this.downStation.lng
          if (this.startStation.name === this.endStation.name && this.startStation.address === this.endStation.address) {
            this.switchStatus('起点和终点相同了')
            this.endStation.name = '你要去哪里？'
            this.endStation.address = ''
            this.endStation.lat = ''
            this.endStation.lng = ''
            const downParams = {
              type: 'down',
              name: '你要去哪里？',
              address: '',
              lat: '',
              lng: ''
            }
            this.$store.dispatch('storageDownStation', downParams)
          }
        } else {
          const upParams = {
            type: '',
            name: '我的位置',
            address: '',
            lat: this.lat,
            lng: this.lng
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
        }
      }
    },
    // 头部返回的事件
    backBtngo () {
      this.$router.go(-1)
    },
    // 头部去往其他页面的事件
    goRoute () {

    },
    // 搜索站点的事件
    searchStation (val) {
      this.$router.push({name: 'searchStation', params: {type: val, backpage: 'lineGuide'}})
    },
    // 搜索前往结果页面事件
    search (startStation, endStation) {
      if (startStation.lat && startStation.lng && endStation.lat && endStation.lng) {
        this.$router.push({name: 'mapSearchLine', params: {startStation: startStation, endStation: endStation}})
      } else {
        if (!endStation.lat && !endStation.lng) {
          this.switchStatus('终点未选择')
        } else {
          this.switchStatus('起点未选择')
        }
      }
    },
    // 切换站点
    changeStation (startStation, endStation) {
      if (startStation.lat && startStation.lng && endStation.lat && endStation.lng) {
        this.changeHandle(startStation, endStation)
      } else {
        if (!startStation.lat && !startStation.lng) {
          this.switchStatus('起点未选择')
        } else {
          this.switchStatus('终点未选择')
        }
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
    },
    // 提示语
    switchStatus (text) {
      this.showPositionValue = true
      this.toastText = text
    }
  }
}
</script>
