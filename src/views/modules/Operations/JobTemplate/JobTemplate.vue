<template>
  <div class="p-grid" style="margin: 0">
    <div class="p-col-3 p-0 border-r">
      <p class="title border-b">
        作业模板类别
      </p>
      <div class="buttons">
        <Button>新模板</Button>
        <Button class="p-button-danger">删除所选</Button>
      </div>
      <Tree :value="root" :expanded-keys="expandedKeys"></Tree>
    </div>
    <div class="p-col-9 p-0">
      <p class="title border-b">模板明细</p>
      <div class="p-fluid p-p-4">
        <div class="p-field p-grid">
          <label class="p-col-fixed">名称：</label>
          <div class="p-col">
            <InputText></InputText>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">父类别：</label>
          <div class="p-col">
            西安海关
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">分类：</label>
          <div class="p-col">
            <Dropdown v-model="from.name" :options="list" optionLabel="name"></Dropdown>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">说明：</label>
          <div class="p-col">
            <Textarea />
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">python脚本：</label>
          <div class="p-col" style="display: flex">
            <Textarea class="p-mt-3 edit" />
            <Fieldset style="margin:0 0.5rem;width: 30%" legend="内建函数">
              <p class="text">
                copyFile(path, target, source)
                removeFile(path)
                downloadFileFromServer(url)
                sendServerMessage(data)
              </p>
            </Fieldset>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed">输入变量：</label>
          <div class="p-col">
          </div>
        </div>
        <Button class="sub">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JobTemplate",
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
      list: [{ name: 1 }, { name: 2 }],
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
  /*padding: 0 5px;*/
}

.edit {
  max-width: 60% !important;
  background-color: #111111;
  color: #ffffff;
}
.edit.p-inputtext:enabled:focus {
  box-shadow: none;
  border: none;
}
::v-deep(.p-inputtext) {
  max-width: 300px;
}

::v-deep(.p-dropdown) {
  max-width: 300px;
}

.p-grid > label {
  width: 110px;
  justify-content: flex-end;
}

::v-deep(.p-fieldset .p-fieldset-legend) {
  padding: 0.5rem;
}

.sub {
  width: 100px;
  height: 29px;
  justify-content: center;
  margin-left: 110px;
}
</style>
