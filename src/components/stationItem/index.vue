<template>
  <div class="station-box">
     <div class="station-item" :label="item.stationId" v-for="(item, index) in stationList" :key="item.stationId">
       <div v-if="index === 0">
            <div class="weui-cell" @click="jumpStationList(item,index)">
              <div class="station-icon iconfont icon-gongjiaozhan"></div>
              <div class="title">
                <div class="station-name">
                  <span class="left-style">{{item.stationName}}
                    <!-- <span class="distance">{{item.distance}}米</span> -->
                  </span>
                </div>
              </div>
            </div>
            <div class="search-map" @click="goToMap">
              <div class="map-word">站点地图</div>
              <div class="iconfont icon-yousanjiao"></div>
            </div>
            <div class="line">
              <div v-for="(el,i) in lineListItem" :key="i">
                <line-item v-if="lineList[i]"  :lineListItem="lineListItem[i]" :lineNextItem="lineList[i]" :page="page"  @changeLine="changeLine"></line-item>
              </div>
            </div>
       </div>
       <div v-else>
          <div class="weui-cell" @click="jumpStationList(item,index)">
            <div class="station-icon iconfont icon-gongjiaozhan"></div>
            <div class="title">
              <div class="station-name">
                <span class="left-style">{{item.stationName}}
                  <!-- <span class="distance">{{item.distance}}米</span> -->
                </span>
              </div>
              <div class="station-line">
                <span class="line-item" v-for="(el, index) in item.lineStations" :key="index">
                  <span v-if="index !== (item.lineStations.length - 1)">{{el.lineName}}、</span>
                  <span v-if="index === (item.lineStations.length - 1)">{{el.lineName}}</span>
                  </span>
              </div>
            </div>
          </div>
       </div>
      </div>
  </div>
</template>
<script>
import lineItem from '@/components/lineItem/index'
import {setLocalStorage} from '@/utils/session.js'
export default {
  name: 'stationItem',
  components: {lineItem},
  props: {
    stationList: { // 所用站点信息
      type: Array
    },
    lineListItem: { // 第一站的线路信息
      type: Array
    },
    lineList: { // 线路下面的车辆信息
      type: Array
    }
  },
  data () {
    return {
      page: 'home'
    }
  },
  mounted () {

  },
  computed: {
  },
  methods: {
    // 暂时不用
    showLines (index, item) {
      item.showContent = !item.showContent
    },
    // 跳转到线路列表
    jumpStationList (item, index) {
      // 全局缓存站点名称
      this.$store.dispatch('setStationName', item.stationName)
      // 本地缓存
      setLocalStorage('stationName', item.stationName)
      this.$router.push({name: 'stationList', params: { stationName: item.stationName }})
    },
    // 跳转地图
    goToMap () {
      this.$router.push({name: 'homeToMap'})
    },
    changeLine (obj) {
      console.log('obj', obj)
    }
  }
}
</script>
<style lang="less" scoped>
.station-box{
  // margin-top: 0.25rem;
}
.station-item{
  position: relative;
  .search-map {
    width: 5rem;
    height: 2.7rem;
    position: absolute;
    top: 0rem;
    right: 0rem;
    font-size: @font-size;
    color: @bg-green;
    line-height: 2.7rem;
    .map-word{
      float: left;
    }
    .icon-yousanjiao{
      float: left;
    }
  }
}
.change-line{
  width: 3.125rem;
  height: 1.5rem;
  position: absolute;
  text-align: right;
  right: 0;
  top: .625rem;
  color: @bg-color;
  line-height: 1.5rem;
}

.weui-cell {
  padding: .5rem .9375rem;
  border-bottom: 1px solid #ddd;
  overflow: auto;
  .station-icon{
    font-size: 1.2rem;
    color: @bg-green;
    width: 10%;
    float: left;
    height: inherit;
    line-height: inherit;
    vertical-align: middle;
    display: ceil;
    line-height: 1.6rem;
  }
  .title{
    width: 90%;
    float: right;
    .station-name{
      vertical-align:middle;
      .left-style{
        font-size: @font-size-h3;
        color: @color-black;
        .distance{
          font-weight: normal;
          font-size: @font-size;
          margin-left: .833333rem;
          color: @color-gray;
        }
      }
    }
    .station-line{
      width: 100%;
      .line-item{
        font-size: .625rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        color: @color-gray;
      }
    }
  }
}

</style>
