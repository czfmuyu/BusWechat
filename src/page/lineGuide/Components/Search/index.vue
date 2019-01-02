<template>
  <div class="search-box">
    <div class="search">
      <div class="search-left">
        <div class="up-search" @click="searchStation('up')">
          <div class="floatL up-circle">
            <div class="floatL circle"></div>
          </div>
          <div class="up-station" :class="{fontWT: startStation.name !== '我的位置'}">{{startStation.name}}</div>
        </div>
        <div class="down-search" @click="searchStation('down')">
          <div class="floatL down-circle">
            <div class="floatL circle"></div>
          </div>
          <div class="down-station" :class="{fontWT: endStation.name !== '我的位置'}">{{endStation.name}}</div>
        </div>
        <div class="change-box" @click="changeStation(startStation,endStation)">
          <div class="iconfont icon-shuangxiangjiantou1"></div>
        </div>
      </div>
       <div class="search-right">
          <div class="icon-search-box" @click="search(startStation, endStation)">
            <span class="iconfont icon-sousuo"></span>
          </div>
       </div>
    </div>
  </div>
</template>
<script>
// props 接受的params startStation==object endStation==object
// event 返回params  searchStation search
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
      searchParams: {}
    }
  },
  watch: {

  },
  methods: {
    searchStation (val) {
      this.$emit('searchStation', val)
    },
    search (startStation, endStation) {
      this.$emit('search', startStation, endStation)
    },
    changeStation (startStation, endStation) {
      this.$emit('changeStation', startStation, endStation)
    }
  }

}
</script>
<style lang="less" scoped>
.floatL {
  float: left;
}
.search-box{
  width: 100%;
  padding: 0.5rem 0rem;
  height: 4.6rem;
  background: @bg-white;
  font-size: @font-size-middle;
  border-top: 1px solid #f1f1f1;
  .search{
    width: 95%;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    padding-left: 3%;
  }
  .search-left{
    width: 85%;
    height: auto;
    float: left;
    position: relative;
    .up-search{
      width: 100%;
      height: 2.2rem;
      background: @bg-search-color;
      border-radius: @border-radius;
      margin-bottom: 0.2rem;
      .up-circle{
        width: 15%;
        height: 100%;
      .circle {
        width: .5rem;
        height: .5rem;
        background: @bg-color;
        border-radius: 50%;
        margin-top: 0.85rem;
        margin-left: 1.1rem;
      }
      }
      .up-station{
        width: 83%;
        line-height: 2.2rem;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
    }
    .down-search{
      width: 100%;
      height: 2.2rem;
      background: @bg-search-color;
      border-radius: @border-radius;
      .down-circle{
        width: 15%;
        height: 100%;
      .circle {
        width: .5rem;
        height: .5rem;
        background: @bg-yellow;
        border-radius: 50%;
        margin-top: 0.85rem;
        margin-left: 1.1rem;
      }
      }
      .down-station{
        width: 83%;
        line-height: 2.2rem;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
    }
    .change-box{
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      background: @bg-white;
      position: absolute;
      right: 1.8rem;
      top: 1.4rem;
      cursor: pointer;
      text-align: center;
      line-height: 1.75rem;
      color: @bg-color;
    }
  }
  .search-right{
    width: 15%;
    height: 4.5rem;
    float: left;
    .icon-search-box{
      width: 2rem;
      height: 2rem;
      text-align: center;
      line-height: 2rem;
      background: @bg-search-color;
      margin: 1.25rem auto;
      border-radius: 50%;
    }
  }

}
.fontWT {
  font-weight: 700;
}

</style>
