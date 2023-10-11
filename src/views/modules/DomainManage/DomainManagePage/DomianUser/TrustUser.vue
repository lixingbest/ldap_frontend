<template>
  <Sidebar v-model:visible="display" style="width: 500px" @hide="closeDialog" position="right" :showCloseIcon="false">

    <h4>信任"{{ parentNode.uid[0] }}"的域</h4>

    <Tree :value="nodes" selectionMode="checkbox" @node-select="selectNode" @node-unselect="selectNode" v-model:selectionKeys="selectionKeys"></Tree>
    <Button class="p-mt-3" @click="submit">提交</Button>

  </Sidebar>
</template>

<script>
export default {
  name: "TrustUser",
  data() {
    return {
      display: false,
      selectionKeys: {},
      nodes: null,
      parentNode: null,
      ouList: [],
    };
  },
  methods: {
    closeDialog() {
      this.display = false;
      this.$emit("close");
    },
    init(item) {
      this.display = true;

      this.parentNode = item;
      this.getData();
    },
    getData() {
      this.$http
        .get("/trust/tree", {
          params: {
            domainId: this.parentNode.DCID,
            uid: this.parentNode.uid[0],
          },
        })
        .then((res) => {
          let data = res.data;
          let _this = this;
          data.forEach((item) => {
            if (item.checked === "true") {
              _this.selectionKeys[item.id] = {
                checked: true,
                partialChecked: false,
              };
            }
          });
          console.log(data);
          this.nodes = this.$global.Tree.makeTree(data);
        });
    },
    selectNode() {
      let keys = Object.keys(this.selectionKeys);
      this.ouList = [];
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key.indexOf("-") !== -1 && this.selectionKeys[key].checked) {
          this.ouList.push(key.split("-")[0]);
        }
      }
    },
    submit() {
      this.$http
        .get("/trust/trustUser", {
          params: {
            domainIds: this.ouList.toString(),
            currDomainId: this.parentNode.DCID,
            currOUId: this.parentNode.OUID,
            currUId: this.parentNode.uid[0],
            domainId: this.parentNode.DCID,
          },
        })
        .then(() => {
          this.$toast.add({
            severity: "info",
            summary: "提交成功！ ",
            life: 3000,
          });
          this.closeDialog();
        });
    },
  },
};
</script>

<style scoped>
::v-deep(.p-tree) {
  border: none !important;
  height: calc(100% - 60px);
  overflow-y: auto;
}

::v-deep(
    .p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight
  ) {
  background-color: #ffffff;
}
</style>
