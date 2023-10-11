<template>
  <Sidebar position="right" :showCloseIcon="false" style="width: 40rem;" v-model:visible="display" @hide="close">
    <template #header>
      <strong>{{isEdit?'编辑策略':'添加策略'}}</strong>
    </template>
    <!-- <Dialog style="width:40rem" :header="isEdit?'编辑策略':'添加策略'" :modal="true" v-model:visible="display" @hide="close"> -->

    <div class="form" @click="clearBox">
      <div class="form-item" style="display:flex;justify-content:flex-end">
        <Button v-if="!isEdit" style="margin-bottom:0.5rem;" @click="addTotalPolicy()">选择策略</Button>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>命令名称：</label>
        <div class="p-col" style="padding:0">
          <InputText v-model="data.form.name" :class="{'p-invalid':submitted && v$.form.name.$invalid }"></InputText>
          <small class="p-error" v-if="submitted && v$.form.name.required.$invalid">请输入命令名称</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>命令编码：</label>
        <div class="p-col" style="padding:0">
          <InputText v-model="data.form.code" :class="{'p-invalid':submitted && v$.form.code.$invalid }"></InputText>
          <small class="p-error" v-if="submitted && v$.form.code.$invalid">请输入命令编码</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>命令说明：</label>
        <div class="p-col" style="padding:0">
          <Textarea v-model="data.form.comments" auto-resize :class="{'p-invalid':submitted && v$.form.comments.$invalid }"></Textarea>
          <small class="p-error" v-if="submitted && v$.form.comments.$invalid">请输入命令说明</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>命令分类：</label>
        <div class="p-col">
          <tree-select v-model="data.selectedType" :options="data.typeTreeData" :class="{'p-invalid':submitted && v$.selectedType.$invalid }"></tree-select>
          <small class="p-error" v-if="submitted && v$.selectedType.ObjectNotNull.$invalid">请选择类型</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>命令用途：</label>
        <div class="p-col" style="padding:0">
          <Textarea v-model="data.form.type" auto-resize :class="{'p-invalid':submitted && v$.form.type.$invalid }"></Textarea>
          <small class="p-error" v-if="submitted && v$.form.type.required.$invalid">请输入命令用途编码</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>参数说明：</label>
        <div class="p-col" style="padding:0">
          <Textarea v-model="data.form.args" auto-resize :class="{'p-invalid':submitted && v$.form.args.$invalid }"></Textarea>
          <small class="p-error" v-if="submitted && v$.form.args.required.$invalid">请输入参数说明</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>变量参数：</label>
        <div class="p-col" style="padding:0">
          <Textarea v-model="data.form.value" auto-resize :class="{'p-invalid':submitted && v$.form.value.$invalid }"></Textarea>
          <small class="p-error" v-if="submitted && v$.form.value.required.$invalid">请输入变量参数</small>
          <small style="color:red" v-if="rightStyle">变量参数格式错误</small>
          <br>
          <small style="color:red">说明：应遵守json格式，例如：{"name":"tom","age":"18"}</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>命令内容：</label>
        <div class="p-col" style="padding:0">
          <Textarea v-model="data.form.command" auto-resize :class="{'p-invalid':submitted && v$.form.command.$invalid }"></Textarea>
          <small class="p-error" v-if="submitted && v$.form.command.required.$invalid">请输入命令内容</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>适配系统：</label>
        <div class="p-col" style="padding:0">
          <InputText readonly @click.stop="show.isShowOs=true" v-model="data.form.os" :class="{'p-invalid':data.submitted && v$.form.os.$invalid }"></InputText>
          <div v-show="show.isShowOs" style="max-height:100px;overflow:auto">
            <div class="flex align-items-center" style="margin-top:0.5rem" v-for="(v,i) in data.osList" :key="i">
              <Checkbox @click.stop v-model="data.form.os" :inputId="'os'+i" :name="v.value" :value="v.value" />&nbsp;&nbsp;
              <label @click.stop style="width:50%;text-align:left" :for="'os'+i" class="ml-2"> {{v.value}} </label>
            </div>
          </div>
          <small class="p-error" v-if="submitted && v$.form.os.required.$invalid">请选择适配系统</small>
        </div>
      </div>
      <div class="form-item">
        <label><i class="required">*</i>适配版本：</label>
        <div class="p-col" style="padding:0">
          <InputText readonly @click.stop="show.isShowVersion=true" v-model="data.form.version" :class="{'p-invalid':data.submitted && v$.form.version.$invalid }"></InputText>
          <div v-show="show.isShowVersion" style="max-height:100px;overflow:auto">
            <div class="flex align-items-center" style="margin-top:0.5rem" v-for="(v,i) in data.versionList" :key="i">
              <Checkbox @click.stop v-model="data.form.version" :inputId="'arch'+i" :name="v.value" :value="v.value" />&nbsp;&nbsp;
              <label @click.stop style="width:50%;text-align:left" :for="'arch'+i" class="ml-2"> {{v.value}} </label>
            </div>
          </div>
          <small class="p-error" v-if="submitted && v$.form.version.required.$invalid">请选择适配版本</small>
        </div>
      </div>

      <div class="form-item">
        <label><i class="required">*</i>适配架构：</label>
        <div class="p-col" style="padding:0">
          <InputText readonly @click.stop="show.isShowArch=true" v-model="data.form.arch" :class="{'p-invalid':data.submitted && v$.form.arch.$invalid }"></InputText>
          <div v-show="show.isShowArch" style="max-height:100px;overflow:auto">
            <div class="flex align-items-center" style="margin-top:0.5rem" v-for="(v,i) in data.archList" :key="i">
              <Checkbox @click.stop v-model="data.form.arch" :inputId="'value'+i" :name="v.value" :value="v.value" />&nbsp;&nbsp;
              <label @click.stop style="width:50%;text-align:left" :for="'value'+i" class="ml-2"> {{v.value}} </label>
            </div>
          </div>
          <small class="p-error" v-if="submitted && v$.form.arch.required.$invalid">请选择适配架构</small>
        </div>
      </div>

    </div>
    <custom-policy @policyData="policyData" ref="policyRefs" v-if='policyDisplay' @close="policyDisplay=false"></custom-policy>
    <!-- <template #footer> -->
    <div class="form">
      <div class="form-item" style="display:flex;justify-content:flex-end">
        <Button label="取消" @click="display=false" />
        <Button style="margin-left:1rem" label="保存" @click="save" />
      </div>
    </div>
    <!-- </template> -->
    <!-- </Dialog> -->
  </Sidebar>
</template>
<script>
import Util from "@/views/modules/Public/method/Util";
import CustomPolicy from "@/views/modules/GroupTactics/Devices/components/custom-policy";
import { nextTick, ref, reactive, getCurrentInstance } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import http from "@/http";
export default {
  components: { CustomPolicy },
  setup() {
    const show = reactive({
      isShowOs: false,
      isShowArch: false,
      isShowVersion: false,
    });
    const { proxy } = getCurrentInstance();
    const submitted = ref(false);
    const policyDisplay = ref(false);
    const display = ref(false);
    const strategyId = ref();
    const isEdit = ref(false);
    function init(list, id) {
      console.log(list)
      strategyId.value = id;
      display.value = true;
      getTypeTree();
      if (list) {
        if (list.typeId) {
          data.value.selectedType[list.typeId] = true;
        }
        isEdit.value = true;
        data.value.form = {
          id: list.id ? list.id : null,
          comments: list.comments ? list.comments : null,
          code: list.code ? list.code : null,
          name: list.name ? list.name : null,
          type: list.type ? list.type : null,
          args: list.args ? list.args : null,
          os: list.os ? list.os : null,
          arch: list.arch ? list.arch : null,
          version: list.version ? list.version : null,
          command: list.command ? list.command : null,
          typeId: list.typeId ? list.typeId : null,
          strategyId: strategyId.value,
          value: list.value ? list.value : null,
        };
        if(list.os){
          data.value.form.os=list.os.split(',')
        }
        if(list.arch){
          data.value.form.arch=list.arch.split(',')
        }
        if(list.version){
          data.value.form.version=list.version.split(',')
        }
        console.log(data.value.form)
      }
    }
    function getTypeTree() {
      http.get("/strategy/Settings/command/getTree").then((res) => {
        data.value.typeTreeData = res.data;
      });
    }
    const policyRefs = ref();
    function addTotalPolicy() {
      policyDisplay.value = true;
      nextTick(() => {
        policyRefs.value.init();
      });
    }

    const data = ref({
      form: {
        id: null,
        comments: null,
        code: null,
        name: null,
        type: null,
        args: null,
        os: null,
        arch: null,
        version: null,
        command: null,
        typeId: null,
        strategyId: null,
        value: null,
      },
      osList: [],
      archList: [],
      versionList: [],
      selectedType: {},
      typeTreeData: [],
    });
    const ObjectNotNull = (value) =>
      value instanceof Object && Object.keys(value) > 0;
    const rules = {
      form: {
        comments: { required },
        code: { required },
        name: { required },
        type: { required },
        args: { required },
        os: { required },
        arch: { required },
        version: { required },
        command: { required },
        value: { required },
      },
      selectedType: { ObjectNotNull },
    };

    const v$ = useVuelidate(rules, data);
    const dictList = getDictList("os");
    const promise = getDictList("arch");
    const ver = getDictList("version");
    async function getDictList(code) {
      const response = await http.get("/dictrecords/getListByCode/" + code);
      return response.data;
    }
    dictList.then((list) => {
      data.value.osList = list;
    });

    promise.then((list) => {
      data.value.archList = list;
    });

    ver.then((list) => {
      data.value.versionList = list;
    });
    const rightStyle = ref(false);
    function type(str) {
      if (typeof str == "string") {
        try {
          var obj = JSON.parse(str);
          // 等于这个条件说明就是JSON字符串 会返回true
          if (typeof obj == "object" && obj) {
            return true;
          } else {
            //不是就返回false
            return false;
          }
        } catch (e) {
          return false;
        }
      }
      return false;
    }
    function save() {
      show.isShowOs = false;
      show.isShowArch = false;
      show.isShowVersion = false;
      submitted.value = true;
      if (v$.value.$invalid) {
        return;
      }

      if (!(typeof data.value.form.os == "string")) {
        let os = "";
        data.value.form.os.forEach((item) => {
          os = os + item + ",";
        });
        data.value.form.os = os.slice(0, os.length - 1);
      }
      if (!(typeof data.value.form.arch == "string")) {
        let arch = "";
        data.value.form.arch.forEach((item) => {
          arch = arch + item + ",";
        });
        data.value.form.arch = arch.slice(0, arch.length - 1);
      }
      if (!(typeof data.value.form.version == "string")) {
        let version = "";
        data.value.form.version.forEach((item) => {
          version = version + item + ",";
        });
        data.value.form.version = version.slice(0, version.length - 1);
      }
      data.value.form.typeId = Object.keys(data.value.selectedType)[0];
      data.value.form.strategyId=strategyId.value
      if (type(data.value.form.value)) {
        rightStyle.value = false;
        if (isEdit.value) {
          http
            .post("/strategy/settings/updatePubStrategay", data.value.form)
            .then((res) => {
              if (res.success) {
                proxy.$toast.add({
                  severity: "info",
                  summary: "修改成功！",
                  life: 3000,
                });
              }
              display.value = false;
            });
        } else {
          http
            .post("/strategy/settings/addPubStrategay", data.value.form)
            .then((res) => {
              if (res.success) {
                proxy.$toast.add({
                  severity: "info",
                  summary: "添加成功！",
                  life: 3000,
                });
              }
              display.value = false;
            });
        }
      } else {
        rightStyle.value = true;
      }
    }
    function policyData(val) {
      data.value.form = {
        comments: val.comments ? val.comments : null,
        code: val.code ? val.code : null,
        name: val.name ? val.name : null,
        type: val.type ? val.type : null,
        args: val.args ? val.args : null,
        os: val.os ? val.os : null,
        arch: val.arch ? val.arch : null,
        version: val.version ? val.version : null,
        command: val.command ? val.command : null,
        typeId: val.typeId ? val.typeId : null,
        strategyId: strategyId.value,
        value: val.value ? val.value : null,
      };
    }
    function close() {
      proxy.$emit("closePolicy", strategyId.value);
    }
    function clearBox() {
      show.isShowOs = false;
      show.isShowArch = false;
      show.isShowVersion = false;
    }
    return {
      close,
      addTotalPolicy,
      submitted,
      Util,
      policyDisplay,
      display,
      init,
      policyRefs,
      policyData,
      strategyId,
      v$,
      data,
      rightStyle,
      getDictList,
      save,
      isEdit,
      show,
      clearBox,
    };
  },
};
</script>
<style scoped>
.form {
  display: flex;
  padding: 0 2rem;
  flex-wrap: wrap;
}

.form-item {
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 0;
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
