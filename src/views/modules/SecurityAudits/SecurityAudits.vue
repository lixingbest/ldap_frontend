<template>
  <SecondNav :list="secondNavList" :is-nav="true" v-on:click="show"></SecondNav>
  <div class="page p-p-4">
    <router-view/>
  </div>
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "SecurityAudits",
  components: {SecondNav},
  data() {
    return {
      secondNavList: [
        {
          index: 1,
          name: '会话管理',
          url: '/SecurityAudits/SessionDomain',
          icon:'fa fa-link'
        },
        {
          index: 2,
          name: '日志审查',
          url: '/SecurityAudits/SecurityLog',
          icon:'fa fa-eye'
        },
        {
          index: 3,
          name: 'WEB终端',
          icon:'fa fa-terminal'
        },
      ],
    }
  }, methods: {
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
