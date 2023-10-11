<template>
  <SecondNav :is-nav="true" :list="secondNavList" v-on:click="show"></SecondNav>
  <router-view></router-view>
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "Index",
  components: {SecondNav},
  data() {
    return {
      secondNavList: [],
        // {
        //   index: 3,
        //   name: '组策略配置',
        //   icon:'pi pi-palette',
        //   url: '/GroupTactics/device-main',
        // },
        // {
        //   name: "公共策略库",
        //   url: "/PublicPolicy/publicPolicy",
        //   icon: "fa fa-cubes",
        // },
    }
  },
  created(){
    if (localStorage.getItem("resources")) {
      this.secondNavList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 170) {
          this.secondNavList.push(item);
        }
      });
    }
  },
  methods: {
    show(item) {
      if (item && item.url) {
        this.$router.push(item.url)
      }
    }
  }
}
</script>

<style scoped>

</style>
