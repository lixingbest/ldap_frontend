<template>
  <SecondNav :list="secondNavList" v-on:click="show"></SecondNav>
  <div class="page p-grid p-m-0">
    <div class="p-col-3 p-0 border-r">
      <p class="title border-b">策略组分类</p>
      <Tree :value="root" :expanded-keys="expandedKeys"></Tree>
    </div>
    <div class="p-col-9 p-p-0">
      <p class="title border-b">内容</p>
      <data-table :value="table" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录" class="p-m-3">
        <Column header="名称" field="name"></Column>
        <Column header="类"></Column>
        <Column header="可分辨名称"></Column>
        <Column header="操作">
          <template #body>
            <Button class="p-button-sm p-button-link">编辑</Button>
            <Button class="p-button-sm p-button-link">移动</Button>
            <Button class="p-button-sm p-button-link">新建</Button>
            <Button class="p-button-sm p-button-link">重命名</Button>
            <Button class="p-button-sm p-button-link" style="color: red">删除</Button>
          </template>
        </Column>
      </data-table>
    </div>
  </div>
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";

export default {
  components: { SecondNav },
  name: "LDAPEdit",
  data() {
    return {
      secondNavList: [
        {
          index: 1,
          name: "连接到..",
          icon: "fa fa-code-fork",
        },
      ],
      table: [{ name: "花花" }],
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
    };
  },
  methods: {
    show() {},
  },
};
</script>

<style scoped>
::v-deep(.p-tree) {
  border: none;
  height: calc(100% - 60px);
  overflow-y: auto;
}
</style>
