<template>
  <Sidebar v-model:visible="display" style="width:400px"
           position="right" @hide="close()"
           :show-close-icon="false">
    <template #header>
      <h5 style="margin: 0">{{ isAdd ? '新建' : '编辑' }}{{ this.form.type === 0 ? '目录' : '策略配置' }}</h5>
    </template>
    <form @submit.prevent="submit(v$.$invalid)">
      <div class="p-fluid p-mt-5">
        <div class="p-grid">
          <label><span class="required">*</span>名称：</label>
          <div class="p-col p-pt-0">
            <InputText v-model="form.name"
                       :class="{'p-invalid':v$.form.name.$invalid && form.$submitted}"/>
            <small class="p-error"
                   v-if="v$.form.name.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-grid">
          <label><span class="required">*</span>编号：</label>
          <div class="p-col p-pt-0">
            <InputText v-model="form.code"
                       :class="{'p-invalid':v$.form.code.$invalid && form.$submitted}"/>
            <small class="p-error"
                   v-if="v$.form.code.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-grid">
          <label>备注：</label>
          <div class="p-col p-pt-0">
            <Textarea v-model="form.comments"/>
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
import {
  required
} from "@vuelidate/validators";

export default {
  setup: () => ({
    v$: useVuelidate()
  }),
  name: "add-or-update-device",
  data() {
    return {
      isAdd: true,
      display: false,
      form: {
        // 0 目录 1策略配置
        type: 0,
        name: null,
        code: null,
        comments: null,
        domainId: null,
        pid: null,
        $submitted: false
      }
    }
  },
  validations() {
    return {
      form: {
        $submitted: {},
        type: {required},
        name: {required},
        code: {required},
        comments: {},
        domainId: {required}
      }
    }
  },

  methods: {
    init(isAdd, data) {
      this.display = true
      this.isAdd = isAdd
      if (isAdd) {
        this.form.type = data.type
        this.form.domainId = data.domainId
        if(data.sign=="domain"){
          this.form.pid=null
        }else{
          this.form.pid = data.id.indexOf('_') !== -1 ? data.id.split('_')[1] : data.id
        }
        
      } else {
        this.$http.get('/strategy/settings/get', {
          params: {id: data.id}
        }).then((res) => {
          this.form = res.data
          this.form.$submitted = false
        })
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
      delete this.form.updateTime
      // if(this.isAdd){
        
      // }
      this.$http.get(this.isAdd ? '/strategy/settings/save' : '/strategy/settings/update', {
        params: this.form
      }).then(() => {
        this.display = false
        this.$toast.add({
          severity: 'info',
          summary: this.isAdd ? '添加成功！' : '编辑成功',
          life: 3000
        })
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
  width: 80px;
  text-align: right;
}

.buttons {
  text-align: right;
}

.buttons button {
  width: auto;
}
</style>
