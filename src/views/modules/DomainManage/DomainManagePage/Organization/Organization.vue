<template>
  <div>
    <div class="table-title">
      <Button @click="addOrUpdate">新建组织单位</Button>
      <div class="from">
        <div class="form-item p-mr-3">
          <label>名称：</label>
          <InputText class="inout-t"></InputText>
        </div>
        <Button>查询</Button>
      </div>
    </div>
    <TreeTable style="margin-top: 10px;" :rowHover="true" :value="list"
               :auto-layout="true"
               :rows="10" :paginator="true">
      <template #empty>
        <p style="text-align: center">暂无信息...</p>
      </template>
      <Column field="name" header="机构名称" :expander="true"></Column>
      <Column header="地址">
        <template #body="a">
          {{ a.node.data.province ? a.node.data.province : '' }} {{ a.node.data.city ? a.node.data.city : '' }}
          {{ a.node.data.district ? a.node.data.district : '' }} {{ a.node.data.address ? a.node.data.address : '' }}
        </template>
      </Column>
      <Column field="comments" header="描述"></Column>
      <Column header="操作">
        <template #body="a">
          <Button class="p-button-link " @click="domainUser(a.node.data)">管理用户</Button>
          <Button class="p-button-link " @click="addOrUpdate(a.node.data)">编辑</Button>
          <Button class="p-button-link" style="color: red" @click="deleteDialog(a.node)">删除</Button>
        </template>
      </Column>
    </TreeTable>
  </div>
  <Dialog v-model:visible="deleteDisplay"
          @hide="deleteDisplay=false" header="删除组">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
      <span>您确认要删除组织单位 "{{ deleteItem.data.name }}" 吗？</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="submitDelete" class="p-button-link"/>
      <Button label="否" icon="pi pi-times" @click="deleteDisplay=false" class="p-button-secondary p-button-link"/>
    </template>
  </Dialog>
  <CreateAgencies v-if="createDisplay" ref="CreateAgencies" v-on:close="closeDialog"></CreateAgencies>
  <DomainUserDialog v-if="domainUserDisplay" ref="domainUser" v-on:close="closeDialog"></DomainUserDialog>
</template>

<script>
import CreateAgencies from "@/views/modules/DomainManage/DomainManagePage/Organization/CreateAgencies";
import DomainUserDialog from "@/views/modules/DomainManage/DomainManagePage/Organization/DomainUserDialog";

export default {
  name: "Organization",
  emits: ['close'],
  components: {CreateAgencies, DomainUserDialog},
  data() {
    return {
      deleteDisplay: false,
      deleteItem: null,
      createDisplay: false,
      domainUserDisplay: false,
      list: null,
      page: {
        current: 1,
        size: 10,
        total: 0,
      }
    }
  },
  mounted() {
    this.getData()
  },
  props: ['domainId','treeData'],
  watch: {
    domainId() {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$http.get('/ou/treeByDomain', {
        params: {
          domainId: this.domainId.split('-')[0],
        }
      }).then((res) => {
        console.log(res.data)
        this.list = this.makeTree(res.data)
      })
    },
    changePage(event) {
      this.page.current = event.page + 1
      this.getData()
    },
    addOrUpdate(data) {
      this.createDisplay = true
      this.$nextTick(() => {
        this.$refs.CreateAgencies.init(data)
      })
    },
    closeDialog() {
      this.domainUserDisplay = false
      this.createDisplay = false
      this.getData()
      this.$emit('close')
    },

    deleteDialog(item) {
      this.deleteDisplay = true
      this.deleteItem = item
    },
    submitDelete() {
      this.$http.get('/ou/remove', {
        params: {
          domainId: this.domainId.split('-')[1] == 0 ? this.domainId.split('-')[0] : this.$global.Tree.searchDomainId(this.treeData, this.domainId.split('-')[0], null),
          ids: this.deleteItem.key.split('-')[0]
        }
      }).then(() => {
        this.deleteDisplay = false
        this.$toast.add({severity: 'info', summary: '删除成功！ ', life: 3000});
        this.getData()
        this.$emit('close')
      })
    },
    domainUser(data) {
      this.domainUserDisplay = true
      this.$nextTick(() => {
        this.$refs.domainUser.init(data)
      })
    },
    makeTree(data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        delete item.children;
        item.label = item.name
        item.data = JSON.parse(item.data)
        if (item.type == '0') {
          item.icon = 'fa fa-globe'
        } else if (item.type == '1') {
          item.icon = 'fa fa-sitemap'
        }
      });

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      let map = {};
      data.forEach(function (item) {
        map[item.key] = item;
      });
      let val = [];
      data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        let parent = map[item.pid];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
        }
      });
      return val;
    }
  }

}
</script>

<style scoped>

.table-title {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
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

::v-deep(.p-treetable .p-treetable-thead > tr > th) {
  text-align: center
}

::v-deep(.p-treetable .p-treetable-tbody > tr > td) {
  text-align: center
}

::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}
</style>
