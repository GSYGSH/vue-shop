import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './element/index'
import '@/assets/css/base.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://120.53.120.229:8888/api/private/v1/'/* 'https://www.liulongbin.top:8888/api/private/v1/' */;


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
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
