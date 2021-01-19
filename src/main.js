import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './element/index'
import '@/assets/css/base.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://120.53.120.229:8888/api/private/v1/'/* 'https://www.liulongbin.top:8888/api/private/v1/' */;

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
