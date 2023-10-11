<template>
  <Tree :value="root" :expanded-keys="{1:true,2:true,6:true,11:true}" selection-mode="single" v-model:selectionKeys="selectedKey" @node-select="onNodeSelect"></Tree>
</template>

<script>
export default {
  name: "device-type",
  data() {
    return {
      root: [
        {
          key: 1,
          label: "控制面板",
          icon: "pi pi-cog",
          children: [
            {
              key: 2,
              label: "个性化",
              icon: "pi pi-star",
              children: [
                {
                  key: 3,
                  label: "背景桌面",
                  url: "/GroupTactics/desktop-background-img",
                },
                {
                  key: 4,
                  label: "屏幕保护程序",
                  url: "/GroupTactics/screen-saver",
                },
                // {
                //   key: 5,
                //   label: "锁屏",
                //   url: "/GroupTactics/lock-screen",
                // },
              ],
            },
            {
              key: 6,
              label: "安全",
              icon: "pi pi-shield",
              children: [
                {
                  key: 7,
                  label: "网络保护",
                  url: "/GroupTactics/network-protection",
                },
                // {
                //   key: 8,
                //   label: '系统更新',
                //   // icon: 'pi pi-sync'
                // },
                // {
                //   key: 9,
                //   label: "应用控制与保护",
                //   url: "/GroupTactics/apply-control-protection",
                // },
                {
                  key: 10,
                  label: "账号安全",
                  url: "/GroupTactics/account-security",
                },
              ],
            },
            {
              key: 11,
              label: "网络",
              icon: "pi pi-globe",
              children: [
                {
                  key: 12,
                  label: "共享桌面",
                  url: "/GroupTactics/desktop-share",
                },
              ],
            },
          ],
        },
      ],
      selectedKey: {},
      selectedNode: null,
    };
  },
  computed: {
    device_flag() {
      return this.$store.state.device_flag;
    },
  },
  watch: {
    device_flag() {
      this.searchKey();
    },
  },
  mounted() {
    this.searchKey();
  },
  methods: {
    searchKey() {
      let e = this.$route;
      this.selectedKey = {};
      this.root.forEach((item) => {
        if (item["url"] && e.path.includes(item["url"])) {
          this.selectedKey[item.key] = true;
        } else if (item.children) {
          item.children.forEach((i) => {
            if (i.url && e.path.includes(i.url)) {
              this.selectedKey[i.key] = true;
            } else if (i.children) {
              i.children.forEach((j) => {
                if (j.url && e.path.includes(j.url)) {
                  this.selectedKey[j.key] = true;
                }
              });
            }
          });
        }
      });
    },
    onNodeSelect(node) {
      if (node && node.url) this.$router.push(node.url);
    },
  },
};
</script>

<style scoped>
.p-tree {
  border: none;
  height: 100%;
  overflow-y: auto;
}

::v-deep(p-tree-toggler) {
  margin: 0;
}
</style>
