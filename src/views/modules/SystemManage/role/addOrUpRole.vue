<template>
  <Dialog v-model:visible="display" header="添加分配菜单" @hide="$emit('close')" :modal="true" style="width: 30rem;">
    <Tree style="border:none;padding:0" :value="allList" selectionMode="checkbox" v-model:selectionKeys="checkeds" display="chip">
      <template #default="slotProps">
        <b>{{slotProps.node.name}}</b>
      </template>
    </Tree>
    <template #footer>
      <Button @click="display=false" class="p-button-text">取消</Button>
      <Button @click="submit">确认</Button>

    </template>
  </Dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Tree from "primevue/tree";
export default {
  name: "addOrUpdateRole",
  components: { Tree },
  setup: () => ({
    v$: useVuelidate(),
  }),
  data() {
    return {
      checkeds: {},
      display: false,
      submitted: false,
      checked: false,
      form: {
        name: null,
        code: null,
        enable: null,
      },
      isAdd: true,
      allList: null,
      roleId: null,
      nodes: [],
    };
  },
  validations() {
    return {
      form: {
        name: { required },
        code: { required },
        enable: {},
      },
    };
  },
  methods: {
    init(data) {
      this.display = true;
      this.roleId = data.id;
      this.$http.get("/role/getMenuListByRoleId/" + data.id).then((res) => {
        console.log(res.data);
        let list = [];
        if (res.data.allList && res.data.allList.length > 0) {
          res.data.allList.forEach((item) => {
            item.key = item.id;
            if (item.children && item.children.length > 0) {
              item.children.forEach((c) => {
                c.key = c.id;
                if (c.children && c.children.length > 0) {
                  c.children.forEach((d) => {
                    d.key = d.id;
                    if (d.children && d.children.length > 0) {
                      d.children.forEach((e) => {
                        e.key = e.id;
                      });
                    }
                  });
                }
              });
            }
            list.push(item);
          });
          this.allList = list;
        }
        if (res.data.selectedList && res.data.selectedList.length > 0) {
          res.data.selectedList.forEach((item) => {
            this.checkeds[item.resId] = { checked: true };
          });
        }
      });
    },
    submit() {
      for (let i of Object.keys(this.checkeds)) {
        if (i == "undefined") {
          delete this.checkeds[i];
        }
      }
      this.submitted = true;
      let data = {
        roleId: this.roleId,
        menuIds: Object.keys(this.checkeds),
      };
      this.$http.post("/role/addOrUpdateMenuToRole", data).then(() => {
        this.display = false;
      });
    },
  },
};
</script>

<style scoped>
.p-fluid {
  width: 450px;
}

/*.p-fluid {*/
/*  margin: 0 auto 2rem;*/
/*}*/

label {
  width: 200px;
  text-align: right;
  justify-content: flex-end;
}

.p-field > span {
  width: 100%;
  padding-left: 200px;
  line-height: 34px;
  color: red;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
