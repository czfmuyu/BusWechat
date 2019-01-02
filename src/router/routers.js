import App from '../App'
const _import_ = file => () => import('@/page/' + file + '.vue')
export const RouterMap = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        redirect: '/home' // 为空调回到home页面
      },
      {
        path: '/home', // 首页
        name: 'home',
        component: _import_('home/index')
      },
      {
        path: '/lineGuide', // 线路导航
        name: 'lineGuide',
        component: _import_('lineGuide/index')
      },
      {
        path: '/searchStation', // 站点搜索
        name: 'searchStation',
        component: _import_('searchStation/index')
      },
      {
        path: '/mapDragPoint', // 地图选点
        name: 'mapDragPoint',
        component: _import_('mapDragPoint/index')
      },
      {
        path: '/mapSearchLine', // 地图搜索结果列表
        name: 'mapSearchLine',
        component: _import_('mapSearchLine/index')
      },
      {
        path: '/stationList', // 站点列表
        name: 'stationList',
        component: _import_('stationList/index')
      },
      {
        path: '/homeToSearch', // 首页的搜索
        name: 'homeToSearch',
        component: _import_('homeToSearch/index')
      },
      {
        path: '/homeToMap', // 首页到地图
        name: 'homeToMap',
        component: _import_('homeToMap/index')
      },
      {
        path: '/lineDetails', // 线路详情
        name: 'lineDetails',
        component: _import_('lineDetails/index')
      },
      {
        path: '/lineMap', // 线路地图
        name: 'lineMap',
        component: _import_('lineMap/index')
      }

    ]
  }
]
