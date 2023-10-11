<template>
  <div class="page">
    <div class="toolbar">
      <div v-for="(item,index) in serveList" :key="item" @click="currentIndex=index">
        {{ '监控地址【' + item + '】' }}
      </div>
    </div>
    <iframe class="iframe-view" :src="serveList[currentIndex]"></iframe>
  </div>
</template>

<script setup>
import axios from "axios";
import {ref} from "vue";

const serveList = ref([])

const currentIndex = ref(0)

axios.get('config.json').then(res => {
  serveList.value = res.data.monitor
})
</script>

<style scoped lang="scss">
.page {
  padding: 1rem;
  display: block;

  .toolbar {
    height: 40px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    div {
      height: 40px;
      padding: 0 10px;
      line-height: 40px;
      border-bottom: 1px solid #dee2e6;
      cursor: pointer;
    }
  }

  .iframe-view {
    width: 100%;
    height: calc(100% - 50px);
    border: none;
  }
}
</style>
