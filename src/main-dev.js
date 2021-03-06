import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './element/index'
import '@/assets/css/base.css'
import axios from 'axios'

/* 富文本编辑器 */
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)

/* 进度条 */
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://120.53.120.229:8888/api/private/v1/'/* 'https://www.liulongbin.top:8888/api/private/v1/'; */


Vue.filter('dateFormat', function (item) {
  let timer = new Date(item)
  let y = timer.getFullYear()
  let m = (timer.getMonth() + 1).toString().padStart(2, '0')
  let d = timer.getDate().toString().padStart(2,'0')
  let hh = timer.getHours().toString().padStart(2,'0')
  let mm = timer.getMinutes().toString().padStart(2,'0')
  let dd = timer.getSeconds().toString().padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${dd}`
})


axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

Vue.filter('dateFormat', function (timeVal) {
  let timer = new Date(timeVal)
  
  let y = timer.getFullYear()
  let m = String(timer.getMonth() + 1).padStart(2,'0')
  let d = String(timer.getDate()).padStart(2,'0')

  let hh = String(timer.getHours()).padStart(2,'0')
  let mm = String(timer.getMinutes()).padStart(2,'0')
  let ss =String( timer.getSeconds()).padStart(2,'0')
  
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
