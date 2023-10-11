<template>
  <div class="page">
    <div class="p-col-2 p-p-0 border-r" style="height:100%">
      <p class="title">域林信息</p>
      <Tree :value="root" selectionMode="single" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey" @node-select="selectTreeNode"></Tree>
    </div>
    <div class="p-col-10 p-p-0" style="width:calc(100% - 280px);height:100%">
      <p class="title">{{ treeNode ? '"' + treeNode.name + '"的' : '' }}客户端升级</p>
      <div class="p-p-3" style="height:100%">
        <div class="table-head">
          <div style="width: 20%;">
            <Button @click="ReleaseVersions()">发布版本</Button>
          </div>
          <div class="queryForm">
            <div class="query-input">
              <div>
                <label>版本名称：</label>
                <InputText class="inputWid" v-model="query.time" dateFormat="yy/mm/dd" />
              </div>
              <div v-if="showInput.userName">
                <label>版本号：</label>
                <InputText class="inputWid" v-model="query.time2" dateFormat="yy/mm/dd" />
              </div>
              <div v-if="showInput.startTime" style="width: 180px;">
                <label>是否升级：</label>
                <SelectButton v-model="query.domainName" :options="options" optionLabel="name" />
<!--                <InputSwitch v-model="query.domainName" />-->
<!--                <Dropdown v-model="query.domainName" :options="countries" optionLabel="name" class="w-full inputWid md:w-14rem"></Dropdown>-->
              </div>
            </div>
            <div :style="isDisplay?'width:160px':'width:70px'" style="display: flex;justify-content: flex-end">
              <Button v-if="isDisplay" :icon="open?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right" :label="open?'折叠':'展开'" class="p-button-link" @click="fun" />
              <Button @click="aa()">查询</Button>
            </div>
          </div>
        </div>
        <div style="height:calc(100% - 100px);overflow:hidden" id="glyDataTable">
          <data-table style="margin-top:1rem" :value="table" ref="table" :auto-layout="true" frozenWidth="20rem" :rowHover="true" :scrollable="true" :scroll-height="scrollHeight">
            <template #empty>
              <p style="text-align: center">暂无信息...</p>
            </template>
            <Column header="版本名称" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.domainName }}</span>
              </template>
            </Column>
            <Column header="版本编号" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.syncDomainName }}</span>
              </template>
            </Column>
            <Column header="版本号" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.syncUrl }}</span>
              </template>
            </Column>
            <Column header="版本发布日期" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.beginTime }}</span>
              </template>
            </Column>
            <Column header="版本特性" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.endTime }}</span>
              </template>
            </Column>
            <Column header="是否强制升级" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.ouTotal }}</span>
              </template>
            </Column>
            <Column header="版本部署包url" style="min-width: 10rem">
            <template #body="row">
              <span class="text-ellipsis">{{ row.data.ouSuccess }}</span>
            </template>
            </Column>
              <Column header="兼容性" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.ouError }}</span>
              </template>
            </Column>
              <Column header="说明" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.userTotal }}</span>
              </template>
            </Column>
              <Column header="发布人" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.userSuccess }}</span>
              </template>
            </Column>
            <Column header="发布时间" style="min-width: 10rem">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.userError }}</span>
              </template>
            </Column>
            <Column header="操作" :frozen="true" alignFrozen="right" style="min-width: 18rem;justify-content: center">
                <template #body="item">
                  <Button class="p-button-link p-button-sm" @click="ReleaseVersions(item.data)">编辑</Button>
                </template>
            </Column>
          </data-table>
          <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                     :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
          </Paginator>
        </div>
      </div>
    </div>
    <ReleaseVersion ref="ReleaseVersion" v-if="ReleaseVersion" v-on:close="closeDialog"></ReleaseVersion>
  </div>
</template>

<script>
import ReleaseVersion from './ReleaseVersion'
export default {
  name: "ActiveDirectoryTb",
  components: { ReleaseVersion },
  data() {
    return {
      scrollHeight: "400px",
      root: null,
      expandedKeys: {
        "1-0": true,
      },
      selectedKey: {},
      treeNode: null,
      table: null,
      query: {
        domainName: null,
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
      ReleaseVersion: false,
      options: [
        { name: '是', value: 0 },
        { name: '否', value: 1 },
      ]
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
    if (searchWidth > 800) {
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
      if (this.query.domainName) {
        this.query.domainName = this.query.domainName.value
      } else {
        this.query.domainName = null
      }
      this.$http
          .get("/active_directory/job/list", {
            params: {
              domainId: id || Object.keys(this.selectedKey)[0].split("-")[0],
              current: this.page.current,
              size: this.page.size,
              beginTime: this.query.time3,
              endTime: this.query.time4,
              result: this.query.domainName,
            },
          })
          .then((res) => {
            this.page.total = res.data.total;
            this.table = res.data.records;
            if (this.table) {
              this.table.forEach(item=>{
                let date = new Date(parseInt(item.beginTime));
                item.beginTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
                let date2 = new Date(parseInt(item.endTime));
                item.endTime = `${date2.getFullYear()}/${date2.getMonth() + 1}/${date2.getDate()}`
              })
            }
          });
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
    ReleaseVersions(data) {
      this.ReleaseVersion = true;
      let id
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0].children[0]
        id = Number(node.id.split("-")[0])
      } else {
        id = Object.keys(this.selectedKey)[0].split("-")[0]
      }
      this.$nextTick(() => {
        this.$refs.ReleaseVersion.init(id,data);
      });
    },
    closeDialog() {
      this.ReleaseVersion = false
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
.ml-2{
  margin-left: 5px;
}
</style>
