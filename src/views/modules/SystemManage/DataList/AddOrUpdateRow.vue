<template>
  <Sidebar v-model:visible="display" style="width: 450px" @hide="closeDialog"
           position="right" :showCloseIcon="false">
    <h4 class="p-field p-pl-3">{{ isAdd ? '添加明细' : '编辑明细' }}</h4>
    <div class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>编号：</label>
          <div class="p-col">
            <InputText v-model.trim="form.code" :disabled="isAdd?null:'disabled'"
                       :class="{'p-invalid':v$.form.code.$invalid && $submitted}"></InputText>
            <small class="p-error"
                   v-if="v$.form.code.$invalid && $submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>值：</label>
          <div class="p-col">
            <InputText v-model.trim="form.value"
                       :class="{'p-invalid':v$.form.value.$invalid && $submitted}"></InputText>
            <small class="p-error"
                   v-if="v$.form.value.$invalid && $submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required"></label>备注：</label>
          <div class="p-col">
            <Textarea v-model.trim="form.comments"></Textarea>
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
  setup: () => ({
    v$: useVuelidate()
  }),
  props: ['selectRow'],
  name: "AddOrUpdateRow",
  data() {
    return {
      display: false,
      isAdd: true,
      form: {
        id: null,
        dictItemId: null,
        code: null,
        value: null,
        comments: null
      },
      $submitted: false
    }
  },
  validations() {
    return {
      form: {
        id: {},
        dictItemId: {},
        code: {required},
        value: {required},
        comments: {}
      }
    }
  },
  methods: {
    init(data) {
      this.display = true
      if (typeof data !== 'number') {
        this.isAdd = false
        this.form = JSON.parse(JSON.stringify(data))
      } else {
        this.isAdd = true
        this.form.dictItemId = data
      }
    },
    closeDialog() {
      this.display = false
      this.$emit('close')
    },
    changeTreeNode(node) {
      this.form.dictItemId = node.key
    },
    submit(isInvalid) {
      this.$submitted = true
      if (isInvalid) return;
      this.$http.get('/dictrecords/saveOrUpdate', {
        params: this.form
      }).then(() => {
        this.$toast.add({
          severity: 'info',
          summary: this.isAdd ? '添加成功!' : '修改成功！',
          life: 3000
        })
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
</style>
