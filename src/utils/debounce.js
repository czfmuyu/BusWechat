var checkTime = function (i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}
var now = new Date()
var year = now.getFullYear() // 年
var month = now.getMonth() + 1 // 月
var day = now.getDate() // 日
// 获取日期数字
month = checkTime(month)
day = checkTime(day)
// 日期数字20170305
var dateNum = parseInt(year.toString() + month.toString() + day.toString())
// 获取当前日期的秒级别时间
var seconds = new Date(Date.parse((year + '/' + month + '/' + day + ' 00:00:00'))).getTime() / 1000
// 获取当前的周次（1=星期日，2=星期一。。。。）
var weekNum = now.getDay() + 1

var PI = Math.PI
// var X_PI = Math.PI * 3000.0 / 180.0
var EARTH_RADIUS = 6378245.0
var EE = 0.00669342162296594323
/**
 * 计算地球每一个分度的距离
 */
// function rad (d) {
//   return d * Math.PI / 180.0
// }
function outOfChina (lat, lon) {
  if (lon < 72.004 || lon > 137.8347) {
    return true
  } else if (lat < 0.8293 || lat > 55.8271) {
    return true
  } else {
    return false
  }
}
function getnum (num) {
  return (Math.round(num * 10000000) / 10000000)
}
/**
 * 获取两个经纬度点的坐标实际距离
 *
 * @param lat1 开始纬度坐标点
 * @param lng1 开始经度坐标点
 * @param lat2 结束纬度坐标点
 * @param lng2 结束经度坐标点
 * @return 返回两个坐标点的实际距离 单位 米
 */
// function getDistance (lat1, lng1, lat2, lng2) {
//   let radLat1 = rad(lat1)
//   let radLat2 = rad(lat2)
//   let a = radLat1 - radLat2
//   let b = rad(lng1) - rad(lng2)

//   let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2.0), 2.0) +
//           Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2.0), 2.0)))
//   s *= EARTH_RADIUS
//   s = Math.round(s * 10000.0) / 10000.0
//   return s
// }

function transformLat (x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y +
          0.2 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0 / 3.0
  ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 /
          3.0
  ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) *
          2.0 / 3.0
  return ret
}

function transformLon (x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y +
          0.1 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0 / 3.0
  ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 /
          3.0
  ret += (150.0 * Math.sin(x / 12.0 * PI) +
          300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
  return ret
}

function transform (lat, lon) {
  if (outOfChina(lat, lon)) {
    return [lat, lon]
  }
  let dLat = transformLat(lon - 105.0, lat - 35.0)
  let dLon = transformLon(lon - 105.0, lat - 35.0)
  let radLat = lat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - EE * magic * magic
  let sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((EARTH_RADIUS * (1 - EE)) / (magic * sqrtMagic) * PI)
  dLon = (dLon * 180.0) / (EARTH_RADIUS / sqrtMagic * Math.cos(radLat) * PI)
  let mgLat = lat + dLat
  let mgLon = lon + dLon
  return [mgLat, mgLon]
}

// '6', '5', '3', '4', '1', '9', '0', '7','2', '8'
// var transferBusNum = function (c) {
//   switch (c) {
//     case '0':
//       return '6'
//     case '1':
//       return '4'
//     case '2':
//       return '8'
//     case '3':
//       return '7'
//     case '4':
//       return '3'
//     case '5':
//       return '1'
//     case '6':
//       return '0'
//     case '7':
//       return '2'
//     case '8':
//       return '9'
//     case '9':
//       return '5'
//     default:
//       return c
//   }
// }

// '4', '5', '8', '6', '0', '7', '2', '9','3', '1'
var transferBusSeq = function (c) {
  switch (c) {
    case '0':
      return '4'
    case '1':
      return '9'
    case '2':
      return '6'
    case '3':
      return '8'
    case '4':
      return '0'
    case '5':
      return '1'
    case '6':
      return '3'
    case '7':
      return '5'
    case '8':
      return '2'
    case '9':
      return '7'
    default:
      return c
  }
}

// '5', '8', '4', '9', '3', '7', '1', '6','2', '0'
// var transferPosition = function (c) {
//   switch (c) {
//     case '0':
//       return '9'
//     case '1':
//       return '6'
//     case '2':
//       return '8'
//     case '3':
//       return '4'
//     case '4':
//       return '2'
//     case '5':
//       return '0'
//     case '6':
//       return '7'
//     case '7':
//       return '5'
//     case '8':
//       return '1'
//     case '9':
//       return '3'
//     default:
//       return c
//   }
// }

/**
 * 解析车站序号
 *
 * @param seq
 * @returns {Number}
 */
export function decodeBusSeq (seq) {
  // 先拆掉变换次数
  var transfer = dateNum % weekNum + 1
  // 开始准备变换
  // console.log("变换数" + transfer);
  var temp = []
  for (var e = 0; e < seq.length; e++) {
    temp.push(seq[e])
  }
  for (var i = 0; i < transfer; i++) {
    for (var j = 0; j < temp.length; j++) {
      temp.splice(j, 1, transferBusSeq(temp[j]))
    }
  }
  seq = temp.join('')
  // console.log(seq);
  // 脱去最后一位随机数
  var random = parseInt(seq.substring(seq.length - 1, seq.length))
  // 获取当前系统时间的日期数字
  var result = parseInt(seq.substring(0, seq.length - 1))
  // System.out.println("解析去日期前的换数是 = " + seq);
  result -= dateNum
  // System.out.println("解析去日期后的换数是 = " + result);
  // 准备拆分解析数，脱出序列号Int
  result += ''
  return parseInt(result.substring(random, random + 3))
}

/**
 * 解析经纬度
 * @param latLng
 * @returns {number|*}
 */
export function decodeLatLng (latLng) {
  var temp = latLng + ''
  // 小数点分割出整数部分
  var integer = temp.substring(0, temp.lastIndexOf('.'))
  // 小数点分割出小数部分
  var decimal = temp.substring(temp.lastIndexOf('.') + 1, temp.length)
  // 如果数部分不足12位，对末尾进行补零补足12位
  if (decimal.length !== 12) {
    var diff = 12 - decimal.length
    for (var i = 0; i < diff; i++) {
      decimal += '0'
    }
  }
  // 截取小数部分最后四位的随机数
  var random = parseFloat('0.' + decimal.substring(8, 12))
  // 获取混淆后的经纬度数值
  latLng = parseFloat(integer + '.' + decimal.substring(0, 8))
  // 获取当前系统时间值，时间值为日期的秒级别时间戳加上日期的数字
  var time = seconds + dateNum
  // 将当前时间值转换为小数
  time = parseFloat('0.' + time)
  // 于随机数相乘得出混淆数值
  time *= random
  // 保留混淆数值的有效数字八位
  time = time.toPrecision(8)
  // System.out.println("混淆的数值" + timeNum);
  // 混淆数值减去混淆值为真实值
  latLng -= time
  // System.out.println("真实数值" + latlng);
  return latLng
}
/**
 * GPS转高德
 *
 * @param lat
 * @param lon
 * @return
 */
export function gps84ToGcj02 (lat, lon) {
  if (outOfChina(lat, lon)) {
    return [lat, lon]
  }
  let dLat = transformLat(lon - 105.0, lat - 35.0)
  let dLon = transformLon(lon - 105.0, lat - 35.0)
  let radLat = lat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - EE * magic * magic
  let sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((EARTH_RADIUS * (1 - EE)) / (magic * sqrtMagic) * PI)
  dLon = (dLon * 180.0) / (EARTH_RADIUS / sqrtMagic * Math.cos(radLat) * PI)
  let mgLat = getnum(lat + dLat)
  let mgLon = getnum(lon + dLon)
  return [mgLat, mgLon]
}

/**
   * 火星坐标系 (GCJ-02) to 84 *
   * <p>
   * 高德转GPS  转换为7位有效数字
   *
   * @param lon
   * @param lat
   * @return
   */
export function gcj02ToGps84 (lat, lon) {
  let gps = transform(lat, lon)
  let longitude = getnum(lon * 2 - gps[1])
  let latitude = getnum(lat * 2 - gps[0])
  return [latitude, longitude]
}
