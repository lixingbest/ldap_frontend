<template>
  <div style="height: 100%">
    <!-- <div class="p-d-flex" style="width:100%;height: 100%;overflow: hidden"> -->
    <Accordion :activeIndex="0" id="accordion" style="height: calc(100% - 50px);width:100%;margin-top:0.5rem">
      <AccordionTab header="内建策略" contentStyle="height:calc(100% - 44px)">
        <div class="p-d-flex" style="width:100%;height: 100%;overflow: auto;padding:1rem 0">
          <tree :value="root" :expanded-keys="{1:true,2:true,6:true,11:true}" selection-mode="single" style="padding-left: 0" v-model:selectionKeys="selectedKey" @node-select="onMenuSelect"></tree>
          <div class="p-col" style="border-left:1px solid #dee2e6;height: 100%;overflow: auto;padding: 1rem 0">
            <preview-content style="width:100%"></preview-content>
          </div>
        </div>
      </AccordionTab>
      <AccordionTab header="自定义策略" ontentStyle="height:100%">
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
        </DataTable>
        <add-policy ref="addPolicyRefs" v-if='addPolicyDisplay' @close="close"></add-policy>
      </AccordionTab>
    </Accordion>

    <!-- </div> -->
  </div>
  <!-- </div> -->
</template>

<script>
import PreviewContent from "@/views/modules/DomainManage/DomainManagePage/groupDevice/preview-content";
export default {
  name: "domainPllicy",
  components: { PreviewContent },
  beforeUnmount() {
    localStorage.removeItem("policy");
  },
  data() {
    return {
      polocyData: [],
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
      strategyId: null,
    };
  },
  mounted() {
    if (localStorage.getItem("policy")) {
      let data = JSON.parse(localStorage.getItem("policy"));
      this.init(data.strategyId, data.domainId, data.ouId);
    }
  },
  methods: {
    init(strategyId, domainId, ouId) {
      this.display = true;
      this.getDeviceTree(domainId);
      this.ouId = ouId;
      this.strategyId = strategyId;
      if (strategyId != null) {
        const node = {
          id: strategyId,
          type: "strategy",
        };
        this.onNodeSelect(node);
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
      this.selectedNode = node;
      if (node.type === "strategy") {
        await this.$http
          .get("/strategy/settings/listPubStrategay", {
            params: {
              strategyId: this.strategyId,
            },
          })
          .then((res) => {
            if (res.success) {
              this.polocyData = res.data;
            }
          });
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
      }
    },
    onMenuSelect(node) {
      const box = document.getElementById(node.key);
      box?.scrollIntoView({
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
  margin-left: 0.3rem;
}
#accordion > .p-accordion-tab {
  height: 100%;
  overflow: auto;
}
::v-deep(#accordion > .p-accordion-tab) {
  max-height: 100%;
  overflow: auto;
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
