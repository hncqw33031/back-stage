import Vue from 'vue'
import md5 from 'js-md5'
import sha1 from 'js-sha1'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import cloneDeep from 'lodash/cloneDeep'
import {getTicketFromLocation} from '@/utils'

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.$md5 = md5 // md5
Vue.prototype.$sha1 = sha1 // sha1
Vue.prototype.$base64 = require('js-base64').Base64 // base64

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

const ticket = getTicketFromLocation()
if (window.SITE_CONFIG['ssoEnable'] && !ticket) {
  window.location.href = window.SITE_CONFIG['ssoCasUrl'] + '/login?service=' + window.SITE_CONFIG['ssoAppUrl']
} else {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
  })
}

