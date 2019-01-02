<template>
  <div class="page" ref="page">
   <div class="search">
      <!-- <div class="iconfont icon-fanhui" @click="backBtngo"></div> -->
      <div class="search-input">
        <span class="iconfont icon-sousuo"></span>
        <x-input class="search-pl" :debounce="300" v-model="keyword" placeholder="搜索公交线路、车站" @on-change="search" @on-click-clear-icon="clear"></x-input>
      </div>
      <div class="cancle" @click="cancle">取消</div>
    </div>
    <div class="search-name" v-if="searchList.length">相关站点、线路</div>
    <div class="history-name" v-if="!searchList.length && !keyword && historyList.length">历史记录</div>
    <div class="content" v-if="searchList.length">
       <div class="li-item" v-for="(item, index) in searchList" :key="index" @click="jumpStationList(item)">
         <div class="item-name">{{item.lineName}}</div>
         <div class="item-icon iconfont icon-zbb_icon-shifuduan-"></div>
       </div>
    </div>
    <div class="content" v-if="!searchList.length && !keyword && historyList.length">
       <div class="li-item" v-for="(item, index) in historyList" :key="index">
         <div class="item-name" @click="jumpStationList(item)">{{item.lineName}}</div>
         <div class="item-icon iconfont icon-shanchu" @click="deleteHistory(item)"></div>
       </div>
    </div>
    <div v-if="!searchList.length && !historyList.length" class="no-data iconfont icon-zanwushuju1"></div>
  </div>
</template>
<script>

import { XInput } from 'vux'
// api
import { keywordVague } from '@/api/search'
import {setLocalStorage, getLocalStorage, removeLocalStorage} from '@/utils/session.js'
export default {
  name: 'homeToSearch',
  components: {XInput},
  data () {
    return {
      keyword: '',
      searchList: [],
      historyList: []
    }
  },
  mounted () {
    this.getHistory()
    this.$wxHide()
  },
  methods: {
    // 头部返回的事件
    backBtngo () {
      // this.$router.go(-1)
    },
    // 搜索
    search (val) {
      keywordVague({keyword: val}).then(res => {
        if (res && res.length) {
          this.searchList = res
        } else {
          this.searchList = []
        }
      })
    },
    clear () {
      this.keyword = ''
      this.search(this.keyword)
    },
    // 取消
    cancle () {
      // this.$router.go(-1)
      this.$router.push({name: 'home'})
    },
    jumpStationList (obj) {
      // 本地缓存搜索数据
      if (this.historyList.length > 30) {
        this.historyList.pop()
        this.historyList.unshift(obj)
      } else {
        this.historyList.unshift(obj)
      }
      const f = this.historyList
      setLocalStorage('historyline', f)
      // 本地缓存线路详情参数
      setLocalStorage('lineParams', obj)
      setLocalStorage('backPageName', 'homeToSearch')
      this.$router.push({name: 'lineDetails', params: {lineParams: obj, page: 'homeToSearch'}})
    },
    // 获取本地数据
    getHistory () {
      let storageData = getLocalStorage('historyline')
      if (storageData) {
        if (storageData.length) {
          let arr = [storageData[0]]
          for (let i = 1; i < storageData.length; i++) {
            var repeatData = false
            for (var j = 0; j < arr.length; j++) {
              if (storageData[i]['lineName'] === arr[j]['lineName']) {
                repeatData = true
                break
              }
            }
            if (!repeatData) {
              arr.push(storageData[i])
            }
          }
          this.historyList = arr
        } else {
          this.historyList = []
        }
      }
    },
    // 清空历史记录
    clearHistory () {
      removeLocalStorage('historyline')
      this.historyList = []
    },
    // 单条清除历史数据
    deleteHistory (obj) {
      this.historyList = this.historyList.filter(item => {
        if (item.lineName !== obj.lineName) {
          return item
        }
      })
      const f = this.historyList
      setLocalStorage('historyline', f)
    }
  }
}
</script>
<style lang="less" scoped>
.page{
  width: 100%;
  height: auto;
  overflow: auto;
  .search {
    width: 100%;
    height: 2.5rem;
    background: @bg-color;
    overflow: hidden;
    .icon-fanhui{
      width: 10%;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: center;
      font-size: 1.125rem;
      float: left;
    }
    .search-input{
      width: 75%;
      height: 2.0rem;
      line-height: 2.0rem;
      background: @bg-white;
      border-radius: 1.25rem;
      margin: 0.25rem 0% 0rem 5%;
      padding: 0rem 2%;
      float: left;
      position: relative;
      .icon-sousuo{
         margin-left: .3125rem;
         margin-top: .3125rem;
      }
      .search-pl{
        font-size: @font-size-middle;
        background:none;
        outline:none;
        border:0px;
        width: 80%;
        padding: 0rem;
        position: absolute;
        top: 0rem;
        left: 14%;
      }
    }
    .cancle{
      width: 15%;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: center;
      font-size: @font-size-middle;
      float: left;
      color: @bg-white;
    }
  }
  .search-name{
    width: 6.5rem;
    height: 1rem;
    line-height: 1rem;
    padding: .3125rem .625rem;
    background: @bg-color;
    color: #ffffff;
    font-size: .875rem;
    border-radius: .9375rem;
    margin: 0.25rem 5%;
  }
  .history-name{
    width: 4rem;
    height: 1rem;
    line-height: 1rem;
    padding: .3125rem .625rem;
    background: @bg-color;
    color: #ffffff;
    font-size: .875rem;
    border-radius: .9375rem;
    margin: 0.25rem 5%;
  }
  .content{
    width: 90%;
    padding:0% 5%;
    background: #ffffff;
    overflow: auto;
    .li-item {
      border-top: 1px solid #f1f1f1;
      width: 100%;
      height: 3rem;
      line-height: 3rem;
      .item-name{
        width: 90%;
        height: 3rem;
        font-size: @font-size-middle;
        font-weight: 100;
        float: left;
      }
      .item-icon{
        float: left;
        width: 10%;
        height: 3rem;
        font-size: @font-size-middle;
        text-align: right;
      }
    }
  }
  .no-data{
    font-size: 6.25rem;
    color: #999999;
    width: 90%;
    height: 94vh;
    margin: 0 auto;
    text-align: center;
    line-height: 94vh;
  }
}
</style>
