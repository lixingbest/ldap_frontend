<template>
  <Sidebar position="right" :showCloseIcon="true" style="width: 650px" v-model:visible="display" @hide="$emit('close')">
    <template #header><strong>添加命令</strong></template>
    <div class="form" @click="clearBox">
      <div class="form-item">
        <label><i class="required">*</i>命令名称：</label>
        <div class="p-col">
          <InputText v-model="data.form.name" :class="{'p-invalid':data.submitted && v$.form.name.$invalid }"></InputText>
          <small class="p-error" v-if="data.submitted && v$.form.name.required.$invalid">请输入名称</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>命令编码：</label>
        <div class="p-col">
          <InputText v-model="data.form.code" :class="{'p-invalid':data.submitted && v$.form.code.$invalid }"></InputText>
          <small class="p-error" v-if="data.submitted && v$.form.code.requiredIf.$invalid">请输入编码</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>命令说明：</label>
        <div class="p-col">
          <Textarea v-model="data.form.comments" auto-resize :class="{'p-invalid':data.submitted && v$.form.comments.$invalid }"></Textarea>
          <small class="p-error" v-if="data.submitted && v$.form.comments.$invalid">请输入命令说明</small>
        </div>
      </div>
      <!-- <div class="form-item">
        <label>命令说明：</label>
        <div class="p-col">
          <Textarea v-model="data.form.comments" auto-resize
          ></Textarea>
        </div>
      </div> -->
      <div class="form-item">
        <label><i class="required">*</i>命令分类：</label>
        <div class="p-col">
          <tree-select v-model="data.selectedType" :options="data.typeTreeData" :class="{'p-invalid':data.submitted && v$.selectedType.$invalid }"></tree-select>
          <small class="p-error" v-if="data.submitted && v$.selectedType.ObjectNotNull.$invalid">请选择类型</small>
        </div>
      </div>

      <div class="form-item">
        <label><i class="required">*</i>命令内容：</label>
        <div class="p-col">
          <Textarea v-model="data.form.command" auto-resize :class="{'p-invalid':data.submitted && v$.form.command.$invalid }"></Textarea>
          <small class="p-error" v-if="data.submitted && v$.form.command.required.$invalid">请输入内容</small>
        </div>
      </div>

      <div class="form-item">
        <label><i class="required">*</i>命令用途：</label>
        <div class="p-col">
          <Textarea v-model="data.form.type" auto-resize :class="{'p-invalid':data.submitted && v$.form.type.$invalid }"></Textarea>
          <small class="p-error" v-if="data.submitted && v$.form.type.required.$invalid">请输入编码</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>参数说明：</label>
        <div class="p-col">
          <Textarea v-model="data.form.args" auto-resize :class="{'p-invalid':data.submitted && v$.form.args.$invalid }"></Textarea>
          <small class="p-error" v-if="data.submitted && v$.form.args.required.$invalid">请输入参数说明</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>适配系统：</label>
        <div class="p-col">
          <InputText readonly @click.stop="show.isShowOs=true" v-model="data.form.os" :class="{'p-invalid':data.submitted && v$.form.os.$invalid }"></InputText>
          <div v-show="show.isShowOs" style="max-height:100px;overflow:auto">
            <div class="flex align-items-center" style="margin-top:0.5rem" v-for="(v,i) in data.osList" :key="i">
              <Checkbox @click.stop v-model="data.form.os" :inputId="'ingredientOs'+i" :name="v.value" :value="v.value" />&nbsp;&nbsp;
              <label @click.stop style="width:50%;text-align:left" :for="'ingredientOs'+i" class="ml-2"> {{v.value}} </label>
            </div>
          </div>
          <small class="p-error" v-if="data.submitted && v$.form.os.required.$invalid">请选择适配系统</small>
        </div>
      </div>

      <div class="form-item">
        <label><i class="required">*</i>适配架构：</label>
        <div class="p-col">
          <InputText readonly @click.stop="show.isShowArch=true" v-model="data.form.arch" :class="{'p-invalid':data.submitted && v$.form.arch.$invalid }"></InputText>
          <div v-show="show.isShowArch" style="max-height:100px;overflow:auto">
            <div class="flex align-items-center" style="margin-top:0.5rem" v-for="(v,i) in data.archList" :key="i">
              <Checkbox @click.stop v-model="data.form.arch" :inputId="'ingredientArch'+i" :name="v.value" :value="v.value" />&nbsp;&nbsp;
              <label @click.stop style="width:50%;text-align:left" :for="'ingredientArch'+i" class="ml-2"> {{v.value}} </label>
            </div>
          </div>
          <small class="p-error" v-if="data.submitted && v$.form.arch.required.$invalid">请选择适配架构</small>
        </div>
      </div>

      <div class="form-item">
        <label><i class="required">*</i>适配版本：</label>
        <div class="p-col">
          <InputText readonly @click.stop="show.isShowVersion=true" v-model="data.form.version" :class="{'p-invalid':data.submitted && v$.form.version.$invalid }"></InputText>
          <div v-show="show.isShowVersion" style="max-height:100px;overflow:auto">
            <div class="flex align-items-center" style="margin-top:0.5rem" v-for="(v,i) in data.versionList" :key="i">
              <Checkbox @click.stop v-model="data.form.version" :inputId="'ingredientVersion'+i" :name="v.value" :value="v.value" />&nbsp;&nbsp;
              <label @click.stop style="width:50%;text-align:left" :for="'ingredientVersion'+i" class="ml-2"> {{v.value}} </label>
            </div>
          </div>
          <small class="p-error" v-if="data.submitted && v$.form.version.required.$invalid">请选择适配架构</small>
        </div>
      </div>

      <div style="text-align: right;width: 100%;padding-right: 1rem">
        <Button label="取消" class="p-button-outlined p-mr-3" @click="display=false"></Button>
        <Button label="提交" icon="pi pi-save" @click="submit" />
      </div>
    </div>
  </Sidebar>
</template>

<script>
import { reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import http from "@/http";
import { useToast } from "primevue/usetoast";

export default {
  name: "AddOrUpdateCommand",
  setup() {
    const show = reactive({
      isShowOs: false,
      isShowArch: false,
      isShowVersion: false,
    });
    const data = reactive({
      form: {
        id: null,
        typeId: null,
        name: null,
        code: null,
        arch: null,
        os: null,
        type: null,
        command: null,
        comments: null,
        args: null,
        version: null,
      },
      submitted: false,
      typeTreeData: [],
      selectedType: {},
      osList: [],
      archList: [],
      versionList: [],
    });
    const toast = useToast();
    const display = ref(false);

    function init(item) {
      display.value = true;
      if (item && item.typeId) {
        data.selectedType[item.typeId] = true;
      }
      if (item && item.id) {
        console.log(item);
        data.form = item;
      }

      getTypeTree();
      const dictList = getDictList("os");
      dictList.then((list) => {
        data.osList = list;
        console.log(data.osList);
      });

      const promise = getDictList("arch");
      promise.then((list) => {
        data.archList = list;
      });

      const ver = getDictList("version");

      ver.then((list) => {
        data.versionList = list;
      });
      if (item.os) {
        data.form.os = item.os.split(",");
      }
      if (item.arch) {
        data.form.arch = item.arch.split(",");
      }
      if (item.version) {
        data.form.version = item.version.split(",");
      }
    }

    function getTypeTree() {
      http.get("/strategy/Settings/command/getTree").then((res) => {
        data.typeTreeData = res.data;
      });
    }

    async function getDictList(code) {
      const response = await http.get("/dictrecords/getListByCode/" + code);
      return response.data;
    }

    const ObjectNotNull = (value) =>
      value instanceof Object && Object.keys(value) > 0;
    const rules = {
      form: {
        comments: { required },
        name: { required },
        code: { requiredIf: requiredIf(data.form.id === null) },
        type: { required },
        os: { required },
        arch: { required },
        command: { required },
        version: { required },
        args: { required },
      },
      selectedType: { ObjectNotNull },
    };

    const v$ = useVuelidate(rules, data);

    function submit() {
      show.isShowOs = false;
      show.isShowArch = false;
      show.isShowVersion = false;
      data.submitted = true;
      if (v$.value.$invalid) {
        return;
      }
      if (!(typeof data.form.os == "string")) {
        let os = "";
        data.form.os.forEach((item) => {
          os = os + item + ",";
        });
        data.form.os = os.slice(0, os.length - 1);
      }
      if (!(typeof data.form.arch == "string")) {
        let arch = "";
        data.form.arch.forEach((item) => {
          arch = arch + item + ",";
        });
        data.form.arch = arch.slice(0, arch.length - 1);
      }
      if (!(typeof data.form.version == "string")) {
        let version = "";
        data.form.version.forEach((item) => {
          version = version + item + ",";
        });
        data.form.version = version.slice(0, version.length - 1);
      }
      data.form.typeId = Object.keys(data.selectedType)[0];
      http
        .post("/strategy/Settings/command/addOrUpdateCommand", data.form)
        .then((res) => {
          if (res.success) {
            toast.add({
              severity: "info",
              summary: "添加成功！",
              life: 3000,
            });
            display.value = false;
          }
        });
    }
    function clearBox() {
      show.isShowOs = false;
      show.isShowArch = false;
      show.isShowVersion = false;
    }
    return { display, init, data, v$, submit, getDictList, show, clearBox };
  },
};
</script>

<style scoped>
.form {
  display: flex;
  padding: 0 2rem;
  flex-wrap: wrap;
}
.p-col {
  padding: 0;
}
.form-item {
  width: 100%;
  margin-bottom: 1rem;
}

.form-item label {
  min-width: 7rem;
  display: inline-block;
  text-align: right;
}

.form-item > .p-col > :first-child {
  width: 100%;
}
</style>