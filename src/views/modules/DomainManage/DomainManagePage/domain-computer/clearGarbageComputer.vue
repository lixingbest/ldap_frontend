<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "clearGarbageComputer",
  data() {
    return {
      display: false,
      list: [],
      selectedrow: [],
    }
  },
  methods: {
    init() {
      this.display = true;
    },
  }
})
</script>

<template>
  <Dialog v-model:visible="display" :modal="true" header="清理无用主机" @hide="$emit('close')">
    <div class="action-buttons">
      <Button>清理所选</Button>
      <Button>清理清理</Button>
    </div>
    <data-table :value="list" v-model:selection="selectedrow">
      <template #empty>暂无数据</template>
      <column selectionMode="multiple" headerStyle="width: 3rem"></column>
      <column header="主机名"></column>
      <column header="MAC"></column>
      <column header="IP"></column>
      <column header="最后登录用户"></column>
      <column header="最后登录时间"></column>
      <column header="是否入域"></column>
      <column header="无效原因"></column>
    </data-table>
  </Dialog>
</template>

<style scoped lang="scss">
.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 1rem;
  margin-bottom: 1rem;
}

::v-deep(.p-datatable-emptymessage>td) {
  text-align: center !important;
}
</style>
