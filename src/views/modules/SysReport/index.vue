<template>
  <second-nav :list="secondNavList" :is-nav="true" v-on:click="show"></second-nav>
  <router-view></router-view>
</template>
<script>
import {defineComponent} from 'vue'
import SecondNav from "@/views/modules/Public/SecondNav.vue";

export default defineComponent({
  name: "index",
  components: {SecondNav},
  data() {
    return {
      secondNavList: []
    }
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.secondNavList = [];
      let list = JSON.parse(localStorage.getItem("resources"));
      const parent = list.filter(item=>item.code==="report")[0]

      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == parent.id) {
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
})
</script>
<style scoped lang="scss">

</style>
