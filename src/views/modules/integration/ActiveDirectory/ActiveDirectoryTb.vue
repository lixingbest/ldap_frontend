<template>
  <div class="page">
    <div class="p-col-2 p-p-0 border-r" style="height:100%">
      <p class="title">域林信息</p>
      <Tree :value="root" selectionMode="single" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey" @node-select="selectTreeNode"></Tree>
    </div>
    <div class="p-col-10 p-p-0" style="width:calc(100% - 280px);height:100%">
      <p class="title">{{ treeNode ? '"' + treeNode.name + '"的' : '' }}Active Directory同步</p>
      <div class="p-p-3" style="height:100%">
<!--        <div class="p-mb-3" style="display: flex;justify-content: flex-end;">-->
<!--          <div class="p-mr-2">-->
<!--            <label>开始时间：</label>-->
<!--            <Calendar class="inputWid" v-model="query.time" dateFormat="yy/mm/dd" />-->
<!--          </div>-->
<!--          <div class="p-mr-2">-->
<!--            <label>结束时间：</label>-->
<!--            <Calendar class="inputWid" v-model="query.time2" dateFormat="yy/mm/dd" />-->
<!--          </div>-->
<!--          <div class="p-mr-2">-->
<!--            <label>同步结果：</label>-->
<!--            <Dropdown v-model="query.domainName" :options="countries" optionLabel="name" class="w-full inputWid md:w-14rem"></Dropdown>-->
<!--          </div>-->
<!--          <Button @click="aa()">查询</Button>-->
<!--        </div>-->
        <div class="table-head">
          <div class="queryForm">
            <div class="query-input">
              <div>
                <label>开始时间：</label>
                <Calendar class="inputWid" v-model="query.time" dateFormat="yy/mm/dd" />
              </div>
              <div v-if="showInput.userName">
                <label>结束时间：</label>
                <Calendar class="inputWid" v-model="query.time2" dateFormat="yy/mm/dd" />
              </div>
              <div v-if="showInput.startTime">
                <label>同步结果：</label>
                <Dropdown v-model="query.domainName" :options="countries" optionLabel="name" class="w-full inputWid md:w-14rem"></Dropdown>
              </div>
            </div>
            <div style="display: flex;justify-content: flex-end">
              <Button v-if="isDisplay" :icon="open?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right" :label="open?'折叠':'展开'" class="p-button-link" @click="fun" />
              <Button @click="aa()" style="margin: 0 0.5rem 0 0.5rem;">查询</Button>
              <Button @click="empty()">清空</Button>
            </div>
          </div>
        </div>
        <div style="height:calc(100% - 100px);overflow:hidden" id="glyDataTable">

          <DataTable style="margin-top:1rem" :value="table" :auto-layout="true" frozenWidth="20rem" :rowHover="true" :scrollable="true" :scroll-height="scrollHeight">
            <template #empty>
              <p style="text-align: center">暂无信息...</p>
            </template>
            <ColumnGroup type="header">
              <Row>
                <Column  :colspan="5" />
                <Column header="组织单位同步" :colspan="3" />
                <Column header="域用户同步" :colspan="4" />
                <Column :colspan="1" />
              </Row>
              <Row>
                <Column header="域" field="domain" />
                <Column header="Active Directory源" field="adSyncUrl" />
                <Column header="同步耗时（秒）" field="time" />
                <Column header="开始同步时间" field="beginTime" />
                <Column header="结束同步时间" field="endTime" />
                <Column header="待同步" field="ouTotal" />
                <Column header="成功" field="ouSuccess" />
                <Column header="失败" field="ouError" />
                <Column header="待同步" field="userTotal" />
                <Column header="成功" field="userSuccess" />
                <Column header="失败" field="userError" />
                <Column header="结果" field="result" />
                <Column header="操作" field="ope" />
              </Row>
            </ColumnGroup>

            <Column header="域" field="domain" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.domain }}</span>
              </template>
            </Column>
            <Column header="AD同步地址" field="adSyncUrl" style="min-width: 16rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.syncUrl }}</span>
              </template>
            </Column>
            <Column header="同步耗时（秒）" field="time" style="min-width: 12rem">
              <template #body="row">
                <span class="text-ellipsis">{{ (row.data.orgEndTime-row.data.orgBeginTime)/1000 }} 秒</span>
              </template>
            </Column>
            <Column header="开始同步时间" field="beginTime" style="min-width: 12rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.beginTime }}</span>
              </template>
            </Column>
            <Column header="结束同步时间" field="endTime" style="min-width: 12rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.endTime }}</span>
              </template>
            </Column>
            <Column header="待同步OU数" field="ouTotal" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.ouTotal }} 个</span>
              </template>
            </Column>
            <Column header="OU同步成功数" field="ouSuccess" style="min-width: 16rem">
            <template #body="row">
              <span class="text-ellipsis">
                {{ row.data.ouSuccess }} 个
                <a href="javascript:" @click="synchronizeDetails(row.data,0)">（新增 {{row.data.addNum4OU}},更新 {{row.data.updateNum4OU}}）</a>
              </span>
            </template>
          </Column>
            <Column header="OU同步失败数" field="ouError" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.ouError }} 个</span>
              </template>
            </Column>
            <Column header="待同步域用户数" field="userTotal" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.userTotal }} 人</span>
              </template>
            </Column>
            <Column header="域用户同步成功数" field="userSuccess" style="min-width: 16rem">
            <template #body="row">
              <span class="text-ellipsis">
                {{ row.data.userSuccess }} 人
                <a href="javascript:" @click="synchronizeDetails(row.data,1)">（新增 {{row.data.addNum4User}},更新 {{row.data.updateNum4User}}）</a>
              </span>
            </template>
          </Column>
            <Column header="域用户同步失败数" field="userError" style="min-width: 10rem">
            <template #body="row">
              <span class="text-ellipsis">{{ row.data.userError }} 人</span>
            </template>
          </Column>
            <Column header="同步结果" field="result" style="min-width: 8rem">
            <template #body="row">
              <Tag v-if="row.data.result === 0" severity="success" value="成功"></Tag>
              <Tag v-if="row.data.result === 1" severity="danger" value="失败"></Tag>
              <Tag v-if="row.data.result === 2" value="进行中"></Tag>
            </template>
          </Column>
            <Column header="操作" field="ope" :frozen="true" alignFrozen="right" style="min-width: 18rem;justify-content: center">
              <template #body="item">
                <!--                <Button class="p-button-link p-button-sm" @click="updatePassword(item.data)">查看AD源</Button>-->
                <Button class="p-button-link p-button-sm" @click="synchronizeDetails(item.data,0)">同步明细</Button>
                <Button class="p-button-link p-button-sm" @click="viewLogs(item.data)">日志</Button>
              </template>
            </Column>
          </DataTable>
          <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                     :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
          </Paginator>
        </div>
      </div>
    </div>
    <synchronizeDetails ref="synchronizeDetails" v-if="synchronizeDetailsDisplay" v-on:close="closeDialog"></synchronizeDetails>
    <viewLog ref="viewLog" v-if="viewLogDisplay" v-on:close="closeDialog"></viewLog>
  </div>
</template>

<script>
import synchronizeDetails from '../synchronizeDetails'
import viewLog from '../viewLog'
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';

export default {
  name: "ActiveDirectoryTb",
  components: { synchronizeDetails,viewLog,ColumnGroup,Row },
  data() {
    return {
      scrollHeight: "400px",
      root: null,
      expandedKeys: {
        "1-0": true,
      },
      synchronizeDetailsDisplay: false,
      viewLogDisplay: false,
      selectedKey: {},
      treeNode: null,
      table: null,
      query: {
        domainName: null,
        domainName2: null,
        time: null,
        time2: null,
        time3: null,
        time4: null
      },
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
      countries: [
        {name: '成功', code: '0'},
        {name: '失败', code: '1'},
        {name: '进行中', code: '2'}
      ],
      isDisplay: false,
      open: false,
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
    const search = document.getElementsByClassName("query-input")[0];
    const searchWidth = search.clientWidth;
    if (searchWidth > 1000) {
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
      if (searchWidth > 1000) {
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
        if (searchWidth > 850) {
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
        let data = res.data.filter(
            (item) => item.type === "0" && item.upStatus === 0
        );
        data.forEach((item) => {
          if (item.pid == null) this.expandedKeys[item.id] = true;
        });
        this.root = this.$global.Tree.makeTree(data, true);
        // let data = res.data;
        // this.root = this.$global.Tree.makeTree(data, true);
        this.selectTreeNode(this.root[0].children[0]);
      });
    },
    selectTreeNode(node) {
      this.treeNode = node;
      let id = Number(node.id.split("-")[0]);
      this.table = null;
      this.getList(id);
    },
    empty() {
      this.query.time = null
      this.query.time2 = null
      this.query.domainName = null
      this.aa()
    },
    aa() {
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0].children[0]
        let id = Number(node.id.split("-")[0]);
        this.getList(id);
      } else {
        this.getList();
      }
    },
    getList(id) {
      if (this.query.time) {
        if (typeof this.query.time === 'object') {
          this.query.time3 = this.query.time.getTime()
        }
      }else {
        this.query.time3 = null
      }
      if (this.query.time2) {
        if (typeof this.query.time2 === 'object') {
          this.query.time4 = this.query.time2.getTime()
        }
      } else {
        this.query.time4 = null
      }
      if (this.query.domainName) {
        this.query.domainName2 = this.query.domainName.code
      } else {
        this.query.domainName2 = null
      }
      this.$http
          .get("/active_directory/job/list", {
            params: {
              domainId: id || Object.keys(this.selectedKey)[0].split("-")[0],
              current: this.page.current,
              size: this.page.size,
              beginTime: this.query.time3,
              endTime: this.query.time4,
              result: this.query.domainName2,
            },
          })
          .then((res) => {
            this.page.total = res.data.total;
            this.table = res.data.records;
            if (this.table) {
              this.table.forEach(item=>{
                item.orgBeginTime = item.beginTime
                item.orgEndTime = item.endTime

                let date = new Date(parseInt(item.beginTime));
                item.beginTime = this.formatDate(date)
                let date2 = new Date(parseInt(item.endTime));
                item.endTime = this.formatDate(date2)
              })
            }
          });
    },
    formatDate(datetime) {
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
      let year = datetime.getFullYear(),
          month = ("0" + (datetime.getMonth() + 1)).slice(-2),
          date = ("0" + datetime.getDate()).slice(-2),
          hour = ("0" + datetime.getHours()).slice(-2),
          minute = ("0" + datetime.getMinutes()).slice(-2),
          second = ("0" + datetime.getSeconds()).slice(-2);
      // 拼接
      let result = year + "/"+ month +"/"+ date +" "+ hour +":"+ minute +":" + second;
      // 返回
      return result;
    },
    changePage(event) {
      this.page.current = event.page + 1;
      this.page.size = event.rows;
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0].children[0]
        let id = Number(node.id.split("-")[0]);
        this.getList(id);
      } else {
        this.getList();
      }
    },
    viewLogs(data) {
      this.viewLogDisplay = true;
      this.$nextTick(() => {
        this.$refs.viewLog.init(data.id);
      });
    },
    synchronizeDetails(data,tabType) {
      this.synchronizeDetailsDisplay = true;
      this.$nextTick(() => {
        this.$refs.synchronizeDetails.init(data.id,tabType);
      });
    },
    closeDialog() {
      this.synchronizeDetailsDisplay = false;
      this.viewLogDisplay = false;
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0].children[0]
        let id = Number(node.id.split("-")[0]);
        this.getList(id);
      } else {
        this.getList();
      }
    }
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
.inputWid {
  width: 12rem
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
</style>
