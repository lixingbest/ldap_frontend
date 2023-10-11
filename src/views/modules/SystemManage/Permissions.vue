<template>
  <div class="p-grid">
    <div class="p-col-12" style="padding: 0 0 1rem 0">
      <div class="page">
        <div class="title">
          角色信息
          <div style="display: flex">
            <InputText class="p-mr-3" />
            <Button>搜索</Button>
          </div>
        </div>
        <data-table :value="table" class="p-m-3" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录" :auto-layout="true">
          <Column selectionMode="multiple" style="width: 3rem"></Column>
          <Column header="姓名" field="name"></Column>
          <Column header="编号"></Column>
          <Column header="状态"></Column>
          <Column header="说明" field="mes"></Column>
          <Column header="操作">
            <template #body>
              <Button class="p-button-link ">设置用户</Button>
              <Button class="p-button-link ">设置菜单</Button>
            </template>
          </Column>
        </data-table>
        <Paginator :rows="10" :totalRecords="50" template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport" :rowsPerPageOptions="[10,20,50,100]"
          currentPageReportTemplate="显示 {first} 到 {last} 条记录，总计 {totalRecords} 记录">>
        </Paginator>
      </div>
    </div>
    <div class="p-col-6" style="padding: 0 0.5rem 0 0;">
      <div class="page" style="margin-right: 0!important;">
        <p class="title">
          角色有权访问的菜单
        </p>
        <data-table :value="table" :auto-layout="true" class="p-m-3" v-model:selection="selectList" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">

          <Column selectionMode="multiple" style="width: 3rem"></Column>
          <Column header="名称" field="name"></Column>
          <Column header="URL"></Column>
          <Column header="操作">
            <template #body>
              <Button class="p-button-link " style="color: red;">移除</Button>
            </template>
          </Column>
        </data-table>
      </div>
    </div>
    <div class="p-col-6" style="padding:0 0 0 0.5rem">
      <div class="page">
        <p class="title">
          角色下的用户
        </p>
        <data-table :value="table" :auto-layout="true" class="p-m-3" v-model:selection="selectList" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
          <Column selectionMode="multiple" style="width: 3rem"></Column>
          <Column header="姓名" field="name"></Column>
          <Column header="工号"></Column>
          <Column header="手机号码"></Column>
          <Column header="身份证号码"></Column>
          <Column header="部门"></Column>
          <Column header="操作">
            <template #body>
              <Button class="p-button-link " style="color: red;">移除</Button>
            </template>
          </Column>
        </data-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Permissions",
  data() {
    return {
      selectList: [],
      table: [
        {
          name: 1,
          number: 123,
          phone: 1234456666,
          mes: "用于所有系统的所有操作权限",
        },
      ],
    };
  },
};
</script>

<style scoped>
.p-grid {
  margin: 0;
}

.page {
  min-height: auto;
  overflow: hidden;
}
</style>
