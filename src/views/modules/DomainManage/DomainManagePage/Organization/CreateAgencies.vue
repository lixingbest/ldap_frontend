<template>
  <Sidebar style="width: 600px" @hide="closeDialog" position="right" :showCloseIcon="false" v-model:visible="show">
    <template #header>
      <h4>{{ from.id == null ? '新建' : '编辑' }}组织单位（OU）</h4>
    </template>
    <div class="p-fluid content">
      <form @submit.prevent="submit(v$.$invalid)" class="content">
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>父级：</label>
          <div class="p-col">
            <TreeSelect v-model="treeSelect" :class="{'p-invalid':v$.treeSelect.$invalid && from.$submitted}" @change="changTree" :options="treeList" placeholder="请选择父域" />
            <small class="p-error" v-if="v$.treeSelect.required.$invalid && from.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed"><label class="required">*</label>组织单位名称：</label>
          <div class="p-col">
            <InputText v-model="from.name" placeholder="必填项" :class="{'p-invalid':v$.from.name.$invalid && from.$submitted}"></InputText>
            <small class="p-error" v-if="v$.from.name.required.$invalid && from.$submitted">此项为必填项！</small>
          </div>
        </div>
        <div class="p-field p-grid" style="flex-wrap: nowrap">
          <label class="p-col-fixed" style="align-items: flex-start">地址：</label>
          <div style="width:calc(100% - 130px - 0.5rem);padding-left: 0.5rem">
            <div style="display: flex;width: 100%" class="p-field">
              <Dropdown class="p-mr-2" v-model="from.province" @change="changeAddress('p')" :options="provinceList" optionLabel="name" option-value="name" placeholder="--省--"></Dropdown>
              <Dropdown class="p-mr-2" v-model="from.city" @change="changeAddress('c')" :options="cityList" optionLabel="name" option-value="name" placeholder="--市--"></Dropdown>
              <Dropdown v-model="from.district" :options="areaList" optionLabel="name" option-value="name" placeholder="--区--"></Dropdown>
            </div>
            <InputText v-model="from.address" placeholder="详细地址"></InputText>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed">邮政编码：</label>
          <div class="p-col">
            <InputText v-model="from.postalCode"></InputText>
          </div>
        </div>

        <div class="p-field p-grid">
          <label class="p-col-fixed" style="align-items: flex-start">描述：</label>
          <div class="p-col">
            <Textarea v-model="from.comments" />
          </div>
        </div>
        <div class="p-field p-grid footer">
          <div style="display: flex">
            <Button class="p-button-outlined p-mr-2" @click="closeDialog">取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </div>
      </form>
    </div>
  </Sidebar>
</template>

<script>
import address from "../../../../../assets/data/address.json";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "CreateDomainCon",
  emits: ["close"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      address,
      show: false,
      treeList: [],
      treeSelect: {},
      from: {
        dn: null,
        domainId: null,
        id: null,
        pid: null,
        pidType: null,
        name: null,
        province: null,
        city: null,
        address: null,
        district: null,
        postalCode: null,
        comments: null,
        delProtect: null,
        $submitted: false,
      },
      provinceList: [],
      cityList: [],
      areaList: [],
      isAdd: true,
    };
  },
  validations() {
    return {
      treeSelect: { required },
      from: {
        domainId: {},
        id: {},
        pid: {},
        pidType: {},
        name: { required },
        province: {},
        city: {},
        district: {},
        postalCode: {},
        address: {},
        comments: {},
        delProtect: {},
        $submitted: {},
      },
    };
  },
  mounted() {
    this.provinceList = this.address.province;
    this.$http.get("/domain/tree").then((res) => {
      let data = [];
      let _this = this;
      res.data.forEach((item) => {
        if (item.type == "0" && item.upStatus === 0) {
          data.push(item);
        } else if (
          item.type == "1" &&
          _this.$global.Tree.ouStatus(res.data, item.id, null) == 0
        ) {
          data.push(item);
        }
      });
      this.treeList = this.$global.Tree.makeTree(data);
    });
  },
  methods: {
    init(isAdd, domain, domainId) {
      this.show = true;
      this.isAdd = isAdd;
      if (isAdd) {
        this.$http
          .get("/ou/get", {
            params: {
              id: domain.id.split("-")[0],
            },
          })
          .then((res) => {
            let data = res.data;
            this.from = data;
            this.from.delProtect = data.delProtect === 1;
            let treeId = data.pid + "-" + data.pidType;
            this.treeSelect[treeId] = true;
            this.changeAddress("p");
            this.changeAddress("c");
            this.from.domainId = domainId;
          });
      } else {
        this.from.dn = domain.dn;
        this.from.pid = domain.id.split("-")[0];
        this.from.pidType = domain.id.split("-")[1];
        this.treeSelect[domain.id] = true;
        this.from.domainId = domainId;
      }
    },
    changTree(event) {
      this.from.pid = JSON.stringify(event).split("-")[0].substring(2);
      this.from.pidType = JSON.stringify(event).split("-")[1].substring(0, 1);
    },
    closeDialog() {
      this.show = false;
      this.$emit("close");
    },
    changeAddress(item) {
      if (item === "p") {
        let p = this.address.province.filter((item) => {
          if (item.name === this.from.province) {
            return item;
          }
        });
        this.cityList = p[0].cities.city;
      } else if (item === "c") {
        let c = this.cityList.filter((item) => {
          if (item.name === this.from.city) {
            return item;
          }
        });
        this.areaList = c[0].areas.area;
      }
    },
    submit(isInvalid) {
      if (this.isAdd) {
        //编辑
        let arr = [];
        this.from.dn.split(",").forEach((item) => {
          arr.push(item);
        });
        arr.splice(0, 1, "OU=" + this.from.name);
        this.from.dn = arr.join(",");
      } else {
        //新增
        this.from.dn = "OU=" + this.from.name + "," + this.from.dn;
      }
      this.from.$submitted = true;
      // 如果验证失败，则终止
      if (isInvalid) {
        return;
      }
      if (this.from.delProtect) {
        this.from.delProtect = 1;
      } else {
        this.from.delProtect = 0;
      }

      this.$http.get("/ou/saveOrUpdate", { params: this.from }).then(() => {
        if (this.isAdd) {
          this.$toast.add({
            severity: "info",
            summary: "添加成功！ ",
            life: 3000,
          });
        } else {
          this.$toast.add({
            severity: "info",
            summary: "修改成功！ ",
            life: 3000,
          });
        }
        this.closeDialog();
      });
    },
  },
};
</script>

<style scoped>
.p-grid > label {
  width: 130px;
  justify-content: flex-end;
}

.p-fluid .p-button {
  width: auto;
}

.p-field {
  width: 90%;
}

.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
