
// 高德地图获取位置
import AMap from 'AMap'
export function AMapLatLng () {
  AMap.plugin('AMap.Geolocation', function () {
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
}

// H5 获取经纬度
// navigator.geolocation.getCurrentPosition() // 获取用户当前位置
// navigator.geolocation.watchPosition() // 获取并不断监视当前位置，一当有更改就会触发指定函数
// navigator.geolocation.clearWatch() //  停止监听用户位置
// latitude: 0, // 纬度，浮点数，范围为90 ~ -90
// longitude: 0, // 经度，浮点数，范围为180 ~ -180。
export function h5getlocationpoint () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError)
  } else {
    alert('该浏览器不支持地理位置!')
  }
  function showPosition (position) {
    console.log('position', position)
    var lat = position.coords.latitude
    var lng = position.coords.longitude
    return {latitude: lat, longitude: lng}
  }
  function showError (error) {
    console.log('error', error)
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('用户拒绝对获取地理位置的请求。')
        break
      case error.POSITION_UNAVAILABLE:
        alert('位置信息是不可用的。')
        break
      case error.TIMEOUT:
        alert('请求用户地理位置超时。')
        break
      case error.UNKNOWN_ERROR:
        alert('未知错误。')
        break
    }
  }
}
