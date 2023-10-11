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
        {label: '在线会话', icon: 'fa fa-leaf', to: '/SecurityAudits/SessionDomain'},
        {label: '历史会话', icon: 'fa fa-history', to: '/SecurityAudits/SessionHistory'},
      ]
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
