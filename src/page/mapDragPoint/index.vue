<template>
  <div class="map-drag">
    <div class="back-box">
      <div class="floatL back-btn" @click="backBtn">
        <span class="iconfont" :class="{'icon-48copy17-copy': navigator !== 'ios'}"></span>
      </div>
      <div class="floatL back-word">
         <!-- <input id="searchInput"  :placeholder="placeholder" /> -->
         {{placeholder}}
      </div>
    </div>
    <div id="container"></div>
    <div class="drag-name">
      <div class="name-address">
        <div class="name-word" v-if="mapDragPointInfo.regeocode">{{mapDragPointInfo.regeocode.pois[0]['name']}}</div>
        <div class="address-word">{{mapDragPointInfo.nearestJunction}}</div>
      </div>
      <div class="name-confirm" @click="confirmDrag(mapDragPointInfo)">确认</div>
    </div>
  </div>
</template>
<script>
import {getLocalStorage} from '@/utils/session.js'
// 地图选点
import { mapGetters } from 'vuex'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
export default {
  name: 'mapDragPoint',
  components: {AMap, AMapUI},
  data () {
    return {
      searchTypeStr: '', // 其他页面传递的参数
      backpage: '', // 返回的页面
      keyWord: '', // 关键字
      mapDragPointInfo: {}, // 选点结果数据
      placeholder: '',
      navigator: ''
    }
  },
  watch: {
  },
  created () {
    this.getSearchType()
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
      this.placeholder = '请选择起点位置'
    } else {
      this.placeholder = '请选择终点位置'
    }
    this.initMap()
  },
  methods: {
    // 获取其他页面的数据
    async getSearchType () {
      this.searchTypeStr = this.$route.params.type
      this.backpage = this.$route.params.backpage
    },
    // 初始化地图 并且定位+搜索+选点
    initMap () {
      let self = this
      AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], function (PositionPicker, PoiPicker) {
        let map = new AMap.Map('container', {
          resizeEnable: true,
          // center: [this.lng || 108.9398400000, this.lat || 34.3412700000], // 地图中心点
          zoom: 15, // 地图显示的缩放级别
          viewMode: '3D',
          pinch: 45
        })
        // 控件 'AMap.ToolBar'集成了缩放、平移、定位等功能,'AMap.Scale'展示地图在当前层级和纬度下的比例尺 AMap.ControlBar 3D 罗盘控制
        map.plugin(['AMap.Geolocation'], function () {
          // map.addControl(new AMap.ToolBar())
          // map.addControl(new AMap.Scale())
          // map.addControl(new AMap.ControlBar())

          // 加载定位插件，实现定位功能
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: false, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            useNative: true // 是否使用安卓定位sdk用来进行定位
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition(function (status, result) {
            if (status === 'complete') {
              onComplete(result)
            } else {
              onError(result)
            }
          })
          // 解析定位结果
          function onComplete (data) {
            console.log('解析定位结果', data)
          }
          // 解析定位错误信息
          function onError (data) {
            console.log('解析定位错误信息', data)
          }
        })

        // 拖拽选点
        let positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: map
        })
        positionPicker.on('success', function (positionResult) {
          self.mapDragPointInfo = positionResult
        })
        positionPicker.on('fail', function (positionResult) {
          // console.log(positionResult)
        })
        positionPicker.start() // 开始拖拽选址
        map.panBy(0, 1)

        // 搜索选址
        var poiPicker = new PoiPicker({
          input: 'searchInput'
        })
        poiPicker.on('poiPicked', function (poiResult) {
          poiPicker.hideSearchResults()
          let lat = poiResult.item.location.lat
          let lng = poiResult.item.location.lng
          map.panTo([lng, lat])
        })
      })
    },
    // 返回进入页面
    backBtn () {
      // this.$router.go(-1)
      this.$router.push({name: 'searchStation', params: {backpage: this.backpage}})
    },
    // 选点结果确认返回搜索页面
    confirmDrag (obj) {
      const params = {
        type: this.searchTypeStr,
        name: obj.regeocode.pois[0]['name'],
        address: obj.nearestJunction,
        lat: obj.position.lat,
        lng: obj.position.lng
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
  }
}
</script>
<style lang="less" scoped>
.map-drag {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .back-box{
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    background: @bg-white;
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
      #searchInput {
        width: 100%;
        border: 0;
        outline: 0;
        -webkit-appearance: none;
        background-color: transparent;
        font-size: inherit;
        color: inherit;
        height: 1.41176471em;
        line-height: 1.41176471;
      }
    }
  }
  #container {
    width: 100%;
    height: 83vh;
  }
  .drag-name{
    width: 100%;
    height: 8vh;
    padding: 1.5vh 0px;
    background: @bg-white;
    position: absolute;
    bottom: 0px;
    .name-address{
      width: 80%;
      height: 100%;
      border-right: 1px solid #C0BFC4;
      float: left;
      .name-word {
        width: 90%;
        padding-left: 10%;
        font-size: @font-size-middle;
        color: @color-black;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-top: .1875rem;

      }
      .address-word{
        width: 90%;
        padding-left: 10%;
        font-size: @font-size;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
    }
    .name-confirm{
      width: 19%;
      height: 8vh;
      text-align: center;
      line-height: 8vh;
      float: left;
      color: @font-color;
      font-size: 1rem;
    }
  }
}
</style>
