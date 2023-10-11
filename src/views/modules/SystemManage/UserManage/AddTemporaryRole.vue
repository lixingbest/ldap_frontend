<script>
import {defineComponent} from 'vue'
import {format} from "@/utils/time";

export default defineComponent({
  name: "AddTemporaryRole",
  data() {
    return {
      display: false,
      table: null,
      selectList: null,
      data: {
        formUser: null,
        toUser: null,
        time: null,
      },
      query: {
        name: null,
        telephone: null
      },
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
    }
  },
  methods: {
    init(data) {
      this.display = true;
      this.data.formUser = data.id;
      this.getTable();

    },
    getTable() {
      this.$http
          .get("/admin/list", {
            params: {
              current: this.page.current,
              size: this.page.size,
              organId: "1-0",
              name: this.query.name,
              telephone: this.query.telephone,
            },
          })
          .then((res) => {
            this.page.total = res.data.total;
            this.table = res.data.records;
          });
    },
    changePage(event) {
      this.page.current = event.page + 1;
      this.page.size = event.rows;
      this.getData();
    },
    clearData() {
      this.query = {
        name: null,
        telephone: null,
      };
      this.getTable();
    },
    submit() {


      const list = this.selectList.map(item => item.id).filter(item => item != null && item !== '')

      this.data.time = format(this.data.time)
      this.data.toUser = list.toString();
      this.$http.get("/admin/addTemporaryRole", {
        params: this.data
      }).then(res => {
        if (res.success) {
          this.$toast.add({
            severity: "info",
            summary: "添加成功！ ",
            life: 3000,
          })
          this.display = false
        }
      })
    }
  }
})
</script>

<template>
  <Dialog v-model:visible="display" style="width:50vw" :modal="true" header="委派" @hide="$emit('close')">

    <div class="p-mb-3 p-d-flex p-ai-center">
      <label>
        委派截止时间：
      </label>
      <div class="p-col">
        <Calendar dateFormat="yy-mm-dd" show-time v-model="data.time"></Calendar>
      </div>

    </div>
    <div class="p-mb-3">
      <label>姓名：</label>
      <InputText v-model.trim="query.name" class="p-mr-3" @keyup.enter="getTable"></InputText>
      <label>手机号：</label>
      <InputText class="p-mr-3" v-model.trim="query.telephone" @keyup.enter="getTable"></InputText>
      <Button @click="getTable">搜索</Button>
      <Button class="p-button-outlined p-ml-2" @click="clearData">清空</Button>
    </div>
    <data-table :value="table" v-model:selection="selectList" :rowHover="true" :scrollable="true">
      <template #empty>
        <p style="text-align: center">暂无信息...</p>
      </template>
      <Column selectionMode="multiple" style="min-width: 3rem"></Column>
      <Column header="姓名" field="name" style="min-width: 12rem"></Column>
      <Column header="工号" field="jobno" style="min-width: 8rem"></Column>
      <Column header="所属角色" field="roleName" style="min-width: 6rem"></Column>
      <Column header="类别" field="status" style="min-width: 6rem">
        <template #body="a">
          <span class="p-tag p-tag-danger" v-if="a.data.scope===0">系统级</span>
          <span class="p-tag p-tag-success" v-if="a.data.scope===1">用户级</span>
        </template>
      </Column>
      <Column header="状态" field="status" style="min-width: 5rem">
        <template #body="a">
          <span class="p-tag p-tag-success" v-if="a.data.status===0">启用</span>
          <span class="p-tag p-tag-danger" v-if="a.data.status===1">禁用</span>
        </template>
      </Column>
      <Column header="组织单位" field="ou" style="min-width: 10rem"></Column>
      <Column header="管理域" field="mgtDomain" style="min-width: 10rem"></Column>
      <Column header="部门" field="dept" style="min-width: 6rem"></Column>
      <Column header="手机号" field="telephone" style="min-width: 10rem"></Column>
      <Column header="性别" field="sex" style="min-width: 5em">
        <template #body="a">
          {{ a.data.sex === 0 ? '男' : '女' }}
        </template>
      </Column>
      <Column header="出生日期" field="birthday" style="min-width: 10rem">
        <template #body="a">
          {{ new Date(a.data.birthday).toLocaleDateString().replace(/\//g, '-') }}
        </template>
      </Column>
      <Column header="身份证号" field="idcard" style="min-width: 15rem"></Column>
    </data-table>
    <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total"
               @page="changePage"
               template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
               :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
    </Paginator>

    <template #footer>
      <Button @click="submit" :class="{'p-disabled':!!!selectList || selectList.length===0 || data.time==null}">确定</Button>
    </template>
  </Dialog>
</template>

<style scoped>

</style>
