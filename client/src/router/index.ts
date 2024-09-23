import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/Auth/index.vue')
    },
    {
      path: '/',
      name: 'start',
      component: () => import('../views/Rooms/index.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/Game/index.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile/index.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/Test/index.vue')
    }
  ]
})

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && to.name !== 'auth') {
    next({ name: 'auth' })
    return
  }

  next();
});

export default router
