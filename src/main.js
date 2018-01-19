import Vue from 'vue'
import App from './App'
import router from './router'
import ui from './components/index'
import YunserUI from 'yunser-ui-vue'

import 'yunser-ui-vue/dist/yunser-ui.css'
import './scss/main.scss'

Vue.use(YunserUI)
Vue.use(ui)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})
