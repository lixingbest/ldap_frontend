<template>
  <Sidebar style="width: 400px" @hide="closeDialog"
           position="right" :showCloseIcon="false"
           v-model:visible="show">
    <div class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <h4 class="p-field">{{ isAdd ? '新建' : '编辑' }}命令</h4>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>命令：</label>
          <div class="p-col">
            <InputText v-model="form.sudocmd"
                       :class="{'p-invalid':v$.form.sudocmd.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.sudocmd.required.$invalid && form.$submitted">此项为必填项！</small>
            <small class="p-error"
                   v-if="v$.form.sudocmd.checkUnCN.$invalid && form.$submitted">不能输入汉字！</small>
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
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

export default {
  setup: () => ({v$: useVuelidate()}),
  name: "AddOrUpdateCommand",
  data() {
    return {
      show: false,
      isAdd: true,
      cn: null,
      form: {
        domainId: null,
        sudocmd: null,
        description: null,
      }
    }
  },
  validations() {
    return {
      form: {
        domainId: {},
        sudocmd: {
          required,
          checkUnCN: this.$global.Check.checkUnCN
        },
        description: {},
        $submitted: {}
      }
    }
  },
  methods: {
    init(data, cn, domainId) {
      this.show = true
      this.cn = cn

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

      this.$http.get('/sudo_cmd/save', {
        params: this.form
      }).then(() => {
        this.$http.get('/sudo_cmd_group/addSudoCmd', {
          params: {
            groupCN: this.cn[0],
            cmdCN: this.form.sudocmd,
            domainId: this.form.domainId
          }
        }).then(() => {
          this.$toast.add({severity: 'info', summary: '添加成功！ ', life: 3000});
          this.closeDialog()
        })
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
