<template>
  <div class="search-box" ref="page">
    <div class="back-box">
      <div class="floatL back-btn" @click="backBtn">
        <span class="iconfont" :class="{'icon-48copy17-copy': navigator !== 'ios'}"></span>
      </div>
      <div class="floatL back-word">
         <x-input  :placeholder="placeholder" :debounce="300" v-model="keyWord" @on-change="searchResult" @on-click-clear-icon="searchResult"></x-input>
      </div>
    </div>
    <div class="search-map">
        <div class="map-left">
          <div class="my-position icon iconfont icon-wodeweizhi" @click="myPosition"> 我的位置</div>
        </div>
        <div class="map-right" @click="mapDtag(searchTypeStr,backpage)">
          <div class="my-position icon iconfont icon-dituxuandian"> 地图选点</div>
        </div>
    </div>
    <div class="result-history" v-if="resultList.length && keyWord">
       <div class="result-box">
          <div class="result-word">搜索结果</div>
          <div class="result-list">
             <div class="list-item" v-for="(item,index) in resultList" :key="index" @click="backSearch(item)">
               <div class="item-icon">
                 <span class="iconfont icon-weizhi"></span>
               </div>
               <div class="item-word">
                 <div class="item-name">{{item.name}}</div>
                 <div class="item-address">{{item.address}}</div>
               </div>
             </div>
          </div>
       </div>
    </div>
    <div class="history-data" v-if="historyData.length && !keyWord">
       <div class="history-box">
          <div class="history-word">历史记录</div>
          <div class="history-list">
            <div class="list" v-for="(item,index) in historyData" :key="index">
                <div class="list-item"  @click="backSearch(item)">
                  <div class="item-icon">
                    <span class="iconfont icon-jilu"></span>
                  </div>
                  <div class="item-word">
                    <div class="item-name">{{item.name}}</div>
                    <div class="item-address">{{item.address}}</div>
                  </div>
                </div>
                <div class="delete" @click="deleteHistory(item)">
                  <span class="iconfont icon-shanchu"></span>
                </div>
            </div>
            <div class="all-delete" @click="clearHistory">全部清除</div>
          </div>
       </div>
    </div>
     <div class="no-data" v-if="!historyData.length && !resultList.length && !keyWord">
       <span class="iconfont icon-zanwushuju1"></span>
     </div>
  </div>
</template>
<script>
// 引入微信
import wx from 'weixin-js-sdk'
import { mapGetters } from 'vuex'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import { XInput } from 'vux'
import {setLocalStorage, getLocalStorage, removeLocalStorage} from '@/utils/session.js'
export default {
  name: 'searchStation',
  components: {XInput, AMap, AMapUI},
  data () {
    return {
      searchTypeStr: '', // 其他页面传递的参数
      backpage: '', // 返回的页面
      keyWord: '', // 关键字
      resultList: [], // 搜索结果列表
      placeholder: '',
      historyData: [],
      navigator: ''
    }
  },
  created () {
    this.getSearchType()
    this.getHistory()
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'lat',
      'lng'
    ])
  },
  mounted () {
    this.$wxHide()
    this.navigator = getLocalStorage('navigator')

    if (this.searchTypeStr === 'up') {
      this.placeholder = '请输入起点关键字'
    } else {
      this.placeholder = '请输入终点关键字'
    }
  },
  methods: {
    // 获取其他页面的数据
    async getSearchType () {
      this.searchTypeStr = this.$route.params.type
      this.backpage = this.$route.params.backpage
    },
    // 返回
    backBtn () {
      const params = {
        type: this.searchTypeStr,
        name: '',
        address: '',
        lat: '',
        lng: ''
      }
      // 根据不同页面进入返回相应页面
      if (this.backpage === 'lineGuide') {
        this.$router.push({name: 'lineGuide', params: {backSearchObj: params}})
      } else {
        this.$router.push({name: 'mapSearchLine', params: {backSearchObj: params}})
      }
    },
    searchResult (val) {
      this.resultList = []
      // 地图查询
      this.autoInput(val)
    },
    // 获取搜索信息
    autoInput (val) {
      var keywords = val
      AMap.plugin('AMap.PlaceSearch', () => {
        var autoOptions = {
          city: '西安',
          children: 1,
          pageSize: 20
        }
        var placeSearch = new AMap.PlaceSearch(autoOptions)
        placeSearch.search(keywords, (status, result) => {
          // 搜索成功时，result即是对应的匹配数据
          if (result.info === 'OK') {
            this.resultList = result.poiList.pois
          }
        })
      })
    },
    // 查询结果列表item 返回事件
    backSearch (obj) {
      // 本地缓存搜索数据
      if (this.historyData.length > 30) {
        this.historyData.pop()
        this.historyData.unshift(obj)
      } else {
        this.historyData.unshift(obj)
      }
      const f = this.historyData
      setLocalStorage('history', f)
      // 全局缓存搜索的站点信息
      const params = {
        type: this.searchTypeStr,
        name: obj.name,
        address: obj.address,
        lat: obj.location.lat,
        lng: obj.location.lng
      }
      // 根据查询的起始和终点缓存相应的数据，以备后期使用
      if (this.searchTypeStr === 'up') {
        this.$store.dispatch('storageUpStation', params)
      } else {
        this.$store.dispatch('storageDownStation', params)
      }
      // 根据不同页面进入返回相应页面
      if (this.backpage === 'lineGuide') {
        this.$router.push({name: 'lineGuide', params: {backSearchObj: params}})
      } else {
        this.$router.push({name: 'mapSearchLine', params: {backSearchObj: params}})
      }
    },
    // 获取本地数据
    getHistory () {
      let storageData = getLocalStorage('history')
      if (storageData) {
        if (storageData.length) {
          let arr = [storageData[0]]
          for (let i = 1; i < storageData.length; i++) {
            var repeatData = false
            for (var j = 0; j < arr.length; j++) {
              if (storageData[i]['name'] === arr[j]['name'] && storageData[i]['address'] === arr[j]['address']) {
                repeatData = true
                break
              }
            }
            if (!repeatData) {
              arr.push(storageData[i])
            }
          }
          this.historyData = arr
        } else {
          this.historyData = []
        }
      }
    },
    // 清空历史记录
    clearHistory () {
      removeLocalStorage('history')
      this.historyData = []
    },
    // 单条清除历史数据
    deleteHistory (obj) {
      this.historyData = this.historyData.filter(item => {
        if (item.name !== obj.name && item.address !== obj.address) {
          return item
        }
      })
      const f = this.historyData
      setLocalStorage('history', f)
    },
    // 地图选点
    mapDtag (val, backpage) {
      this.$router.push({name: 'mapDragPoint', params: {type: val, backpage: backpage}})
    },
    // 我的位置
    myPosition () {
      if (this.lat && this.lng) {
        // 全局缓存搜索的站点信息
        const params = {
          type: this.searchTypeStr,
          name: '我的位置',
          address: '',
          lat: this.lat,
          lng: this.lng
        }
        // 根据查询的起始和终点缓存相应的数据，以备后期使用
        if (this.searchTypeStr === 'up') {
          this.$store.dispatch('storageUpStation', params)
        } else {
          this.$store.dispatch('storageDownStation', params)
        }
        // 根据不同页面进入返回相应页面
        if (this.backpage === 'lineGuide') {
          this.$router.push({name: 'lineGuide', params: {backSearchObj: params}})
        } else {
          this.$router.push({name: 'mapSearchLine', params: {backSearchObj: params}})
        }
      } else {
        wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
          wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
              const position = {
                lng: res.longitude,
                lat: res.latitude
              }
              this.$store.dispatch('getLatLng', position)
              // 全局缓存搜索的站点信息
              const params = {
                type: this.searchTypeStr,
                name: '我的位置',
                address: '',
                lat: res.latitude,
                lng: res.longitude
              }
              // 根据查询的起始和终点缓存相应的数据，以备后期使用
              if (this.searchTypeStr === 'up') {
                this.$store.dispatch('storageUpStation', params)
              } else {
                this.$store.dispatch('storageDownStation', params)
              }
              // 根据不同页面进入返回相应页面
              if (this.backpage === 'lineGuide') {
                this.$router.push({name: 'lineGuide', params: {backSearchObj: params}})
              } else {
                this.$router.push({name: 'mapSearchLine', params: {backSearchObj: params}})
              }
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.search-box{
  width: 100%;
  height: auto;
  overflow: hidden;
  .back-box{
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    background: @bg-white;
    border-bottom: 1px solid #dddddd;
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
      width: 86%;
      text-align: left;
      padding-left: 2%;
      padding-right: 2%;
      font-size: @font-size-middle;
    }
  }
  .search-map {
    width:100%;
    height:1.5rem;
    padding: 0.5rem 0;
    background-color:@bg-white;
    display: flex;
    justify-content:space-around;
    align-items: center;
    .map-left, .map-right {
      flex: none;
      height: 100%;
      width: 50%;
    }
    .map-left{
      border-right: 1px solid @bg-green;
    }
    .my-position{
       text-align: center;
       line-height: 1.5rem;
       color:@bg-green;
       font-size: 1rem;
    }
  }
  .result-history{
    width: 100%;
    height: 87vh;
    .result-box{
      width: 100%;
      height: 87vh;
      overflow: hidden;
      .result-word{
        background: #eae7e7;
        color: inherit;
        font-size: @font-size;
        padding: 1.2vh .5rem;
      }
      .result-list{
        background: @bg-white;
        width: 100%;
        height: 83vh;
        overflow: auto;
        .list-item{
          width: 100%;
          height: 2.2rem;
          padding: .625rem 0rem;
          border-bottom: 1px solid #f1f1f1;
          .item-icon{
            width: 15%;
            height: 2.2rem;
            line-height: 2.2rem;
            text-align: center;
            color: @bg-color;
            float: left;
          }
          .item-word{
            width: 85%;
            height: 2.2rem;
            float: left;

           .item-name{
             font-size: @font-size-middle;
             font-weight: 100;
             overflow:hidden;
             text-overflow:ellipsis;
             white-space:nowrap
           }
           .item-address{
             font-size: @font-size;
             overflow:hidden;
             text-overflow:ellipsis;
             white-space:nowrap
           }
          }
        }
      }
    }
  }
  .history-data{
    width: 100%;
    height: 87vh;
    .history-box{
      width: 100%;
      height: 87vh;
      overflow: hidden;
      .history-word{
        background: #eae7e7;
        color: inherit;
        font-size: @font-size;
        padding: 1vh .5rem;
      }
      .history-list{
        background: @bg-white;
        width: 100%;
        height: 83vh;
        overflow: auto;
        .list{
          width: 100%;
          height: 2.2rem;
          padding: .825rem 0rem;
          border-bottom: 1px solid #f1f1f1;
          overflow: hidden;
          .list-item{
            width: 85%;
            height: 2.2rem;
            float: left;
            .item-icon{
              width: 15%;
              height: 2.2rem;
              line-height: 2.2rem;
              text-align: center;
              // color: @bg-color;
              float: left;
              .icon-jilu {
                font-size: 1.25rem;
              }
            }
            .item-word{
              width: 85%;
              height: 2.2rem;
              float: left;

            .item-name{
              font-size: @font-size-middle;
              font-weight: 100;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap
            }
            .item-address{
              font-size: @font-size;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap
            }
            }
          }
          .delete{
            width: 15%;
            height: 2.2rem;
            float: left;
            line-height: 2.2rem;
            text-align: center;
          }
        }
        .all-delete{
          width: 100%;
          padding: .825rem 0rem;
          text-align: center;
          font-size: @font-size-middle;
          border-bottom: 1px solid #f1f1f1;
        }

      }
    }
  }
  .no-data{
    width: 100%;
    height: 87vh;
    line-height: 87vh;
    text-align: center;
    .icon-zanwushuju1{
      font-size: 6.25rem;
      color: #999999;
    }
  }
  .weui-cell {
    padding: 0px;
  }
}
</style>
