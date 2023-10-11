<template>
  <Dialog v-model:visible="display" header="详细信息" style="width:30rem">
    <div>
          <div>
      <div class="formItem">
        <label>【所属域】:</label>
        <span>{{ data.domainName }}</span>
      </div>
      <div class="formItem">
        <label>【账号】:</label>
        <span>{{ data.username }}</span>
      </div>
      <div class="formItem">
        <label>【操作时间】:</label>
        <span>{{ data.time }}</span>
      </div>
      <div class="formItem">
        <label>【资源】:</label>
        <span>{{ data.menu }}</span>
      </div>
      <div class="formItem">
        <label>【操作类型】:</label>
        <span>{{ data.type }}</span>
      </div>
      <div class="formItem">
        <label>【操作内容】:</label>
        <span>{{ data.message }}</span>
      </div>
      <div class="formItem">
        <label>【操作数据】:</label>
        <span>{{ data.data }}</span>
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
