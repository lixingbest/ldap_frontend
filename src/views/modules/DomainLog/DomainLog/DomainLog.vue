<template>
  <div class="page">
    <div class="border-r">
      <p class="title">域林信息</p>
      <Tree :value="root" selectionMode="single" @contextmenu.prevent="showMenu()" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey" @node-select="selectTreeNode"></Tree>
    </div>
    <div class="content">
      <p class="title">{{ treeNode ? '"' + treeNode.name + '"的' : '' }}安装日志</p>
      <div class="p-p-3" style="height:calc(100% - 50px)">
        <ul class="result-menu">
          <li @click="updateState(0)">
            <span :style="{'border-bottom':state!=0?'2px solid #ced4da':'none',
            'color':state===0?'#015486':'#6c757d'}">
              <i class="fa fa-check-circle"></i>
              安装成功
            </span>
          </li>
          <li @click="updateState(1)">
            <span :style="{'border-bottom':state!=1?'2px solid #ced4da':'none',
          'color':state===1?'#015486':'#6c757d'}">
              <i class="fa fa-exclamation-circle"></i>
              安装失败</span>
          </li>
          <li @click="updateState(2)">
            <span :style="{'border-bottom':state!=2?'2px solid #ced4da':'none',
          'color':state===2?'#015486':'#6c757d'}">
              <i class="fa fa-circle-o-notch"></i>
              安装中</span>
          </li>
        </ul>
        <div class="table-head">
          <div style="width:20%">
            <Button :class="{'p-disabled':table.length===0}" @click="deleteDialog(null)">{{this.state==0?"清空安装成功的日志":(this.state==1?"清空安装失败的日志":"清空安装中的日志")}}</Button>
          </div>
          <div class="queryForm">
            <div class="query-input">
              <div>
                <label>主机名：</label>
                <InputText v-model="query.hostname" @keydown.enter="getLogList()"></InputText>
              </div>
              <div>
                <label>所属域：</label>
                <InputText v-model="query.domain" @keydown.enter="getLogList()"></InputText>
              </div>
              <div v-if="open">
                <label>客户端版本：</label>
                <InputText v-model="query.clientVersion" @keydown.enter="getLogList()"></InputText>
              </div>
              <div v-if="open">
                <label>用户名：</label>
                <InputText v-model="query.user" @keydown.enter="getLogList()"></InputText>
              </div>
            </div>
            <div :style="isDisplay?'width:220px':'width:150px'" style="display:flex;justify-content:flex-end">
              <Button v-if="isDisplay" :icon="open?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right" :label="open?'折叠':'展开'" class="p-button-link" @click="fun" />
              <Button @click="getLogList()" style="margin-right:0.5rem">查询</Button>
              <Button @click="clearLogList()">清空</Button>
            </div>
          </div>
        </div>
        <div class="dataTable" style="overflow:hidden;height:calc(100% - 80px)">
          <DataTable :scrollHeight="scrollHeight" frozenWidth="10rem" :rowHover="true" :value="table" :scrollable="true">
            <template #empty>
              <p style="width:100%;text-align:left"> 暂无信息</p>
            </template>
            <Column style="text-align:center;min-width: 12rem;" field="hostname" header="主机名">
              <template #body="row">
                <p v-tooltip.top="row.data.hostname" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.hostname
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 6rem;" field="domain" header="所属域">
              <template #body="row">
                <p v-tooltip.top="row.data.domain" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.domain
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 6rem;" field="domain" header="系统名称">
              <template #body="row">
                <p v-tooltip.top="row.data.sysName" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.sysName
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="clientVersion" header="客户端版本">
              <template #body="row">
                <p v-tooltip.top="row.data.clientVersion" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.clientVersion
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 5rem;" field="arch" header="架构">
              <template #body="row">
                <p v-tooltip.top="row.data.arch" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.arch
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 10rem;" field="sysVersion" header="系统版本">
              <template #body="row">
                <p v-tooltip.top="row.data.sysVersion" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.sysVersion
                }}</p>
              </template>
            </Column>
            <column style="text-align:center;min-width: 10rem;" header="系统兼容性">
              <template #body="row">
                <p v-tooltip.top="row.data.sysCmpt" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ row.data.sysCmpt }}</p>
              </template>
            </column>
            <Column style="text-align:center;min-width: 5rem;" field="user" header="用户名"></Column>
            <Column field="ip" header="IP地址">
              <template #body="row">
                <p v-tooltip.top="row.data.ip" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ row.data.ip }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 15rem;" field="beginTime" header="开始安装时间">
              <template #body="row">
                <span v-tooltip.top="row.data.beginTime ? new Date(row.data.beginTime).toLocaleString('chinese',{hour12:false}).replace(/\//g, '-') : ''">{{
                  row.data.beginTime ? new Date(row.data.beginTime).toLocaleString('chinese', {hour12: false}).replace(/\//g, '-') : ''
                }}</span>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 15rem;" field="endTime" header="结束安装时间">
              <template #body="row">
                <span v-tooltip.top="row.data.endTime ? new Date(row.data.endTime,).toLocaleString('chinese',{hour12:false}).replace(/\//g, '-') : '' ">{{
                  row.data.endTime ? new Date(row.data.endTime,).toLocaleString('chinese', {hour12: false}).replace(/\//g, '-') : ''
                }}</span>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 3rem;" field="step" header="当前步骤">
              <template #body="row">
                <span v-if="row.data.step===0" class="p-tag p-tag-rounded p-tag-info">开始安装</span>
                <span v-if="row.data.step===1" class="p-tag p-tag-rounded p-tag-success">结束安装</span>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 3rem;" field="result" header="安装结果">
              <template #body="row">
                <span v-if="row.data.result===0" class="p-tag p-tag-rounded p-tag-success">成功</span>
                <span v-if="row.data.result===1" class="p-tag p-tag-rounded p-tag-danger">失败</span>
              </template>
            </Column>

            <Column :frozen="true" align-frozen="right" style="min-width: 15rem;" header="操作">
              <template #body="row">
                <Button class="p-button-sm p-button-link" @click="infoDialog(row.data)">查看详情</Button>
                <Button class="p-button-sm p-button-link" @click="logDialog(row.data)">查看日志</Button>
                <Button class="p-button-sm p-button-link" style="color: red" @click="deleteDialog(row.data)">删除</Button>
              </template>
            </Column>
          </DataTable>
          <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
            :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
          </Paginator>
        </div>
      </div>
    </div>
  </div>
  <Dialog :header="deleteData==null?'清空日志':'删除日志'" :modal="true" v-model:visible="clearDisplay">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span v-if="deleteData==null">您确定要清空日志信息吗?</span>
      <span v-else>您确定要删除此日志信息吗?</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="deleteLog()" class="p-button-link" />
      <Button label="否" icon="pi pi-times" @click="clearDisplay=false" class="p-button-secondary p-button-link" />
    </template>
  </Dialog>
  <Dialog :header="tableItem.name" :modal="true" v-model:visible="display" style="width:1000px">
    <pre>{{ tableItem.data }}</pre>
  </Dialog>
  <show-info ref="showInfo" v-if="showDisplay"></show-info>
</template>

<script>
import ShowInfo from "@/views/modules/DomainLog/DomainLog/showInfo";

export default {
  name: "DomainLog",
  components: { ShowInfo },
  data() {
    return {
      id: null,
      root: [],
      expandedKeys: {},
      selectedKey: {},
      treeNode: null,
      table: [],
      page: {
        size:10,
        current: 1,
        total: 0,
      },
      tableItem: {
        name: "日志详细信息",
        data: null,
      },
      open: false,
      display: false,
      showDisplay: false,
      clearDisplay: false,
      query: {
        hostname: null,
        domain: null,
        clientVersion: null,
        user: null,
      },
      state: 0,
      deleteData: null,
      scrollHeight: "400px",
      isDisplay: false,
      showInput: {
        area: true,
        version: true,
        user: true,
      },
      constShowInput: {
        area: null,
        version: null,
        user: null,
      },
    };
  },
  mounted() {
    const search = document.getElementsByClassName("query-input")[0];
    const searchWidth = search.clientWidth;
    if (searchWidth > 1000) {
      this.isDisplay = false;
      this.showInput = {
        area: true,
        version: true,
        user: true,
      };
      this.constShowInput = {
        area: true,
        version: true,
        user: true,
      };
    } else {
      this.isDisplay = true;
      if (searchWidth > 750) {
        this.showInput = {
          area: true,
          version: true,
          user: false,
        };
        this.constShowInput = {
          area: true,
          version: true,
          user: false,
        };
      } else {
        if (searchWidth > 500) {
          this.showInput = {
            area: true,
            version: false,
            user: false,
          };
          this.constShowInput = {
            area: true,
            version: false,
            user: false,
          };
        } else {
          this.showInput = {
            area: false,
            version: false,
            user: false,
          };
          this.constShowInput = {
            area: false,
            version: false,
            user: false,
          };
        }
      }
    }
    const element = document.getElementsByClassName("dataTable")[0];
    const clientHeight = element.clientHeight;
    this.scrollHeight = clientHeight - 28 - 50 + "px";

    window.onresize = () => {
      const clientHeight = element.clientHeight;
      this.scrollHeight = clientHeight - 28 - 50 + "px";
      this.open=false
      const searchWidth = search.clientWidth;
      if (searchWidth > 1000) {
        this.isDisplay = false;
        this.showInput = {
          area: true,
          version: true,
          user: true,
        };
        this.constShowInput = {
          area: true,
          version: true,
          user: true,
        };
      } else {
        this.isDisplay = true;
        if (searchWidth > 750) {
          this.showInput = {
            area: true,
            version: true,
            user: false,
          };
          this.constShowInput = {
            area: true,
            version: true,
            user: false,
          };
        } else {
          if (searchWidth > 500) {
            this.showInput = {
              area: true,
              version: false,
              user: false,
            };
            this.constShowInput = {
              area: true,
              version: false,
              user: false,
            };
          } else {
            this.showInput = {
              area: false,
              version: false,
              user: false,
            };
            this.constShowInput = {
              area: false,
              version: false,
              user: false,
            };
          }
        }
      }
    };

    this.getData();
  },
  methods: {
    fun() {
      this.open = !this.open;
      if (this.constShowInput.area == false) {
        this.showInput.area = !this.showInput.area;
      }
      if (this.constShowInput.version == false) {
        this.showInput.version = !this.showInput.version;
      }
      if (this.constShowInput.user == false) {
        this.showInput.user = !this.showInput.user;
      }
    },
    getData() {
      this.$http.get("/domain/tree").then((res) => {
        let data = res.data.filter(
          (item) => item.type === "0" && item.upStatus === 0
        );
        data.forEach((item) => {
          if (item.pid == null) this.expandedKeys[item.id] = true;
        });
        this.root = this.$global.Tree.makeTree(data, true);
        this.selectTreeNode(this.root[0].children[0]);
        // this.selectedKey[0]=this.root[0].children[0].id
      });
    },
    showMenu() {},
    selectTreeNode(node) {
      this.treeNode = node;
      this.id = Number(node.id.split("-")[0]);
      this.getLogList();
    },
    updateState(state) {
      this.state = state;
      this.getLogList();
    },
    clearLogList() {
      this.query = {
        hostname: null,
        domain: null,
        clientVersion: null,
        user: null,
      };
      this.getLogList();
    },
    getLogList() {
      let domainId = null;
      if ((this.id && this.id != null) || this.id != undefined) {
        domainId = this.id;
      } else {
        domainId = Number(Object.keys(this.selectedKey)[0].split("-")[0]);
      }
      if (this.query.hostname != null && this.query.hostname.length == 0) {
        this.query.hostname = null;
      }
      if (this.query.domain != null && this.query.domain.length == 0) {
        this.query.domain = null;
      }
      if (
        this.query.clientVersion != null &&
        this.query.clientVersion.length == 0
      ) {
        this.query.clientVersion = null;
      }
      if (this.query.user != null && this.query.user.length == 0) {
        this.query.user = null;
      }
      let data = {
        domainId: domainId,
        current: this.page.current,
        size: this.page.size,
        type: this.state,
      };
      this.$http
        .get("/client_inst_log/list", {
          params: Object.assign(data, this.query),
        })
        .then((res) => {
          this.table = res.data.records;
          this.page.total = res.data.total;
        });
    },
    changePage(page) {
      this.page.current = page.page + 1;
      this.page.size=page.rows
      this.getLogList();
    },
    logDialog(data) {
      this.$http
        .get("/client_inst_log/getLog", {
          params: {
            logId: data.id,
          },
        })
        .then((res) => {
          if (res != null && res.toString() !== "") {
            this.tableItem.data = res;
            this.display = true;
          } else {
            this.$toast.add({
              severity: "info",
              summary: "暂无日志！ ",
              life: 3000,
            });
          }
        });
    },
    infoDialog(data) {
      this.showDisplay = true;
      this.$nextTick(() => {
        this.$refs.showInfo.init(data);
      });
    },
    deleteDialog(data) {
      this.clearDisplay = true;
      this.deleteData = data;
    },
    deleteLog() {
      if (this.deleteData) {
        this.$http
          .get("/client_inst_log/remove", {
            params: {
              logId: this.deleteData.id,
            },
          })
          .then(() => {
            this.$toast.add({
              severity: "info",
              summary: "删除成功！ ",
              life: 3000,
            });
            this.clearDisplay = false;
            this.getLogList();
          });
      } else {
        this.$http
          .get("/client_inst_log/clear", {
            params: {
              domainId: Number(Object.keys(this.selectedKey)[0].split("-")[0]),
              type:
                this.state == 0
                  ? "success"
                  : this.state == 1
                  ? "fail"
                  : this.state == 2
                  ? "ing"
                  : null,
            },
          })
          .then(() => {
            this.$toast.add({
              severity: "info",
              summary: "清空成功！ ",
              life: 3000,
            });
            this.clearDisplay = false;
            this.getLogList();
          });
      }
    },
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

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
  white-space: nowrap;
}

::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}

::v-deep(.p-datatable-scrollable .p-datatable-tfoot > tr > td) {
  justify-content: center;
}

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
  width: 80%;
  display: flex;
  justify-content: flex-end;
}

.queryForm > div {
  display: flex;
  flex-wrap: wrap;
}

.query-input {
  width: calc(100% - 220px);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.query-input > div {
  margin-bottom: 1rem;
  width: 50%;
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
