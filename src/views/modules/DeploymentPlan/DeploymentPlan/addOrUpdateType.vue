<template>
  <Dialog v-model:visible="display" :header="form.id?'编辑类型':'新增类型'" :modal="true" @hide="$emit('close')" style="width:40vw">
    <div class="form">
      <div class="form-item">
        <label><i class="required">*</i>名称：</label>
        <div class="p-col">
          <InputText class="p-col-12" placeholder="请输入名称" :class="{'p-invalid':submitted &&v$.name.$invalid}" v-model="form.name" />
          <small class="p-error" v-if="submitted && v$.name.required.$invalid">请输入名称</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>编码：</label>
        <div class="p-col">
          <InputText class="p-col-12" placeholder="请输入编码" :class="{'p-invalid':submitted &&v$.code.$invalid}" v-model="form.code" />
          <small class="p-error" v-if="submitted && v$.code.required.$invalid">请输入名称</small>
          <small class="p-error" v-if="submitted && v$.code.isOnly.$invalid">编码已存在</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>父类型：</label>
        <div class="p-col">
          <tree-select class="p-col-12" :options="typeTree" placeholder="请选择类型" :class="{'p-invalid':submitted &&v$.pid.$invalid}" v-model="selectTypeNode" />
          <small class="p-error" v-if="submitted &&v$.pid.required.$invalid">请选择父类型</small>
        </div>
      </div>
      <div class="form-item">
        <label>备注：</label>
        <div class="p-col">
          <Textarea class="p-col-12" auto-resize placeholder="请输入..." v-model="form.comments" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="保存" @click="save" icon="pi pi-save" />
      <Button label="取消" @click="display=false" class="p-button-outlined" />
    </template>
  </Dialog>
</template>

<script>
import { ref, reactive, watch, getCurrentInstance } from "vue";
import http from "../../../../http";

import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "addOrUpdateType",
  setup() {
    const display = ref(false);
    const form = reactive({
      id: null,
      name: null,
      pid: null,
      code: null,
      comments: null,
    });

    function init(type, node) {
      display.value = true;
      getTypeTree();

      if (type === "add") {
        form.pid = node.data.id;
        selectTypeNode.value[node.data.id] = true;
      } else if (type === "update") {
        form.id = node.data.id;
        form.name = node.data.name;
        form.code = node.data.code;
        form.comments = node.data.comments;
        form.pid = node.data.pid;
        selectTypeNode.value[node.data.pid] = true;
      }
    }

    const typeTree = ref([]);

    const selectTypeNode = ref({});

    watch(
      selectTypeNode,
      (map) => {
        if (map && map instanceof Object) {
          form.pid = Object.keys(map)[0];
        }
      },
      { deep: true }
    );

    function getTypeTree() {
      http.get("/deploy/typeTree").then((res) => {
        typeTree.value = res.data;
      });
    }

    const hasCode = async (value) => {
      const response = await http.get(
        "/deploy/hasTypeCode/" + value + "/" + form.id
      );
      return !response.data;
    };
    const rules = {
      name: { required },
      code: { required, isOnly: helpers.withAsync(hasCode) },
      pid: { required },
    };
    const submitted = ref(false);
    const v$ = useVuelidate(rules, form);

    let { proxy } = getCurrentInstance();

    function save() {
      submitted.value = true;
      if (!v$.value.$invalid) {
        http.post("/deploy/addOrUpdateType", form).then((res) => {
          if (res.success) {
            proxy.$toast.add({
              severity: "info",
              summary: "修改成功！ ",
              life: 3000,
            });
            display.value = false;
          }
        });
      }
    }

    return {
      display,
      form,
      init,
      typeTree,
      selectTypeNode,
      v$,
      submitted,
      save,
    };
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
}

.form-item {
  width: 68%;
  margin-bottom: 1rem;
  display: flex;
}

label {
  display: inline-block;
  min-width: 5rem;
  text-align: right;
}

.p-col-12 {
  padding: 0 0.5rem;
}
</style>
