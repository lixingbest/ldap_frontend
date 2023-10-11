<template>
  <SecondNav :list="secondNavList" :is-nav="true" v-on:click="show"></SecondNav>
  <router-view />
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "Index",
  components: { SecondNav },
  data() {
    return {
      secondNavList: [],
      // {
      //   name: "终端维护",
      //   icon: "pi pi-desktop",
      //   url: "/DeploymentPlan/terminalMaintenance",
      // },
      // {
      //   name: "脚本模板",
      //   icon: "pi pi-desktop",
      //   url: "/DeploymentPlan/ShellTempManage",
      // },
      // {
      //   name: "部署计划",
      //   icon: "pi pi-file",
      //   url: "/DeploymentPlan/DeploymentPlan",
      // }
    };
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.secondNavList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 173) {
          this.secondNavList.push(item);
        }
      });
    }
  },
  methods: {
    show(item) {
      if (item && item.url) {
        this.$router.push(item.url);
      }
    },
  },
};
</script>

<style scoped>
</style>
