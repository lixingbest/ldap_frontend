<template>
  <Sidebar style="width: 800px" @hide="closeDialog" position="right" :showCloseIcon="false" v-model:visible="show">
    <h5>命令组列表</h5>
    <div class="table-title">
      <div>
        <Button :disabled="selectList!=null&&selectList.length>0?null:'disable'" @click="AddDialog(1)" class="p-mr-2">
          添加为允许执行的命令
        </Button>
        <Button :disabled="selectList!=null&&selectList.length>0?null:'disable'" @click="AddDialog(0)" class="p-button-danger">
          添加为禁止执行的命令
        </Button>
      </div>
      <div class="from">
        <div class="form-item p-mr-3">
          <label>名称：</label>
          <InputText class="inout-t"></InputText>
        </div>
        <Button>查询</Button>
      </div>
    </div>
    <DataTable class="p-mt-3" v-model:selection="selectList" :rowHover="true" :value="list" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
      paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
      <template #empty>
        <p style="text-align: center">暂无信息...</p>
      </template>
      <Column selectionMode="multiple" style="width: 3em"></Column>
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
    </DataTable>
    <Dialog v-model:visible="AddDisplay" @hide="AddDisplay=false" header="添加命令组" style="min-width: 250px">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>
          您确定添加
          "<span class="p-mr-1" v-for="(item ,index) in selectList" :key="item.id">
            {{ item.cn[0] }} <span v-if="index!==selectList.length-1">,</span>
          </span>" 吗?
        </span>
      </div>
      <template #footer>
        <Button label="是" icon="pi pi-check" @click="submitAdd" class="p-button-link" />
        <Button label="否" icon="pi pi-times" @click="AddDisplay=false" class="p-button-secondary p-button-link" />
      </template>
    </Dialog>
  </Sidebar>
</template>

<script>
export default {
  name: "AddRole",
  data() {
    return {
      show: false,
      list: null,
      selectList: null,
      AddDisplay: false,
      parentData: null,
      sts: null,
      domainId: null,
    };
  },
  methods: {
    init(data, domainId) {
      this.show = true;
      this.parentData = data;
      this.domainId = domainId;
      this.getData();
    },
    getData() {
      this.$http
        .get("/sudo_cmd_group/list", {
          params: {
            domainId: this.domainId,
          },
        })
        .then((res) => {
          this.list = res.data;
        });
    },
    closeDialog() {
      this.show = false;
      this.$emit("close");
    },
    AddDialog(sts) {
      this.AddDisplay = true;
      this.sts = sts;
    },
    submitAdd() {
      let list = [];
      for (let i in this.selectList) {
        list.push(this.selectList[i].cn[0]);
      }

      this.$http
        .get(
          this.sts == 1
            ? "/sudo_rule/addAllowCmdGroup"
            : "/sudo_rule/addDenyCommand",
          {
            params: {
              ruleCN: this.parentData.cn[0],
              groupList: String(list.toString()),
              domainId: this.domainId,
            },
          }
        )
        .then(() => {
          this.deleteDisplay = false;
          this.$toast.add({
            severity: "info",
            summary: "添加成功！ ",
            life: 3000,
          });
          this.closeDialog();
        });
    },
  },
};
</script>

<style scoped>
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
</style>
