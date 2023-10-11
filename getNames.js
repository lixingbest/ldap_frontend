const fs = require('fs')
const path = require('path')
const images = require('images')
let list = fs.readdirSync('/Users/lichao/LDAP/ldap_frontend/src/assets/desktop-image')
fs.writeFileSync('/Users/lichao/LDAP/ldap_frontend/src/assets/desktop-images-names.json', JSON.stringify(list))
// list.forEach(item => {
//     images(path.join('/Users/lichao/LDAP/ldap_frontend/src/assets/desktop-image/', item))
//         .save(path.join('/Users/lichao/LDAP/ldap_frontend/src/assets/desktop-image/', item), {quality: 50})
// })
