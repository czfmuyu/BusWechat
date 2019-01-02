// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import store from './store/index'
//  全局注册插件
import inject from '@/plugins/index'
import '@/assets/platform-font/iconfont.css'

Vue.config.productionTip = false
// 注入自定义组件和方法
Vue.use(inject)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
