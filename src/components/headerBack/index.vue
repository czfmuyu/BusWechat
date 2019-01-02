<template>
  <div class="back-box">
   <div class="floatL back-btn" @click="backBtn">
     <span class="iconfont" :class="[backStyle]"></span>
   </div>
   <div class="floatL back-word" :class="{txtCenter: iscenter, txtwidth: !backStyle && !isIcon, Hastxtwidth:!backStyle && isIcon }">{{backWord}}</div>
   <div class="floatL back-edit" @click="goRoute">
     <div class="iconfont" :class="[isIcon]"></div>
     <div>{{goRouterWord}}</div>
   </div>
  </div>
</template>
<script>
// props 接受的参数
// backStyle: '', // 返回icon 配置
// backWord: '', // 头部名称
// iscenter: true, // 头部名称是否居中
// goRouterWord: '', // 头部去往的页面名称
// isIcon: '', // 头部去往的页面名称是icon
// event 返回的事件
// backBtn 可能需要参数（可从页面直接取）
// goRoute 可能需要参数（可从页面直接取）
export default{
  name: 'headerBack',
  components: {},
  props: {
    backStyle: {
      type: String,
      default: ''
    },
    backWord: {
      type: String
    },
    iscenter: {
      type: Boolean,
      default: false
    },
    goRouterWord: {
      type: String,
      default: ''
    },
    isIcon: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  methods: {
    backBtn () {
      this.$emit('backBtn')
    },
    goRoute () {
      this.$emit('goRoute')
    }
  }
}
</script>
<style lang="less" scoped>
.back-box{
  width: 100%;
  height: 2.5rem;
  line-height: 2.5rem;
  background: #ffffff;
  .floatL{
    float: left;
  }
  .back-btn{
    width: 10%;
    text-align: center;
    .iconfont{
      font-size: 1.25rem;
    }
  }
  .back-word{
    width: 75%;
    text-align: left;
    padding-left: 5%;
  }
  .txtCenter{
    width: 80%;
    text-align: center;
    padding-left: 0%;
  }
  .Hastxtwidth {
    width: 90%;
  }
  .txtwidth {
    width: 100%;
  }
  .back-edit{
    width: 10%;
    text-align: center;
  }
}
</style>
