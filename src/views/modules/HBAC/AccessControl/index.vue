<template>
  <div class="page p-grid">
    <div class="p-col-4 p-p-0" style="border-right:1px solid #dee2e6 ">
      <p class="title">
        <span>
          <span>规则库</span>
          <TreeSelect v-model="treeSelect" class="input p-ml-2" @node-select="changTree" :options="treeList"
                      placeholder="请选择域"/>
        </span>
        <Button v-if="treeList&& treeList.length>0 &&treeList[0].key.split('-')[0] !==domainId" icon="pi pi-plus"
                class="p-button-text" @click="addRole()"/>
      </p>
      <DataTable class="p-datatable-sm" @row-click="changeRoleLibrary" :auto-layout="true" selectionMode="single"
                 dataKey="cn" style="height:calc(100% - 50px);overflow:auto" :value="list" :rowHover="true"
                 :scrollable="true" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                 paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                 currentPageReportTemplate="共 {totalRecords} 条记录">
        <template #empty>
          <p style="width:100%;text-align: left">暂无信息...</p>
        </template>
        <Column header="名称">
          <template #body="a">
            <span v-if="a.data.cn">{{ a.data.cn[0] }}</span>
          </template>
        </Column>
        <Column header="描述">
          <template #body="a">
            <span v-if="a.data.description">{{ a.data.description[0] }}</span>
          </template>
        </Column>

        <Column header="启用状态">
          <template #body="a">
            <span>{{ a.data.ipaenabledflag[0] === 'TRUE' ? '启用' : '禁用' }}</span>
          </template>
        </Column>

        <Column header="操作" style="min-width: 120px">
          <template #body="a">
            <Button class="p-button-sm p-button-link p-p-0 p-mr-1" @click="addRole(a.data)">
              编辑
            </Button>
            <Button class="p-button-sm p-button-link p-p-0 p-mr-1" @click="changeEnable(a.data)">
              {{ a.data.ipaenabledflag[0] === 'TRUE' ? '禁用' : '启用' }}
            </Button>
            <Button v-if="a.data.cn[0] !=='allow_all'" class="p-button-sm p-button-link p-p-0" style="color: red"
                    @click="deleteDialog(a.data)">移除
            </Button>
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="p-col-8 p-p-0" style="height:calc(100% - 50px)">
      <p class="title">{{ sItem != null ? '"' + sItem.cn + '" 下的所有规则' : '所有规则（请在左侧选择一个规则库）' }}</p>
      <div class="content">
        <div class="p-p-3">
          <h5>域用户</h5>
          <div class="table-title">
            <Button :class="{'p-disabled':sItem==null}" @click="addUser()">添加域用户</Button>

          </div>
          <DataTable style="margin-top: 10px;width: 100%;height:calc(100% - 60px);overflow:auto" :value="userList"
                     frozenWidth="200px" :rowHover="true" :scrollable="true" paginator :rows="10"
                     :rowsPerPageOptions="[10, 20, 50,100]"
                     paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                     currentPageReportTemplate="共 {totalRecords} 条记录">
            <template #empty>
              <p style="width:100%;text-align: left">暂无信息...</p>
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
            <Column header="操作" :frozen="true" alignFrozen="right" style="min-width: 8rem;justify-content: center">
              <template #body="item">

                <Button class="p-button-link p-button-sm" style="color: red" @click="deleteUserById(item.data)">移除
                </Button>
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="p-p-3">
          <h5>主机</h5>
          <div class="table-title">
            <Button :class="{'p-disabled':sItem==null}" @click="addHost">添加主机</Button>

          </div>
          <DataTable :value="hostList" :scrollable="true"
                     paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                     paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                     currentPageReportTemplate="共 {totalRecords} 条记录">
            <Column selectionMode="multiple" style="width: 3em"></Column>
            <template #empty>
              <p style="width:100%;text-align:left">暂无信息...</p>
            </template>
            <column field="fqdn" style="min-width: 15rem" header="主机名">
              <template #body="a">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="a.data.fqdn ? a.data.fqdn[0] : ''">
            <span class="text-ellipsis">{{ a.data.fqdn ? a.data.fqdn[0] : '' }}</span>
          </span>
              </template>
            </column>
            <column header="所在组织单位" field="" style="min-width: 8rem">
              <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.ouName">
            {{ row.data?.details?.ouName }}
          </span>
              </template>
            </column>
            <column header="最后登录账号" style="min-width: 10rem">
              <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.uid">
            {{ row.data?.details?.uid }}
          </span>
              </template>
            </column>
            <column header="姓名" style="min-width: 6rem">
              <template #body="row">
          <span v-tooltip.top="row.data?.details?.userName">
            {{ row.data?.details?.userName }}
          </span>
              </template>
            </column>
            <column header="是否入域" style="min-width: 6rem">
              <template #body="row">
          <span :class="{'p-tag':true,'p-tag-success':row.data.has_keytab,'p-tag-danger':!row.data.has_keytab}">{{
              row.data.has_keytab ? '已入域' : '已退域'
            }}</span>
              </template>
            </column>
            <column header="系统名称" style="min-width: 12rem">
              <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.sysName">
            {{ row.data?.details?.sysName }}
          </span>
              </template>
            </column>
            <column header="系统版本" style="min-width:15rem">
              <template #body="row"> <span
                  style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                  v-tooltip.top="row.data?.details?.sysVersion">
            {{ row.data?.details?.sysVersion }}</span>
              </template>
            </column>
            <column header="架构" style="min-width: 6rem">
              <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.sysArch">
            {{ row.data?.details?.sysArch }}
          </span>
              </template>
            </column>
            <column header="IP" style="min-width: 8rem">
              <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.ip">
            {{ row.data?.details?.ip }}
          </span>
              </template>
            </column>
            <column header="MAC" style="min-width: 10rem">
              <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.mac">
            {{ row.data?.details?.mac }}
          </span>
              </template>
            </column>
            <!-- <column header="终端序列号" style="min-width: 8rem">
              <template #body="row">
                <span v-tooltip.top="row.data?.details?.sn">
                  {{ row.data?.details?.sn }}
                </span>
              </template>
            </column> -->
            <column header="客户端版本" style="min-width: 8rem">
              <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.clientVersion">
            {{ row.data?.details?.clientVersion }}
          </span>
              </template>
            </column>
            <column header="最后登录时间" style="min-width: 12rem">
              <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="this.$global.Util.getFormatDate(row.data?.details?.accessTime)">{{
              this.$global.Util.getFormatDate(row.data?.details?.accessTime)
            }}</span>
              </template>
            </column>
            <column header="是否在线" style="min-width: 6rem">
              <template #body="row">
                <Tag v-if="row.data.details" style="color:white"
                     :severity="row.data?.details?.isOnline==0?'success':(row.data?.details?.isOnline==1?'danger':(row.data?.details?.isOnline==2?'warning':null))"
                     :value="row.data?.details?.isOnline==0?'在线':(row.data?.details?.isOnline==1?'离线':(row.data?.details?.isOnline==2?'未知':null))"></Tag>
                <Tag style="color:white" v-else severity="warning">未知</Tag>
              </template>
            </column>
            <Column header="操作" :frozen="true" alignFrozen="right" style="min-width: 8rem;justify-content: center">
              <template #body="item">
                <Button class="p-button-link p-button-sm" style="color: red" @click="deleteHostById(item.data)">移除
                </Button>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <Sidebar :position="'right'" style="width:40vw" v-model:visible="addUserDisplay" :modal="true">

      <template #header>
        <strong>添加用户</strong>
      </template>
      <div class="p-p-3 " style="display:flex;align-items: center;justify-content: space-between">
        <Button @click="addUsers">添加所选用户</Button>
        <div class="from">
          <div class="form-item p-mr-3">
            <label>名称：</label>
            <InputText class="inout-t" v-model="uid"></InputText>
          </div>
          <Button @click="getAllUser">查询</Button>
        </div>
      </div>
      <DataTable :value="allUser" v-model:selection="selectedUser" :scrollable="true"
                 paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                 paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                 currentPageReportTemplate="共 {totalRecords} 条记录">
        <Column selectionMode="multiple" style="width: 3em"></Column>
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
      </DataTable>
    </Sidebar>

    <Sidebar position="right" style="width:40vw" v-model:visible="addHostDisplay" :modal="true">
      <template #header><strong>主机添加</strong></template>

      <div class="p-p-3" style="display:flex;align-items: center;justify-content: space-between">
        <Button @click="addSelected">添加所选主机</Button>
        <div class="from">
          <div class="form-item p-mr-3">
            <label>名称：</label>
            <InputText class="inout-t" v-model="hostname"></InputText>
          </div>
          <Button @click="getAllHost">查询</Button>
        </div>
      </div>
      <DataTable :value="allHost" v-model:selection="selectedHost" :scrollable="true"
                 paginator :rows="10" :rowsPerPageOptions="[10, 20, 50,100]"
                 paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                 currentPageReportTemplate="共 {totalRecords} 条记录">
        <Column selectionMode="multiple" style="width: 3em"></Column>
        <template #empty>
          <p style="width:100%;text-align:left">暂无信息...</p>
        </template>
        <column field="fqdn" style="min-width: 15rem" header="主机名">
          <template #body="a">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="a.data.fqdn ? a.data.fqdn[0] : ''">
            <span class="text-ellipsis">{{ a.data.fqdn ? a.data.fqdn[0] : '' }}</span>
          </span>
          </template>
        </column>
        <column header="所在组织单位" field="" style="min-width: 8rem">
          <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.ouName">
            {{ row.data?.details?.ouName }}
          </span>
          </template>
        </column>
        <column header="最后登录账号" style="min-width: 10rem">
          <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.uid">
            {{ row.data?.details?.uid }}
          </span>
          </template>
        </column>
        <column header="姓名" style="min-width: 6rem">
          <template #body="row">
          <span v-tooltip.top="row.data?.details?.userName">
            {{ row.data?.details?.userName }}
          </span>
          </template>
        </column>
        <column header="是否入域" style="min-width: 6rem">
          <template #body="row">
          <span :class="{'p-tag':true,'p-tag-success':row.data.has_keytab,'p-tag-danger':!row.data.has_keytab}">{{
              row.data.has_keytab ? '已入域' : '已退域'
            }}</span>
          </template>
        </column>
        <column header="系统名称" style="min-width: 12rem">
          <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.sysName">
            {{ row.data?.details?.sysName }}
          </span>
          </template>
        </column>
        <column header="系统版本" style="min-width:15rem">
          <template #body="row"> <span
              style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
              v-tooltip.top="row.data?.details?.sysVersion">
            {{ row.data?.details?.sysVersion }}</span>
          </template>
        </column>
        <column header="架构" style="min-width: 6rem">
          <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.sysArch">
            {{ row.data?.details?.sysArch }}
          </span>
          </template>
        </column>
        <column header="IP" style="min-width: 8rem">
          <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.ip">
            {{ row.data?.details?.ip }}
          </span>
          </template>
        </column>
        <column header="MAC" style="min-width: 10rem">
          <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.mac">
            {{ row.data?.details?.mac }}
          </span>
          </template>
        </column>
        <!-- <column header="终端序列号" style="min-width: 8rem">
          <template #body="row">
            <span v-tooltip.top="row.data?.details?.sn">
              {{ row.data?.details?.sn }}
            </span>
          </template>
        </column> -->
        <column header="客户端版本" style="min-width: 8rem">
          <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="row.data?.details?.clientVersion">
            {{ row.data?.details?.clientVersion }}
          </span>
          </template>
        </column>
        <column header="最后登录时间" style="min-width: 12rem">
          <template #body="row">
          <span style="width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden"
                v-tooltip.top="this.$global.Util.getFormatDate(row.data?.details?.accessTime)">{{
              this.$global.Util.getFormatDate(row.data?.details?.accessTime)
            }}</span>
          </template>
        </column>
        <column header="是否在线" style="min-width: 6rem">
          <template #body="row">
            <Tag v-if="row.data.details" style="color:white"
                 :severity="row.data?.details?.isOnline==0?'success':(row.data?.details?.isOnline==1?'danger':(row.data?.details?.isOnline==2?'warning':null))"
                 :value="row.data?.details?.isOnline==0?'在线':(row.data?.details?.isOnline==1?'离线':(row.data?.details?.isOnline==2?'未知':null))"></Tag>
            <Tag style="color:white" v-else severity="warning">未知</Tag>
          </template>
        </column>
      </DataTable>

    </Sidebar>
    <add-roles v-if="addRoleDisplay" ref="addrole" @close="closeAddRole"></add-roles>
  </div>


</template>

<script>
import AddRoles from "@/views/modules/HBAC/AccessControl/AddRoles";
import log from "@/views/modules/DomainLog/log.vue";


export default {
  name: "RoleList",
  components: {AddRoles},
  data() {
    return {
      list: null,
      userList: null,
      hostList: null,


      deleteItem: null,
      sItem: null,

      treeSelect: {},
      treeList: [],
      domainId: null,
      selectNodeInfo: null,
      allUser: [],
      selectedUser: [],
      addUserDisplay: false,
      addRoleDisplay: false,
      addHostDisplay: false,
      allHost: [],
      selectedHost: [],
      uid: null,
      hostname: null
    };
  },
  mounted() {
    this.$http.get("/domain/tree").then((res) => {
      let data = res.data;
      data = data.filter((item) => {
        return item.type === "0" && item.upStatus === 0;
      });
      this.treeList = this.$global.Tree.makeTree(data);
    });
    this.domainId = localStorage.getItem("DOMAIN_ID");
    this.treeSelect[this.domainId + "-0"] = true;
    this.getData();
  },
  methods: {
    changeEnable(data) {
      let url;
      if (data.ipaenabledflag[0] === 'TRUE') {
        url = '/hbac/disable'
      } else {
        url = '/hbac/enable'
      }
      this.$http.get(url, {
        params: {
          domainId: data.domain_id,
          hbacCN: data.cn[0]
        }
      }).then(res => {
        if (res.success) {
          this.$toast.add({
            severity: "info",
            summary: "成功！ ",
            life: 3000,
          })
          this.getData()
        }
      })
    },
    deleteUserById(data) {
      this.$confirm.require({
        message: "确定要移除此用户？",
        header: "移除用户",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          this.$http
              .get("/hbac/removeUser", {
                params: {
                  domainId: this.sItem.domain_id,
                  hbacCN: this.sItem.cn[0],
                  uid: data.uid[0]
                },
              })
              .then(() => {
                this.$toast.add({
                  severity: "info",
                  summary: "删除成功！",
                  life: 3000,
                });
                this.getUserList()
              });
        },
        reject: () => {
          this.$confirm.close();
        },
      })
    },
    deleteHostById(data) {
      this.$confirm.require({
        message: "确定要移除此主机？",
        header: "移除主机",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          this.$http
              .get("/hbac/removeHost", {
                params: {
                  domainId: this.sItem.domain_id,
                  hbacCN: this.sItem.cn[0],
                  host: data.fqdn[0]
                },
              })
              .then(() => {
                this.$toast.add({
                  severity: "info",
                  summary: "删除成功！",
                  life: 3000,
                });
                this.getHostList()
              });
        },
        reject: () => {
          this.$confirm.close();
        },
      })
    },
    ouview(row) {
      let showstr = "";
      try {
        if (row.data.ou && row.data.ou.length > 0 && row.data.ou[0]) {

          let data = JSON.parse(row.data.ou[0])
              .ouDN.replace(/,DC=.*/, "")
              .replace(/,OU=/g, ",")
              .replace("OU=", "")
              .split(",");
          data.reverse();


          for (let i in data) {
            showstr += data[i];
            if (i < data.length - 1) {
              showstr += " / ";
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
      return showstr;
    },
    getData() {
      this.$http
          .get("/hbac/list", {
            params: {domainId: this.domainId},
          })
          .then((res) => {
            this.list = res.data;
          });
    },
    getUserList() {
      this.$http
          .get("/hbac/listUser", {
            params: {
              domainId: this.sItem.domain_id,
              hbacCN: this.sItem.cn[0]
            },
          })
          .then((res) => {
            this.userList = []
            for (let item of res.data) {
              this.userList.push(item.result)
            }


          });
    },
    getHostList() {
      this.$http
          .get("/hbac/listHost", {
            params: {
              domainId: this.sItem.domain_id,
              hbacCN: this.sItem.cn[0]
            },
          })
          .then((res) => {
            let list = [];
            for (let i in res.data) {
              list.push(res.data[i].result);
            }
            this.hostList = list;
          });
    },
    addRole(data) {
      this.addRoleDisplay = true
      this.$nextTick(() => {
        this.$refs.addrole.init(this.domainId, data)
      })
    },
    getAllUser() {
      this.$http.get("/hbac/listAllUser", {
        params: {
          domainId: this.sItem.domain_id,
          uid: this.uid
        }
      }).then(res => {
        this.allUser = res.data
      })
    },
    getAllHost() {
      this.$http.get("/hbac/listAllHost", {
        params: {
          domainId: this.sItem.domain_id,
          hostname: this.hostname
        }
      }).then(res => {
        this.allHost = res.data
      })
    },
    closeAddRole() {
      this.addRoleDisplay = false;
      this.getData()
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

    deleteDialog(data) {
      this.$confirm.require({
        message: "确定要删除此项？",
        header: "删除规则",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          this.$http
              .get("/hbac/remove", {
                params: {
                  domainId: data.domain_id,
                  hbacCN: data.cn[0]
                },
              })
              .then(() => {
                this.$toast.add({
                  severity: "info",
                  summary: "删除成功！",
                  life: 3000,
                });
                this.getData()
              });
        },
        reject: () => {
          this.$confirm.close();
        },
      })
    },
    // 树选择
    changTree(node) {
      console.log(node);
      this.selectNodeInfo = node;
      this.domainId = node.id.split("-")[0];
      this.getData();
      this.sItem = null;
      this.userList = null;
      this.hostList = null;

    },

    addUsers() {
      const list = this.selectedUser.map(item => item.uid[0])
      this.$http.get("/hbac/addUser", {
        params: {
          domainId: this.sItem.domain_id,
          hbacCN: this.sItem.cn[0],
          uidList: list.toString()
        }
      }).then(res => {
        this.getUserList()
        this.addUserDisplay = false
      })
    },
    addSelected() {
      const list = this.selectedHost.map(item => item.fqdn[0])
      this.$http.get("/hbac/addHost", {
        params: {
          domainId: this.sItem.domain_id,
          hbacCN: this.sItem.cn[0],
          hostList: list.toString()
        }
      }).then(res => {
        this.getHostList()
        this.addHostDisplay = false
      })
    },
    addUser() {
      this.selectedUser = []
      this.addUserDisplay = true;
      this.getAllUser()
    },
    addHost() {
      this.selectedHost = []
      this.addHostDisplay = true;
      this.getAllHost()
    },
    changeRoleLibrary(data) {
      this.sItem = data.data;

      this.getUserList()
      this.getHostList()
    },

  },
};
</script>

<style scoped>
.p-grid {
  margin: 0;
}

.text {
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  height: calc(100% - 55px);
  overflow-y: auto;
}

.table-title {
  display: flex;
  justify-content: space-between;
}

.from {
  display: flex;
}

::v-deep(.p-datatable .p-column-header-content) {
  justify-content: center;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  justify-content: center;
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
  justify-content: center;
}

.center {
  width: 100%;
  text-align: center;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep(.p-treeselect .p-treeselect-label) {
  padding: 0 0 0 1rem;
  line-height: 30px;
}

::v-deep(.p-treeselect) {
  border-radius: 30px;
}

.form-item {
  display: flex;
  align-items: center;
}
</style>
