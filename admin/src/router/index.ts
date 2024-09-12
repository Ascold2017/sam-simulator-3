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
        },
        {
            path: '/missions/new',
            name: 'missionCreate',
            component: () => import('../views/MissionEditor/index.vue')
        },
        {
            path: '/missions/:id',
            name: 'missionEdit',
            component: () => import('../views/MissionEditor/index.vue')
        },
        {
            path: '/aas',
            name: 'aas',
            component: () => import('../views/AAs/index.vue')
        },
        {
            path: '/targets',
            name: 'targets',
            component: () => import('../views/Targets/index.vue')
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('../views/Users/index.vue')
        }

    ]
})