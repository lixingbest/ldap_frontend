<template>
  <Sidebar style="width: 400px" @hide="closeDialog"
           position="right" :showCloseIcon="false"
           v-model:visible="show">
    <div class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <h4 class="p-field">{{ isAdd ? '新建' : '编辑' }}命令组</h4>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>名称：</label>
          <div class="p-col">
            <InputText v-model="form.cn"
                       :class="{'p-invalid':v$.form.cn.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.cn.required.$invalid && form.$submitted">此项为必填项！</small>
            <small class="p-error" v-if="v$.form.cn.checkName.$invalid && form.$submitted">只能输入英文或数字或_,以字母开头</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed" style="align-items: flex-start">描述：</label>
          <div class="p-col">
            <Textarea v-model="form.description"/>
          </div>
        </div>
        <div class="p-field footer">
          <div style="display: flex">
            <Button class="p-button-outlined p-mr-2" @click="closeDialog">取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </div>
      </form>
    </div>
  </Sidebar>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

export default {
  setup: () => ({v$: useVuelidate()}),
  name: "AddOrUpdateCommandGroup",
  data() {
    return {
      show: false,
      isAdd: true,
      form: {
        domainId: null,
        cn: null,
        description: null,
        $submitted: false
      }
    }
  },
  validations() {
    return {
      form: {
        domainId: {},
        cn: {
          required,
          checkName: this.$global.Check.checkName
        },
        description: {},
        $submitted: {}
      }
    }
  },
  methods: {
    init(data, domainId) {
      this.show = true
      if (data != null && data.cn != null) {
        this.form = data
        this.isAdd = false
      }
      this.form.domainId = domainId
    },
    closeDialog() {
      this.show = false;
      this.$emit('close')
    },
    submit(isInvalid) {
      this.form.$submitted = true;
      // 如果验证失败，则终止
      if (isInvalid) {
        return;
      }
      this.$http.get('/sudo_cmd_group/save', {
        params: this.form
      }).then(() => {
        if (this.isAdd) {
          this.$toast.add({severity: 'info', summary: '添加成功！ ', life: 3000});
        } else {
          this.$toast.add({severity: 'info', summary: '修改成功！ ', life: 3000});
        }
        this.closeDialog()
      })
    }
  }
}
</script>

<style scoped>
.p-grid > label {
  width: 80px;
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
</style>
