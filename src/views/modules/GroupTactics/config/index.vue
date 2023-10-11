<template>
  <div class="page">
    <div class="content">
      <div class="row">
        <label>策略下发间隔：</label>
        <div class="p-col">
          <InputNumber suffix="分钟" v-model="timeInterval"></InputNumber>
        </div>
      </div>
      <div class="row p-justify-end p-p-2">
        <Button @click="submit">修改</Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import http from "@/http";
import {useToast} from 'primevue/usetoast'

let toast = useToast();

const timeInterval = ref(0)



function get() {
  http.get('/sysConfig/get/strategy_interval').then(res => {
    if (res.success) {
      timeInterval.value = parseInt(res.data);
    }
  })
}

get();

function submit() {
  http.post("/sysConfig/update", [{name: "strategy_interval", value: timeInterval.value}]).then(res => {
    if (res.success) {
      toast.add({
        severity: "info",
        summary: "修改成功！",
        life: 3000,
      })
    }
  })
}
</script>
<style scoped lang="scss">
.page {
  display: flex;
  align-items: center;
  justify-content: center;

  .content {

    display: flex;
    flex-direction: column;
    row-gap: 1rem;

    .row {
      display: flex;
      align-items: center;
    }
  }
}
</style>
