<template>
  <div class="table-title">
    <div class="from">
      <div class="form-item p-mr-3">
        <label>主机名 ：</label>
        <InputText class="inout-t" @keyup.enter="getData" v-model.trim="query.fqdn"></InputText>
      </div>
      <Button @click="getData">查询</Button>
    </div>
  </div>
  <div id="controlDataTable" style="height:calc(100% - 20px);overflow:hidden">
    <DataTable style="margin-top: 10px;" :rowHover="true" :value="list" :scrollable="true" :scroll-height="scrollHeight" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
      paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
      <template #empty>
        <p style="text-align: center">暂无信息...</p>
      </template>
      <Column header="主机名">
        <template #body="a">
          <span v-tooltip.top="a.data.fqdn[0]" class="text-ellipsis" v-if="a.data.fqdn">
            {{ a.data.fqdn[0] }}
          </span>
        </template>
      </Column>
      <column header="是否入域">
        <template #body="row">
          <span :class="{'p-tag':true,'p-tag-success':row.data.has_keytab,'p-tag-danger':!row.data.has_keytab}">{{
              row.data.has_keytab ? '已入域' : '已退域'
            }}</span>
        </template>
      </column>
      <Column header="主机描述">
        <template #body="a">
          <span v-tooltip.top="a.data.description[0]" class="text-ellipsis" v-if="a.data.description">
            {{ a.data.description[0] }}
          </span>
        </template>
      </Column>
      <Column header="架构">
        <template #body="a">
          <span v-tooltip.top="a.data.nshardwareplatform[0]" class="text-ellipsis" v-if="a.data.nshardwareplatform">
            {{ a.data.nshardwareplatform[0] }}
          </span>
        </template>
      </Column>
      <Column header="操作系统">
        <template #body="a">
          <span v-tooltip.top="a.data.nsosversion[0]" class="text-ellipsis" v-if="a.data.nsosversion">
            {{ a.data.nsosversion[0] }}
          </span>
        </template>
      </Column>
      <column header="编辑">
        <template #body="row">
          <Button class="p-button-text" label="编辑" @click="addOrUpdate(row.data)" />
          <Button v-if="!row.data.has_keytab" class="p-button-text" style="color:red" @click="deleteById(row.data)">删除</Button>
        </template>
      </column>
    </DataTable>
  </div>
  <add-or-update-domain-controller ref="addOrUpdate" @close="closeDialog" v-if="addOrUpdatedDisplay"></add-or-update-domain-controller>
</template>

<script>
import AddOrUpdateDomainController from "@/views/modules/DomainManage/DomainManagePage/domain-controller/add-or-update";
export default {
  name: "DomainCon",
  components: { AddOrUpdateDomainController },
  emits: ["close"],
  data() {
    return {
      scrollHeight: "400px",
      type: null,
      list: [],
      addOrUpdatedDisplay: false,
      query: {
        fqdn: null,
      },
    };
  },
  props: ["domainId", "treeData"],
  watch: {
    domainId(val) {
      if (val.split("-")[1] == 0) {
        this.getData();
      }
    },
  },
  mounted() {
    const element = document.getElementById("controlDataTable");
    const clientHeight = element.clientHeight;
    this.scrollHeight = clientHeight - 28 - 30 + "px";

    window.onresize = () => {
      const clientHeight = element.clientHeight;
      this.scrollHeight = clientHeight - 28 - 30 + "px";
    };
    this.getData();
  },
  methods: {
    getData() {
      this.$http
        .get("/dc/list", {
          params: {
            fqdn: this.query.fqdn,
            domainId:
              this.domainId.split("-")[1] == 0
                ? this.domainId.split("-")[0]
                : this.$global.Tree.searchDomainId(
                    this.treeData,
                    this.domainId.split("-")[0],
                    null
                  ),
          },
        })
        .then((res) => {
          this.list = res.data;
          console.log(this.list);
        });
    },
    closeDialog() {
      this.addOrUpdatedDisplay = false;
      this.getData();
    },
    addOrUpdate(data) {
      this.addOrUpdatedDisplay = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(
          data,
          this.domainId.split("-")[1] == 0
            ? this.domainId.split("-")[0]
            : this.$global.Tree.searchDomainId(
                this.treeData,
                this.domainId.split("-")[0],
                null
              )
        );
      });
    },
    deleteById(data) {
      this.$confirm.require({
        message: "确定要删除此域控？",
        header: "删除",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          this.$http
            .get("/host/remove", {
              params: {
                domainId:
                  this.domainId.split("-")[1] == 0
                    ? this.domainId.split("-")[0]
                    : this.$global.Tree.searchDomainId(
                        this.treeData,
                        this.domainId.split("-")[0],
                        null
                      ),
                fqdn: data.fqdn[0],
              },
            })
            .then(() => {
              this.$toast.add({
                severity: "info",
                summary: "删除成功！",
                life: 3000,
              });
              this.getUsersImage();
            });
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
  },
};
</script>

<style scoped>
.table-title {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.from {
  display: flex;
}

.form-item {
  display: flex;
  align-items: center;
}

.inout-t {
  height: 29px;
  border: 1px solid #ced4da;
}

::v-deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  line-height: 27px;
}

::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  justify-content: center;
}
::v-deep(.p-datatable-thead > tr > th) {
  justify-content: center;
}
</style>
