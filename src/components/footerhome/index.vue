<template>
    <tabbar class="tabPosition">
      <tabbar-item :selected="isfirstShow" :link="{path:'/home'}" class="tabbar-item-first">
        <span slot="label">实时公交</span>
      </tabbar-item>
      <tabbar-item :selected="isTwoShow" :link="{path:'/lineGuide'}">
        <span slot="label">线路导乘</span>
      </tabbar-item>
    </tabbar>
</template>
<script>
import { Tabbar, TabbarItem } from 'vux'
export default{
  name: 'footerHome',
  components: { Tabbar, TabbarItem },
  props: {
    isfirstShow: {
      type: Boolean,
      default: false
    },
    isTwoShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
 .tabPosition{
   position: fixed;
   color: @tabbar-text-active-color;
   .tabbar-item-first{
     border-right: 1px solid #C0BFC4;
   }
 }
</style>
