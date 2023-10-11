<template>
  <div style="height: 100%" id="all">
    <router-view></router-view>
    <Toast :baseZIndex="1000"/>
    <div v-show="loadingState" class="blockUI" @click="clickMsk($event)">
      <ProgressSpinner style="width:50px;height:50px" strokeWidth="5" animationDuration="1s" class="loading"/>
    </div>
  </div>
</template>
<script>

export default {
  computed: {
    loadingState() {
      return this.$store.state.show_loading
    }
  },
  mounted() {
    let _this = this
    window['toast'] = function (mes) {
      _this.$toast.add({severity: 'error', summary: mes.summary, detail: mes.detail, life: 3500});
    }
  },
  methods: {
    clickMsk(e) {
      e.stopPropagation()
      console.log('正在发送请求中....')
    }
  }
}
</script>
<style lang="scss">
.blockUI {
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
}

.disabled {
  pointer-events: none;
  cursor: not-allowed;
}

.loading {
  z-index: 9999;
  position: fixed !important;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
}
</style>
