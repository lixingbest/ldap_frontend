<template>
  <Sidebar position="right" :showCloseIcon="false" style="width: 500px" v-model:visible="display" @hide="closeDialog">
    <template #header>
      <strong>{{ data == null ? '新建密码策略' : '编辑密码策略' }}</strong>
    </template>
    <div class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <div v-if="!isGlobalPolicy" class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>用户组：</label>
          <div class="p-col">
            <Dropdown v-model.trim="form.cn" :options="countries" filter optionLabel="name" :class="{'p-invalid':v$.form.cn.$invalid && form.$submitted}" class="w-full md:w-14rem"></Dropdown>
          </div>
        </div>
        <div v-if="!isGlobalPolicy" class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>优先级：</label>
          <div class="p-col">
            <InputNumber v-if="!data" v-model.trim="form.cospriority" :class="{'p-invalid':v$.form.cospriority.$invalid && form.$submitted}"></InputNumber>
            <InputNumber v-else disabled v-model.trim="form.cospriority" :class="{'p-invalid':v$.form.cospriority.$invalid && form.$submitted}"></InputNumber>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>最大生命周期(天)：</label>
          <div class="p-col">
            <InputNumber v-model.trim="form.krbmaxpwdlife" :class="{'p-invalid':v$.form.krbmaxpwdlife.$invalid && form.$submitted}"></InputNumber>
            <small class="p-error" v-if="v$.form.krbmaxpwdlife.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>最小生命周期(小时)：</label>
          <div class="p-col">
            <InputNumber v-model.trim="form.krbminpwdlife" :class="{'p-invalid':v$.form.krbminpwdlife.$invalid && form.$submitted}"></InputNumber>
            <small class="p-error" v-if="v$.form.krbminpwdlife.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>历史记录数量：</label>
          <div class="p-col">
            <InputNumber v-model.trim="form.krbpwdhistorylength" :class="{'p-invalid':v$.form.krbpwdhistorylength.$invalid && form.$submitted}"></InputNumber>
            <small class="p-error" v-if="v$.form.krbpwdhistorylength.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>角色类：</label>
          <div class="p-col">
            <InputNumber v-model.trim="form.krbpwdmindiffchars" :class="{'p-invalid':v$.form.krbpwdmindiffchars.$invalid && form.$submitted}"></InputNumber>
            <small class="p-error" v-if="v$.form.krbpwdmindiffchars.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>最小长度：</label>
          <div class="p-col">
            <InputNumber v-model.trim="form.krbpwdminlength" :class="{'p-invalid':v$.form.krbpwdminlength.$invalid && form.$submitted}"></InputNumber>
            <small class="p-error" v-if="v$.form.krbpwdminlength.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>最大失败次数：</label>
          <div class="p-col">
            <InputNumber v-model.trim="form.krbpwdmaxfailure" :class="{'p-invalid':v$.form.krbpwdmaxfailure.$invalid && form.$submitted}"></InputNumber>
            <small class="p-error" v-if="v$.form.krbpwdmaxfailure.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>故障重置间隔(秒)：</label>
          <div class="p-col">
            <InputNumber v-model.trim="form.krbpwdfailurecountinterval" :class="{'p-invalid':v$.form.krbpwdfailurecountinterval.$invalid && form.$submitted}"></InputNumber>
            <small class="p-error" v-if="v$.form.krbpwdfailurecountinterval.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>锁定持续时间(秒)：</label>
          <div class="p-col">
            <InputNumber v-model.trim="form.krbpwdlockoutduration" :class="{'p-invalid':v$.form.krbpwdlockoutduration.$invalid && form.$submitted}"></InputNumber>
            <small class="p-error" v-if="v$.form.krbpwdlockoutduration.required.$invalid && form.$submitted">此项为必填项！</small>
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
import data from "@/views/modules/Public/method/Data";

export default {
  setup: () => ({
    v$: useVuelidate(),
  }),
  name: "addOrUpdatePassword",
  data() {
    return {
      data: null,
      display: false,
      submitted: false,
      treeList: null,
      domainList: null,
      isGlobalPolicy : false,
      form: {
        domainId: null,
        cn: null,
        cospriority: null,
        krbmaxpwdlife: null,
        krbminpwdlife: null,
        krbpwdmindiffchars: null,
        krbpwdminlength: null,
        krbpwdmaxfailure: null,
        krbpwdfailurecountinterval: null,
        krbpwdlockoutduration: null,
        krbpwdhistorylength: null,
        $submitted: false, // 记录form是否要提交
      },
      isAdd: true,
      countries: null
    };
  },
  validations() {
    return {
      form: {
        id: {},
        cn: {  },
        cospriority: {  },
        krbmaxpwdlife: { required },
        krbminpwdlife: {required},
        krbpwdmindiffchars: { required },
        krbpwdminlength: { required },
        krbpwdmaxfailure: { required },
        krbpwdfailurecountinterval: { required },
        krbpwdlockoutduration: { required },
        krbpwdhistorylength: { required },
        $submitted: {}
      },
    };
  },
  methods: {
    init(id,data) {

      if (data) {
        this.form = JSON.parse(JSON.stringify(data));
        this.form.cn = {name: this.form.cn[0]}
        this.data = 'updata'

        if(data.cn[0] === "global_policy"){
          this.isGlobalPolicy = true;
        }
      }
      this.form.domainId = id
      this.getData()
      this.display = true;
    },
    getData() {
      this.$http
          .get("/usergroup/listAllNames", {
            params: {
              domainId: this.form.domainId
            },
          })
          .then((res) => {
            this.countries = []
            res.data.forEach(item=>{
              if (item.cn) {
                this.countries.push({name: item.cn[0]})
              }
            })
          });
    },
    closeDialog() {
      this.display = false;
      this.$emit("close");
    },
    submit(isInvalid) {
      this.form.$submitted = true;
      // 如果验证失败，则终止
      if (isInvalid) {
        return;
      }
      this.form.cn = this.form.cn.name
      this.$nextTick(() => {
        if (!this.data) {
          this.$http.put("/passwd_policy/add", this.form).then((res) => {
            if (res.success === true) {
              this.$toast.add({
                severity: "info",
                summary: "添加成功！ ",
                life: 3000,
              });
            }
            this.closeDialog();
          });
        } else {
         this.modify()
          let data = {
            domainId: this.form.domainId,
            cn: this.form.cn,
            cospriority: this.form.cospriority,
            krbmaxpwdlife: this.form.krbmaxpwdlife,
            krbminpwdlife: this.form.krbminpwdlife,
            krbpwdmindiffchars: this.form.krbpwdmindiffchars,
            krbpwdminlength: this.form.krbpwdminlength,
            krbpwdmaxfailure:this.form.krbpwdmaxfailure,
            krbpwdfailurecountinterval: this.form.krbpwdfailurecountinterval,
            krbpwdlockoutduration: this.form.krbpwdlockoutduration,
            krbpwdhistorylength: this.form.krbpwdhistorylength,
            $submitted: true, // 记录form是否要提交
          }
          this.$http.post("/passwd_policy/update", data).then((res) => {
            if (res.success === true) {
              this.$toast.add({
                severity: "info",
                summary: "修改成功！ ",
                life: 3000,
              });
            }
            this.closeDialog();
          });
        }
      });
    },
    modify() {
      // if (this.form.cn.length) {
      //   this.form.cn = this.form.cn[0]
      // }
      if (this.form.cospriority && this.form.cospriority.length) {
        this.form.cospriority = this.form.cospriority[0]
      }
      if (this.form.krbmaxpwdlife.length) {
        this.form.krbmaxpwdlife = this.form.krbmaxpwdlife[0]
      }
      if (this.form.krbminpwdlife.length) {
        this.form.krbminpwdlife = this.form.krbminpwdlife[0]
      }
      if (this.form.krbpwdmindiffchars.length) {
        this.form.krbpwdmindiffchars = this.form.krbpwdmindiffchars[0]
      }
      if (this.form.krbpwdminlength.length) {
        this.form.krbpwdminlength = this.form.krbpwdminlength[0]
      }
      if (this.form.krbpwdmaxfailure.length) {
        this.form.krbpwdmaxfailure = this.form.krbpwdmaxfailure[0]
      }
      if (this.form.krbpwdfailurecountinterval.length) {
        this.form.krbpwdfailurecountinterval = this.form.krbpwdfailurecountinterval[0]
      }
      if (this.form.krbpwdlockoutduration.length) {
        this.form.krbpwdlockoutduration = this.form.krbpwdlockoutduration[0]
      }
      if (this.form.krbpwdhistorylength.length) {
        this.form.krbpwdhistorylength = this.form.krbpwdhistorylength[0]
      }
    }
  },
};
</script>

<style scoped>
.p-grid > label {
  width: 160px;
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
