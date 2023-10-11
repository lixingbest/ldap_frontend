<template>
  <SecondNav :list="navList" :is-nav="true" v-on:click="routerTo"></SecondNav>
  <router-view />
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "SystemManage",
  components: { SecondNav },
  data() {
    return {
      navList: [],
      // {
      //   index: 1,
      //   name: "管理员管理",
      //   url: "/SystemManage/UserManage",
      //   icon: "fa fa-user-o",
      //   message: "这是提示消息——用户管理",
      // },
      // // {
      // //   index: 2,
      // //   name: '机构管理',
      // //   url: '/SystemManage/AgenciesManage',
      // //   icon: 'fa-building-o',
      // //   message: '这是提示消息——机构管理'
      // // },
      // {
      //   index: 3,
      //   name: "菜单管理",
      //   url: "/SystemManage/MenuManage",
      //   icon: "fa fa-sitemap",
      // },
      // {
      //   index: 4,
      //   name: "角色管理",
      //   url: "/SystemManage/RoleManage",
      //   icon: "fa fa-user",
      // },
      // // {
      // //   index: 5,
      // //   name: '权限分配',
      // //   url: '/SystemManage/Permissions',
      // //   icon: 'fa-shield'
      // // },
      // {
      //   index: 6,
      //   name: "数据字典",
      //   url: "/SystemManage/DataList",
      //   icon: "fa fa-bookmark",
      // },
      // {
      //   index: 7,
      //   name: "系统配置",
      //   url: "/SystemManage/SysSetting",
      //   icon: "fa fa-cog",
      // },
    };
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.navList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 174) {
          this.navList.push(item);
        }
      });
    }
  },
  methods: {
    routerTo(item) {
      if (item && item.url) {
        this.$router.push(item.url);
      }
    },
  },
};
</script>

<style scoped>
.p-grid {
  margin: 0;
}
</style>
