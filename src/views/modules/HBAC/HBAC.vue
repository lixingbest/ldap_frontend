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
      //   index: 1,
      //   name: "策略权限规则",
      //   url: "/GroupTactics/RoleList",
      //   icon: "fa fa-book",
      // },
      // {
      //   index: 2,
      //   name: "策略命令库",
      //   url: "/GroupTactics/CommandList",
      //   icon: "fa fa-terminal",
      // },
    };
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.secondNavList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 172) {
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
