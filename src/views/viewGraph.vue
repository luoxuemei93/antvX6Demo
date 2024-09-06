<!-- 预览 -->
<template>
<dialog id="graphView">
  <div id="container-id">
    <div id="graph-container-id"></div>
  </div>
  <div class="btm">
    <button @click="closeDialog()">关闭</button>
  </div>
</dialog>
</template>

<script>
import { Graph } from '@antv/x6'
export default {
  name: 'viewGraph',
  data () {
    return {
      graph: null
    }
  },
  mounted () {},
  methods: {
    init (graphJson) {
      this.graph = new Graph({
        container: document.getElementById('graph-container-id'),
        grid: true,
        // 画布放缩
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
        }
      })
      this.graph.fromJSON(graphJson)
    },
    showDialog (graphJson) {
      document.getElementById('graphView').showModal()
      this.init(graphJson)
    },
    closeDialog () {
      document.getElementById('graphView').close()
    }
  }
}
</script>

<style scoped>
 #graphView {
  border-radius: 10px;
  border: 0;
  width: 60%;
  height: 480px;
  overflow: hidden;
  position: relative;
}
#container-id {
  height: 450px;
  width: 100%;
  display: flex;
  border: 1px solid #dfe3e8;
}
#graph-container-id {
  height: 100%;
  width: 100%;
}
.btm {
  position: absolute;
  bottom: 0px;
  text-align: center;
  left: 0px;
  right: 0px;
  height: 30px;
}
</style>
