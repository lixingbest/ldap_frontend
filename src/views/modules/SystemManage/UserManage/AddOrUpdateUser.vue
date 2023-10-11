<template>
  <Sidebar position="right" :showCloseIcon="false" style="width: 450px" v-model:visible="display" @hide="closeDialog">
    <template #header>
      <strong>{{ form.id == null ? '添加管理员' : '编辑管理员' }}</strong>
    </template>
    <div class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">

        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>姓名：</label>
          <div class="p-col">
            <InputText v-model.trim="form.name" :class="{'p-invalid':v$.form.name.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.name.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>工号：</label>
          <div class="p-col">
            <InputText v-model.trim="form.jobno" :class="{'p-invalid':v$.form.jobno.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.jobno.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed">组织单位：</label>
          <div class="p-col">
            <TreeSelect v-model="form.beforeOU" class="input" @change="changOU" :options="treeList" placeholder="请选择组织单位" />

          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">部门：</label>
          <div class="p-col">
            <InputText v-model.trim="form.dept"></InputText>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>所属角色：</label>
          <div class="p-col">
            <Dropdown :options="roleList" v-model="form.roleName" optionLabel="name" :placeholder="data.roleName?data.roleName:'请选择所属角色'"></Dropdown>
            <small class="p-error" v-if="v$.form.roleName.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>管理域：</label>
          <div class="p-col">
            <TreeSelect v-model="form.beforeDC" class="input" :options="domainList" placeholder="请选择域" :class="{'p-invalid':v$.form.beforeDC.$invalid && form.$submitted}" />
            <small class="p-error" v-if="v$.form.beforeDC.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>

        <div v-if="isAdd" class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>密码：</label>
          <div class="p-col">
            <InputText type="password" v-model.trim="form.beforePassword" :class="{'p-invalid':v$.form.beforePassword.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.beforePassword.minLength.$invalid && form.$submitted">至少为6位字符</small>
            <small class="p-error" v-if="v$.form.beforePassword.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>

        <div v-if="isAdd" class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>确认密码：</label>
          <div class="p-col">
            <InputText type="password" v-model.trim="form.SPassword" :class="{'p-invalid':  !(form.SPassword!=null&&form.beforePassword==form.SPassword) && form.$submitted}">
            </InputText>
            <small class="p-error" v-if="form.beforePassword!=form.SPassword && form.$submitted">两次密码不同！</small>
            <small class="p-error" v-if="form.SPassword==null && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">手机号：</label>
          <div class="p-col">
            <InputText v-model.trim="form.telephone" :disabled="!isAdd?'disabled':null"></InputText>
            <small class="p-error" v-if="v$.form.telephone.checkPhone.$invalid && form.$submitted">请输入正确的手机号码！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed" style="align-items: flex-start">性别：</label>
          <div class="p-col" :key="form.sex">
            <RadioButton id="man" name="sex" :value="0" v-model="form.sex" />
            <label for="man" class="p-mr-2"> 男</label>
            <RadioButton id="woman" name="sex" :value="1" v-model="form.sex" />
            <label for="woman"> 女</label>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed">出生日期：</label>
          <div class="p-col">
            <Calendar v-model="form.birthday" date-format="yy-mm-dd" :yearNavigator="true" yearRange="1960:2022"></Calendar>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">身份证号码：</label>
          <div class="p-col">
            <InputText v-model.trim="form.idcard" placeholder="" :class="{'p-invalid':v$.form.idcard.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.idcard.checkIDCard.$invalid && form.$submitted">请输入正确的身份证号码！</small>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>状态：</label>
          <div class="p-col">
            <div style="height: 29px;">
              <RadioButton id="true" :value="0" v-model="form.status" />
              <label for="true" class="p-mr-2"> 启用</label>
              &nbsp;&nbsp;
              <RadioButton id="false" :value="1" v-model="form.status" />
              <label for="false"> 禁用</label>
            </div>
            <small class="p-error" v-if="v$.form.status.required.$invalid && form.$submitted">此项为必填项！</small>
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
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup: () => ({
    v$: useVuelidate(),
  }),
  name: "addOrUpdateUser",
  data() {
    return {
      data: null,
      roleList: [],
      display: false,
      submitted: false,
      treeList: null,
      domainList: null,
      form: {
        id: null,
        name: null,
        telephone: null,
        // telephoneMd5: null,
        beforePassword: null,
        password: null,
        SPassword: null,
        jobno: null,
        sex: null,
        idcard: null,
        dept: null,
        status: null,
        birthday: null,
        $submitted: false, // 记录form是否要提交
        beforeOU: null,
        beforeDC: null,
        roleName: null,
        roleId: null,
      },
      list: [
        {
          name: 1,
        },
        {
          name: 2,
        },
      ],
      isAdd: true,
    };
  },
  validations() {
    return {
      form: {
        id: {},
        name: {
          required,
        },
        telephone: {
          checkPhone: this.$global.Check.checkPhone,
        },
        beforePassword: {
          required,
          minLength: minLength(6),
        },
        password: {},
        SPassword: {},
        jobno: { required },
        sex: {},
        idcard: {
          checkIDCard: this.$global.Check.checkIDCard,
        },
        dept: {},
        status: {
          required,
        },

        beforeDC: {
          required,
        },
        roleName: { required },
        birthday: {},
        $submitted: {},
      },
    };
  },
  mounted() {
    this.$http.get("/role/getList").then((res) => {
      if (res.data) {
        this.roleList = res.data.records;
      }
    });
    this.$http.get("/domain/tree").then((res) => {
      let data = [];
      let _this = this;
      res.data.forEach((item) => {
        if (item.type == "0" && item.upStatus === 0) {
          data.push(item);
        } else if (
          item.type == "1" &&
          _this.$global.Tree.ouStatus(res.data, item.id, null) == 0
        ) {
          data.push(item);
        }
      });

      this.treeList = this.$global.Tree.makeTree(data);

      let list = [];
      data.forEach((item) => {
        if (item.type === "0" && item.upStatus === 0) {
          list.push(item);
        }
      });
      this.domainList = this.$global.Tree.makeTree(list);
    });
  },
  methods: {
    init(data) {
      this.data = JSON.parse(JSON.stringify(data));
      this.display = true;

      if (this.data.id != null) {
        this.form = this.data;
        this.form.birthday = new Date(this.form.birthday);
        this.form.beforePassword = "12345678";

        if (this.data.ouId != null && this.data.ouId != "null") {
          this.form.beforeOU = {};
          this.form.beforeOU[this.data.ouId + "-1"] = true;
        }

        if (this.data.mgtDomainId != null && this.data.mgtDomainId != "null") {
          this.form.beforeDC = {};
          this.form.beforeDC[this.data.mgtDomainId + "-0"] = true;
        }

        this.form.SPassword = this.form.password;
        this.isAdd = false;
      } else {
        if (this.data.ouId != null && this.data.ouId != "null") {
          this.form.ouId = this.data.ouId;
          this.form.beforeOU = {};
          this.form.beforeOU[this.data.ouId + "-1"] = true;
        }
      }
    },
    changOU(data) {
      if (Object.keys(data)[0].split("-")[1] == 0) {
        this.form.beforeOU = null;
        this.$toast.add({
          severity: "info",
          summary: "请选择组织单位！ ",
          life: 3000,
        });
      }
    },
    closeDialog() {
      this.display = false;
      this.$emit("close");
    },
    submit(isInvalid) {
      this.form.$submitted = true;
      // 如果验证失败，则终止
      if (isInvalid) {
        console.log("wrong");
        return;
      }
      if (typeof this.form.roleName == "object") {
        this.form.roleId = this.form.roleName.id;
        this.form.roleName = this.form.roleName.name;
      }
      if (this.isAdd && this.form.beforePassword != this.form.SPassword) {
        return;
      }
      this.form.password = this.$md5(this.form.beforePassword);
      // this.form.telephoneMd5 = this.$md5(this.form.telephone);

      if (!this.isAdd) {
        delete this.form.password;
      }
      delete this.form.scope;
      this.form.ouId = Object.keys(this.form.beforeOU)[0].split("-")[0];
      this.form.mgtDomainId = Object.keys(this.form.beforeDC)[0].split("-")[0];

      this.$nextTick(() => {
        this.$http.post("/admin/saveOrUpdate", this.form).then((res) => {
          if (res.success) {
            if (this.isAdd) {
              this.$toast.add({
                severity: "info",
                summary: "添加成功！ ",
                life: 3000,
              });
            } else {
              this.$toast.add({
                severity: "info",
                summary: "修改成功！ ",
                life: 3000,
              });
            }
          } else {
            this.$toast.add({
              severity: "error",
              summary: res.message,
              life: 3000,
            });
          }
          this.closeDialog();
        });
      });
    },
  },
};
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

::v-deep(.p-treeselect-label) {
  height: 29px;
  line-height: 29px;
  padding: 0 0.5rem;
  width: 100%;
}
</style>
