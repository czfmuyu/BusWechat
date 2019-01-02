<template>
  <div>
   <grid class="gridbg" :show-lr-borders="false" :show-vertical-dividers="false">
      <grid-item :link="{ path: item.link}" :label="item.label" v-for="item in gridData" :key="item.key">
        <i slot="icon" :class="item.font"></i>
        <span slot="label" class="font-style">{{item.label}}</span>
      </grid-item>
    </grid>
  </div>
</template>
<script>
import { Grid, GridItem, GroupTitle } from 'vux'

export default{
  name: 'gridHome',
  components: { Grid, GridItem, GroupTitle },
  props: {
    gridData: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
  .gridbg{
    background: @bg-white;
    border-radius: @border-radius;
  }
  .iconfont{
    font-size: @font-size-icon;
    color: @font-color;
  }
  .weui-grid {
    padding: 8px 10px;
    text-align: center;
}
  .font-style{
    font-size: @font-size;
  }
</style>
