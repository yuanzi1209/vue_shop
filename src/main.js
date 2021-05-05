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

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

/* // 导入 lodash (用于深拷贝)
import _ from 'lodash' */

// 导入 qyy-breadcrumb
import qyyBreadcrumb from '@/plugins/qyy-breadcrumb.vue'
Vue.component('qyy-breadcrumb', qyyBreadcrumb)

// 导入 qyy-pagination
import qyyPagination from '@/plugins/qyy-pagination.vue'
Vue.component('qyy-pagination', qyyPagination)

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

// 定义格式化时间的过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

import './assets/fonts/iconfont.css'
import './assets/css/global.css'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
