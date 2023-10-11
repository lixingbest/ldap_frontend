<template>
  <div class="p-grid page" style="height:calc(100% - 80px);padding:1rem">
    <div style="width:100%;display:flex;justify-content:space-between;align-items:center;height:50px">
      <Button @click="addOrUpdate()" style="background: rgba(17, 48, 102, 1);border-color: rgba(17, 48, 102, 1)"
              label="添加菜单" icon="pi pi-plus" class="p-mr-2"/>
      <div>
        <InputText style="width:200px;" v-model="name" placeholder="请输入菜单名称"/>
        <Button icon="pi pi-search" @click="getList" @keydown.enter="getList"
                style="background: #FFFFFF;color: #000000;opacity: 0.25;"/>
      </div>
    </div>

    <TreeTable :scrollable="true" :value="list" :row-hover="true"
               style="width:100%;height:calc(100% - 130px);overflow:auto">
      <template #empty>
        暂无数据
      </template>
      <Column field="name" header="菜单名称" :expander="true" style="min-width:15em"></Column>
      <Column field="type" header="类型" style="min-width:10rem">
        <template #body="data">
          <span :class="data.node.data.type == 0 ? 'user-status':'menu-status'">
            <label
                style="width: 100%;text-align: center;line-height: 22px">{{ data.node.data.type == 0 ? '菜单' : '目录' }}</label></span>
        </template>
      </Column>
      <Column field="url" header="地址" style="min-width:20rem"></Column>
      <Column field="icon" header="字体图表名称" style="min-width:10rem">
        <template #body="data">
          <i :class="data.node.data.icon"></i>
        </template>
      </Column>
      <Column field="idx" header="排序索引" style="min-width:5rem"></Column>
      <Column field="enable" header="启用" style="min-width:8rem">
        <template #body="data">
          <span :class="data.node.data.enable == 0 ? 'admin-status' : 'danger-status'">
            <label
                style="width: 100%;text-align: center;line-height: 22px">{{ data.node.data.enable == 0 ? '启用' : '禁用' }}</label>
          </span>
        </template>
      </Column>
      <Column frozen alignFrozen="right" :exportable="false" header="操作" style="min-width:15rem;">
        <template #body="data">
          <a style="padding-right:8px; margin:0;border-right:1px solid rgba(216, 216, 216, 1);" href="javascript:"
             class="a-button s-button" @click="addOrUpdate(data.node.data)">编辑</a>
          <a style="padding:0 8px;" href="javascript:" class="a-button s-button"
             @click="deleteItem(data.node.data)">删除</a>
        </template>
      </Column>
      <template #paginatorLeft></template>
    </TreeTable>
    <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage"
               template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
               :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
      <template #right>
        <label>跳至&nbsp;&nbsp;</label>
        <!-- :v-tooltip.focus="$primevue.config.language.menus.Ejump" -->
        <InputNumber v-model="page.current" @keydown.enter="getList" inputStyle="width: 40px;"/>
        <label>&nbsp;&nbsp;页</label>
      </template>
    </Paginator>
    <add-or-update-menus ref="addOrUpdateRole" v-if="addOrUpdateDisplay" v-on:close="closeDialog"></add-or-update-menus>
  </div>
</template>

<script>
import AddOrUpdateMenus from "./addOrUpdateMenus";
import TreeTable from "primevue/treetable";
import Column from "primevue/column";

export default {
  name: "MenuManage",
  components: {AddOrUpdateMenus, TreeTable, Column},
  data() {
    return {
      list: null,
      page: {
        size: 10,
        total: "",
        current: 1,
      },
      addOrUpdateDisplay: false,
      name: null,
      buttons: {
        tjcdBt: false,
        bjBt: false,
        scBt: false,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http
          .get("/resource/getList", {
            params: {
              current: this.page.current,
              size: this.page.size,
              name: this.name,
              enable: null,
            },
          })
          .then((res) => {
            this.page.total = res.data.total;
            this.list = res.data.records;
          });
    },
    addOrUpdate(data) {
      this.addOrUpdateDisplay = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRole.init(data);
      });
    },
    closeDialog() {
      this.addOrUpdateDisplay = false;
      this.getList();
    },
    changePage(page) {
      this.page.size = page.rows;
      this.page.current = page.page + 1;
      this.getList();
    },

    deleteItem(data) {
      this.$confirm.require({
        message: "您确定要删除" + data.name + "吗？",
        header: "删除本条数据",
        icon: "pi pi-info-circle",
        acceptLabel: "确认",
        accept: () => {
          // console.log(data)
          this.delete(data);
        },
        rejectLabel: "取消",
        reject: () => {
        },
      });
    },
    delete(data) {
      this.$http.delete("/resource/del/" + data.id).then((res) => {
        if (res.success) {
          this.$toast.add({
            severity: "info",
            summary: "删除成功！",
            life: 3000,
          });
          this.getList();
        }
      });
    },
  },
};
</script>

<style scoped>
p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 1rem;
  cursor: pointer;
}

h3 {
  padding: 1rem 0 1rem 10px;
  line-height: 1;
  font-weight: 800;
  position: relative;
}

h3::after {
  content: "";
  width: 5px;
  height: 16px;
  background-color: var(--primary-color);
  position: absolute;
  left: 0px;
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  min-width: 100px;
  white-space: nowrap;
}

.menu-status {
  text-align: center;
  width: 56px;
  height: 22px;
  border: 1px double #91d5ff;
  color: #1890ff;
  font-size: 12px;
  background-color: #e6f7ff;
}

.mulu-status {
  text-align: center;
  width: 56px;
  height: 22px;
  border: 1px double yellow;
  color: gold;
  font-size: 12px;
  background-color: lightyellow;
}

.admin-status {
  text-align: center;
  width: 56px;
  height: 22px;
  border: 1px double #91d5ff;
  color: #1890ff;
  font-size: 12px;
  background-color: #e6f7ff;
}

.user-status {
  text-align: center;
  width: 56px;
  height: 22px;
  border: 1px double #b7eb8f;
  color: #52c41a;
  font-size: 12px;
  background-color: #f6ffed;
}

.danger-status {
  text-align: center;
  width: 56px;
  height: 22px;
  border: 1px double #f47983;
  color: #f00056;
  font-size: 12px;
  background-color: #ffb3a7;
}

.a-button {
  color: #12a25d;
}
</style>
