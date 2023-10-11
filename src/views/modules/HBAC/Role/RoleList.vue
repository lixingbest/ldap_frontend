<template>
  <div class="page p-grid">
    <div class="p-col-3 p-p-0 border-r">
      <p class="title">
        <span>
          <span>规则库</span>
          <TreeSelect v-model="treeSelect" class="input p-ml-2" @node-select="changTree" :options="treeList" placeholder="请选择域" />
        </span>
        <Button icon="pi pi-plus" class="p-button-text" @click="addOrUpdate(0)" />
      </p>
      <DataTable class="p-datatable-sm" @row-click="changeRoleLibrary" :auto-layout="true" selectionMode="single" dataKey="cn" style="height:calc(100% - 50px);overflow:auto" :value="list" :rowHover="true"
        :scrollable="true" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="共 {totalRecords} 条记录">
        <template #empty>
          <p style="width:100%;text-align: left">暂无信息...</p>
        </template>
        <Column header="名称">
          <template #body="a">
            <span v-if="a.data.cn">{{ a.data.cn[0] }}</span>
          </template>
        </Column>
        <Column header="描述">
          <template #body="a">
            <span v-if="a.data.description">{{ a.data.description[0] }}</span>
          </template>
        </Column>

        <Column header="操作">
          <template #body="a">
            <Button class="p-button-sm p-button-link p-p-0" style="color: red" @click="deleteDialog(0,a.data)">移除
            </Button>
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="p-col-9 p-p-0" style="width:calc(100% - 280px);height:calc(100% - 50px)">
      <p class="title">{{ sItem != null ? '"' + sItem.cn + '" 下的所有规则' : '所有规则（请在左侧选择一个规则库）' }}</p>
      <div class="content">
        <div class="p-p-3">
          <h5>用户组</h5>
          <div class="table-title">
            <Button :class="{'p-disabled':sItem==null}" @click="addOrUpdate(1)">添加用户组</Button>
            <div class="from">
              <div class="form-item p-mr-3">
                <label>名称：</label>
                <InputText class="inout-t"></InputText>
              </div>
              <Button>查询</Button>
            </div>
          </div>
          <DataTable style="margin-top: 10px;width: 100%;height:calc(100% - 60px);overflow:auto" :value="userGroupList" frozenWidth="200px" :rowHover="true" :scrollable="true" paginator :rows="10"
            :rowsPerPageOptions="[10, 20, 50,100]" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>
              <p style="width:100%;text-align: left">暂无信息...</p>
            </template>
            <Column style="min-width: 10rem;" field="cn" header="名称">
              <template #body="a">
                <span class="center" v-if="a.data.cn">{{ a.data.cn[0] }}</span>
              </template>
            </Column>
            <Column style="min-width: 25rem;" field="dn" header="可分辨名称(DN)">
              <template #body="row">
                <span class="center" v-if="row.data.dn">{{ row.data.dn }}</span>
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
                <span class="center" v-if="a.data.description">{{
                    JSON.parse(a.data.description[0]).description
                  }}</span>
              </template>
            </Column>

            <Column :frozen="true" align-frozen="right" style="min-width: 200px;justify-content: center" header="操作">
              <template #body="a">
                <!--            <Button class="p-button-sm p-button-link p-pl-0" @click="addOrUpdateComm(a.data)">编辑</Button>-->
                <Button class="p-button-sm p-button-link p-p-0" style="color: red" @click="deleteDialog(1,a.data)">移除
                </Button>
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="p-p-3">
          <h5>主机</h5>
          <div class="table-title">
            <Button :class="{'p-disabled':sItem==null}" @click="addOrUpdate(2)">添加主机</Button>
            <div class="from">
              <div class="form-item p-mr-3">
                <label>名称：</label>
                <InputText class="inout-t"></InputText>
              </div>
              <Button>查询</Button>
            </div>
          </div>
          <DataTable style="margin-top: 10px;" :value="hostList" :rowHover="true" :scrollable="true" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>
              <p style="width:100%;text-align: left">暂无信息...</p>
            </template>
            <Column style="max-width: 15rem" field="fqdn" header="主机名">
              <template #body="a">
                <span v-if="a.data.fqdn">{{ a.data.fqdn[0] }}</span>
              </template>
            </Column>
            <Column field="nsosversion" header="操作系统">
              <template #body="a">
                <span v-if="a.data.nsosversion">{{ a.data.nsosversion[0] }}</span>
              </template>
            </Column>
            <Column field="nshardwareplatform" header="架构">
              <template #body="a">
                <span v-if="a.data.nsosversion">{{ a.data.nsosversion[0] }}</span>
              </template>
            </Column>
            <Column field="description" header="主机描述">
              <template #body="a">
                <span v-if="a.data.description">{{ a.data.description[0] }}</span>
              </template>
            </Column>
            <Column header="操作">
              <template #body="a">
                <Button class="p-button-link " style="color:red" @click="deleteDialog(2,a.data)">移除</Button>
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="p-p-3">
          <h5>命令组列表</h5>
          <div class="table-title">
            <Button :class="{'p-disabled':sItem==null}" @click="addOrUpdate(3)">添加命令组</Button>
            <div class="from">
              <div class="form-item p-mr-3">
                <label>名称：</label>
                <InputText class="inout-t"></InputText>
              </div>
              <Button>查询</Button>
            </div>
          </div>
          <DataTable :value="commandList" class="p-mt-3" :rowHover="true" :scrollable="true" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>
              <p style="width:100%;text-align: left">暂无信息...</p>
            </template>
            <Column header="命令组名">
              <template #body="a">
                <span v-if="a.data.cn">{{ a.data.cn[0] }}</span>
              </template>
            </Column>
            <Column header="描述">
              <template #body="a">
                <span v-if="a.data.description">{{ a.data.description[0] }}</span>
              </template>
            </Column>
            <Column header="状态">
              <template #body="a">
                <span v-if="a.data.type=='allow'" class="p-tag p-tag-success">可执行</span>
                <span v-if="a.data.type=='deny'" class="p-tag p-tag-danger">不可执行</span>
              </template>
            </Column>
            <Column header="操作">
              <template #body="a">
                <Button class="p-button-sm p-button-link p-p-0" style="color: red" @click="deleteDialog(3,a.data)">移除
                </Button>
              </template>
            </Column>
          </DataTable>

        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="deleteDisplay" :modal="true" @hide="deleteDisplay=false" header="确认移除" style="min-width: 250px">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span>您确认要移除 "{{ deleteItem.cn ? deleteItem.cn[0] : deleteItem.sudocmd[0] }}" 吗？</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="submitDelete" class="p-button-link" />
      <Button label="否" icon="pi pi-times" @click="deleteDisplay=false" class="p-button-secondary p-button-link" />
    </template>
  </Dialog>
  <AddRoles v-if="addRoleDisplay" ref="addRole" v-on:close="closeDialog(0)"></AddRoles>
  <AddUserGroup v-if="userGroupDisplay" ref="userGroup" v-on:close="closeDialog(1)"></AddUserGroup>
  <AddHost v-if="hostDisplay" ref="host" v-on:close="closeDialog(2)"></AddHost>
  <AddCommand v-if="commandDisplay" ref="command" v-on:close="closeDialog(3)"></AddCommand>
</template>

<script>
import AddRoles from "@/views/modules/HBAC/Role/AddRoles";
import AddUserGroup from "@/views/modules/HBAC/Role/addUserGroup";
import AddHost from "@/views/modules/HBAC/Role/AddHost";
import AddCommand from "@/views/modules/HBAC/Role/AddCommand";

export default {
  name: "RoleList",
  components: { AddHost, AddUserGroup, AddRoles, AddCommand },
  data() {
    return {
      list: null,
      userGroupList: null,
      hostList: null,
      commandList: null,

      deleteDisplay: false,
      addRoleDisplay: false,
      hostDisplay: null,
      userGroupDisplay: false,
      commandDisplay: false,

      deleteItem: null,
      sItem: null,

      treeSelect: {},
      treeList: [],
      domainId: null,
      selectNodeInfo: null,
    };
  },
  mounted() {
    this.$http.get("/domain/tree").then((res) => {
      let data = res.data;
      data = data.filter((item) => {
        return item.type === "0" && item.upStatus === 0;
      });
      this.treeList = this.$global.Tree.makeTree(data);
    });
    this.domainId = localStorage.getItem("DOMAIN_ID");
    this.treeSelect[this.domainId + "-0"] = true;
    this.getData();
  },
  methods: {
    getData() {
      this.$http
        .get("/sudo_rule/list", {
          params: { domainId: this.domainId },
        })
        .then((res) => {
          this.list = res.data;
        });
    },
    getUserGroup() {
      this.$http
        .get("/sudo_rule/listUserGroup", {
          params: {
            cn: this.sItem.cn[0],
            domainId: this.sItem.domainId,
          },
        })
        .then((res) => {
          let list = [];
          for (let i in res.data) {
            list.push(res.data[i].result);
          }
          this.userGroupList = list;
        });
    },
    getHostList() {
      this.$http
        .get("/sudo_rule/listHost", {
          params: {
            cn: this.sItem.cn[0],
            domainId: this.sItem.domainId,
          },
        })
        .then((res) => {
          let list = [];
          for (let i in res.data) {
            list.push(res.data[i].result);
          }
          this.hostList = list;
        });
    },
    getCommandList() {
      this.$http
        .get("/sudo_rule/listCmdGroup", {
          params: {
            cn: this.sItem.cn[0],
            domainId: this.sItem.domainId,
          },
        })
        .then((res) => {
          let list = [];
          for (let i in res.data) {
            list.push(res.data[i].result);
          }
          this.commandList = list;
        });
    },
    deleteDialog(no, item) {
      this.deleteDisplay = true;
      this.deleteItem = item;
      this.deleteItem.NO = no;
    },
    // 树选择
    changTree(node) {
      console.log(node);
      this.selectNodeInfo = node;
      this.domainId = node.id.split("-")[0];
      this.getData();
      this.sItem = null;
      this.userGroupList = null;
      this.hostList = null;
      this.commandList = null;
    },
    submitDelete() {
      if (this.deleteItem.NO === 0) {
        this.$http
          .get("/sudo_rule/delete", {
            params: {
              domainId: this.deleteItem.domainId,
              cn: this.deleteItem.cn[0],
            },
          })
          .then(() => {
            this.deleteDisplay = false;
            this.$toast.add({
              severity: "info",
              summary: "移除成功！ ",
              life: 3000,
            });
            this.getData();
          });
      } else if (this.deleteItem.NO === 1) {
        let list = [];
        list.push(this.deleteItem.cn[0]);
        this.$http
          .get("/sudo_rule/removeUserGroup", {
            params: {
              domainId: this.sItem.domainId,
              ruleCN: this.sItem.cn[0],
              groupList: list.toString(),
            },
          })
          .then(() => {
            this.deleteDisplay = false;
            this.$toast.add({
              severity: "info",
              summary: "移除成功！ ",
              life: 3000,
            });
            this.getUserGroup();
          });
      } else if (this.deleteItem.NO === 2) {
        let list = [];
        list.push(this.deleteItem.fqdn[0]);
        this.$http
          .get("/sudo_rule/removeHost", {
            params: {
              ruleCN: this.sItem.cn[0],
              groupList: list[0],
              domainId: this.sItem.domainId,
            },
          })
          .then(() => {
            this.deleteDisplay = false;
            this.$toast.add({
              severity: "info",
              summary: "移除成功！ ",
              life: 3000,
            });
            this.getHostList();
          });
      } else if (this.deleteItem.NO === 3) {
        let list = [];
        list.push(this.deleteItem.cn[0]);
        this.$http
          .get(
            this.deleteItem.type == "allow"
              ? "/sudo_rule/removeAllowCommand"
              : "/sudo_rule/removeDenyCommand",
            {
              params: {
                domainId: this.sItem.domainId,
                ruleCN: this.sItem.cn[0],
                groupList: list[0],
              },
            }
          )
          .then(() => {
            this.deleteDisplay = false;
            this.$toast.add({
              severity: "info",
              summary: "移除成功！ ",
              life: 3000,
            });
            this.getCommandList();
          });
      }
    },
    closeDialog(no) {
      if (no === 0) {
        this.addRoleDisplay = false;
        this.getData();
      } else if (no === 1) {
        this.userGroupDisplay = false;
        this.getUserGroup();
      } else if (no === 2) {
        this.hostDisplay = false;
        this.getHostList();
      } else if (no === 3) {
        this.commandDisplay = false;
        this.getCommandList();
      }
    },
    addOrUpdate(no) {
      if (no === 0) {
        if (this.selectNodeInfo.pid === null) {
          this.$toast.add({
            severity: "info",
            summary: '不能在"' + this.selectNodeInfo.name + '"下添加规则！',
            life: 3000,
          });
        } else {
          this.addRoleDisplay = true;
          this.$nextTick(() => {
            this.$refs.addRole.init(this.domainId);
          });
        }
      } else if (no === 1) {
        this.userGroupDisplay = true;
        this.$nextTick(() => {
          this.$refs.userGroup.init(this.sItem, this.sItem.domainId);
        });
      } else if (no === 2) {
        this.hostDisplay = true;
        this.$nextTick(() => {
          this.$refs.host.init(this.sItem, this.sItem.domainId);
        });
      } else if (no === 3) {
        this.commandDisplay = true;
        this.$nextTick(() => {
          this.$refs.command.init(this.sItem, this.sItem.domainId);
        });
      }
    },
    changeRoleLibrary(data) {
      this.sItem = data.data;
      this.getUserGroup();
      this.getHostList();
      this.getCommandList();
    },
  },
};
</script>

<style scoped>
.p-grid {
  margin: 0;
}

.text {
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  height: calc(100% - 55px);
  overflow-y: auto;
}

.table-title {
  display: flex;
  justify-content: space-between;
}

.from {
  display: flex;
}

::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  justify-content: center;
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
}

.center {
  width: 100%;
  text-align: center;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep(.p-treeselect .p-treeselect-label) {
  padding: 0 0 0 1rem;
  line-height: 30px;
}

::v-deep(.p-treeselect) {
  border-radius: 30px;
}

.form-item {
  display: flex;
  align-items: center;
}
</style>
