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

import axios from 'axios'
import store from './store'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求token判定
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios
// 控制台消息提示取消
Vue.config.productionTip = false
// 注册tableTree
Vue.component('TableTree', TableTree)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
