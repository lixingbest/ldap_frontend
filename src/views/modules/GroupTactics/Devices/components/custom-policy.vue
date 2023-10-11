<template>
  <Dialog style="width:70rem" header="选择策略" :modal="true" v-model:visible="display" @hide="$emit('close')">
    <div style="display:flex">
      <Tree style="flex:1" :value="treeData" selectionMode="single" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKeys" @node-select="selectTreeNode">
        <template #default="row">
          <div @contextmenu.prevent="showContextmenu($event,row.node)">{{ row.node.label }}</div>
        </template>
      </Tree>
      <DataTable style="flex:3;overflow-x:auto;margin-left:1rem" v-model:selection="selectedDatas" :value="tableData" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10"
        :rowsPerPageOptions="[10, 20, 50,100]" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
        <template #empty>
          <p style="text-align: center">暂无数据</p>
        </template>
        <Column selectionMode="single" style="max-width:3rem"></Column>
        <Column style="min-width: 14rem;" field="comments" header="说明">
          <template #body="row">
            <span v-tooltip.left="row.data.comments">{{row.data.comments}}</span>
          </template>
        </Column>
        <Column style="max-width: 12rem;" field="code" header="编号"></Column>
        <Column style="max-width: 12rem;" field="name" header="命令名称"></Column>
        <Column style="max-width: 14rem;" field="type" header="命令用途"></Column>
        <Column style="max-width: 30rem;" field="args" header="参数说明">
          <template #body="row">
            <span v-tooltip.left="row.data.args">{{row.data.args}}</span>
          </template>
        </Column>
        <Column style="max-width: 30rem;" field="value" header="变量参数">
          <template #body="row">
            <span v-tooltip.left="row.data.value">{{row.data.value}}</span>
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
            <span v-tooltip.left="row.data.command">{{row.data.command}}</span>
          </template>
        </Column>

        <!-- <Column :frozen="true" align-frozen="right" style="min-width: 18rem;" header="操作">
          <template #body="row">
            <Button class="p-button-sm p-button-link" @click="showDetail(row.data)">查看详情</Button>
            <Button class="p-button-sm p-button-link" @click="addOrUpdate(row.data)">编辑</Button>
            <Button class="p-button-sm p-button-link" style="color: red" @click="deleteById(row.data.id)">删除</Button>
          </template>
        </Column> -->
      </DataTable>
    </div>
    <template #footer>
      <Button label="取消" @click="display=false" />
      <Button label="确认" @click="confirm" />
    </template>
  </Dialog>
</template>
<script>
import Util from "@/views/modules/Public/method/Util";
export default {
  data() {
    return {
      display: false,
      Util: Util,
      selectedNode: null,
      treeData: [],
      expandedKeys: {},
      selectedKeys: {},
      tableData: [],
      selectedDatas: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },

  methods: {
    init() {
      this.display = true;
      this.getTree();
    },
    selectTreeNode(node) {
      this.selectedNode = node;
      this.getData();
    },
    getTree() {
      this.$http.get("/strategy/Settings/command/getTree").then((res) => {
        this.treeData = res.data;
        this.expandedKeys = {};
        this.selectedKeys = {};
        this.expandedKeys[res.data[0].key] = true;
        this.selectedKeys[res.data[0].key] = true;
        this.selectTreeNode(res.data[0]);
      });
    },
    getData() {
      this.$http
        .get("/strategy/Settings/command/getCommandPage", {
          params: {
            current: this.page.current,
            size: this.page.size,
            typeId: this.selectedNode.data.id,
          },
        })
        .then((res) => {
          if (res.success) {
            this.tableData = res.data.records;
            this.page.total = res.data.total;
          }
        });
    },
    confirm() {
      if (this.selectedDatas.length == "0") {
        this.$toast.add({
          severity: "error",
          summary: "请选择策略！",
          life: 3000,
        });
      } else {
        this.$emit("policyData", this.selectedDatas);
        this.display = false;
      }
    },
  },
};
</script>
<style scoped>
::v-deep(.p-tree) {
  border: none;
  border-right: 1px solid #dee2e6;
  padding: 1rem;
  height: calc(100% - 60px);
  overflow-y: auto;
}
::v-deep(.p-dialog .p-dialog-content) {
  padding: 0;
}
::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  /* justify-content: center; */
  white-space: nowrap;
}

::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
  overflow: hidden;
  white-space: nowrap;
}
::v-deep(.p-selection-column) {
  max-width: 3rem;
}
</style>
