<template>
  <div class="view">
    <h5><span class="pi pi-user p-mr-3" style="font-size:2rem"></span>应用控制与保护</h5>
    <p class="p-text-secondary">提供账号相关安全保障</p>
    <h5 style="font-size: 1.1rem"><span class="pi pi-desktop p-mr-3" style="font-size:1.5rem"></span>检查应用程序完整性</h5>
    <p class="p-text-secondary">检查应用程序完整性，阻止未知或被篡改的应用程序运行</p>
    <div class="p-field-radiobutton">
      <RadioButton id="city1" name="city" value="Chicago" v-model="city"/>
      <label for="city1">阻止 仅通过完整性检查的应用可以执行</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city2" name="city" value="Los Angeles" v-model="city"/>
      <label for="city2">警告 检测完整性破坏的应用程序时请提醒我</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city3" name="city" value="New York" v-model="city"/>
      <label for="city3">关闭 无密码长度和字符类型限制</label>
    </div>
    <Button class="p-button-secondary">应用程序完整性配置</Button>

    <div class="p-d-flex p-ai-center p-mb-3 p-mt-4">
      <h5 style="font-size: 1.1rem;margin: 0 1rem 0 0">
        <span class="pi pi-desktop p-mr-3" style="font-size:1.5rem"></span>检查应用程序完整性
      </h5>
      <InputSwitch v-model="checked"/>
    </div>
    <p class="p-text-secondary">检查应用程序完整性，阻止未知或被篡改的应用程序运行</p>
    <Button class="p-button-secondary">应用程序防护配置</Button>
  </div>
</template>

<script>
export default {
  name: "apply-control-protection"
}
</script>

<style scoped>
.view {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  padding: 1rem;
}

h5 {
  font-weight: 600;
}
</style>
