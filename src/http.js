import axios from "axios";
import store from "@/vuex";


const http = axios.create({
    timeout: 60000 * 3,
})

axios.get('/config.json').then(config => {
    http.defaults.baseURL = config.data.service_url
})

let httpList = []

http.interceptors.request.use(function (req) {

    req.headers['path'] = window.location.hash.substring(1)


    /**
     * 将每一个请求都加入list
     * list中有数据就说明还有正在执行的请求
     */
    let httpItem = {
        url: req.url,
        time: new Date().getTime()
    }
    httpList.push(httpItem)
    store.commit('showLoading')
    /**
     * 加token
     */
    let token = JSON.parse(localStorage.getItem('token'))
    if (token && token.token && new Date().getTime() < token.expirTime) {
        req.headers['token'] = token.token
    } else {
        if (!req.url.includes('/domain/treeWithoutOu')) {
            localStorage.clear()
            location.hash = '#/login'
        }
    }

    return req;
})
const open_url = ['getLog', 'getImage']

function hasOpenUrl(str) {
    let res = false
    open_url.forEach(item => {
        if (str.includes(item)) {
            res = true
        }
    })
    return res
}

http.interceptors.response.use(function (response) {


        if (response.config.responseType === "blob") {
            store.commit('hideLoading')
            return response
        }

        if (response.config.baseURL === '') {
            store.commit('hideLoading')
            return response
        }

        /**
         * 移除接到的请求 或间隔超10秒的请求
         */
        let t = new Date().getTime()
        let list = []
        httpList.forEach((item) => {
            if (item.url !== response.config.url && t - item.time < 60000) {
                list.push(item)
            }
        })
        httpList = list

        /**
         * 短时间内所有请求都接受完关闭loading
         */
        if (httpList.length === 0) {
            store.commit('hideLoading')
        }

        if (response.status === 200 && response.data.success == true) {
            return response.data;
        } else {
            if (response.config.url.indexOf('admin/login') !== -1) {
                let message = {
                    summary: '登录失败', detail: response.data.message
                }
                window.toast(message)
            } else if (hasOpenUrl(response.config.url)) {
                return response.data;
            } else {
                if (response.data.code && (response.data.code === '387679' || response.data.code === '387678')) {
                    if (response.data.code === '387679') {
                        let message = {summary: '登录过期', detail: '登录已过期，请重新登录！'}
                        window.toast(message)
                    }
                    localStorage.clear()
                    location.hash = '#/login'
                } else {

                    // let message = {summary: '请求失败！', detail: response.data.message}
                    // window.toast(message)
                    return response.data
                }
            }
            return Promise.reject(response);
        }
    }
    ,

    function (error) {
        httpList = []
        store.commit('hideLoading')
        // let message = {summary: '系统错误，请稍后再试！', detail: error}
        // window.toast(message)
        return Promise.reject(error);
    }
);


export default http
