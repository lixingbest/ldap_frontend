<template>
  <Dialog v-model:visible="display" header="同步明细" @hide="$emit('close')" :modal="true" style="width: 800px;max-height: 550px;">
    <div style="display: flex;justify-content: space-between;">
      <ul class="uul">
        <li v-for="(v,index) in items" :key="index" :class="current_type === index ? 'typeActive' : ''"
            @click="checkoutType(index)">
          {{ v.label }}
        </li>
      </ul>
      <div class="p-mb-3" style="display: flex;justify-content: flex-end;">
        <div class="p-mr-2">
          <label>对象：</label>
          <InputText v-model="name" @keydown.enter="getList()"></InputText>
        </div>
        <div class="p-mr-2">
          <label>更新类型：</label>
          <Dropdown v-model="utype" :options="updateType" optionLabel="name" class="w-full inputWid md:w-14rem"></Dropdown>
        </div>
        <Button @click="getList()">查询</Button>
        <Button style="margin-left: 6px;" @click="clearQuery">清空</Button>
      </div>
    </div>
    <data-table style="margin-top:1rem" :value="table" ref="table" :auto-layout="true" frozenWidth="20rem" :rowHover="true" :scrollable="true" :scroll-height="scrollHeight">
      <template #empty>
        <p style="text-align: center">暂无信息...</p>
      </template>
      <Column header="对象" style="min-width:20rem;">
        <template #body="row">
          <span class="text-ellipsis" v-tooltip.bottom="row.data.name">{{ row.data.name }}</span>
        </template>
      </Column>
      <Column header="更新类型">
        <template #body="row">
          <Tag v-if="row.data.updateType === 0" severity="success" value="新增"></Tag>
          <Tag v-if="row.data.updateType === 1" value="更新"></Tag>
<!--          <span class="text-ellipsis">{{ row.data.updateType }}</span>-->
        </template>
      </Column>
      <Column header="执行时间">
        <template #body="row">
          <span class="text-ellipsis">{{ row.data.time }}</span>
        </template>
      </Column>
      <Column header="执行结果">
        <template #body="row">
          <Tag v-if="row.data.result === 0" severity="success" value="成功"></Tag>
          <Tag v-if="row.data.result === 1" severity="danger" value="失败"></Tag>
<!--          <span class="text-ellipsis">{{ row.data.result }}</span>-->
        </template>
      </Column>
    </data-table>
    <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total" @page="changePage" template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
               :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
    </Paginator>
  </Dialog>
</template>

<script>

export default {
  name: "synchronizeDetails",
  data() {
    return {
      bool: false,
      display: false,
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
      name: null,
      utype: null,
      id: null,
      table: null,
      scrollHeight: "300px",
      current_type : 0,
      items: [
        {label: '组织单位'},
        {label: '域用户'}
      ],
      updateType: [
        {name: '新增', code: '0'},
        {name: '更新', code: '1'}
      ],
    };
  },
  validations() {
    return {
    };
  },
  methods: {
    init(id,tabType) {
      this.display = true;
      this.id = id
      this.checkoutType(tabType)
      this.getList()
    },
    clearQuery(){
      this.name = null;
      this.utype = null;
      this.getList();
    },
    getList() {
      this.$http
          .get("/active_directory/job/details", {
            params: {
              jobId: this.id,
              type: this.current_type,
              current: this.page.current,
              size: this.page.size,
              name: this.name,
              utype: this.utype ? this.utype.code : null
            },
          })
          .then((res) => {
            this.page.total = res.data.total;
            this.table = res.data.records;
            this.table.forEach(item=>{
              let date = new Date(parseInt(item.time));
              item.time = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()}`
            })
          });
    },
    changePage(event) {
      this.page.current = event.page + 1;
      this.page.size = event.rows;
      this.getList(this.id);
    },
    checkoutType(index) {
      this.current_type = index;
      this.getList();
    },
  },
};
</script>

<style scoped>
.uul{
  list-style-type: none;
  display: flex;
  padding: 0;
  margin-top: 0;
}
.uul li{
  padding: 5px;
  font-size: 16px;
  cursor:pointer;
  margin-right: 8px;
}
.typeActive {
  color: #4279dc;
  border-bottom: 1px solid #4279dc;
  /*background-color: #b1aeae;*/
}
</style>
