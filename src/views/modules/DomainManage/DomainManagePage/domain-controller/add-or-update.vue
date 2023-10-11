<template>
  <Sidebar style="width: 500px"
           @hide="close" :dismissable="false"
           position="right" :showCloseIcon="false"
           v-model:visible="display">
    <h5>{{ isAdd ? '新建' : '编辑' }}域控制器</h5>
    <form @submit.prevent="submit(v$.$invalid)">
      <div class="p-fluid p-mt-5">
        <div class="p-grid">
          <label><span class="required">*</span>主机名称：</label>
          <div class="p-col p-pt-0">
            <InputText v-model="form.fqdn" disabled
                       :class="{'p-invalid':v$.form.fqdn.$invalid && form.$submitted}"/>
            <small class="p-error"
                   v-if="v$.form.fqdn.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-grid">
          <label><span class="required">*</span>主机描述：</label>
          <div class="p-col p-pt-0">
            <InputText v-model="form.description"
                       :class="{'p-invalid':v$.form.description.$invalid && form.$submitted}"/>
            <small class="p-error"
                   v-if="v$.form.description.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-grid">
          <label><span class="required">*</span>架构：</label>
          <div class="p-col p-pt-0">
            <InputText v-model="form.nshardwareplatform"
                       :class="{'p-invalid':v$.form.nshardwareplatform.$invalid && form.$submitted}"/>
            <small class="p-error"
                   v-if="v$.form.nshardwareplatform.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-grid">
          <label><span class="required">*</span>操作系统：</label>
          <div class="p-col p-pt-0">
            <InputText v-model="form.nsosversion"
                       :class="{'p-invalid':v$.form.nsosversion.$invalid && form.$submitted}"/>
            <small class="p-error"
                   v-if="v$.form.nsosversion.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="buttons">
          <Button class="p-button-text" @click="display=false">取消</Button>
          <Button type="submit">保存</Button>
        </div>
      </div>
    </form>
  </Sidebar>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

export default {
  setup: () => ({
    v$: useVuelidate()
  }),
  name: "add-or-update-domain-controller",
  data() {
    return {
      display: false,
      isAdd: true,
      domainId: null,
      form: {
        fqdn: null,
        description: null,
        nshardwareplatform: null,
        nsosversion: null,
        $submitted: false,
      }
    }
  },
  validations() {
    return {
      form: {
        $submitted: {},
        fqdn: {required},
        description: {required},
        nshardwareplatform: {required},
        nsosversion: {required},
      }
    }
  },
  methods: {
    init(data, domainId) {
      this.display = true
      this.domainId = domainId
      if (data == null) {
        this.isAdd = true
      } else {
        this.isAdd = false
        console.log(data)
        this.form.fqdn = data.fqdn[0]
        this.form.description = data.description ? data.description[0] : null
        this.form.nshardwareplatform = data.nshardwareplatform ? data.nshardwareplatform[0] : null
        this.form.nsosversion = data.nsosversion ? data.nsosversion[0] : null
      }


    },
    close() {
      this.$emit('close')
    },
    submit(isInvalid) {
      this.form.$submitted = true;
      if (isInvalid) {
        return;
      }
      delete this.form.$submitted
      this.form['domainId'] = this.domainId
      this.$http.get('/dc/update', {
        params: this.form
      }).then(() => {
        this.$toast.add({severity: 'info', summary: '修改成功！', life: 3000});
        this.display = false
      })
    }
  }
}
</script>

<style scoped>
h5 {
  font-weight: 600;
}

.p-grid {
  margin: 0 0 1rem 0;
}

.p-grid > label {
  width: 150px;
  text-align: right;
}

.buttons {
  text-align: right;
}

.buttons button {
  width: auto;
}
</style>
