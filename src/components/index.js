import page from './page'
import menu from './menu'
import colorPicker from './color-picker/dialog.vue'

export default {
    install: function (Vue) {
        Vue.component('my-page', page)
        Vue.component('my-menu', menu)
        Vue.component('color-picker', colorPicker)
    }
}
