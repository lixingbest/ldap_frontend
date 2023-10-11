<template>
  <SecondNav :list="secondNavList" v-on:click="clickNav"></SecondNav>
  <div class="page p-grid">
    <div class="p-col-3" style="border-right: 1px solid #dee2e6">
      <p class="title">报表类型</p>
      <div class="p-pt-4 p-pl-4 p-pr-4">
        <span class="p-input-icon-right" style="width: 100%">
          <i class="pi pi-search" />
          <InputText style="width: 100%" placeholder="输入搜索内容" type="text" />
        </span>
      </div>
      <Tree :value="root" :expanded-keys="expandedKeys"></Tree>
    </div>
    <div class="p-col-9">
      <p class="title">最近创建的用户</p>
      <div style="margin: 1.5rem;display: flex;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <label>选择的域：</label>
          <Dropdown class="p-mr-3" v-model="from.s" :options="list" optionLabel="name" placeholder="" />
          <label>时间段：</label>
          <Calendar class="p-mr-3" v-model="from.datas" selectionMode="range" :manualInput="false" />
          <Button class="p-mr-3">生成</Button>
          <Button class="p-mr-3">停止</Button>
        </div>
        <Button>导出</Button>
      </div>
      <data-table style="margin: 1.5rem" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]" :value="table"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
        <Column header="用户名" field="name"></Column>
        <Column header="UPN" field="value"></Column>
        <Column header="创建时间" field="message"></Column>
        <Column header="账户状态" field="message"></Column>
        <Column header="隶属于" field="message"></Column>
        <Column header="对象GUID" field="message"></Column>
        <Column header="密码过期日期" field="message"></Column>
      </data-table>
    </div>
  </div>
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  name: "Report",
  components: { SecondNav },
  data() {
    return {
      secondNavList: [
        {
          index: 1,
          name: "用户报表",
        },
        {
          index: 2,
          name: "密码报表",
        },
        {
          index: 3,
          name: "组报表",
        },
        {
          index: 4,
          name: "计算机报表",
        },
        {
          index: 5,
          name: "GPO报表",
        },
      ],
      expandedKeys: {
        0: true,
        "0-0": true,
        "0-1": true,
      },
      from: {
        s: null,
        datas: null,
      },
      list: [{ name: 1 }, { name: 2 }],
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
      table: [
        {
          name: "哈哈哈",
          value: "222",
          message: "",
        },
        {
          name: "哈哈哈",
          value: "222",
          message: "",
        },
        {
          name: "哈哈哈",
          value: "222",
          message: "",
        },
      ],
    };
  },
  methods: {
    clickNav() {},
  },
};
</script>

<style scoped>
.p-grid {
  margin: 0;
}

.p-col-2,
.p-col-3,
.p-col-9,
.p-col-10 {
  padding: 0;
}

::v-deep(.p-tree) {
  border: none;
  height: calc(100% - 60px);
  overflow-y: auto;
}

::v-deep(.p-inputtext) {
  height: 29px;
}

::v-deep(.p-dropdown) {
  height: 29px;
}
</style>
