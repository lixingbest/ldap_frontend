<template>
  <div class="loginPage">
    <div class="backImg">
      <div class="froms">
        <h2>
          <img style="width:30px;height: 30px;" src="../../../assets/images/logo.png" />
          <span> 华御信域<sup>&#174;</sup> 目录服务安全运维平台</span>
        </h2>
        <form @submit.prevent="login(v$.$invalid)" class="content">
          <span class="p-input-icon-left p-mb-3">
            <i class="fa fa-user" />
            <InputText v-model="form.jobno" type="text" :class="{'p-invalid':v$.form.jobno.$invalid && form.$submitted}" placeholder="请输入工号" />
            <small class="p-error" v-if="v$.form.jobno.required.$invalid && form.$submitted">请输入工号！</small>
          </span>
          <span class="p-input-icon-left p-mb-3">
            <i class="fa fa-unlock-alt" />
            <InputText v-model="form.beforePassword" type="password" :class="{'p-invalid':v$.form.beforePassword.$invalid && form.$submitted}" placeholder="请输入密码" />
            <small class="p-error" v-if="v$.form.beforePassword.required.$invalid && form.$submitted">请输入密码！</small>
          </span>
          <span class="p-input-icon-left p-mb-3">
            <i class="fa fa-globe" style="z-index: 99"></i>
            <tree-select class="tree" placeholder="登录域" @node-select="selectNode" v-model="selectKey" :class="{'p-invalid':v$.form.domain.$invalid && form.$submitted}" :options="treeData"></tree-select>
            <small class="p-error" v-if="v$.form.domain.required.$invalid && form.$submitted">请选择域！</small>
          </span>
          <div style="display: flex;" v-if="verification_code_enable==='true'">
            <span class="p-input-icon-left p-mb-3" style="width: 60%;">
              <i class="fa fa-unlock-alt"></i>
              <InputText v-model="form.imgcode" type="text" :class="{'p-invalid':v$.form.imgcode.$invalid && form.$submitted}" placeholder="验证码" />
              <small class="p-error" v-if="v$.form.imgcode.reqrequiredIf.$invalid && form.$submitted">请输入验证码！</small>
            </span>
            <div style="width:30%;margin-right: 10px;">
              <img id="imgcode" v-tooltip="'刷新验证码'" @click="refreshImg()" style="width:100px;cursor:pointer;" :src="$global.serverUrl.defaults.baseURL+'/admin/kaptcha-image'" />
            </div>
          </div>

          <!--          <div class="check-box">-->
          <!--          <span>-->
          <!--            <Checkbox id="savePwd" v-model="form.savePwd" class="p-mr-2" :binary="true"/><label for="savePwd">记住密码</label>-->
          <!--          </span>-->
          <!--            <a>忘记密码</a>-->
          <!--          </div>-->
          <Button type="submit">登录</Button>
        </form>
      </div>
    </div>

    <p class="version">
      <span>版本：v{{ $global.version }}</span>
      <span style="margin-left:10px">发布日期：{{ $global.release_date }}</span>
    </p>
  </div>
  <Toast :baseZIndex="1000" />
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";

export default {
  setup: () => ({ v$: useVuelidate() }),
  name: "Login",
  data() {
    return {
      treeData: null,
      selectKey: null,
      form: {
        jobno: null,
        telephoneMd5: null,
        beforePassword: null,
        password: null,
        domain: null,
        savePwd: false,
        imgcode: null,
        $submitted: false,
      },
      verification_code_enable: false,
    };
  },
  validations() {
    return {
      form: {
        jobno: {
          required,
        },
        telephoneMd5: {},
        beforePassword: {
          required,
        },
        domain: { required },
        password: {},
        savePwd: {},
        imgcode: {
          reqrequiredIf: requiredIf(this.verification_code_enable === "true"),
        },
        $submitted: {},
      },
    };
  },
  created() {
    this.$http.get("/sysConfig/get/verification_code_enable").then((res) => {
      if (res.success) {
        this.verification_code_enable = res.data;
      }
    });
  },
  mounted() {
    this.$http.get("/domain/treeWithoutOu").then((res) => {
      let data = res.data;
      data = data.filter((item) => item.upStatus === 0);
      this.treeData = this.$global.Tree.makeTree(data);
    });
  },
  methods: {
    refreshImg() {
      this.form.imgcode = null;
      if (Boolean(this.verification_code_enable)) {
        document.getElementById("imgcode").src =
          this.$global.serverUrl.defaults.baseURL +
          "/admin/kaptcha-image?rid=" +
          new Date().getTime();
      }
    },
    selectNode(node) {
      this.form.domain = node.id;
    },
    login(isInvalid) {
      this.form.$submitted = true;
      if (isInvalid) {
        return;
      }

      this.form.password = this.$md5(this.form.beforePassword);
      let data = {};
      if (this.form.jobno) {
        data.jobno = this.form.jobno;
      }
      if (this.form.password) {
        data.password = this.form.password;
      }
      if (this.form.domain) {
        data.mgtDomainId = this.form.domain;
      }
      if (this.form.imgcode) {
        data.imgcode = this.form.imgcode;
      }
      console.log(data);
      this.$http
        .post("/admin/login", data)
        .then((res) => {
          if (res.success === true) {
            localStorage.setItem("token", JSON.stringify(res.data.token));
            localStorage.setItem("resources", JSON.stringify(res.data.resources));
            localStorage.setItem("userInfo", JSON.stringify(res.data.admin));
            localStorage.setItem("DOMAIN_ID", this.form.domain);
            this.$router.push("/");
          }
        })
        .catch(() => {
          this.refreshImg();
        });
    },
  },
};
</script>

<style scoped>
.loginPage {
  height: 100%;
  width: 100%;
  background-color: rgba(17, 48, 102, 1);
  padding: 5rem 10%;
  position: relative;
}

.version {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  color: #ffffff;
}

.backImg {
  height: 100%;
  width: 100%;
  padding: 10%;
  display: flex;
  border-radius: 3rem;
  align-items: center;
  background-color: #ffffff;
  background-image: url("../../../assets/images/登录.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  /*background-position: right;*/
}

.froms {
  width: 28%;
}

.p-input-icon-left > i,
.p-input-icon-right > i {
  top: 20px;
}

.froms > h2 {
  white-space: nowrap;
  font-family: "宋体-简", "宋体";
  font-weight: 500;
  color: rgba(17, 48, 102, 1);
  font-size: 24px;
  display: flex;
  align-items: center;
}

form {
  padding-top: 20px;
  width: 80%;
}

form input {
  border-radius: 6px;
  box-shadow: 0 0 6px 4px #eee;
}

form input,
form button {
  display: block;
  width: 100%;
  line-height: 40px;
  height: 40px;
}

form button {
  width: 80% !important;
  padding: 0;
  border-radius: 20px;
}

.p-input-icon-left {
  width: 100%;
}

::v-deep(.p-input-icon-left i:first-of-type) {
  left: 0.8rem;
}

.tree {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  box-shadow: 0 0 6px 4px #eee;
}

::v-deep(.p-treeselect .p-treeselect-label) {
  padding: 0 25px;
  line-height: 38px;
}

.check-box {
  display: flex;
  padding-bottom: 1rem;
  color: #6c757d;
  justify-content: space-between;
}
</style>
