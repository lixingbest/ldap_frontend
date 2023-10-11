<template>
  <Sidebar v-model:visible="show" style="width: 1000px" @hide="closeDialog" :dismissable="false" position="right"
           :showCloseIcon="false">
    <form @submit.prevent="showDialog(v$.$invalid)">
      <div class="p-grid" style="padding: 0 30px;">
        <h4 class="p-col-12">{{
            !isAdd ? '编辑' : '新建'
          }}{{ userType === 1 ? '活跃用户' : (userType === 2 ? '计划用户' : '备用用户') }}</h4>
        <div class="p-col-6">
          <div class="p-fluid">
            <div class="p-field p-grid">
              <label class="p-col-fixed"><label class="required">*</label>登录名：</label>
              <div class="p-col">
                <InputText v-model.trim="form.uid" :disabled="isAdd?null:'disabled'"
                           :class="{'p-invalid':v$.form.uid.$invalid && form.$submitted}"></InputText>
                <small class="p-error"
                       v-if="v$.form.uid.required.$invalid && form.$submitted">此项为必填项！</small>
                <small class="p-error"
                       v-if="v$.form.uid.checkName.$invalid && form.$submitted">只能为数字或字母，首字符不能为数字！</small>
              </div>
            </div>

            <div class="p-field p-grid">
              <label class="p-col-fixed">工号：</label>
              <div class="p-col">
                <InputText v-model="form.employeenumber"></InputText>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed"><label class="required">*</label>姓名：</label>
              <div class="p-col">
                <InputText v-model.trim="form.cn"
                           :class="{'p-invalid':v$.form.cn.$invalid && form.$submitted}"></InputText>
                <small class="p-error"
                       v-if="v$.form.cn.required.$invalid && form.$submitted">此项为必填项！</small>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">组织单位：</label>
              <div class="p-col">
                <TreeSelect v-model="treeSelect"
                            :class="{'p-invalid':error||(v$.treeSelect.$invalid && form.$submitted)}"
                            @change="changTree" :options="treeList" placeholder="请选择父域"/>
                <small class="p-error" v-if="error">请选择组织单位！</small>
              </div>
            </div>
            <div class="p-field p-grid" style="flex-wrap: nowrap">
              <label class="p-col-fixed" style="align-items: flex-start">地址：</label>
              <div class="address-input">
                <div class="p-field">
                  <Dropdown class="p-mr-2" v-model="form.st" @change="changeAddress('p')"
                            :options="provinceList" optionLabel="name" option-value="name"
                            placeholder="--省--"></Dropdown>
                  <Dropdown class="p-mr-2" v-model="form.l" @change="changeAddress('c')"
                            :options="cityList" optionLabel="name" option-value="name" placeholder="--市--">
                  </Dropdown>
                  <Dropdown v-model="form.district" :options="areaList" optionLabel="name"
                            option-value="name" placeholder="--区--"></Dropdown>
                </div>
                <InputText v-model="form.address" placeholder="详细地址"></InputText>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">邮政编码：</label>
              <div class="p-col">
                <InputText v-model="form.postalcode"
                           :class="{'p-invalid':v$.form.postalcode.$invalid && form.$submitted}"></InputText>
                <small class="p-error"
                       v-if="v$.form.postalcode.checkPostal.$invalid && form.$submitted">请输入正确的邮政编码！</small>
              </div>
            </div>

            <div class="p-field p-grid">
              <label class="p-col-fixed">电子邮箱：</label>
              <div class="p-col">
                <InputText v-model="form.mail"
                           :class="{'p-invalid':v$.form.mail.$invalid && form.$submitted}"></InputText>
                <small class="p-error"
                       v-if="v$.form.mail.$invalid && form.$submitted">请输入正确电子邮箱格式！</small>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">固定电话：</label>
              <div class="p-col">
                <InputText v-model="form.telephonenumber"
                           :class="{'p-invalid':v$.form.telephonenumber.$invalid && form.$submitted}">
                </InputText>
                <small class="p-error"
                       v-if="v$.form.telephonenumber.$invalid && form.$submitted">请输入正确电话号码！</small>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">移动电话：</label>
              <div class="p-col">
                <InputText v-model="form.mobile"
                           :class="{'p-invalid':v$.form.mobile.$invalid && form.$submitted}"></InputText>
                <small class="p-error"
                       v-if="v$.form.mobile.checkPhone.$invalid && form.$submitted">请输入正确手机号码！</small>
              </div>
            </div>
          </div>
        </div>
        <div class="p-col-6">
          <div class="p-fluid">

            <div v-if="isAdd" class="p-field p-grid">
              <label class="p-col-fixed"><label class="required">*</label>用户密码：</label>
              <div class="p-col">
                <Password v-model="form.userpassword"
                          :class="{'p-invalid':((form.userpassword==null||form.userpassword==='')&& form.$submitted)||(v$.form.userpassword.$invalid && form.$submitted)}">
                </Password>
                <small class="p-error"
                       v-if="(form.userpassword==null||form.userpassword=='') && form.$submitted">此项为必填项！</small>
                <small class="p-error"
                       v-if="v$.form.userpassword.minLength.$invalid && form.$submitted">至少为6位字符</small>
              </div>
            </div>
            <div v-if="isAdd" class="p-field p-grid">
              <label class="p-col-fixed"><label class="required">*</label>确认密码：</label>
              <div class="p-col">
                <Password v-model="form.pwd"
                          :class="{'p-invalid':!(form.pwd!=null&&form.userpassword==form.pwd) && form.$submitted}">
                </Password>
                <small class="p-error" v-if="form.pwd==null && form.$submitted">此项为必填项！</small>
                <small class="p-error"
                       v-if="(form.pwd!=null&&form.userpassword!=form.pwd && form.$submitted)">两次密码不一样！</small>
              </div>
            </div>

            <div class="p-field p-grid">
              <label class="p-col-fixed">职称：</label>
              <div class="p-col">
                <InputText v-model="form.title"/>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">职位：</label>
              <div class="p-col">
                <InputText v-model="form.job"/>
              </div>
            </div>

            <div class="p-field p-grid">
              <label class="p-col-fixed">备注1：</label>
              <div class="p-col">
                <Textarea :auto-resize="true" v-model="form.comments1"/>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">备注2：</label>
              <div class="p-col">
                <Textarea :auto-resize="true" v-model="form.comments2"/>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">备注3：</label>
              <div class="p-col">
                <Textarea :auto-resize="true" v-model="form.comments3"/>
              </div>
            </div>
          </div>
        </div>
        <div class="p-col-12 footer">
          <div style="display: flex">
            <Button class="p-button-outlined p-mr-2" @click="closeDialog">取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </div>
      </div>
    </form>
    <Dialog v-model:visible="addDisplay" @hide="addDisplay=false" :modal="true" header="确认添加用户">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
        <span>添加用户后，此操作将于1分钟后起效。</span>
      </div>
      <template #footer>
        <Button label="是" icon="pi pi-check" @click="submit" class="p-button-link"/>
        <Button label="否" icon="pi pi-times" @click="addDisplay=false"
                class="p-button-secondary p-button-link"/>
      </template>
    </Dialog>
  </Sidebar>
</template>

<script>
import address from '../../../../../assets/data/address.json'
import {
  minLength,
  email,
  required
} from "@vuelidate/validators";
import {
  useVuelidate
} from "@vuelidate/core";

export default {
  name: "CreateUser",
  setup: () => ({
    v$: useVuelidate()
  }),
  data() {
    return {
      address,
      userType: 1,
      show: false,
      addDisplay: false,
      treeSelect: {},
      treeList: [],
      oldForm: null,
      form: {
        domainId: null,
        uid: null,
        // givenname: null,
        // sn: null,
        cn: null,
        userpassword: null,
        mail: null,
        telephonenumber: null,
        mobile: null,
        st: null,
        l: null,
        street: null,
        postalcode: null,
        title: null,
        job: null,
        ou: null,
        employeenumber: null,
        comments1: null,
        comments2: null,
        comments3: null,
        district: null,
        address: null,
        pwd: null
      },
      provinceList: [],
      cityList: [],
      areaList: [],
      table: [{
        name: 'aa',
        UPN: '111',
        workNum: '123'
      }],
      list: [{
        name: 1
      }, {
        name: 2
      }],
      isAdd: true,
      error: false,
      titleList: null,
      jobList: null,
    }
  },
  validations() {
    return {
      treeSelect: {
        required
      },
      form: {
        domainId: {},
        uid: {
          required,
          checkName: this.$global.Check.checkName
        },
        // givenname: {required,},
        // sn: {required},
        cn: {
          required
        },
        userpassword: {
          minLength: minLength(6)
        },
        mail: {
          email
        },
        telephonenumber: {
          checkMobile: this.$global.Check.checkMobile
        },
        mobile: {
          checkPhone: this.$global.Check.checkPhone
        },
        st: {},
        l: {},
        street: {},
        postalcode: {
          checkPostal: this.$global.Check.checkPostal
        },
        title: {},
        job: {},
        ou: {},
        employeenumber: {},
        comments1: {},
        comments2: {},
        comments3: {},

        district: {},
        address: {},
        pwd: {},
        $submitted: {}
      }
    }
  },
  mounted() {
    this.provinceList = this.address.province;
    this.$http.get('/domain/tree').then((res) => {

      let data = []
      let _this = this
      res.data.forEach((item) => {
        if (item.type == '0' && item.upStatus === 0) {
          data.push(item)
        } else if (item.type == '1' && _this.$global.Tree.ouStatus(res.data, item.id, null) == 0) {
          data.push(item)
        }
      })

      this.treeList = this.$global.Tree.makeTree(data)
    })


  },
  methods: {

    init(data, ouId, domainId, userType) {
      this.userType = userType
      this.show = true
      this.treeSelect[ouId] = true
      this.form.ou = ouId.split('-')[0]
      if (data && data.uid != null) {
        let item = JSON.parse(JSON.stringify(data))
        this.isAdd = false
        this.form = item
        let title = JSON.parse(this.$global.Util.isJSON(item.title) ? item.title : '{}')

        this.form.title = title.title ? title.title : null
        this.form.job = title.job ? title.job : null

        this.form.comments1 = JSON.parse(item.ou[0]).comments1
        this.form.comments2 = JSON.parse(item.ou[0]).comments2
        this.form.comments3 = JSON.parse(item.ou[0]).comments3

        this.form.district = this.form.street ? this.form.street[0].split(',')[0] : null
        this.form.address = (this.form.street && this.form.street[0].split(',')[1] != null
            && this.form.street[0].split(',')[1].toString() !== 'null') ? this.form.street[0].split(',')[1] : ''
        this.form.st = this.form.st ? this.form.st[0] : null
        this.form.l = this.form.l ? this.form.l[0] : null

        this.changeAddress('p')
        this.changeAddress('c')

        /**
         * 避免密码验证不通过 页面不会更改密码
         */
        this.form.userpassword = '123456'
      } else {
        this.isAdd = true
      }
      this.form.domainId = domainId
      console.log(this.form)
      this.oldForm = JSON.stringify(this.form)
    },

    changTree(event) {
      console.log(event)
      if (Object.keys(event)[0].split('-')[1].toString() === '0') {
        this.error = true
        this.treeSelect = {}
        this.form.ou = null
      } else {
        this.error = false
        this.form.ou = Object.keys(event)[0].split('-')[0]
      }
    },
    closeDialog() {
      this.addDisplay = false
      this.show = false;
      this.$emit('close')
    },
    changeAddress(i) {
      if (this.form.st && i === 'p') {
        let p = this.address.province.filter((item) => {
          if (item.name === this.form.st) {
            return item
          }
        })
        this.cityList = p[0].cities.city
      } else if (this.form.l && i === 'c') {
        let c = this.cityList.filter((item) => {
          if (item.name === this.form.l) {
            return item
          }
        })
        this.areaList = c[0].areas.area
      }

    },
    showDialog(isInvalid) {
      console.log(this.form)
      this.form.$submitted = true;
      // 如果验证失败，则终止
      if (isInvalid) {
        return;
      }
      if (this.isAdd && this.form.userpassword != this.form.pwd) {
        return;
      }
      this.addDisplay = true
    },
    submit() {
      this.addDisplay = false
      if (this.isAdd) {
        this.form.street = this.form.district + ',' + this.form.address
        this.$http.get(
            this.userType === 1 ? '/domainuser/save' : (this.userType === 2 ? '/stage_domainuser/save' : '/preserved_domainuser/save'),
            {
              params: this.form
            }).then(() => {
          this.$toast.add({
            severity: 'info',
            summary: '添加成功！ ',
            life: 3000
          });
          this.closeDialog()
        })
      } else {
        let map = {}
        let oldForm = JSON.parse(this.oldForm)
        console.log(oldForm)
        for (let key in this.form) {

          if (typeof (this.form[key]) == "string" && this.form[key] !== oldForm[key]) {
            if (key === 'district' || key === 'address') {
              map.street = this.form.district + ',' + this.form.address
            } else {
              map[key] = this.form[key]
            }
          }
        }
        console.log(JSON.stringify(map))
        if (Object.keys(map).length > 0) {
          if (!map.ou) {
            map.ou = JSON.parse(this.form.ou[0]).ouCN
          }
          map.comments3 = this.form.comments3 == null ? '' : this.form.comments3
          map.comments2 = this.form.comments2 == null ? '' : this.form.comments2
          map.comments1 = this.form.comments1 == null ? '' : this.form.comments1
          map.domainId = this.form.domainId
          map.uid = this.form.uid[0]
          map.title = this.form.title ? this.form.title : ''
          map.job = this.form.job ? this.form.job : ''
          console.log(JSON.stringify(map))

          this.$http.get(
              this.userType === 1 ? '/domainuser/update' : (this.userType === 2 ? '/stage_domainuser/update' : '/preserved_domainuser/update'),
              {
                params: map
              }).then(() => {
            this.$toast.add({
              severity: 'info',
              summary: '修改成功！ ',
              life: 3000
            });
            this.closeDialog()
          })
        } else {
          this.$toast.add({
            severity: 'info',
            summary: '数据未做出改变！ ',
            life: 3000
          });
          this.closeDialog()
        }
      }
    },
  }
}
</script>

<style scoped>
.p-grid > label {
  width: 100px;
  justify-content: flex-end;
}


.over .p-field-radiobutton {
  margin-bottom: 0;
}

.pwd .p-field-radiobutton,
.p-field-checkbox {
  margin-bottom: 0.7rem;
}

.address-input {
  width: calc(100% - 98px - 0.5rem);
  padding-left: 0.5rem;
  overflow: hidden
}

.address-input > div {
  display: flex;
  width: 100%;
}
</style>
