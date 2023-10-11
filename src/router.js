import {createRouter, createWebHashHistory} from 'vue-router';

const childrenRouter = [
        {
            // path: '/SysOverview/CustomPanel',
            path: '',
            name: 'CustomPanel',
            component: () => import('./views/modules/SysOverview/CustomPanel'),
        },
        {
            path: '/report',
            component: () => import('./views/modules/SysReport/index.vue'),
            children: [
                {
                    path: 'sys',
                    component: () => import('./views/modules/SysReport/sysReport.vue')
                }
            ]
        },
        /**
         * 组策略
         */
        {
            path: '/GroupTactics',
            name: 'Index',
            component: () => import('./views/modules/GroupTactics/Index'),
            children: [
                // {
                //     path: '/GroupTactics/RoleList',
                //     name: 'RoleList',
                //     component: () => import('./views/modules/GroupTactics/Role/RoleList')
                // },
                // {
                //     path: '/GroupTactics/CommandList',
                //     name: 'CommandList',
                //     component: () => import('./views/modules/GroupTactics/Command/CommandList')
                // },
                {
                    path: '/GroupTactics/device-main',
                    name: 'device-main',
                    component: () => import('./views/modules/GroupTactics/Devices/device-main'),
                    children: [
                        {
                            path: '/GroupTactics/desktop-background-img',
                            name: 'desktop-background-img',
                            component: () => import('./views/modules/GroupTactics/Devices/components/desktop-background-img')
                        },
                        {
                            path: '/GroupTactics/screen-saver',
                            component: () => import('./views/modules/GroupTactics/Devices/components/screen-saver')
                        },
                        {
                            path: '/GroupTactics/lock-screen',
                            component: () => import('./views/modules/GroupTactics/Devices/components/lock-screen')
                        }, {
                            path: '/GroupTactics/account-security',
                            component: () => import('./views/modules/GroupTactics/Devices/components/account-security')
                        }, {
                            path: '/GroupTactics/apply-control-protection',
                            component: () => import('./views/modules/GroupTactics/Devices/components/apply-control-protection')
                        }, {
                            path: '/GroupTactics/desktop-share',
                            component: () => import('./views/modules/GroupTactics/Devices/components/desktop-share')

                        },
                        {
                            path: '/GroupTactics/network-protection',
                            component: () => import('./views/modules/GroupTactics/Devices/components/network-protection')
                        }
                    ]
                },
                {
                    path: '/PublicPolicy/publicPolicy',
                    name: 'publicPolicy',
                    component: () => import('./views/modules/PublicPolicy/PublicPolicy/publicPolicy')
                },
                {
                    path: '/GroupTactics/config',
                    name: 'GroupTactics-config',
                    component: () => import('./views/modules/GroupTactics/config/index.vue')
                }
            ]
        },
        /**
         * 报表
         */
        {
            path: '/Report/Report',
            name: 'Report',
            component: () => import('./views/modules/Report/Report')
        },
        /**
         * 域管理
         */
        {
            path: '/DomainManage',
            name: 'Domain',
            component: () => import('./views/modules/DomainManage/Domain'),
            children: [
                {
                    path: '/DomainManage/DomainManage',
                    name: 'DomainManage',
                    component: () => import('./views/modules/DomainManage/DomainManagePage/DomainManage'),
                    children: [
                        {
                            path: '/DomainManage/DomainManage/TrustDomain',
                            name: 'TrustDomain',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/KuaYuXinRen/IndexPage')
                        },
                        {
                            path: '',
                            name: 'Routine',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/Routine')
                        },
                        {
                            path: '/DomainManage/DomainManage/DomainCon',
                            name: 'DomainCon',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/domain-controller/DomainCon')
                        },
                        {
                            path: '/DomainManage/DomainManage/Organization',
                            name: 'Organization',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/Organization/Organization')
                        },
                        {
                            path: '/DomainManage/DomainManage/Group',
                            name: 'Group',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/UserGroup/Group')
                        },
                        {
                            path: '/DomainManage/DomainManage/DomainComputer',
                            name: 'DomainComputer',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/domain-computer/DomainComputer')
                        },
                        {
                            path: '/DomainManage/DomainManage/DomainUser',
                            name: 'DomainUser',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/DomianUser/DomainUser')
                        },
                        {
                            path: '/DomainManage/DomainManage/Permissions',
                            name: 'Permissions',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/Permissions')
                        },
                        {
                            path: '/DomainManage/DomainManage/group-device',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/groupDevice/group-device')
                        },
                        {
                            path: '/DomainManage/DomainManage/domain-policy',
                            component: () => import('./views/modules/DomainManage/DomainManagePage/domainPolicy/domain-policy')
                        },
                    ]
                },
                {
                    path: '/DomainManage/passwordPolicy',
                    name: 'passwordPolicy',
                    component: () => import('./views/modules/DomainManage/passwordPolicy/index')
                },

            ]
        },
        /**
         * AD集成
         */
        {
            path: '/integration',
            name: 'integration',
            component: () => import('./views/modules/integration/integration'),
            children: [
                {
                    path: '/integration/ActiveDirectoryXr',
                    name: 'ActiveDirectoryXr',
                    component: () => import('./views/modules/integration/ActiveDirectory/ActiveDirectoryXr')
                },
                {
                    path: '/integration/ActiveDirectoryTb',
                    name: 'ActiveDirectoryTb',
                    component: () => import('./views/modules/integration/ActiveDirectory/ActiveDirectoryTb')
                }

            ]
        },
        /**
         * 系统管理
         */
        {
            path: '/SystemManage',
            name: 'SystemManage',
            component: () => import('./views/modules/SystemManage/SystemManage'),
            children: [
                {
                    path: '/SystemManage/UserManage',
                    name: 'UserManage',
                    component: () => import('./views/modules/SystemManage/UserManage/UserManage'),
                },
                {
                    path: '/SystemManage/AgenciesManage',
                    name: 'AgenciesManage',
                    component: () => import('./views/modules/SystemManage/AgenciesManage'),
                },
                {
                    path: '/SystemManage/MenuManage',
                    name: 'MenuManage',
                    component: () => import('./views/modules/SystemManage/menu/MenuManage'),
                },
                {
                    path: '/SystemManage/RoleManage',
                    name: 'RoleManage',
                    component: () => import('./views/modules/SystemManage/role/RoleManage'),
                },
                {
                    path: '/SystemManage/Permissions',
                    name: 'SysPermissions',
                    component: () => import('./views/modules/SystemManage/Permissions'),
                },
                {
                    path: '/SystemManage/DataList',
                    name: 'DataList',
                    component: () => import('./views/modules/SystemManage/DataList/DataList'),
                },
                {
                    path: '/SystemManage/SysSetting',
                    name: 'SysSetting',
                    component: () => import('./views/modules/SystemManage/SysSetting'),
                    children: [
                        {
                            path: '/SystemManage/SysSetting/DirService',
                            name: 'DirService',
                            component: () => import('./views/modules/SystemManage/Settings/DirService'),
                        },
                        {
                            path: '',
                            name: 'BasicData',
                            component: () => import('./views/modules/SystemManage/Settings/BasicData'),
                        }
                    ]
                },
            ]
        },
        {
            path: '/LDAPEdit/LDAPEdit',
            name: 'LDEPEdit',
            component: () => import('./views/modules/LDAPEdit/LDAPEdit')
        },
        /***
         * 安全审计
         */
        {
            path: '/SecurityAudits/SecurityAudits',
            name: 'SecurityAudits',
            component: () => import('./views/modules/SecurityAudits/SecurityAudits'),
            children: [
                {
                    path: '/SecurityAudits/SessionDomain',
                    name: 'SessionDomain',
                    component: () => import('./views/modules/SecurityAudits/SessionDomain/SessionDomain'),
                    children: [
                        {
                            path: '',
                            name: 'SessionLine',
                            component: () => import('./views/modules/SecurityAudits/SessionDomain/SessionLine'),
                        },
                        {
                            path: '/SecurityAudits/SessionHistory',
                            name: 'SessionHistory',
                            component: () => import('./views/modules/SecurityAudits/SessionDomain/SessionHistory'),
                        }
                    ]
                },
                {
                    path: '/SecurityAudits/SecurityLog',
                    name: 'SecurityLog',
                    component: () => import('./views/modules/SecurityAudits/SecurityLog/SecurityLog'),
                    children: [
                        {
                            path: '',
                            name: 'LoginLog',
                            component: () => import('./views/modules/SecurityAudits/SecurityLog/LoginLog'),
                        },
                        {
                            path: '/SecurityAudits/SecurityLog/ActionLog',
                            name: 'ActionLog',
                            component: () => import('./views/modules/SecurityAudits/SecurityLog/ActionLog'),
                        }
                    ]
                }
            ]
        },
        /**
         * 系统审计
         *
         */
        {
            path: '/Audit',
            name: 'Audit',
            component: () => import('./views/modules/Audit/audit'),
            children: [
                {
                    path: '/Audit/AccessLog',
                    name: 'AccessLog',
                    component: () => import('./views/modules/Audit/AccessLog/AccessLog'),
                },
                {
                    path: '/Audit/SysLog',
                    name: 'SysLog',
                    component: () => import('./views/modules/Audit/SysLog/SysLog'),
                },
                {
                    path: '/Audit/UserLog',
                    name:'userLog',
                    component:()=>import('./views/modules/Audit/UserLog/index.vue')
                }
            ]
        },
        /**
         * 智能运维
         */
        {
            path: '/Operations',
            name: 'Operations',
            component: () => import('./views/modules/Operations/Operations'),
            children: [
                {
                    path: '/Operations/ExecuteJob',
                    name: 'ExecuteJob',
                    component: () => import('./views/modules/Operations/ExecuteJob/ExecuteJob'),
                },
                {
                    path: '/Operations/JobTemplate',
                    name: 'JobTemplate',
                    component: () => import('./views/modules/Operations/JobTemplate/JobTemplate'),
                }
            ]
        },
        /**
         * HBAC
         */
        {
            path: '/HBAC',
            name: 'HBAC',
            component: () => import('./views/modules/HBAC/HBAC'),
            children: [
                {
                    path: '/GroupTactics/RoleList',
                    name: 'RoleList',
                    component: () => import('./views/modules/HBAC/Role/RoleList'),
                },
                {
                    path: '/GroupTactics/CommandList',
                    name: 'JobTemplate',
                    component: () => import('./views/modules/HBAC/Command/CommandList'),
                },
                {
                    path: '/GroupTactics/AccessControl',
                    name: 'AccessControl',
                    component: () => import('./views/modules/HBAC/AccessControl/index.vue')
                }
            ]
        },
        /**
         * 客户端日志
         */
        {
            path: '/log',
            name: 'log',
            component: () => import('./views/modules/DomainLog/log'),
            children: [
                {
                    path: '/DomainManage/DomainLog',
                    name: 'DomainLog',
                    component: () => import('./views/modules/DomainLog/DomainLog/DomainLog')
                },
                {
                    path: '/DomainManage/clientUpgrade',
                    name: 'clientUpgrade',
                    component: () => import('./views/modules/DomainLog/clientUpgrade/index')
                },
                {
                    path: '/DomainManage/domainLogout',
                    name: 'domainLogout',
                    component: () => import('./views/modules/DomainLog/DomainLogout/index.vue')
                }

            ]
        },
        /**
         * 公共策略库
         */

        {
            path: '/DeploymentPlan',
            name: 'DeploymentPlan',
            component: () => import('./views/modules/DeploymentPlan/Index'),
            children: [
                {
                    path: '/DeploymentPlan/terminalMaintenance',
                    name: 'terminalMaintenance',
                    component: () => import('./views/modules/DeploymentPlan/TerminalMaintenance/Index')
                },
                {
                    path: '/DeploymentPlan/DeploymentPlan',
                    name: 'DeploymentPlan',
                    component: () => import('./views/modules/DeploymentPlan/DeploymentPlan/Index')
                },
                {
                    path: '/DeploymentPlan/ShellTempManage',
                    name: '/DeploymentPlan/',
                    component: () => import('./views/modules/DeploymentPlan/ShellTemp/ShellTempManage')
                },
                {
                    path: 'MessageNotice',
                    name: 'MessageNotice',
                    component: () => import('./views/modules/DeploymentPlan/MessageNotice/index.vue')
                }
            ]
        },

        /**
         * 系统监控
         */
        {
            path: '/Monitor',
            name: 'Monitor',
            component: () => import('./views/modules/Monitor/Index'),
            children: [
                {
                    path: '/Monitor/Domain/Index',
                    name: 'domain',
                    component: () => import('./views/modules/Monitor/Domain/Index')
                },
                {
                    path: '/Monitor/Server/Index',
                    name: 'server',
                    component: () => import('./views/modules/Monitor/Server/Index')
                }
            ]
        }

    ]
;
const routes = [
    {
        path: '/',
        name: 'Main',
        component: () => import('./views/main/Main'),
        children: childrenRouter
    }, {
        path: '/Login',
        name: 'Login',
        component: () => import('./views/modules/Login/Login')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
