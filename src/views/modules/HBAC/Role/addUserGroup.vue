<template>
  <Sidebar style="width: 800px" @hide="closeDialog" position="right" :showCloseIcon="false" v-model:visible="show">
    <h5>添加用户组</h5>
    <div class="table-title">
      <Button @click="AddDialog" :disabled="selectList&&selectList.length>0?null:'disabled'">添加到规则库</Button>
      <div class="from">
        <div class="form-item p-mr-3">
          <label>名称：</label>
          <InputText class="inout-t"></InputText>
        </div>
        <Button>查询</Button>
      </div>
    </div>
    <DataTable style="margin-top: 10px;width: 100%" v-model:selection="selectList" :rowHover="true" :value="list" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
      paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
      <template #empty>
        <p style="width:100%;text-align: left;">暂无信息...</p>
      </template>
      <Column selectionMode="multiple" style="width: 3em"></Column>
      <Column style="min-width: 8rem;" field="cn" header="名称">
        <template #body="a">
          <span class="center" v-if="a.data.cn">{{ a.data.cn[0] }}</span>
        </template>
      </Column>
      <Column style="min-width: 40rem;" field="dn" header="可分辨名称(DN)">
        <template #body="row">
          <span>{{ row.data.dn }}</span>
        </template>
      </Column>
      <Column style="min-width: 5rem;" field="member_user" header="用户数">
        <template #body="row">
          <span class="center" v-if="row.data.member_user">{{ row.data.member_user.length }}人</span>
          <span class="center" v-else>0人</span>
        </template>
      </Column>
      <Column style="min-width: 20rem;" field="description" header="描述">
        <template #body="a">
          <span class="center" v-if="a.data.description">{{ JSON.parse(a.data.description[0]).description }}</span>
        </template>
      </Column>

    </DataTable>
    <Dialog v-model:visible="deleteDisplay" @hide="deleteDisplay=false" header="添加用户组" style="min-width: 250px">
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
        <Button label="否" icon="pi pi-times" @click="deleteDisplay=false" class="p-button-secondary p-button-link" />
      </template>
    </Dialog>
  </Sidebar>
</template>

<script>
export default {
  name: "addUserGroup",
  data() {
    return {
      show: false,
      list: null,
      selectList: null,
      deleteDisplay: false,
      parentData: null,
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
        .get("/sudo_rule/listAllUserGroup", {
          params: {
            //cn:this.parentData.cn[0],
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
    AddDialog() {
      this.deleteDisplay = true;
    },
    submitAdd() {
      let list = [];

      for (let i in this.selectList) {
        list.push(this.selectList[i].cn[0]);
      }

      this.$http
        .get("/sudo_rule/addUserGroup", {
          params: {
            domainId: this.domainId,
            ruleCN: this.parentData.cn[0],
            groupList: list.toString(),
          },
        })
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
  margin-top: 15px;
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
