<template>
  <Sidebar style="width: 800px" @hide="closeDialog" position="right" :showCloseIcon="false" v-model:visible="show">
    <h5>域用户</h5>
    <div class="table-title">
      <Button @click="selectList.length>0?AddDialog():message('请先选择人员！')">添加到组织单位</Button>
      <div class="from">
        <div class="form-item p-mr-3">
          <label>登录名(UID) ：</label>
          <InputText class="inout-t"></InputText>
        </div>
        <div class="form-item p-mr-3">
          <label>手机号码 ：</label>
          <InputText class="inout-t"></InputText>
        </div>
        <Button>查询</Button>
      </div>
    </div>
    <DataTable style="margin-top: 10px;width: 100%" :loading="loading" v-model:selection="selectList" :rowHover="true" :value="list" :scrollable="true" scroll-height="400px" paginator :rows="10"
      :rowsPerPageOptions="[10, 20, 50,100]" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
      <template #empty>
        暂无信息...
      </template>
      <template #loading>
        <p>正在加载数据，请稍等...</p>
      </template>
      <Column selectionMode="multiple" style="width: 3em"></Column>
      <Column style="min-width: 110px" field="uid" header="登录名(UID)">
        <template #body="a">
          <span class="center" v-for="(item ,index) in a.data.uid" :key="item.index">
            {{ item }}<span v-if="index!==a.data.uid.length-1">,</span>
          </span>
        </template>
      </Column>
      <Column style="min-width: 100px" field="cn" header="姓名">
        <template #body="a">
          <span class="center" v-for="(item ,index) in a.data.cn" :key="item.index">
            {{ item }}<span v-if="index!==a.data.cn.length-1">,</span>
          </span>
        </template>
      </Column>
      <Column style="min-width: 100px" field="employeenumber" header="员工编号">
        <template #body="a">
          <span class="center" v-for="(item ,index) in a.data.employeenumber" :key="item.index">
            {{ item }}<span v-if="index!==a.data.employeenumber.length-1">,</span>
          </span>
        </template>
      </Column>
      <Column style="min-width: 100px" field="employeenumber" header="状态">
        <template #body="a">
          <div class="center">
            <span class="p-tag" :class="{'p-tag-danger':a.data.nsaccountlock,'p-tag-success':!a.data.nsaccountlock}">
              {{ a.data.nsaccountlock ? '禁用' : '启用' }}</span>
          </div>
        </template>
      </Column>
      <Column style="min-width: 150px" field="title" header="职称">
        <template #body="a">
          <span class="center" v-for="(item ,index) in a.data.title" :key="item.index">
            {{ item }}<span v-if="index!==a.data.title.length-1">,</span>
          </span>
        </template>
      </Column>
      <Column style="min-width: 100px" field="ou" header="组织单位">
        <template #body="a">
          <span class="center" v-for="(item ,index) in a.data.ou" :key="item.index">
            {{ item }}<span v-if="index!==a.data.ou.length-1">,</span>
          </span>
        </template>
      </Column>
      <Column style="min-width: 100px" field="telephonenumber" header="固定电话">
        <template #body="a">
          <span class="center" v-for="(item ,index) in a.data.telephonenumber" :key="item.index">
            {{ item }}<span v-if="index!==a.data.telephonenumber.length-1">,</span>
          </span>
        </template>
      </Column>
      <Column style="min-width: 100px" field="mobile" header="手机号码">
        <template #body="a">
          <span class="center" v-for="(item ,index) in a.data.mobile" :key="item.index">
            {{ item }}<span v-if="index!==a.data.mobile.length-1">,</span>
          </span>
        </template>
      </Column>
      <Column field="dn" style="min-width: 300px;" header="可分辨名称(DN)">
        <template #body="a">
          <span class="text" v-tooltip.top="a.data.dn">{{ a.data.dn }}</span>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="AddDisplay" @hide="closeAdd" header="添加用户" style="min-width: 250px">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>
          您确定添加
          "<span class="p-mr-1" v-for="(item ,index) in selectList" :key="item.id">
            {{ item.uid[0] }} <span v-if="index!==selectList.length-1">,</span>
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
  name: "AddUserToOrg",
  data() {
    return {
      domainId: null,
      show: false,
      loading: true,
      list: null,
      parentData: null,
      selectList: null,
      AddDisplay: null,
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
        .get("/domainuser/list", {
          params: {
            domainId: this.domainId,
          },
        })
        .then((res) => {
          this.list = res.data;
          this.loading = false;
        });
    },
    closeDialog() {
      this.show = false;
      this.$emit("close");
    },
    AddDialog(item) {
      this.AddDisplay = true;
      if (item != null && item.id != null && item.id !== "") {
        this.selectList.push(item);
      }
    },
    message(mess) {
      this.$toast.add({ severity: "info", summary: mess, life: 3000 });
    },
    closeAdd() {
      this.selectList = [];
      this.AddDisplay = false;
    },
    submitAdd() {
      let list = [];
      for (let i in this.selectList) {
        list.push(this.selectList[i].uid[0]);
      }
      this.$http
        .post("/ou/addUsers", {
          domainId: this.domainId,
          ouId: this.parentData.id,
          userCNList: list,
        })
        .then(() => {
          this.addDisplay = false;
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
</style>

