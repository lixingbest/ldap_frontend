<template>
  <div class="page">
    <div class="border-r">
      <p class="title">域林信息</p>
      <Tree :value="root" selectionMode="single" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey" @node-select="selectTreeNode"></Tree>
    </div>
    <div class="content">
      <p class="title">{{ treeNode ? '"' + treeNode.name + '"的' : '' }}Active Directory信任</p>
      <div class="p-p-3 scroll-view">
        <p class="name">
          <span>Active Directory信任列表</span>
        </p>
        <div>
          <div class="table-header p-mb-3">
            <div class="p-mr-2">
              <label>域名：</label>
              <InputText v-model="query.domainName" @keydown.enter="aa()"></InputText>
            </div>
            <Button @click="aa()">查询</Button>
          </div>
          <data-table :value="table" :rowHover="true" :scrollable="true" scroll-height="400px" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                      paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>暂无信息</template>
            <Column header="域名">
              <template #body="row">
                <span class="text-ellipsis" v-tooltip.top="row.data.cn ? row.data.cn[0] : null">
                  {{ row.data.cn ? row.data.cn[0] : null }}</span>
              </template>
            </Column>
            <Column header="域NetBIOS名">
              <template #body="row">
                <span class="text-ellipsis" v-tooltip.top="row.data.ipantflatname ? row.data.ipantflatname[0] : null">{{ row.data.ipantflatname ? row.data.ipantflatname[0] : null }}</span>
              </template>
            </Column>
            <Column header="域安全标志符">
              <template #body="row">
                <span class="text-ellipsis" v-tooltip.top=" row.data.ipantsecurityidentifier ? row.data.ipantsecurityidentifier[0] : null">{{
                    row.data.ipantsecurityidentifier ? row.data.ipantsecurityidentifier[0] : null
                  }}</span>
              </template>
            </Column>
            <Column header="信任方向">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.trustdirection ? row.data.trustdirection[0] : null }}</span>
              </template>
            </Column>
            <Column header="信任类型">
              <template #body="row">
                <span class="text-ellipsis">{{ row.data.trusttype ? row.data.trusttype[0] : null }}</span>
              </template>
            </Column>
          </data-table>
        </div>
        <div class="page-bottom">
          <p class="name p-mt-3">
            <span>Active Directory全局信任设置</span>
          </p>
          <div class="p-fluid p-mt-3 form-page">
            <div class="p-field p-grid">
              <label class="p-col-fixed">域名：</label>
              <div class="p-col">
                <InputText v-model="form.cn" disabled="disabled"></InputText>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">域NetBIOS名：</label>
              <div class="p-col">
                <InputText v-model="form.ipantflatname" disabled="disabled"></InputText>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">域安全标志符：</label>
              <div class="p-col">
                <InputText v-model="form.ipantsecurityidentifier" disabled="disabled"></InputText>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">域GUID：</label>
              <div class="p-col">
                <InputText v-model="form.ipantdomainguid" disabled="disabled"></InputText>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">回退主要的组：</label>
              <div class="p-col">
                <InputText v-model="form.ipantfallbackprimarygroup" disabled="disabled"></InputText>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">LDAP AD信任代理：</label>
              <div class="p-col">
                <InputText v-model="form.ad_trust_agent_server" disabled="disabled"></InputText>
              </div>
            </div>
            <div class="p-field p-grid">
              <label class="p-col-fixed">LDAP AD信任控制器：</label>
              <div class="p-col">
                <InputText v-model="form.ad_trust_controller_server" disabled="disabled"></InputText>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActiveDirectoryXr",
  data() {
    return {
      root: null,
      expandedKeys: {
        "1-0": true,
      },
      selectedKey: {},
      treeNode: null,
      table: null,
      form: {
        cn: null,
        ipantflatname: null,
        ipantsecurityidentifier: null,
        ipantdomainguid: null,
        ipantfallbackprimarygroup: null,
        ad_trust_agent_server: null,
        ad_trust_controller_server: null,
      },
      query: {
        domainName: null,
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$http.get("/domain/tree").then((res) => {
        let data = res.data.filter(
            (item) => item.type === "0" && item.upStatus === 0
        );
        data.forEach((item) => {
          if (item.pid == null) this.expandedKeys[item.id] = true;
        });
        this.root = this.$global.Tree.makeTree(data, true);
        // let data = res.data;
        // this.root = this.$global.Tree.makeTree(data, true);
        this.selectTreeNode(this.root[0].children[0]);
      });
    },
    clearForm() {
      this.form = {
        cn: null,
        ipantflatname: null,
        ipantsecurityidentifier: null,
        ipantdomainguid: null,
        ipantfallbackprimarygroup: null,
        ad_trust_agent_server: null,
        ad_trust_controller_server: null,
      };
    },
    selectTreeNode(node) {
      this.treeNode = node;
      let id = Number(node.id.split("-")[0]);
      this.table = null;
      this.clearForm();
      this.getList(id);
      this.getForm(id);
    },
    aa() {
      if (JSON.stringify(this.selectedKey) === '{}') {
        let node = this.root[0].children[0]
        let id = Number(node.id.split("-")[0]);
        this.getList(id);
      } else {
        this.getList();
      }
    },
    getList(id) {
      this.$http
          .get("/active_directory/list", {
            params: {
              domainId: id || Object.keys(this.selectedKey)[0].split("-")[0],
              domainName: this.query.domainName,
            },
          })
          .then((res) => {
            this.table = res.data;
          });
    },
    getForm(id) {
      this.$http
          .get("/active_directory/settings", {
            params: {
              domainId: id || Object.keys(this.selectedKey)[0].split("-")[0],
            },
          })
          .then((res) => {
            if (res.data) {
              this.form = res.data;
            }
          });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.p-tree) {
  border: none;
  padding: 1rem;
  height: calc(100% - 60px);
  overflow-y: auto;
}

::v-deep(.p-component:disabled) {
  opacity: 0.9;
}

::v-deep(.p-datatable) {
  .p-datatable-thead {
    tr {
      th {
        white-space: nowrap;
      }
    }
  }

  .p-datatable-tbody {
    tr {
      td {
        white-space: nowrap;
      }
    }
  }
}

.content {
  width: calc(100% - 280px);
  height: 100%;

  .scroll-view {
    height: calc(100% - 51px);
    overflow: auto;
    position: relative;

    .page-bottom {
      position: absolute;
      left: 1rem;
      bottom: 0;
      width: calc(100% - 2rem);
    }
  }

  .table-header {
    display: flex;
    justify-content: flex-end;
  }

  .name {
    border-bottom: 1px solid #dee2e6;

    span {
      padding: 3px 15px;
      display: inline-block;
      border-top: 1px solid #dee2e6;
      border-left: 1px solid #dee2e6;
      border-right: 1px solid #dee2e6;
    }
  }

  .form-page {
    width: 68%;

    .p-grid {
      label {
        width: 180px;
        text-align: right;
        display: inline-block;
      }
    }
  }
}
</style>
