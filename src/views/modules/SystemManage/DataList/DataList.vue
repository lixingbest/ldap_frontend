<template>
  <div class="p-grid page">
    <div class="p-p-0 border-r" :class="{'p-col-2':menu_closed,'p-col-3':!menu_closed}">
      <p class="title">
        字典类别
      </p>
      <Tree :value="root" selection-mode="single" @node-select="selectedNode" @node-unselect="unselectNode" :meta-key-selection="false" @contextmenu.prevent="showMenu" v-model:selection-keys="selectKeys"
        :expanded-keys="expandedKeys"></Tree>
      <ContextMenu style="width: 10rem" ref="menu" :model="menu">
        <template #item="{item}">
          <div style="padding: 5px 1rem;cursor: pointer" :style="{'color':item.index===3?'red':'#495057'}" @click="clickMenu(item.index)">
            <i class="p-mr-3" :class="item.icon" />{{ item.label }}
          </div>
        </template>
      </ContextMenu>
    </div>
    <div class="p-col p-p-0" style="height: 100%;width:calc(100% - 280px)">
      <p class="title">字典配置</p>
      <div class="p-m-3 scroll-view">
        <p class="name">
          <span>字典主记录</span>
        </p>
        <div class="table-heard">
          <Button :disabled="selectNode&&selectNode.pid!==null?null:'disable'" class="p-mb-3" @click="addOrUpdateItem()">
            添加主条目
          </Button>
          <div>
            <div class="p-mr-3">
              <label>名称：</label>
              <InputText v-model="query.name" @keydown.enter="getDictItem()"></InputText>
            </div>
            <div class="p-mr-3">
              <label>编号：</label>
              <InputText v-model="query.code" @keydown.enter="getDictItem()"></InputText>
            </div>
            <Button @click="getDictItem()">查询</Button>
          </div>
        </div>
        <data-table :value="dictItem" class="p-datatable-sm" v-model:selection="dictRecordRow" selection-mode="single" @row-click="getDictRecords" :rowHover="true" :scrollable="true">
          <template #empty>
            暂无数据
          </template>
          <Column header="名称" field="name"></Column>
          <Column header="编号" field="code"></Column>
          <Column header="说明" field="comments"></Column>
          <Column header="操作">
            <template #body="row">
              <Button class="p-button-link " @click="addOrUpdateItem(row.data)">编辑</Button>
              <Button class="p-button-link " style="color: red;" @click="deleteDialog(2,row.data.id)">删除</Button>
            </template>
          </Column>
        </data-table>
        <Paginator style="width:100%;text-align:center" :rows="itemPage.size" :totalRecords="itemPage.total" @page="changeItemPage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
          :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
        </Paginator>
        <p class="name p-mt-3">
          <span>字典明细条目</span>
        </p>
        <div class="table-heard">
          <Button :disabled="dictRecordRow?null:'disable'" class="p-mb-3" @click="addOrUpdateRow(dictRecordRow.id)">
            添加明细条目
          </Button>
          <div>
            <div class="p-mr-3">
              <label>条目编号：</label>
              <InputText v-model="query_1.code" @keydown.enter="getDictRecords()"></InputText>
            </div>
            <Button @click="getDictRecords()">查询</Button>
          </div>
        </div>
        <data-table :value="dictRecord" :auto-layout="true" :rowHover="true" :scrollable="true" class="p-datatable-sm">
          <template #empty>
            暂无数据
          </template>
          <Column header="条目编号" field="code"></Column>
          <Column header="条目值" field="value"></Column>
          <Column header="条目说明" field="comments"></Column>
          <Column header="操作">
            <template #body="row">
              <Button class="p-button-link " @click="addOrUpdateRow(row.data)">编辑</Button>
              <Button class="p-button-link " style="color: red;" @click="deleteDialog(3,row.data.id)">删除</Button>
            </template>
          </Column>
        </data-table>
        <Paginator style="width:100%;text-align:center" :rows="rowPage.size" :totalRecords="rowPage.total" @page="changeRowPage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
          :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
        </Paginator>
      </div>
    </div>
  </div>
  <Dialog header="删除字典类别" v-model:visible="dialogDisplay" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span> 您确认要删除所选的{{ deleteItem.type }}吗?</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="deleteItem.i===1?submitDeleteType():(deleteItem.i===2?deleteItemFun():(deleteItem.i===3?deleteRowFun():null))" class="p-button-link" />
      <Button label="否" icon="pi pi-times" @click="dialogDisplay=false" class="p-button-secondary p-button-link" />
    </template>
  </Dialog>
  <AddOrUpdateType v-if="typeDisplay" :treeList="root" :select-node="selectNode" ref="addOrUpdateType" v-on:close="closeDialog(1)"></AddOrUpdateType>
  <AddOrUpdateRow v-if="rowDisplay" :select-row="dictRecordRow" ref="addOrUpdateRow" v-on:close="closeDialog(2)"></AddOrUpdateRow>
  <AddOrUpdateItem v-if="itemDisplay" :tree-list="root" :select-node="selectNode" ref="addOrUpdateItem" v-on:close="closeDialog(3)"></AddOrUpdateItem>
</template>

<script>
import AddOrUpdateType from "@/views/modules/SystemManage/DataList/AddOrUpdateType";
import AddOrUpdateRow from "@/views/modules/SystemManage/DataList/AddOrUpdateRow";
import AddOrUpdateItem from "@/views/modules/SystemManage/DataList/AddOrUpdateItem";

export default {
  name: "AgenciesManage",
  components: { AddOrUpdateItem, AddOrUpdateRow, AddOrUpdateType },
  data() {
    return {
      dialogDisplay: false,
      typeDisplay: false,
      rowDisplay: false,
      itemDisplay: false,
      dictRecord: null,
      dictRecordRow: null,
      dictItem: null,
      expandedKeys: {},
      selectKeys: {},
      selectNode: null,
      root: [],
      deleteItem: null,
      itemPage: {
        current: 1,
        total: 0,
        size: 10,
      },
      rowPage: {
        current: 1,
        total: 0,
        size: 10,
      },
      menu: [],
      allMenu: [
        { index: 1, label: "新增类别", icon: "fa fa-plus" },
        { index: 2, label: "编辑类别", icon: "fa fa-pencil" },
        { index: 3, label: "删除类别", icon: "fa fa-trash-o" },
      ],
      query: {
        name: null,
        code: null,
      },
      query_1: {
        code: null,
      },
    };
  },
  computed: {
    menu_closed() {
      return this.$store.state.menu_closed;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let _this = this;
      this.$http.get("/dict/list").then((res) => {
        this.root = this.makeTreeData(res.data);
        res.data.forEach((item) => {
          console.log(item);
          if (item.pid == null) {
            this.expandedKeys[item.id] = true;
          }
          if (item.id === Number(Object.keys(_this.selectKeys)[0])) {
            this.selectNode = item;
          }
        });
      });
    },
    getDictRecords(row) {
      this.$http
        .get("/dictrecords/list", {
          params: {
            itemId: row ? row.data.id : this.dictRecordRow.id,
            current: this.rowPage.current,
            size: this.rowPage.size,
            code: this.query_1.code,
          },
        })
        .then((res) => {
          this.rowPage.total = res.data.total;
          this.dictRecord = res.data.records;
        });
    },
    getDictItem() {
      this.$http
        .get("/dictitem/list", {
          params: {
            dictId: this.selectNode.id,
            current: this.itemPage.current,
            size: this.itemPage.size,
            code: this.query.code,
            name: this.query.name,
          },
        })
        .then((res) => {
          this.itemPage.total = res.data.total;
          this.dictItem = res.data.records;
          this.dictRecord = [];
        });
    },
    makeTreeData(data) {
      let treeData = JSON.parse(JSON.stringify(data));
      let map = {};
      treeData.forEach((item) => {
        item.key = item.id;
        item.label = item.name;
        item.icon = "fa fa-book";
        map[item.id] = item;
      });
      let res = [];
      treeData.forEach((item) => {
        let parent = map[item.pid];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          res.push(item);
        }
      });
      return res;
    },
    closeDialog(i) {
      switch (i) {
        case 1: {
          this.typeDisplay = false;
          this.getData();
          break;
        }
        case 2: {
          this.rowDisplay = false;
          this.dictRecordRow.id ? this.getDictRecords() : null;
          break;
        }
        case 3: {
          this.itemDisplay = false;
          this.getDictItem();
        }
      }
    },
    selectedNode(node) {
      this.menu = [];
      if (node.pid == null) {
        this.menu.push(this.allMenu[0]);
      } else {
        this.menu = this.allMenu;
      }

      this.selectNode = node;
      this.getDictItem();
    },
    unselectNode() {
      this.selectNode = null;
    },
    addOrUpdateType(data) {
      this.typeDisplay = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateType.init(data);
      });
    },
    submitDeleteType() {
      this.$http
        .get("/dict/remove", {
          params: {
            ids: Object.keys(this.selectKeys).toString(),
          },
        })
        .then(() => {
          this.$toast.add({
            severity: "info",
            summary: "删除成功！",
            life: 3000,
          });
          this.dialogDisplay = false;
          this.getData();
        });
    },
    addOrUpdateRow(data) {
      this.rowDisplay = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRow.init(data);
      });
    },
    addOrUpdateItem(data) {
      this.itemDisplay = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateItem.init(data);
      });
    },
    deleteItemFun() {
      this.$http
        .get("/dictitem/remove", {
          params: { ids: this.deleteItem.data },
        })
        .then(() => {
          this.$toast.add({
            severity: "info",
            summary: "删除成功！",
            life: 3000,
          });
          this.dialogDisplay = false;
          this.getDictItem();
          if (
            this.dictRecordRow &&
            Number(this.deleteItem.data) === Number(this.dictRecordRow.id)
          )
            this.dictRecordRow = null;
        });
    },
    deleteRowFun() {
      this.$http
        .get("/dictrecords/remove", {
          params: { ids: this.deleteItem.data },
        })
        .then(() => {
          this.$toast.add({
            severity: "info",
            summary: "删除成功！",
            life: 3000,
          });
          this.dialogDisplay = false;
          this.getDictRecords();
        });
    },
    deleteDialog(i, data) {
      this.dialogDisplay = true;
      this.deleteItem = {
        i: i,
        data: data,
      };
      switch (i) {
        case 1: {
          this.deleteItem.type = "类别";
          break;
        }
        case 2: {
          this.deleteItem.type = "条目";
          break;
        }
        case 3: {
          this.deleteItem.type = "明细条目";
          break;
        }
      }
    },
    changeItemPage(page) {
      console.log(page);
      this.itemPage.current = page.page + 1;
      this.itemPage.size = page.rows;
      this.getDictItem();
    },
    changeRowPage(page) {
      this.rowPage.current = page.page + 1;
      this.rowPage.size = page.rows;
      this.getDictRecords();
    },
    showMenu(event) {
      if (this.selectNode) {
        this.$refs.menu.show(event);
      }
    },
    clickMenu(i) {
      switch (i) {
        case 1: {
          this.addOrUpdateType();
          break;
        }
        case 2: {
          this.addOrUpdateType(this.selectNode);
          break;
        }
        case 3: {
          this.deleteDialog(1);
        }
      }
    },
  },
};
</script>

<style scoped>
.border {
  border: 1px solid #dee2e6;
  min-height: 100%;
}

.p-grid {
  margin: 0;
}

::v-deep(.p-tree) {
  border: none;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.name {
  border-bottom: 1px solid #dee2e6;
}

.name span {
  padding: 3px 15px;
  display: inline-block;
  border-top: 1px solid #dee2e6;
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
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

::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody tr td) {
  text-align: center;
}

.scroll-view {
  overflow-y: auto;
  height: calc(100% - 100px);
}

.table-heard {
  display: flex;
  justify-content: space-between;
}

.table-heard > div {
  display: flex;
}
</style>
