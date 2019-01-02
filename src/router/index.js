import Vue from 'vue'
import Router from 'vue-router'
import { RouterMap } from './routers'
Vue.use(Router)
export const router = new Router({
  routes: RouterMap
})
