import NProgress from '@/../configs/nprogress/index'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: () => import('@/views/home/echarts/echarts.vue'),
    },
    {
      path: '/vue',
      name: 'vue',
      component: () => import('@/views/home/vue/vue.vue'),
      children: [
        {
          path: 'proxy',
          name: 'proxy',
          component: () => import('@/views/home/vue/proxy.vue'),
        },
      ],
    },
    {
      path: '/performance',
      name: 'performance',
      component: () => import('@/views/performance/index.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => NProgress.done())

export default router
