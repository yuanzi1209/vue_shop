import Vue from 'vue'
import App from './App.vue'

// 导入 router
import router from './router'

// 导入 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 导入 vue-table-with-tree-grid
import treeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', treeTable)

// 导入 qyy-breadcrumb
import qyyBreadcrumb from '@/plugins/qyy-breadcrumb.vue'
Vue.component('qyy-breadcrumb', qyyBreadcrumb)

/* // 导入 qyy-pagination
import qyyPpagination from '@/plugins/qyy-pagination.vue'
Vue.component('qyy-pagination', qyyPpagination) */

// 导入 axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios 请求拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

import './assets/fonts/iconfont.css'
import './assets/css/global.css'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
