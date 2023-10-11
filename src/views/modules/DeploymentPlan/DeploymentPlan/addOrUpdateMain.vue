<template>
  <Sidebar v-model:visible="display" position="right" @hide="$emit('close')" style="width:65vw" :modal="true">
    <template #header>
      <strong>
        {{ data.id ? '编辑部署计划' : '新增部署计划' }}
      </strong>
    </template>
    <div class="form">
      <div class="form-item">
        <label><i class="required">*</i>计划名称：</label>
        <div class="p-col">
          <InputText class="p-col-12" placeholder="请输入计划名称"
                     :class="{'p-invalid':submitted &&v$.name.$invalid}" v-model="data.name"/>
          <small class="p-error" v-if="submitted && v$.name.required.$invalid">请输入计划名称</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>计划编号：</label>
        <div class="p-col">
          <InputText class="p-col-12" placeholder="请输入计划编号"
                     :class="{'p-invalid':submitted &&v$.code.$invalid}" v-model="data.code"/>
          <small class="p-error" v-if="submitted && v$.code.required.$invalid">请输入计划编号</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>所属分类：</label>
        <div class="p-col">
          <tree-select class="p-col-12" placeholder="请选择所属分类"
                       :class="{'p-invalid':submitted &&v$.typeId.$invalid}" :options="typeTree"
                       v-model="typeKey"/>
          <small class="p-error" v-if="submitted && v$.typeId.required.$invalid">请选择类型</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>执行的脚本：</label>
        <div class="p-col">
          <Button label="从模板选择" class="p-button-sm p-mb-2" @click="showSelectTemp"/>
          <Textarea class="p-col-12" placeholder="请输入要执行的脚本" auto-resize
                    :class="{'p-invalid':submitted &&v$.shell.$invalid}" v-model="data.shell"/>

          <Dialog header="选择模板" v-model:visible="checkedTempDisplay" style="width:70vw" ref="selectTemp"
                  @hide="closeSelectTemp">

            <div class="p-d-flex">
              <tree :value="tempTreeData" :expanded-keys="tempExpandedKeys"
                    style="border-right: none;width:20%;"
                    selection-mode="single" v-model:selection-keys="tempsSelectedKeys"></tree>
              <div style="width:80%;">
                <data-table class="p-datatable-gridlines" :value="tempTableData" :rowHover="true"
                            :scrollable="true"
                            scroll-height="400px">
                  <template #empty> 暂无数据</template>
                  <template #header>
                    <div class="p-input-icon-right">
                      <i class="pi pi-search" @click="getTempTableData"></i>
                      <InputText v-model="tempQuery.name"
                                 placeholder="请输入模板名称"
                                 @keydown.enter="getTempTableData"></InputText>
                    </div>
                  </template>
                  <Column style="text-align:center;min-width: 6rem;" field="code" header="编号"></Column>
                  <Column style="text-align:center;min-width: 6rem;" field="name"
                          header="模板名称"></Column>
                  <Column style="text-align:center;min-width: 6rem;" field="comments"
                          header="备注"></Column>
                  <column header="操作">
                    <template #body="row">
                      <Button label="选择" class="p-button-link" @click="selectedTemp(row.data)"/>
                    </template>
                  </column>
                </data-table>
                <Paginator style="width:100%;text-align:center" :rows="tempPage.size" :totalRecords="tempPage.total"
                           @page="changetempPage"
                           template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                           :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
                </Paginator>
              </div>
            </div>
          </Dialog>
          <small class="p-error" v-if="submitted && v$.shell.required.$invalid">请输入脚本</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>执行的终端：</label>
        <div class="p-col" style="display:flex;">
          <tree
              style="max-width:25%;padding:.5rem 1rem;border-right:none;border-top-right-radius: 0;border-bottom-right-radius: 0"
              selection-mode="single" :value="terminalTypeTree"
              v-model:selection-keys="terminalTypeTreeKey">
            <template #default="row">
              <span v-tooltip.top="row.node.label">{{ row.node.label }}</span>
            </template>
          </tree>
          <data-table style="flex:1" class="p-datatable-gridlines" :value="selectedTerminalTable"
                      :class="{'p-invalid':submitted &&v$.terminalSize.$invalid}" :rowHover="true"
                      :scrollable="true" scroll-height="400px"
                      paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                      paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                      currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #header>
              <Button icon="pi pi-plus" label="添加终端"
                      @click="(event)=>$refs.selectTerminal.show(event)" class="p-button-sm"></Button>
            </template>
            <template #empty>
              <div class="p-text-center">暂无数据</div>
            </template>
            <column header="主机名" field="hostname"></column>
            <column header="IP地址" field="ipv4"></column>
            <column header="超级用户名" field="account"></column>
            <column header="操作">
              <template #body="row">
                <Button label="移除" @click="removeTerminal(row.data.id)" style="color:red"
                        icon="pi pi-trash" class="p-button-link"/>
              </template>
            </column>
          </data-table>
          <small class="p-error" v-if="submitted && v$.terminalSize.minValue.$invalid">请选择终端</small>
          <!--选择终端-->
          <overlay-panel ref="selectTerminal" :dismissable="false" show-close-icon="true"
                         style="max-width:50vw">

            <div style="display:flex;justify-content: space-between;margin-bottom: .5rem">
              <div>
                <span>类型：</span>
                <tree-select placeholder="请选择终端类型" :options="terminalTypeTree"
                             v-model="terminalTypeTreeKey"/>
              </div>
              <div class="p-input-icon-right">
                <i class="pi pi-search"></i>
                <InputText style="line-height: 33px" placeholder="请输入关键字检索"
                           @keydown.enter="getTerminalTable" v-model="search.param"/>
              </div>
            </div>

            <data-table :value="terminalTable" class="p-datatable-gridlines" style="width:45vw"
                        v-model:selection="terminalList" data-key="id" :rowHover="true" :scrollable="true"
                        scroll-height="400px" paginator
                        :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                        currentPageReportTemplate="共 {totalRecords} 条记录">
              <template #empty>
                <div class="p-text-center">暂无数据</div>
              </template>
              <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
              <column header="主机名" field="hostname"></column>
              <column header="ip" field="ipv4"></column>
              <column header="端口号" field="sshPort"/>
              <column header="超级用户名" field="account"></column>
              <column header="说明" field="comments"></column>
            </data-table>
            <div class="p-text-right p-mt-3">
              <Button label="保存" icon="pi pi-save" @click="hideSelect"/>
            </div>
          </overlay-panel>
        </div>
      </div>
      <div class="form-item">
        <label>备注：</label>
        <div class="p-col">
          <Textarea placeholder="请输入..." auto-resize class="p-col-12" v-model="data.comments"/>
        </div>
      </div>
      <div class="form-item" style="display:flex;justify-content: flex-end;padding:.5rem;">
        <overlay-panel ref="oa">
          <div class="p-d-flex p-ai-center">
            <label style="min-width: 80px">间隔时间：</label>
            <div class="p-col">
              <InputNumber min="0" v-model="cycleTime" suffix=" 分钟"></InputNumber>
            </div>
          </div>
          <div class="p-d-flex p-ai-center">
            <label style="min-width: 80px">次数：</label>
            <div class="p-col">
              <InputNumber min="0" v-model="execNum" suffix=" 次"></InputNumber>
            </div>
          </div>
          <div class="p-d-flex p-justify-end p-mt-3">
            <Button :class="{'p-disabled':cycleTime===0 || execNum===0}" @click="submit(2)">确定</Button>
          </div>
        </overlay-panel>
        <Button @click="toggleOA" class="p-mr-3">周期性执行</Button>
        <overlay-panel ref="ob">
          <div class="p-d-flex p-ai-center">
            <label style="min-width: 0">时间：</label>
            <div class="p-col">
              <Calendar dateFormat="yy-dd-mm" showTime hourFormat="24" v-model="regularTime"></Calendar>
            </div>
          </div>
          <div class="p-d-flex p-justify-end p-mt-3">
            <Button :class="{'p-disabled':regularTime==null}" @click="submit(1)">确定</Button>
          </div>
        </overlay-panel>
        <Button @click="toggleOB" class="p-mr-3">定时任务</Button>
        <Button label="立即执行" class="p-mr-3" @click="submit(0)"/>
        <Button label="取消" @click="display=false" class="p-button-outlined"/>
      </div>
    </div>

  </Sidebar>
</template>

<script>
import {ref, reactive, watch, getCurrentInstance} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required, minValue, requiredIf} from "@vuelidate/validators";
import http from "../../../../http";
import {format} from '@/utils/time'

export default {
  name: "addOrUpdateMain",
  setup() {
    const display = ref(false);
    const init = (e) => {
      display.value = true;
      data.typeId = e.typeId;
      typeKey.value[e.typeId] = true;
    };
    const data = reactive({
      id: null,
      name: null,
      code: null,
      typeId: null,
      shell: null,
      userId: null,
      time: null,
      comments: null,
      details: null,
      terminalSize: 0,
      execExpr: null,
      execType: null
    });

    const rules = {
      name: {required},
      code: {required},
      typeId: {required},
      userId: {required},
      shell: {required},
      terminalSize: {minValue: minValue(1)},
    };
    const submitted = ref(false);
    const v$ = useVuelidate(rules, data);

    const selectTerminal = ref(null);

    const terminalList = ref([]);

    const terminalTypeTree = ref([]);
    const terminalTypeTreeKey = ref({});
    const getTerminalTypeTree = () => {
      http.get("/terminal/getTypeTree").then((res) => {
        terminalTypeTree.value = res.data;
        terminalTypeTreeKey.value[res.data[0].key] = true;
      });
    };
    getTerminalTypeTree();
    const terminalTable = ref([]);
    const page = reactive({
      current: 1,
      size: 10,
      total: 0,
    });
    watch(
        terminalTypeTreeKey,
        () => {
          getTerminalTable();
        },
        {deep: true}
    );
    const search = reactive({param: null});

    const getTerminalTable = () => {
      http
          .get("/terminal/getList", {
            params: {
              typeId: Object.keys(terminalTypeTreeKey.value)[0],
              param: search.param,
            },
          })
          .then((res) => {
            if (res["success"]) {
              let selectedTerId = [];
              terminalList.value.forEach((item) => {
                selectedTerId.push(item.id);
              });

              terminalTable.value = res.data.filter(
                  (item) => !selectedTerId.includes(item.id)
              );

              let idList = [];
              res.data.forEach((item) => {
                idList.push(item.id);
              });

              selectedTerminalTable.value = terminalList.value.filter((item) =>
                  idList.includes(item.id)
              );
            }
          });
    };
    const hideSelect = () => {
      selectTerminal.value.hide();
      getTerminalTable();
    };
    const changePage = (e) => {
      page.current = e.page + 1;
      getTerminalTable();
    };

    const changetempPage = (e) => {
      tempPage.current = e.page + 1
      getTempTableData()
    }

    watch(terminalList, (e) => {
      data.terminalSize = e.length;
    });
    const selectedTerminalTable = ref([]);

    const removeTerminal = (id) => {
      terminalList.value = terminalList.value.filter((item) => item.id !== id);
    };

    const typeTree = ref([]);

    const typeKey = ref({});
    watch(
        typeKey,
        (event) => {
          data.typeId = Object.keys(event)[0];
        },
        {deep: true}
    );

    const getTreeData = () => {
      http.get("/deploy/typeTree").then((res) => {
        typeTree.value = res.data;
      });
    };

    getTreeData();

    const {proxy} = getCurrentInstance();

    const submit = (execType) => {

      data.execType = execType;

      if (execType === 1) {
        data.execExpr = format(regularTime.value)

      } else if (execType === 2) {
        data.execExpr = cycleTime.value + '/' + execNum.value;
      }


      submitted.value = true;
      data.userId = JSON.parse(localStorage.getItem("userInfo")).id;

      console.log(!v$.value)

      if (!v$.value.$invalid) {
        data.details = [];
        for (let item of terminalList.value) {
          data.details.push({
            terminalId: item.id,
          });
        }

        http.post("/deploy/addOrUpdateMain", data).then((res) => {
          if (res["success"]) {
            proxy.$toast.add({
              severity: "info",
              summary: "保存成功！ ",
              life: 3000,
            });
            display.value = false;
          }
        });
      }
    };

    //脚本模板相关
    const selectTemp = ref(null);

    function showSelectTemp() {
      // selectTemp.value.show(event);
      checkedTempDisplay.value = true
      getTempTreeData();
    }

    const tempTreeData = ref([]);
    const tempExpandedKeys = ref({});
    const tempsSelectedKeys = ref({});
    const getTempTreeData = () => {
      http.get("/shellTemp/getTree").then((res) => {
        tempTreeData.value = res.data;
        tempExpandedKeys.value = {};
        tempsSelectedKeys.value = {};
        tempExpandedKeys.value[res.data[0].key] = true;
        tempsSelectedKeys.value[res.data[0].key] = true;

        getTempTableData(res.data[0]);
      });
    };
    const tempPage = reactive({
      current: 1,
      size: 10,
      total: 0,
    });

    const tempQuery = reactive({
      name: null,
    });
    const tempTableData = ref([]);

    const unTempTypeKey = watch(
        tempsSelectedKeys,
        () => {
          getTempTableData();
        },
        {deep: true}
    );

    function getTempTableData() {
      http
          .get("/shellTemp/getTempPage", {
            params: {
              current: tempPage.current,
              size: tempPage.size,
              typeId: Object.keys(tempsSelectedKeys.value)[0],
              name: tempQuery.name,
            },
          })
          .then((res) => {
            if (res.success) {
              tempTableData.value = res.data.records;
              tempPage.total = res.data.total;
            }
          });
    }

    function closeSelectTemp() {
      // unTempTypeKey()
    }

    function selectedTemp(item) {
      data.shell = item.shell;
      // selectTemp.value.hide();
      checkedTempDisplay.value = false
    }

    function changeTempPage(event) {
      tempPage.current = event.page + 1;
      getTempTableData();
    }

    const oa = ref();

    const cycleTime = ref(0)
    const execNum = ref(0)

    function toggleOA(event) {
      oa.value.toggle(event)
    }

    const ob = ref()

    const regularTime = ref();

    function toggleOB(event) {
      ob.value.toggle(event)
    }

    const checkedTempDisplay = ref(false)

    return {
      checkedTempDisplay,
      oa, ob,
      toggleOA,
      toggleOB,
      cycleTime,
      execNum,
      regularTime,
      display,
      init,
      submitted,
      v$,
      data,
      selectTerminal,
      terminalList,
      terminalTypeTree,
      terminalTypeTreeKey,
      removeTerminal,
      terminalTable,
      selectedTerminalTable,
      typeTree,
      typeKey,
      page,
      search,
      hideSelect,
      getTerminalTable,
      changePage,
      submit,
      selectTemp,
      showSelectTemp,
      tempTableData,
      tempTreeData,
      tempQuery,
      tempPage,
      tempsSelectedKeys, changetempPage,
      tempExpandedKeys,
      closeSelectTemp,
      selectedTemp,
      getTempTableData,
      changeTempPage,
    };
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
}

.form-item {
  width: 85%;
  margin-bottom: 1rem;
  display: flex;
}

label {
  display: inline-block;
  min-width: 8rem;
  text-align: right;
}

.p-col-12 {
  padding: 0 0.5rem;
}

::v-deep(.p-password input) {
  width: 100%;
}

::v-deep(.p-datatable .p-datatable-header) {
  padding: 0.5rem;
}

.p-datatable.p-invalid {
  border: 1px solid red;
  border-radius: 3px;
}

::v-deep(.p-paginator) {
  border-bottom: 1px solid #e9ecef;
  border-right: 1px solid #e9ecef;
  border-left: 1px solid #e9ecef;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

::v-deep(.p-tree) {
  height: 100%;
  overflow-y: auto;
}

::v-deep(.p-treenode-label) {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

::v-deep(.p-datatable .p-datatable-footer) {
  padding: 0;
}

::v-deep(.p-datatable .p-datatable-footer .p-paginator) {
  border: none;
}
</style>
