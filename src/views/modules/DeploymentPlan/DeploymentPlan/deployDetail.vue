<template>
  <Dialog header="计划详情" :modal="true" style="width:50vw"
          v-model:visible="display" @hide="$emit('close')">
    <div style="display: flex;flex-wrap: wrap">
      <div class="p-col-6">
        <label>名称：</label>
        {{ data.name }}
      </div>
      <div class="p-col-6">
        <label>编号：</label>
        {{ data.code }}
      </div>
      <div class="p-col-6">
        <label>时间：</label>
        {{ new Date(data.time).toLocaleString('chinese', {hour12: false}).replace(/\//g, "-") }}
      </div>

      <div class="p-col-6">
        <label>类型：</label>
        {{ data.execType === 0 ? '立即执行' : (data.execType === 1 ? '定时执行' : '周期执行') }}
      </div>

      <div class="p-col-6" v-if="data.execType===1">
        <label>执行时间：</label>
        {{ data.execExpr }}
      </div>
      <div class="p-col-6" v-if="data.execType===2">
        <label>执行周期：</label>
        {{ data.execExpr.split('/')[0] + '分钟执行一次，共' + data.execExpr.split('/')[1] + '次' }}
      </div>

      <div class="p-col-12">
        <label>脚本：</label>
        {{ data.shell }}
      </div>
      <div class="p-col-12">
        <label>说明：</label>
        {{ data.comments }}
      </div>
    </div>
    <h5 style="font-weight: bold">关联终端</h5>
    <data-table :value="data.details" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10"
                :rowsPerPageOptions="[10, 20, 50,100]"
                paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                currentPageReportTemplate="共 {totalRecords} 条记录" class="p-datatable-gridlines">
      <column header="主机名" field="hostname"></column>
      <column header="IP地址" field="ipv4"></column>
      <column header="超级用户名" field="account"></column>
      <column header="是否成功">
        <template #body="row">
          <Tag v-if="row.data.status===0" class="mr-2" severity="success" value="成功"></Tag>
          <Tag v-else class="mr-2" severity="danger" value="失败"></Tag>
        </template>
      </column>
      <column header="耗时">
        <template #body="row">
          {{ (new Date(row.data.endTime).getTime() - new Date(row.data.beginTime).getTime()) / 1000 }} 秒
        </template>
      </column>
      <column header="开始执行时间" field="beginTime">
        <template #body="row">
          {{ new Date(row.data.beginTime).toLocaleString('chinese', {hour12: false}).replace(/\//g, '-') }}
        </template>
      </column>
      <column header="结束执行时间" field="endTime">
        <template #body="row">
          {{ new Date(row.data.endTime).toLocaleString('chinese', {hour12: false}).replace(/\//g, '-') }}
        </template>
      </column>

      <column header="操作" :frozen="true" align-frozen="right" style="min-width:300px">
        <template #body="row">
          <Button v-show="row.data.status!==0" label="重新执行" @click="reload(row.data)" class="p-button-link"/>
          <Button label="查看日志" @click="showLog(row.data)" class="p-button-link"/>
          <Button label="删除" @click="deleteDetail(row.data)" class="p-button-link"
                  style="color:red"></Button>
        </template>
      </column>
    </data-table>
    <Dialog header="日志详情" :modal="true" style="width:50vw" v-model:visible="logDisplay">
      {{ itemDetail.execLog }}
    </Dialog>
  </Dialog>
</template>

<script>
import {getCurrentInstance, ref} from "vue";
import http from "../../../../http";
import {useToast} from "primevue/usetoast";

export default {
  name: "deployDetail",
  setup() {
    const toast = useToast()
    const display = ref(false);
    const data = ref({
      id: null,
      details: [],
    });
    const init = (event) => {
      display.value = true;
      data.value.id = event.id
      getDetailById()
      //data.value = JSON.parse(JSON.stringify(event));
    };

    const logDisplay = ref(false);
    const itemDetail = ref({});

    const showLog = (data) => {
      itemDetail.value = data;
      logDisplay.value = true;
    };

    const {proxy} = getCurrentInstance();
    const deleteDetail = (e) => {
      console.log(e);
      proxy.$confirm.require({
        message: "您确定删除此记录？",
        header: "删除执行记录",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          http.delete("/deploy/deleteDetail/" + e.id).then(() => {
            proxy.$toast.add({
              severity: "info",
              summary: "删除成功！",
              life: 3000,
            });
            proxy.$confirm.close();

            data.value.details = data.value.details.filter(
                (item) => item.id !== e.id
            );
          });
        },

        reject: () => {
          proxy.$confirm.close();
        },
      });
    };

    function reload(data) {
      http.get('/deploy/reloadcommand', {params: {detailId: data.id}}).then(res => {
        if (res.success) {
          toast.add({
            severity: "info",
            summary: "操作成功！",
            life: 3000,
          })
          getDetailById();
        }
      })
    }

    function getDetailById() {
      http.get('/deploy/detailList', {params: {mainId: data.value.id}}).then(res => {
        data.value = res.data
      })
    }

    return {
      display,
      init,
      data,
      deleteDetail,
      itemDetail,
      logDisplay,
      showLog,
      reload
    };
  },
};
</script>

<style scoped>
</style>
