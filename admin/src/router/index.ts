import { createRouter, createWebHistory } from 'vue-router'
export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Home/index.vue')
        },
        {
            path: '/missions',
            name: 'missions',
            component: () => import('../views/Missions/index.vue')
        }
    ]
})