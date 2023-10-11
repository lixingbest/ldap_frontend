<template>
  <Sidebar position="right" :showCloseIcon="true" style="width: 650px" v-model:visible="display"
           @hide="$emit('close')">
    <template #header><strong>添加模板</strong></template>
    <div class="form">
      <div class="form-item">
        <label><i class="required">*</i>模板名称：</label>
        <div class="p-col">
          <InputText v-model="data.form.name"
                     :class="{'p-invalid':data.submitted && v$.form.name.$invalid }"></InputText>
          <small class="p-error" v-if="data.submitted && v$.form.name.required.$invalid">请输入名称</small>
        </div>
      </div>
      <div class="form-item" v-if="data.form.id===null">
        <label><i class="required">*</i>模板编码：</label>
        <div class="p-col">
          <InputText v-model="data.form.code"
                     :class="{'p-invalid':data.submitted && v$.form.code.$invalid }"></InputText>
          <small class="p-error" v-if="data.submitted && v$.form.code.requiredIf.$invalid">请输入编码</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>模板分类：</label>
        <div class="p-col">
          <tree-select v-model="data.selectedType" :options="data.typeTreeData"
                       :class="{'p-invalid':data.submitted && v$.selectedType.$invalid }"></tree-select>
          <small class="p-error" v-if="data.submitted && v$.selectedType.ObjectNotNull.$invalid">请选择类型</small>
        </div>
      </div>


      <div class="form-item">
        <label><i class="required">*</i>模板内容：</label>
        <div class="p-col">
          <Textarea v-model="data.form.shell" auto-resize
                    :class="{'p-invalid':data.submitted && v$.form.shell.$invalid }"></Textarea>
          <small class="p-error" v-if="data.submitted && v$.form.shell.required.$invalid">请输入内容</small>
        </div>
      </div>

      <div class="form-item">
        <label>备注：</label>
        <div class="p-col">
          <Textarea v-model="data.form.comments" auto-resize
          ></Textarea>
        </div>
      </div>
      <div style="text-align: right;width: 100%;padding-right: 1rem">
        <Button label="取消" class="p-button-outlined p-mr-3" @click="display=false"></Button>
        <Button label="提交" icon="pi pi-save" @click="submit"/>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import {ref, reactive} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required, requiredIf} from "@vuelidate/validators";
import http from "@/http";
import {useToast} from 'primevue/usetoast'

export default {
  name: "AddOrUpdateTemp",
  setup() {
    const toast = useToast();
    const display = ref(false)

    function init(item) {
      display.value = true
      if (item && item.pid) {
        data.selectedType[item.pid] = true
      }
      if (item && item.id) {
        data.form = item
      }
      getTypeTree()


    }

    function getTypeTree() {
      http.get('/shellTemp/getTree').then(res => {
        data.typeTreeData = res.data
      })
    }


    const data = reactive({
      form: {
        id: null,
        pid: null,
        name: null,
        code: null,
        shell: null,
        comments: null
      },
      submitted: false,
      typeTreeData: [],
      selectedType: {},
    })
    const ObjectNotNull = (value) => value instanceof Object && Object.keys(value) > 0
    const rules = {
      form: {
        name: {required},
        code: {requiredIf: requiredIf(data.form.id === null)},
        shell: {required}
      },
      selectedType: {ObjectNotNull}
    }

    const v$ = useVuelidate(rules, data);

    function submit() {
      data.submitted = true
      if (v$.value.$invalid) {
        return
      }
      data.form.pid = Object.keys(data.selectedType)[0]
      http.post('/shellTemp/addOrUpdate', data.form).then(res => {
        if (res.success) {
          toast.add({
            severity: 'info',
            summary: '删除成功！',
            life: 3000
          })
          display.value = false
        }
      })
    }

    return {display, init, data, v$, submit}
  }
}
</script>

<style scoped>
.form {
  display: flex;
  padding: 0 2rem;
  flex-wrap: wrap;
}

.form-item {
  width: 100%;
  margin-bottom: 2rem;
}

.form-item label {
  min-width: 7rem;
  display: inline-block;
  text-align: right;
}

.form-item > .p-col > :first-child {
  width: 100%;
}
</style>