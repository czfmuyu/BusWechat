<template>
  <div class="line-box" @click="jumpStationList(lineListItem, page, stationName)">
     <div class="station-icon iconfont icon-yiliaohangyedeICON-"></div>
     <div class="line-left">
        <div class="line-name">
          <div class="floatL item-name">{{lineListItem.lineName}}</div>
          <div class="change-station" :class="{'no-change-station': lineListItem.isOneWay * 1 === 1}" v-if="page !== 'home'" @click.stop.prevent="changeLine(lineListItem, lineNextItem)">
            <span class="iconfont icon-shuangxiangjiantou"></span>
          </div>
        </div>
        <div class="floatL item-go-station">开 往:<span class="lastStationName">{{lineListItem.lastStationName}}</span></div>
        <div class="floatL item-go-station">乘车站:{{lineListItem.stationName}}</div>
     </div>
     <div class="line-right">
       <div class="right-left" v-if="lineNextItem.lineId">
          <div v-if="lineNextItem.busPosition.length !== 0">
            <div class="item-next-station" v-if="lineNextItem.busPosition[0].status * 1 !== 0 && lineNextItem.busPosition[0].distance * 1 > 200">
              <div class="station-num">
                <span class="num-line">{{lineListItem.seq - lineNextItem.busPosition[0].seq}}</span>
                <span class="num-icon">
                  <div class="iconfont icon-status_wifi"></div>
                  <div class="station-word">站</div>
                </span>
              </div>
              <div class="station-position" v-if="lineNextItem.busPosition[0].distance * 1 < 1000"> {{lineNextItem.busPosition[0].distance}}米</div>
              <div class="station-position" v-if="lineNextItem.busPosition[0].distance * 1 > 1000"> {{(lineNextItem.busPosition[0].distance * 1 / 1000).toFixed(1)}}公里</div>
            </div>
            <div v-if="lineNextItem.busPosition[0].status * 1 !== 0 && lineNextItem.busPosition[0].distance * 1 < 200 && lineNextItem.busPosition[0].distance * 1 > 50" class="current-station">
              即将到站
            </div>
            <div v-if="lineNextItem.busPosition[0].status * 1 !== 0 && lineNextItem.busPosition[0].distance * 1 < 50 && lineNextItem.busPosition[0].distance * 1 >= 0" class="current-station">
              已到站
            </div>
            <div class="item-next-no" v-if="lineNextItem.busPosition[0].status * 1 === 0">
              <div>--</div>
            </div>
          </div>
        </div>
        <div class="right-right" v-if="lineNextItem.lineId">
          <div v-if="lineNextItem.busPosition.length > 1">
              <div class="item-next-station" v-if="lineNextItem.busPosition[1].status * 1 !== 0 && lineNextItem.busPosition[1].distance * 1 > 200">
                <div class="station-num">
                  <span class="num-line">{{lineListItem.seq - lineNextItem.busPosition[1].seq}}</span>
                  <span class="num-icon">
                    <div class="iconfont icon-status_wifi"></div>
                    <div class="station-word">站</div>
                  </span>
                </div>
                <div class="station-position" v-if="lineNextItem.busPosition[1].distance * 1 < 1000"> {{lineNextItem.busPosition[1].distance}}米</div>
                <div class="station-position" v-if="lineNextItem.busPosition[1].distance * 1 > 1000"> {{(lineNextItem.busPosition[1].distance * 1 / 1000).toFixed(1)}}公里</div>
              </div>
              <div v-if="lineNextItem.busPosition[1].status * 1 !== 0 && lineNextItem.busPosition[1].distance * 1 < 200 && lineNextItem.busPosition[1].distance * 1 > 50" class="current-station">
                  即将到站
              </div>
              <div v-if="lineNextItem.busPosition[1].status * 1 !== 0 && lineNextItem.busPosition[1].distance * 1 < 50 && lineNextItem.busPosition[1].distance * 1 >= 0" class="current-station">
                  已到站
              </div>
              <div class="item-next-no" v-if="lineNextItem.busPosition[1].status * 1 === 0">
                <div>--</div>
              </div>
          </div>
          <div v-if="lineNextItem.busPosition.length !== 0">
             <div class="item-next-no">
                <div>--</div>
              </div>
          </div>
        </div>

     </div>
  </div>
</template>
<script>
import {setLocalStorage} from '@/utils/session.js'
export default {
  name: 'lineItem',
  components: {},
  props: {
    lineListItem: {
      type: Object
    },
    lineNextItem: {
      type: Object
    },
    page: {
      type: String,
      default: ''
    },
    stationName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      timeLine: []
    }
  },
  watch: {
    lineNextItem: (val) => {
      console.log(val)
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    jumpStationList (lineListItem, page, stationName) {
      // 本地缓存线路详情参数
      setLocalStorage('lineParams', lineListItem)
      setLocalStorage('backPageName', page)
      this.$router.push({name: 'lineDetails', params: {lineParams: lineListItem, page: page, stationName: stationName}})
    },
    changeLine (lineListItem, lineNextItem) {
      if (lineListItem.isOneWay * 1 === 0) {
        const params = {
          lineId: lineListItem.lineId,
          lineType: lineListItem.lineType,
          stationName: lineListItem.stationName,
          stationId: lineListItem.lineStationId
        }
        this.$emit('changeLine', params)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.line-box{
  padding: .5rem .9375rem;
  border-bottom: 1px solid #dddddd;
  overflow: hidden;
}
.station-icon{
  font-size: 1.0rem;
  color: @bg-green;
  width: 10%;
  float: left;
  line-height: 3.5rem;
}
.line-left {
  width: 53%;
  height: 3.5rem;
  float: left;
  position: relative;
  .line-name {
    position: relative;
    height: 1.35rem;
    line-height: 1.35rem;
    .item-name{
      font-size: @font-size-h3;
      color: @color-black;
      box-sizing: border-box;
      padding-bottom: .2rem;
      float: left;
    }
    .change-station{
      width: 3rem;
      float: left;
      text-align: center;
      color: @bg-color;
      .icon-shuangxiangjiantou{
        border-radius: 50%;
        border: 1px solid @bg-color;
        padding: .125rem;
      }
    }
    .no-change-station{
      width: 3rem;
      float: left;
      text-align: center;
      color: #333333;
      .icon-shuangxiangjiantou{
        border-radius: 50%;
        border: 1px solid #333333;
        padding: .125rem;
      }
    }
  }

  .item-go-station{
    width: 100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    font-size: @font-size;
    color: @color-gray;
    .lastStationName{
     color: @color-gray;
    }
  }
}
.line-right {
  width: 37%;
  height: 3.0rem;
  padding-top: 0.5rem;
  float: left;
  .right-left{
    width: 50%;
    float: left;
    height: 3.0rem;
    .item-next-station{
      width: 100%;
      text-align: center;
      .station-num{
        font-size: @font-size;
        .num-line{
          font-size: 1.5rem;
          display: inline-block;
          color: @bg-color;
        }
        .num-icon{
          display: inline-block;
          .icon-status_wifi{
            font-size: .5rem;
            color: @bg-color;
          }
          .station-word{
            color: @color-gray;
          }
        }
      }
      .station-position{
        font-size: @font-size;
        color: @color-gray;
      }
    }
    .item-next-no{
      font-size: @font-size;
      margin-top: 1.1rem;
      color: @bg-color;
      text-align: center;
    }
  }
  .right-right{
    width: 50%;
    float: right;
    height: 3.0rem;
    .item-next-station{
      width: 100%;
      text-align: center;
      .station-num{
        font-size: @font-size;
        .num-line{
          font-size: 1.5rem;
          display: inline-block;
          color: @bg-color;
        }
        .num-icon{
          display: inline-block;
          .icon-status_wifi{
            font-size: .5rem;
            color: @bg-color;
          }
          .station-word{
            color: @color-gray;
          }
        }
      }
      .station-position{
        font-size: @font-size;
        color: @color-gray;
      }
    }
    .item-next-no{
      font-size: @font-size;
      margin-top: 1.1rem;
      text-align: center;
      color: @bg-color;
    }
  }
  .current-station{
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    font-size: .875rem;
    color: @bg-green;
  }
}
</style>
