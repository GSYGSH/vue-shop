import VueRouter from 'vue-router'
import Vue from 'vue'


const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
const Welcome = () => import('@/components/Welcome.vue')
const Users = () => import('@/components/users/Users.vue')
const Rights = () => import('@/components/power/Rights.vue')
const Roles = () => import('@/components/power/Roles.vue')
const Cate = () => import('@/components/goods/Cate.vue')
const Goods = () => import('@/components/goods/Goods.vue')
const Add = () => import('@/components/goods/Add.vue')
const Edit = () => import('@/components/goods/Edit.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: { path: '/login' } },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        children: [
            { path: '', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
            { path: '/params', component: Params },
            { path: '/goods', component: Goods },
            { path: '/goods/add', component: Add },
            { path: '/goods/edit', component: Edit }

        ]
    },
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