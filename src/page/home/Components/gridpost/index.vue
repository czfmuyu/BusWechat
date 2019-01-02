<template>
  <div>
    <flexbox class="post-top">
      <flexbox-item :span="3">
        <div class="flex-grid">
          <i class="iconfont icon-toutiao"></i>
          <span>公交头条</span>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="flex-grid">
          <span class="text-style">由于西二环路况拥堵，261将在高峰绕行,由于西二环路况拥堵，261将在高峰绕行由于西二环路况拥堵，261将在高峰绕行，32路采取双层巴士，欢迎乘坐,由于西二环路况拥堵，261将在高峰绕行，32路采取双层巴士，欢迎乘坐</span>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem, Divider } from 'vux'
export default{
  name: 'gridPost',
  components: { Flexbox, FlexboxItem, Divider },
  data () {
    return {

    }
  }
}
</script>
<style lang="less">
.post-top{
  margin-top: @margin-top;
  background: @bg-white;
  border-radius: @border-radius;
  padding: .3125rem 0rem;
}
.flex-grid {
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: .333333rem;
  background-clip: padding-box;
  padding-right: @padding-right;
  .iconfont{
    color: @font-color;
    font-size: @font-size-icon;
  }
  span {
    font-size: @font-size;
  }
  .text-style{
    text-align: left;
    font-size: @font-size;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>
