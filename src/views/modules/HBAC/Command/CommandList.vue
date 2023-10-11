<template>
  <div class="page p-grid">
    <div class="p-col-3 border-r p-0">
      <p class="title">
        <span>
          <span>命令组</span>
          <TreeSelect v-model="treeSelect" class="input p-ml-2" @node-select="changTree" :options="treeList" placeholder="请选择域" />
        </span>
        <Button icon="pi pi-plus" class="p-button-text" @click="addOrUpdateComm" />
      </p>
      <DataTable class="p-datatable-sm" @row-click="getList" :value='list' :auto-layout="true" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录" selectionMode="single" dataKey="cn" v-model:selection="selected"
        style="height:calc(100% - 50px);overflow:auto">
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
            <!--            <Button class="p-button-sm p-button-link p-pl-0" @click="addOrUpdateComm(a.data)">编辑</Button>-->
            <Button class="p-button-sm p-button-link p-p-0" style="color: red" @click="deleteDialog(a.data)">删除</Button>
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="p-col-9 p-p-0" style="width:calc(100% - 280px)">
      <p class="title">{{ sItem != null ? '"' + sItem.cn + '" 下的所有命令' : '所有命令（请在左侧选择一个命令组）' }}</p>
      <div class="p-p-3" style="height:calc(100% - 50px)">
        <div class="table-title">
          <Button :class="{'p-disabled':sItem==null}" @click="addOrUpdate">新建命令</Button>
          <div class="from">
            <div class="form-item p-mr-3">
              <label>名称：</label>
              <InputText class="inout-t"></InputText>
            </div>
            <Button>查询</Button>
          </div>
        </div>
        <DataTable :value="commList" class="p-mt-3" :auto-layout="true" style="height:calc(100% - 60px);overflow:auto" :rowHover="true" :scrollable="true" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
          <template #empty>
            <p style="width:100%;text-align: left">暂无信息...</p>
          </template>
          <Column header="命令">
            <template #body="a">
              <span v-if="a.data.sudocmd">{{ a.data.sudocmd[0] }}</span>
            </template>
          </Column>
          <Column header="描述">
            <template #body="a">
              <span v-if="a.data.description">{{ a.data.description[0] }}</span>
            </template>
          </Column>
          <Column header="操作">
            <template #body="a">
              <!--            <Button class="p-button-sm p-button-link p-pl-0" @click="addOrUpdateComm(a.data)">编辑</Button>-->
              <Button class="p-button-sm p-button-link p-p-0" style="color: red" @click="deleteDialog(a.data)">删除
              </Button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="deleteDisplay" :modal="true" @hide="deleteDisplay=false" header="确认删除" style="min-width: 250px">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span>您确认要删除 "{{ deleteItem.cn ? deleteItem.cn[0] : deleteItem.sudocmd[0] }}" 吗？</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="submitDelete" class="p-button-link" />
      <Button label="否" icon="pi pi-times" @click="deleteDisplay=false" class="p-button-secondary p-button-link" />
    </template>
  </Dialog>
  <AddOrUpdateCommand v-if="comDisplay" ref="comAddOrUpdate" v-on:close="closeCom"></AddOrUpdateCommand>
  <AddOrUpdateCommandGroup v-if="addOrUpdateDisplay" ref="addOrUpdate" v-on:close="closeDialog"></AddOrUpdateCommandGroup>
</template>

<script>
import AddOrUpdateCommandGroup from "@/views/modules/HBAC/Command/AddOrUpdateCommandGroup";
import AddOrUpdateCommand from "@/views/modules/HBAC/Command/AddOrUpdateCommand";

export default {
  name: "commandList",
  components: { AddOrUpdateCommandGroup, AddOrUpdateCommand },
  data() {
    return {
      list: [],
      sItem: null,
      commList: [],
      addOrUpdateDisplay: false,
      deleteDisplay: false,
      deleteItem: null,
      comDisplay: false,
      selected: [],

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
        .get("/sudo_cmd_group/list", {
          params: {
            domainId: this.domainId,
          },
        })
        .then((res) => {
          //console.log(res)
          this.list = res.data;
        });
    },
    closeDialog() {
      this.addOrUpdateDisplay = false;
      this.getData();
    },
    addOrUpdateComm(data) {
      console.log(data);
      if (this.selectNodeInfo.pid === null) {
        this.$toast.add({
          severity: "info",
          summary: '不能在"' + this.selectNodeInfo.name + '"下添加命令！',
          life: 3000,
        });
      } else {
        this.addOrUpdateDisplay = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(data, this.domainId);
        });
      }
    },
    deleteDialog(item) {
      this.deleteDisplay = true;
      this.deleteItem = item;
    },
    // 树选择
    changTree(node) {
      this.selectNodeInfo = node;
      this.domainId = node.id.split("-")[0];
      this.getData();
      this.sItem = null;
      this.commList = null;
    },
    submitDelete() {
      if (this.deleteItem != null && this.deleteItem.cn != null) {
        this.$http
          .get("/sudo_cmd_group/delete", {
            params: {
              cn: this.deleteItem.cn[0],
              domainId: this.deleteItem.domainId,
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
      } else {
        this.$http
          .get("/sudo_cmd/delete", {
            params: {
              domainId: this.sItem.domainId,
              sudocmd: this.deleteItem.sudocmd[0],
            },
          })
          .then(() => {
            this.deleteDisplay = false;
            this.$toast.add({
              severity: "info",
              summary: "删除成功！ ",
              life: 3000,
            });
            this.getList();
          });
      }
    },
    getList(event) {
      if (event) {
        this.sItem = event.data;
      }
      if (this.sItem != null && this.sItem.cn != null) {
        this.$http
          .get("/sudo_cmd/list", {
            params: {
              domainId: this.sItem.domainId,
              cmdGroupCN: this.sItem.cn[0],
            },
          })
          .then((res) => {
            this.commList = res.data;
          });
      }
    },
    closeCom() {
      this.comDisplay = false;
      this.getList();
    },
    addOrUpdate(data) {
      this.comDisplay = true;
      this.$nextTick(() => {
        this.$refs.comAddOrUpdate.init(
          data,
          this.sItem.cn,
          this.sItem.domainId
        );
      });
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

.table-title {
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

::v-deep(.p-treeselect .p-treeselect-label) {
  padding: 0 0 0 1rem;
  line-height: 30px;
}

::v-deep(.p-treeselect) {
  border-radius: 30px;
}
::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: center;
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
}
</style>
