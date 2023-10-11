<template>
  <SecondNav :list="secondNavList" :is-nav="true" v-on:click="show"></SecondNav>
  <router-view />
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "Operations",
  components: { SecondNav },
  data() {
    return {
      secondNavList: [],
      // {
      //   name: "安装日志",
      //   icon: "fa fa-align-justify",
      //   url: "/DomainManage/DomainLog",
      // },
      // {
      //   name: "访问日志",
      //   icon: "fa fa-chain-broken",
      //   url: "/DomainManage/AccessLog",
      // },
    };
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.secondNavList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 171) {
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
