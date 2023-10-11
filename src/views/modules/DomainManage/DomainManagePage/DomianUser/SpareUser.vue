<template>
  <div>
    <div class="table-heard">
      <div class="query-form">
        <div class="query-form-item">
          <div>
            <label>登录名：</label>
            <InputText v-model.trim="query.uid" @keydown.enter="getData()"></InputText>
          </div>
          <div>
            <label>姓名：</label>
            <InputText v-model.trim="query.cn" @keydown.enter="getData()"></InputText>
          </div>
          <div v-if="open" class="p-mt-2">
            <label>手机号码：</label>
            <InputText v-model.trim="query.mobile" @keydown.enter="getData()"></InputText>
          </div>
        </div>
        <div>
          <Button :icon="open?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right" :label="open?'折叠':'展开'" class="p-button-link" @click="open=!open" />
          <Button @click="getData()">查询</Button>
          <Button class="p-ml-2" @click="clearQuery">清空</Button>
        </div>
      </div>
    </div>
    <DataTable :value="table" frozenWidth="15rem" scroll-height="400px" :rowHover="true" :scrollable="true" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
      paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
      <template #empty>
        暂无信息...
      </template>
      <Column style="min-width: 5rem" field="uid" header="登录名">
        <template #body="row">
          {{ row.data.uid ? row.data.uid[0] : null }}
        </template>
      </Column>
      <Column style="min-width: 5rem" field="cn" header="姓名">
        <template #body="row">
          {{ row.data.cn ? row.data.cn[0] : null }}
        </template>
      </Column>
      <Column style="min-width: 5rem" field="employeenumber" header="工号">
        <template #body="row">
          {{ row.data.employeenumber ? row.data.employeenumber[0] : null }}
        </template>
      </Column>
      <Column style="min-width: 5rem" field="employeenumber" header="状态">
        <template #body="a">
          <div class="center">
            <span class="p-tag" :class="{'p-tag-danger':a.data.nsaccountlock,'p-tag-success':!a.data.nsaccountlock}">
              {{ a.data.nsaccountlock ? '禁用' : '启用' }}</span>
          </div>
        </template>
      </Column>
      <Column style="min-width: 8rem" field="title" header="职称">
        <template #body="row">
          {{
            row.data.title ? ($global.Util.isJSON(row.data.title[0]) ? JSON.parse(row.data.title[0]).title : '') : null
          }}
        </template>
      </Column>
      <Column style="min-width: 8rem" field="title" header="职位">
        <template #body="row">
          {{
            row.data.title ? ($global.Util.isJSON(row.data.title[0]) ? JSON.parse(row.data.title[0]).job : '') : null
          }}
        </template>
      </Column>

      <Column style="min-width: 8rem" field="telephonenumber" header="固定电话">
        <template #body="row">
          {{ row.data.telephonenumber ? row.data.telephonenumber[0] : null }}
        </template>
      </Column>
      <Column style="min-width: 8rem" field="mobile" header="手机号码">
        <template #body="row">
          {{ row.data.mobile ? row.data.mobile[0] : null }}
        </template>
      </Column>

      <Column :frozen="true" alignFrozen="right" style="min-width: 15rem" header="操作">
        <template #body="row">
          <Button class="p-button-link p-button-sm" @click="showDialog(row.data,2)">恢复</Button>
          <Button class="p-button-link p-button-sm" @click="addOrUpdateUser(row.data)">编辑</Button>
          <Button class="p-button-link p-button-sm" style="color: red" @click="showDialog(row.data,1)">删除</Button>
        </template>
      </Column>
    </DataTable>
  </div>

  <Dialog v-model:visible="display" :modal="true" @hide="closeTemplate()" :header="tableItem&&tableItem._type===1?'删除用户':'恢复用户'">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span v-if="tableItem&&tableItem._type===1"> 您确认要移除域用户 "{{ tableItem.uid[0] }}" 吗？</span>
      <span v-if="tableItem&&tableItem._type===2"> 您确认要恢复用户 "{{ tableItem.uid[0] }}" 吗？</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="tableItem&&tableItem._type===1?deleteUser():recoverUser()" class="p-button-link" />
      <Button label="否" icon="pi pi-times" @click="closeTemplate()" class="p-button-secondary p-button-link" />
    </template>
  </Dialog>
  <CreateUser v-if="addOrUpdateDisplay" ref="addOrUpdate" v-on:close="closeTemplate()"></CreateUser>
</template>

<script>
import CreateUser from "@/views/modules/DomainManage/DomainManagePage/DomianUser/CreateUser";

export default {
  name: "SpareUser",
  components: { CreateUser },
  data() {
    return {
      table: null,
      addOrUpdateDisplay: false,
      tableItem: null,
      display: false,
      query: {
        cn: null,
        mobile: null,
        uid: null,
      },
      open: false,
    };
  },
  watch: {
    domainId() {
      this.getData();
    },
    updateFlag() {
      this.getData();
    },
  },
  props: ["domainId", "treeData", "updateFlag"],
  mounted() {
    this.getData();
  },
  methods: {
    clearQuery() {
      this.query.mobile = null;
      this.query.uid = null;
      this.query.cn = null;
      this.getData();
    },
    getData() {
      this.$http
        .get("/ou/getPreservedUserList", {
          params: {
            domainId: this.$global.Tree.searchDomainId(
              this.treeData,
              this.domainId.split("-")[0],
              null
            ),
            ouCN: this.domainId.split("-")[0],
            uid: this.query.uid,
            cn: this.query.cn,
            mobile: this.query.mobile,
          },
        })
        .then((res) => {
          console.log(res);
          this.table = res.data;
        });
    },
    addOrUpdateUser(data) {
      this.addOrUpdateDisplay = true;
      let domainId = this.$global.Tree.searchDomainId(
        this.treeData,
        this.domainId.split("-")[0],
        null
      );
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data, this.domainId, domainId, 3);
      });
    },
    closeTemplate() {
      this.addOrUpdateDisplay = false;
      this.display = false;
      this.getData();
    },
    showDialog(data, type) {
      this.tableItem = data;
      this.tableItem._type = type;
      this.display = true;
    },
    deleteUser() {
      let domainId = this.$global.Tree.searchDomainId(
        this.treeData,
        this.domainId.split("-")[0],
        null
      );
      this.$http
        .get("/preserved_domainuser/delete", {
          params: {
            domainId: domainId,
            uid: this.tableItem.uid[0],
          },
        })
        .then(() => {
          this.$toast.add({
            severity: "info",
            summary: "删除成功！",
            life: 3000,
          });
          this.display = false;
        });
    },
    recoverUser() {
      let domainId = this.$global.Tree.searchDomainId(
        this.treeData,
        this.domainId.split("-")[0],
        null
      );
      this.$http
        .get("/preserved_domainuser/recover", {
          params: {
            domainId: domainId,
            uid: this.tableItem.uid[0],
          },
        })
        .then(() => {
          this.$toast.add({
            severity: "info",
            summary: "恢复成功！",
            life: 3000,
          });
          this.display = false;
        });
    },
  },
};
</script>

<style scoped>
.table-heard {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.query-form {
  width: 78%;
  display: flex;
  justify-content: space-between;
}

.query-form > div > .p-button {
  padding: 0.5rem;
}

.query-form-item {
  display: flex;
  flex-wrap: wrap;
  width: 70%;
}

.query-form-item div {
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.query-form div input {
  width: calc(100% - 90px);
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
  white-space: nowrap;
}

::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
  justify-content: center;
  white-space: nowrap;
}

::v-deep(.p-datatable-scrollable .p-datatable-tfoot > tr > td) {
  justify-content: center;
  white-space: nowrap;
}
</style>
