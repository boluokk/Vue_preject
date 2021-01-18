import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/login.vue'
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// import Home from '../components/home.vue'
const Home = () =>
  import(/* webpackChunkName: "glogin_home_welcome" */ '../components/home.vue')
// import Welcome from '../components/welcome.vue'
const Welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue'
  )

// import Users from '../components/user/user.vue'
const Users = () =>
  import(
    /* webpackChunkName: "user_rights_roles" */ '../components/user/user.vue'
  )
// import Rights from '../components/power/rights.vue'
const Rights = () =>
  import(
    /* webpackChunkName: "user_rights_roles" */ '../components/power/rights.vue'
  )
// import Roles from '../components/power/roles.vue'
const Roles = () =>
  import(
    /* webpackChunkName: "user_rights_roles" */ '../components/power/roles.vue'
  )

// import Cate from '../components/goods/cate.vue'
const Cate = () =>
  import(
    /* webpackChunkName: "cate_params_goods_addgoods" */ '../components/goods/cate.vue'
  )
// import Params from '../components/goods/params.vue'
const Params = () =>
  import(
    /* webpackChunkName: "cate_params_goods_addgoods" */ '../components/goods/params.vue'
  )
// import Googds from '../components/goods/goods.vue'
const Googds = () =>
  import(
    /* webpackChunkName: "cate_params_goods_addgoods" */ '../components/goods/goods.vue'
  )
// import AddGoods from '../components/goods/addGoods.vue'
const AddGoods = () =>
  import(
    /* webpackChunkName: "cate_params_goods_addgoods" */ '../components/goods/addGoods.vue'
  )

// import Order from '../components/goods/order.vue'
const Order = () =>
  import(/* webpackChunkName: "order_report" */ '../components/goods/order.vue')
// import Report from '../components/report/report.vue'
const Report = () =>
  import(
    /* webpackChunkName: "order_report" */ '../components/report/report.vue'
  )

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: Googds },
        { path: '/goods/addGoods', component: AddGoods },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
