<template>
  <div style="height:100%">
    <Tree :value="root" selection-mode="single" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey" @node-select="onNodeSelect" @node-unselect="onNodeUnselect">
      <template #default="data">
        <div style="height: 100%;line-height: 2rem" @contextmenu.prevent="onContextmenu($event,data.node)">
          {{ data.node.label }}
        </div>
      </template>
    </Tree>
    <ContextMenu ref="menu" :model="action" />
    <add-or-update-device v-if="addOrUpdateDeviceDisplay" ref="addOrUpdateDevice" v-on:close="closeDialog"></add-or-update-device>
  </div>
</template>

<script>
import AddOrUpdateDevice from "@/views/modules/GroupTactics/Devices/components/add-or-update-device";

let _this = null;
export default {
  name: "domain-tree",
  components: { AddOrUpdateDevice },
  data() {
    return {
      root: null,
      expandedKeys: {},
      selectedNode: null,
      contextNode: null,
      selectedKey: null,
      addOrUpdateDeviceDisplay: false,
      treeData: null,
      action: [
        {
          label: "新建策略配置",
          icon: "pi pi-tag",
          visible: false,
          command: () => {
            _this.addOrUpdateDevice(true, 1);
          },
        },
        {
          label: "新建目录",
          icon: "pi pi-folder",
          visible: false,
          command: () => {
            _this.addOrUpdateDevice(true, 0);
          },
        },
        {
          label: "编辑",
          icon: "pi pi-pencil",
          visible: false,
          command: () => {
            _this.addOrUpdateDevice(false);
          },
        },
        {
          label: "删除",
          icon: "pi pi-times-circle",
          visible: false,
          style: { color: "red" },
          command: () => {
            _this.delete();
          },
        },
      ],
    };
  },
  computed: {
    device_save_flag() {
      return this.$store.state.device_save_flag;
    },
  },
  watch: {
    device_save_flag() {
      this.changeDevice();
    },
  },
  mounted() {
    _this = this;
    this.getData();
  },
  methods: {
    getData() {
      this.$http.get("/strategy/settings/list").then((res) => {
        this.treeData = res.data;
        let data = res.data;
        this.root = this.$global.Tree.makeTree(data, true);
        if (this.root[0] && this.root[0].id) {
          this.expandedKeys[this.root[0].id] = true;
        }
      });
    },

    closeDialog() {
      this.addOrUpdateDeviceDisplay = false;
      this.getData();
    },
    async changeDevice() {
      await this.$http
        .get("/strategy/settings/getValues", {
          params: {
            strategyId: this.selectedNode.id,
          },
        })
        .then((res) => {
          localStorage.setItem("device", JSON.stringify(res.data));
          this.$store.commit("changeDeviceFlag");
        });
    },
    async onNodeSelect(node) {
      this.$emit("policy", node.id);
      this.selectedNode = node;
      if (node.type === "strategy") {
        await this.$http
          .get("/strategy/settings/getValues", {
            params: {
              strategyId: node.id,
            },
          })
          .then((res) => {
            localStorage.setItem("device", JSON.stringify(res.data));
          });
        await this.$router.push("/GroupTactics/desktop-background-img");
      } else {
        localStorage.removeItem("device");
        await this.$router.push("/GroupTactics/device-main");
      }
      localStorage.setItem("selectedNode", JSON.stringify(node));
      this.$store.commit("changeDeviceFlag");
    },
    onNodeUnselect() {
      this.selectedNode = null;
    },
    onContextmenu(event, node) {
      this.contextNode = node;

      node.type === "domain"
        ? (this.action[3].visible = false)
        : (this.action[3].visible = true);
      node.type === "domain"
        ? (this.action[2].visible = false)
        : (this.action[2].visible = true);

      node.type === "strategy"
        ? (this.action[0].visible = false)
        : (this.action[0].visible = true);
      node.type === "strategy"
        ? (this.action[1].visible = false)
        : (this.action[1].visible = true);

      this.$refs.menu.show(event);
    },
    addOrUpdateDevice(isAdd, type) {
      let data = null;
      if (isAdd) {
        data = {
          type: type,
          domainId:
            this.contextNode.type === "domain"
              ? this.contextNode.id.split("_")[1]
              : this.searchDomainId(this.contextNode.id, null),
          id: this.contextNode.id,
          sign: this.contextNode.type,
        };
      } else {
        data = this.contextNode;
      }
      this.addOrUpdateDeviceDisplay = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateDevice.init(isAdd, data);
      });
    },
    searchDomainId(id, res) {
      for (let i = 0; i < this.treeData.length; i++) {
        let item = this.treeData[i];
        if (item.id === id) {
          if (item.type === "domain") {
            res = item.id.split("_")[1];
            break;
          } else {
            return this.searchDomainId(item.pid, res);
          }
        }
      }
      return res;
    },
    delete() {
      this.$confirm.require({
        message:
          this.contextNode.type === "strategy"
            ? "您确定要删除此策略？"
            : "您确定要删除此目录？",
        header: this.contextNode.type === "strategy" ? "删除策略" : "删除目录",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          this.$http
            .get("/strategy/settings/delete", {
              params: {
                id: this.contextNode.id,
              },
            })
            .then(() => {
              this.$toast.add({
                severity: "info",
                summary: "删除成功！",
                life: 3000,
              });
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
.p-tree {
  border: none;
  height: calc(100% - 50px);
  overflow-y: auto;
}

::v-deep(.p-treenode-label) {
  flex: 1;
  height: 2rem;
  padding: 0 !important;
}
</style>
