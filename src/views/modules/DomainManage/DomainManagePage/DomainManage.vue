<template>
    <div class="page">
        <div class="p-left">
            <p class="title" style="margin-top:0.6rem">域林信息</p>
            <Tree :value="root" selectionMode="single" :expandedKeys="expandedKeys" v-model:selectionKeys="selectedKey"
                  @node-select="selectTreeNode">
                <template #default="data">
                    <!--   v-tooltip.top="data.node.label + ( data.node.upStatus == 0 ? '' :(data.node.upStatus==1?' (离线) ':'')) "-->
                    <div v-tooltip.top="data.node.tooltip" class="treeNode" :draggable="data.node.type === '1'"
                         @dragstart="onDragstart($event, data.node)" @dragenter="onDragenter($event, data.node)"
                         @dragover.prevent=""
                         @dragleave="onDragleave" @drop="onDrop($event, data.node)"
                         @contextmenu.prevent="showMenu($event, data)">
                        <i :style="{ 'color': data.node.type === '1' ? '' : (data.node.type === '2' ? (data.node.enable == 0 ? '#000' : 'red') : (data.node.upStatus == 0 ? '#057748' : '#f47983')) }"
                           class="p-mr-2" style="pointer-events: none" :class="data.node.icon_s"/>
                        <span style="width:calc(100% - 18px);pointer-events: none;
                  display:inline-block;"
                              :class="{ 'delete-line': (data.node.upStatus === 1 || data.node.enable === 1) }">
              <!-- {{data.node.tooltip}} -->
              {{ data.node.label }}
              {{ data.node.upStatus == 0 ? '' : (data.node.upStatus == 1 ? '(离线)' : '') }}
            </span>
                    </div>
                </template>
            </Tree>
        </div>
        <div class="p-right p-p-3" style="position: relative;">
            <TabMenu :model="items"/>
            <div style="padding:10px 10px 0 10px;height: calc(100% - 45px)">
                <p class="Breadcrumb"><i class="fa fa-home p-mr-2"/>当前位置：{{ path }}</p>
                <div class="content-view">
                    <router-view v-on:close="getData" @status='getData' :updateFlag="updateFlag" :domainId="domainId"
                                 :treeData="treeData" :status="status"/>
                </div>
            </div>
        </div>
    </div>
    <!--  右键view-->
    <ContextMenu style="padding:10px;width: 250px;" ref="menu" :model="rightMenu">
        <template #item="{ item }">
            <p @click="selectMenu(item.index)"
               :style="{
          'color': Number(item.index) === 3 || Number(item.index) === 7 || Number(item.index) === 9 || Number(item.index) === 14 ? '#ff461f' : '#495057',
          borderBottom: item.border ? '1px solid #dee2e6' : null, marginBottom: item.border ? '6px' : null, paddingBottom: item.border ? '10px' : null,
        }" class="menuItem"
               :class="{ 'bo': item.index == 4 }">
        <span style="display: inline-block;width: 20px;text-align: center">
          <i :class="item.icon"/>
        </span>
                {{ item.label }}
            </p>
        </template>
    </ContextMenu>
    <!--  删除dialog-->
    <Dialog v-model:visible="deleteDisplay" :modal="true" @hide="deleteDisplay = false"
            :header="domain && domain.id.split('-')[1] == 0 ? '删除域' : '删除组织单位'">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
            <span> 您确认要删除{{ domain && domain.id.split('-')[1] == 0 ? '域' : '组织单位' }} "{{ domain.name
                }}" 吗？</span>
        </div>
        <template #footer>
            <Button label="是" icon="pi pi-check" @click="submitDelete" class="p-button-link"/>
            <Button label="否" icon="pi pi-times" @click="deleteDisplay = false"
                    class="p-button-secondary p-button-link"/>
        </template>
    </Dialog>
    <Dialog v-model:visible="stateDisplay" :modal="true" @hide="closeChangeState"
            :header="domain ? (Number(domain.type) === 0 ? '更改上线状态' : '更改启用状态') : ''">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
            <span v-if="Number(domain.type) === 0"> 您确认要{{ domain.upStatus == 0 ? '下线' : '上线' }} "{{ domain.name
                }}" 吗？</span>
            <span v-if="Number(domain.type) === 2"> 您确认要{{ domain.enable == 0 ? '禁用' : '启用' }} "{{ domain.name
                }}" 吗？</span>
        </div>
        <template #footer>
            <Button label="是" icon="pi pi-check" @click="changeState()" class="p-button-link"/>
            <Button label="否" icon="pi pi-times" @click="closeChangeState" class="p-button-secondary p-button-link"/>
        </template>
    </Dialog>
    <!--新建组织单位-->
    <CreateAgencies v-if="createAgeDisplay" ref="CreateAge" v-on:close="closeDialog"></CreateAgencies>
    <!--编辑用户-->
    <DomainUserDialog v-if="domainUserDisplay" ref="domainUser" v-on:close="closeDialog"></DomainUserDialog>
    <!--上传LDIF文件-->
    <UploadLDIFFile v-if="uploadLDIFDisplay" ref="uploadLDIF" v-on:close="closeDialog"></UploadLDIFFile>
    <!--  新建域-->
    <CreateDomainCon v-if="createDomainDisplay" ref="domainCon" v-on:close="closeDialog"></CreateDomainCon>
    <!--  从Active Directory中同步结果-->
    <Dialog v-model:visible="syncDisplay" header="同步日志" :modal="true" @hide="syncDisplay = false">
        <div class="syncResult" v-html="syncRes"></div>
    </Dialog>
    <Dialog v-model:visible="importOULogDisplay" header="异常日志" :modal="true" @hide="importOULogDisplay=false">
        <p v-for="item in importOULog">{{ item }}</p>
    </Dialog>
    <!-- <add-group-device ref="addDevice" v-if="addDeviceDisplay" v-on:close="closeDialog()"></add-group-device> -->
</template>

<script>
import DomainUserDialog from "@/views/modules/DomainManage/DomainManagePage/Organization/DomainUserDialog";
import CreateAgencies from "@/views/modules/DomainManage/DomainManagePage/Organization/CreateAgencies";
import UploadLDIFFile from "@/views/modules/DomainManage/DomainManagePage/UploadLDIFFile";
import CreateDomainCon from "@/views/modules/DomainManage/DomainManagePage/CreateDomain";
import http from "@/http";
import {getCurrentInstance} from "vue";


const Menu = [
    {
        label: "新建域",
        icon: "fa fa-plus",
        index: 0,
    },
    {
        label: "添加子组织单位",
        icon: "fa fa-plus",
        index: 1,
    },
    {
        label: "编辑",
        icon: "fa fa-pencil",
        border: true,
        index: 2,
    },
    {
        label: "删除",
        icon: "fa fa-trash-o",
        index: 3,
    },
    {
        index: 4,
    },
    {
        label: "导入LDIF文件...",
        icon: "fa fa-upload",
        index: 5,
    },
    {
        label: "编辑域",
        icon: "fa fa-pencil",
        border: true,
        index: 6,
    },
    {
        label: "删除域",
        icon: "fa fa-trash-o",
        index: 7,
    },
    {
        label: "上线",
        icon: "fa fa-link",
        index: 8,
    },
    {
        label: "离线",
        icon: "fa fa-chain-broken",
        index: 9,
    },
    {
        label: "从Active Directory中同步此域...",
        icon: "fa fa-globe",
        index: 10,
    },
    {
        label: "从Active Directory中同步此OU...",
        icon: "fa fa-refresh",
        border: true,
        index: 11,
    },
    {
        label: "从Active Directory中仅同步OU...",
        icon: "fa fa-sitemap",
        border: true,
        index: 12,
    },
    {
        label: "启用",
        icon: "fa fa-link",
        index: 13,
    },
    {
        label: "禁用",
        icon: "fa fa-chain-broken",
        index: 14,
    },
    {
        label: "编辑策略",
        icon: "fa fa-chain-broken",
        index: 15,
    },
    {
        label: "批量导入",
        icon: "fa fa-upload",
        index: 16,
    }, {
        label: "批量导出",
        icon: "fa fa-download",
        index: 17
    }
];
export default {
    name: "DomainManage",
    components: {
        CreateDomainCon,
        UploadLDIFFile,
        CreateAgencies,
        DomainUserDialog,
        // AddGroupDevice,
    },
    data() {
        return {
            nodes: {},
            status: false,
            id: null,
            // addDeviceDisplay: false,
            expandedKeys: {
                "1-0": true,
            },
            rightMenu: {},
            createDomainDisplay: false,
            items: null,
            itemsY: [
                {
                    label: "常规",
                    icon: "pi pi-fw pi-info",
                    to: "/DomainManage/DomainManage",
                },
                {
                    label: "域控制器",
                    icon: "fa fa-globe",
                    to: "/DomainManage/DomainManage/DomainCon",
                },
                {
                    label: "域计算机",
                    icon: "pi pi-fw pi-desktop",
                    to: "/DomainManage/DomainManage/DomainComputer",
                },
                {
                    label: "跨域信任",
                    icon: "pi pi-fw pi-desktop",
                    to: "/DomainManage/DomainManage/TrustDomain",
                },
            ],
            itemsZ: [
                // {
                //   label: "常规",
                //   icon: "pi pi-fw pi-info",
                //   to: "/DomainManage/DomainManage",
                // },

                {
                    label: "域用户",
                    icon: "pi pi-fw pi-user",
                    to: "/DomainManage/DomainManage/DomainUser",
                },
                {
                    label: "组策略",
                    icon: "fa fa-users",
                    to: "/DomainManage/DomainManage/group-device",
                },
                {
                    label: "用户组",
                    icon: "pi pi-fw pi-users",
                    to: "/DomainManage/DomainManage/Group",
                },
            ],
            itemsK: [
                {
                    label: "策略内容",
                    icon: "pi pi-book",
                    to: "/DomainManage/DomainManage/domain-policy",
                },
            ],
            selectedKey: {},
            root: [],
            path: " ",
            treeData: null,
            deleteDisplay: false,
            domainId: "1-0",
            domain: null,
            createAgeDisplay: false,
            domainUserDisplay: false,
            uploadLDIFDisplay: false,
            stateDisplay: false,
            updateFlag: 0,
            nodeType: 0,
            syncDisplay: false,
            syncRes: null,
            importOULog: [],
            importOULogDisplay: false,
        };
    },
    beforeUnmount() {
        this.nodeType = 0;
    },
    mounted() {
        this.getData();
        // this.items = this.itemsY;
        this.itemsY.forEach((item, index) => {
            if (item.label == "跨域信任") {
                this.items = this.itemsY.slice(0, index);
            }
        });
        this.$router.push(this.items[0].to);
    },
    setup() {
        const {proxy} = getCurrentInstance();

        let node = null;

        function onDragstart(e, item) {
            node = item;
            e.dataTransfer.setData("dragNode", JSON.stringify(item));
        }

        function onDragenter(e, item) {
            if (node.pid === item.pid) {
                if (node.ordIdx > item.ordIdx) {
                    e.target.style.borderTop = "0.2rem solid rgb(17 48 102 / 60%)";
                } else if (node.ordIdx < item.ordIdx) {
                    e.target.style.borderBottom = "0.2rem solid rgb(17 48 102 / 60%)";
                }
            }
        }

        function onDragleave(e) {
            e.target.style.border = "none";
        }

        function onDrop(e, item) {
            e.target.style.border = "none";
            let data = e.dataTransfer.getData("dragNode");
            const dragNode = JSON.parse(data);
            //同一层级可以排序
            if (dragNode.pid === item.pid && dragNode.id !== item.id) {
                http
                    .get("/domain/changeOuIndex", {
                        params: {
                            changeItem: dragNode.id.split("-")[0],
                            itemTop: item.id.split("-")[0],
                        },
                    })
                    .then(() => {
                        proxy.getData();
                    });
            }
        }

        return {
            onDragstart,
            onDragenter,
            onDragleave,
            onDrop,
        };
    },
    methods: {
        showMenu(event, data) {
            this.domain = data.node;
            let node = data.node;
            // 右键按钮 显示的页签
            if (Number(node.id.split("-")[1]) === 0) {
                if (node.pid == null) {
                    this.rightMenu = this.makeMenu([0], Menu);
                } else {
                    this.rightMenu = this.makeMenu(
                        node.upStatus === 0
                            ? [1, 6, 16, 17, 5, 10, 12, 9, 7]
                            : [1, 6, 16, 17, 10, 12, 8, 7],
                        Menu
                    );
                }
            } else if (Number(node.id.split("-")[1]) === 1) {
                this.rightMenu = this.makeMenu([1, 2, 11, 3], Menu);
            } else if (Number(node.id.split("-")[1]) === 2) {
                // this.rightMenu = this.makeMenu([2, 9], Menu);
                this.rightMenu = this.makeMenu(
                    node.enable === 0 ? [15, 14] : [15, 13],
                    Menu
                );
            }

            if (this.domain) {
                this.$refs.menu.show(event);
            }
            // this.treeNode(data.node);
        },
        selectMenu(no) {
            if (no === 0 || no === 6) {
                this.createDomainCon();
            } else if (no === 1) {
                this.createDomain(false);
            } else if (no === 2) {
                this.createDomain(true);
            } else if (no === 3) {
                this.deleteDialog();
            } else if (no === 4) {
                this.domainUser(this.domain);
            } else if (no === 5) {
                this.uploadLDIFFile();
            } else if (no === 7) {
                this.deleteDialog();
            } else if (no === 8) {
                this.stateDisplay = true;
            } else if (no === 9) {
                this.stateDisplay = true;
            } else if (no === 10) {
                this.syncData(Number(this.domain.id.split("-")[0]), 1);
            } else if (no === 11) {
                this.syncData(Number(this.domain.id.split("-")[0]), 2);
            } else if (no === 12) {
                this.syncData(Number(this.domain.id.split("-")[0]), 3);
            } else if (no === 13) {
                this.stateDisplay = true;
            } else if (no === 14) {
                this.stateDisplay = true;
            } else if (no === 15) {
                let node = {
                    code: "dd",
                    icon: "pi pi-tag",
                    id: "17",
                    key: "17",
                    label: "个性化策略",
                    name: "个性化策略",
                    pid: "16",
                    type: "strategy",
                };
                localStorage.setItem("selectedNode", JSON.stringify(this.nodes));
                this.$router.push({
                    name: "desktop-background-img",
                    query: {sign: true},
                });

            } else if (no === 16) {
                this.BulkImport()
            } else if (no === 17) {
                this.BulkExport(Number(this.domain.id.split("-")[0]))
            }
        },

        BulkExport(domainId) {
            this.$http.get("/domain/bulkExport", {
                params: {
                    pid: domainId
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
        BulkImport() {
            this.$confirm.require({
                message: '请在模板内容基础上上传！',
                header: '批量导入',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: '下载模板',
                acceptLabel: '导入文件',
                reject: () => {
                    this.$http.get('/组织模板.xlsx', {
                        baseURL: '',
                        responseType: 'blob'
                    }).then(res => {
                        const link = document.createElement('a')
                        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
                        link.style.display = 'none'
                        link.href = URL.createObjectURL(blob)
                        link.setAttribute('download', `组织模板.xlsx`)
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                    })
                },
                accept: () => {
                    let input = document.createElement('input');
                    input.type = 'file';
                    const that = this;
                    input.onchange = function () {
                        let file = this.files[0];
                        console.log(file)
                        let formData = new FormData();
                        formData.append("file", file)
                        that.$http.post("/domain/bulkImport", formData, {
                            headers: {"Content-Type": "multipart/form-data"},
                        }).then(res => {
                            that.importOULog = res.data
                            if (res.data.length > 0) {
                                that.importOULogDisplay = true
                            }
                            that.getData()
                        })
                    }
                    input.click()
                }
            })
        },

        syncData(id, type) {
            this.$refs.menu.hide();
            let url;
            let params;
            switch (type) {
                case 1:
                    url = "/sync_active_directory/syncAll";
                    params = {domainId: id};
                    break;
                case 2:
                    url = "/sync_active_directory/syncDomainUser";
                    params = {ouId: id};
                    break;
                case 3:
                    url = "/sync_active_directory/syncOU";
                    params = {domainId: id};
                    break;
            }

            this.$http
                .get(url, {
                    params: params,
                    timeout: 0,
                })
                .then((res) => {
                    this.syncDisplay = true;
                    this.syncRes = res.data;
                    this.getData();
                    if (this.updateFlag === 0) {
                        this.updateFlag = 1;
                    } else {
                        this.updateFlag = 0;
                    }
                });
        },

        uploadLDIFFile() {
            let domainId =
                this.domainId.split("-")[1] == 0
                    ? this.domainId.split("-")[0]
                    : this.$global.Tree.searchDomainId(
                        this.treeData,
                        this.domainId.split("-")[0],
                        null
                    );
            this.uploadLDIFDisplay = true;
            this.$nextTick(() => {
                this.$refs.uploadLDIF.init(this.domain, domainId);
            });
        },
        domainUser(data) {
            let domainId =
                this.domainId.split("-")[1] == 0
                    ? this.domainId.split("-")[0]
                    : this.$global.Tree.searchDomainId(
                        this.treeData,
                        this.domainId.split("-")[0],
                        null
                    );
            this.domainUserDisplay = true;
            this.$nextTick(() => {
                this.$refs.domainUser.init(data, domainId);
            });
        },
        closeChangeState() {
            this.stateDisplay = false;
            this.getData();
        },
        changeState() {
            if (this.domain.type === "0") {
                this.$http
                    .get("/domain/changeUpStatus", {
                        params: {
                            domainId: this.domain.id.split("-")[0],
                            upStatus: this.domain.upStatus === 0 ? 1 : 0,
                        },
                    })
                    .then((res) => {
                        this.stateDisplay = false;
                        if (res.data) {
                            this.$toast.add({
                                severity: "info",
                                summary: "修改状态成功！",
                                life: 3000,
                            });
                        } else {
                            this.$toast.add({
                                severity: "error",
                                summary: "域的网络状态检查失败！",
                                life: 3000,
                            });
                        }
                    });
            } else if (this.domain.type == "2") {
                this.$http
                    .get("/strategy/settings/enable", {
                        params: {
                            refId: this.domain.refid,
                            enable: this.domain.enable == 0 ? 1 : 0,
                        },
                    })
                    .then((res) => {
                        this.status = !this.status;
                        this.stateDisplay = false;
                        this.getData();
                        if (res.success) {
                            this.$toast.add({
                                severity: "info",
                                summary: "修改状态成功！",
                                life: 3000,
                            });
                        } else {
                            this.$toast.add({
                                severity: "error",
                                summary: "域的网络状态检查失败！",
                                life: 3000,
                            });
                        }
                    });
            }
        },
        getData() {
            this.$http.get("/domain/tree").then((res) => {
                let data = res.data;
                this.treeData = res.data;
                this.root = this.$global.Tree.makeTree(data, false);
                if (Object.keys(this.selectedKey).length === 0) {
                    for (let item of res.data) {
                        // pid为空是根
                        if (item.pid == null) {
                            // 默认选择根节点
                            this.path = item.name;
                            this.domainId = item.id;
                            this.domain = item;
                            this.selectedKey[item.id] = true;
                            this.rightMenu = this.makeMenu([0], Menu);
                            console.log(this.selectedKey);
                        }
                    }
                } else {
                    let selectItemData = data.filter((item) => {
                        return item.id === Object.keys(this.selectedKey)[0];
                    });
                    this.domain = selectItemData[0];
                    this.rightMenu = this.makeMenu(
                        selectItemData[0].upStatus === 0 ? [1, 5, 6, 9, 7] : [1, 6, 8, 7],
                        Menu
                    );
                }
            });
        },
        createDomainCon() {
            this.createDomainDisplay = true;
            this.$nextTick(() => {
                this.$refs.domainCon.init(this.domain.id);
            });
        },
        createDomain(isAdd) {
            let domainId =
                this.domainId.split("-")[1] == 0
                    ? this.domainId.split("-")[0]
                    : this.$global.Tree.searchDomainId(
                        this.treeData,
                        this.domainId.split("-")[0],
                        null
                    );
            this.createAgeDisplay = true;
            this.$nextTick(() => {
                this.$refs.CreateAge.init(isAdd, this.domain, domainId);
            });
        },
        closeDialog() {
            // this.addDeviceDisplay = false;
            this.createDomainDisplay = false;
            this.createAgeDisplay = false;
            this.domainUserDisplay = false;
            this.uploadLDIFDisplay = false;
            if (this.updateFlag == 0) {
                this.updateFlag = 1;
            } else {
                this.updateFlag = 0;
            }
            this.getData();
        },

        makeMenu(list, data) {
            let res = [];
            // let lists = [];
            // lists.forEach((item) => {
            //   if (item != 8 && item != 7) {
            //     lists.push(item);
            //   }
            // });
            list.forEach((i) => {
                let node = JSON.parse(JSON.stringify(data[i]));
                if (i != 7 && i != 8 && this.domain && this.domain.upStatus === 1) {
                    node.disabled = true;
                }
                res.push(node);
            });
            return res;
        },
        selectTreeNode(node) {
            // console.log(node);
            if (node.type == "2") {
                this.$http
                    .get("/strategy/settings/getValues", {
                        params: {
                            strategyId: node.id.split("-")[0],
                        },
                    })
                    .then((res) => {
                        localStorage.setItem("device", JSON.stringify(res.data));
                        this.treeNode(node);
                    });
            } else {
                localStorage.removeItem("device");
                this.treeNode(node);
            }
        },
        treeNode(node) {
            // let nodes = {};
            // nodes.code = "default";
            this.nodes.icon = "pi pi-tag";
            this.nodes.id = node.id.split("-")[0];
            this.nodes.key = node.id.split("-")[0];
            this.nodes.label = node.label;
            this.nodes.name = node.name;
            // this.nodes.pid = "2";
            this.nodes.type =
                node.type == 0
                    ? "domain"
                    : node.type == 1
                        ? "folder"
                        : node.type == 2
                            ? "strategy"
                            : null;
            localStorage.setItem("selectedNode", JSON.stringify(this.nodes));
            this.$store.commit("changeDeviceFlag");
            /*this.domain = node

            // 右键按钮 显示的页签
            if (Number(node.id.split('-')[1]) === 0) {
              this.items = this.itemsY
              if (node.pid == null) {
                this.rightMenu = this.makeMenu([0], Menu)
              } else {
                this.rightMenu = this.makeMenu(node.upStatus === 0 ? [1, 6, 5, 10, 12, 9, 7] : [1, 6, 10, 12, 8, 7], Menu)
              }
            } else {
              this.rightMenu = this.makeMenu([1, 2, 11, 3], Menu)
              this.items = this.itemsZ
            }*/

            if (Number(node.id.split("-")[1]) === 0) {
                let list = this.itemsY;
                if (Number(node.id.split("-")[0]) === 1) {
                    list.forEach((item, index) => {
                        if (item.label == "跨域信任") {
                            this.items = list.slice(0, index);
                        }
                    });
                } else {
                    this.items = this.itemsY;
                }
            } else if (Number(node.id.split("-")[1]) === 1) {
                this.items = this.itemsZ;
            } else if (Number(node.id.split("-")[1]) === 2) {
                this.items = this.itemsK;
            }

            this.selectedKey[node.key] = true;
            // 当前路径文字
            this.path = "";
            this.searchParent(this.treeData, node.id);
            this.path = this.path.substring(0, this.path.length - 2);

            if (node["upStatus"] === 1) {
                this.$toast.add({
                    severity: "info",
                    summary: "无法显示离线域信息！",
                    life: 3000,
                });
                return;
            }
            this.id = this.$global.Tree.searchTypeZero(this.treeData, node.id, null);
            let data = {};

            data.strategyId = node.id.split("-")[0];
            data.domainId = this.id;

            if (node.pid) {
                data.ouId = node.pid.split("-")[0];
            }
            localStorage.setItem("policy", JSON.stringify(data));
            // 当从域转到组织单位或从组织单位转达域时，跳到常规界面
            if (this.nodeType != node.id.split("-")[1]) {
                if (node.id.split("-")[1] == "2") {
                    this.$router.push(this.itemsK[0].to);
                } else if (node.id.split('-')[1] == '1') {
                    this.$router.push(this.itemsZ[0].to)
                } else {
                    this.$router.push(this.itemsY[0].to);
                }
            }

            this.nodeType = node.id.split("-")[1];
            if (node.type != 2) {
                this.domainId = node.id;
            }
        },

        deleteDialog() {
            this.deleteDisplay = true;
        },
        submitDelete() {
            let domainId =
                this.domain.id.split("-")[1] == 0
                    ? this.domain.id.split("-")[0]
                    : this.$global.Tree.searchDomainId(
                        this.treeData,
                        this.domain.id.split("-")[0],
                        null
                    );
            this.deleteDisplay = false;
            if (this.domain.id.split("-")[1] == 0) {
                this.$http
                    .get("/domain/remove", {
                        params: {
                            ids: domainId,
                        },
                    })
                    .then(() => {
                        this.getData();
                        this.$toast.add({
                            severity: "info",
                            summary: "删除成功！ ",
                            life: 3000,
                        });
                    });
            } else {
                this.$http
                    .get("/ou/remove", {
                        params: {
                            domainId: domainId,
                            ids: this.domain.id.split("-")[0],
                        },
                    })
                    .then(() => {
                        this.$toast.add({
                            severity: "info",
                            summary: "删除成功！ ",
                            life: 3000,
                        });
                        this.getData();
                    });
            }
        },

        searchParent(treeData, id) {
            for (let x in treeData) {
                let curr = treeData[x];
                if (curr.id == id) {
                    this.path = curr.name + " / " + this.path;
                    if (curr.pid != null) {
                        this.searchParent(treeData, curr.pid);
                    } else {
                        break;
                    }
                }
            }
        },
    },
};
</script>

<style scoped>
.menuItem {
    padding: 6px 0;
    cursor: pointer;
    white-space: nowrap;
}

.menuItem:hover {
    background-color: #ccc;
}

.content-view {
    width: 100%;
    height: calc(100% - 50px);
}

.bo {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid #dee2e6;
}

.scrollView::-webkit-scrollbar {
    display: none;
}

.p-left {
    width: 280px;
    border-right: 1px solid #dee2e6;
}

.p-right {
    width: calc(100% - 280px);
}

.Breadcrumb {
    margin: 0;
    height: 20px;
    color: rgba(0, 0, 0, 0.447058823529412);
}

.Breadcrumb:hover {
    color: #1fa1fc;
}

::v-deep(.p-tree) {
    border: none;
    padding: 1rem;
    height: calc(100% - 60px);
    overflow-y: auto;
}

::v-deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem) {
    border-top: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
    border-left: 1px solid #dee2e6;
    border-radius: 5px 5px 0 0;
    margin-right: 15px;
}

::v-deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
    color: #015486;
    border: 1px solid transparent;
}

::v-deep(.p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler) {
    margin-right: 0;
}

.delete-line {
    text-decoration: line-through;
}

.syncResult {
    width: 600px;
    line-height: 22px;
    white-space: nowrap;
    overflow: auto;
}

::v-deep(.p-treenode-label) {
    flex: 1;
    display: flex;
    align-items: center;
    white-space: nowrap;
    width: calc(100% - 2rem);
    height: 2rem;
    border-radius: 2px;
}

::v-deep(.p-tree .p-tree-container .p-treenode .p-treenode-content .p-treenode-icon) {
    margin: 0;
}

::v-deep(.p-tree .p-tree-container .p-treenode .p-treenode-content:focus) {
    box-shadow: none;
}

.treeNode {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-left: 0.5rem;
}
</style>
