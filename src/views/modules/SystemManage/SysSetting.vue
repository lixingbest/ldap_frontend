<template>
  <div class="page">
    <div class="form">
      <div class="form-item">
        <label>是否启用验证码:</label>
        <div class="p-col">
          <InputSwitch v-model="configMap.verification_code_enable" true-value="true" false-value="false"></InputSwitch>
        </div>
      </div>
      <div class="form-item">
        <label>密码锁定错误次数:</label>
        <div class="p-col">
          <InputNumber v-model="configMap.password_errors_number" min="1"></InputNumber>
        </div>
      </div>
      <div class="form-item">
        <label>锁定时间:</label>
        <div class="p-col">
          <InputNumber v-model="configMap.lock_time" suffix="分钟"></InputNumber>
        </div>
      </div>
      <Button label="设置" class="p-mr-2" @click="submit"/>
    </div>
  </div>

</template>

<script>
import http from "@/http";
import {ref} from "vue";
import {useToast} from "primevue/usetoast";

export default {
  name: "SysSetting",
  setup() {
    const toast = useToast()
    const configMap = ref({})

    function getList() {
      http.get('/sysConfig/getList').then(res => {
        if (res.success) {
          res.data.forEach(item => {
            configMap.value[item.name] = item.value
          })
        }
      })
    }

    getList()


    function submit() {
      const list = []
      for (let key in configMap.value) {
        if (configMap.value.hasOwnProperty(key)) {
          list.push({
            name: key,
            value: configMap.value[key]
          })
        }
      }

      http.post('/sysConfig/update', list).then(res => {
        if (res.success) {
          toast.add({
            severity: 'info',
            summary: '修改成功！ ',
            life: 3000
          })
        }
      })
    }

    return {configMap, submit}
  }
}
</script>

<style scoped>
.page {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 40%;
  text-align: right;
}

.form-item {
  margin-bottom: 2rem;
  text-align: left;
}

.form-item label {
  display: inline-block;
  width: 35%;
  text-align: right;
}

.form-item .p-col > :first-child:not(.p-inputswitch) {
  width: 100%;
}
</style>
