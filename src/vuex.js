import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            menu_closed: false,
            show_loading: false,
            device_flag: false,
            device_save_flag: false,

        }
    },
    mutations: {

        setMenuClosed(state) {
            state.menu_closed = !state.menu_closed;
        },
        showLoading(state) {
            state.show_loading = true;
        },
        hideLoading(state) {
            state.show_loading = false
        },
        changeDeviceFlag(state) {
            state.device_flag = !state.device_flag
        },
        changeDeviceSaveFlag(state) {
            state.device_save_flag = !state.device_save_flag
        },
    }
})

export default store
