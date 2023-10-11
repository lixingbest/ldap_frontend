<template>
  <p class="title">执行作业</p>
  <div class="p-fluid p-p-4">
    <div class="p-field p-grid">
      <label class="p-col-fixed">作业名称：</label>
      <div class="p-col">
        <InputText></InputText>
      </div>
    </div>
    <div class="p-field p-grid">
      <label class="p-col-fixed">作业模板：</label>
      <div class="p-col">
        <a>选择模板...</a>
      </div>
    </div>
    <div class="p-field p-grid">
      <label class="p-col-fixed">机构类型：</label>
      <div class="p-col">
        <RadioButton name="type" value="Chicago" v-model="from.type" />
        <label class="p-mr-3"> 手动执行</label>
        <RadioButton name="type" value="Los Angeles" v-model="from.type" />
        <label> 自动执行</label>
      </div>
    </div>
    <div class="p-field p-grid">
      <label class="p-col-fixed">任务说明：</label>
      <div class="p-col">
        <Textarea />
      </div>
    </div>
    <div class="p-field p-grid">
      <label class="p-col-fixed">目标主机：</label>
      <div class="p-col" style="position: relative">
        <Button icon="pi pi-plus" class="p-button-sm addButton"></Button>
        <Button icon="pi pi-minus" style="top:30px" class="p-button-sm addButton"></Button>
        <data-table style="width: 60%" :auto-layout="true" class="p-datatable-gridlines p-datatable-sm" :value="table" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10"
          :rowsPerPageOptions="[10, 20, 50,100]" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
          <Column header="主机名称" field="name"></Column>
          <Column header="操作系统" field="number"></Column>
          <Column header="IP" field="phone"></Column>
          <Column header="操作">
            <template #body>
              <Button class="p-button-link" style="color: red;justify-content: center">移除</Button>
            </template>
          </Column>
        </data-table>
      </div>
    </div>
    <div class="p-field p-grid">
      <label class="p-col-fixed">输入参数：</label>
      <div class="p-col">
        <Textarea />
      </div>
    </div>
    <Button class="sub">保存</Button>
  </div>
</template>

<script>
export default {
  name: "ExecuteJob",
  data() {
    return {
      from: {
        type: null,
      },
      table: [
        {
          name: "周凯翔",
          number: 12344,
          phone: 18097297690,
          type: "业务员",
          ID: "610322199809090909",
        },
      ],
    };
  },
};
</script>

<style scoped>
.p-grid > label {
  width: 100px;
  justify-content: flex-end;
}
.addButton {
  width: 10px;
  height: 27px;
  position: absolute;
  right: 36%;
  top: 0;
}
::v-deep(.p-inputtext) {
  max-width: 300px;
}
.sub {
  width: 100px;
  height: 29px;
  justify-content: center;
  margin-left: 100px;
}
</style>
