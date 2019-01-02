// 获取接口的链接
const baseUrl = {
  // dev: 'http://192.168.10.241:3000/mock/256', // 本地
  // dev: 'http://192.168.10.211:8788', // 测试
  dev: 'http://xa.16bus.net:8788', // 生产
  // prod: 'http://117.34.118.17:8083'
  prod: 'http://xa.16bus.net:8788'
}
export const BASE_PER_FIX_URL = process.env.NODE_ENV === 'production' ? baseUrl.prod : baseUrl.dev
