import Vue from 'vue'
// 引入高德地图
import VueAMap from 'vue-amap'
// 引入微信
import wx from 'weixin-js-sdk'

Vue.use(VueAMap)
Vue.use(wx)
// 初始化vue-amap
const amap = VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'fa76bbea6728461b4102e09478be553f',
  // 插件集合
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor'
  ],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})
// 微信分享
const wxShare = (opstion = {}) => {
  wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
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
  })
}
// 隐藏基础类
const wxHide = () => {
  wx.ready(() => {
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
  })// 需在用户可能点击分享按钮前就先调用
}
export default {
  install (Vue, options) {
    Vue.prototype.$amap = amap
    Vue.prototype.$wxShare = wxShare
    Vue.prototype.$wxHide = wxHide
  }
}
