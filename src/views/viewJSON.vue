<!-- 预览 -->
<template>
<dialog id="graphJson">
  <div id="container">
    <vue-json-editor
      class="json-editor"
      v-model="graphJson"
      :model="'code'"
      :showBtns="false"
    >

    </vue-json-editor>
  </div>
  <div class="btm">
    <button @click="closeDialog()">关闭</button>
  </div>
</dialog>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
export default {
  name: 'viewJSON',
  components: { vueJsonEditor },
  data () {
    return {
      graphJson: null
    }
  },
  mounted () {},
  methods: {
    showDialog (graphJson) {
      document.getElementById('graphJson').showModal()
      this.graphJson = graphJson
    },
    closeDialog () {
      document.getElementById('graphJson').close()
    }
  }
}
</script>

<style scoped>
 #graphJson {
  border-radius: 10px;
  border: 0;
  width: 60%;
  height: 480px;
  overflow: hidden;
  position: relative;
}
#container {
  height: 450px;
  width: 100%;
  display: flex;
  border: 1px solid #dfe3e8;
}
.json-editor {
  width: 100%;
  height: 100%;
}
/deep/ .jsoneditor-vue {
  height: 100%;
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
