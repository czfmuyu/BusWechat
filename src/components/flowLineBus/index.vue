<template>
  <div class="page">
    <div v-for="(item,index) in postionbusdata" :key="index">
       <div class="bus-icon iconfont icon-jiaotonggongjiaochekanfangtuandabamianxing-copy"
       v-if="item.seq === lineItem.seq"
       :class="{'position-up':item.status * 1 === 2, 'position-out': item.status * 1 === 1}">
       <div class="bus-num" v-if="numArr.length > 1">{{numArr.length}}</div>
       </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'flowLineBus',
  props: {
    postionbusdata: {
      type: Array
    },
    lineItem: {
      type: Object
    }
  },
  data () {
    return {
      numArr: []
    }
  },
  watch: {
    postionbusdata (val) {
      this.numArr = []
      val.forEach(item => {
        if (item.seq === this.lineItem.seq) {
          this.numArr.push(item.seq)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
 .bus-icon{
   width: 1.1rem;
   height: .5rem;
   color: @bg-green;
   position: absolute;
   background: #ffffff;
   left: 20%;
   z-index: 10000;
   .bus-num{
     width: .75rem;
     height: .75rem;
     border-radius: 50%;
     background: @bg-yellow;
     position: absolute;
     top: -0.6125rem;
     right:  -0.1125rem;
     color: #ffffff;
     font-size: .625rem;
     text-align: center;
     line-height: .75rem;
   }
 }
 .position-up{
   bottom: 0rem;
 }
 .position-out{
   top: 1.1rem;
 }
</style>
