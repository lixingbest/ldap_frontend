<template>
  <Sidebar v-model:visible="display" style="width: 450px" @hide="closeDialog"
           position="right" :showCloseIcon="false">
    <h4 class="p-field p-pl-3">{{ isAdd ? '添加类别' : '编辑类别' }}</h4>
    <div class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>父类别：</label>
          <div class="p-col">
            <TreeSelect v-model="parentType" class="input" @change="changeTreeNode" :options="treeList"
                        placeholder="请选择父类别" :class="{'p-invalid':v$.parentType.$invalid && $submitted}"/>
            <small class="p-error"
                   v-if="v$.parentType.required.$invalid && $submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>类别名：</label>
          <div class="p-col">
            <InputText v-model.trim="form.name"
                       :class="{'p-invalid':v$.form.name.$invalid && $submitted}"></InputText>
            <small class="p-error"
                   v-if="v$.form.name.required.$invalid && $submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>编号：</label>
          <div class="p-col">
            <InputText v-model.trim="form.code" :disabled="isAdd?null:'disabled'"
                       :class="{'p-invalid':v$.form.code.$invalid && $submitted}"></InputText>
            <small class="p-error"
                   v-if="v$.form.code.required.$invalid && $submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required"> </label>描述：</label>
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
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

export default {
  name: "addOrUpdateType",
  setup: () => ({
    v$: useVuelidate()
  }),
  props: ['treeList', 'selectNode'],
  data() {
    return {
      display: false,
      isAdd: true,
      form: {
        id: null,
        pid: null,
        code: null,
        name: null,
        comments: null,
      },
      parentType: {},
      $submitted: false
    }
  },
  validations() {
    return {
      form: {
        id: {},
        pid: {},
        code: {required},
        name: {required},
        comments: {},
      },
      parentType: {required},
      $submitted: {}
    }
  },
  methods: {
    init(node) {
      this.display = true
      if (node == null) {
        this.isAdd = true
        this.parentType[this.selectNode.id] = true
        this.form.pid = this.selectNode.id
      } else {
        this.isAdd = false
        try {
          let data = JSON.parse(JSON.stringify(node))
          this.form = data
          this.parentType[data.pid] = true
        } catch (e) {
          console.log(e)
        }

      }
    },
    closeDialog() {
      this.display = false
      this.$emit('close')
    },
    changeTreeNode(node) {
      if (Number(Object.keys(node)[0]) === this.form.id) {
        this.$toast.add({
          severity: 'info',
          summary: '请正确选择父类别！',
          life: 3000
        })
        this.parentType = {}
        this.parentType[this.form.pid] = true
      } else {
        this.form.pid = Object.keys(node)[0]
      }
    },
    submit(isInvalid) {
      this.$submitted = true;
      if (isInvalid) return;

      this.$http.get('/dict/saveOrUpdate', {
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
