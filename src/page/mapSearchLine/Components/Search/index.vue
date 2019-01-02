<template>
  <div class="list-search">
    <div class="search-right" @click="changeStation(startStation,endStation)">
      <span class="iconfont icon-shuangxiangjiantou1"></span>
    </div>
    <div class="search-left">
      <div class="search-up" @click="searchStation('up')">
         <div class="circle"></div>
         <div class="name">{{startStation.name}}</div>
      </div>
      <div class="search-down" @click="searchStation('down')">
         <div class="circle"></div>
         <div class="name">{{endStation.name}}</div>
      </div>
    </div>
    <div class="search-right" @click="selectBus">
      <span class="iconfont icon-qiehuanneirong"></span>
    </div>
  </div>
</template>
<script>
// props 接受的params startStation==object endStation==object
// event 返回params  searchStation
export default {
  name: 'Search',
  props: {
    startStation: {
      type: Object
    },
    endStation: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  methods: {
    searchStation (val) {
      this.$emit('searchStation', val)
    },
    changeStation (startStation, endStation) {
      this.$emit('changeStation', startStation, endStation)
    },
    selectBus () {
      this.$emit('selectBus')
    }
  }
}
</script>
<style lang="less" scoped>
 .list-search{
   width: 100%;
   height: 10vh;
   background: @bg-white;
  //  border-top: 1px solid #f1f1f1;
   border-bottom: 1px solid #f1f1f1;
   overflow: hidden;
   .search-left{
     width: 73%;
     height: 10vh;
     float: left;
     .search-up{
      width: 100%;
      height: 5vh;
      line-height: 5vh;
      border-bottom: 1px solid #f1f1f1;
      overflow: hidden;
      .circle {
        width: .5rem;
        height: .5rem;
        background: @bg-color;
        border-radius: 50%;
        margin-top:2.1vh;
        float: left;
      }
      .name{
        width: calc( 100% - 3rem );
        height: 5vh;
        padding-left: 2rem;
        font-size: @font-size-middle;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        float: left;
      }
     }
     .search-down{
      width: 100%;
      height: 5vh;
      line-height: 5vh;
      border-bottom: 1px solid #f1f1f1;
      overflow: hidden;
      .circle {
        width: .5rem;
        height: .5rem;
        background: @bg-yellow;
        border-radius: 50%;
        margin-top:2.1vh;
        float: left;
      }
      .name{
        width: calc( 100% - 3rem );
        height: 5vh;
        padding-left: 2rem;
        font-size: @font-size-middle;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        float: left;
      }
     }
   }
   .search-right{
     width: 13%;
     height: 10vh;
     float: left;
     text-align: center;
     line-height: 10vh;
     .iconfont {
       color: @bg-color;
       font-size: 1.25rem;
     }
   }
 }
</style>
