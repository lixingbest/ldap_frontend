<template>
  <DataTable :value="table" scrollHeight="400px" :rowHover="true" :scrollable="true" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
    paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录" class="p-m-3">
    <Column header="ID"></Column>
    <Column header="用户" field="name"></Column>
    <Column header="资产"></Column>
    <Column header="系统用户"></Column>
    <Column header="远端地址"></Column>
    <Column header="协议"></Column>
    <Column header="登录来源"></Column>
    <Column header="Agent"></Column>
    <Column header="登录时间"></Column>
    <Column header="状态"></Column>
    <Column header="操作">
      <template #body>
        <Button class="p-button-sm p-button-link">明细</Button>
      </template>
    </Column>
  </DataTable>
</template>

<script>
export default {
  name: "LoginLog",
  data() {
    return {
      table: [
        {
          name: "花花",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>
