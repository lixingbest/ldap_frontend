<template>
  <div class="page">
    <div class="border-r">
      <p class="title">终端分类</p>
      <Tree :value="typeTree" selectionMode="single" v-model:selection-keys="selectedTypeNodeKey" :expanded-keys="expandedKeys" filterPlaceholder="请输入类型" filterMode="label" filter="true">
        <template #default="item">
          <span style="display:inline-block;width: 100%" @contextmenu="clickContextMenu($event,item.node)">{{ item.node.label }}</span>
        </template>
      </Tree>
      <context-menu ref="context" :model="contextMenu"></context-menu>
      <add-or-update-type ref="addOrUpdateType" v-if="typeDisplay" @close="closeTypeDialog"></add-or-update-type>
    </div>
    <div class="content">
      <div class="p-mb-3" style="display: flex;justify-content: space-between;align-items: center">
        <div style="display:flex;align-items: center">
          <Button label="新增终端" class="p-mr-3" @click="showTerminal({typeId:Object.keys(selectedTypeNodeKey)[0]})" />
          <Button label="导入Excel" class="p-mr-3" @click="importTerminal" />
          <a href="终端导入模板.xlsx">下载Excel模板</a>
        </div>
        <div class="p-input-icon-right">
          <i class="pi pi-search" @click="getTableData(Object.keys(selectedTypeNodeKey)[0])"></i>
          <InputText v-model="search.param" placeholder="请输入关键字搜索" @keydown.enter="getTableData(Object.keys(selectedTypeNodeKey)[0])" />
        </div>
      </div>

      <data-table :value="tableData" :rowHover="true" :scrollable="true" style="height:calc(100% - 90px);overflow:auto">
        <template #empty>
          <div class="p-text-center">暂无数据</div>
        </template>
        <column header="主机名" field="hostname"></column>
        <column header="IP地址" field="ipv4"></column>
        <column header="端口号" field="sshPort" />
        <column header="超级用户名" field="account"></column>
        <column header="说明" field="comments"></column>
        <column header="操作" :header-style="{paddingLeft:'3rem'}" style="min-width:15rem">
          <template #body="row">
            <Button class="p-button-link p-mr-2" icon="pi pi-pencil" label="编辑" @click="showTerminal(row.data)" />
            <Button class="p-button-link" icon="pi pi-trash" style="color:red" @click="deleteTableItem(row.data,selectedTypeNodeKey)" label="删除" />
          </template>
        </column>
      </data-table>
      <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage(Object.keys(selectedTypeNodeKey)[0],$event)" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
        :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
      </Paginator>
      <add-or-update-terminal v-if="terminalDisplay" ref="terminal" @close="closeTerminalDialog"></add-or-update-terminal>
    </div>
  </div>
</template>

<script>
import http from "../../../../http";
import {
  ref,
  nextTick,
  reactive,
  watch,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import AddOrUpdateType from "./addOrUpdateType";
import AddOrUpdateTerminal from "./addOrUpdateTerminal";

export default {
  name: "Index",
  components: { AddOrUpdateTerminal, AddOrUpdateType },
  setup() {
    const {
      typeTree,
      selectedTypeNodeKey,
      contextMenu,
      context,
      clickContextMenu,
      addOrUpdateType,
      typeDisplay,
      closeTypeDialog,
      expandedKeys,
    } = typeAbout();

    const {
      page,
      getTableData,
      tableData,
      terminalDisplay,
      terminal,
      showTerminal,
      deleteTableItem,
      search,
      changePage,
    } = getTable();

    const unNodeKey = watch(
      selectedTypeNodeKey,
      (data) => {
        const typeKey = Object.keys(data)[0];
        getTableData(typeKey);
      },
      { deep: true }
    );

    const closeTerminalDialog = () => {
      terminalDisplay.value = false;
      getTableData(Object.keys(selectedTypeNodeKey.value)[0]);
    };

    onBeforeUnmount(() => {
      unNodeKey();
    });
    const { proxy } = getCurrentInstance();

    const importTerminal = () => {
      let inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.onchange = (event) => {
        console.log(event);
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append("file", file);
        http
          .post("/terminal/importTerminal", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            if (res["success"]) {
              proxy.$toast.add({
                severity: "info",
                summary:
                  "导入共" +
                  res.data.total +
                  "条，因为类型错误失败" +
                  res.data.remove +
                  "条！",
                life: 3000,
              });
              getTableData(Object.keys(selectedTypeNodeKey.value)[0]);
            }
          });
      };
      inputElement.click();
    };
    return {
      typeTree,
      selectedTypeNodeKey,
      contextMenu,
      context,
      clickContextMenu,
      addOrUpdateType,
      typeDisplay,
      closeTypeDialog,
      getTableData,
      tableData,
      page,
      terminalDisplay,
      terminal,
      showTerminal,
      closeTerminalDialog,
      deleteTableItem,
      expandedKeys,
      search,
      changePage,
      importTerminal,
    };
  },
};

function typeAbout() {
  const { proxy } = getCurrentInstance();

  const typeTree = ref([]);

  const selectedTypeNodeKey = ref({});
  const selectedTypeNode = ref({});
  const expandedKeys = ref({});
  let contextMenu = ref([]);
  const allContextMenu = [
    {
      label: "新增类型",
      icon: "pi pi-plus-circle",
      command: () => {
        showTypeDialog("add");
      },
    },
    {
      label: "编辑",
      icon: "pi pi-pencil",
      command: () => {
        showTypeDialog("update");
      },
    },
    {
      label: "删除类型",
      icon: "pi pi-trash",
      command: () => {
        proxy.$confirm.require({
          message: "您确定删除此类型？",
          header: "删除类型",
          icon: "pi pi-info-circle",
          acceptLabel: "确定",
          rejectLabel: "取消",
          accept: () => {
            http
              .delete("/terminal/deleteType/" + selectedTypeNode.value.data.id)
              .then((res) => {
                if (res["success"]) {
                  proxy.$toast.add({
                    severity: "info",
                    summary: "删除成功！",
                    life: 3000,
                  });
                  getTypeTree();
                } else {
                  proxy.$toast.add({
                    severity: "warn",
                    summary: res.message,
                    life: 3000,
                  });
                }
              });
          },
          reject: () => {
            proxy.$confirm.close();
          },
        });
      },
    },
  ];

  function getTypeTree() {
    http.get("/terminal/getTypeTree").then((res) => {
      typeTree.value = res.data;
      selectedTypeNodeKey.value[res.data[0].key] = true;
      expandedKeys.value[res.data[0].key] = true;
    });
  }

  getTypeTree();

  const context = ref(null);

  function clickContextMenu(event, node) {
    selectedTypeNode.value = node;
    if (node.data.code === "root") {
      contextMenu.value = allContextMenu.filter((item, index) => index < 2);
    } else {
      contextMenu.value = allContextMenu;
    }
    context.value.show(event);
  }

  const addOrUpdateType = ref(null);
  const typeDisplay = ref(false);

  function showTypeDialog(type) {
    typeDisplay.value = true;
    nextTick(() => {
      addOrUpdateType.value.init(type, selectedTypeNode.value);
    });
  }

  function closeTypeDialog() {
    typeDisplay.value = false;
    getTypeTree();
  }

  return {
    typeTree,
    selectedTypeNode,
    selectedTypeNodeKey,
    contextMenu,
    context,
    clickContextMenu,
    addOrUpdateType,
    typeDisplay,
    closeTypeDialog,
    expandedKeys,
  };
}

function getTable() {
  const page = reactive({
    current: 1,
    size: 10,
    total: 0,
  });

  const tableData = ref([]);
  const search = reactive({
    param: null,
  });

  function getTableData(typeId) {
    if (typeId) {
      http
        .get("/terminal/getPage", {
          params: {
            typeId: typeId,
            current: page.current,
            size: page.size,
            param: search.param,
          },
        })
        .then((res) => {
          if (res["success"]) {
            tableData.value = res.data.records;
            page.total = res.data.total;
          }
        });
    }
  }

  function changePage(typeId,event) {
    console.log(event)
    console.log(typeId)
    page.current = event.page + 1;
    page.size = event.rows;
    getTableData(typeId);
  }

  const terminalDisplay = ref(false);
  const terminal = ref(null);

  const showTerminal = (data) => {
    terminalDisplay.value = true;
    nextTick(() => {
      terminal.value.init(data);
    });
  };

  const { proxy } = getCurrentInstance();
  const deleteTableItem = (data, selectedTypeNodeKey) => {
    console.log(selectedTypeNodeKey);
    proxy.$confirm.require({
      message: "您确定删除此终端？",
      header: "删除终端",
      icon: "pi pi-info-circle",
      acceptLabel: "确定",
      rejectLabel: "取消",
      accept: () => {
        http.delete("/terminal/delete/" + data.id).then(() => {
          proxy.$toast.add({
            severity: "info",
            summary: "删除成功！",
            life: 3000,
          });
          proxy.$confirm.close();
          getTableData(Object.keys(selectedTypeNodeKey)[0]);
        });
      },

      reject: () => {
        proxy.$confirm.close();
      },
    });
  };
  return {
    page,
    getTableData,
    tableData,
    terminal,
    terminalDisplay,
    showTerminal,
    deleteTableItem,
    search,
    changePage,
  };
}
</script>

<style scoped>
::v-deep(.p-tree) {
  border: none;
  padding: 1rem;
  height: calc(100% - 60px);
  overflow-y: auto;
}

::v-deep(.p-treenode-label) {
  flex: 1;
}

.content {
  width: calc(100% - 280px);
  padding: 1rem;
  height: 100%;
}
</style>
