//表单验证
const checkName = (value) => value ? /^[a-zA-Z][a-zA-Z0-9_]+$/.test(value) : true
const checkPhone = (value) => value ? /(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}/.test(value) : true
const checkMobile = (value) => value ? /\d{3}-\d{8}|\d{4}-\d{7}/.test(value) : true
const checkPostal = (value) => value ? /^[0-9]{6}$/.test(value) : true
const checkIDCard = (value) => value ? /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value) : true
const checkUnCN = (value) => value ? /^[^\u4e00-\u9fa5]+$/.test(value) : true
const checkIP = (value) => value ? /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(value) : true
const checkDomainName = (value) => value ? /^.*(\.).*$/.test(value) : true
export default {
    checkMobile,
    checkPhone,
    checkName,
    checkPostal,
    checkIDCard, checkUnCN, checkIP,checkDomainName
}
