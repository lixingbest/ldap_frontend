<template>
  <div class="p-grid page" style="height:calc(100% - 80px);padding:1rem">
    <div style="width:100%;display:flex;justify-content:space-between;align-items:center;height:50px">
      <Button @click="addOrUpdate()" style="background: rgba(17, 48, 102, 1);border-color: rgba(17, 48, 102, 1)" label="添加角色" icon="pi pi-plus" class="p-mr-2" />
      <div>
        <InputText style="width:200px;" v-model="name" placeholder="请输入角色名称" />
        <Button icon="pi pi-search" @click="getList" @keydown.enter="getList" style="background: #FFFFFF;color: #000000;opacity: 0.25;" />
      </div>
    </div>
    <DataTable style="width:100%;height:calc(100% - 130px);overflow:auto" :rowHover="true" :value="list" :scrollable="true">
      <template #empty>
        暂无数据
      </template>
      <Column field="name" header="角色名称"></Column>
      <Column field="code" header="编号"></Column>
      <Column field="enable" header="启用">
        <template #body="slotProps">
          <span :class="slotProps.data.enable == 0 ? 'admin-status' : 'danger-status'">
            <label style="width: 100%;display: block;text-align: center;line-height: 22px">{{
                slotProps.data.enable == 0 ? '启用' : '禁用'
              }}</label>
          </span>
        </template>
      </Column>
      <Column frozen alignFrozen="right" :exportable="false" header="操作" style="min-width:15rem;">
        <template #body="data">
          <a style="padding-right:8px; margin:0;border-right:1px solid rgba(216, 216, 216, 1)" href="javascript:" class="a-button" @click="addOrUpdate(data.data)">编辑</a>
          <a style="padding:0 8px;margin:0;" href="javascript:" class="a-button" @click="addOrUp(data.data)">分配菜单</a>
          <a style="padding:0 8px;border-left:1px solid rgba(216, 216, 216, 1);" href="javascript:" class="a-button" @click="deleteItem(data.data)">删除</a>
        </template>
      </Column>
      <template #paginatorLeft></template>
    </DataTable>
    <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
      :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
    </Paginator>
    <add-or-update-role ref="addOrUpdateRole" v-if="addOrUpdateDisplay" v-on:close="closeDialog"></add-or-update-role>
    <add-or-up-role ref="addOrUpRole" v-if="addOrUpdateDisplay" v-on:close="closeDialog"></add-or-up-role>
  </div>
</template>

<script>
import AddOrUpdateRole from "./addOrUpdateRole";
import AddOrUpRole from "./addOrUpRole";

export default {
  name: "RoleManage",
  components: { AddOrUpdateRole, AddOrUpRole },
  data() {
    return {
      list: [],
      page: {
        size: 10,
        total: "",
        current: 1,
      },
      addOrUpdateDisplay: false,
      name: null,
      buttons: {
        tjjsBt: false,
        bjBt: false,
        fpcdBt: false,
        scBt: false,
      },
    };
  },
  mounted() {
    this.getList();
    // this.addNewGoods()
  },
  methods: {
    getList() {
      this.$http
        .get("/role/getList", {
          params: {
            current: this.page.current,
            size: this.page.size,
            name: this.name,
            enable: null,
          },
        })
        .then((res) => {
          // console.log(res.data)
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
    addOrUp(data) {
      this.addOrUpdateDisplay = true;
      this.$nextTick(() => {
        this.$refs.addOrUpRole.init(data);
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
        message: "您确定要删除" + data.name + " 吗？",
        header: "删除本条数据",
        icon: "pi pi-info-circle",
        acceptLabel: "确认",
        accept: () => {
          this.delete(data);
        },
        rejectLabel: "取消",
        reject: () => {},
      });
    },
    delete(data) {
      this.$http.delete("/role/del/" + data.id).then(() => {
        this.$toast.add({
          severity: "success",
          summary: "成功",
          detail: "角色删除成功",
          life: 3000,
        });
        this.getList();
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
::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  height: 4rem;
}

.admin-status {
  width: 56px;
  height: 22px;
  border: 1px double #91d5ff;
  color: #1890ff;
  font-size: 12px;
  background-color: #e6f7ff;
}

.user-status {
  width: 56px;
  height: 22px;
  border: 1px double #b7eb8f;
  color: #52c41a;
  font-size: 12px;
  background-color: #f6ffed;
}

.danger-status {
  width: 56px;
  height: 22px;
  border: 1px double #f47983;
  color: #f00056;
  font-size: 12px;
  background-color: #ffb3a7;
}

.a-button {
  color: #12a25d;
  background-color: unset;
  border: none;
}
</style>
