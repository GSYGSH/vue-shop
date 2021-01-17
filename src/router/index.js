import VueRouter from 'vue-router'
import Vue from 'vue'

const Home = ()=>import('@/components/Home.vue')

Vue.use(VueRouter)

const routes = [
    {path:'/home',component:Home}
]

const router = new VueRouter({
    routes
})

export default router