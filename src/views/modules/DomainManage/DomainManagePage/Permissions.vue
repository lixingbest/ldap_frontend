<template>
  <div class="p-grid">
    <div class="p-col-3">
      <p class="title">策略类型</p>
      <Tree :value="root" :expanded-keys="expandedKeys"></Tree>
    </div>
    <div class="p-col-9">
      <div class="table-title">
        <Button>关联策略</Button>
        <div class="from">
          <div class="form-item p-mr-3">
            <label>名称：</label>
            <InputText class="inout-t"></InputText>
          </div>
          <Button>查询</Button>
        </div>
      </div>
      <DataTable style="margin-top: 15px;" :rowHover="true" :value="list" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
        <template #empty>
          <p style="text-align: center">暂无信息...</p>
        </template>
        <Column field="name" style="text-align: center;" header="名称"></Column>
        <Column style="text-align: center;" field="sts" header="是否启用">
          <template #body="a">
            <span class="p-tag p-tag-success" v-if="a.data.sts===1">启用</span>
          </template>
        </Column>
        <Column style="text-align: center;" field="type" header="触发前/后置条件"></Column>
        <Column style="text-align: center;" field="DNS" header="描述"></Column>
        <Column style="text-align: center" header="操作">
          <template #body>
            <Button class="p-button-link" style="color: red">取消关联</Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"],
  name: "Permissions",
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
          label: "策略类型",
          data: "Documents Folder",
          children: [
            {
              key: "0-0",
              label: "全部类型",
              data: "Work Folder",
              children: [
                {
                  key: "0-0-0",
                  label: "Expenses.doc",
                  data: "Expenses Document",
                },
                { key: "0-0-1", label: "Resume.doc", data: "Resume Document" },
              ],
            },
            {
              key: "0-1",
              label: "网络",
              data: "Home Folder",
              children: [
                {
                  key: "0-1-0",
                  label: "Invoices.txt",
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
      list: [
        {
          name: "ubuntu-1",
          type: "域控制器",
          DNS: "u1.xa.sx.customs.local",
          sts: 1,
          sys: "Ubuntu 21 LTS",
        },
      ],
    };
  },
};
</script>

<style scoped>
.p-grid {
  height: calc(100% - 35px);
  margin: 15px 0 0 0;
}
.Breadcrumb {
  margin: 0;
  color: rgba(0, 0, 0, 0.447058823529412);
  line-height: 20px;
}

.Breadcrumb:hover {
  color: #1fa1fc;
}

.table-title {
  display: flex;
  justify-content: space-between;
}

.from {
  display: flex;
}

.form-item {
  display: flex;
  align-items: center;
}

.inout-t {
  height: 29px;
  border: 1px solid #ced4da;
}

::v-deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  line-height: 27px;
}
::v-deep(.p-tree) {
  height: calc(100% - 60px);
  overflow-y: auto;
}
::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

.p-col-3 {
  border: 1px solid #ced4da;
  padding: 0;
  border-radius: 6px;
}

.p-col-3 .title {
  margin: 0;
  padding-left: 10px;
  line-height: 50px;
  border-bottom: 1px solid #ced4da;
}

.p-col-9 {
  padding-left: 15px;
}
</style>
