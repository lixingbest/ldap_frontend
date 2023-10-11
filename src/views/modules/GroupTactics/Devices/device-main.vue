<template>
  <div class="page">
    <div class="p-left">
      <p class="title">域林信息</p>
      <domain-tree @policy='policy'></domain-tree>
    </div>
    <div class="p-col" style="width:calc(100% - 280px);height:100%">
      <ul class="flex title" style="justify-content: flex-start;list-style: none;line-height: 48px" @click="changTab($event)">
        <li :class="{'highlight-tab':tabIndex===0}" value="0">策略配置</li>
        <li :class="{'highlight-tab':tabIndex===1}" value="1">直接使用者</li>
      </ul>
      <div v-show="data==null" class="block">请在左侧面板选择策略以查看...</div>
      <Accordion :activeIndex="0" v-if="tabIndex===0" id="accordion" style="height: calc(100% - 94px)">
        <AccordionTab header="内建策略" contentStyle="height:calc(100% - 44px)">
          <div class="p-d-flex" style="height:100%;overflow:auto">
            <div class="p-left">
              <device-type></device-type>
            </div>
            <div class="p-col">
              <router-view @show=show></router-view>
            </div>
          </div>
        </AccordionTab>
        <AccordionTab header="自定义策略" ontentStyle="height:100%">
          <div style="width:100%;display:flex;justify-content:flex-end">
            <Button style="margin-bottom:1rem" @click="addPolicy()">添加策略</Button>
          </div>
          <DataTable :value="polocyData" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>
              <p style="width:100%;text-align: left">暂无数据</p>
            </template>
            <Column style="max-width: 10rem;" field="comments" header="说明">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.comments">{{ row.data.comments }}</span>
              </template>
            </Column>
            <Column style="max-width: 10rem;" field="code" header="编号">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.code">{{ row.data.code }}</span>
              </template>
            </Column>
            <Column style="max-width: 10rem;" field="name" header="命令名称">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.name">{{ row.data.name }}</span>
              </template>
            </Column>
            <Column style="max-width: 10rem;" field="type" header="命令用途">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.type">{{ row.data.type }}</span>
              </template>
            </Column>
            <Column style="max-width: 10rem;" field="args" header="参数说明">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.args">{{ row.data.args }}</span>
              </template>
            </Column>
            <Column style="max-width: 20rem;" field="value" header="变量参数">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.value">{{ row.data.value }}</span>
              </template>
            </Column>
            <Column style="max-width: 12rem;" field="os" header="适配系统">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.os">{{ row.data.os }}</span>
              </template>
            </Column>
            <Column style="max-width: 8rem;" field="arch" header="适配架构">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.arch">{{ row.data.arch }}</span>
              </template>
            </Column>
            <Column style="max-width: 10rem;" field="version" header="适配版本">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.version">{{ row.data.version }}</span>
              </template>
            </Column>
            <Column style="max-width: 10rem;" field="command" header="命令内容">
              <template #body="row">
                <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden" v-tooltip.left="row.data.command">{{ row.data.command }}</span>
              </template>
            </Column>
            <Column :frozen="true" align-frozen="right" style="min-width: 16rem;" header="操作">
              <template #body="row">
                <Button class="p-button-sm p-button-link" @click="showDetail(row.data)">查看详情</Button>
                <Button class="p-button-sm p-button-link" @click="addPolicy(row.data)">编辑</Button>
                <Button class="p-button-sm p-button-link" style="color: red" @click="deleteData(row.data)">删除</Button>
              </template>
            </Column>
          </DataTable>
        </AccordionTab>
      </Accordion>
      <div style="height: calc(100% - 51px);overflow:auto" v-if="tabIndex===1">
        <use-manage ref="useManageRef"></use-manage>
      </div>
    </div>
    <add-policy ref="addPolicyRefs" v-if='addPolicyDisplay' @closePolicy="closePolicy"></add-policy>

    <Dialog v-model:visible="showDisplay" :modal="true" @hide="showDisplay=false" header="删除策略">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span> 您确认要删除该策略吗？</span>
      </div>
      <template #footer>
        <Button label="是" icon="pi pi-check" @click="deleteById()" class="p-button-link" />
        <Button label="否" icon="pi pi-times" @click="showDisplay=false" class="p-button-secondary p-button-link" />
      </template>
    </Dialog>
    <ShowInfo v-if="showInfoDisplay" @close="showInfoDisplay=false" ref='showInfoInst'></ShowInfo>
  </div>

</template>

<script>
import DomainTree from "@/views/modules/GroupTactics/Devices/components/domain-tree";
import DeviceType from "@/views/modules/GroupTactics/Devices/components/device-type";
import UseManage from "@/views/modules/GroupTactics/Devices/components/use-manage";
import AddPolicy from "@/views/modules/GroupTactics/Devices/components/add-policy";
import ShowInfo from "@/views/modules/PublicPolicy/PublicPolicy/showInfo";

export default {
  name: "device-main",
  components: { UseManage, DeviceType, DomainTree, AddPolicy, ShowInfo },
  computed: {
    device_flag() {
      return this.$store.state.device_flag;
    },
  },
  watch: {
    device_flag() {
      let data = JSON.parse(localStorage.getItem("selectedNode"));
      if (data && data.type === "strategy") {
        this.data = data;
        this.useManageInit();
      } else {
        this.data = null;
        this.useManageInit();
      }
    },
  },
  data() {
    return {
      list: null,
      showDisplay: false,
      showInfoDisplay: false,
      policyId: null,
      polocyData: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      addPolicyDisplay: false,
      data: null,
      tabIndex: 0,
    };
  },
  beforeUnmount() {
    localStorage.removeItem("selectedNode");
    localStorage.removeItem("device");
  },
  methods: {
    deleteData(data) {
      this.showDisplay = true;
      this.list = data;
    },
    deleteById() {
      this.$http
        .get("/strategy/settings/removePubStrategay", {
          params: this.list,
        })
        .then((res) => {
          if (res.success) {
            this.$toast.add({
              severity: "info",
              summary: "删除成功！",
              life: 3000,
            });
            this.showDisplay = false;
            this.getPolicyData();
          }
        });
    },
    showDetail(data) {
      this.showInfoDisplay = true;
      this.$nextTick(() => {
        this.$refs.showInfoInst.init(data, "notPublic");
      });
    },
    closePolicy(val) {
      this.policyId = val;
      this.addPolicyDisplay = false;
      this.getPolicyData();
    },
    getPolicyData() {
      this.$http
        .get("/strategy/settings/listPubStrategay", {
          params: {
            strategyId: this.policyId,
          },
        })
        .then((res) => {
          if (res.success) {
            this.polocyData = res.data;
          }
        });
    },
    addPolicy(data) {
      this.addPolicyDisplay = true;
      this.$nextTick(() => {
        this.$refs.addPolicyRefs.init(data, this.policyId);
      });
    },
    show() {
      this.data = JSON.parse(localStorage.getItem("selectedNode"));
    },
    changTab(event) {
      if (event.target.tagName === "LI") {
        this.tabIndex = event.target.value;
        this.useManageInit();
      }
    },
    useManageInit() {
      if (this.tabIndex === 1) {
        this.$nextTick(() => {
          if (this.$refs.useManageRef) {
            this.$refs.useManageRef.init(this.data ? this.data.id : null);
          }
        });
      }
    },
    policy(val) {
      if (val.includes("_")) {
        this.policyId = val.split("_")[1];
      } else {
        this.policyId = val;
      }
      if (this.policyId) {
        this.getPolicyData();
      }
    },
  },
};
</script>
<style>
.p-accordion {
  height: 100%;
}

.p-accordion-content {
  height: 100%;
}
</style>
<style scoped>
.p-d-flex {
  width: 100%;
  height: 100%;
}

.p-left {
  width: 280px;
  border-right: 1px solid #dee2e6;
  height: 100%;
}

.p-right {
  width: auto;
  height: 100%;
}

.p-col {
  padding: 0;
  height: 100%;
  position: relative;
}

.title-second {
  line-height: 40px;
}

.page_size {
  width: 100%;
  height: calc(100% - 51px);
}

.block {
  width: 100%;
  height: calc(100% - 51px);
  z-index: 999;
  position: absolute;
  background-color: #111111;
  opacity: 0.4;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

/* ::v-deep(.p-treenode-label) {
  flex: 1;
} */
::v-deep(.p-treenode-label) {
  white-space: nowrap;
  padding-right: 1rem;
}

ul {
  padding: 0;
}

ul li {
  padding: 0 1rem;
  cursor: pointer;
}

.highlight-tab {
  border-bottom: 2px solid rgb(26, 61, 125);
}
::v-deep(#accordion > .p-accordion-tab) {
  max-height: 100%;
  overflow-y: auto;
}
::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
  justify-content: center;
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: center;
}
</style>
