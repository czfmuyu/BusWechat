<template>
  <div id="app" ref="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  components: { },
  data () {
    return {
      clientHeight: ''
    }
  },
  mounted () {
    // 获取浏览器可视区域高度
    // this.clientHeight = `${document.documentElement.clientHeight}` // document.body.clientWidth;
    // this.$refs.app.style.height = this.clientHeight + 'px'
    // window.onresize = function temp () {
    //   this.clientHeight = `${document.documentElement.clientHeight}`
    // }
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    // clientHeight: function () {
    //   this.changeFixed(this.clientHeight)
    // }
  },
  methods: {
    // changeFixed (clientHeight) { // 动态修改样式
    //   this.$refs.app.style.height = clientHeight + 'px'
    // }
  }
}
</script>

<style>
html,body,#app{
  width: 100%;
  max-width: 812px;
  margin:  0 auto;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background: #EFF0F5;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  z-index: 10;
}
.amap-ui-poi-picker-sugg-container {
  position: absolute;
  z-index: 9999;
  top: 6vh !important;
  left: 12% !important;
  width: 86% !important;
  height: 50vh !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}
.amap-ui-poi-picker-sugg-list .sugg-item {
  font-size: .75rem !important;
  padding: 2px 5px 2px 23px !important;
  background: url(http://webapi.amap.com/ui/1.0/ui/misc/PoiPicker/assets/poi.png) no-repeat 5px 50%;
  vertical-align: middle;
}
.amap-ui-poi-picker-sugg-list .sugg-district{
  display: none !important;
}
.weui-tabbar__item.vux-tabbar-simple {
    height: 2.5rem !important;
    line-height: 2.5rem !important;
}
.vux-tabbar-simple .weui-tabbar__label {
    line-height: 2.5rem !important;
}
.amap-call{
  display: none !important;
}
.amap-lib-transfer {
    border: none !important;
}
.amap-icon img{
  width: 1.5625rem;
  height: 2.125rem;
}
.amap-marker-label{
  border: 0;
  background: #ffffff;
  padding:5px 15px;
  border-radius: 5px;
  /* border: 1px solid #999999; */
  /* -moz-box-shadow:1px 3px 9px #999999, -2px -1px 9px #999999;
  -webkit-box-shadow:1px 3px 9px #999999, -2px -1px 9px #999999;
    box-shadow:1px 3px 9px #999999, -2px -1px 9px #999999; */
  color: #007aff;
}
#mapLine .amap-marker-label{
  border: 0;
  background: #EB1AE8;
  padding:5px 15px;
  border-radius: 5px;
  box-shadow:1px 3px 9px #999999, -2px -1px 9px #999999;
  color: #ffffff;
}
</style>
