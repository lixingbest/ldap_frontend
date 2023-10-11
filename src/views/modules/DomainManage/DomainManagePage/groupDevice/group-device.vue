<template>
  <div class="p-mt-3" style="height:100%">
    <Accordion :activeIndex="0">
      <AccordionTab header="组策略">
        <Button label="添加策略" @click="addDevice(null)"/>
        <div id="clDataTable" style="height:calc(100% - 20px);overflow:hidden">
          <data-table class="p-mt-3" :value="deviceList" :scrollHeight='scrollHeight' :rowHover="true"
                      :scrollable="true" style="height:100%;"
                      :paginator="true" :rows="10"
                      template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                      :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>
              <p style="text-align: center">暂无信息...</p>
            </template>
            <column header="策略名" field="name" style="min-width: 8rem"></column>
            <!--      <column header="所属域" field="domainId"></column>-->
            <column header="编号" field="code" style="min-width: 8rem"></column>
            <column header="关系" field="extendOU" style="min-width: 25rem">
              <template #body="row">
                <div v-if="row.data.extendOU" class="p-text-center" style="white-space: nowrap"
                     v-tooltip.top="row.data.extendOU">
                  <Tag severity="success" value="继承自"></Tag>
                  {{ row.data.extendOU }}
                </div>
                <div v-else>
                  <Tag severity="success" value="自有策略"></Tag>
                </div>
              </template>
            </column>
            <column header="是否强制策略" style="min-width: 12rem"></column>
            <column header="备注" field="comments" style="min-width: 8rem"></column>
            <column header="优先级" style="min-width: 8rem"></column>
            <column header="状态" style="min-width: 8rem">
              <template #body="row">
                <Tag :severity="row.data.enable==1?'danger':'success'" :value="row.data.enable==1?'禁用':'启用'"></Tag>
              </template>
            </column>
            <column header="操作" :frozen="true" alignFrozen="right" style="min-width:22rem">
              <template #body="row">
                <Button class="p-button-text" @click="addDevice(row.data.id)">详情</Button>
                <Button class="p-button-text" @click="showCog(row.data)">配置</Button>
                <Button v-if="!row.data.extendOU" class="p-button-text"
                        :style="row.data.enable==0?'color:red':'color:#113066'"
                        @click="changeStatus(row.data)">{{ row.data.enable == 0 ? '禁用' : '启用' }}
                </Button>
                <Button v-if="!row.data.extendOU" class="p-button-text" style="color:red;"
                        @click="deleteItem(row.data.refid)">删除
                </Button>
              </template>
            </column>
          </data-table>
          <!--      <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"-->
          <!--        :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">-->
          <!--      </Paginator>-->
        </div>
        <Dialog v-model:visible="stateDisplay" :modal="true" @hide="closeChangeState" header="更改启用状态">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
            <span> 您确认要{{ domain.enable == 0 ? '禁用' : '启用' }} "{{ domain.name }}" 吗？</span>
          </div>
          <template #footer>
            <Button label="是" icon="pi pi-check" @click="changeState()" class="p-button-link"/>
            <Button label="否" icon="pi pi-times" @click="closeChangeState" class="p-button-secondary p-button-link"/>
          </template>
        </Dialog>
        <Dialog v-model:visible="cogDisplay" :modal="true" @hide="closeCog" header="配置">
          <div style="display: flex;flex-direction: column;row-gap: 1rem">
            <div class="p-d-flex p-ai-center">
              <label>是否强制策略：</label>
              <div class="p-col">
                <span class="p-mr-3"><RadioButton v-model="form.isForce"
                                                  :value="0"></RadioButton><label>是</label></span>
                <span><RadioButton v-model="form.isForce" :value="1"></RadioButton><label>否</label></span>
              </div>
            </div>
            <div class="p-d-flex p-ai-center">
              <label>优先级：</label>
              <div class="p-col">
                <InputNumber v-model="form.level" :min="0"></InputNumber>
              </div>
            </div>
          </div>
          <template #footer>
            <Button @click="submitCog">保存</Button>
          </template>
        </Dialog>
        <add-group-device ref="addDevice" v-if="addDeviceDisplay" v-on:close="closeDialog()"
                          @success="success"></add-group-device>
      </AccordionTab>
      <AccordionTab header="黑白名单">
        <div style="display: flex;column-gap: 1rem;margin-bottom: 1rem;">
          <Button>添加规则</Button>
          <Button>删除所选</Button>
        </div>
        <DataTable>
          <template #empty>
            <p style="text-align: center">暂无信息...</p>
          </template>
          <column header="用户组"></column>
          <column header="类型"></column>
          <column header="说明"></column>
        </DataTable>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script>
import AddGroupDevice from "@/views/modules/DomainManage/DomainManagePage/groupDevice/add-group-device";

export default {
  name: "group-device",
  components: {AddGroupDevice},
  props: ["domainId", "treeData", "status"],
  data() {
    return {
      scrollHeight: "400px",
      domain: null,
      stateDisplay: false,
      id: null,
      content: null,
      deviceList: [],
      addDeviceDisplay: false,
      page: {
        total: 0,
        current: 1,
        size: 10,
      },
      cogDisplay: false,
      form: {
        ouId: null,
        strategyId: null,
        isForce: 0,
        level: null
      }
    };
  },
  watch: {

    status(val) {
      console.log(val);
      this.getData();
    },
    domainId(val) {
      console.log(val);
      if (val.split("-")[1] === 0) {
        this.id = val.split("-")[0];
      } else {
        this.getData();
        this.id = this.$global.Tree.searchDomainId(
            this.treeData,
            val.split("-")[0],
            null
        );
      }
    },
    device_flag() {
      this.content = localStorage.getItem("device");
    },
  },
  computed: {
    device_flag() {
      return this.$store.state.device_flag;
    },
  },
  beforeUnmount() {
    localStorage.removeItem("selectedNode");
    localStorage.removeItem("device");
  },
  mounted() {
    const element = document.getElementById("clDataTable");
    const clientHeight = element.clientHeight;
    this.scrollHeight = clientHeight - 28 - 30 + "px";

    window.onresize = () => {
      const clientHeight = element.clientHeight;
      this.scrollHeight = clientHeight - 28 - 30 + "px";
    };
    if (this.domainId.split("-")[1] === 0) {
      this.id = this.domainId.split("-")[0];
    } else {
      this.id = this.$global.Tree.searchDomainId(
          this.treeData,
          this.domainId.split("-")[0],
          null
      );
    }
    this.getData();
  },

  methods: {
    closeCog() {
      this.cogDisplay = false
      this.form = {
        id: null,
        isForce: null,
        level: null
      }
    },
    showCog(data) {
      this.cogDisplay = true;


      this.$http.get('/strategy/settings/getStrategySettingRef', {
        params: {
          strategyId: data.id, ouId: this.domainId.split("-")[0]
        }
      }).then(res => {
        if (res.success) {
          this.form = res.data
        }
      })
    },
    submitCog() {
      this.$http.post('/strategy/settings/updateStrategySettingRef',this.form).then(res => {
        if (res.success) {
          this.$toast.add({
            severity: "info",
            summary: "修改成功！",
            life: 3000,
          });
          this.form = {
            ouId: null,
            strategyId: null,
            isForce: 0,
            level: null
          }
          this.cogDisplay = false
        }
      })
    },
    changePage(page) {
      this.page.current = page.page + 1;
      this.page.size = page.rows;
      this.getData();
    },
    success() {
      this.$emit("status");
    },
    changeStatus(data) {
      this.domain = data;
      this.stateDisplay = true;
    },
    changeState() {
      this.$http
          .get("/strategy/settings/enable", {
            params: {
              refId: this.domain.refid,
              enable: Number(this.domain.enable) === 0 ? 1 : 0,
            },
          })
          .then((res) => {
            this.stateDisplay = false;
            if (res.success) {
              this.getData();
              this.$emit("status");
              this.$toast.add({
                severity: "info",
                summary: "修改状态成功！",
                life: 3000,
              });
            } else {
              this.$toast.add({
                severity: "error",
                summary: "修改状态失败！",
                life: 3000,
              });
            }
          });
    },
    closeChangeState() {
      this.stateDisplay = false;
    },
    getData() {
      this.$http
          .get("/strategy/settings/assignmentList", {
            params: {
              ouId: this.domainId.split("-")[0],
              current: this.page.current,
              size: this.page.size,
            },
          })
          .then((res) => {
            this.deviceList = res.data;
            this.page.total = res.data.total;
          });
    },
    addDevice(strategyId) {
      this.addDeviceDisplay = true;
      this.$nextTick(() => {
        this.$refs.addDevice.init(strategyId, this.id, this.domainId);
      });
    },
    closeDialog() {
      this.addDeviceDisplay = false;
      this.getData();
    },
    deleteItem(id) {
      this.$confirm.require({
        message: "您确定要移除此策略？",
        header: "移除策略",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          this.$http
              .get("/strategy/settings/removeAssignment", {
                params: {
                  id: id,
                },
              })
              .then(() => {
                this.$toast.add({
                  severity: "info",
                  summary: "删除成功！",
                  life: 3000,
                });
                this.$emit("status");
                this.$confirm.close();
                this.getData();
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
::v-deep(.p-treenode-label) {
  padding-right: 2rem;
}

::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  justify-content: center;
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
}

::v-deep(.p-accordion) {
  height: 100%;
}

::v-deep(.p-accordion-tab-active) {
  height: calc(100% - 44px);
}

::v-deep(.p-toggleable-content) {
  height: calc(100% - 44px);
}

::v-deep(.p-accordion-content) {
  height: 100%;
}
</style>
