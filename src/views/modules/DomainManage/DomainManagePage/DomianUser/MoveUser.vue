<template>
  <Dialog v-model:visible="display" :modal="true" header="移动域用户"
          style="width:400px"
          @hide="$emit('close')">

    <tree :value="tree" selectionMode="single"
          @nodeSelect="nodeSelect"
          v-model:selection-keys="selectedKeys"
          :expanded-keys="expendNodes"></tree>

    <template #footer>
      <Button class="p-mr-3" @click="display=false">取消</Button>
      <Button @click="submit">确定</Button>
    </template>
  </Dialog>
</template>
<script>
import {defineComponent} from 'vue'
import log from "@/views/modules/DomainLog/log.vue";


export default defineComponent({
  name: "MoveUser",
  data() {
    return {
      display: false,
      userid: null,
      tree: [],
      expendNodes: {},
      selectedKeys: {},
      domainId: null
    }
  },
  methods: {
    init(domainId, userid) {
      this.domainId = domainId
      this.display = true
      this.userid = userid;
      this.getData()
    },
    nodeSelect(event) {
      console.log(event)
    },
    getData() {
      this.$http.get("/domain/tree").then((res) => {
        let data = res.data.filter(item => item.id.split('-')[1] !== '2');


        let tree = this.$global.Tree.makeTree(data, true);

        this.tree = this.getChildren(tree, this.domainId + '-0')

        this.expendNodes[this.tree[0].key] = true
      })
    },


    getChildren(tree, pid) {
      let res;
      for (let item of tree) {
        if (item.key === pid) {
          res = item.children
          break;
        } else {
          if (item.children && item.children.length > 0) {
            res = this.getChildren(item.children, pid)
          }
        }
      }
      if (res) {
        return res;
      }
    },
    submit() {
      const selectKey = Object.keys(this.selectedKeys)[0]

      this.$http.get("/ou/moveUser", {
        params: {
          ou: selectKey.split("-")[0],
          uid: this.userid,
          domainId: this.domainId
        }
      }).then(res => {
        if (res.success) {
          this.$toast.add({severity: 'success', summary: "移动成功", life: 3000});
          this.display = false
        }
      })
    },
  }
})
</script>
<style scoped lang="scss">
::v-deep(.p-tree) {
  border: none;
}
</style>
