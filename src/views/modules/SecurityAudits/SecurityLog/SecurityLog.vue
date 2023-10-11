<template>
  <TabMenu :model="items"/>
  <router-view/>
</template>

<script>
export default {
  name: "SessionDomain",
  data() {
    return {
      items: [
        {label: '登录日志', icon: 'fa fa-mouse-pointer', to: '/SecurityAudits/SecurityLog'},
        {label: '操作日志', icon: 'fa fa-leaf', to: '/SecurityAudits/SecurityLog/ActionLog'},
      ]
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
