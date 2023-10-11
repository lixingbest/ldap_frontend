<template>
  <Sidebar position="right" modal="true" v-model:visible="display" style="width:40vw" @hide="$emit('close')">
    <template #header>
      <strong>
        {{ data.id ? '编辑终端' : '新增终端' }}
      </strong>
    </template>
    <div class="form">
      <div class="form-item">
        <label><i class="required">*</i>主机名：</label>
        <div class="p-col">
          <InputText placeholder="请输入主机名" class="p-col-12" :class="{'p-invalid':submitted &&v$.hostname.$invalid}" v-model="data.hostname" />
          <small class="p-error" v-if="submitted && v$.hostname.required.$invalid">请输入主机名</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>IP地址：</label>
        <div class="p-col">
          <InputText class="p-col-12" placeholder="请输入IP地址" :class="{'p-invalid':submitted &&v$.ipv4.$invalid}" v-model="data.ipv4" />
          <small class="p-error" v-if="submitted && v$.ipv4.required.$invalid">请输入IP地址</small>
          <small class="p-error" v-if="submitted && v$.ipv4.ipAddress.$invalid">请输入正确IP地址</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>端口：</label>
        <div class="p-col">
          <InputText class="p-col-12" placeholder="请输入端口" v-model="data.sshPort" :class="{'p-invalid':submitted &&v$.sshPort.$invalid}" />
          <small class="p-error" v-if="submitted && v$.sshPort.required.$invalid">请输入端口</small>
          <small class="p-error" v-if="submitted && v$.sshPort.numeric.$invalid">请输入数字</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>超级管理员名称：</label>
        <div class="p-col">
          <InputText class="p-col-12" placeholder="请输入超级管理员名称" v-model="data.account" :class="{'p-invalid':submitted &&v$.account.$invalid}" />
          <small class="p-error" v-if="submitted && v$.account.required.$invalid">请输入管理员名称</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>超级管理员密码：</label>
        <div class="p-col">
          <Password style="width:100%" placeholder="请输入密码" v-model="data.password" :class="{'p-invalid':submitted &&v$.password.$invalid}" />
          <small class="p-error" v-if="submitted && v$.password.required.$invalid">请输入密码</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>再次输入：</label>
        <div class="p-col">
          <Password style="width:100%" placeholder="请输入密码" v-model="data.againPassword" :class="{'p-invalid':submitted &&v$.againPassword.$invalid}" />
          <small class="p-error" v-if="submitted && v$.againPassword.required.$invalid">请输入密码</small>
          <small class="p-error" v-if="submitted && v$.againPassword.sameAsPassword.$invalid">两次密码不一样</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>所属类型：</label>
        <div class="p-col">
          <tree-select class="p-col-12" placeholder="请选择类型" :class="{'p-invalid':submitted &&v$.typeId.$invalid}" :options="typeTree" v-model="selectTypeNode" />
          <small class="p-error" v-if="submitted && v$.typeId.required.$invalid">请选择类型</small>
        </div>
      </div>
      <div class="form-item">
        <label>备注：</label>
        <div class="p-col">
          <Textarea v-model="data.comments" placeholder="请输入..." class="p-col-12" auto-resize />
        </div>
      </div>
      <div class="form-item" style="display:flex;justify-content: flex-end;padding:.5rem">
        <Button label="保存" @click="submit" />
        <Button label="取消" @click="display=false" class="p-button-outlined p-ml-2" />
      </div>
    </div>

  </Sidebar>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch, toRef } from "vue";
import { useVuelidate } from "@vuelidate/core";
import http from "../../../../http";
import { required, numeric, ipAddress, sameAs } from "@vuelidate/validators";

export default {
  name: "addOrUpdateTerminal",
  setup() {
    const display = ref(false);
    const data = reactive({
      id: null,
      hostname: null,
      ipv4: null,
      sshPort: null,
      account: null,
      password: null,
      typeId: null,
      comments: null,
      againPassword: null,
    });

    let password = null;

    const init = (event) => {
      display.value = true;
      console.log(event);

      if (event && event.typeId) {
        selectTypeNode.value[event.typeId] = true;
        data.typeId = event.typeId;
      }

      if (event && event.id) {
        data.id = event.id;
        data.hostname = event.hostname;
        data.ipv4 = event.ipv4;
        data.sshPort = event.sshPort;
        data.account = event.account;
        data.comments = event.comments;
        data.password = event.password;
        data.againPassword = event.password;
        password = event.password;
      }
      getTypeTree();
    };

    const rules = {
      hostname: { required },
      ipv4: { required, ipAddress },
      sshPort: { required, numeric },
      account: { required },
      password: { required },
      typeId: { required },
      againPassword: {
        required,
        sameAsPassword: sameAs(toRef(data, "password")),
      },
    };

    const submitted = ref(false);
    const v$ = useVuelidate(rules, data);

    const typeTree = ref([]);

    const selectTypeNode = ref({});

    watch(
      selectTypeNode,
      (event) => {
        data.typeId = Object.keys(event)[0];
      },
      { deep: true }
    );

    function getTypeTree() {
      http.get("/terminal/getTypeTree").then((res) => {
        typeTree.value = res.data;
      });
    }

    let { proxy } = getCurrentInstance();
    const submit = () => {
      submitted.value = true;
      if (!v$.value.$invalid) {
        //密码改变
        // if (data.password !== password) {
        //   data.password = md5(data.password)
        // }

        http.post("/terminal/addOrUpdate", data).then((res) => {
          if (res.success) {
            proxy.$toast.add({
              severity: "info",
              summary: "保存成功！ ",
              life: 3000,
            });
            display.value = false;
          }
        });
      }
    };
    return {
      display,
      init,
      data,
      submitted,
      v$,
      typeTree,
      selectTypeNode,
      submit,
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
  min-width: 9rem;
  text-align: right;
}

.p-col-12 {
  padding: 0 0.5rem;
}

::v-deep(.p-password input) {
  width: 100%;
}
</style>
