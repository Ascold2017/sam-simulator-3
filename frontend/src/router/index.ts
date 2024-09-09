import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthScreen/index.vue')
    },
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
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileScreen/index.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestScreen/index.vue')
    },
    {
      path: '/heightmap',
      name: 'heightmap',
      component: () => import('../views/TestScreen/GenerationHeightmap.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorScreen/index.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && to.name !== 'auth') {
    next({ name: 'auth' })
    return
  }

  next();
});

export default router
