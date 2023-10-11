<template>
  <SecondNav :list="navList" :is-nav="true" v-on:click="routerTo"></SecondNav>
  <router-view />
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "MonitorMain",
  components: { SecondNav },
  data() {
    return {
      navList: [],
    };
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.navList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 219) {
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
