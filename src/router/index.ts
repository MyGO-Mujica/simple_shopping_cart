import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/products'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('../views/Products.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/Cart.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../views/Orders.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫：检查是否需要身份验证
router.beforeEach((to, from, next) => {
  const userId = localStorage.getItem('token') // 实际存储的是userId
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !userId) {
    // 需要登录但未登录，跳转到登录页
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && userId) {
    // 已登录用户访问登录/注册页，跳转到商品页
    next('/products')
  } else {
    next()
  }
})

export default router
