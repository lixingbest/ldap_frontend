<template>
  <DataTable :value="table" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
    paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录" class="p-m-3">
    <Column header="ID"></Column>
    <Column header="用户" field="name"></Column>
    <Column header="资产"></Column>
    <Column header="系统用户"></Column>
    <Column header="远端地址"></Column>
    <Column header="协议"></Column>
    <Column header="登录来源"></Column>
    <Column header="命令"></Column>
    <Column header="开始时间"></Column>
    <Column header="时长"></Column>
    <Column header="操作">
      <template #body>
        <Button class="p-button-sm p-button-link" style="color: red;">强制下线</Button>
        <Button class="p-button-sm p-button-link">回放</Button>
        <Button class="p-button-sm p-button-link">下载</Button>
      </template>
    </Column>
  </DataTable>
</template>

<script>
export default {
  name: "SessionLine",
  data() {
    return {
      table: [{ name: "花花" }],
    };
  },
};
</script>

<style scoped>
</style>
