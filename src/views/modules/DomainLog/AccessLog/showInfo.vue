<template>
  <Dialog v-model:visible="display" header="详细信息" style="width:30rem">
    <div>
          <div>
      <div class="formItem">
        <label>【所属域】:</label>
        <span>{{ data.domain }}</span>
      </div>
      <!-- <div class="formItem">
        <label>【域控DN】:</label>
        <span>{{ data.domainDn }}</span>
      </div> -->
      <div class="formItem">
        <label>【域名】:</label>
        <span>{{ data.domainName }}</span>
      </div>
      <div class="formItem">
        <label>【组织单位】:</label>
        <span>{{ data.ouName }}</span>
      </div>
      <!-- <div class="formItem">
        <label>【OUDN】:</label>
        <span>{{ data.ouDn }}</span>
      </div> -->
      <!-- <div class="formItem">
        <label>【ID】:</label>
        <span>{{ data.id }}</span>
      </div>
      <div class="formItem">
        <label>【DomainId】:</label>
        <span>{{ data.domainId }}</span>
      </div> -->
      <!-- <div class="formItem">
        <label>【OUID】:</label>
        <span>{{ data.ouId }}</span>
      </div> -->
      <div class="formItem">
        <label>【用户登录名】:</label>
        <span>{{ data.uid }}</span>
      </div>
      <div class="formItem">
        <label>【用户名】:</label>
        <span>{{ data.userName }}</span>
      </div>
      <!-- <div class="formItem">
        <label>【工号】:</label>
        <span>{{ data.jobNo }}</span>
      </div> -->
      <div class="formItem">
        <label>【主机名】:</label>
        <span>{{ data.hostname }}</span>
      </div>
      <div class="formItem">
        <label>【IP】:</label>
        <span>{{ data.ip }}</span>
      </div>
      <div class="formItem">
        <label>【操作时间】:</label>
        <span>{{ data.accessTime }}</span>
      </div>
      <div class="formItem">
        <label>【系统名称】:</label>
        <span>{{ data.sysName }}</span>
      </div>
      <div class="formItem">
        <label>【系统架构】:</label>
        <span>{{ data.sysArch }}</span>
      </div>
      <div class="formItem">
        <label>【系统版本】:</label>
        <span>{{ data.sysVersion }}</span>
      </div>
      <div class="formItem">
        <label>【日志级别】:</label>
        <span>{{ data.level=='info'?'消息':(data.level=='warn'?'警告':(data.level=='error'?'错误':null)) }}</span>
      </div>
      <div class="formItem">
        <label>【事件类型】:</label>
        <span>{{ data.action }}</span>
      </div>
      <div class="formItem">
        <label>【明细】:</label>
        <span>{{ data.details }}</span>
      </div>
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
