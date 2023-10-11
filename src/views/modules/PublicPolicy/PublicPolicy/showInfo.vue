<template>
  <Sidebar position="right" :showCloseIcon="false" style="width: 30vw" v-model:visible="display"
           @hide="$emit('close')">
    <template #header><strong style="font-size: 18px">详情</strong></template>
    <div class="item" style="margin-top: 2rem">
      <label>命令名称：</label>{{data.name}}
    </div>
    <div class="item">
      <label>命令编码：</label>{{data.code}}
    </div>
    <div class="item">
      <label>命令说明：</label>{{data.comments}}
    </div>
    <div class="item">
      <label>命令用途：</label>{{data.type}}
    </div>
    <div class="item">
      <label>参数说明：</label>{{data.args}}
    </div>
    <div class="item">
      <label>变量参数：</label>{{data.value}}
    </div>
    <div class="item">
      <label>适配系统：</label>{{data.os}}
    </div>
    <div class="item">
      <label>适配架构：</label>{{data.arch}}
    </div>
    <div class="item">
      <label>适配版本：</label>{{data.version}}
    </div>
    <div class="item">
      <label>命令内容：</label>{{data.command}}
    </div>
    <div v-if="show" class="item">
      <label>发布人：</label>{{data.userName}}
    </div>
    <div v-if="show" class="item">
      <label>发布时间：</label>{{Util.getFormatDate(data.updateTime)}}
    </div>

  </Sidebar>
</template>

<script>
import {ref} from "vue";
import Util from "@/views/modules/Public/method/Util";
export default {
  name: "showInfo",
  setup() {
    const display = ref(false)
    const data = ref({})
    const show=ref(true)
    function init(value,sign) {
      display.value = true
      data.value=value
      if(sign=='notPublic'){
        show.value=false
      }

    }

    return {display, init,data,Util,show}
  }
};
</script>

<style scoped>
.item{
  margin-bottom: 2rem;
  display: flex;
  padding: 0 1rem;
}
.item label{
  min-width: 5rem;
  font-weight: bold;
  margin-right: .5rem;
}
</style>
