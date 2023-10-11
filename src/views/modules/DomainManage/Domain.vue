<template>
  <SecondNav :list="secondNavList" :is-nav="true" v-on:click="toPage"></SecondNav>
  <router-view />
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "Domain",
  components: { SecondNav },
  data() {
    return {
      secondNavList: [],
      // {
      //   name: "域管理",
      //   icon: "fa fa-globe",
      //   url: "/DomainManage/DomainManage",
      // },
      // {
      //   name: "Active Directory信任",
      //   icon: "fa fa-handshake-o",
      //   url: "/DomainManage/ActiveDirectory",
      // },
    };
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.secondNavList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 169) {
          this.secondNavList.push(item);
        }
      });
      setTimeout(()=>{
          console.log(this.secondNavList)
      },1000)
    }
  },
  methods: {
    toPage(item) {
      if (item && item.url) {
        this.$router.push(item.url);
      }
    },
  },
};
</script>

<style scoped>
</style>
