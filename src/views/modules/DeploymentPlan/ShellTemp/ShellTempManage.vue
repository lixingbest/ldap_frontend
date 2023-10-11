<template>
    <div class="page">
        <div class="border-r">
            <p class="title">脚本模板分类</p>
            <Tree :value="treeData" selectionMode="single" :expandedKeys="expandedKeys"
                  v-model:selectionKeys="selectedKeys" @node-select="selectTreeNode">
                <template #default="row">
                    <div @contextmenu.prevent="showContextmenu($event,row.node)">{{ row.node.label }}</div>
                </template>
            </Tree>
            <context-menu ref="context" :model="contextmenuList"></context-menu>
            <add-or-update-type ref="typeDialog" v-if="typeDisplay" @close="hideTypeDialog"></add-or-update-type>
        </div>
        <div class="content">
            <div class="queryForm">
                <div>
                    <Button @click="addOrUpdate()">新增</Button>
                </div>
                <div class="query-input">
                    <div>
                        <label>命令名称：</label>
                        <InputText v-model="query.name" @keydown.enter="getTableData"></InputText>
                    </div>
                    <Button @click="getTableData()">查询</Button>
                </div>
            </div>
            <div class="p-p-3" style="marign-top:-1rem;height:calc(100% - 50px)">
                <DataTable frozenWidth="10rem" :rowHover="true" :value="tableData" :scrollable="true"
                           style="height:calc(100% - 70px);overflow:auto">
                    <template #empty> 暂无数据</template>
                    <Column style="text-align:center;min-width: 6rem;" field="code" header="编号"></Column>
                    <Column style="text-align:center;min-width: 6rem;" field="name" header="模板名称"></Column>

                    <Column field="shell" header="命令内容">
                        <template #body="row">
                            <div style="max-width: 40rem;overflow: hidden;text-overflow: ellipsis;">
                                {{ row.data.shell }}
                            </div>
                        </template>
                    </Column>
                    <Column style="text-align:center;min-width: 6rem;" field="comments" header="备注"></Column>
                    <Column :frozen="true" align-frozen="right" style="min-width: 15rem;" header="操作">
                        <template #body="row">
                            <Button class="p-button-sm p-button-link" @click="addOrUpdate(row.data)">编辑</Button>
                            <Button class="p-button-sm p-button-link" style="color: red"
                                    @click="deleteById(row.data.id)">删除
                            </Button>
                        </template>
                    </Column>
                </DataTable>
                <Paginator style="width:100%;text-align:center" :rows="page.size" :totalRecords="page.total"
                           @page="changePage"
                           template=" PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown CurrentPageReport"
                           :rowsPerPageOptions="[10,20,50,100]" currentPageReportTemplate="共 {totalRecords} 条记录">
                </Paginator>
            </div>
            <add-or-update-temp v-if="commandDisplay" ref="commandInst"
                                @close="closeAddOrUpdateInst"></add-or-update-temp>

        </div>
    </div>
</template>

<script>
import {reactive, nextTick, ref} from "vue";
import http from "../../../../http";
import AddOrUpdateType from "./addOrUpdateType";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import AddOrUpdateTemp from "@/views/modules/DeploymentPlan/ShellTemp/AddOrUpdateTemp";
import Util from "@/views/modules/Public/method/Util";

export default {
    name: "DomainLog",
    components: {AddOrUpdateTemp, AddOrUpdateType},
    setup() {
        const toast = useToast();
        const confirm = useConfirm();
        const showPolicy = ref(null);

        const treeData = ref([]);
        const expandedKeys = ref({});
        const selectedKeys = ref({});
        const getTreeData = () => {
            http.get("/shellTemp/getTree").then((res) => {
                treeData.value = res.data;
                expandedKeys.value = {};
                selectedKeys.value = {};
                expandedKeys.value[res.data[0].key] = true;
                selectedKeys.value[res.data[0].key] = true;

                selectTreeNode(res.data[0]);
            });
        };
        getTreeData();

        let selectedNode = null;
        const selectTreeNode = (node) => {
            selectedNode = node;
            getTableData();
        };

        const context = ref(null);

        const typeDialog = ref(null);
        const typeDisplay = ref(false);

        const showTypeDialog = (type) => {
            typeDisplay.value = true;
            nextTick(() => {
                typeDialog.value.init(type, nodeData);
            });
        };
        const hideTypeDialog = () => {
            typeDisplay.value = false;
            getTreeData();
        };

        const contextmenu = [
            {
                label: "新增类型",
                icon: "pi pi-plus-circle",
                command: () => {
                    showTypeDialog("add");
                },
            },
            {
                label: "编辑",
                icon: "pi pi-pencil",
                command: () => {
                    showTypeDialog("update");
                },
            },
            {
                label: "删除类型",
                icon: "pi pi-trash",
                command: () => {
                    confirm.require({
                        message: "您确定删除此类型？",
                        header: "删除类型",
                        icon: "pi pi-info-circle",
                        acceptLabel: "确定",
                        rejectLabel: "取消",
                        accept: () => {
                            http
                                .delete("/shellTemp/deleteType/" + nodeData.data.id)
                                .then((res) => {
                                    if (res["success"]) {
                                        toast.add({
                                            severity: "info",
                                            summary: "删除成功！",
                                            life: 3000,
                                        });
                                        getTreeData();
                                    } else {
                                        toast.add({
                                            severity: "warn",
                                            summary: res.message,
                                            life: 3000,
                                        });
                                    }
                                });
                        },
                        reject: () => {
                            confirm.close();
                        },
                    });
                },
            },
        ];
        const contextmenuList = ref([]);

        let nodeData = null;
        const showContextmenu = (event, node) => {
            if (node.data.code === "root") {
                contextmenuList.value = contextmenu.filter(
                    (item) => !item.label.includes("删除类型")
                );
            } else {
                contextmenuList.value = contextmenu;
            }
            context.value.show(event);

            nodeData = node;
        };

        const page = reactive({
            current: 1,
            size: 10,
            total: 0,
        });

        const tableData = ref([]);

        const query = reactive({
            name: null,
        });

        function getTableData() {
            http
                .get("/shellTemp/getTempPage", {
                    params: {
                        current: page.current,
                        size: page.size,
                        typeId: selectedNode.data.id,
                        name: query.name,
                    },
                })
                .then((res) => {
                    if (res.success) {
                        tableData.value = res.data.records;
                        page.total = res.data.total;
                    }
                });
        }

        function changePage(event) {
            page.current = event.page + 1;
            page.size = event.rows;
            getTableData();
        }

        const commandDisplay = ref(false);
        const commandInst = ref(null);

        function addOrUpdate(data) {
            commandDisplay.value = true;
            nextTick(() => {
                commandInst.value.init(data);
            });
        }

        function closeAddOrUpdateInst() {
            commandDisplay.value = false;
            getTableData();
        }

        function deleteById(id) {
            confirm.require({
                message: "您确定删除此命令？",
                header: "删除命令",
                icon: "pi pi-info-circle",
                acceptLabel: "确定",
                rejectLabel: "取消",
                accept: () => {
                    http.delete("/shellTemp/deleteById/" + id).then((res) => {
                        if (res["success"]) {
                            toast.add({
                                severity: "info",
                                summary: "删除成功！",
                                life: 3000,
                            });
                            getTreeData();
                        } else {
                            toast.add({
                                severity: "warn",
                                summary: res.message,
                                life: 3000,
                            });
                        }
                    });
                },
                reject: () => {
                    confirm.close();
                },
            });
        }

        return {
            showPolicy,
            treeData,
            expandedKeys,
            selectedKeys,
            selectTreeNode,
            context,
            contextmenuList,
            showContextmenu,
            typeDisplay,
            typeDialog,
            hideTypeDialog,
            page,
            getTableData,
            tableData,
            changePage,
            query,
            commandInst,
            commandDisplay,
            closeAddOrUpdateInst,
            addOrUpdate,
            deleteById,
            Util,
        };
    },
};
</script>

<style scoped>
::v-deep(.p-tree) {
    border: none;
    padding: 1rem;
    height: calc(100% - 60px);
    overflow-y: auto;
}

::v-deep(.p-treenode-label) {
    flex: 1;
}

::v-deep(.p-datatable-scrollable .p-datatable-thead > tr > th) {
    justify-content: center;
    white-space: nowrap;
}

::v-deep(.p-datatable-scrollable .p-datatable-tbody > tr > td) {
    justify-content: center;
    overflow: hidden;
    white-space: nowrap;
}

::v-deep(.p-datatable-scrollable .p-datatable-tfoot > tr > td) {
    justify-content: center;
}

.content {
    width: calc(100% - 280px);
    height: 100%;
}

.table-head {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.queryForm {
    padding: 2rem 0 0 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.queryForm > div {
    margin-right: 1rem;
    display: flex;
    flex-wrap: wrap;
}

.query-input > div {
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.query-input > div > input {
    margin-right: 0.5rem;
    width: calc(100% - 100px);
}

.result-menu {
    list-style: none;
    display: flex;
    margin: 0 0 1rem 0;
    padding: 0;
    border-bottom: 2px solid;
    border-color: #ced4da;
}

.result-menu li {
    display: flex;
    justify-content: center;
    padding: 0 1rem 0 0;
    cursor: pointer;
}

.result-menu li span {
    padding: 0.8rem 1rem;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-top: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
    position: relative;
    bottom: -2px;
    z-index: 2;
    font-weight: 600;
    background-color: #ffffff;
    border-color: #ced4da;
}
</style>
