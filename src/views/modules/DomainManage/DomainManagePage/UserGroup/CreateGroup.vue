<template>
  <Sidebar style="width: 500px" @hide="closeDialog"
           position="right" :showCloseIcon="false"
           v-model:visible="show">
    <div class="p-fluid content">
      <h4 class="p-field">{{ form.cn == null ? '新建' : '编辑' }}用户组</h4>
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>组名称：</label>
          <div class="p-col">
            <InputText v-model="form.cn"
                       :class="{'p-invalid':v$.form.cn.$invalid && form.$submitted}"
                       placeholder="请输入组名称"></InputText>
            <small class="p-error" v-if="v$.form.cn.required.$invalid && form.$submitted">此项为必填项！</small>
            <small class="p-error" v-if="v$.form.cn.checkName.$invalid && form.$submitted">只能为数字或字母，首字符不能为数字！</small>
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
  name: "CreateGroup",
  emits: ['close'],
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      isAdd:true,
      show: false,
      form: {
        domainId: null,
        ouCN: null,
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
        ouCN: {},
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
    init(key, data, domainId) {
      this.show = true
      if (data && data.id != null) {
        this.isAdd=false
        this.form = data
      } else {
        this.isAdd=true
        this.form.ouCN = key.split('-')[0]
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


      this.$http.get('/usergroup/save', {
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
  width: 130px;
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

.p-fluid .p-button {
  width: auto;
}

</style>
