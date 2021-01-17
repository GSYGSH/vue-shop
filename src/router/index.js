import VueRouter from 'vue-router'
import Vue from 'vue'


const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: { path: '/login' } },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
    { path: '*', redirect: to => { return '/home' } }
]

const router = new VueRouter({
    routes
})

/* 查看token */
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next()
    } else {
        const token = sessionStorage.getItem('token')
        if (!token) {
            next('/login')
        } else {
            next()
        }
    }
})
export default router