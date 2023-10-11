<template>
  <div class="view">
    <div v-show="!menu_closed" class="menu">
      <span v-if="!menu_closed" class="close-btn" @click="closeBtn()"><i class="pi pi-angle-left"></i></span>
      <div class="thisTitle">
        <div class="h2">华御信域<sup>&#174;</sup> 目录服务安全运维平台</div>
        <div class="message">
          <div class="img">
            <img src="../../assets/images/logo.png">
          </div>
          <p>{{ tooltip }}</p>
        </div>
      </div>
      <div class="buttons">
        <div v-for="item in menuList" :key="item" @click="selectMenu(item)">
          <div class="block" :class="{'menuItem':item.id===menuItem.pid}">
            <div>
              <i class="fa-2x" :class="item.icon"></i>
              <p>{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <p class="version">
        <span>版本：{{ $global.version }}</span>&nbsp;&nbsp;
        <span>发布日期：{{ $global.release_date }}</span>
      </p>
    </div>
    <div class="content">
      <span v-if="menu_closed" class="open-btn" @click="closeBtn()"><i class="pi pi-angle-right"></i></span>
      <div class="bg"></div>
      <div class="router_view">
        <div class="userInfo">
          <div class="userName">
            <div class="name">
              <img src="../../assets/images/he.jpeg">
              <span> {{ userInfo.name }}</span>
              <i class="fa fa-chevron-down"></i>
            </div>
            <div class="user-menu" @click="updatePwd()">
              <i class="fa fa-pencil-square-o p-mr-2"></i>修改密码
            </div>
          </div>
          <div class="logout" @click="logoutDisplay=true">
            <i class="fa fa-sign-out p-mr-1"></i>退出
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </div>
  <Dialog header="确认退出" :modal="true" v-model:visible="logoutDisplay">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span>您确定要退出系统吗?</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="logout" class="p-button-link" />
      <Button label="否" icon="pi pi-times" @click="logoutDisplay=false" class="p-button-secondary p-button-link" />
    </template>
  </Dialog>
  <ConfirmDialog />
  <update-pwd v-if="updateDisplay" ref="updatePassword"></update-pwd>
</template>

<script>
import UpdatePwd from "@/views/modules/Public/updatePwd";

export default {
  name: "Main",
  components: { UpdatePwd },
  computed: {
    menu_closed() {
      return this.$store.state.menu_closed;
    },
  },
  data() {
    return {
      updateDisplay: false,
      tooltip: "",
      menuItem: {},
      menuList: [],
      userInfo: {},
      logoutDisplay: false,
    };
  },
  watch: {
    $route(e) {
      if (localStorage.getItem("resources")) {
        let resources = JSON.parse(localStorage.getItem("resources"));
        resources.forEach((item) => {
          if (this.$route.path === "/") {
            if (this.$route.path === item.url) {
              this.menuItem = item;
            }
          } else if (item.url && item.url.indexOf(e.path) !== -1) {
            this.menuItem = item;
          }
          if (this.menuItem.tooltip) {
            this.tooltip = this.menuItem.tooltip;
          } else {
            resources.forEach((item) => {
              if (item.id == this.menuItem.pid) {
                this.tooltip = item.tooltip;
              }
            });
          }
        });
      }
      // this.menuList.forEach((item) => {
      //   if (e.path === "/") {
      //     this.menuItem = this.menuList[0];
      //   } else if (item.url.indexOf(e.path) !== -1) {
      //     this.menuItem = item;
      //   }
      // });
      setTimeout(() => {
        let page = document.getElementsByClassName("page")[0];
        let index = document.getElementById("page");
        if (this.menu_closed) {
          if (page && page.style) {
            page.style.marginLeft = "1.5rem";
          } else if (index && index.style) {
            index.style.marginLeft = "1.5rem";
          }
        } else {
          if (page && page.style) {
            page.style.marginLeft = 0;
          } else if (index && index.style) {
            index.style.marginLeft = 0;
          }
        }
      }, 50);
    },
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.menuList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.type == 1) {
          this.menuList.push(item);
        }
      });
    }
  },
  mounted() {
    let userInfo = localStorage.getItem("userInfo");
    if (userInfo == null || userInfo === "null") {
      this.$router.push("/Login");
    } else {
      this.userInfo = JSON.parse(userInfo);
    }

    /**
     * 初始化菜单按钮
     */
    if (localStorage.getItem("resources")) {
      let resources = JSON.parse(localStorage.getItem("resources"));
      // console.log(resources);
      resources.forEach((item) => {
        if (this.$route.path === "/") {
          if (this.$route.path === item.url) {
            this.menuItem = item;
          }
        } else if (item.url && item.url.includes(this.$route.path)) {
          this.menuItem = item;
        }
      });
      if (this.menuItem.tooltip) {
        this.tooltip = this.menuItem.tooltip;
      } else {
        resources.forEach((item) => {
          if (item.id == this.menuItem.pid) {
            this.tooltip = item.tooltip;
          }
        });
      }
    }
  },
  methods: {
    selectMenu(value) {
      if (localStorage.getItem("resources")) {
        let resources = JSON.parse(localStorage.getItem("resources"));
        let list = [];
        resources.forEach((item) => {
          if (item.pid == value.id) {
            list.push(item);
          }
        });
        this.menuItem = list[0];
        if (this.menuItem.tooltip) {
          this.tooltip = this.menuItem.tooltip;
        } else {
          resources.forEach((item) => {
            if (item.id == this.menuItem.pid) {
              this.tooltip = item.tooltip;
            }
          });
        }
        this.$router.push(list[0].url);
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/Login");
    },
    updatePwd() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo.scope === 1) {
        this.updateDisplay = true;
        this.$nextTick(() => {
          this.$refs.updatePassword.init(
            "/admin/saveOrUpdate",
            userInfo,
            null,
            "修改密码"
          );
        });
      } else {
        this.$toast.add({
          severity: "info",
          summary: "全域管理员不允许修改密码",
          life: 3000,
        });
      }
    },

    /**
     * 关闭菜单
     */
    closeBtn() {
      let menu = document.getElementsByClassName("menu")[0];
      let con = document.getElementsByClassName("content")[0];
      let page = document.getElementsByClassName("page")[0];
      let index = document.getElementById("page");
      if (!this.menu_closed) {
        menu.classList.add("close");
        con.classList.add("open_con");
        setTimeout(() => {
          this.$store.commit("setMenuClosed");
          con.classList.remove("open_con");
          menu.classList.remove("close");
          con.style.width = "100%";
          if (page && page.style) {
            page.style.marginLeft = "1.5rem";
          } else if (index && index.style) {
            index.style.marginLeft = "1.5rem";
          }
        }, 90);
      } else {
        this.$store.commit("setMenuClosed");
        menu.classList.add("open");
        setTimeout(() => {
          con.style.width = "82%";
          menu.classList.remove("open");
          if (page && page.style) {
            page.style.marginLeft = 0;
          } else if (index && index.style) {
            index.style.marginLeft = 0;
          }
        }, 100);
      }
    },
  },
};
</script>

<style scoped>
.view {
  display: flex;
  height: 100%;
}

.version {
  position: absolute;
  bottom: 10px;
  left: 10px;
  margin: 0;
  line-height: 20px;
  color: #6c757d;
}

.userInfo {
  position: absolute;
  height: 50px;
  display: flex;
  align-items: center;
  top: 0;
  right: 0;
  color: #ffffff;
  z-index: 3;
  cursor: pointer;
}

.logout {
  padding-right: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 55px;
  line-height: 55px;
}

.userName {
  width: 160px;
  padding-right: 20px;
  height: 55px;
  line-height: 55px;
}

.userName .name {
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.userName .name > span {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 5px;
}

.userName .name > img {
  width: 25px;
  height: 25px;
  border-radius: 25px;
  margin-right: 5px;
}

.userName:hover .user-menu {
  display: block;
}

.user-menu {
  display: none;
  width: 100%;
  height: 55px;
  background-color: #ffffff;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 0 10px #6c757d;
  color: #495057;
  text-align: center;
  position: relative;
  top: -5px;
  left: 5px;
}

.menu {
  width: 18%;
  height: 100%;
  overflow: hidden;
  display: block;
  position: relative;
}

.close {
  animation-name: close;
  animation-duration: 0.1s;
}

.open {
  animation-name: open;
  animation-duration: 0.1s;
}

.open_con {
  animation-name: open_con;
  animation-duration: 0.1s;
}

.close-btn {
  position: absolute;
  right: -20px;
  top: calc(50% - 10px);
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 2rem;
  padding: 5px;
  z-index: 100;
  cursor: pointer;
}

.open-btn {
  position: absolute;
  left: -20px;
  top: calc(50% - 10px);
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 2rem;
  padding: 5px;
  z-index: 100;
  cursor: pointer;
}

@keyframes close {
  0% {
    width: 18%;
  }

  25% {
    width: 13.5%;
  }

  50% {
    width: 9%;
  }

  75% {
    width: 4.5%;
  }

  100% {
    width: 0;
  }
}

@keyframes open_con {
  0% {
    width: 82%;
  }

  25% {
    width: 86.5%;
  }

  50% {
    width: 91%;
  }

  75% {
    width: 95.5%;
  }

  100% {
    width: 100%;
  }
}

@keyframes open {
  0% {
    width: 0%;
  }

  25% {
    width: 4.5%;
  }

  50% {
    width: 9%;
  }

  75% {
    width: 13.5%;
  }

  100% {
    width: 18%;
  }
}

.thisTitle {
  background-color: rgba(17, 48, 102, 1);
  color: #ffffff;
  height: 277px;
}

.message {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20px;
  height: 225px;
}

.message .img {
  width: 130px;
  height: 130px;
  border-radius: 130px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  border: 4px solid rgba(17, 48, 102, 0.5);
  overflow: hidden;
}

.message .img img {
  width: 80%;
  height: 80%;
}

.message p {
  width: 80%;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  font-style: oblique;
  z-index: 9999;
}

.content {
  width: 82%;
  min-height: 100%;
  overflow: hidden;
  position: relative;
}

.menuItem {
  color: rgba(242, 242, 242, 1);
  background-color: rgba(17, 48, 102, 1);
  border-radius: 10px !important;
  box-shadow: 3px 3px 3px rgba(17, 48, 102, 0.5);
}

.h2 {
  margin: 0;
  width: 100%;
  text-align: center;
  line-height: 50px;
  height: 52px;
  font-size: 10px;
  font-family: "宋体-简", "隶变-简", "Arial", sans-serif;
  background-color: rgba(17, 48, 102, 1);
  color: #ffffff;
  font-weight: 800;
  border-bottom: 2px solid rgb(26, 61, 125);
}

@media only screen and (min-width: 1020px) {
  .h2 {
    font-size: 10px;
  }

  .menu {
    font-size: 10px;
  }
}

@media only screen and (min-width: 1210px) {
  .h2 {
    font-size: 14px;
  }

  .menu {
    font-size: 12px;
  }
}

@media only screen and (min-width: 1350px) {
  .h2 {
    font-size: 16px;
  }

  .menu {
    font-size: 14px;
  }
}
@media only screen and (min-width: 1520px) {
  .h2 {
    font-size: 18px;
  }

  .menu {
    font-size: 14px;
  }
}

.buttons {
  color: #808080;
  height: 65%;
  overflow: auto;
  margin: 0;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.buttons > div {
  width: 50%;
  padding: 0.5rem;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.buttons div .block {
  width: 80%;
  height: 0;
  padding-bottom: 80%;
  display: flex;
  justify-content: center;
  position: relative;
}

.block > div {
  position: absolute;
  top: calc(50% - 15px - 1rem);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.block > div > img {
  width: 50px;
  height: 50px;
}

.block > div > p {
  width: 100%;
  line-height: 30px;
  text-align: center;
}

.bg {
  height: 277px;
  background-color: rgba(17, 48, 102, 1);
}

.router_view {
  width: 100%;
  height: 100%;
  padding: 1rem 0 1rem 0;
  position: absolute;
  overflow: hidden;
  z-index: 2;
  top: 0;
}
</style>
