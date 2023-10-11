<template>
  <Dialog v-model:visible="display" header="查看日志" @hide="$emit('close')" :modal="true" style="width: 800px;max-height: 500px;">
    <div v-html="table"></div>
  </Dialog>
</template>

<script>

export default {
  name: "viewLog",
  data() {
    return {
      display: false,
      table: null,
      scrollHeight: "300px",
    };
  },
  validations() {
    return {
    };
  },
  methods: {
    init(id) {
      this.display = true;
      this.id = id
      this.getList()
    },
    getList() {
      this.$http
          .get("/active_directory/job/getLog", {
            params: {
              jobId: this.id
            },
          })
          .then((res) => {
            this.table = res.data;
          });
    }
  },
};
</script>

<style scoped>

</style>
