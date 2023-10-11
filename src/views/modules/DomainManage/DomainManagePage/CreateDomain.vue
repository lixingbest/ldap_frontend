<template>
  <Sidebar style="width: 500px;" @hide="closeDialog"
           position="right" :showCloseIcon="false"
           v-model:visible="show">
    <div class="p-fluid content">
      <div class="p-field">
        <h4>{{ isAdd ? '新建' : '编辑' }}域</h4>
      </div>
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>父域：</label>
          <div class="p-col">
            <TreeSelect v-model="treeSelect" :class="{'p-invalid':error && form.$submitted}"
                        @change="changTree" :options="treeList" placeholder="请选择父域"/>
            <small class="p-error" v-if="error && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>名称：</label>
          <div class="p-col">
            <InputText v-model="form.name" :class="{'p-invalid':v$.form.name.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.name.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>IP地址：</label>
          <div class="p-col">
            <InputText v-model="form.ip" :class="{'p-invalid':v$.form.ip.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.ip.required.$invalid && form.$submitted">此项为必填项！</small>
            <small class="p-error" v-if="v$.form.ip.checkIP.$invalid && form.$submitted">请输入正确ip格式！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>域名：</label>
          <div class="p-col">
            <InputText v-model="form.domainName"
                       :class="{'p-invalid':v$.form.domainName.$invalid && form.$submitted}"></InputText>
            <small class="p-error"
                   v-if="v$.form.domainName.checkDomainName.$invalid && form.$submitted">请输入正确域名！</small>
            <small class="p-error" v-if="v$.form.domainName.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>服务地址：</label>
          <div class="p-col">
            <InputText v-model="form.serviceUrl"
                       :class="{'p-invalid':v$.form.serviceUrl.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.serviceUrl.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>编码：</label>
          <div class="p-col">
            <InputText v-model="form.code"
                       :class="{'p-invalid':v$.form.code.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.code.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>可分辨名称：</label>
          <div class="p-col">
            <InputText v-model="form.dn"
                       :class="{'p-invalid':v$.form.dn.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.dn.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>服务账号名称：</label>
          <div class="p-col">
            <InputText v-model="form.serviceName"
                       :class="{'p-invalid':v$.form.serviceName.$invalid && form.$submitted}"></InputText>
            <small class="p-error" v-if="v$.form.serviceName.required.$invalid && form.$submitted">此项为必填项！</small>
            <small class="p-error"
                   v-if="v$.form.serviceName.checkName.$invalid && form.$submitted">只能为数字或字母，首字符不能为数字！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed" style="align-items: flex-start"><label class="required">*</label>服务账号密码：</label>
          <div class="p-col">
            <Password class="p-mb-2" v-model="form.servicePasswd"
                      :class="{'p-invalid':v$.form.servicePasswd.$invalid && form.$submitted}"></Password>
            <small class="p-error" v-if="v$.form.servicePasswd.required.$invalid && form.$submitted">此项为必填项！</small>
            <small class="p-error" v-if="v$.form.servicePasswd.minLength.$invalid && form.$submitted">最小长度6位！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed" style="align-items: flex-start"><label class="required">*</label>重复密码：</label>
          <div class="p-col">
            <Password class="p-mb-2" v-model="form.SPassword"
                      :class="{'p-invalid':!(form.SPassword!=null&&form.servicePasswd==form.SPassword) && form.$submitted}"></Password>
            <small class="p-error" v-if="(form.servicePasswd!=form.SPassword && form.$submitted)">两次密码不一样！</small>
            <small class="p-error" v-if="v$.form.SPassword.required.$invalid && form.$submitted">此项为必填项！</small>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed">描述：</label>
          <div class="p-col">
            <Textarea v-model="form.comments"/>
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
import {minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

export default {
  name: "CreateDomainCon",
  emits: ['close'],
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {

      treeSelect: {},
      isAdd: false,
      item: null,
      show: false,
      error: false,
      form: {
        domainId: null,
        id: null,
        name: null,
        ip: null,
        domainName: null,
        serviceUrl: null,
        serviceName: null,
        servicePasswd: null,
        SPassword: null,
        comments: null,
        pid: null,
        $submitted: false,
        code: null,
        dn: null,
      },
      treeList: null,

    }
  },
  validations() {
    return {
      treeSelect: {required},
      form: {
        domainId: {},
        id: {},
        name: {required},
        ip: {required, checkIP: this.$global.Check.checkIP},
        domainName: {required, checkDomainName: this.$global.Check.checkDomainName},
        serviceUrl: {required},
        serviceName: {required, checkName: this.$global.Check.checkName,},
        servicePasswd: {required, minLength: minLength(6)},
        SPassword: {required},
        pid: {},
        comments: {},
        $submitted: {},
        code:{required},
        dn:{required},
      }
    }
  },
  mounted() {
    this.$http.get('/domain/tree').then((res) => {
      let data = res.data
      // this.treeList = this.makeTree(data)
      data = data.filter(item => {
        return (item.type == '0' && item.upStatus == 0)
      })
      this.treeList = this.$global.Tree.makeTree(data)
    })
  },
  methods: {
    init(domainId) {

      this.show = true
      this.treeSelect['1-0'] = true

      if (domainId.split('-')[0] == 1) {
        this.isAdd = true
        this.form.pid = 1
        this.form.domainId = domainId
      } else {
        this.isAdd = false
        this.treeSelect['1-0'] = true
        this.$http.get('/domain/get', {
          params: {
            id: domainId.split('-')[0]
          }
        }).then((res) => {
          this.form = res.data
          this.form.SPassword = this.form.servicePasswd
          this.form.domainId = domainId
        })

      }

    },
    closeDialog() {
      this.show = false;
      this.$emit('close')
    },
    submit(isInvalid) {

      this.form.$submitted = true;
      // 如果验证失败，则终止
      if (isInvalid) {
        return;
      }
      if (this.form.servicePasswd != this.form.SPassword) {
        return;
      }


      this.$http.get('/domain/saveOrUpdate', {
        params: this.form
      }).then(() => {
        if (this.isAdd) {
          this.$toast.add({severity: 'info', summary: '添加成功！ ', life: 3000});
        } else {
          this.$toast.add({severity: 'info', summary: '修改成功！ ', life: 3000});
        }
        this.closeDialog()
      })
    },
    changTree(event) {
      this.error = false
      this.form.pid = JSON.stringify(event).split('-')[0].substring(2)
      if (this.form.pid != 1) {
        this.$toast.add({severity: 'info', summary: '只能在"海关总署"下创建域！ ', life: 3000});
        this.treeSelect = {}
        this.treeSelect['1-0'] = true
        this.form.pid = 1
      }

    },
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
