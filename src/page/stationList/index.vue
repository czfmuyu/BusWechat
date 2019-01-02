<template>
    <div class="page" ref="page">
      <header-back class="header-back" :backStyle="backStyle" :backWord="backWord" :iscenter="iscenter" :goRouterWord="goRouterWord" :isIcon="isIcon"
        @backBtn="backBtngo"
        @goRoute="goRoute"
      ></header-back>
      <div class="line-list wrapper">
        <div>
          <div v-for="(item,index) in lineList" :key="index">
            <line-item v-if="lineNextList[index]" :lineListItem.sync="item" :lineNextItem.sync="lineNextList[index]" :page="page" :stationName="stationInfo" @changeLine="changeLine"></line-item>
          </div>
        </div>
      </div>
      <loading :show="showLoading" :text="textLoading"></loading>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import {getLocalStorage} from '@/utils/session.js'
import { mapGetters } from 'vuex'
import { Loading } from 'vux'
import headerBack from '@/components/headerBack/index'
import lineItem from '@/components/lineItem/index'
// api
import { lineStationPosition } from '@/api/home'
import { stationAccurate, exchangeAccurate } from '@/api/search'
export default {
  name: 'stationList',
  components: {headerBack, lineItem, Loading, BScroll},
  data () {
    return {
      // 头部back
      backStyle: 'icon-fanhui', // 返回icon 配置
      backWord: '', // 头部名称
      iscenter: true, // 头部名称是否居中
      goRouterWord: '', // 头部去往的页面名称
      isIcon: '', // 头部去往的页面名称是icon
      page: 'stationList',
      pageMap: '', // 地图进入该页面
      stationInfo: '', // 站点信息
      lineList: [], // 线路列表
      lineNextList: [], // 下两站的信息
      showLoading: true,
      textLoading: '加载中'
    }
  },
  created () {
    this.getSearchStation()
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'stationName',
      'towBusData'
    ])
  },
  mounted () {
    this.$wxHide()
    const navigator = getLocalStorage('navigator')
    if (navigator === 'ios') {
      this.backStyle = ''
    }
    this.clientHeight = `${document.documentElement.clientHeight}` // document.body.clientWidth;
    this.$refs.page.style.height = this.clientHeight + 'px'
    const link = window.location.href.split('#')[0] + '#home'
    const url = window.location.href
    const opstion = {
      title: '线路列表', // 分享标题
      desc: url, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '' // 分享图标
    }
    this.$wxShare(opstion)
    this.getLineList()
    this.backWord = this.stationInfo
    let scroll = new BScroll('.wrapper', {
      click: true,
      tap: true
    })
    scroll.refresh()
  },
  methods: {
    // 获取其他页面的数据
    async getSearchStation () {
      const stationName = getLocalStorage('stationName')
      this.stationInfo = this.$route.params.stationName || this.stationName || stationName
      this.pageMap = this.$route.params.pageMap
    },
    // 获取莫个站点的所有线路
    getLineList () {
      const params = {
        stationName: this.stationInfo
      }
      stationAccurate(params).then(res => {
        if (res && res.length) {
          this.showLoading = false
          this.lineList = res
          //  获取站点的所用线路信息当作参数
          const firstStationlineList = this.lineList.map(item => {
            return Object.assign({}, { lineId: item.lineId, lineType: item.lineType, lineStationId: item.lineStationId })
          })
          // 3.3 获取多条线路的最近两辆车辆到站情况
          lineStationPosition(firstStationlineList).then(res => {
            if (res && res.length) {
              this.lineNextList = res
            }
          })
        }
      })
    },
    // 头部返回的事件
    backBtngo () {
      // this.$router.go(-1)
      if (this.pageMap === 'homeToMap') {
        this.$router.push({name: 'homeToMap'})
      } else {
        this.$router.push({name: 'home'})
      }
    },
    // 头部去往其他页面的事件
    goRoute () {},
    // 切换站点
    changeLine (obj) {
      this.showLoading = true
      // 2.5 站点换向
      exchangeAccurate(obj).then(res => {
        this.changeLineHandle(res)
      })
    },
    // 处理切换站点
    changeLineHandle (obj) {
      const params = [{ lineId: obj.lineId, lineType: obj.lineType, lineStationId: obj.lineStationId }]
      this.lineList = this.lineList.map(item => {
        if (item.lineId === obj.lineId) {
          return Object.assign({}, item, obj)
        } else {
          return item
        }
      })
      // 3.3 获取多条线路的最近两辆车辆到站情况
      lineStationPosition(params).then(res => {
        this.showLoading = false
        if (res && res.length) {
          this.lineNextList = this.lineNextList.map(item => {
            if (item.lineId === res[0].lineId) {
              return Object.assign({}, item, res[0])
            } else {
              return item
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.page{
  background: #ffffff;

}
.header-back{
  border-bottom: 1px solid #dddddd;
}
.line-list{
  width: 100%;
  height: 92.5vh;
  overflow: hidden;
  background: #ffffff;
}
</style>
