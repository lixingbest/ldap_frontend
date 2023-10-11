<template>
  <div style="display:flex;height:100%">
    <div class="p-col-3" style="width:250px;border-right: 1px solid #dee2e6;border-right: 1px solid #dee2e6;height:100%;overflow:auto">
      <tree :value="tree" :expandedKeys="expandedKeys" selection-mode="single" v-model:selection-keys="selectionKeys" @node-select="selectedNode"></tree>
    </div>
    <div class="p-col-10" style="width:calc(100% - 250px);padding:1rem 0 0 1rem">
      <div class="table-title">
        <div style="width:35%;display:flex;">
          <Button label="添加用户" @click="showAddUserDialog" />
          <Button style="margin-left:1rem" :class="selectedDatas.length>0?'checken':'uncheck'" label="移除所选" @click="delCheckDatas" />
        </div>
        <div class="from">
          <div class="serch-input">
            <div class="form-item ">
              <label>登录名：</label>
              <InputText style="width:10rem" v-model="query.uid" class="inout-t" @keyup.enter="getTableData"></InputText>
            </div>
          </div>
          <div class="search-buttons" style="width:120px;display:flex;justify-content:flex-end">
            <!-- <Button :icon="open?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right" :label="open?'折叠':'展开'" class="p-button-link" @click="open=!open" /> -->
            <Button class="p-mr-1" @click="getTableData">查询</Button>
            <Button @click="clearQuery">清空</Button>
          </div>
        </div>
      </div>
      <div class="content" id="xrDataTable">
        <data-table :value="table" v-model:selection="selectedDatas" frozenWidth="160px" :rowHover="true" :scrollable="true" :scroll-height="scrollHeight" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录" style="width:100%;">
          <template #empty>
            暂无数据
          </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column header="登录名" style="min-width:8rem">
            <template #body="row">
              <span v-tooltip.top="row.data.userInfo?(row.data.userInfo.uid?row.data.userInfo.uid.toString():null):null" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">
                {{ row.data.userInfo?(row.data.userInfo.uid?row.data.userInfo.uid.toString():null):null }}
              </span>
            </template>
          </Column>
          <Column header="姓名" style="min-width:6rem">
            <template #body="row">
              <span v-tooltip.top="row.data.userInfo?(row.data.userInfo.cn?row.data.userInfo.cn.toString():null):null"
                style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ row.data.userInfo?(row.data.userInfo.cn?row.data.userInfo.cn.toString():null):null }}</span>
            </template>
          </Column>
          <Column header="工号" style="min-width:8rem">
            <template #body="row">
              <span v-tooltip.top="row.data.userInfo?(row.data.userInfo.employeenumber?row.data.userInfo.employeenumber.toString():null):null"
                style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ row.data.userInfo?(row.data.userInfo.employeenumber?row.data.userInfo.employeenumber.toString():null):null }}</span>
            </template>
          </Column>
          <!-- <Column header="状态" style="min-width:5rem">
            <template #body="row">
              <span :class="['p-tag',row.data.userInfo?(row.data.userInfo.nsaccountlock?'p-tag-danger':'p-tag-success'):null]">
                {{ row.data.userInfo?(row.data.userInfo.nsaccountlock ? '禁用' : '启用' ):null}}</span>
            </template>
          </Column> -->
          <Column header="职称" style="min-width:6rem">
            <template #body="row">
              <span v-tooltip.top="row.data.userInfo?(row.data.userInfo.title?row.data.userInfo.title.map((curr) => JSON.parse(curr).title).toString():null):null"
                style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ row.data.userInfo?(row.data.userInfo.title?row.data.userInfo.title.map((curr) => JSON.parse(curr).title).toString():null):null }}</span>
            </template>
          </Column>
          <Column header="职位" style="min-width:6rem">
            <template #body="row">
              <span v-tooltip.top="row.data.userInfo?(row.data.userInfo.title?row.data.userInfo.title.map((curr) => JSON.parse(curr).job).toString():null):null"
                style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ row.data.userInfo?(row.data.userInfo.title?row.data.userInfo.title.map((curr) => JSON.parse(curr).job).toString():null):null }}</span>
            </template>
          </Column>

          <Column header="固定电话" style="min-width:8rem">
            <template #body="row">
              <span v-tooltip.top="row.data.userInfo?(row.data.userInfo.telephonenumber?row.data.userInfo.telephonenumber.toString():null):null"
                style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ row.data.userInfo?(row.data.userInfo.telephonenumber?row.data.userInfo.telephonenumber.toString():null):null }}</span>
            </template>
          </Column>
          <Column header="手机号码" style="min-width:8rem">
            <template #body="row">
              <span v-tooltip.top="row.data.userInfo?(row.data.userInfo.mobile?row.data.userInfo.mobile.toString():null):null" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">
                {{ row.data.userInfo?(row.data.userInfo.mobile?row.data.userInfo.mobile.toString():null):null }}</span>
            </template>
          </Column>
          <column header="所信任的域" field="targetDomainName" style="min-width:10rem">
            <template #body="row">
              <span v-tooltip.top="row.data?(row.data.targetDomainName):null" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"> {{ row.data?(row.data.targetDomainName):null }}</span>
            </template>
          </column>
          <column header="组织机构" field="ouName" style="min-width:8rem">
            <template #body="row">
              <span v-tooltip.top="row.data?(row.data.ouName):null" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"> {{ row.data?(row.data.ouName):null }}</span>
            </template>
          </column>
          <column header="生效时间" style="min-width:10rem">
            <template #body="row">
              <span v-tooltip.top="dateUtil.getFormatDate(row.data.beginTime)" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"> {{ dateUtil.getFormatDate(row.data.beginTime) }}</span>
            </template>
          </column>
          <column header="截至时间" style="min-width:10rem">
            <template #body="row">
              <span v-tooltip.top="dateUtil.getFormatDate(row.data.endTime)" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ dateUtil.getFormatDate(row.data.endTime) }}</span>
            </template>
          </column>
          <column header="是否启用" style="min-width:6rem">
            <template #body="row">
              <span style="width:100%;text-align:center" :class="['p-tag', row.data.enable===0?'p-tag-success':'p-tag-danger']">{{
                row.data.enable === 0 ? '启用' : '禁用'
              }}</span>
            </template>
          </column>
          <column header="申请事由" field="reason" style="min-width:10rem">
            <template #body="row">
              <span v-tooltip.top="row.data.reason" style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ row.data.reason }}</span>
            </template>
          </column>
          <column frozen="true" header="操作" style="min-width:12rem" align-frozen="right">
            <template #body="row">
              <Button style="width:50%;text-align:center" label="移除" @click="deleteUser(row.data)" class="p-button-link" />
              <Button style="width:50%;text-align:center" :label="row.data.enable===0?'禁用':'启用'" @click="isEnable(row.data)" class="p-button-link" />
            </template>
          </column>
        </data-table>
      </div>
      <Dialog v-model:visible="display" :modal="true" @hide="closeTemplate()" :header="isDel?'移除用户':(delData?.enable===0?'禁用':'启用'+'用户')">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
          <span v-if="isDel"> 您确认要移除所选用户吗？</span>
          <span v-else> {{'您确认要'+(delData && delData.enable===0?'禁用':'启用')+'所选用户吗？'}}</span>
        </div>
        <template #footer>
          <Button label="是" icon="pi pi-check" @click="deleteTableData(delData)" class="p-button-link" />
          <Button label="否" icon="pi pi-times" @click="closeTemplate()" class="p-button-secondary p-button-link" />
        </template>
      </Dialog>
      <add-user-dialog ref="addUserDialogInst" v-if="addUserDialogDisplay" @close="addUserDialogDisplay=false" @fun="fun"></add-user-dialog>
    </div>
  </div>
</template>

<script>
import {
  onMounted,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  getCurrentInstance,
} from "vue";
import global from "@/global";
import http from "@/http";
// import AddUser from "@/views/modules/DomainManage/DomainManagePage/UserGroup/AddUser";
import AddUserDialog from "@/views/modules/DomainManage/DomainManagePage/KuaYuXinRen/AddUserDialog";

export default {
  name: "IndexPage",
  components: { AddUserDialog },
  props: {
    domainId: {
      type: String,
    },
    treeData: {
      type: Object,
    },
    updateFlag: {
      type: Number,
    },
  },
  setup(props) {
    const scrollHeight = ref("400px");
    onMounted(() => {
      const element = document.getElementById("xrDataTable");
      const clientHeight = element.clientHeight;
      scrollHeight.value = clientHeight - 28 - 15 + "px";

      window.onresize = () => {
        this.open=false
        const clientHeight = element.clientHeight;
        scrollHeight.value = clientHeight - 28 - 15 + "px";
      };
    });
    const expandedKeys = ref({
      "1-0": true,
    });
    const selectedDatas = ref([]);
    const { proxy } = getCurrentInstance();
    const page = ref({
      current: 1,
      size: 10,
      total: 0,
    });
    const isDel = ref(false);
    const query = ref({
      uid: null,
    });
    const tree = ref([]);
    const treeOfAdd = ref([]);
    const selectionKeys = ref({});

    const dateUtil = global.Util;

    const treeList = ref([]);
    const domainId = ref(null);
    const unwatch = watch(
      props,
      (data) => {
        if (data && data.treeData) {
          treeList.value = props.treeData;
          domainId.value = props.domainId;
          const nodes = filterNodes(data.domainId, data.treeData);
          getTree(nodes);
        }
      },
      { deep: true, immediate: true }
    );

    onBeforeUnmount(() => {
      unwatch();
    });

    function filterNodes(key, treeList) {
      let keyAndChildrenMap = {};

      function getKeyAndChildrenMap() {
        for (let item of treeList) {
          if (keyAndChildrenMap.hasOwnProperty(item.pid)) {
            keyAndChildrenMap[item.pid].push(item);
          } else {
            let list = [];
            list.push(item);
            keyAndChildrenMap[item.pid] = list;
          }
        }
      }

      getKeyAndChildrenMap();

      let KeyChildrenIdSet = [];
      KeyChildrenIdSet.push(key);

      function findKeyChildrenIds(id) {
        if (keyAndChildrenMap.hasOwnProperty(id)) {
          for (let item of keyAndChildrenMap[id]) {
            if (!KeyChildrenIdSet.includes(item.id)) {
              KeyChildrenIdSet.push(item.id);
              findKeyChildrenIds(item.id);
            }
          }
        }
      }

      findKeyChildrenIds(key);
      return treeList.filter((item) => !KeyChildrenIdSet.includes(item.id));
    }

    function getTree(nodes) {
      let list = [];
      nodes.forEach((item) => {
        if (item.type != 2) {
          list.push(item);
        }
      });
      treeOfAdd.value = global.Tree.makeTree(list, true);
      tree.value = global.Tree.makeTree(list, true);
      if (Object.keys(selectionKeys.value).length === 0) {
        for (let item of list) {
          // pid为空是根
          if (item.pid == null) {
            // 默认选择根节点
            selectionKeys.value[item.id] = true;
          }
        }
      }
    }

    let params = {
      targetDomainId: null,
      srcDomainId: null,
      ouId: null,
    };

    const table = ref(null);

    function selectedNode(node) {
      params.srcDomainId = domainId.value.split("-")[0];
      if (node.key.includes("-0")) {
        params.targetDomainId = node.key.split("-")[0];
        params.ouId = null;
      } else if (node.key.includes("-1")) {
        params.targetDomainId = findDomainByOuId(node.key);
        params.ouId = node.key.split("-")[0];
      }
      getTableData();
    }

    function findDomainByOuId(OUId) {
      let treeMap = {};

      function getTreeMap() {
        for (let item of treeList.value) {
          treeMap[item.id] = item;
        }
      }

      getTreeMap();

      let domainId = null;

      function findDomainId(id) {
        if (treeMap.hasOwnProperty(id)) {
          if (treeMap[id].pid.includes("-0")) {
            domainId = treeMap[id].pid.split("-")[0];
          } else {
            findDomainId(treeMap[id].pid);
          }
        }
      }
      findDomainId(OUId);
      return domainId;
    }
    function getTableData() {
      if (query.value.uid != null && query.value.uid.length == 0) {
        query.value.uid = null;
      }
      let data = {
        uid: query.value.uid,
        ...params,
      };
      http.get("/cross_trust/getTrustUsers", { params: data }).then((res) => {
        if (res.success) {
          table.value = res.data;
        }
      });
    }

    const addUserDialogInst = ref(null);
    const addUserDialogDisplay = ref(false);

    function showAddUserDialog() {
      addUserDialogDisplay.value = true;
      nextTick(() => {
        addUserDialogInst.value.init(
          treeOfAdd.value,
          treeList.value,
          props.domainId
        );
      });
    }
    function clearQuery() {
      query.value.mobile = null;
      query.value.uid = null;
      query.value.name = null;
      getTableData();
    }
    const delData = ref();
    const display = ref(false);
    function deleteUser(data) {
      selectedDatas.value = [];
      isDel.value = true;
      delData.value = data;
      display.value = true;
    }

    function deleteTableData(data) {
      if (isDel.value) {
        let ids = "";
        if (selectedDatas.value.length > 0) {
          selectedDatas.value.forEach((item) => {
            ids = ids + item.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
        } else {
          ids = data.id;
        }
        http.delete("/cross_trust/remove?ids=" + ids).then((res) => {
          if (res.success) {
            display.value = false;
            proxy.$toast.add({
              severity: "info",
              summary: "移除成功！",
              life: 3000,
            });
            selectedDatas.value = [];
            getTableData();
          }
        });
      } else {
        http
          .get("/cross_trust/enable", {
            params: {
              id: data.id,
              enable: data.enable === 0 ? "1" : "0",
            },
          })
          .then((res) => {
            if (res.success) {
              display.value = false;
              getTableData();
            } else {
              proxy.$toast.add({
                severity: "error",
                summary: res.message,
                life: 3000,
              });
            }
          });
      }
    }
    function closeTemplate() {
      display.value = false;
    }
    function delCheckDatas() {
      isDel.value = true;
      display.value = true;
    }
    function fun() {
      getTableData();
    }
    function isEnable(data) {
      isDel.value = false;
      delData.value = data;
      console.log(delData.value);
      display.value = true;
    }
    function changePage() {
      getTableData();
    }
    return {
      fun,
      delCheckDatas,
      selectedDatas,
      tree,
      selectionKeys,
      selectedNode,
      table,
      dateUtil,
      addUserDialogDisplay,
      addUserDialogInst,
      showAddUserDialog,
      query,
      isDel,
      clearQuery,
      getTableData,
      page,
      deleteUser,
      display,
      closeTemplate,
      deleteTableData,
      delData,
      expandedKeys,
      isEnable,
      changePage,
      scrollHeight,
    };
  },
};
</script>

<style scoped>
.table-title {
  margin: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.from {
  display: flex;
  width: 65%;
  justify-content: flex-end;
}

/* @media only screen and (min-width: 1210px) {
  .serch-input {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
  }

  .form-item {
    display: flex;
    align-items: center;
    width: 70%;
    margin-bottom: 1rem;
  }
}

@media only screen and (min-width: 940px) {
  .serch-input {
    display: flex;
    flex-wrap: wrap;
    width: 55%;
  }

  .form-item {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
  }
} */

/* @media only screen and (min-width: 1335px) { */
.serch-input {
  display: flex;
  flex-wrap: wrap;
  width: 200px;
}

.form-item {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}
/* } */

.form-item label {
  width: 90px;
  text-align: right;
}

.form-item input {
  width: calc(100% - 100px);
}
.search-buttons > .p-button {
  padding: 0.5rem;
}

.content {
  width: 100%;
  height: calc(100% - 58px);
  overflow: hidden;
  /* display: flex; */
}
.checked {
  background: #113066;
  border: 1px solid #113066;
}
.checked:hover {
  background: #113066;
  border: 1px solid #113066;
}
.uncheck {
  background: gray;
  border: 1px solid gray;
  pointer-events: none;
}

.uncheck:hover {
  background: gray;
  border: 1px solid gray;
}
::v-deep(.p-tree) {
  padding: 0;
  height: calc(100% - 60px);
  overflow-y: auto;
}
::v-deep(.p-treenode-label) {
  padding: 0.5rem;
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
  /* white-space: nowrap; */
}

::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
  /* white-space: nowrap; */
  text-align: center;
}
</style>
