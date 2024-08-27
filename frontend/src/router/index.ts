import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: () => import('../views/StartScreen/index.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainScreen/index.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorScreen/index.vue')
    }
  ]
})

export default router
