import http from "@/http";

function getDataDict(code) {
    return new Promise((resolve, reject) => {
        http.get('/dict/query', {
            params: {
                codeList: code
            }
        }).then((res) => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export default {
    getDataDict
}
