// 左侧形状的数据
const letfShape = [
  {
    label: '开始',
    name: '开始', // 因为model的数据中，返回不了，label、id的值（与原属性冲突了）。因为多定义了一个，name，shapeId
    shapeId: '001', // 业务id
    // 出仓指向，可以选择下面2种格式，具体根据后台，以及跟进是否需要展示线文字进行定义
    allowOutNodeIds: ['002', '003', '005'], // 目前定义：允许绘制指向的集合就行。
    allowOutNodeLinkLabel: { // 自定义目前连线上的字段
      '002': '指向002的id说明',
      '005': '指向005的id说明'
    },
    shape: 'custom-rect', // 渲染的形状
    attrs: { // 样式属性，不重要
      body: {
        rx: 20, // 边框x半径弧度
        ry: 26 // 边框y半径弧度
      }
    }
  },
  {
    label: '矩形选择',
    name: '矩形选择',
    shapeId: '002',
    shape: 'custom-rect'
  },
  {
    label: '中间1',
    name: '中间1',
    shapeId: '003',
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20'
      }
    }
  },
  {
    label: '中间2',
    name: '中间2',
    shapeId: '004',
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '10,0 40,0 30,20 0,20'
      }
    }
  },
  {
    label: '结束',
    name: '结束',
    shapeId: '005',
    shape: 'custom-circle'
  }
]

export {
  letfShape
}
