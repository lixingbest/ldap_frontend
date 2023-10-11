<template>
  <div class="p-grid page" style="height:calc(100% - 80px)">
    <div class="p-col-2 p-p-0 border-r" style="height:100%">
      <p class="title">域信息</p>
      <tree :value="domainTree" style="border:none;height:calc(100% - 60px);overflow-y:auto" selection-mode="single"
            v-model:selection-keys="selectedTreeKey" :expanded-keys="expandTreeKey">
        <template #default="row">
          <i :class="row.node.icon" :style="{color:row.node.upStatus==1?'red':''}" class="p-mr-2"></i>
          <span>{{ row.node.label }}</span>
        </template>
      </tree>
    </div>
    <div class="p-col-10 p-p-0" style="width:calc(100% - 280px);height:100%">
      <p class="title">人员信息</p>
      <div class="p-p-3" style="height:100%">
        <div class="thisTitle">
          <div>
            <Button class="p-mr-3" @click="addOrUpdateUser()">添加管理员</Button>
            <Button class="p-button-danger p-mr-3" @click="selectList.length>0?deleteDialog():message('请先选择人员！')">
              删除所选
            </Button>
          </div>
          <div>
            <label>姓名：</label>
            <InputText v-model.trim="query.name" class="p-mr-3" @keyup.enter="getData"></InputText>
            <label>手机号：</label>
            <InputText class="p-mr-3" v-model.trim="query.telephone" @keyup.enter="getData"></InputText>
            <Button @click="getData">搜索</Button>
            <Button class="p-button-outlined p-ml-2" @click="clearData">清空</Button>
          </div>
        </div>
        <div style="height:calc(100% - 100px);overflow:hidden" id="glyDataTable">
          <data-table style="margin-top:1rem" :value="table" ref="table" :auto-layout="true" frozenWidth="20rem"
                      v-model:selection="selectList" :rowHover="true" :scrollable="true" :scroll-height="scrollHeight">
            <template #empty>
              <p style="text-align: center">暂无信息...</p>
            </template>
            <Column selectionMode="multiple" style="min-width: 3rem"></Column>
            <Column header="姓名" field="name" style="min-width: 12rem"></Column>
            <Column header="工号" field="jobno" style="min-width: 8rem"></Column>
            <Column header="所属角色" field="roleName" style="min-width: 6rem"></Column>
            <Column header="类别" field="status" style="min-width: 6rem">
              <template #body="a">
                <span class="p-tag p-tag-danger" v-if="a.data.scope===0">系统级</span>
                <span class="p-tag p-tag-success" v-if="a.data.scope===1">用户级</span>
              </template>
            </Column>
            <Column header="状态" field="status" style="min-width: 5rem">
              <template #body="a">
                <span class="p-tag p-tag-success" v-if="a.data.status===0">启用</span>
                <span class="p-tag p-tag-danger" v-if="a.data.status===1">禁用</span>
              </template>
            </Column>
            <Column header="组织单位" field="ou" style="min-width: 10rem"></Column>
            <Column header="管理域" field="mgtDomain" style="min-width: 10rem"></Column>
            <Column header="部门" field="dept" style="min-width: 6rem"></Column>
            <Column header="手机号" field="telephone" style="min-width: 10rem"></Column>
            <Column header="性别" field="sex" style="min-width: 5em">
              <template #body="a">
                {{ a.data.sex === 0 ? '男' : '女' }}
              </template>
            </Column>
            <Column header="出生日期" field="birthday" style="min-width: 10rem">
              <template #body="a">
                {{ new Date(a.data.birthday).toLocaleDateString().replace(/\//g, '-') }}
              </template>
            </Column>
            <Column header="身份证号" field="idcard" style="min-width: 15rem"></Column>
            <Column header="操作" :frozen="true" alignFrozen="right" style="min-width: 24rem;justify-content: center">
              <template #body="item">
                <div v-if="item.data.scope==1">
                  <Button class="p-button-link p-button-sm" @click="addTemporaryRole(item.data)">委派</Button>
                  <Button class="p-button-link p-button-sm" @click="updatePassword(item.data)">重置密码</Button>
                  <Button class="p-button-link p-button-sm" @click="addOrUpdateUser(item.data)">编辑</Button>
                  <Button v-if="item.data.scope===1" class="p-button-link p-button-sm" @click="changeSts(item.data)">
                    {{ item.data.status == 1 ? '启用' : '禁用' }}
                  </Button>
                  <Button class="p-button-link p-button-sm" style="color: red" @click="deleteDialog(item.data)">删除
                  </Button>
                </div>
              </template>
            </Column>
          </data-table>
          <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total"
                     @page="changePage"
                     template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                     :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
          </Paginator>
        </div>
        <Dialog v-model:visible="deleteDisplay" @hide="close" header="删除用户" style="min-width: 250px">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
            <span> 您确认要删除用户"
              <span class="p-mr-1" v-for="(item ,index) in selectList" :key="item.id">
                {{ item.name }} <span v-if="index!==selectList.length-1">","</span>
              </span>"吗?</span>
          </div>
          <template #footer>
            <Button label="是" icon="pi pi-check" @click="submitDelete" class="p-button-link"/>
            <Button label="否" icon="pi pi-times" @click="close" class="p-button-secondary p-button-link"/>
          </template>
        </Dialog>
      </div>
    </div>
    <update-pwd v-if="updatePwdDisplay" v-on:close="closeDialog" ref="updatePwd"></update-pwd>
    <add-or-update-user v-if="addOrUpdateUserDisplay" v-on:close="closeDialog" ref="addOrUpdate"></add-or-update-user>
    <add-temporary-role v-if="tempDisplay" ref="tempInst" @close="tempDisplay=false"></add-temporary-role>
  </div>
</template>

<script>
import AddOrUpdateUser from "@/views/modules/SystemManage/UserManage/AddOrUpdateUser";
import UpdatePwd from "@/views/modules/Public/updatePwd";
import AddTemporaryRole from "@/views/modules/SystemManage/UserManage/AddTemporaryRole.vue";

export default {
  name: "UserManage",
  components: {AddTemporaryRole, UpdatePwd, AddOrUpdateUser},
  data() {
    return {
      scrollHeight: "400px",
      updatePwdDisplay: false,
      addOrUpdateUserDisplay: false,
      selectList: [],
      table: [],
      deleteDisplay: false,
      query: {
        name: null,
        telephone: null,
      },
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
      domainTree: [],
      selectedTreeKey: {},
      expandTreeKey: {},
      tempDisplay: false
    };
  },
  watch: {
    selectedTreeKey: {
      handler() {
        this.getData();
      },
      deep: true,
    },
  },
  mounted() {
    const element = document.getElementById("glyDataTable");
    const clientHeight = element.clientHeight;
    this.scrollHeight = clientHeight - 28 - 50 + "px";
    window.onresize = () => {
      const clientHeight = element.clientHeight;
      this.scrollHeight = clientHeight - 28 - 50 + "px";
    };
    this.getData();
    this.getDomainTree();
  },
  methods: {
    addTemporaryRole(data) {
      this.tempDisplay = true;
      this.$nextTick(() => {
        this.$refs.tempInst.init(data)
      })
    },
    getData() {
      if (Object.keys(this.selectedTreeKey)[0]) {
        this.$http
            .get("/admin/list", {
              params: {
                current: this.page.current,
                size: this.page.size,
                organId: Object.keys(this.selectedTreeKey)[0],
                name: this.query.name,
                telephone: this.query.telephone,
              },
            })
            .then((res) => {
              this.page.total = res.data.total;
              this.table = res.data.records;
            });
      }
    },
    clearData() {
      this.query = {
        name: null,
        telephone: null,
      };
      this.getData();
    },
    addOrUpdateUser(item) {
      this.addOrUpdateUserDisplay = true;
      if (item == null) {
        item = {
          ouId:
              Object.keys(this.selectedTreeKey)[0].split("-")[1] == "1"
                  ? Object.keys(this.selectedTreeKey)[0].split("-")[0]
                  : null,
        };
      }
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(item);
      });
    },
    close() {
      this.deleteDisplay = false;
      this.selectList = [];
    },
    closeDialog() {
      this.updatePwdDisplay = false;
      this.addOrUpdateUserDisplay = false;
      this.getData();
    },
    changePage(event) {
      this.page.current = event.page + 1;
      this.page.size = event.rows;
      this.getData();
    },
    deleteDialog(item) {
      if (item != null && item.id != null && item.id !== "") {
        this.selectList.push(item);
      }
      // 只能删除用户scope==1de
      if (this.selectList.filter((item) => item.scope == 0) > 0) {
        this.$toast.add({
          severity: "info",
          summary: "提示",
          detail: "所选用户中包含系统级用户！操作无法完成。",
          life: 3000,
        });
      }

      this.selectList = this.selectList.filter((item) => item.scope == 1);

      if (this.selectList.length > 0) {
        this.deleteDisplay = true;
      }
    },
    message(mess) {
      this.$toast.add({severity: "info", summary: mess, life: 3000});
    },
    submitDelete() {
      let ids = [];
      for (let i in this.selectList) {
        ids.push(this.selectList[i].id);
      }
      // ids=Array.from(new Set(ids))
      // ids=ids.join(',')
      console.log(ids.toString());
      // console.log(ids)
      this.$http
          .get("/admin/remove", {params: {ids: ids.toString()}})
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
    changeSts(item) {
      this.$confirm.require({
        message: "您是否要" + (item.status == 0 ? "禁" : "启") + "用此用户",
        header: "修改用户状态",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          let isD = false;
          if (item.status == 1) {
            item.status = 0;
          } else {
            isD = true;
            item.status = 1;
          }
          this.$http.post("/admin/saveOrUpdate", item).then(() => {
            this.$toast.add({
              severity: "info",
              summary: isD ? "禁用成功！" : "启用成功！",
              life: 3000,
            });
          });
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    updatePassword(item) {
      this.updatePwdDisplay = true;
      this.$nextTick(() => {
        this.$refs.updatePwd.init(
            "/admin/saveOrUpdate",
            item,
            null,
            "重置密码"
        );
      });
    },
    getDomainTree() {
      this.$http.get("/domain/tree").then((res) => {
        let data = res.data;
        let treeArr = [];
        data.forEach((item) => {
          if (item.type != 2) {
            treeArr.push(item);
          }
        });
        this.domainTree = this.$global.Tree.makeTree(treeArr);

        this.selectedTreeKey[this.domainTree[0].key] = true;
        this.expandTreeKey[this.domainTree[0].key] = true;
        this.getData();
      });
    },
  },
};
</script>

<style scoped>
.thisTitle {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

::v-deep(.p-tree) {
  height: calc(100% - 60px);
  overflow-y: auto;
}

::v-deep(.p-treenode-icon) {
  display: none;
}

::v-deep(
    .p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler
  ) {
  margin-right: 0;
}

::v-deep(.p-treenode-label) {
  display: flex;
  align-items: center;
}
</style>
