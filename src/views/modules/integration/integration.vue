<template>
  <SecondNav :list="secondNavList" :is-nav="true" v-on:click="show"></SecondNav>
  <router-view />
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "Integration",
  components: { SecondNav },
  data() {
    return {
      secondNavList: []
    };
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.secondNavList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 210) {
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
