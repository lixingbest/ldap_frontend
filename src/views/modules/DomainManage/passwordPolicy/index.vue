<template>
  <div class="page">
    <div class="p-col-2 p-p-0 border-r">
      <p class="title" style="margin-top:0.6rem">域林信息</p>
      <Tree :value="root" selectionMode="single" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey" @node-select="selectTreeNode"></Tree>
    </div>
    <div class="p-col-10 p-p-0" style="width:calc(100% - 280px);height:100%">
      <p class="title title2">{{ treeNode ? '"' + treeNode.name + '"的' : '' }}密码策略</p>
      <div class="p-p-3" style="height:100%">
        <div class="p-mb-3" style="display: flex;justify-content: space-between;">
          <Button @click="synchronizeDetails(0)">新增策略</Button>
          <div class="p-mr-2">
            <label>所属用户组：</label>
            <InputText v-model="query.domainName" @keydown.enter="aa()" style="margin-right: 14px;"></InputText>
            <Button @click="aa()">查询</Button>
          </div>
        </div>
        <div style="height:calc(100% - 100px);overflow:hidden" id="glyDataTable">
          <data-table style="margin-top: 10px;" :rowHover="true" :value="table" :scrollable="true" :scroll-height="scrollHeight" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                     paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>
              <p style="width:100%;text-align: left">暂无数据</p>
            </template>
            <Column header="域" style="min-width: 18rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.domainName+"（"+row.data.domain+"）" }}</span>
              </template>
            </Column>
            <Column header="所属用户组" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.cn">{{ row.data.result.cn[0] }}</span>
              </template>
            </Column>
            <Column header="优先级" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.cospriority">{{ row.data.result.cospriority[0] }}</span>
              </template>
            </Column>
            <Column header="策略范围" style="min-width: 10rem">
              <template #body="row">
                <Tag v-if="row.data.result.cn && row.data.result.cn[0] === 'global_policy'" severity="success" value="全局"></Tag>
                <Tag v-else value="用户组"></Tag>
<!--                <span class="text-ellipsis" v-if="row.data.result.priority">{{ row.data.result.priority }}</span>-->
              </template>
            </Column>
            <Column header="最大生命周期(天)" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.krbmaxpwdlife">{{ row.data.result.krbmaxpwdlife[0] }}</span>
              </template>
            </Column>
            <Column header="最小生命周期(小时)" style="min-width: 11rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.krbminpwdlife">{{ row.data.result.krbminpwdlife[0] }}</span>
              </template>
            </Column>
            <Column header="历史记录数量" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.krbpwdhistorylength">{{ row.data.result.krbpwdhistorylength[0] }}</span>
              </template>
            </Column>
            <Column header="角色类" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.krbpwdmindiffchars">{{ row.data.result.krbpwdmindiffchars[0] }}</span>
              </template>
            </Column>
            <Column header="最小长度" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.krbpwdminlength">{{ row.data.result.krbpwdminlength[0] }}</span>
              </template>
            </Column>
            <Column header="最大失败次数" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.krbpwdmaxfailure">{{ row.data.result.krbpwdmaxfailure[0] }}</span>
              </template>
            </Column>
            <Column header="故障重置时间(秒)" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.krbpwdfailurecountinterval">{{ row.data.result.krbpwdfailurecountinterval[0] }}</span>
              </template>
            </Column>
            <Column header="锁定持续时间(秒)" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis" v-if="row.data.result.krbpwdlockoutduration">{{ row.data.result.krbpwdlockoutduration[0] }}</span>
              </template>
            </Column>
            <Column header="操作" :frozen="true" alignFrozen="right" style="min-width: 18rem;justify-content: center">
              <template #body="item">
                <Button  class="p-button-link p-button-sm" @click="synchronizeDetails(1,item.data)">编辑</Button>
                <Button v-if="item.data.result.cn && item.data.result.cn[0] != 'global_policy'" class="p-button-link p-button-sm" @click="deleteDialog(item.data)">删除</Button>
              </template>
            </Column>
          </data-table>
<!--          <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"-->
<!--                     :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">-->
<!--          </Paginator>-->
          <Dialog v-model:visible="deleteDisplay" @hide="close" header="删除用户" style="min-width: 250px">
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
              <span> 您确认要删除用户组"
              <span class="p-mr-1">{{ selectList }}</span>"吗?</span>
            </div>
            <template #footer>
              <Button label="是" icon="pi pi-check" @click="delet" class="p-button-link" />
              <Button label="否" icon="pi pi-times" @click="deleteDisplay = false" class="p-button-secondary p-button-link" />
            </template>
          </Dialog>
        </div>
      </div>
    </div>
    <add-or-update-password ref="terminalDisplay" v-if="passwordDisplay" v-on:close="closeTerminalDialog"></add-or-update-password>
  </div>
</template>

<script>
import AddOrUpdatePassword from "./addOrUpdatePassword";
export default {
  name: "ActiveDirectoryTb",
  components: { AddOrUpdatePassword },
  data() {
    return {
      scrollHeight: "400px",
      root: null,
      expandedKeys: {
        "1-0": true,
      },
      passwordDisplay: false,
      selectedKey: {},
      treeNode: null,
      table: null,
      query: {
        domainName: null
      },
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
      deleteDisplay: false,
      selectList: null
    };
  },
  watch: {
    expandedKeys: {
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
  },
  methods: {
    getData() {
      this.$http.get("/domain/tree").then((res) => {
        let data = res.data.filter(
            (item) => item.type === "0" && item.upStatus === 0
        );
        data.forEach((item) => {
          if (item.pid == null) this.expandedKeys[item.id] = true;
        });
        this.root = this.$global.Tree.makeTree(data, true);
        // let data = res.data;
        // this.root = this.$global.Tree.makeTree(data, true);
        this.selectTreeNode(this.root[0]);
      });
    },
    selectTreeNode(node) {
      this.treeNode = node;
      let id = Number(node.id.split("-")[0]);
      this.table = null;
      this.getList(id);
    },
    aa() {
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0]
        let id = Number(node.id.split("-")[0]);
        this.getList(id);
      } else {
        this.getList();
      }
    },
    getList(id) {
      this.$http
          .get("/passwd_policy/list", {
            params: {
              domainId: id || Object.keys(this.selectedKey)[0].split("-")[0],
              group: this.query.domainName
            },
          })
          .then((res) => {
            this.page.total = res.data.total;
            this.table = res.data;
            // this.table.forEach(item=>{
            //   if (item.result.cn) {
            //     if (item.result.cn[0] === 'global_policy') {
            //       item.result.priority = '全局'
            //     } else {
            //       item.result.priority = '用户组'
            //     }
            //   }
            // })
          });
    },
    changePage(event) {
      this.page.current = event.page + 1;
      this.page.size = event.rows;
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0]
        let id = Number(node.id.split("-")[0]);
        this.getList(id);
      } else {
        this.getList();
      }
    },
    deleteDialog(item) {
      this.selectList = item.result.cn[0]
      this.deleteDisplay = true
    },
    synchronizeDetails(type,data) {
      this.passwordDisplay = true;
      let id
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0].children[0]
        id = Number(node.id.split("-")[0])
      } else {
        id = Object.keys(this.selectedKey)[0].split("-")[0]
      }
      this.$nextTick(() => {
        if (type === 1) {
          this.$refs.terminalDisplay.init(id,data.result);
        } else {
          this.$refs.terminalDisplay.init(id);
        }
      });
    },
    closeTerminalDialog() {
      this.passwordDisplay = false
      this.aa()
    },
    delet() {
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0].children[0]
        let id = Number(node.id.split("-")[0]);
        this.submitDelete(id);
      } else {
        this.submitDelete();
      }
    },
    submitDelete(id) {
      let form = {
        domainId:id || Object.keys(this.selectedKey)[0].split("-")[0],
        group: this.selectList
      }
      this.$http
          .delete("/passwd_policy/remove", { params: form})
          .then(() => {
            this.deleteDisplay = false;
            this.$toast.add({
              severity: "info",
              summary: "删除成功！ ",
              life: 3000,
            });
            this.getList();
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
.title2{
  padding: 0.3rem 1rem 0.3rem 1rem;
}
</style>
