<template>
  <div class="page">
    <div class="border-r">
      <p class="title">策略分类</p>
      <Tree :value="treeData" selectionMode="single" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKeys" @node-select="selectTreeNode">
        <template #default="row">
          <div @contextmenu.prevent="showContextmenu($event,row.node)">{{ row.node.label }}</div>
        </template>
      </Tree>
      <context-menu ref="context" :model="contextmenuList"></context-menu>
      <add-or-update-type ref="typeDialog" v-if="typeDisplay" @close="hideTypeDialog"></add-or-update-type>
    </div>
    <div class="content">
      <div class="queryForm">
        <div>
          <Button @click="addOrUpdate()">新增</Button>
        </div>
        <div class="query-input">
          <div>
            <label>命令说明：</label>
            <InputText v-model="query.name" @keydown.enter="getTableData"></InputText>
          </div>
          <Button @click="getTableData()">查询</Button>
        </div>
      </div>
      <div class="p-p-3" id="scroll_table_block" style="height:calc(100% - 71px);overflow: hidden">
        <DataTable :value="tableData" :scrollHeight="scrollHeight" :rowHover="true" :scrollable="true" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
          <template #empty>
            <p style="text-align: center">暂无数据</p>
          </template>
          <Column style="min-width: 14rem;" field="comments" header="说明">
            <template #body="row">
              <span v-tooltip.left="row.data.comments">{{ row.data.comments }}</span>
            </template>
          </Column>
          <Column style="max-width: 12rem;" field="code" header="编号"></Column>
          <Column style="max-width: 12rem;" field="name" header="命令名称"></Column>
          <Column style="max-width: 14rem;" field="type" header="命令用途"></Column>
          <Column style="max-width: 30rem;" field="args" header="参数说明">
            <template #body="row">
              <span v-tooltip.left="row.data.args">{{ row.data.args }}</span>
            </template>
          </Column>
          <Column style="max-width: 10rem;" field="userName" header="发布人"></Column>
          <Column style="max-width: 10rem;" field="updateTime" header="发布时间">
            <template #body="row">
              {{ Util.getFormatDate(row.data.updateTime) }}
            </template>
          </Column>
          <Column style="max-width: 7rem;" field="os" header="适配系统"></Column>
          <Column style="max-width: 7rem;" field="arch" header="适配架构"></Column>
          <Column style="max-width: 7rem;" field="version" header="适配版本"></Column>
          <Column style="max-width: 8rem;" field="command" header="命令内容">
            <template #body="row">
              <span v-tooltip.left="row.data.command">{{ row.data.command }}</span>
            </template>
          </Column>

          <Column :frozen="true" align-frozen="right" style="min-width: 18rem;" header="操作">
            <template #body="row">
              <Button class="p-button-sm p-button-link" @click="showDetail(row.data)">查看详情</Button>
              <Button class="p-button-sm p-button-link" @click="addOrUpdate(row.data)">编辑</Button>
              <Button class="p-button-sm p-button-link" style="color: red" @click="deleteById(row.data.id)">删除</Button>
            </template>
          </Column>
        </DataTable>
      </div>
      <add-or-update-command v-if="commandDisplay" ref="commandInst" @close="closeAddOrUpdateInst"></add-or-update-command>
      <ShowInfo v-if="showInfoDisplay" @close="showInfoDisplay=false" ref='showInfoInst'></ShowInfo>
    </div>
  </div>
</template>

<script>
import ShowInfo from "@/views/modules/PublicPolicy/PublicPolicy/showInfo";
import { nextTick, reactive, ref, onMounted } from "vue";
import http from "../../../../http";
import AddOrUpdateType from "./addOrUpdateType";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import AddOrUpdateCommand from "@/views/modules/PublicPolicy/PublicPolicy/AddOrUpdateCommand";
import Util from "@/views/modules/Public/method/Util";

export default {
  name: "DomainLog",
  components: { AddOrUpdateCommand, AddOrUpdateType, ShowInfo },
  setup() {
    const scrollHeight = ref("400px");

    onMounted(() => {
      const element = document.getElementById("scroll_table_block");
      const clientHeight = element.clientHeight;
      scrollHeight.value = clientHeight - 28 - 50 + "px";

      window.onresize = () => {
        const clientHeight = element.clientHeight;
        scrollHeight.value = clientHeight - 28 - 50 + "px";
      };
    });
    const toast = useToast();
    const confirm = useConfirm();
    const showPolicy = ref(null);

    const treeData = ref([]);
    const expandedKeys = ref({});
    const selectedKeys = ref({});
    const getTreeData = () => {
      http.get("/strategy/Settings/command/getTree").then((res) => {
        treeData.value = res.data;
        expandedKeys.value = {};
        selectedKeys.value = {};
        expandedKeys.value[res.data[0].key] = true;
        selectedKeys.value[res.data[0].key] = true;

        selectTreeNode(res.data[0]);
      });
    };
    getTreeData();

    let selectedNode = null;
    const selectTreeNode = (node) => {
      selectedNode = node;
      getTableData();
    };

    const context = ref(null);

    const typeDialog = ref(null);
    const typeDisplay = ref(false);

    const showTypeDialog = (type) => {
      typeDisplay.value = true;
      nextTick(() => {
        typeDialog.value.init(type, nodeData);
      });
    };
    const hideTypeDialog = () => {
      typeDisplay.value = false;
      getTreeData();
    };

    const contextmenu = [
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
          confirm.require({
            message: "您确定删除此类型？",
            header: "删除类型",
            icon: "pi pi-info-circle",
            acceptLabel: "确定",
            rejectLabel: "取消",
            accept: () => {
              http
                .delete(
                  "/strategy/Settings/command/deleteType/" + nodeData.data.id
                )
                .then((res) => {
                  if (res["success"]) {
                    toast.add({
                      severity: "info",
                      summary: "删除成功！",
                      life: 3000,
                    });
                    getTreeData();
                  } else {
                    toast.add({
                      severity: "warn",
                      summary: res.message,
                      life: 3000,
                    });
                  }
                });
            },
            reject: () => {
              confirm.close();
            },
          });
        },
      },
    ];
    const contextmenuList = ref([]);

    let nodeData = null;
    const showContextmenu = (event, node) => {
      if (node.data.code === "root") {
        contextmenuList.value = contextmenu.filter(
          (item) => !item.label.includes("删除类型")
        );
      } else {
        contextmenuList.value = contextmenu;
      }
      context.value.show(event);

      nodeData = node;
    };

    const page = reactive({
      current: 1,
      size: 10,
      total: 0,
    });

    const tableData = ref([]);

    const query = reactive({
      name: null,
    });

    function getTableData() {
      http
        .get("/strategy/Settings/command/getCommandPage", {
          params: {
            current: page.current,
            size: page.size,
            typeId: selectedNode.data.id,
            name: query.name,
          },
        })
        .then((res) => {
          if (res.success) {
            tableData.value = res.data.records;
            page.total = res.data.total;
          }
        });
    }

    function changePage(event) {
      page.current = event.page + 1;
      getTableData();
    }

    const showInfoInst = ref(null);
    const showInfoDisplay = ref(false);

    function showDetail(data) {
      showInfoDisplay.value = true;
      nextTick(() => {
        showInfoInst.value.init(data);
      });
    }

    const commandDisplay = ref(false);
    const commandInst = ref(null);

    function addOrUpdate(data) {
      commandDisplay.value = true;
      nextTick(() => {
        commandInst.value.init(data);
      });
    }

    function closeAddOrUpdateInst() {
      commandDisplay.value = false;
      getTableData();
    }

    function deleteById(id) {
      confirm.require({
        message: "您确定删除此命令？",
        header: "删除命令",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          http
            .delete("/strategy/Settings/command/deleteById/" + id)
            .then((res) => {
              if (res["success"]) {
                toast.add({
                  severity: "info",
                  summary: "删除成功！",
                  life: 3000,
                });
                getTreeData();
              } else {
                toast.add({
                  severity: "warn",
                  summary: res.message,
                  life: 3000,
                });
              }
            });
        },
        reject: () => {
          confirm.close();
        },
      });
    }

    return {
      showPolicy,
      treeData,
      expandedKeys,
      selectedKeys,
      selectTreeNode,
      context,
      contextmenuList,
      showContextmenu,
      typeDisplay,
      typeDialog,
      hideTypeDialog,
      page,
      getTableData,
      tableData,
      changePage,
      query,
      commandInst,
      commandDisplay,
      closeAddOrUpdateInst,
      showDetail,
      addOrUpdate,
      deleteById,
      showInfoInst,
      showInfoDisplay,
      Util,
      scrollHeight,
    };
  },
};
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

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  /* justify-content: center; */
  white-space: nowrap;
}

::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
  overflow: hidden;
  white-space: nowrap;
}

/* ::v-deep(.p-datatable-scrollable .p-datatable-tfoot > tr > td) {
  justify-content: center;
} */

.content {
  width: calc(100% - 280px);
  height: 100%;
}

.table-head {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.queryForm {
  padding: 2rem 0 0 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.queryForm > div {
  margin-right: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.query-input > div {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.query-input > div > input {
  margin-right: 0.5rem;
  width: calc(100% - 100px);
}

.result-menu {
  list-style: none;
  display: flex;
  margin: 0 0 1rem 0;
  padding: 0;
  border-bottom: 2px solid;
  border-color: #ced4da;
}

.result-menu li {
  display: flex;
  justify-content: center;
  padding: 0 1rem 0 0;
  cursor: pointer;
}

.result-menu li span {
  padding: 0.8rem 1rem;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-top: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
  position: relative;
  bottom: -2px;
  z-index: 2;
  font-weight: 600;
  background-color: #ffffff;
  border-color: #ced4da;
}
</style>
