<template>
  <Dialog v-model:visible="display" header="添加角色" @hide="$emit('close')" :modal="true" class="p-fluid">
    <div class="p-fluid">
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end"><span style="color:red;margin-right: 4px;">*</span>角色姓名：</label>
        <div class="p-col">
          <InputText v-model="form.name" :class="{'p-invalid':(v$.form.name.$invalid && submitted)}"></InputText>
          <span v-if="v$.form.name.required.$invalid && submitted" style="font-size: 12px;color: red">请输入角色姓名！</span>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end"><span style="color:red;margin-right: 4px;">*</span>编号：</label>
        <div class="p-col">
          <InputText v-model="form.code" @blur="hasRoleCode(form.code)" :class="{'p-invalid':hasCode||(v$.form.code.$invalid && submitted)}"></InputText>
          <span v-if="v$.form.code.required.$invalid && submitted" style="font-size: 12px;color: red">请输入编号！</span>
          <span v-if="hasCode" style="font-size: 12px;color: red">编号已存在！</span>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end"><span style="color:red;margin-right: 4px;">*</span>是否启用：</label>
        <div class="p-col">
          <Checkbox v-model="checked" :binary="true" />
        </div>
      </div>

    </div>
    <template #footer>
      <Button @click="display=false" class="p-button-text">取消</Button>
      <Button @click="submit(v$.$invalid)">确认</Button>
    </template>
  </Dialog>
</template>


<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Checkbox from "primevue/checkbox";

export default {
  name: "addOrUpdateRole",
  components: { Checkbox },
  setup: () => ({
    v$: useVuelidate(),
  }),
  data() {
    return {
      display: false,
      submitted: false,
      checked: false,
      form: {
        name: null,
        code: null,
        enable: null,
      },
      isAdd: true,
      hasCode: false,
    };
  },
  validations() {
    return {
      form: {
        name: { required },
        code: { required },
        enable: {},
      },
    };
  },
  methods: {
    init(data) {
      this.display = true;
      if (data) {
        if (data.enable == 0) {
          this.checked = true;
        } else if (data.enable == 1) {
          this.checked = false;
        }
        this.form = JSON.parse(JSON.stringify(data));
        if (data.id) {
          this.isAdd = false;
        }
      }
    },
    hasRoleCode(code) {
      this.$http.get("/role/hasRoleCode/" + code).then((res) => {
        this.hasCode = res.data;
      });
    },
    submit(isInvalid) {
      this.submitted = true;
      console.log(this.hasCode);
      if (this.hasCode) {
        return;
      }
      if (isInvalid) {
        return;
      }
      console.log(this.form.enable);
      if (this.form.enable == "启用") {
        this.form.enable = 0;
      } else if (this.form.enable == "禁用") {
        this.form.enable = 1;
      }
      if (this.form.enable == true) {
        this.form.enable = 0;
      } else if (this.form.enable == false) {
        this.form.enable = 1;
      }
      if (this.checked == true) {
        this.form.enable = 0;
      } else if (this.checked == false) {
        this.form.enable = 1;
      }
      this.$http.post("/role/addOrUpdate", this.form).then((res) => {
        this.display = false;
        this.$toast.add({
          severity: "success",
          summary: this.isAdd ? "添加成功" : "修改成功",
          life: 3000,
        });
      });
    },
  },
};
</script>

<style scoped>
.p-fluid {
  width: 450px;
}

/*.p-field {*/
/*  margin: 0 auto 2rem;*/
/*}*/

label {
  width: 200px;
  text-align: right;
  justify-content: flex-end;
}

.p-field > span {
  width: 100%;
  padding-left: 200px;
  line-height: 34px;
  color: red;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
