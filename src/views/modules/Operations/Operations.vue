<template>
  <SecondNav :list="secondNavList" :is-nav="true" v-on:click="show"></SecondNav>
  <div class="page">
    <router-view/>
  </div>
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "Operations",
  components: {SecondNav},
  data() {
    return {
      secondNavList: [
        {
          index: 1,
          name: '执行作业',
          url: '/Operations/ExecuteJob',
          icon: 'fa fa-server'
        },
        {
          index: 2,
          name: '作业模板',
          url: '/Operations/JobTemplate',
          icon: 'fa fa-book'
        },
        {
          index: 3,
          name: '作业日志',
          icon: 'fa fa-file-text-o'
        },
      ],
    }
  },
  methods: {
    show(item) {
      if (item && item.url) {
        this.$router.push(item.url);
      }
    }
  }
}
</script>

<style scoped>

</style>
