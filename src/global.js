import Tree from './views/modules/Public/method/Tree'
import Check from './views/modules/Public/method/Check'
import Util from './views/modules/Public/method/Util'
import Data from "@/views/modules/Public/method/Data";
import axios from 'axios'
/**
 * 版本号
 */
 let serverUrl = axios.create({
    timeout: 6000,
});

axios.get('/config.json').then(config => {
    serverUrl.defaults.baseURL = config.data.service_url
})


export default {
    Tree,
    Check,
    Util,
    Data,
    serverUrl
}
