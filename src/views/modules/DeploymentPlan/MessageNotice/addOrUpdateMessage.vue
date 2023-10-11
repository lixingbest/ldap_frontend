<template>
  <Dialog :modal="true" header="发送消息"
          style="width: 60vw" @hide="$emit('close')"
          v-model:visible="display">
    <template #header>
      <h5><strong>发送消息</strong></h5>
    </template>

    <div class="p-d-flex p-flex-column" style="row-gap: 1rem">
      <div class="p-d-flex p-ai-center">
        <label><i class="required">*</i>标题：</label>
        <div class="p-col">
          <InputText v-model="form.title" :class="{'p-invalid':v$.form.title.$invalid && submitted}"/>
          <span class="err-message" v-if="v$.form.title.$invalid && submitted">请输入标题</span>
        </div>
      </div>
      <div class="p-d-flex p-ai-center">
        <label><i class="required">*</i>内容：</label>
        <div class="p-col" :class="{'required-border':v$.form.content.$invalid && submitted}">
          <QuillEditor theme="snow" contentType="html"
                       placeholder="请输入内容..."
                       :options="editorOption"
                       v-model:content="form.content"></QuillEditor>
          <span class="err-message" v-if="v$.form.content.$invalid && submitted">请输入内容</span>
        </div>
      </div>
      <div class="p-d-flex p-ai-center">
        <label><i class="required">*</i>接受者类型：</label>
        <div class="p-col">
          <span class="p-mr-3">
            <RadioButton id="receiverType0" v-model="form.receiverType" :value="0"
                         @change="getTree"
                         :class="{'p-invalid':v$.form.receiverType.$invalid && submitted}"></RadioButton>
            <label for="receiverType0" class="p-ml-1">组织单位</label>
          </span>
          <span>
            <RadioButton id="receiverType1" v-model="form.receiverType" :value="1"
                         @change="getHostList"
                         :class="{'p-invalid':v$.form.receiverType.$invalid && submitted}"></RadioButton>
            <label for="receiverType1" class="p-ml-1">终端</label>
          </span>
          <span class="err-message" v-if="v$.form.receiverType.$invalid && submitted">请选择类型</span>
        </div>
      </div>

      <div class="p-d-flex p-ai-center">
        <label><i class="required">*</i>选择接收者：</label>
        <div class="p-col">
          <tree v-if="form.receiverType===0" :value="tree" v-model:selection-keys="treeSelected"
                selection-mode="checkbox">
          </tree>

          <DataTable v-if="form.receiverType===1" class="p-datatable-gridlines p-mt-2"
                     v-model:selection="selectedHost"
                     :value="tableData"
                     :scrollable="true" scroll-height="400px" paginator :rows="10"
                     :rowsPerPageOptions="[10, 20, 50,100]"
                     paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                     currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>
              <p style="text-align: center">暂无信息...</p>
            </template>
            <Column selectionMode="multiple" style="width: 3em"></Column>
            <Column field="fqdn" header="主机名">
              <template #body="row">
                <span v-if="row.data.fqdn">{{ row.data.fqdn[0] }}</span>
              </template>
            </Column>
            <Column field="nsosversion" header="操作系统">
              <template #body="row">
                <span v-if="row.data.nsosversion">{{ row.data.nsosversion[0] }}</span>
              </template>
            </Column>
            <Column field="nshardwareplatform" header="架构">
              <template #body="row">
                <span v-if="row.data.nsosversion">{{ row.data.nsosversion[0] }}</span>
              </template>
            </Column>
            <Column field="description" header="主机描述">
              <template #body="row">
                <span v-if="row.data.description">{{ row.data.description[0] }}</span>
              </template>
            </Column>
          </DataTable>

        </div>

      </div>
      <div class="p-d-flex p-ai-center">
        <label><i class="required">*</i>发送类型：</label>
        <div class="p-col">
          <span class="p-mr-3">
            <RadioButton id="type1" v-model="form.type" :value="0"
                         :class="{'p-invalid':v$.form.type.$invalid && submitted}"></RadioButton>
            <label for="type1" class="p-ml-1">立即发送</label>
          </span>
          <span>
            <RadioButton id="type0" v-model="form.type" :value="1"
                         :class="{'p-invalid':v$.form.type.$invalid && submitted}"></RadioButton>
            <label for="type0" class="p-ml-1">定时发送</label>
          </span>
          <span class="err-message" v-if="v$.form.type.$invalid && submitted">请选择类型</span>
        </div>
      </div>
      <div v-if="form.type===1" class="p-d-flex p-ai-center">
        <label><i class="required">*</i>发送时间：</label>
        <div class="p-col">
          <calendar v-model="form.sendTime" :show-time="true"
                    :class="{'p-invalid':v$.form.sendTime.$invalid && submitted}"
          ></calendar>
          <span class="err-message" v-if="v$.form.sendTime.$invalid && submitted">请选择时间</span>
        </div>
      </div>
    </div>
    <template #footer>
      <Button @click="submit">确定</Button>
    </template>
  </Dialog>
</template>
<script>
import {defineComponent} from 'vue'
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {useVuelidate} from "@vuelidate/core";
import {required, requiredIf} from "@vuelidate/validators";

import {format} from "@/utils/time";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
  [{list: "ordered"}, {list: "bullet"}], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{header: 1}, {header: 2}],
  [{script: "sub"}, {script: "super"}], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  [{indent: "-1"}, {indent: "+1"}],
  [{size: []}], // 配置字号
  [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{color: []}, {background: []}], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{font: []}], //显示字体选择
  [{align: []}], // 对齐方式-----[{ align: [] }]
  ["clean"], // 清除文本格式-----['clean']
  ["link"], // 链接、图片、视频-----['link', 'image', 'video']
];
export default defineComponent({
  name: "addOrUpdateMessage",
  data() {

    return {
      editorOption: {
        modules: {
          toolbar: toolbarOptions,
        },
      },
      display: false,
      form: {
        id: null,
        title: null,
        content: null,
        time: null,
        userId: null,
        type: 0,
        receiverType: 0,
        sendTime: null,
        receiverList: []
      },
      submitted: false,
      tableData: [],
      domainId: null,
      tree: null,
      selectedHost: [],
      treeSelected: [],
    }
  },
  validations() {
    return {
      form: {
        title: {required},
        content: {required},
        type: {required},
        sendTime: {requiredIf: requiredIf(this.form.type === 1)},
        receiverType: {required}
      }
    }
  },
  components: {
    QuillEditor
  },
  setup: () => ({v$: useVuelidate()}),
  methods: {
    init(domainId) {
      this.display = true
      this.domainId = domainId
      this.getTree()
    },
    getHostList() {
      this.$http.get('/host/list', {
        params: {domainId: this.domainId}
      }).then(res => {
        this.tableData = res.data
      })
    },

    getTree() {
      this.$http.get("/domain/tree").then((res) => {
        let data = res.data.filter(item => item.id.split('-')[1] !== '2');

        let tree = this.$global.Tree.makeTree(data, true);

        this.tree = this.getChildren(tree, this.domainId + '-0')
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

      if (this.form.receiverType === 0) {
        for (let key of Object.keys(this.treeSelected)) {
          const item = this.treeSelected[key]
          if (item.checked) {
            this.form.receiverList.push({
              type: this.form.receiverType,
              refId: parseInt(key.split('-')[0])
            })
          }
        }
      } else {
        for (let item of this.selectedHost) {
          console.log(item)
          this.form.receiverList.push({
            type: this.form.receiverType,
            refId: item.fqdn[0]
          })
        }
      }
      if (this.form.sendTime) {
        this.form.sendTime = format(this.form.sendTime)
      }


      this.submitted = true;
      if (this.v$.$invalid) {
        return;
      }

      this.$http.post("/message", this.form).then(res => {
        if (res.success) {
          this.$toast.add({
            severity: "info",
            summary: "成功！ ",
            life: 3000,
          });
          this.display = false
        }
      })

    }
  }
})
</script>
<style scoped lang="scss">
.p-d-flex.p-flex-column {
  .p-d-flex.p-ai-center {
    label {
      width: 100px;
      text-align: right;
    }
  }
}

.err-message {
  display: inline-block;
  width: 100%;
  color: red;
}

.required-border {
  ::v-deep(.ql-snow) {
    border-color: red;
  }
}
</style>
