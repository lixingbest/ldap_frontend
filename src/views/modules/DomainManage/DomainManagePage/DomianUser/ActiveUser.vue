<template>
  <div id="card">
    <div class="table-title">
      <Button style="width:120px;display:flex;justify-content:center" @click="addOrUpdateUser">新建域用户</Button>
      <div class="form">
        <div class="serch-input">
          <div class="form-item">
            <label>关键字：</label>
            <InputText style="width:110px" v-model="query.uid" class="inout-t"
                       @keyup.enter="getData"></InputText>
          </div>
          <div class="form-item" v-if="showInput.zzdw">
            <label>组织单位：</label>
            <InputText style="width:110px" v-model="query.ou" class="inout-t"
                       @keyup.enter="getData"></InputText>
          </div>
          <div class="form-item" v-if="showInput.mmgq">
            <label>密码过期：</label>
            <Calendar style="width:110px" inputId="basic" dateFormat="yy/mm/dd" autocomplete="off"
                      v-model="query.beginTime" placeholder="开始时间"/>
            -
            <Calendar style="width:110px" inputId="basic" dateFormat="yy/mm/dd" autocomplete="off"
                      v-model="query.endTime" :minDate="query.beginTime" placeholder="结束时间"/>
          </div>
        </div>
        <div :style="isDisplay?'width:320px':'width:300px'" style="display: flex;justify-content: flex-end">
          <Button v-if="isDisplay" :icon="open?'pi pi-angle-up':'pi pi-angle-down'" iconPos="right"
                  :label="open?'折叠':'展开'" class="p-button-link" @click="fun"/>
          <Button class="p-mr-1" @click="getData">查询</Button>
          <Button class="p-mr-1" @click="clearQuery">清空</Button>

          <Button class="p-mr-1" @click="exportxls">导出</Button>
          <Button @click="importExcel">导入</Button>


        </div>
      </div>
    </div>
    <div class="content" id="yyhDataTable">
      <DataTable frozenWidth="160px" style="width:100%" :rowHover="true" :value="list" :scrollable="true"
                 :scroll-height="scrollHeight" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                 paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                 currentPageReportTemplate="共 {totalRecords} 条记录">
        <template #empty>
          <p style="width:100%;text-align:left">暂无信息...</p>
        </template>
        <template #loading>
          <p>正在加载数据，请稍等...</p>
        </template>
        <Column style="min-width: 110px" field="uid" header="登录名">
          <template #body="a">
            <span class="center" v-for="(item ,index) in a.data.uid" :key="item.index">
              <span v-tooltip.top="item"
                    style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ item }}</span>
              <span v-if="index!==a.data.uid.length-1">,</span>
            </span>
          </template>
        </Column>
        <Column style="min-width: 100px" field="cn" header="姓名">
          <template #body="a">
            <span class="center" v-for="(item ,index) in a.data.cn" :key="item.index">
              <span v-tooltip.top="item"
                    style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ item }}</span>
              <span v-if="index!==a.data.cn.length-1">,</span>
            </span>
          </template>
        </Column>
        <Column style="min-width: 100px" field="employeenumber" header="工号">
          <template #body="a">
            <span class="center" v-for="(item ,index) in a.data.employeenumber" :key="item.index">
              <span v-tooltip.top="item"
                    style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ item }}</span>
              <span v-if="index!==a.data.employeenumber.length-1">,</span>
            </span>
          </template>
        </Column>
        <Column style="min-width: 100px" field="employeenumber" header="状态">
          <template #body="a">
            <div class="center">
              <span class="p-tag" :class="{'p-tag-danger':a.data.nsaccountlock,'p-tag-success':!a.data.nsaccountlock}">
                {{ a.data.nsaccountlock ? '禁用' : '启用' }}</span>
            </div>
          </template>
        </Column>
        <Column style="min-width: 200px" field="ou" header="组织单位">
          <template #body="row">
            <div class="center">{{ ouview(row) }}</div>
          </template>
        </Column>
        <column header="密码过期时间" style="min-width: 200px">
          <template #body="row">
            <div class="center"
                 v-tooltip.top="row.data.krbpasswordexpiration && row.data.krbpasswordexpiration.length > 0 ? format(row.data.krbpasswordexpiration[0]['__datetime__']) : ''">
              {{
                row.data.krbpasswordexpiration && row.data.krbpasswordexpiration.length > 0 ? format(row.data.krbpasswordexpiration[0]['__datetime__']) : ''
              }}
            </div>
          </template>
        </column>
        <Column style="min-width: 150px" field="title" header="职称">
          <template #body="a">
            <span class="center" v-for="(item ,index) in a.data.title" :key="item.index">
              <span v-tooltip.top="$global.Util.isJSON(item) ? JSON.parse(item).title : null"
                    style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  $global.Util.isJSON(item) ? JSON.parse(item).title : null
                }}</span>
              <span v-if="index!==a.data.title.length-1">,</span>
            </span>
          </template>
        </Column>
        <Column style="min-width: 150px" field="title" header="职位">
          <template #body="a">
            <span class="center" v-for="(item ,index) in a.data.title" :key="item.index">
              <span v-tooltip.top="$global.Util.isJSON(item) ? JSON.parse(item).job : null"
                    style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{
                  $global.Util.isJSON(item) ? JSON.parse(item).job : null
                }}</span>
              <span v-if="index!==a.data.title.length-1">,</span>
            </span>
          </template>
        </Column>

        <Column style="min-width: 150px" field="telephonenumber" header="固定电话">
          <template #body="a">
            <span class="center" v-for="(item ,index) in a.data.telephonenumber" :key="item.index">
              <span v-tooltip.top="item"
                    style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ item }}</span>
              <span v-if="index!==a.data.telephonenumber.length-1">,</span>
            </span>
          </template>
        </Column>
        <Column style="min-width: 100px" field="mobile" header="手机号码">
          <template #body="a">
            <span class="center" v-for="(item ,index) in a.data.mobile" :key="item.index">
              <span v-tooltip.top="item"
                    style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">{{ item }}</span>
              <span v-if="index!==a.data.mobile.length-1">,</span>
            </span>
          </template>
        </Column>
        <column header="家目录" style="min-width: 300px">
          <template #body="row">
            <div class="center" v-tooltip.top="row.data.homedirectory?.toString()">
              {{ row.data.homedirectory?.toString() }}
            </div>
          </template>
        </column>
        <Column :frozen="true" alignFrozen="right"
                style="min-width: 160px;justify-content: center;flex-wrap: wrap" header="操作">
          <template #body="a">
            <a @click="rowData=a.data">
              <split-button @click="addOrUpdateUser($event,a.data)" :model="buttons" label="编辑"/>
            </a>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <Dialog v-model:visible="deleteDisplay" :modal="true" @hide="closeDelete"
          :header="changeStsItem==null?'移除域用户':(changeStsItem.nsaccountlock?'启用用户':'禁用用户')">
    <div v-if="deleteItem!=null" class="confirmation-content" style="display: flex;align-items: center">
      <i class="pi pi-exclamation-triangle" style="font-size: 3rem"/>
      <div class="dialog-text">
        <div style="width: 100%;font-weight: 600;font-size: 16px">请选择删除类型：</div>
        <div class="dialog-radio">
          <RadioButton id="t0" name="deleteType" :value=0 v-model="deleteType"/>
          <label for="t0">保存到备用用户</label>
        </div>
        <div class="dialog-radio">
          <RadioButton id="t1" name="city" :value=1 v-model="deleteType"/>
          <label for="t1">彻底删除</label>
        </div>
      </div>
    </div>
    <div v-if="changeStsItem!=null" class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
      <span> {{ changeStsItem.nsaccountlock ? '启用' : '禁用' }}用户操作将于1分钟后生效，是否执行此操作？</span>
    </div>
    <template #footer>
      <Button label="是" icon="pi pi-check" @click="changeStsItem==null?submitDelete():updateEnable()"
              class="p-button-link"/>
      <Button label="否" icon="pi pi-times" @click="closeDelete" class="p-button-secondary p-button-link"/>
    </template>
  </Dialog>
  <Dialog v-model:visible="importLogDisplay" header="异常日志" :modal="true" @hide="importLogDisplay=false">
    <p v-for="item in importLog">{{ item }}</p>
  </Dialog>
  <Dialog v-model:visible="setTimeDisplay" header="设置可登录时间" :modal="true" @hide="closeSetLoginTime"
          style="min-width:20vw">

    <div class="radiorow">
      <RadioButton v-model="loginTime.type" :value="0"></RadioButton>
      <label>长期</label>
    </div>

    <div class="radiorow">
      <RadioButton v-model="loginTime.type" :value="1"></RadioButton>
      <label>指定日期：</label>
    </div>
    <Calendar v-if="loginTime.type===1" v-model="loginTime.dateRange" selectionMode="range" inline/>
    <div v-if="loginTime.type===1" style="display:flex;margin-top: 1rem;align-items: center">
      <label>指定时间：</label>
      <div style="display:flex;gap:1rem;align-items: center">
        <Calendar style="width:8rem;" v-model="loginTime.loginTimeBegin" timeOnly/>
        <label>到</label>
        <Calendar style="width:8rem;" v-model="loginTime.loginTimeEnd"
                  timeOnly/>
      </div>
    </div>
    <template #footer>
      <Button
          :class="{'p-disabled':loginTime.type===1 && (loginTime.dateRange==null || loginTime.dateRange.length<2 || loginTime.loginTimeEnd==null || loginTime.loginTimeBegin==null)}"
          @click="submitLoginLimit">确定
      </Button>
    </template>
  </Dialog>

  <MoveUser v-if="moveUserDisplay" ref="moveUser" @close="moveUserClose"></MoveUser>
  <update-pwd v-if="updatePwdDisplay" ref="updatePwd" v-on:close="closeDialog"></update-pwd>
  <CreateUser v-if="userDisplay" ref="CreateUser" v-on:close="closeDialog"></CreateUser>
  <TrustUser v-if="trustUserDisplay" ref="trustUser" v-on:close="closeDialog"></TrustUser>
</template>

<script>
import CreateUser from "@/views/modules/DomainManage/DomainManagePage/DomianUser/CreateUser";
import UpdatePwd from "@/views/modules/Public/updatePwd";
import TrustUser from "@/views/modules/DomainManage/DomainManagePage/DomianUser/TrustUser";
import MoveUser from "@/views/modules/DomainManage/DomainManagePage/DomianUser/MoveUser.vue";
import {format} from "@/utils/time";

export default {
  components: {
    MoveUser,
    TrustUser,
    UpdatePwd,
    CreateUser,
  },
  name: "ActiveUser",
  emits: ["close"],
  props: ["domainId", "updateFlag", "treeData"],
  watch: {
    domainId() {
      this.getData();
    },
    updateFlag() {
      this.getData();
    },
  },
  data() {
    return {
      isDisplay: false,
      showInput: {
        zzdw: true,
        mmgq: true,
      },
      constShowInput: {
        zzdw: null,
        mmgq: null,
      },
      scrollHeight: "400px",
      rowData: null,
      buttons: [
        {
          label: "重置密码",
          icon: "pi pi-replay",
          command: () => {
            this.updatePwd(this.rowData);
          },
        },
        {
          label: "移动",
          icon: "pi pi-angle-double-left",
          command: () => {
            this.moveUser(this.rowData);
          },
        },
        {
          label: "启用/禁用",
          icon: "pi pi-cog",
          command: () => {
            this.changeStsDialog(this.rowData);
          },
        },
        {
          label: "可登录时间",
          icon: "pi pi-clock",
          command: () => {
            this.showSetTime(this.rowData)
          },
        },
        {
          label: "移除",
          icon: "pi pi-minus-circle",
          style: {
            color: "red",
          },
          command: () => {
            this.deleteDialog(this.rowData);
          },
        },
      ],
      updatePwdDisplay: false,
      deleteDisplay: false,
      userDisplay: false,
      trustUserDisplay: false,
      deleteItem: null,
      query: {
        uid: null,
        ou: null,
        beginTime: null,
        endTime: null,
      },
      loading: true,
      list: [],
      tableHeight: 0,
      changeStsItem: null,
      DCID: null,
      tableItem: null,
      open: false,
      userType: 1,
      deleteType: 0,
      importLogDisplay: false,
      importLog: [],
      moveUserDisplay: false,
      setTimeDisplay: false,
      loginTime: {
        domainId: null,
        uid: null,
        loginDateBegin: null,
        loginDateEnd: null,
        loginDateBeginStr: null,
        loginDateEndStr: null,
        dateRange: null,
        loginTimeBegin: null,
        loginTimeEnd: null,
        type: 0,
      }
    };
  },
  mounted() {
    const search = document.getElementsByClassName("serch-input")[0];
    const searchWidth = search.clientWidth;
    if (searchWidth > 800) {
      this.isDisplay = false;
      this.showInput = {
        zzdw: true,
        mmgq: true,
      };
      this.constShowInput = {
        zzdw: true,
        mmgq: true,
      };
    } else {
      this.isDisplay = true;
      if (searchWidth > 400) {
        this.showInput = {
          zzdw: true,
          mmgq: false,
        };
        this.constShowInput = {
          zzdw: true,
          mmgq: false,
        };
      } else {
        this.showInput = {
          zzdw: false,
          mmgq: false,
        };
        this.constShowInput = {
          zzdw: false,
          mmgq: false,
        };
      }
    }

    const element = document.getElementById("yyhDataTable");
    const clientHeight = element.clientHeight;
    this.scrollHeight = clientHeight - 28 - 15 + "px";

    window.onresize = () => {
      const clientHeight = element.clientHeight;
      this.scrollHeight = clientHeight - 28 - 15 + "px";
      this.open = false;
      const search = document.getElementsByClassName("serch-input")[0];
      const searchWidth = search.clientWidth;
      if (searchWidth > 600) {
        this.isDisplay = false;
        this.showInput = {
          zzdw: true,
          mmgq: true,
        };
        this.constShowInput = {
          zzdw: true,
          mmgq: true,
        };
      } else {
        this.isDisplay = true;
        if (searchWidth > 400) {
          this.showInput = {
            zzdw: true,
            mmgq: false,
          };
          this.constShowInput = {
            zzdw: true,
            mmgq: false,
          };
        } else {
          this.showInput = {
            zzdw: false,
            mmgq: false,
          };
          this.constShowInput = {
            zzdw: false,
            mmgq: false,
          };
        }
      }
    };
    this.getData();
    document.addEventListener("click", () => {
      if (document.getElementsByClassName("butUL")) {
        for (let i in document.getElementsByClassName("butUL")) {
          if (document.getElementsByClassName("butUL")[i].style) {
            document.getElementsByClassName("butUL")[i].style.display = "none";
          }
        }
      }
    });
  },
  methods: {
    closeSetLoginTime() {
      this.setTimeDisplay = false
      this.loginTime = {
        domainId: null,
        uid: null,
        loginDateBegin: null,
        loginDateEnd: null,
        loginDateBeginStr: null,
        loginDateEndStr: null,
        dateRange: null,
        loginTimeBegin: null,
        loginTimeEnd: null,
        type: 0,
      }
    },
    submitLoginLimit() {

      if (this.loginTime.type === 1) {
        this.loginTime.loginTimeBegin = format(this.loginTime.loginTimeBegin).split(' ')[1].substring(0, 5);
        this.loginTime.loginTimeEnd = format(this.loginTime.loginTimeEnd).split(' ')[1].substring(0, 5);

        this.loginTime.loginDateBeginStr = format(this.loginTime.dateRange[0]);
        this.loginTime.loginDateEndStr = format(this.loginTime.dateRange[1]);
      }

      //console.log(this.loginTime)
      this.$http.post('/loginLimit', this.loginTime).then(res => {
        if (res.success) {
          this.loginTime = {
            domainId: null,
            uid: null,
            loginDateBegin: null,
            loginDateEnd: null,
            loginDateBeginStr: null,
            loginDateEndStr: null,
            dateRange: null,
            loginTimeBegin: null,
            loginTimeEnd: null,
            type: 0,
          }
          this.$toast.add({
            severity: "info",
            summary: "设置成功！ ",
            life: 3000,
          });
          this.setTimeDisplay = false
        }
      })
    },
    showSetTime(data) {

      let domainId = this.domainId.split("-")[1] == 0
          ? this.domainId.split("-")[0]
          : this.$global.Tree.searchDomainId(
              this.treeData,
              this.domainId.split("-")[0],
              null
          );


      this.$http.get('/loginLimit', {
        params: {
          domainId: domainId,
          uid: data.uid[0]
        }
      }).then(res => {
        if (res.success && res.data) {
          this.loginTime = res.data
          if (res.data.loginDateBegin && res.data.loginTimeBegin) {
            this.loginTime.type = 1
            this.loginTime.dateRange = [new Date(res.data.loginDateBegin), new Date(res.data.loginDateEnd)]
          } else {
            this.loginTime.type = 0
          }
        } else {
          this.loginTime = {
            domainId: domainId,
            uid: data.uid[0],
            loginDateBegin: null,
            loginDateEnd: null,
            loginDateBeginStr: null,
            loginDateEndStr: null,
            dateRange: null,
            loginTimeBegin: null,
            loginTimeEnd: null,
            type: 0,
          }
        }
      })

      this.setTimeDisplay = true;
    },
    moveUserClose() {
      this.moveUserDisplay = false;
      this.getData();
    },
    moveUser(data) {
      let domainId =
          this.domainId.split("-")[1] == 0
              ? this.domainId.split("-")[0]
              : this.$global.Tree.searchDomainId(
                  this.treeData,
                  this.domainId.split("-")[0],
                  null
              );
      this.moveUserDisplay = true
      this.$nextTick(() => {
        this.$refs.moveUser.init(domainId, data.uid[0])
      })
    },
    fun() {
      this.open = !this.open;
      if (this.constShowInput.zzdw == false) {
        this.showInput.zzdw = !this.showInput.zzdw;
      }
      if (this.constShowInput.mmgq == false) {
        this.showInput.mmgq = !this.showInput.mmgq;
      }
    },
    ouview(row) {
      let data = JSON.parse(row.data.ou[0])
          .ouDN.replace(/,DC=.*/, "")
          .replace(/,OU=/g, ",")
          .replace("OU=", "")
          .split(",");
      data.reverse();

      let showstr = "";
      for (let i in data) {
        showstr += data[i];
        if (i < data.length - 1) {
          showstr += " / ";
        }
      }
      return showstr;
    },

    importExcel() {
      this.$confirm.require({
        message: '请在模板内容基础上上传！',
        header: '批量导入',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: '下载模板',
        acceptLabel: '导入文件',
        reject: () => {
          this.$http.get('/域用户模板.xlsx', {
            baseURL: '',
            responseType: 'blob'
          }).then(res => {
            const link = document.createElement('a')
            const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.setAttribute('download', `域用户模板.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
        },
        accept: () => {
          let input = document.createElement('input');
          input.type = 'file';
          const that = this;
          let domainId =
              this.domainId.split("-")[1] == 0
                  ? this.domainId.split("-")[0]
                  : this.$global.Tree.searchDomainId(
                      this.treeData,
                      this.domainId.split("-")[0],
                      null
                  );
          input.onchange = function () {
            let file = this.files[0];
            console.log(file)
            let formData = new FormData();
            formData.append("file", file)
            formData.append("domainId", domainId)
            that.$http.post("/ou/importActiveUser", formData, {
              headers: {"Content-Type": "multipart/form-data"},
            }).then(res => {
              that.importLog = res.data
              if (res.data.length > 0) {
                that.importLogDisplay = true
              }
              that.getData()
            })
          }
          input.click()
        }
      })

    },
    exportxls() {
      let ouCN = this.domainId.split("-")[0];
      let domainId = this.$global.Tree.searchDomainId(
          this.treeData,
          this.domainId.split("-")[0],
          null
      );

      this.$http.get("/ou/exportActiveUserList", {
        params: {
          domainId: domainId,
          ouCN: ouCN
        },
        responseType: 'blob'
      }).then(res => {
        const name = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('=')[1]).replace(/\"/g, '');
        const link = document.createElement('a')
        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `${name}`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    format(str) {
      let timestr = str.substring(0, str.length - 1);

      const year = timestr.substring(0, 4);
      const month = timestr.substring(4, 6);
      const day = timestr.substring(6, 8);

      const hour = timestr.substring(8, 10);
      const min = timestr.substring(10, 12);
      const sou = timestr.substring(12, 14);

      return (
          year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sou
      );
    },
    changePage() {
      this.getData();
    },
    clearQuery() {
      this.query = {
        uid: null,
        ou: null,
        beginTime: null,
        endTime: null,
      };
      this.getData();
    },
    stop(e) {
      e.stopPropagation();
    },

    addOrUpdateUser(e, item) {
      // e.stopPropagation();
      //真 域id
      let domainId =
          Number(this.domainId.split("-")[1]) === 0
              ? this.domainId.split("-")[0]
              : this.$global.Tree.searchDomainId(
                  this.treeData,
                  this.domainId.split("-")[0],
                  null
              );
      this.userDisplay = true;
      this.$nextTick(() => {
        this.$refs.CreateUser.init(item, this.domainId, domainId, 1);
      });
    },
    trustUser(item) {
      let data = item;
      data.OUID = this.domainId.split("-")[0];
      this.getDC(this.treeData, this.domainId);
      data.DCID = this.DCID;
      this.trustUserDisplay = true;
      this.$nextTick(() => {
        this.$refs.trustUser.init(data);
      });
    },
    getDC(treeData, id) {
      for (let i = 0; i < treeData.length; i++) {
        let item = treeData[i];
        if (item.id == id) {
          if (item.pid != null && item.type == 1) {
            this.getDC(treeData, item.pid);
          } else {
            this.DCID = item.id.split("-")[0];
            break;
          }
        }
      }
    },
    closeDialog() {
      this.trustUserDisplay = false;
      this.updatePwdDisplay = false;
      this.userDisplay = false;
      this.deleteDisplay = false;
      this.changeStsItem = null;
      this.deleteItem = null;
      this.getData();
    },
    closeDelete() {
      this.deleteItem = null;
      this.changeStsItem = null;
      this.deleteDisplay = false;
    },
    getData() {
      if (Number(this.domainId.split("-")[1]) === 1) {
        this.$http
            .get("/ou/getActiveUserList", {
              params: {
                ouCN: this.domainId.split("-")[0],
                domainId: this.$global.Tree.searchDomainId(
                    this.treeData,
                    this.domainId.split("-")[0],
                    null
                ),
                keywords: this.query.uid,
                ou: this.query.ou,
                beginTime: new Date(this.query.beginTime).getTime(),
                endTime: new Date(this.query.endTime).getTime(),
                mobile: this.query.mobile,
                cn: this.query.name,
              },
            })
            .then((res) => {
              this.loading = false;
              this.list = res.data;
            });
      }
    },
    deleteDialog(item) {
      this.deleteDisplay = true;
      this.deleteItem = item;
    },
    submitDelete() {
      let list = [];
      let domainId =
          this.domainId.split("-")[1] == 0
              ? this.domainId.split("-")[0]
              : this.$global.Tree.searchDomainId(
                  this.treeData,
                  this.domainId.split("-")[0],
                  null
              );
      this.deleteDisplay = false;
      list.push(this.deleteItem.uid[0]);
      this.$http
          .get("/ou/removeUsers", {
            params: {
              ouId: this.domainId.split("-")[0],
              userCNList: list.toString(),
              domainId: domainId,
              preserve: this.deleteType,
            },
          })
          .then(() => {
            this.$toast.add({
              severity: "info",
              summary: "移除成功！ ",
              life: 3000,
            });
            this.closeDialog();
          });
    },
    changeStsDialog(data) {
      this.deleteDisplay = true;
      this.changeStsItem = data;
    },
    updatePwd(data) {
      let domainId =
          this.domainId.split("-")[1] == 0
              ? this.domainId.split("-")[0]
              : this.$global.Tree.searchDomainId(
                  this.treeData,
                  this.domainId.split("-")[0],
                  null
              );
      this.updatePwdDisplay = true;
      this.$nextTick(() => {
        this.$refs.updatePwd.init(
            "/domainuser/resetPasswd",
            data,
            domainId,
            "重置密码"
        );
      });
    },
    showButtons(e) {
      e.stopPropagation();

      let doc = e.path[2].children[1];
      if (doc.style.display == "none") {
        doc.style.display = "block";
      } else {
        doc.style.display = "none";
      }
    },
    updateEnable() {
      this.deleteDisplay = false;
      let domainId =
          this.domainId.split("-")[1] == 0
              ? this.domainId.split("-")[0]
              : this.$global.Tree.searchDomainId(
                  this.treeData,
                  this.domainId.split("-")[0],
                  null
              );
      if (this.changeStsItem.nsaccountlock) {
        this.$http
            .get("/domainuser/enable", {
              params: {
                uid: this.changeStsItem.uid[0],
                domainId: domainId,
              },
            })
            .then(() => {
              this.$toast.add({
                severity: "info",
                summary: "启用成功！ ",
                life: 3000,
              });
              this.closeDialog();
            });
      } else {
        this.$http
            .get("/domainuser/disable", {
              params: {
                uid: this.changeStsItem.uid[0],
                domainId: domainId,
              },
            })
            .then(() => {
              this.$toast.add({
                severity: "info",
                summary: "禁用成功！ ",
                life: 3000,
              });
              this.closeDialog();
            });
      }
    },
  },
};
</script>

<style scoped>
.btnClass {
  z-index: 99;
}

.table-title {
  margin: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.form {
  display: flex;
  width: calc(100% - 120px);
  justify-content: space-between;
}

/* @media only screen and (min-width: 1210px) { */
.serch-input {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: calc(100% - 320px);
}

.form-item {
  display: flex;
  align-items: center;
  width: 50%;
  margin-bottom: 1rem;
}

.form-item:nth-child(3) {
  width: 400px;
}

/* } */

/* @media only screen and (min-width: 940px) {
  .serch-input {
    display: flex;
    flex-wrap: wrap;
    width: 60%;

  }

  .form-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 1rem;
  }
}

@media only screen and (min-width: 1335px) {
  .serch-input {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
  }

  .form-item {
    display: flex;
    align-items: center;
    width: 50%;
    margin-bottom: 1rem;
  }
} */

.form-item label {
  width: 90px;
  text-align: right;
}

.center {
  width: 100%;
  text-align: center;
}

.text {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.inout-t {
  height: 29px;
  border: 1px solid #ced4da;
}

::v-deep(.p-button) {
  height: 29px !important;
}

::v-deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  line-height: 27px;
}

::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(
    .p-datatable-scrollable .p-datatable-thead > tr > th,
    .p-datatable-scrollable .p-datatable-tbody > tr > td,
    .p-datatable-scrollable .p-datatable-tfoot > tr > td
  ) {
  justify-content: center !important;
}

.butUL {
  max-width: 160px;
  display: none;
  padding: 0.25rem 0;
  background: #ffffff;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  z-index: 9999;
  list-style: none;
  margin: 0;
  position: absolute;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
  0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

::v-deep(.p-splitbutton .p-button) {
  background-color: transparent;
  border: none;
  color: #1fa1fc;
  padding-right: 0;
}

#bs > .btnUL > li {
  width: 100%;
}

#card {
  height: 100%;
  overflow: hidden;
}

::v-deep(.p-menuitem .p-menuitem-link) {
  color: revert;
}

::v-deep(.p-menuitem .p-menuitem-link .p-menuitem-text) {
  color: revert;
}

.search-buttons > .p-button {
  padding: 0.5rem;
}

.content {
  width: 100%;
  height: calc(100% - 58px);
  margin-top: 1rem;
  overflow: hidden;
}

.dialog-text {
  width: 260px;
  display: flex;
  flex-wrap: wrap;
  line-height: 35px;
  padding-left: 3rem;
}

.dialog-radio {
  width: 100%;
  display: flex;
  align-items: center;
  padding-right: 1rem;
}

::v-deep(p-menuitem-link) {
  color: inherit;
}

::v-deep(
    .p-tieredmenu
      .p-menuitem.p-menuitem-active
      > .p-menuitem-link
      .p-menuitem-text
  ) {
  color: inherit;
}

.radiorow {
  display: flex;
  column-gap: .5rem;
  margin-bottom: 1rem;
}
</style>
