import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
// 导入图标
import './assets/font/iconfont.css'
// 全局样式表
import './assets/css/gobal.css'
// tree树状依赖
import TableTree from 'vue-table-with-tree-grid'
// 编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
import store from './store'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求token判定
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
// 控制台消息提示取消
Vue.config.productionTip = false
// 注册tableTree
Vue.component('TableTree', TableTree)
// 编辑器祖册
Vue.use(VueQuillEditor /* { default global options } */)

// 时间过滤
Vue.filter('dateFormat', function(orig) {
  const time = new Date(orig)
  // 年
  const y = (time.getFullYear() + '').padStart(2, '0')
  // 月
  const m = (time.getMonth() + 1 + '').padStart(2, '0')
  // 日
  const d = (time.getDate() + '').padStart(2, '0')
  // 时
  const hh = (time.getHours() + '').padStart(2, '0')
  // 分
  const mm = (time.getMinutes() + '').padStart(2, '0')
  // 秒
  const ss = (time.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
