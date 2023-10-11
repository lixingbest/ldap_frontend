<template>
  <div class="page">
    <div class="border-r">
      <p class="title">消息通知</p>
      <tree :value="root" selectionMode="single"
            :expandedKeys="expandedKeys"
            v-model:selectionKeys="selectedKeys"></tree>
    </div>
    <div class="content">
      <div class="p-pb-3">
        <Button @click="sendMessage">发送消息</Button>
      </div>

      <DataTable :value="list" :scrollable="true">
        <template #empty>
          <div class="p-text-center">暂无数据</div>
        </template>
        <column header="标题" field="title" style="min-width:12rem;"></column>
        <column header="发布时间" field="time" style="min-width:16rem;"></column>
        <column header="发布人" field="userName" style="min-width:16rem;"></column>
        <column header="发送类型" style="min-width:16rem;">
          <template #body="row">
            <span class="p-tag p-tag-info">{{ row.data.type === 0 ? '立即发送' : "定时发送" }}</span>
          </template>
        </column>
        <column header="发送时间" field="sendTime" style="min-width:16rem;"></column>
        <column header="接受者类型" style="min-width:16rem;">
          <template #body="row">
            <span class="p-tag p-tag-info">{{ row.data.receiverType === 0 ? '组织单位' : "终端" }}</span>
          </template>
        </column>
        <column header="操作" :frozen="true"  align-frozen="right" style="min-width:16rem;">
          <template #body="row">
            <Button class="p-button-link" label="内容" @click="()=>{predisplay=true;contentItem=row.data.content}"/>
            <Button class="p-button-link" label="接收者" @click="showReceiver(row.data)"/>
            <Button class="p-button-link" style="color:red;" label="删除" @click="deleteById(row.data)"></Button>
          </template>
        </column>
      </DataTable>
      <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage"
                 template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                 :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
      </Paginator>
    </div>

    <Dialog v-model:visible="predisplay" style="width: 40vw;" header="内容" @hide="()=>{predisplay=false;contentItem=null}" :modal="true">
      <div v-html="contentItem"></div>
    </Dialog>

    <Dialog v-model:visible="receiverdisplay" style="width: 50vw;" header="接受者" @hide="()=>{receiverdisplay=false;contentItem=null}"
            :modal="true">
      <DataTable :value="receiverList" class="p-datatable-gridlines">
        <column header="名称" field="name"></column>
        <column header="客户端接收" field="isRecv">
          <template #body="row">
            {{row.data.isRecv===0?'未接收':'已接收'}}
          </template>
        </column>
        <column header="客户端接收时间" field="recvTime"></column>
      </DataTable>
    </Dialog>

    <add-or-update-message v-if="sendMessageDisplay" ref="setmessage" @close="closemessage"></add-or-update-message>

  </div>
</template>
<script>
import {defineComponent} from 'vue'
import AddOrUpdateMessage from "@/views/modules/DeploymentPlan/MessageNotice/addOrUpdateMessage.vue";



export default defineComponent({
  name: "index",
  components: {
    AddOrUpdateMessage

  },
  data() {
    return {
      root: null,
      treeData: null,
      expandedKeys: {},
      selectedKeys: {},
      sendMessageDisplay: false,
      list: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      contentItem: null,
      predisplay: false,
      receiverdisplay: false,
      receiverList: []
    }
  },
  mounted() {
    this.getData();
    this.getMessagePage()
  },
  methods: {
    getData() {
      this.$http.get("/domain/tree").then((res) => {
        this.treeData = res.data;
        let data = res.data.filter(
            (item) => item.type === "0" && item.upStatus === 0
        );
        data.forEach((item) => {
          if (item.pid == null) this.expandedKeys[item.id] = true;
        });
        this.root = this.$global.Tree.makeTree(data, true);

        this.selectedKeys[this.root[0].key] = true;
      });
    },
    sendMessage() {
      const domainId = Object.keys(this.selectedKeys)[0].split("-")[0]

      this.sendMessageDisplay = true;
      this.$nextTick(() => {
        this.$refs.setmessage.init(domainId)
      })
    },
    closemessage() {
      this.sendMessageDisplay = false;
      this.getMessagePage()
    },
    getMessagePage() {
      this.$http.get('/message/page', {
        params: {
          current: this.page.current,
          size: this.page.size,
        }
      }).then(res => {
        this.list = res.data.records;
        this.page.total = res.data.total;
      })
    },
    changePage(page) {
      this.page.current = page.page + 1;
      this.page.size = page.rows;
      this.getMessagePage();
    },
    deleteById(data){
      this.$confirm.require({
        message: "确定要删除此消息？",
        header: "删除消息",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          this.$http.delete('/message/'+data.id).then(res=>{
            if(res.success){
              this.$toast.add({
                severity: "info",
                summary: "成功！ ",
                life: 3000,
              });
              this.getMessagePage()
            }
          })
        },
        reject:()=>{
          this.$confirm.close()
        }
      })

    },
    showReceiver(data){
      this.contentItem=data;
      this.receiverdisplay=true

      const domainId = Object.keys(this.selectedKeys)[0].split("-")[0]

      this.$http.get('/message/'+data.id).then(response=> {
        if (data.receiverType === 0) {
          this.$http.get("/domain/tree").then((res) => {
            let list = res.data
            this.receiverList = response.data.receiverList
            for (let item of this.receiverList) {
              const ref = list.filter(it => it.id === (item.refId + '-1'))[0]
              item.name = ref.name;
            }
          })
        } else {
          this.$http.get('/host/list', {
            params: {domainId: domainId}
          }).then(res => {

            this.receiverList = response.data.receiverList
            for (let item of this.receiverList) {
              const ref = res.data.filter(it => it.fqdn[0] === (item.refId))[0]
              item.name = ref.fqdn[0];
            }
          })
        }
      })
    }

  }
})
</script>
<style scoped lang="scss">
.page {
  ::v-deep(.p-tree) {
    border: none;
  }

  .content {
    width: calc(100% - 280px);
    height: 100%;
    padding: 1rem;
  }
}
</style>
