function makeTree(a, icon) {
    if (icon == null || icon === '') {
        icon = true
    }
    let b = JSON.stringify(a)
    let data = JSON.parse(b)
    //let _this = this
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
        delete item.children;
        item.key = item.id
        item.label = item.name

        if (icon) {
            if (item.type == '0') {
                item.icon = 'fa fa-globe'
            } else if (item.type == '1') {
                item.icon = 'fa fa-sitemap'
            } else if (item.type == 'domain') {
                item.icon = 'fa fa-globe'
            } else if (item.type === 'strategy') {
                item.icon = 'pi pi-tag'
            } else if (item.type === 'folder') {
                item.icon = 'pi pi-folder'
            } else if (item.type == '2') {
                item.icon = 'pi pi-book'
            }
        } else {
            if (item.type == '0') {
                item.icon_s = 'fa fa-globe'
            } else if (item.type == '1') {
                item.icon_s = 'fa fa-sitemap'
            } else if (item.type == 'domain') {
                item.icon_s = 'fa fa-globe'
            } else if (item.type == '2') {
                item.icon_s = 'pi pi-book'
            }
        }
    });


    let map = {};
    data.forEach(function (item) {
        map[item.id] = item;
    });
    let val = [];
    data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        let parent = map[item.pid];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
            parent.children.sort((a, b) => {
                return parseInt(a.ordIdx) - parseInt(b.ordIdx)
            })
        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
        }
    });

    return val;

}
function searchTypeZero(treeData, ouId, res) {
    for (let x in treeData) {
        let curr = treeData[x];
        if (curr.id == ouId) {
            if (curr.type == 0) {
                res = curr.id.split('-')[0]
                break
            } else {
                return searchTypeZero(treeData, curr.pid, res)
            }
        }
    }
    return res
}
function searchDomainId(treeData, ouId, res) {
    for (let x in treeData) {
        let curr = treeData[x];
        if (curr.id.split('-')[0] == ouId) {
            if (curr.type == 0) {
                res = curr.id.split('-')[0]
                break
            } else {
                return searchDomainId(treeData, curr.pid.split('-')[0], res)
            }
        }
    }
    return res
}

function ouStatus(treeData, ouId, res) {

    for (let x in treeData) {
        let curr = treeData[x];
        if (curr.id == ouId) {
            if (curr.type == '0') {
                res = curr.upStatus
                break
            } else {
                return ouStatus(treeData, curr.pid, res)
            }
        }
    }
    return res
}


export default {
    makeTree,
    searchDomainId,
    ouStatus,
    searchTypeZero
}
