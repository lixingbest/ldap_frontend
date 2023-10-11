<template>
  <Sidebar position="right" :showCloseIcon="false" style="width: 50vw;" v-model:visible="display" @hide="$emit('close')">
    <template #header>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <strong>添加用户</strong>
      </div>
    </template>
    <!-- <Dialog v-model:visible="display" header="添加用户" :modal="true" style="width:50vw" @hide="$emit('close')"> -->
    <div class="from">
      <div class="serch-input">
        <div class="form-item" style="position:relative" :style="submitted &&v$.beginTime.required.$invalid?'margin-bottom:1rem':'0'">
          <label><i class="required">*</i>生效时间：</label>
          <Calendar inputId="basic" dateFormat="yy/mm/dd" autocomplete="off" :minDate="new Date()" :class="{'p-invalid':submitted &&v$.beginTime.$invalid}" v-model.trim="form.beginTime" />
          <small style="position:absolute;top:2rem;left:90px" class="p-error" v-if="submitted &&v$.beginTime.required.$invalid">请选择生效时间</small>
        </div>
        <div class="form-item" style="position:relative" :style="submitted &&v$.endTime.required.$invalid?'margin-bottom:1rem':'0'">
          <label><i class="required">*</i>截止时间：</label>
          <Calendar inputId="basic" dateFormat="yy/mm/dd" autocomplete="off" :minDate="form.beginTime" :class="{'p-invalid':submitted &&v$.endTime.$invalid}" v-model.trim="form.endTime" />
          <small style="position:absolute;top:2rem;left:90px" class="p-error" v-if="submitted && v$.endTime.required.$invalid">请选择截止时间</small>
        </div>
        <p class="p-text-secondary p-mt-2" style="margin-left: 90px">系统将根据生效时段自动设置域用户的跨域信任可用性。</p>
      </div>
      <div style="display:flex;align-items:center;margin-bottom:1rem">
        <label><i class="required">*</i>是否启用：</label>
        <InputSwitch v-model="form.enable" />
      </div>
      <div class="serch-input" :style="submitted &&v$.reason.required.$invalid?'margin-bottom:1rem':'0'">
        <label><i class="required">*</i>申请事由：</label>
        <Textarea class="inout-t" style="width:calc(100% - 90px)" :class="{'p-invalid':submitted &&v$.reason.$invalid}" v-model.trim="form.reason"></Textarea>
        <small style="margin-left:90px" class="p-error" v-if="submitted && v$.reason.required.$invalid">请填写申请事由</small>
      </div>
      <!-- <div class="search-buttons">
        <Button :icon="open?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right" :label="open?'折叠':'展开'" class="p-button-link" @click="open=!open" />
        <Button class="p-mr-1" @click="getTableData">查询</Button>
        <Button @click="clearForm">清空</Button>
      </div> -->
    </div>
    <div style="display:flex">
      <div style="flex:1;border-right: 1px solid #dee2e6">
        <tree style="border-width: 0;" :value="tree" selection-mode="single" :expanded-keys="expandedKeys" v-model:selection-keys="selectionKeys" @node-select="selectedNode"></tree>
      </div>
      <div style="flex:2;overflow-x:auto;margin-left:10px">
        <data-table :value="table" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录" v-model:selection="selectedTable">
          <template #empty>暂无数据</template>
          <column selectionMode="multiple" style="max-width: 3rem"></column>
          <Column header="登录名">
            <template #body="row">
              {{ row.data.uid?.toString() }}
            </template>
          </Column>
          <Column header="姓名">
            <template #body="row">
              {{ row.data.cn?.toString() }}
            </template>
          </Column>
          <Column header="工号">
            <template #body="row">
              {{ row.data.employeenumber?.toString() }}
            </template>
          </Column>
          <Column header="状态">
            <template #body="row">
              <span :class="['p-tag',row.data.nsaccountlock?'p-tag-danger':'p-tag-success']">
                {{ row.data.nsaccountlock ? '禁用' : '启用' }}</span>
            </template>
          </Column>
          <Column header="职称">
            <template #body="row">
              {{ row.data.title?.map((curr) => JSON.parse(curr).title).toString() }}
            </template>
          </Column>
          <Column header="职位">
            <template #body="row">
              {{ row.data.title?.map((curr) => JSON.parse(curr).job).toString() }}
            </template>
          </Column>

          <Column header="固定电话">
            <template #body="row">
              {{ row.data.telephonenumber?.toString() }}
            </template>
          </Column>
          <Column header="手机号码">
            <template #body="row">
              {{ row.data.mobile?.toString() }}
            </template>
          </Column>
        </data-table>
        <span v-if="showNoData" style="color:red">注意：请至少选择一位用户</span>
      </div>
    </div>
    <Dialog v-model:visible="showDisplay" :modal="true" @hide="closeTemplate()" header="添加用户">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span> 您确认添加该用户吗？</span>
      </div>
      <template #footer>
        <Button label="是" icon="pi pi-check" @click="save(delData)" class="p-button-link" />
        <Button label="否" icon="pi pi-times" @click="closeTemplate()" class="p-button-secondary p-button-link" />
      </template>
    </Dialog>
    <div style="position:fixed;bottom:1rem;right:1rem">
      <Button label="添加" @click="submit" />
    </div>
  </Sidebar>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import http from "@/http";
import global from "@/global";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
export default {
  name: "AddUserDialog",
  setup() {
    const submitted = ref(false);
    const display = ref(false);
    const form = ref({
      beginTime: null,
      endTime: null,
      enable: true,
      reason: null,
    });
    // const form = reactive({
    //   beginTime: null,
    //   endTime: null,
    //   enable: true,
    //   reason: null,
    // });
    const tree = ref([]);
    const selectionKeys = ref({});

    let treeList;
    const expandedKeys = ref({});
    const selectedTable = ref([]);
    let srcDomainId;
    function init(treeData, treeList1, domainId) {
      srcDomainId = domainId.split("-")[0];
      display.value = true;
      tree.value = treeData;
      treeList = treeList1;
      selectionKeys.value[treeData[0].key] = true;
      expandedKeys.value[treeData[0].key] = true;
    }
    const table = ref([]);
    let ouId;
    let targetDomainId;
    function selectedNode(node) {
      if (node.key.includes("-1") && node.type == 1) {
        getData(node.key.split("-")[0]);
        ouId = node.key.split("-")[0];
        targetDomainId = global.Tree.searchDomainId(treeList, ouId, null);
      } else {
        table.value = [];
      }
    }

    // const query = reactive({
    //   uid: null,
    //   name: null,
    //   cn: null,
    // });

    function getData(ou) {
      http
        .get("/ou/getActiveUserList", {
          params: {
            ouCN: ou,
            domainId: global.Tree.searchDomainId(treeList, ou, null),
            // uid: query.uid,
            // mobile: query.mobile,
            // cn: query.name,
          },
        })
        .then((res) => {
          table.value = res.data;
        });
    }
    const showDisplay = ref(false);

    const rules = {
      beginTime: { required },
      endTime: { required },
      reason: { required },
    };

    const v$ = useVuelidate(rules, form);

    let { proxy } = getCurrentInstance();

    const showNoData = ref(false);

    function submit() {
      if (selectedTable.value.length == 0) {
        showNoData.value = true;
      } else {
        showNoData.value = false;
      }
      submitted.value = true;

      if (!v$.value.$invalid && !showNoData.value) {
        showDisplay.value = true;
      }
    }
    function closeTemplate() {
      showDisplay.value = false;
    }
    function save() {
      let data = [];
      selectedTable.value.forEach((item, index) => {
        data.push({
          beginTime: form.value.beginTime,
          endTime: form.value.endTime,
          enable: form.value.enable ? 0 : 1,
          reason: form.value.reason,
          uid: selectedTable.value[index].uid[0],
          ouId: ouId,
          targetDomainId: targetDomainId,
          srcDomainId: srcDomainId,
        });
      });
      http.post("/cross_trust/saveOrUpdate", data).then((res) => {
        if (res.success) {
          proxy.$emit("fun");
          proxy.$toast.add({
            severity: "info",
            summary: "添加成功！ ",
            life: 3000,
          });
          display.value = false;
        }
      });
    }

    return {
      display,
      init,
      tree,
      selectedNode,
      selectionKeys,
      table,
      expandedKeys,
      selectedTable,
      save,
      form,
      submitted,
      v$,
      showNoData,
      showDisplay,
      submit,
      closeTemplate,
    };
  },
};
</script>

<style scoped>
.from {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  padding-top: 0.5rem;
}

/* @media only screen and (min-width: 1210px) { */
.serch-input {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 1rem;
  justify-content: space-between;
}

.form-item {
  display: flex;
  align-items: center;
  width: 50%;
}
/* } */

/* @media only screen and (min-width: 940px) {
  .serch-input {
    display: flex;
    flex-wrap: wrap;
    width: 60%;
  }

  .form-item {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
  }
}

@media only screen and (min-width: 1335px) {
  .serch-input {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
  }

  .form-item {
    display: flex;
    align-items: center;
    width: 50%;
    margin-bottom: 1rem;
  }
} */

label {
  width: 90px;
  text-align: left;
}
.form-item {
  margin-top: 1rem;
}
.form-item input {
  width: calc(100% - 100px);
}
::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  width: 10rem;
  /* justify-content: center; */
}

::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
  text-align: center;
  /* justify-content: center; */
}
::v-deep(.p-tree-wrapper) {
  white-space: nowrap;
}
/* ::v-deep(.p-dialog-content) {
  overflow-y: auto;
  overflow-x: hidden;
} */
::v-deep(.p-tree) {
  padding: 0;
  height: 100%;
  overflow-y: auto;
}
/* ::v-deep(.p-dialog .p-dialog-footer) {
  padding: 1rem !important;
} */
::v-deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: #113066;
}
</style>