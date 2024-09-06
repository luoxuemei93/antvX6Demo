<template>
  <div class="home">
    <div id="container">
      <div id="stencil"></div>
      <div id="graph-container"></div>
    </div>
    <div>
      <button @click="saveGraphJson()">保存json</button>
      <button @click="viewGraphJson()">预览</button>
    </div>
    <viewGraph ref="viewGraphRef"></viewGraph>
  </div>
</template>

<script>
import { Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { letfShape } from './letfShape.js'
import { arrayDifference, downloadBlob } from './util.js'
import viewGraph from './viewGraph.vue'
const leftGroupName = 'group1'
const shapeId = 'shapeId' // 对应数据中定义的行政id
export default {
  name: 'Home',
  components: {
    viewGraph
  },
  data () {
    return {
      graph: null,
      stencil: null,
      originViewNodeIdAry: [], // 当前画布上面的节点id
      curOptNodeInfoId: null, // 当前操作的节点
      leftShapeNodeAry: [], // 左侧节点信息
      graphJson: {} // 当前画布导出的json
    }
  },
  methods: {
    // 画布初始化代码
    initGraph () {
      // #region 初始化画布
      this.graph = new Graph({
        container: document.getElementById('graph-container'),
        grid: true,
        // 画布放缩
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
        },
        // 连线选项,配置 connecting 可以实现丰富的连线交互
        connecting: {
          router: 'manhattan', // 路径样式
          allowEdge: false, // 是否允许边链接到另一个边
          connector: {
            name: 'rounded',
            args: {
              radius: 8
            }
          },
          anchor: 'center', // 被连接的节点的锚点
          connectionPoint: 'anchor', // 指定连接点
          allowBlank: false,
          snap: {
            radius: 20
          },
          createEdge () {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#A2B1C3',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'block',
                    width: 12,
                    height: 8
                  }
                }
              },
              zIndex: 0
            })
          },
          validateEdge: (e) => {
            return this.validateEdgeFun(e)
          }
        },
        // 高亮选项
        highlighting: {
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#5F95FF',
                stroke: '#5F95FF'
              }
            }
          }
        }
      })
      // #endregion

      // #region 使用插件
      this.graph
        .use(
        // 调整节点大小和节点旋转角度
          new Transform({
            resizing: true,
            rotating: true
          })
        )
      // 框选
        .use(
          new Selection({
            rubberband: true,
            showNodeSelectionBox: true
          })
        )
        .use(new Snapline())// 对齐线
        .use(new Keyboard()) // 键盘事件，Ctrl + C 复制节点、Ctrl + V 粘贴节点
        .use(new Clipboard()) // 使画布开启复制粘贴节点和边的能力
        .use(new History()) // 元素操作的撤销与重做
      // #endregion
      // #region 初始化侧边栏 stencil
      this.initStencil()
      // #endregion

      // #endregion
      this.viewAction() // 画布事件监听，包括新增节点，删除节点，绘制线段等等
      this.mouseAction() // 画布鼠标事件
      this.graphAction()// 画布事件定义
      this.registerNode() // 注册节点
      this.initLeftShape() // 初始化左侧节点
    },
    // 注册节点，圆心、矩形，多边形
    registerNode () {
      // #region 初始化图形
      const ports = {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          }
        },
        items: [
          {
            group: 'top'
          },
          {
            group: 'right'
          },
          {
            group: 'bottom'
          },
          {
            group: 'left'
          }
        ]
      }

      Graph.registerNode(
        'custom-rect',
        {
          inherit: 'rect',
          width: 66,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: { ...ports }
        },
        true
      )

      Graph.registerNode(
        'custom-polygon',
        {
          inherit: 'polygon',
          width: 66,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: {
            ...ports,
            items: [
              {
                group: 'top'
              },
              {
                group: 'bottom'
              }
            ]
          }
        },
        true
      )

      Graph.registerNode(
        'custom-circle',
        {
          inherit: 'circle',
          width: 45,
          height: 45,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: { ...ports }
        },
        true
      )
    },
    // 初始化侧边栏
    initStencil () {
      // #region 初始化 stencil
      this.stencil = new Stencil({
        title: '流程图',
        target: this.graph,
        stencilGraphWidth: 200,
        stencilGraphHeight: 180,
        groups: [
          {
            title: '基础流程图',
            name: leftGroupName,
            graphHeight: 250
          }
        ],
        layoutOptions: {
          columns: 2,
          columnWidth: 80,
          rowHeight: 55
        }
      })
      document.getElementById('stencil').appendChild(this.stencil.container)
    },
    // 侧边栏图形绘制
    initLeftShape () {
      this.leftShapeNodeAry = []
      letfShape.forEach(item => {
        const shapeNode = this.graph.createNode(item)
        this.leftShapeNodeAry.push(shapeNode)
      })
      this.stencil.load(this.leftShapeNodeAry, 'group1')
    },
    // 鼠标事件
    mouseAction () {
      // 控制连接桩显示/隐藏
      const showPorts = (ports, show) => {
        for (let i = 0, len = ports.length; i < len; i += 1) {
          ports[i].style.visibility = show ? 'visible' : 'hidden'
        }
      }
      this.graph.on('node:mouseenter', () => {
        const container = document.getElementById('graph-container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, true)
      })
      this.graph.on('node:mouseleave', () => {
        const container = document.getElementById('graph-container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, false)
      })
    },
    // 画布快捷键与事件
    graphAction () {
      // #region 快捷键与事件
      this.graph.bindKey(['meta+c', 'ctrl+c'], () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.copy(cells)
        }
        return false
      })
      this.graph.bindKey(['meta+x', 'ctrl+x'], () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.cut(cells)
        }
        return false
      })
      this.graph.bindKey(['meta+v', 'ctrl+v'], () => {
        if (!this.graph.isClipboardEmpty()) {
          const cells = this.graph.paste({ offset: 32 })
          this.graph.cleanSelection()
          this.graph.select(cells)
        }
        return false
      })

      // undo redo
      this.graph.bindKey(['meta+z', 'ctrl+z'], () => {
        if (this.graph.canUndo()) {
          this.graph.undo()
        }
        return false
      })
      this.graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
        if (this.graph.canRedo()) {
          this.graph.redo()
        }
        return false
      })

      // select all
      this.graph.bindKey(['meta+a', 'ctrl+a'], () => {
        const nodes = this.graph.getNodes()
        if (nodes) {
          this.graph.select(nodes)
        }
      })

      // delete
      this.graph.bindKey('backspace', () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.removeCells(cells)
        }
      })

      // zoom
      this.graph.bindKey(['ctrl+1', 'meta+1'], () => {
        const zoom = this.graph.zoom()
        if (zoom < 1.5) {
          this.graph.zoom(0.1)
        }
      })
      this.graph.bindKey(['ctrl+2', 'meta+2'], () => {
        const zoom = this.graph.zoom()
        if (zoom > 0.5) {
          this.graph.zoom(-0.1)
        }
      })
    },
    // 获取画布的全量节点id
    getCellsIdAryFun () {
      const cells = this.graph.getCells()
      const newNodeId = []
      cells.forEach(item => {
        newNodeId.push(item?.store?.data?.shapeId)
      })
      return newNodeId
    },
    // 根据id获取当前左侧操作的节点
    getLeftShapeNode (curOptNodeId) {
      return this.leftShapeNodeAry.filter(item => item?.store?.data?.shapeId === curOptNodeId)
    },
    // 连线过程，获取source/target节点信息
    getNodebusData (Node) {
      return Node?.store?.data
    },

    // =================以下属于是偏于操作业务逻辑=================
    // 边拖动结束事件,逻辑处理：获取source信息，和target信息。通过判断source的allowEntry字段中，是否包括target的shapeId。包含，则true
    validateEdgeFun (e) {
      const sBusData = this.getNodebusData(e.edge.getSourceCell())
      const eBusData = this.getNodebusData(e.edge.getTargetCell())
      const eBusShapeId = eBusData[shapeId]
      if (sBusData && sBusData.allowOutNodeIds && sBusData.allowOutNodeIds.length > 0) {
        const allowOutNodeIds = sBusData.allowOutNodeIds
        // 判断目标节点的id，是否在源节点的allowOutNodeIds的列表中
        if (allowOutNodeIds.indexOf(eBusShapeId) > -1) {
          return true
        } else {
          alert(`当前${sBusData.name}节点不支持指向${eBusData.name}节点`)
          return false
        }
      } else {
        // 没有allowEntry，说明没有
        alert(`当前${sBusData.name}节点不支持指向任何节点`)
        return false
      }
    },
    // 画布事件,主要是获取到当前操作的节点id。然后对左侧的节点进行销毁或者重新加载
    viewAction () {
      // 节点被挂载到画布上时触发。
      this.graph.on('view:mounted', ({ view }) => {
        const newNodeId = this.getCellsIdAryFun()
        this.curOptNodeInfoId = arrayDifference(newNodeId, this.originViewNodeIdAry)[0]// 比较2个数组得出当前操作的节点id
        this.originViewNodeIdAry = newNodeId
        this.stencilReload(0) // 左侧边栏重新渲染
      })
      // 节点从画布上卸载时触发。
      this.graph.on('view:unmounted', ({ view }) => {
        const newNodeId = this.getCellsIdAryFun()
        this.curOptNodeInfoId = arrayDifference(this.originViewNodeIdAry, newNodeId)[0]// 比较2个数组得出当前操作的节点id
        this.originViewNodeIdAry = newNodeId
        this.stencilReload(1) // 左侧边栏重新渲染
      })
    },
    // 画布新增以后，左侧边栏数据进行处理
    stencilReload (type) { // type=0,卸载；type=1,装载
      const optNode = this.getLeftShapeNode(this.curOptNodeInfoId)
      if (type === 0) {
        this.stencil.unload(optNode, leftGroupName)
      } else if (type === 1) {
        const curNode = this.stencil.graphs[leftGroupName].model.collection.cells
        this.stencil.load([...curNode, ...optNode], leftGroupName)
      }
    },
    // 保存画布json格式
    saveGraphJson () {
      const cells = this.graph.getCells()
      if (cells.length === 0) {
        alert('暂无需要保存的数据')
        return
      }
      this.graphJson = this.graph.toJSON()
      const jsonString = JSON.stringify(this.graphJson, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })// 创建一个 Blob 对象，该对象表示数据，并设置 MIME 类型为 application/json
      downloadBlob(blob)
    },
    // 导出画布json格式
    viewGraphJson () {
      this.graphJson = this.graph.toJSON()
      this.$refs.viewGraphRef.showDialog(this.graphJson)
    }
  },
  mounted () {
    this.initGraph()
  }
}
</script>

<style>
#container {
  height: 600px;
  width: 100%;
  display: flex;
  border: 1px solid #dfe3e8;
}
#stencil {
  width: 180px;
  height: 100%;
  position: relative;
  border-right: 1px solid #dfe3e8;
}
#graph-container {
  width: calc(100% - 180px);
  height: 100%;
}
.x6-widget-stencil {
  background-color: #fff;
}
.x6-widget-stencil-title {
  background-color: #fff;
}
.x6-widget-stencil-group-title {
  background-color: #fff !important;
}
.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}
.x6-widget-transform > div {
  border: 1px solid #239edd;
}
.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}
.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}
.x6-widget-transform-resize {
  border-radius: 0;
}
.x6-widget-selection-inner {
  border: 1px solid #239edd;
}
.x6-widget-selection-box {
  opacity: 0;
}
</style>
