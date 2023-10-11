<template>
  <div class="table-title">
    <Button @click="addOrUpdate">新建用户组</Button>
    <div class="from">
      <div class="form-item p-mr-3">
        <label>名称：</label>
        <InputText v-model="query.groupCN" class="inout-t" @keyup.enter="getData"></InputText>
      </div>
      <Button @click="getData">查询</Button>
    </div>
  </div>
  <div style="height:calc(100% - 20px);overflow:hidden" id="allusersDataTable">
    <DataTable style="margin-top: 10px;width: 100%" frozenWidth="200px" :rowHover="true" :value="list" :scrollable="true" :scroll-height="scrollHeight" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
      paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
      <template #empty>
        <p style="width:100%;text-align: left;">暂无信息...</p>
      </template>
      <Column style="min-width: 10rem;" field="cn" header="名称">
        <template #body="a">
          <span class="center" v-if="a.data.cn">{{ a.data.cn[0] }}</span>
        </template>
      </Column>
      <Column style="min-width: 8rem;" field="member_user" header="用户数">
        <template #body="row">
          <span class="center" v-if="row.data.member_user">{{ row.data.member_user.length }}人</span>
          <span class="center" v-else>0人</span>
        </template>
      </Column>
      <Column style="min-width: 25rem;" field="description" header="描述">
        <template #body="a">
          <span class="center" v-if="a.data.description">{{ JSON.parse(a.data.description[0]).description }}</span>
        </template>
      </Column>
      <Column :frozen="true" align-frozen="right" style="min-width: 200px;justify-content: center" header="操作">
        <template #body="a">
          <Button class="p-button-link" @click="manageUser(a.data)">管理用户</Button>
          <!--          <Button class="p-button-link " @click="addOrUpdate(a.data)">编辑</Button>-->
          <Button class="p-button-link p-button-sm" style="color: red" @click="deleteDialog(a.data)">删除</Button>
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog v-model:visible="deleteDisplay" :modal="true" @hide="deleteDisplay=false" header="删除用户组" style="min-width: 250px">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span>您确认要删除用户组 "{{ deleteItem.cn[0] }}" 吗？</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="submitDelete" class="p-button-link" />
      <Button label="否" icon="pi pi-times" @click="deleteDisplay=false" class="p-button-secondary p-button-link" />
    </template>
  </Dialog>
  <CreateGroup v-if="groupDisplay" ref="CreateGroup" v-on:close="closeDialog"></CreateGroup>
  <ManageUser v-if="ManageDisplay" ref="manageUser" v-on:close="closeDialog"></ManageUser>
</template>

<script>
import CreateGroup from "@/views/modules/DomainManage/DomainManagePage/UserGroup/CreateGroup";
import ManageUser from "@/views/modules/DomainManage/DomainManagePage/UserGroup/ManageUser";

export default {
  name: "Group",
  emits: ["close"],

  components: { ManageUser, CreateGroup },
  props: ["domainId", "treeData"],
  watch: {
    domainId(val) {
      if (val.split("-")[1] == 0) {
        this.getData();
      } else {
        this.getData();
      }
    },
  },

  data() {
    return {
      scrollHeight: "400px",
      deleteDisplay: false,
      groupDisplay: false,
      ManageDisplay: false,
      deleteItem: null,
      list: [],
      query: {
        groupCN: null,
      },
    };
  },

  mounted() {
    const element = document.getElementById("allusersDataTable");
    const clientHeight = element.clientHeight;
    this.scrollHeight = clientHeight - 28 - 30 + "px";
    window.onresize = () => {
      const clientHeight = element.clientHeight;
      this.scrollHeight = clientHeight - 28 - 30 + "px";
    };
    this.getData();
  },
  methods: {
    getData() {
      this.$http
        .get("/usergroup/list", {
          params: {
            ouCN:
              this.domainId.split("-")[1] == 0
                ? null
                : this.domainId.split("-")[0],
            groupCN: this.query.groupCN,
            domainId:
              this.domainId.split("-")[1] == 0
                ? this.domainId.split("-")[0]
                : this.$global.Tree.searchDomainId(
                    this.treeData,
                    this.domainId.split("-")[0],
                    null
                  ),
          },
        })
        .then((res) => {
          this.list = res.data;
        });
    },
    addOrUpdate(item) {
      let domainId = this.$global.Tree.searchDomainId(
        this.treeData,
        this.domainId.split("-")[0],
        null
      );
      this.groupDisplay = true;
      this.$nextTick(() => {
        this.$refs.CreateGroup.init(this.domainId, item, domainId);
      });
    },
    closeDialog() {
      this.ManageDisplay = false;
      this.groupDisplay = false;
      this.getData();
    },
    deleteDialog(item) {
      this.deleteDisplay = true;
      this.deleteItem = item;
    },
    submitDelete() {
      let domainId =
        this.domainId.split("-")[1] == 0
          ? this.domainId.split("-")[0]
          : this.$global.Tree.searchDomainId(
              this.treeData,
              this.domainId.split("-")[0],
              null
            );
      this.$http
        .get("/usergroup/delete", {
          params: {
            domainId: domainId,
            cn: this.deleteItem.cn[0],
          },
        })
        .then(() => {
          this.deleteDisplay = false;
          this.$toast.add({
            severity: "info",
            summary: "删除成功！ ",
            life: 3000,
          });
          this.getData();
        });
    },
    manageUser(data) {
      let domainId =
        this.domainId.split("-")[1] == 0
          ? this.domainId.split("-")[0]
          : this.$global.Tree.searchDomainId(
              this.treeData,
              this.domainId.split("-")[0],
              null
            );
      this.ManageDisplay = true;
      this.$nextTick(() => {
        this.$refs.manageUser.init(data, domainId);
      });
    },
  },
};
</script>

<style scoped>
.Breadcrumb {
  margin: 0;
  color: rgba(0, 0, 0, 0.447058823529412);
}

.Breadcrumb:hover {
  color: #1fa1fc;
}

.table-title {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.from {
  display: flex;
}

.form-item {
  display: flex;
  align-items: center;
}

.inout-t {
  height: 29px;
  border: 1px solid #ced4da;
}

::v-deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  line-height: 27px;
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
}

.center {
  width: 100%;
  text-align: center;
}

::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
  justify-content: center;
}
</style>
