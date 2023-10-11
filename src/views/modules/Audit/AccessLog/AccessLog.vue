<template>
  <div class="page">
    <div class="border-r">
      <p class="title">域林信息</p>
      <Tree :value="root" selectionMode="single" @contextmenu.prevent="showMenu()" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey" @node-select="selectTreeNode"></Tree>
    </div>
    <div class="content">
      <p class="title">{{ treeNode ? '"' + treeNode.name + '"的' : '' }}访问日志</p>
      <div class="p-p-3" style="height:calc(100% - 50px)">
        <div class="table-head">
          <div class="queryForm">
            <div class="query-input">
              <div>
                <label>登录名：</label>
                <InputText style="width:150px;margin-right:0.5rem" v-model="query.uid" @keydown.enter="getLogList()"></InputText>
              </div>
              <div v-if="showInput.userName">
                <label>用户名：</label>
                <InputText style="width:150px;margin-right:0.5rem" v-model="query.userName" @keydown.enter="getLogList()"></InputText>
              </div>
              <div v-if="showInput.startTime">
                <label>开始时间：</label>
                <Calendar style="margin-right:0.5rem;width:150px" inputId="basic" dateFormat="yy/mm/dd" autocomplete="off" v-model="query.startTime" />
              </div>
              <div v-if="showInput.endTime">
                <label>结束时间：</label>
                <Calendar style="margin-right:0.5rem;width:150px" inputId="basic" dateFormat="yy/mm/dd" autocomplete="off" v-model="query.endTime" :minDate="query.startTime" />
              </div>
              <div v-if="showInput.level">
                <label>日志级别：</label>
                <Dropdown style="margin-right:0.5rem;width:150px" v-model="query.level" :options="logList" optionLabel="name" />
              </div>
              <div v-if="showInput.action">
                <label>事件类型：</label>
                <InputText style="width:150px;margin-right:0.5rem" v-model="query.action" @keydown.enter="getLogList()"></InputText>
              </div>
              <div v-if="showInput.action">
                <label>IP：</label>
                <InputText style="width:150px;margin-right:0.5rem" v-model="query.ip" @keydown.enter="getLogList()"></InputText>
              </div>
              <div v-if="showInput.action">
                <label>主机名：</label>
                <InputText style="width:150px;margin-right:0.5rem" v-model="query.hostname" @keydown.enter="getLogList()"></InputText>
              </div>
              <div v-if="showInput.action">
                <label>系统名称：</label>
                <InputText style="width:150px;margin-right:0.5rem" v-model="query.sysName" @keydown.enter="getLogList()"></InputText>
              </div>
            </div>
            <div :style="isDisplay?'width:220px':'width:150px'" style="display: flex;justify-content: flex-end">
              <Button v-if="isDisplay" :icon="open?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right" :label="open?'折叠':'展开'" class="p-button-link" @click="fun" />
              <Button style="margin-right:0.5rem" @click="getLogList()">查询</Button>
              <Button @click="clearLogList()">清空</Button>
            </div>
          </div>
        </div>
        <div class="dataTable" style="overflow:hidden;height:calc(100% - 20px)">
          <DataTable :scrollHeight="scrollHeight" frozenWidth="10rem" :rowHover="true" :value="table" :scrollable="true">
            <template #empty>
              <p style="width:100%;text-align:left">暂无信息</p>
            </template>
            <Column style="text-align:center;min-width: 8rem;" field="domain" header="所属域">
              <template #body="row">
                <p v-tooltip.top="row.data.domain" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.domain
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="domainName" header="域名">
              <template #body="row">
                <p v-tooltip.top="row.data.domainName" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.domainName
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="ouName" header="组织单位">
              <template #body="row">
                <p v-tooltip.top="row.data.ouName" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.ouName
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 6rem;" field="uid" header="用户登录名">
              <template #body="row">
                <p v-tooltip.top="row.data.uid" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.uid
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 6rem;" field="userName" header="用户名">
              <template #body="row">
                <p v-tooltip.top="row.data.userName" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.userName
                }}</p>
              </template>
            </Column>
            <!-- <Column style="text-align:center;min-width: 8rem;" field="jobNo" header="工号"></Column> -->
            <Column style="text-align:center;min-width: 8rem;" field="hostname" header="主机名">
              <template #body="row">
                <p v-tooltip.top="row.data.hostname" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.hostname
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="ip" header="IP">
              <template #body="row">
                <p v-tooltip.top="row.data.ip" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.ip
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 12rem;" field="accessTime" header="操作时间">
              <template #body="row">
                <span v-tooltip.top="row.data.accessTime ? new Date(row.data.accessTime).toLocaleString('chinese', {hour12: false}).replace(/\//g, '-') : ''"
                  style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.accessTime ? new Date(row.data.accessTime).toLocaleString('chinese', {hour12: false}).replace(/\//g, '-') : ''
                }}</span>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="sysName" header="系统名称">
              <template #body="row">
                <p v-tooltip.top="row.data.sysName" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.sysName
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="sysArch" header="系统架构">
              <template #body="row">
                <p v-tooltip.top="row.data.sysArch" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.sysArch
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="sysVersion" header="系统版本">
              <template #body="row">
                <p v-tooltip.top="row.data.sysVersion" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.sysVersion
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="level" header="日志级别">
              <template #body="row">
                <Tag style="color:white" :severity="row.data.level=='info'?'success':(row.data.level=='warn'?'warning':(row.data.level=='error'?'danger':null))"
                  :value="row.data.level=='info'?'消息':(row.data.level=='warn'?'警告':(row.data.level=='error'?'错误':null))"></Tag>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="action" header="事件类型">
              <template #body="row">
                <p v-tooltip.top="row.data.action" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.action
                }}</p>
              </template>
            </Column>
            <Column style="text-align:center;min-width: 8rem;" field="details" header="明细">
              <template #body="row">
                <p v-tooltip.top="row.data.details" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  row.data.details
                }}</p>
              </template>
            </Column>
            <Column :frozen="true" align-frozen="right" style="min-width: 6rem;" header="操作">
              <template #body="row">
                <Button class="p-button-sm p-button-link" @click="infoDialog(row.data)">查看详情</Button>
                <!-- <Button class="p-button-sm p-button-link" @click="logDialog(row.data)">查看日志</Button>
              <Button class="p-button-sm p-button-link" style="color: red" @click="deleteDialog(row.data)">删除</Button> -->
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
  <!-- <Dialog :header="deleteData==null?'清空日志':'删除日志'" :modal="true" v-model:visible="clearDisplay">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span v-if="deleteData==null">您确定要清空日志信息吗?</span>
      <span v-else>您确定要删除此日志信息吗?</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="deleteLog()" class="p-button-link" />
      <Button label="否" icon="pi pi-times" @click="clearDisplay=false" class="p-button-secondary p-button-link" />
    </template>
  </Dialog> -->
  <!-- <Dialog :header="tableItem.name" :modal="true" v-model:visible="display" style="width:1000px">
    <pre>{{ tableItem.data }}</pre>
  </Dialog> -->
  <show-info ref="showInfo" v-if="showDisplay"></show-info>
</template>

<script>
import ShowInfo from "@/views/modules/DomainLog/AccessLog/showInfo";

export default {
  name: "AccessLog",
  components: { ShowInfo },
  data() {
    return {
      logList: [{ name: "消息" }, { name: "警告" }, { name: "错误" }],
      treeData: [],
      ouId: null,
      id: null,
      root: [],
      expandedKeys: {},
      selectedKey: {},
      treeNode: null,
      table: [],
      //   page: {
      //     current: 1,
      //     total: 0,
      //   },
      //   tableItem: {
      //     name: "日志详细信息",
      //     data: null,
      //   },
      //   display: false,
      showDisplay: false,
      //   clearDisplay: false,
      open: false,
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
      query: {
        uid: null,
        userName: null,
        startTime: null,
        endTime: null,
        level: null,
        action: null,
        ip:null,
        sysName:null,
        hostname:null
      },
      //   deleteData: null,
      scrollHeight: "400px",
      isDisplay: false,
      showInput: {
        userName: true,
        startTime: true,
        endTime: true,
        level: true,
        action: true,
      },
      constShowInput: {
        userName: null,
        startTime: null,
        endTime: null,
        level: null,
        action: null,
      },
    };
  },
  mounted() {
    const search = document.getElementsByClassName("query-input")[0];
    const searchWidth = search.clientWidth;
    if (searchWidth > 1500) {
      this.isDisplay = false;
      this.showInput = {
        userName: true,
        startTime: true,
        endTime: true,
        level: true,
        action: true,
      };
      this.constShowInput = {
        userName: true,
        startTime: true,
        endTime: true,
        level: true,
        action: true,
      };
    } else {
      this.isDisplay = true;
      if (searchWidth > 1250) {
        this.showInput = {
          userName: true,
          startTime: true,
          endTime: true,
          level: true,
          action: false,
        };
        this.constShowInput = {
          userName: true,
          startTime: true,
          endTime: true,
          level: true,
          action: false,
        };
      } else {
        if (searchWidth > 1000) {
          this.showInput = {
            userName: true,
            startTime: true,
            endTime: true,
            level: false,
            action: false,
          };
          this.constShowInput = {
            userName: true,
            startTime: true,
            endTime: true,
            level: false,
            action: false,
          };
        } else {
          if (searchWidth > 750) {
            this.showInput = {
              userName: true,
              startTime: true,
              endTime: false,
              level: false,
              action: false,
            };
            this.constShowInput = {
              userName: true,
              startTime: true,
              endTime: false,
              level: false,
              action: false,
            };
          } else {
            if (searchWidth > 500) {
              this.showInput = {
                userName: true,
                startTime: false,
                endTime: false,
                level: false,
                action: false,
              };
              this.constShowInput = {
                userName: true,
                startTime: false,
                endTime: false,
                level: false,
                action: false,
              };
            } else {
              this.showInput = {
                userName: false,
                startTime: false,
                endTime: false,
                level: false,
                action: false,
              };
              this.constShowInput = {
                userName: false,
                startTime: false,
                endTime: false,
                level: false,
                action: false,
              };
            }
          }
        }
      }
    }

    const element = document.getElementsByClassName("dataTable")[0];
    const clientHeight = element.clientHeight;
    this.scrollHeight = clientHeight - 28 - 50 + "px";
    console.log(this.showInput);
    window.onresize = () => {
      const clientHeight = element.clientHeight;
      this.scrollHeight = clientHeight - 28 - 50 + "px";
      this.open=false
      const searchWidth = search.clientWidth;
      if (searchWidth > 1500) {
        this.isDisplay = false;
        this.showInput = {
          userName: true,
          startTime: true,
          endTime: true,
          level: true,
          action: true,
        };
        this.constShowInput = {
          userName: true,
          startTime: true,
          endTime: true,
          level: true,
          action: true,
        };
      } else {
        this.isDisplay = true;
        if (searchWidth > 1250) {
          this.showInput = {
            userName: true,
            startTime: true,
            endTime: true,
            level: true,
            action: false,
          };
          this.constShowInput = {
            userName: true,
            startTime: true,
            endTime: true,
            level: true,
            action: false,
          };
        } else {
          if (searchWidth > 1000) {
            this.showInput = {
              userName: true,
              startTime: true,
              endTime: true,
              level: false,
              action: false,
            };
            this.constShowInput = {
              userName: true,
              startTime: true,
              endTime: true,
              level: false,
              action: false,
            };
          } else {
            if (searchWidth > 750) {
              this.showInput = {
                userName: true,
                startTime: true,
                endTime: false,
                level: false,
                action: false,
              };
              this.constShowInput = {
                userName: true,
                startTime: true,
                endTime: false,
                level: false,
                action: false,
              };
            } else {
              if (searchWidth > 500) {
                this.showInput = {
                  userName: true,
                  startTime: false,
                  endTime: false,
                  level: false,
                  action: false,
                };
                this.constShowInput = {
                  userName: true,
                  startTime: false,
                  endTime: false,
                  level: false,
                  action: false,
                };
              } else {
                this.showInput = {
                  userName: false,
                  startTime: false,
                  endTime: false,
                  level: false,
                  action: false,
                };
                this.constShowInput = {
                  userName: false,
                  startTime: false,
                  endTime: false,
                  level: false,
                  action: false,
                };
              }
            }
          }
        }
      }
    };
    this.getData();
  },
  methods: {
    fun() {
      this.open = !this.open;
      if (this.constShowInput.userName == false) {
        this.showInput.userName = !this.showInput.userName;
      }
      if (this.constShowInput.startTime == false) {
        this.showInput.startTime = !this.showInput.startTime;
      }
      if (this.constShowInput.endTime == false) {
        this.showInput.endTime = !this.showInput.endTime;
      }
      if (this.constShowInput.level == false) {
        this.showInput.level = !this.showInput.level;
      }
      if (this.constShowInput.action == false) {
        this.showInput.action = !this.showInput.action;
      }
    },
    getData() {
      this.$http.get("/domain/tree").then((res) => {
        this.treeData = res.data;
        let data = res.data.filter(
          (item) => item.type === "0" && item.upStatus === 0
        );
        data.forEach((item) => {
          if (item.pid == null) this.expandedKeys[item.id] = true;
        });
        this.root = this.$global.Tree.makeTree(data, true);
        this.selectTreeNode(this.root[0]);
      });
    },
    showMenu() {},
    selectTreeNode(node) {
      this.treeNode = node;
      if (node.pid == null) {
        this.id = null;
      } else {
        if (node.type == 0) {
          this.id = Number(node.id.split("-")[0]);
        } else if (node.type == 1) {
          this.ouId = Number(node.id.split("-")[0]);
          this.id = this.searchDomainId(Number(node.pid));
        }
      }

      this.getLogList();
    },
    searchDomainId(id, res) {
      for (let i = 0; i < this.treeData.length; i++) {
        let item = this.treeData[i];
        if (item.id === id) {
          if (item.type == 0) {
            res = item.id.split("-")[0];
            break;
          } else {
            return this.searchDomainId(item.pid, res);
          }
        }
      }
      return res;
    },
    clearLogList() {
      this.query = {
        uid: null,
        userName: null,
        startTime: null,
        endTime: null,
        level: null,
        action: null,
        ip:null,
        sysName:null,
        hostname:null
      };
      this.getLogList();
    },
    getLogList() {
      if (this.query.uid == "") {
        this.query.uid = null;
      }
      if (this.query.userName == "") {
        this.query.userName = null;
      }
      if (this.query.startTime == "") {
        this.query.startTime = null;
      }
      if (this.query.endTime == "") {
        this.query.endTime = null;
      }
      if (this.query.level == "") {
        this.query.level = null;
      }
      if (this.query.action == "") {
        this.query.action = null;
      }
      let data = {
        current: this.page.current,
        size: this.page.size,
        domainId: this.id,
        // uid: this.ouId,
        startTime: this.query.startTime
          ? new Date(this.query.startTime).getTime()
          : null,
        endTime: this.query.endTime
          ? new Date(this.query.endTime).getTime()
          : null,
        level:
          this.query.level?.name == "消息"
            ? "info"
            : this.query.level?.name == "警告"
            ? "warn"
            : this.query.level?.name == "错误"
            ? "error"
            : null,
        action: this.query.action,
        ///////////////////////////
        userName: this.query.userName,
        uid: this.query.uid,

        ip:this.query.ip,
        sysName:this.query.sysName,
        hostname:this.query.hostname
      };

      this.$http
        .get("/client_access_log/list", {
          params: data,
        })
        .then((res) => {
          if (res.success) {
            this.table = res.data.records;
            this.page.total = res.data.total;
          }

          //   this.page.total = res.data.total;
        });
    },
    changePage(page) {
      this.page.current = page.page + 1;
      this.page.size = page.rows;
      this.getLogList();
    },
    // logDialog(data) {
    //   this.$http
    //     .get("/client_inst_log/getLog", {
    //       params: {
    //         logId: data.id,
    //       },
    //     })
    //     .then((res) => {
    //       if (res != null && res.toString() !== "") {
    //         this.tableItem.data = res;
    //         this.display = true;
    //       } else {
    //         this.$toast.add({
    //           severity: "info",
    //           summary: "暂无日志！ ",
    //           life: 3000,
    //         });
    //       }
    //     });
    // },
    infoDialog(data) {
      this.showDisplay = true;
      this.$nextTick(() => {
        this.$refs.showInfo.init(data);
      });
    },
    // deleteDialog(data) {
    //   this.clearDisplay = true;
    //   this.deleteData = data;
    // },
    // deleteLog() {
    //   if (this.deleteData) {
    //     this.$http
    //       .get("/client_inst_log/remove", {
    //         params: {
    //           logId: this.deleteData.id,
    //         },
    //       })
    //       .then(() => {
    //         this.$toast.add({
    //           severity: "info",
    //           summary: "删除成功！ ",
    //           life: 3000,
    //         });
    //         this.clearDisplay = false;
    //         this.getLogList();
    //       });
    //   } else {
    //     this.$http
    //       .get("/client_inst_log/clear", {
    //         params: {
    //           domainId: Number(Object.keys(this.selectedKey)[0].split("-")[0]),
    //         },
    //       })
    //       .then(() => {
    //         this.$toast.add({
    //           severity: "info",
    //           summary: "清空成功！ ",
    //           life: 3000,
    //         });
    //         this.clearDisplay = false;
    //         this.getLogList();
    //       });
    //   }
    // },
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
  justify-content: flex-end;
}

.queryForm {
  width: 100%;
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
  justify-content: flex-end;
}

.query-input > div {
  margin-bottom: 1rem;
  width: 250px;
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
