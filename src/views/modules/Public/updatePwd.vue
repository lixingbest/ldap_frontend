<template>
  <Dialog :header="title" style="width:350px" :modal="true"
          v-model:visible="display" @hide="closeDialog">
    <div v-if="!confirm" class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>密码：</label>
          <div class="p-col">
            <InputText v-model.trim="form.password" type="password"
                       :class="{'p-invalid':v$.form.password.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.password.minLength.$invalid && form.$submitted">至少为6位字符</small>
            <small class="p-error" v-if="v$.form.password.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>再次输入：</label>
          <div class="p-col">
            <InputText v-model.trim="form.againPassword" type="password"
                       :class="{'p-invalid':!(form.againPassword!=null&&form.password==form.againPassword)&& form.$submitted}"></InputText>
            <small class="p-error" v-if="form.password!=form.againPassword && form.$submitted">两次密码不同！</small>
            <small class="p-error" v-if="v$.form.password.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field footer">
          <div style="display: flex">
            <Button class="p-button-outlined p-mr-2" @click="closeDialog">取消</Button>
            <Button type="submit">重置</Button>
          </div>
        </div>
      </form>
    </div>
    <div v-if="confirm" class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
      <span> 您确认要重置密码吗？</span>
    </div>
    <template v-if="confirm" #footer>
      <Button label="是" icon="pi pi-check" @click="updatePassword"
              class="p-button-link"/>
      <Button label="否" icon="pi pi-times" @click="closeDialog" class="p-button-secondary p-button-link"/>
    </template>
  </Dialog>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {required, minLength} from "@vuelidate/validators";

export default {
  setup: () => ({v$: useVuelidate()}),
  name: "updatePwd",
  data() {
    return {
      title: null,
      url: null,
      parentData: null,
      display: false,
      confirm: false,
      domainId: null,
      form: {
        password: null,
        againPassword: null,
        $submitted: false
      }
    }
  },
  validations() {
    return {
      form: {
        password: {required, minLength: minLength(6)},
        againPassword: {required},
        $submitted: false
      }
    }
  },
  methods: {
    init(url, data, domainId, title) {
      this.display = true
      this.url = url
      this.domainId = domainId
      this.parentData = data
      this.title = title
    },
    closeDialog() {
      this.confirm = false
      this.display = false
      this.$emit('close')
    },
    submit(isInvalid) {
      this.form.$submitted = true;
      if (isInvalid) {
        return;
      }
      if (this.form.password != this.form.againPassword) {
        return;
      }
      this.confirm = true
    },

    updatePassword() {
      if (this.url.indexOf('/admin/saveOrUpdate') !== -1) {
        this.parentData.password = this.$md5(this.form.password)
        this.$http.post(this.url, this.parentData).then(() => {
          this.$toast.add({severity: 'info', summary: '重置成功！', life: 3000});
          this.closeDialog()
        })
      } else if (this.url.indexOf('/domainuser/resetPasswd') !== -1) {
        let data = {}
        data.uid = this.parentData.uid[0]
        data.password = this.form.password
        data.domainId = this.domainId
        this.$http.get(this.url, {
          params: data
        }).then(() => {
          this.$toast.add({severity: 'info', summary: '重置成功！', life: 3000});
          this.closeDialog()
        })
      }
    }

  }
}
</script>

<style scoped>
.p-grid > label {
  width: 100px;
  justify-content: flex-end;

}

.p-field {
  width: 90%;
}

.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.dangerButton {
  margin-top: 20px;
  display: inline-block;
  width: 40%;
  padding: 0;
}
</style>
