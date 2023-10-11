<template>
  <div class="p-grid page">
    <div class="p-col-3 p-0 border-r">
      <p class="title border-b">
        机构树
      </p>
      <div class="buttons">
        <Button>新建机构</Button>
        <Button class="p-button-danger">删除所选</Button>
      </div>
      <Tree :value="root" :expanded-keys="expandedKeys"></Tree>
    </div>
    <div class="p-col-9 p-0">
      <p class="title border-b">机构明细</p>
      <div style="display: flex;justify-content: flex-end;margin-top: 1rem;">
        <InputText class="p-mr-3" placeholder="名称"></InputText>
        <Button class="p-mr-3">搜索</Button>
      </div>
      <div class="p-fluid content">
        <div class="p-field p-grid">
          <label class="p-col-fixed">机构名称：</label>
          <div class="p-col">
            <InputText></InputText>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">机构类型：</label>
          <div class="p-col">
            <RadioButton name="type" value="Chicago" v-model="from.type" />
            <label class="p-mr-3"> 分公司</label>
            <RadioButton name="type" value="Los Angeles" v-model="from.type" />
            <label> 部门</label>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">父机构：</label>
          <div class="p-col">
            西安海关
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">说明：</label>
          <div class="p-col">
            <Textarea />
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">机构人员：</label>
          <div class="p-col" style="position: relative">
            <Button icon="pi pi-plus" class="p-button-sm addButton"></Button>
            <data-table style="width: 80%" :auto-layout="true" class="p-datatable-gridlines p-datatable-sm" :value="table" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10"
              :rowsPerPageOptions="[10, 20, 50,100]" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
              <Column header="姓名" field="name"></Column>
              <Column header="工号" field="number"></Column>
              <Column header="手机号码" field="phone"></Column>
              <Column header="角色" field="type"></Column>
              <Column header="身份证号码" field="ID"></Column>
              <Column header="操作">
                <template #body>
                  <Button class="p-button-link" style="color: red;justify-content: center">移除</Button>
                </template>
              </Column>
            </data-table>
          </div>
        </div>
        <Button class="sub">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AgenciesManage",
  data() {
    return {
      expandedKeys: {
        0: true,
        "0-0": true,
        "0-1": true,
      },
      root: [
        {
          key: "0",
          label: "Documents:sss",
          data: "Documents Folder",
          icon: "pi pi-fw pi-inbox",
          children: [
            {
              key: "0-0",
              label: "Work",
              data: "Work Folder",
              icon: "pi pi-fw pi-cog",
              children: [
                {
                  key: "0-0-0",
                  label: "Expenses.doc",
                  icon: "pi pi-fw pi-file",
                  data: "Expenses Document",
                },
                {
                  key: "0-0-1",
                  label: "Resume.doc",
                  icon: "pi pi-fw pi-file",
                  data: "Resume Document",
                },
              ],
            },
            {
              key: "0-1",
              label: "Home",
              data: "Home Folder",
              icon: "pi pi-fw pi-home",
              children: [
                {
                  key: "0-1-0",
                  label: "Invoices.txt",
                  icon: "pi pi-fw pi-file",
                  data: "Invoices for this month",
                },
              ],
            },
          ],
        },
        {
          key: "1",
          label: "Events",
          data: "Events Folder",
          icon: "pi pi-fw pi-calendar",
          children: [
            {
              key: "1-0",
              label: "Meeting",
              icon: "pi pi-fw pi-calendar-plus",
              data: "Meeting",
            },
            {
              key: "1-1",
              label: "Product Launch",
              icon: "pi pi-fw pi-calendar-plus",
              data: "Product Launch",
            },
            {
              key: "1-2",
              label: "Report Review",
              icon: "pi pi-fw pi-calendar-plus",
              data: "Report Review",
            },
          ],
        },
        {
          key: "2",
          label: "Movies",
          data: "Movies Folder",
          icon: "pi pi-fw pi-star",
          children: [
            {
              key: "2-0",
              icon: "pi pi-fw pi-star",
              label: "Al Pacino",
              data: "Pacino Movies",
              children: [
                {
                  key: "2-0-0",
                  label: "Scarface",
                  icon: "pi pi-fw pi-video",
                  data: "Scarface Movie",
                },
                {
                  key: "2-0-1",
                  label: "Serpico",
                  icon: "pi pi-fw pi-video",
                  data: "Serpico Movie",
                },
              ],
            },
            {
              key: "2-1",
              label: "Robert De Niro",
              icon: "pi pi-fw pi-star",
              data: "De Niro Movies",
              children: [
                {
                  key: "2-1-0",
                  label: "Goodfellas",
                  icon: "pi pi-fw pi-video",
                  data: "Goodfellas Movie",
                },
                {
                  key: "2-1-1",
                  label: "Untouchables",
                  icon: "pi pi-fw pi-video",
                  data: "Untouchables Movie",
                },
              ],
            },
          ],
        },
      ],
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
::v-deep(.p-tree) {
  border: none;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.buttons {
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  border-bottom: 1px solid #dee2e6;
}

.buttons ::v-deep(.p-button) {
  height: 26px;
  padding: 0 5px;
}

.content {
  margin: 2rem;
}

.content ::v-deep(.p-inputtext) {
  max-width: 300px;
}

::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

.p-grid > label {
  width: 100px;
  justify-content: flex-end;
}

::v-deep(.p-datatable .p-datatable-tbody tr td) {
  text-align: center;
}

.addButton {
  width: 10px;
  height: 27px;
  position: absolute;
  right: 16%;
  top: 0;
}

.sub {
  width: 100px;
  height: 29px;
  justify-content: center;
  margin-left: 100px;
}
</style>
