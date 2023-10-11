<template>
  <Dialog v-model:visible="display" header="添加菜单" @hide="$emit('close')" :modal="true" class="p-fluid">
    <div class="p-fluid" style="padding:0.5rem 0">
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end"><span style="color:red;margin-right: 4px;">*</span>菜单名称：</label>
        <div class="p-col">
          <InputText v-model="form.name" :class="{'p-invalid':(v$.form.name.$invalid && submitted)}"></InputText>
          <span v-if="v$.form.name.required.$invalid && submitted" style="font-size: 12px;color: red">请输入菜单名称</span>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end"><span style="color:red;margin-right: 4px;margin-top:10px">*</span>类型：</label>
        <div class="p-col">
          <div style="display:flex;flex-wrap:wrap">
            <p class="p-mr-3" v-for="(item,index) in allList" :key="index" style="margin-top:10px">
              <RadioButton name="menu" :value="item.id" v-model="form.type" @click="cli(item.id)" />
              {{ item.name }}
            </p>
          </div>
          <span v-if="v$.form.type.required.$invalid && submitted" style="font-size: 12px;color: red">请选择类型</span>
        </div>
      </div>
      <div class="p-field p-grid" v-if="bool">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end">父级目录</label>
        <div class="p-col">
          <TreeSelect v-model="selectedCity" :options="cities" @node-select="selectNode">
          </TreeSelect>
        </div>
      </div>
      <div class="p-field p-grid" v-if="bool">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end">URL地址：</label>
        <div class="p-col">
          <InputText v-model="form.url"></InputText>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end">
          <span style="color:red;margin-right: 4px;">*</span>
          编码：</label>
        <div class="p-col">
          <InputText v-model="form.code"></InputText>
          <span v-if="v$.form.code.required.$invalid && submitted" style="font-size: 12px;color: red">请输入编码</span>
        </div>
      </div>
      <div class="p-field p-grid" v-if="form.type!=2">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end"> 图标名称：</label>
        <div class="p-col">
          <!-- <InputText v-model="form.icon" :class="{'p-invalid':(v$.form.icon.$invalid && submitted)}"></InputText> -->
          <Dropdown id="icon" v-model="form.icon" @show="changeStyle" :options="iconList" option-label="value" option-value="value">
            <template #option="data">
              <span :class="data.option.value"></span>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end">上下文提示：</label>
        <div class="p-col">
          <InputText v-model="form.tooltip"></InputText>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end"><span style="color:red;margin-right: 4px;">*</span>排序索引：</label>
        <div class="p-col">
          <InputNumber v-model="form.idx" :class="{'p-invalid':isNaN(Number(form.idx)) ||(v$.form.idx.$invalid && submitted)}"></InputNumber>
          <span v-if="v$.form.idx.required.$invalid && submitted" style="font-size: 12px;color: red">请输入排序索引</span>
          <span v-if="isNaN(Number(form.idx))">请输入数字</span>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed" style="width:120px;justify-content: flex-end"><span style="color:red;margin-right: 4px;">*</span>是否启用：</label>
        <div class="p-col">
          <Checkbox v-model="checked" :binary="true" />
        </div>
      </div>

    </div>
    <template #footer>
      <Button class="p-button-text" @click="disp">取消</Button>
      <Button @click="submit(v$.$invalid)">保存</Button>
    </template>
  </Dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import Dropdown from "primevue/dropdown";
import icon from "@/views/iconList";

export default {
  name: "addOrUpdateMenus",
  components: { Checkbox, RadioButton, Dropdown },
  setup: () => ({
    v$: useVuelidate(),
  }),
  data() {
    return {
      selectedCity: null,
      cities: null,
      allList: [
        { id: 1, name: "目录" },
        { id: 0, name: "菜单" },
        // { id: 2, name: '按钮' },
      ],
      bool: false,
      display: false,
      submitted: false,
      checked: false,
      iconList: icon,
      form: {
        name: null,
        type: null,
        url: null,
        icon: null,
        idx: null,
        enable: null,
        pid: null,
        code: null,
        tooltip: null,
      },
      isAdd: true,
    };
  },
  validations() {
    return {
      form: {
        name: { required },
        type: { required },
        icon: {},
        idx: { required },
        enable: {},
        code: { required },
        tooltip: {},
      },
    };
  },
  methods: {
    selectNode(node) {
      this.form.pid = node.key;
    },
    init(data) {
      this.display = true;
      if (data && data.enable == 0) {
        this.checked = true;
      } else if (data && data.enable == 1) {
        this.checked = false;
      }

      if (data) {
        this.form = JSON.parse(JSON.stringify(data));
      }
      if (data && data.id) {
        this.isAdd = false;
      }
    },
    changeStyle() {
      let node = document.getElementsByClassName("p-dropdown-items")[0];
      node.style.display = "flex";
      node.style.flexWrap = "wrap";
      let w = document.getElementById("icon").clientWidth;

      let node0 = document.getElementsByClassName(
        "p-dropdown-items-wrapper"
      )[0];
      node0.style.width = w + "px";

      //let nodes = document.getElementsByClassName('p-dropdown-item')
      // for (let i = 0; i < nodes.length; i++) {
      //   nodes[i].style.width = '10%'
      // }
    },
    cli(id) {
      if (id == 0) {
        this.bool = true;
        // console.log(m.selectedCity)
        this.$http.get("/resource/getListByAddOrUpdate").then((res) => {
          this.cities = res.data.records;
        });
      } else if (id == 2) {
        this.bool = true;
        // console.log(m.selectedCity)
        this.$http.get("/resource/getListByAddOrUpdate").then((res) => {
          this.cities = res.data.records;
        });
      } else {
        this.bool = false;
      }
    },
    submit(isInvalid) {
      this.submitted = true;
      if (isInvalid || isNaN(Number(this.form.idx))) {
        return;
      }

      if (this.form.enable == "启用") {
        this.form.enable = 0;
      } else if (this.form.enable == "禁用") {
        this.form.enable = 1;
      }
      if (this.form.enable == true) {
        this.form.enable = 0;
      } else if (this.form.enable == false) {
        this.form.enable = 1;
      }
      if (this.checked == true) {
        this.form.enable = 0;
      } else if (this.checked == false) {
        this.form.enable = 1;
      }
      this.$http
        .post("/resource/addOrUpdate", this.form)
        .then((res) => {
          if (res.success) {
            this.display = false;
            this.$toast.add({
              severity: "success",
              summary: this.isAdd ? "添加成功" : "修改成功",
              life: 3000,
            });
          } 
        })
    },
    disp() {
      this.display = false;
    },
  },
};
</script>

<style scoped>
.p-fluid {
  width: 450px;
}

/*.p-field {*/
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
