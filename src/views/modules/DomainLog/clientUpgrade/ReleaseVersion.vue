<template>
  <Sidebar position="right" :showCloseIcon="false" style="width: 500px" v-model:visible="display" @hide="closeDialog">
    <template #header>
      <strong>{{ data == null ? '发布版本' : '编辑版本' }}</strong>
    </template>
    <div class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <div v-if="!isGlobalPolicy" class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>版本名称：</label>
          <div class="p-col">
            <InputText v-model.trim="form.cospriority" :class="{'p-invalid':v$.form.cospriority.$invalid && form.$submitted}"></InputText>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>版本编号：</label>
          <div class="p-col">
            <InputText v-model.trim="form.krbmaxpwdlife" :class="{'p-invalid':v$.form.krbmaxpwdlife.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.krbmaxpwdlife.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>版本号：</label>
          <div class="p-col">
            <InputText v-model.trim="form.krbminpwdlife" :class="{'p-invalid':v$.form.krbminpwdlife.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.krbminpwdlife.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>版本发布日期：</label>
          <div class="p-col">
            <Calendar v-model="form.time" :class="{'p-invalid':v$.form.time.$invalid && form.$submitted}" dateFormat="yy/mm/dd" />
            <small class="p-error" v-if="v$.form.time.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>版本特性：</label>
          <div class="p-col">
            <Textarea v-model.trim="form.krbpwdmindiffchars" :class="{'p-invalid':v$.form.krbpwdmindiffchars.$invalid && form.$submitted}"></Textarea>
            <small class="p-error" v-if="v$.form.krbpwdmindiffchars.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>是否强制升级：</label>
          <div class="p-col">
            <SelectButton v-model="form.krbpwdminlength" :options="options" optionLabel="name" :class="{'p-invalid':v$.form.krbpwdminlength.$invalid && form.$submitted}" />
            <small class="p-error" v-if="v$.form.krbpwdminlength.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>版本部署包：</label>
          <div class="p-col">
            <FileUpload v-model="form.krbpwdmaxfailure" name="files" :url="fileUploadUrl" @upload="onUpload" auto="true" mode="basic" chooseLabel="上传" />
<!--            <InputNumber v-model.trim="form.krbpwdmaxfailure" :class="{'p-invalid':v$.form.krbpwdmaxfailure.$invalid && form.$submitted}"></InputNumber>-->
            <small class="p-error" v-if="v$.form.krbpwdmaxfailure.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>兼容性：</label>
          <div class="p-col">
            <SelectButton v-model="form.krbpwdfailurecountinterval" :options="options2" optionLabel="name" :class="{'p-invalid':v$.form.krbpwdfailurecountinterval.$invalid && form.$submitted}" />
            <small class="p-error" v-if="v$.form.krbpwdfailurecountinterval.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>说明：</label>
          <div class="p-col">
            <Textarea v-model.trim="form.krbpwdlockoutduration" :class="{'p-invalid':v$.form.krbpwdlockoutduration.$invalid && form.$submitted}"></Textarea>
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
import config from "../../../../../public/config.json"

export default {
  setup: () => ({
    v$: useVuelidate(),
  }),
  name: "addOrUpdatePassword",
  data() {
    return {
      data: null,
      display: false,
      fileUploadUrl: config.service_url + "/file/upload",
      submitted: false,
      treeList: null,
      domainList: null,
      isGlobalPolicy : false,
      form: {
        domainId: null,
        cospriority: null,
        krbmaxpwdlife: null,
        krbminpwdlife: null,
        krbpwdmindiffchars: null,
        krbpwdminlength: null,
        krbpwdmaxfailure: null,
        krbpwdfailurecountinterval: null,
        krbpwdlockoutduration: null,
        time: null,
        $submitted: false, // 记录form是否要提交
      },
      options: [
        { name: '是', value: 0 },
        { name: '否', value: 1 },
      ],
      options2: [
        { name: '兼容', value: 0 },
        { name: '不兼容', value: 1 },
      ],
    };
  },
  mounted() {},
  validations() {
    return {
      form: {
        id: {},
        cospriority: { required },
        krbmaxpwdlife: { required },
        krbminpwdlife: {required},
        krbpwdmindiffchars: { required },
        krbpwdminlength: { required },
        krbpwdmaxfailure: { required },
        krbpwdfailurecountinterval: { required },
        krbpwdlockoutduration: { required },
        time: { required },
        $submitted: {}
      },
    };
  },
  methods: {
    init(id,data) {
      if (data) {
        console.log(data)
        this.form = JSON.parse(JSON.stringify(data));
        this.data = 'updata'
      }
      this.form.domainId = id
      this.display = true;
    },
    closeDialog() {
      this.display = false;
      this.$emit("close");
    },
    onUpload(event) {
      console.log(event)
      let imgUrls = JSON.parse(event.xhr.response)
      let success = 0
      let len = 0
      for (let i in imgUrls) {
        len++
        if (imgUrls[i] !== "上传失败") {
          success++
        }
      }
      if (success === len) {
        this.from.krbpwdmaxfailure = event.xhr.response
        this.$toast.add({severity: 'info', summary: '成功', detail: '文件上传成功', life: 3000});
      } else {
        this.$toast.add({severity: 'error', summary: '失败', detail: (len - success) + '个文件上传失败', life: 3000});
      }
    },
    submit(isInvalid) {
      this.form.$submitted = true;
      // 如果验证失败，则终止
      if (isInvalid) {
        return;
      }
      if (this.form.krbpwdminlength) {
        this.form.krbpwdminlength = this.form.krbpwdminlength.value
      } else {
        this.form.krbpwdminlength = null
      }
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
          let data = {
            domainId: this.form.domainId,
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
