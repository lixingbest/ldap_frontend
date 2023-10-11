<template>
  <Dialog v-model:visible="display" header="详细信息">
    <div>
      <div class="formItem">
        <label>【主机名】:</label>
        <span>{{ data.hostname }}</span>
      </div>
      <div class="formItem">
        <label>【所属域】:</label>
        <span>{{ data.domain }}</span>
      </div>
      <div class="formItem">
        <label>【客户端版本】:</label>
        <span>{{ data.clientVersion }}</span>
      </div>
      <div class="formItem">
        <label>【架构】:</label>
        <span>{{ data.arch }}</span>
      </div>
      <div class="formItem">
        <label>【系统版本】:</label>
        <span>{{ data.sysVersion }}</span>
      </div>
      <div class="formItem">
        <label>【用户名】:</label>
        <span>{{ data.user }}</span>
      </div>
      <div class="formItem">
        <label>【IP地址】:</label>
        <span>{{ data.ip }}</span>
      </div>
      <div class="formItem">
        <label>【开始安装时间】:</label>
        <span>{{ data.beginTime ? new Date(data.beginTime).toLocaleString('chinese',{hour12:false}).replace(/\//g, '-') : '' }}</span>
      </div>
      <div class="formItem">
        <label>【结束安装时间】:</label>
        <span>{{ data.endTime ? new Date(data.endTime).toLocaleString('chinese',{hour12:false}).replace(/\//g, '-') : '' }}</span>
      </div>
      <div class="formItem">
        <label>【当前步骤】:</label>
        <span>{{ data.step === 0 ? '开始安装' : (data.step === 1 ? '结束安装' : '') }}</span>
      </div>
      <div class="formItem">
        <label>【安装结果】:</label>
        <span>{{ data.result === 0 ? '成功' : '失败' }}</span>
      </div>
    </div>
  </Dialog>
</template>

<script>
export default {
  name: "showInfo",
  data() {
    return {
      display: false,
      data: null,
    }
  },
  methods: {
    init(data) {
      this.display = true
      console.log(data)
      this.data = data
    },
  }
}
</script>

<style scoped>
.formItem {
  margin-bottom: 1rem;
  max-width: 600px;
}

.formItem label {
  margin-right: 1rem;
}
</style>
