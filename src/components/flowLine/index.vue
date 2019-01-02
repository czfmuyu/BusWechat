<template>
  <div class="flow-line">
   <div class="line-item" v-for="(item,index) in linedata" :key="index" ref="lineright" @click="selectStation(item,index)">
     <div class="line-left">
       <div class="up-line" v-if="index !== 0"></div>
       <div class="line-circle" :class="{ bgyellow: item.active }"></div>
       <div class="down-line" v-if="index !== (linedata.length - 1)"></div>
       <flow-line-bus :postionbusdata="postionbusdata" :lineItem="item"></flow-line-bus>
       <!-- <div class="iconposition iconfont icon-weizhi1" v-if="item.active"></div> -->
     </div>
     <div class="line-right" :class="{'last-line': index === (linedata.length - 1)}">
       <div class="line-name" :class="{ clyellow: item.active }">
         <span class="line-num" :class="{ clyellow: item.active }">{{item.seq}}</span>
         <span>{{item.stationName}}</span>
         </div>
       <!-- <div>
         <span v-for="(line,index) in item.busLineItem" :key="index">
            <span>{{line}}</span>
            <span v-if="index !== (item.busLineItem.length -1)">、</span>
         </span>
       </div> -->
     </div>
   </div>
  </div>
</template>
<script>
import flowLineBus from '@/components/flowLineBus/index'
export default {
  name: 'flowLine',
  components: {flowLineBus},
  props: {
    linedata: {
      type: Array
    },
    postionbusdata: {
      type: Array
    }
  },
  data () {
    return {

    }
  },
  // computed
  mounted () {
    this.$nextTick(function () {
    })
  },
  methods: {
    selectStation (item, index) {
      this.$emit('selectStation', item, index)
    }
  }
}
</script>

<style lang="less" scoped>
.flow-line{
  width: 100%;
  height: auto;
  .line-item{
    width: 100%;
    height: 3rem;
    .line-left{
      width: 20%;
      height: 3rem;
      float: left;
      position: relative;
      z-index: 99;
      .line-circle{
        width: .1875rem;
        height: .1875rem;
        border: .1875rem solid @bg-green;
        border-radius: 50%;
        // margin: 1.4rem auto 0;
        position: absolute;
        top: 1.2rem;
        left: 46%;
      }
      .up-line{
        width: 2px;
        height: 1.2rem;
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 1;
        background: #999999;
        opacity: 0.4;
      }
      .down-line{
        width: 2px;
        height: 1.3rem;
        position: absolute;
        top: 1.7rem;
        left: 50%;
        z-index: 1;
        background: #999999;
        opacity: 0.4;
      }
      .iconposition{
        width: 1.1rem;
        height: 1.1rem;
        color: @bg-yellow;
        font-size: 1.125rem;
        position: absolute;
        left: 10%;
        top: 1.05rem;
        z-index: 9999;
        background: #ffffff;
        transform:rotate(-90deg);
        -webkit-transform:rotate(-90deg);
      }
    }
    .line-right{
      width: 79%;
      height: 1.9rem;
      line-height: 2rem;
      float: right;
      padding: 0.5rem 0rem;
      color: @color-black;
      // border-bottom: 1px solid #999999;
      font-size: .875rem;
      .line-name{
        .line-num{
          color: @color-gray;
          font-weight: 200;
          font-size: .75rem;
        }
      }
    }
    .last-line {
      border-bottom: 1px solid #ffffff !important;
    }
    .bgyellow {
      border: .1875rem solid @bg-yellow !important;
    }
    .clyellow {
      color: @bg-yellow !important;
      font-size: .875rem !important;
    }
  }
}
</style>
