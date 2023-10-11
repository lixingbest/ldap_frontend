<template>
  <div class="table-title">
    <div class="from">
      <div class="form-item p-mr-2">
        <label>主机名 ：</label>
        <InputText v-model.trim="query.fqdn" class="inout-t" @keyup.enter="getData"></InputText>
      </div>
      <Button class="p-mr-2" @click="getData">查询</Button>
      <Button class="p-mr-2" @click="importComputers">导入</Button>
      <Button class="p-mr-2" @click="exportData">导出全部</Button>
      <Button class="p-mr-2" @click="clear">清理无用主机</Button>
    </div>
  </div>
  <div id="computerDataTable" style="height:calc(100% - 20px);overflow:hidden">
    <DataTable style="margin-top: 10px;" :rowHover="true" :value="list" :scrollable="true"
               :scroll-height="scrollHeight" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
               paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
               currentPageReportTemplate="共 {totalRecords} 条记录">
      <template #empty>
        <p style="width:100%;text-align: left">暂无数据</p>
      </template>
      <column field="fqdn" style="min-width: 15rem" header="主机名">
        <template #body="a">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="a.data.fqdn ? a.data.fqdn[0] : ''">
            <span class="text-ellipsis">{{ a.data.fqdn ? a.data.fqdn[0] : '' }}</span>
          </span>
        </template>
      </column>
      <column header="所在组织单位" field="" style="min-width: 8rem">
        <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.ouName">
            {{ row.data?.details?.ouName }}
          </span>
        </template>
      </column>
      <column header="最后登录账号" style="min-width: 10rem">
        <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.uid">
            {{ row.data?.details?.uid }}
          </span>
        </template>
      </column>
      <column header="姓名" style="min-width: 6rem">
        <template #body="row">
          <span v-tooltip.top="row.data?.details?.userName">
            {{ row.data?.details?.userName }}
          </span>
        </template>
      </column>
      <column header="是否入域" style="min-width: 6rem">
        <template #body="row">
          <span :class="{'p-tag':true,'p-tag-success':row.data.has_keytab,'p-tag-danger':!row.data.has_keytab}">{{
              row.data.has_keytab ? '已入域' : '已退域'
            }}</span>
        </template>
      </column>
      <column header="系统名称" style="min-width: 12rem">
        <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.sysName">
            {{ row.data?.details?.sysName }}
          </span>
        </template>
      </column>
      <column header="系统版本" style="min-width:15rem">
        <template #body="row"> <span
            style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
            v-tooltip.top="row.data?.details?.sysVersion">
            {{ row.data?.details?.sysVersion }}</span>
        </template>
      </column>
      <column header="架构" style="min-width: 6rem">
        <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.sysArch">
            {{ row.data?.details?.sysArch }}
          </span>
        </template>
      </column>
      <column header="IP" style="min-width: 8rem">
        <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.ip">
            {{ row.data?.details?.ip }}
          </span>
        </template>
      </column>
      <column header="MAC" style="min-width: 10rem">
        <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.mac">
            {{ row.data?.details?.mac }}
          </span>
        </template>
      </column>
      <!-- <column header="终端序列号" style="min-width: 8rem">
        <template #body="row">
          <span v-tooltip.top="row.data?.details?.sn">
            {{ row.data?.details?.sn }}
          </span>
        </template>
      </column> -->
      <column header="客户端版本" style="min-width: 8rem">
        <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.clientVersion">
            {{ row.data?.details?.clientVersion }}
          </span>
        </template>
      </column>
      <column header="最后登录时间" style="min-width: 12rem">
        <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="this.$global.Util.getFormatDate(row.data?.details?.accessTime)">{{
              this.$global.Util.getFormatDate(row.data?.details?.accessTime)
            }}</span>
        </template>
      </column>
      <column header="是否在线" style="min-width: 6rem">
        <template #body="row">
          <Tag v-if="row.data.details" style="color:white"
               :severity="row.data?.details?.isOnline==0?'success':(row.data?.details?.isOnline==1?'danger':(row.data?.details?.isOnline==2?'warning':null))"
               :value="row.data?.details?.isOnline==0?'在线':(row.data?.details?.isOnline==1?'离线':(row.data?.details?.isOnline==2?'未知':null))"></Tag>
          <Tag style="color:white" v-else severity="warning">未知</Tag>
        </template>
      </column>
      <Column header="操作" :frozen="true" alignFrozen="right" style="min-width: 12rem;justify-content: center">
        <template #body="item">
          <Button class="p-button-link p-button-sm" v-if="item.data && item.data.details && item.data.details.ip"
                  @click="openWindow(item.data && item.data.details?item.data.details.ip:null)">控制
          </Button>
<!--          <Button class="p-button-link p-button-sm" @click="moveComputerMethod(item.data)">移动</Button>-->
<!--          <Button class="p-button-link p-button-sm" @click="changeEnable()">禁用</Button>-->
          <Button class="p-button-link p-button-sm" style="color: red" @click="deleteById(item.data)">移除
          </Button>
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog v-model:visible="moveComputer" style="width:30vw"
          header="移动计算机" :modal="true" @hide="moveComputer=false">

    <tree :value="domainTree" selectionMode="single"
          v-model:selection-keys="selectedMove"
          :expanded-keys="expendNodes"></tree>

    <template #footer>
      <Button class="p-mr-3" @click="()=>{moveComputer=false;moveItem=null;}">取消</Button>
      <Button :disabled="Object.keys(selectedMove).length===0" @click="submitMove">确定</Button>
    </template>
  </Dialog>
  <Dialog v-model:visible="importLogDisplay" header="异常日志" :modal="true" @hide="importLogDisplay=false">
    <p v-for="item in importLog">{{ item }}</p>
  </Dialog>
  <add-or-update-domain-computer ref="addOrUpdate" v-if="addOrUpdatedDisplay"
                                 @close="closeDialog"></add-or-update-domain-computer>
  <clear-garbage-computer ref="clearComputer" v-if="clearComputerDisplay" @close="closeDialog"></clear-garbage-computer>
</template>

<script>
import AddOrUpdateDomainComputer from "@/views/modules/DomainManage/DomainManagePage/domain-computer/add-or-update";
import axios from "axios";
import ClearGarbageComputer
  from "@/views/modules/DomainManage/DomainManagePage/domain-computer/clearGarbageComputer.vue";

export default {
  name: "DomainCon",
  components: {ClearGarbageComputer, AddOrUpdateDomainComputer},
  data() {
    return {
      scrollHeight: "400px",
      addOrUpdatedDisplay: false,
      clearComputerDisplay: false,
      type: null,
      types: [{name: "111"}, {name: "222"}],
      list: [],
      query: {
        fqdn: null,
      },
      importLog: [],
      importLogDisplay: false,
      moveComputer: false,
      domainTree: null,
      expendNodes: {},
      selectedMove: {},
      moveItem: null,
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
    const element = document.getElementById("computerDataTable");
    const clientHeight = element.clientHeight;
    this.scrollHeight = clientHeight - 28 - 30 + "px";

    window.onresize = () => {
      const clientHeight = element.clientHeight;
      this.scrollHeight = clientHeight - 28 - 30 + "px";
    };
    this.getData();
  },
  methods: {
    changeEnable(){

    },
    moveComputerMethod(data) {
      this.moveItem = data
      this.$http.get("/domain/tree").then((res) => {
        //this.treeData = res.data;
        let data = res.data.filter(
            (item) => item.type === "0" && item.upStatus === 0
        );

        this.domainTree = this.$global.Tree.makeTree(data, true);

        this.expendNodes[this.domainTree[0].key] = true
        this.moveComputer = true;

      });
    },
    submitMove() {
      let domainId = Object.keys(this.selectedMove)[0].split('-')[0];

      let fqdn = this.moveItem.fqdn[0];

      this.$http.get("/host/move", {
        params: {
          domainId: domainId,
          fqdn: fqdn,
        }
      }).then(res => {
        if (res.success) {
          this.$toast.add({
            severity: "info",
            summary: "移动成功！",
            life: 3000,
          });
          this.moveComputer = false;
          this.moveItem = null;
          this.getData()
        }
      })
    },
    importComputers() {
      this.$confirm.require({
        message: '请在模板内容基础上上传！',
        header: '批量导入',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: '下载模板',
        acceptLabel: '导入文件',
        reject: () => {
          this.$http.get('/域计算机模板.xlsx', {
            baseURL: '',
            responseType: 'blob'
          }).then(res => {
            const link = document.createElement('a')
            const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.setAttribute('download', `域计算机模板.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
        },
        accept: () => {
          let input = document.createElement('input');
          input.type = 'file';
          const that = this;
          let domainId =
              this.domainId.split("-")[1] == 0
                  ? this.domainId.split("-")[0]
                  : this.$global.Tree.searchDomainId(
                      this.treeData,
                      this.domainId.split("-")[0],
                      null
                  );
          input.onchange = function () {
            let file = this.files[0];
            console.log(file)
            let formData = new FormData();
            formData.append("file", file)
            formData.append("domainId", domainId)
            that.$http.post("/host/importComputer", formData, {
              headers: {"Content-Type": "multipart/form-data"},
            }).then(res => {
              that.importLog = res.data
              if (res.data.length > 0) {
                that.importLogDisplay = true
              }
              that.getData()
            })
          }
          input.click()
        }
      })
    },
    clear() {
      this.clearComputerDisplay = true;
      this.$nextTick(() => {
        this.$refs.clearComputer.init()
      })
    },
    openWindow(ip) {
      window.open('http://' + ip + ':10000', '_blank')
    },
    exportData() {
      let domainId =
          this.domainId.split("-")[1] == 0
              ? this.domainId.split("-")[0]
              : this.$global.Tree.searchDomainId(
                  this.treeData,
                  this.domainId.split("-")[0]
              );
      // axios.get("/config.json").then((config) => {
      //   let url = config.data.service_url + "/host/export?domainId=" + domainId;
      //   window.open(url);
      // });


      this.$http.get("/host/export", {
        params: {
          domainId: domainId
        },
        responseType: 'blob'
      }).then(res => {
        const name = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('=')[1]).replace(/\"/g, '');
        const link = document.createElement('a')
        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `${name}`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })

    },
    getData() {
      this.$http
          .get("/host/list", {
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
      this.clearComputerDisplay = false;
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
        message:
            "确定要移除此域计算机记录吗？移除后会导致此计算机无法使用域服务，请谨慎操作。",
        header: "移除",
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
                  summary: "移除成功！",
                  life: 3000,
                });
                this.getData();
                // this.getUsersImage();
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
