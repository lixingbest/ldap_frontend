<template>
  <Sidebar style="width: 900px" @hide="closeDialog" position="right" :showCloseIcon="false" v-model:visible="show">
    <h4>用户列表</h4>
    <div class="table-title">
      <div>
        <Button class="p-mr-3" @click="addGroupUser">添加用户</Button>
        <Button class="p-button-danger" @click="selectList.length>0?deleteDialog():message('请先选择人员！')">移除所选用户</Button>
      </div>
      <div class="from">
        <div class="form-item p-mr-3">
          <label>登录名(UID)：</label>
          <InputText class="inout-t" v-model="query.uid"></InputText>
        </div>
        <Button @click="getData">查询</Button>
      </div>
    </div>
    <DataTable style="margin-top: 10px;width: 100%" v-model:selection="selectList" :rowHover="true" :value="list" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
      frozenWidth="140px" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
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
            {{ JSON.parse(item).title }}<span v-if="index!==a.data.title.length-1">,</span>
          </span>
        </template>
      </Column>
      <!-- <Column style="min-width: 100px" field="ou" header="组织单位">
        <template #body="a">
          <span class="center" v-for="(item ,index) in a.data.ou" :key="item.index">
            {{ item }}<span v-if="index!==a.data.ou.length-1">,</span>
          </span>
        </template>
      </Column> -->
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
      <Column :frozen="true" alignFrozen="right" style="min-width: 140px;justify-content: center" header="操作">
        <template #body="a">
          <Button class="p-button-link " style="color:red" @click="deleteDialog(a.data)">移除用户</Button>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="deleteDisplay" @hide="closeDelete" header="移除用户" style="min-width: 250px">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>
          您确定要移除
          "<span class="p-mr-1" v-for="(item ,index) in selectList" :key="item.id">
            {{ item.cn[0] }} <span v-if="index!==selectList.length-1">,</span>
          </span>" 吗?
        </span>
      </div>
      <template #footer>
        <Button label="是" icon="pi pi-check" @click="submitDelete" class="p-button-link" />
        <Button label="否" icon="pi pi-times" @click="deleteDisplay=false" class="p-button-secondary p-button-link" />
      </template>
    </Dialog>

    <AddUser v-if="addDisplay" ref="addUser" v-on:close="closeAdd"></AddUser>
  </Sidebar>
</template>

<script>
import AddUser from "@/views/modules/DomainManage/DomainManagePage/UserGroup/AddUser";

export default {
  name: "ManageUser",
  components: { AddUser },
  data() {
    return {
      show: false,
      addDisplay: false,
      deleteDisplay: false,
      deleteItem: null,
      groupData: {},
      type: null,
      types: [{ name: "111" }, { name: "222" }],
      list: [],
      selectList: [],
      domainId: null,
      query:{uid:null}
    };
  },
  methods: {
    init(data, domainId) {
      this.show = true;
      this.groupData = data;
      this.domainId = domainId;
      this.getData(domainId);
    },
    getData() {
      this.$http
        .get("/usergroup/listUser", {
          params: {
            groupCN: this.groupData.cn[0],
            domainId: this.domainId,
            uid:this.query.uid
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
    deleteDialog(item) {
      this.deleteDisplay = true;

      if (item != null && item.uid != null && item.uid !== "") {
        this.selectList.push(item);
      }
    },
    message(mess) {
      this.$toast.add({ severity: "info", summary: mess, life: 3000 });
    },
    closeDelete() {
      this.selectList = [];
      this.deleteDisplay = false;
    },
    submitDelete() {
      let list = "";
      for (let i in this.selectList) {
        if (i != this.selectList.length - 1) {
          list = list + '"' + this.selectList[i].uid[0] + '",';
        } else {
          list = list + '"' + this.selectList[i].uid[0] + '"';
        }
      }

      this.$http
        .get("/usergroup/removeUser", {
          params: {
            groupCN: this.groupData.cn[0],
            userCNList: list,
            domainId: this.domainId,
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
    },
    addGroupUser() {
      this.addDisplay = true;
      this.$nextTick(() => {
        this.$refs.addUser.init(this.groupData, this.domainId);
      });
    },
    closeAdd() {
      this.addDisplay = false;
      this.getData();
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
.text {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
