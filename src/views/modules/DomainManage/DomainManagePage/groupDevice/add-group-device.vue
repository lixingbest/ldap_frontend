<template>
  <Dialog :header="isAdd?'策略库':'策略详情'" v-model:visible="display" :modal="true" :content-style="{padding:0,borderBottom:'1px solid #dee2e6',overflow:'hidden',height:'500px',width:'60rem'}" @hide="close">
    <div class="p-d-flex" style="width:100%;height: 100%;">
      <div v-show="isAdd" style="flex:1; border-top:1px solid #dee2e6;border-right: 1px solid #dee2e6;padding-right: 2px;height:100%">
        <tree :value="treeData" style="height:100%;overflow:auto" selection-mode="single" v-model:selectionKeys="selectDeviceKey" @node-select="onNodeSelect"></tree>
      </div>
      <div class="p-d-flex p-flex-wrap p-col" style="flex:3;position: relative;height: 100%;">
        <div v-show="isAdd && blockUI" class="blockPage" style="height:100%">请选择策略...</div>
        <Accordion :activeIndex="0" style="height:100%;padding-bottom:42px;width:100%">
          <AccordionTab header="内建策略" contentStyle="height:415px">
            <div class="p-d-flex" style="height:100%;overflow:auto">
              <tree :value="root" :expanded-keys="{1:true,2:true,6:true,11:true}" selection-mode="single" v-model:selectionKeys="selectedKey" @node-select="onMenuSelect"></tree>
              <div class="p-col" style="border-left:1px solid #dee2e6;height: 100%">
                <preview-content style="height:100%;padding-top:20px;overflow:auto"></preview-content>
              </div>
            </div>
          </AccordionTab>
          <AccordionTab header="自定义策略" contentStyle="height:415px">
            <DataTable style="height:100%;overflow:auto;" :style="isAdd?'max-width:44.7rem':'max-width:60rem'" :value="polocyData" :rowHover="true" :scrollable="true" paginator :rows="10"
              :rowsPerPageOptions="[10, 20, 50,100]" paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
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
              <Column :frozen="true" align-frozen="right" style="min-width:8rem" header="操作">
                <template #body="row">
                  <Button class="p-button-sm p-button-link" @click="showDetail(row.data)">查看详情</Button>
                </template>
              </Column>
            </DataTable>
          </AccordionTab>
        </Accordion>
      </div>
    </div>
    <ShowInfo v-if="showInfoDisplay" @close="showInfoDisplay=false" ref='showInfoInst'></ShowInfo>
    <template v-if="isAdd" #footer>
      <Button label="应用此策略" @click="save" class="p-mt-3" />
    </template>
  </Dialog>
</template>

<script>
import PreviewContent from "@/views/modules/DomainManage/DomainManagePage/groupDevice/preview-content";
import ShowInfo from "@/views/modules/PublicPolicy/PublicPolicy/showInfo";
export default {
  name: "add-group-device",
  components: { PreviewContent, ShowInfo },
  beforeUnmount() {
    localStorage.removeItem("selectedNode");
    localStorage.removeItem("device");
  },
  data() {
    return {
      display: false,
      treeData: null,
      root: [
        {
          key: 1,
          label: "控制面板",
          icon: "pi pi-cog",
          children: [
            {
              key: 2,
              label: "个性化",
              icon: "pi pi-star",
              children: [
                {
                  key: 3,
                  label: "背景桌面",
                },
                {
                  key: 4,
                  label: "屏幕保护程序",
                },
                // {
                //   key: 5,
                //   label: '锁屏',
                // }
              ],
            },
            {
              key: 6,
              label: "安全",
              icon: "pi pi-shield",
              children: [
                {
                  key: 7,
                  label: "网络保护",
                },
                //{
                //   key: 8,
                //   label: '系统更新',
                //
                // },
                // {
                //   key: 9,
                //   label: '应用控制与保护',
                // },
                {
                  key: 10,
                  label: "账号安全",
                },
              ],
            },
            {
              key: 11,
              label: "网络",
              icon: "pi pi-globe",
              children: [
                {
                  key: 12,
                  label: "共享桌面",
                },
              ],
            },
          ],
        },
      ],
      selectedKey: {},
      selectDeviceKey: {},
      selectedNode: null,
      ouId: null,
      blockUI: true,
      strategyId: null,
      isAdd: true,
      polocyData: [],
      showInfoDisplay: false,
      policyId: null,
    };
  },
  methods: {
    showDetail(data) {
      this.showInfoDisplay = true;
      this.$nextTick(() => {
        this.$refs.showInfoInst.init(data, "notPublic");
      });
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

    init(strategyId, domainId, ouId) {
      this.display = true;
      this.getDeviceTree(domainId);
      this.ouId = ouId;
      this.isAdd = strategyId == null;
      this.strategyId = strategyId;
      if (strategyId != null) {
        const node = {
          id: strategyId,
          type: "strategy",
        };
        this.onNodeSelect(node);
      }
    },

    close() {
      this.$emit("close");
    },
    save() {
      if (
        Number(this.ouId.split("-")[1]) === 1 &&
        localStorage.getItem("device")
      ) {
        this.$http
          .get("/strategy/settings/assign", {
            params: {
              ouId: this.ouId.split("-")[0],
              strategyId: JSON.parse(localStorage.getItem("device"))[0]
                .strategyId,
            },
          })
          .then(() => {
            this.$emit("success");
            this.$toast.add({
              severity: "info",
              summary: "保存成功！",
              life: 3000,
            });
            this.display = false;
          });
      }
    },
    getDeviceTree(id) {
      this.$http
        .get("/strategy/settings/listByDomain", {
          params: {
            domainId: id,
          },
        })
        .then((res) => {
          this.treeData = this.$global.Tree.makeTree(res.data, true);
        });
    },

    async onNodeSelect(node) {
      console.log(node);
      this.policyId = node.id;
      this.selectedNode = node;
      if (node.type === "strategy") {
        this.getPolicyData();
        this.blockUI = false;
        await this.$http
          .get("/strategy/settings/getValues", {
            params: {
              strategyId: node.id,
            },
          })
          .then((res) => {
            localStorage.setItem("device", JSON.stringify(res.data));
          });
        this.$store.commit("changeDeviceFlag");
      } else {
        this.blockUI = true;
      }
    },
    onMenuSelect(node) {
      const box = document.getElementById(node.key);
      box.scrollIntoView({
        behavior: "smooth",
      });
    },
  },
};
</script>

<style scoped>
.p-tree {
  border: none;
  height: 100%;
  overflow-y: auto;
}

.title {
  font-size: 16px;
}

.blockPage {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: #111111;
  opacity: 0.3;
  color: #ffffff;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-col {
  padding: 0;
}

::v-deep(.p-treenode-label) {
  white-space: nowrap;
  padding-right: 1rem;
}
::v-deep(.p-accordion-tab) {
  max-height: 100%;
  /* overflow: auto; */
}
::v-deep(.p-accordion-content) {
  padding: 0;
  height: 100%;
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
