import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './element/index'
import '@/assets/css/base.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = /* 'http://120.53.120.229:8888/api/private/v1/' */'https://www.liulongbin.top:8888/api/private/v1/';

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
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
