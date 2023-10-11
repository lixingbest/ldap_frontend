<template>

  <div style="height: 100%">
    <div v-if="tab===0" style="height:calc(100% - 31px);padding:1rem;">
      <data-table :value="tableData" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10"
                  :rowsPerPageOptions="[10, 20, 50,100]"
                  paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                  currentPageReportTemplate="共 {totalRecords} 条记录" style="overflow:auto">
        <template #empty>暂无数据</template>
        <column header="名称" field="name" style="min-width:10rem"></column>
        <column header="DN" field="dn" style="min-width:25rem"></column>
        <column header="地址" style="min-width:15rem">
          <template #body="row">
            {{ row.data.province }}{{ row.data.city }}{{ row.data.district }}{{ row.data.address }}
          </template>
        </column>
        <column header="是否启用" style="min-width:8rem">
          <template #body="row">
            <Tag :severity="row.data.enable==1?'danger':'success'" :value="row.data.enable==1?'禁用':'启用'"></Tag>
          </template>
        </column>
        <column :frozen="true" align-frozen="right" style="min-width: 15rem;" header="操作">
          <template #body="row">
            <Button :label="row.data.enable===1?'启用':'禁用'" :style="{color:row.data.enable===1?null:'red'}"
                    @click="changeOUStatus(row.data.refId,row.data.enable===1?0:1)" class="p-button-link"/>
            <Button label="移除" class="p-button-link" style="color:red" @click="removeOU"/>
          </template>
        </column>
      </data-table>
    </div>
    <div v-if="tab===1" style="height:calc(100% - 31px);padding:1rem;"></div>
    <div v-if="tab===2" style="height:calc(100% - 31px);padding:1rem;"></div>
    <div class="tabs">
      <span @click="tab=0" :class="{'active':tab===0}">按组织单位</span>
      <span @click="tab=1" :class="{'active':tab===1}">按域用户</span>
      <span @click="tab=2" :class="{'active':tab===2}">按终端</span>
    </div>
  </div>

</template>

<script>
import http from "@/http";
import {reactive, ref} from "vue";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";

export default {
  name: "use-manage",
  setup() {
    const toast = useToast();
    const confirm = useConfirm();
    const tableData = ref([]);
    const page = reactive({
      current: 1,
      size: 10,
      total: 0,
    });
    let strategyInfo;

    function init(strategyId) {
      strategyInfo = strategyId;
      if (strategyId) {
        getTableData();
      } else {
        tableData.value = [];
      }
    }

    function getTableData() {
      http
          .get("/strategy/settings/getAppliedOU", {
            params: {id: strategyInfo, current: page.current, size: page.size},
          })
          .then((res) => {
            tableData.value = res.data.records;
            page.total = res.data.total;
          });
    }

    function changePage(event) {
      page.current = event + 1;
      getTableData();
    }

    function changeOUStatus(refId, status) {
      confirm.require({
        message:
            "是否要在该组织机构上" +
            (status === 0 ? "启用" : "禁用") +
            "此策略？",
        header: status === 0 ? "启用" : "禁用",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          http
              .get("/strategy/settings/enable", {
                params: {
                  refId: refId,
                  enable: status,
                },
              })
              .then((res) => {
                if (res.success) {
                  toast.add({
                    severity: "info",
                    summary: "修改成功！",
                    life: 3000,
                  });
                  getTableData();
                }
              });
        },
        reject: () => {
          confirm.close();
        },
      });
    }

    function removeOU(refId) {
      confirm.require({
        message: "是否要在该组织机构上移除此策略？",
        header: "移除",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          http
              .get("/strategy/settings/removeAssignment", {
                params: {
                  id: refId,
                },
              })
              .then((res) => {
                if (res.success) {
                  toast.add({
                    severity: "info",
                    summary: "修改成功！",
                    life: 3000,
                  });
                  getTableData();
                }
              });
        },
        reject: () => {
          confirm.close();
        },
      });
    }

    let tab = ref(0);

    return {
      init,
      tableData,
      page,
      changePage,
      changeOUStatus,
      removeOU,
      tab
    };
  },
};
</script>

<style scoped lang="scss">
::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: center;
  white-space: nowrap;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > th) {
  text-align: center;
  white-space: nowrap;
}

.tabs {
  border-top: 1px solid #dee2e6;
  height: 30px;
  display: flex;

  .active {
    background: #dee2e6;
  }

  span {
    display: inline-block;;
    padding: 0 1rem;
    line-height: 30px;
    height: 30px;
    cursor: pointer;
    font-weight: bold;
  }
}
</style>
