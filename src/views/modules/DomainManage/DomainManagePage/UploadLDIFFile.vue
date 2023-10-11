<template>
  <Sidebar style="width: 700px"
           @hide="close" :dismissable="false"
           position="right" :showCloseIcon="false"
           v-model:visible="display">

    <input type="file" id="ou" @change="uploadFile('ou',$event)">
    <input type="file" id="user" @change="uploadFile('user',$event)">
    <div class="p-fluid content">
      <div class="p-field">
        <h4 class="">向"{{ parentNode.name }}"导入LDIF文件</h4>
      </div>
      <Message severity="info">
        导入LDIF文件可能需要一些时间，请耐心等候。<br>
        导入操作不可撤销，请确认所选域、LDIF文件是否正确。
      </Message>
      <div class="p-field p-grid">
        <label class="p-col-fixed"><label class="required">*</label>组织单位LDIF文件：</label>
        <div class="p-col">
          <Button @click="upload('ou')">
            <i class="fa fa-upload"></i>
            {{ ouFile === null ? '上传' : ouName }}
            <i v-if="ouFile!=null" class="fa fa-times p-ml-3" @click="deleteFile($event,'ou')"></i>
          </Button>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed"><label class="required">*</label>域用户LDIF文件：</label>
        <div class="p-col">
          <Button @click="upload('user')">
            <i class="fa fa-upload"></i>
            {{ userFile === null ? '上传' : userName }}
            <i v-if="userFile!=null" class="fa fa-times p-ml-3" @click="deleteFile($event,'user')"></i>
          </Button>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed"><label class="required">*</label>域DN：</label>
        <div class="p-col">
          <InputText :style="{'border-color':((originalDomainDN==null||originalDomainDN=='')&& subFlag)?'red':''}"
                     v-model="originalDomainDN"></InputText>
          <span v-if="(originalDomainDN==null||originalDomainDN=='')&& subFlag" class="required">请输入域DN</span>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed"><label class="required">*</label>默认密码：</label>
        <div class="p-col">
          <InputText :style="{'border-color':((defaultPassword==null||defaultPassword=='')&& subFlag)?'red':''}"
                     v-model="defaultPassword" type="password"></InputText>
          <span v-if="(defaultPassword==null||defaultPassword=='')&& subFlag" class="required">请输入默认密码</span>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed"><label class="required">*</label>再次输入：</label>
        <div class="p-col">
          <InputText type="password"
                     :style="{'border-color':(((againPassword==null||againPassword=='')||againPassword!=defaultPassword)&& subFlag)?'red':''}"
                     v-model="againPassword"></InputText>
          <span v-if="(defaultPassword==null||defaultPassword=='')&& subFlag" class="required">请再次输入默认密码</span>
          <span v-if="againPassword!=defaultPassword&& subFlag" class="required">两次密码不一致</span>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed"><label class="required" style="visibility: hidden">*</label>执行结果：</label>
        <div class="p-col">
          <div class="text" v-html="text"></div>
        </div>
      </div>
      <div class="p-field p-grid">
        <label class="p-col-fixed"></label>
        <div class="p-col">
          <Button @click="importDialog">开始导入</Button>
          <Button class="p-button-outlined p-ml-3" @click="close">关闭</Button>
        </div>
      </div>
    </div>
    <Dialog v-model:visible="importDisplay"
            @hide="importDisplay=false" header="导入LDIF文件">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
        <span> 您确认要向"{{ parentNode.name }}"导入LDIF文件吗？</span>
      </div>
      <template #footer>
        <Button label="是" icon="pi pi-check" @click="submit" class="p-button-link"/>
        <Button label="否" icon="pi pi-times" @click="importDisplay=false" class="p-button-secondary p-button-link"/>
      </template>
    </Dialog>
  </Sidebar>

</template>

<script>
export default {
  name: "UploadLDIFFile",
  data() {
    return {
      display: false,
      parentNode: null,
      ouFile: null,
      ouName: null,
      userFile: null,
      userName: null,
      text: null,
      importDisplay: false,
      defaultPassword: null,
      againPassword: null,
      subFlag: false,
      domainId: null,
      originalDomainDN: null,
    }
  },
  methods: {
    close() {
      this.display = false
      this.$emit('close')
    },
    init(parent, domainId) {
      this.display = true
      this.parentNode = parent
      this.domainId = domainId
    },
    upload(id) {
      document.getElementById(id).click()
    },
    deleteFile(e, name) {
      e.stopPropagation()
      if (name === 'ou') {
        this.ouFile = null
        this.ouName = null
        document.getElementById('ou').value = null
      } else if (name === 'user') {
        this.userFile = null
        this.userName = null
        document.getElementById('user').value = null
      }

    },
    uploadFile(type, e) {

      let file = e.target.files[0]

      if (file.name.split('.')[1] === 'ldif') {
        const param = new FormData()
        const config = {
          headers: {"Content-Type": "multipart/form-data"}
        }

        let url = '';
        if (type === 'ou') {
          url = '/import_objs/uploadOULdifFile';
          this.ouName = file.name
          param.append('ouFile', file);

        } else if (type === 'user') {
          url = '/import_objs/uploadUserLdifFile';
          this.userName = file.name
          param.append('userFile', file);
        }


        this.$http.post(url, param, config).then(res => {
          if (type === 'ou') {
            this.ouFile = res.data
          }
          if (type === 'user') {
            this.userFile = res.data
          }
        });

      } else {
        this.$toast.add({severity: 'info', summary: '请上传正确的LDIF文件', life: 3000})
      }
    },
    importDialog() {
      this.subFlag = true

      if (this.ouFile != null && this.userFile != null
          && this.originalDomainDN != null && this.originalDomainDN !== ''
          && this.defaultPassword != null && this.defaultPassword != ''
          && this.againPassword == this.defaultPassword) {
        this.importDisplay = true
      } else {
        this.$toast.add({severity: 'info', summary: '请检查输入或上传文件是否完整', life: 3000})
      }
    },
    submit() {
      this.importDisplay = false
      this.$http.get('/import_objs/submit', {
        params: {
          domainId: this.domainId,
          id: this.parentNode.id.split('-')[0],
          domainName: this.parentNode.domainName,
          ouLdifFileName: this.ouFile,
          userLdifFileName: this.userFile,
          defaultPasswd: this.defaultPassword,
          originalDomainDN: this.originalDomainDN
        },
        timeout: 100000
      }).then((res) => {
        this.text = res.data
      })

    }
  }
}
</script>

<style scoped>
input[type='file'] {
  display: none;
}

.p-fluid .p-button {
  width: auto;
  justify-content: center;
}

.p-grid > label {
  width: 170px;
  justify-content: flex-start;
}


.p-field {
  width: 100%;
}

.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.text {
  border: 1px solid #ced4da;
  border-radius: 3px;
  padding: 10px;
  width: 100%;
  height: 400px;
  overflow: scroll;
}

::v-deep(.p-message) {
  width: 100%;
  margin: 0 0 2rem 0;
}

::v-deep(.p-message .p-message-wrapper) {
  padding: 0.5rem;
}

::v-deep(.p-message .p-message-icon) {
  margin-right: 1rem;
}
</style>
