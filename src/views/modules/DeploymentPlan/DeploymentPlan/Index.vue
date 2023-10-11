<template>
  <div class="page">
    <div class="border-r">
      <p class="title">部署计划分类</p>
      <Tree :value="typeTree" selectionMode="single" :expanded-keys="expandedKeys"
            v-model:selection-keys="selectedTypeNodeKey" filterPlaceholder="请输入类型" filterMode="label"
            filter="true">
        <template #default="item">
          <span style="display:inline-block;width: 100%"
                @contextmenu="clickContextMenu($event,item.node)">{{ item.node.label }}</span>
        </template>
      </Tree>
      <context-menu ref="context" :model="contextMenu"></context-menu>
      <add-or-update-type v-if="typeDisplay" ref="addOrUpdateType" @close="closeTypeDialog"></add-or-update-type>
    </div>
    <div class="content">
      <div class="p-mb-3" style="display:flex;justify-content: space-between">
        <div>
          <Button label="新建部署计划" class="p-mr-3" @click="showMainDialog()"/>
          <Button label="清空部署记录" @click="clearPlan" :class="{'p-disabled':tableData.length===0}"/>
        </div>

        <div class="p-input-icon-right">
          <i class="pi pi-search"></i>
          <InputText v-model="search.name" placeholder="请输入名称检索"></InputText>
        </div>
      </div>
      <data-table :value="tableData" :rowHover="true" :scrollable="true" style="height:calc(100% - 90px);overflow:auto">
        <template #empty>
          <div class="p-text-center">暂无数据</div>
        </template>
        <column header="名称" field="name"></column>
        <column header="编号" field="code"></column>
        <column header="执行类型">
          <template #body="row">
            <Tag class="mr-2">
              {{ row.data.execType === 0 ? '立即执行' : (row.data.execType === 1 ? '定时执行' : '周期执行') }}
            </Tag>
          </template>
        </column>
        <column header="执行结果">
          <template #body="row">
            <Tag class="mr-2">
              {{
                '成功 ' + row.data.details.filter(item => item.status === 0).length + ' / 总数 ' + row.data.details.length
              }}
            </Tag>
          </template>
        </column>
        <column header="时间" field="time" style="min-width:13rem">
          <template #body="row">
            {{ new Date(row.data.time).toLocaleString('chinese', {hour12: false}).replace(/\//g, '-') }}
          </template>
        </column>
        <column header="操作" :header-style="{paddingLeft:'3rem'}" style="min-width:18rem">
          <template #body="row">
            <Button label="详情" icon="pi pi-eye" @click="showDetail(row.data)" class="p-button-link"/>
            <!--            <Button label="查看日志" icon="pi pi-file" class="p-button-link"></Button>-->
            <Button label="删除" icon="pi pi-trash" @click="deletePlan(row.data)" class="p-button-link"
                    style="color:red"></Button>
          </template>
        </column>
      </data-table>
      <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage"
                 template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                 :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
      </Paginator>
      <add-or-update-main ref="mainDialog" v-if="mainDisplay" @close="closeMainDialog"></add-or-update-main>
      <deploy-detail ref="deployDetail" @close="closeDetail"></deploy-detail>
    </div>
  </div>
</template>

<script>
import {nextTick, ref, reactive, watch, getCurrentInstance} from "vue";
import http from "../../../../http";
import addOrUpdateType from "./addOrUpdateType";
import AddOrUpdateMain from "./addOrUpdateMain";
import DeployDetail from "./deployDetail";

export default {
  name: "Index",
  components: {DeployDetail, AddOrUpdateMain, addOrUpdateType},
  setup() {
    const selectedTypeNodeKey = ref({});

    const expandedKeys = ref({});
    const typeTree = ref([]);
    const getTreeData = () => {
      http.get("/deploy/typeTree").then((res) => {
        typeTree.value = res.data;
        selectedTypeNodeKey.value[res.data[0].key] = true;
        expandedKeys.value[res.data[0].key] = true;
      });
    };
    getTreeData();

    const context = ref(null);
    const contextMenu = ref([]);
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
                  .delete("/deploy/deleteType/" + treeNode.data.id)
                  .then((res) => {
                    if (res["success"]) {
                      proxy.$toast.add({
                        severity: "info",
                        summary: "删除成功！",
                        life: 3000,
                      });
                      getTreeData();
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
    let treeNode = null;
    const clickContextMenu = (event, node) => {
      treeNode = node;
      if (node.data.code === "root") {
        contextMenu.value = allContextMenu.filter((item, index) => index < 2);
      } else {
        contextMenu.value = allContextMenu;
      }
      context.value.show(event);
    };

    const typeDisplay = ref(false);
    const addOrUpdateType = ref(null);
    const showTypeDialog = (type) => {
      typeDisplay.value = true;
      nextTick(() => {
        addOrUpdateType.value.init(type, treeNode);
      });
    };

    const closeTypeDialog = () => {
      typeDisplay.value = false;
      getTreeData();
    };

    const page = reactive({
      current: 1,
      size: 10,
      total: 0,
    });
    const search = reactive({
      name: null,
    });
    const tableData = ref([]);
    const getTableData = () => {
      http
          .get("/deploy/getMainPage", {
            params: {
              current: page.current,
              size: page.size,
              typeId: Object.keys(selectedTypeNodeKey.value)[0],
              name: search.name,
            },
          })
          .then((res) => {
            tableData.value = res.data.records;
            page.total = res.data.total;
          });
    };
    watch(
        selectedTypeNodeKey,
        () => {
          getTableData();
        },
        {deep: true}
    );

    const mainDialog = ref(null);
    const mainDisplay = ref(false);

    const showMainDialog = () => {
      mainDisplay.value = true;
      nextTick(() => {
        mainDialog.value.init({
          typeId: Object.keys(selectedTypeNodeKey.value)[0],
        });
      });
    };
    const closeMainDialog = () => {
      mainDisplay.value = false;
      getTableData();
    };

    const changePage = (e) => {
      page.current = e.page + 1;
      page.size = e.rows;
      getTableData();
    };
    const {proxy} = getCurrentInstance();

    const clearPlan = () => {
      proxy.$confirm.require({
        message: "您确定清除此类型下所有部署记录？",
        header: "清除部署记录",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          http
              .get(
                  "/deploy/clearDeployPlan/" +
                  Object.keys(selectedTypeNodeKey.value)[0]
              )
              .then(() => {
                proxy.$toast.add({
                  severity: "info",
                  summary: "删除成功！",
                  life: 3000,
                });
                proxy.$confirm.close();
                getTableData();
              });
        },
        reject: () => {
          proxy.$confirm.close();
        },
      });
    };
    const deletePlan = (data) => {
      proxy.$confirm.require({
        message: "您确定删除此计划？",
        header: "删除计划",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          http.delete("/deploy/deleteMain/" + data.id).then(() => {
            proxy.$toast.add({
              severity: "info",
              summary: "删除成功！",
              life: 3000,
            });
            proxy.$confirm.close();
            getTableData();
          });
        },

        reject: () => {
          proxy.$confirm.close();
        },
      });
    };

    const deployDetail = ref(null);
    const detailDisplay = ref(false);
    const showDetail = (data) => {
      detailDisplay.value = true;
      nextTick(() => {
        deployDetail.value.init(data);
      });
    };
    const closeDetail = () => {
      getTableData();
    };
    return {
      selectedTypeNodeKey,
      typeTree,
      context,
      contextMenu,
      clickContextMenu,
      typeDisplay,
      addOrUpdateType,
      closeTypeDialog,
      tableData,
      search,
      mainDialog,
      mainDisplay,
      showMainDialog,
      closeMainDialog,
      page,
      changePage,
      deletePlan,
      detailDisplay,
      deployDetail,
      showDetail,
      closeDetail,
      expandedKeys,
      clearPlan,
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

.content {
  width: calc(100% - 280px);
  padding: 1rem;
  height: 100%;
}
</style>
