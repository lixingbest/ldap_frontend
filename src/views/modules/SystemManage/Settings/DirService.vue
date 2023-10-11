<template>
  <div class="p-fluid">
    <div class="p-field p-grid">
      <label class="p-col-fixed">域控服务器数据复制周期：</label>
      <div class="p-col">
        <InputText style="width: 200px"></InputText>
        <span>分钟</span>
      </div>
    </div>
    <div class="p-field p-grid">
      <label class="p-col-fixed">域控数据复制出现错误时：</label>
      <div class="p-col" style="display: flex">
        <div class="checkBox">
          <Checkbox id="city1" name="city" value="Chicago" v-model="action" />
          <label for="city1"> 告警邮件</label>
        </div>
        <div class="checkBox">
          <Checkbox id="city2" name="city" value="Los Angeles" v-model="action" />
          <label for="city2"> 告警短信</label>
        </div>
      </div>
    </div>
    <div class="p-field p-grid">
      <label class="p-col-fixed">复制出现错误时的通知人：</label>
      <div class="p-col" style="position: relative">
        <Button icon="pi pi-plus" class="p-button-sm addButton"></Button>
        <Button icon="pi pi-minus" class="p-button-sm addButton" style="top: 30px"></Button>
        <data-table style="width: 80%" :auto-layout="true" v-model:selection="selectList" class="p-datatable-gridlines p-datatable-sm" :value="table" :rowHover="true" :scrollable="true" scroll-height="400px" paginator
          :rows="10" :rowsPerPageOptions="[10, 20, 50,100]" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
          <Column selectionMode="multiple" style="width: 3rem"></Column>
          <Column header="姓名" field="name"></Column>
          <Column header="工号" field="number"></Column>
          <Column header="手机号码" field="phone"></Column>
          <Column header="部门" field="ID"></Column>
          <Column header="角色" field="type"></Column>
        </data-table>
      </div>
    </div>
    <Button class="sub">保存</Button>
  </div>
</template>

<script>
export default {
  name: "DirService",
  data() {
    return {
      action: [],
      selectList: [],
      table: [{ name: "aa", UPN: "111", workNum: "123" }],
    };
  },
};
</script>

<style scoped>
.checkBox {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.addButton {
  width: 10px;
  height: 27px;
  position: absolute;
  right: 17%;
}

.sub {
  width: 100px;
  height: 29px;
  justify-content: center;
  margin-left: 200px;
}
.p-grid > label {
  width: 200px;
  justify-content: flex-end;
}
::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody tr td) {
  text-align: center;
}
</style>
