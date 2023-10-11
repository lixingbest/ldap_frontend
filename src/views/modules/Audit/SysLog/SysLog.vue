<template>
  <div class="page">
    <div class="border-r">
      <p class="title">域林信息</p>
      <Tree :value="root" selectionMode="single" :expandedKeys="expandedKeys"
            v-model:selectionKeys="selectedKey"></Tree>
    </div>
    <div class="content">
      <p class="title">平台访问日志</p>
      <div class="p-p-3" style="height:calc(100% - 50px)">
        <div class="table-head">
          <div class="queryForm">
            <div class="query-input">
              <div>
                <label>工号：</label>
                <InputText v-model="query.jobNo"></InputText>
              </div>
              <div>
                <label>资源：</label>
                <tree-select v-model="menuSelected" :options="menuList"
                             @node-select="(event)=>{query.menu=event.label}"></tree-select>
              </div>
              <div>
                <label>开始时间：</label>
                <Calendar inputId="basic" dateFormat="yy-mm-dd"
                          autocomplete="off" v-model="query.beginDate"/>
              </div>
              <div>
                <label>结束时间：</label>
                <Calendar inputId="basic" dateFormat="yy-mm-dd"
                          autocomplete="off" v-model="query.endDate" :minDate="query.beginDate"/>
              </div>
            </div>
            <div class="query-button">
              <Button :icon="isOpen?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right"
                      :label="isOpen?'折叠':'展开'" class="p-button-link" @click="isOpen=!isOpen"/>
              <Button @click="getLogList()">查询</Button>
              <Button @click="clearLogList()">清空</Button>
            </div>
          </div>
        </div>
        <div class="dataTable" style="overflow:hidden;height:calc(100% - 20px)">
          <DataTable frozenWidth="10rem" :rowHover="true" :value="table"
                     :scrollable="true">
            <template #empty>
              <p style="width:100%;text-align:left">暂无信息</p>
            </template>
            <Column style="text-align:center;min-width: 8rem;" field="domainName" header="所属域"></Column>
            <Column style="text-align:center;min-width: 8rem;" field="username" header="账号"></Column>
            <Column style="text-align:center;min-width: 9rem;" field="time" header="操作时间"></Column>
            <Column style="text-align:center;min-width: 6rem;" field="menu" header="资源"></Column>
            <Column style="text-align:center;min-width: 6rem;" field="type" header="操作类型"></Column>
            <Column style="text-align:center;min-width: 8rem;" field="message" header="操作内容"></Column>
            <Column style="text-align:center;min-width: 8rem;" field="data" header="操作数据"></Column>
            <Column :frozen="true" align-frozen="right" style="min-width: 6rem;" header="操作">
              <template #body="row">
                <Button class="p-button-sm p-button-link" @click="infoDialog(row.data)">查看详情</Button>
                <!-- <Button class="p-button-sm p-button-link" @click="logDialog(row.data)">查看日志</Button>
              <Button class="p-button-sm p-button-link" style="color: red" @click="deleteDialog(row.data)">删除</Button> -->
              </template>
            </Column>
          </DataTable>
          <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total"
                     @page="changePage"
                     template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                     :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
          </Paginator>
        </div>
      </div>
    </div>
  </div>

  <show-info ref="showInfo" v-if="showDisplay"></show-info>
</template>

<script>
import ShowInfo from "@/views/modules/Audit/SysLog/showInfo";
import {format} from '@/utils/time'

export default {
  name: "SysLog",
  components: {ShowInfo},
  data() {
    return {
      logList: [{name: "消息"}, {name: "警告"}, {name: "错误"}],
      treeData: [],
      root: [],
      expandedKeys: {},
      selectedKey: {},
      table: [],
      showDisplay: false,
      isOpen: false,
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
      query: {
        jobNo: null,
        beginDate: null,
        endDate: null,
        menu: null,
      },
      menuSelected: {},
      menuList: null,
    }
  },
  mounted() {
    this.getData();
    this.getMenuList();
  },
  computed: {
    display() {
      return this.isOpen ? 'flex' : 'none'
    }
  },
  watch: {
    selectedKey: {
      handler() {
        this.getLogList()
      },
      deep: true,
    }
  },
  methods: {
    getMenuList() {
      this.$http
          .get("/resource/all")
          .then((res) => {
            this.menuList = res.data;
          });
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
        this.selectedKey[this.root[0].key] = true
        this.getLogList()
      });
    },

    clearLogList() {
      this.query = {
        jobNo: null,
        beginDate: null,
        endDate: null,
        menu: null
      };
      this.menuSelected = {}
      this.getLogList();
    },
    getLogList() {
      this.$http.get("/sys_log/list", {
        params: {
          current: this.page.current,
          size: this.page.size,
          domainId: parseInt(Object.keys(this.selectedKey)[0].split('-')[0]),
          jobNo: this.query.jobNo,
          beginDate: format(this.query.beginDate),
          endDate: format(this.query.endDate),
          menu: this.query.menu,
        },
      }).then((res) => {
        if (res.success) {
          this.table = res.data.records;
          this.page.total = res.data.total;
        }
      });
    },
    changePage(page) {
      this.page.current = page.page + 1;
      this.page.size = page.rows;
      this.getLogList();
    },
    infoDialog(data) {
      this.showDisplay = true;
      this.$nextTick(() => {
        this.$refs.showInfo.init(data);
      });
    },
  },
};
</script>

<style scoped lang="scss">
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
  margin-bottom: 1rem;

  .query-input {
    width: 60%;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;


    & > div {
      width: calc(50% - .5rem);
      display: flex;
      align-items: center;

      label {
        display: inline-block;
        width: 5rem;
        text-align: right;
      }

      & > :last-child {
        flex: 1;
      }

      &:nth-of-type(n+3) {
        display: v-bind(display);
      }
    }
  }

  .query-button {
    display: flex;
    gap: 1rem;

    button {
      white-space: nowrap;
    }
  }
}


</style>
