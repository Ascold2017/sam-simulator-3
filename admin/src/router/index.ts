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
            children: [
                {
                    path: '',
                    name: 'missions',
                    component: () => import('../views/Missions/index.vue')
                },
                {
                    path: 'new',
                    name: 'missionCreate',
                    component: () => import('../views/MissionEditor/index.vue')
                },
                {
                    path: ':id',
                    name: 'missionEdit',
                    component: () => import('../views/MissionEditor/index.vue')
                },
            ]
        },
        {
            path: '/targets',
            children: [
                {
                    path: '',
                    name: 'targets',
                    component: () => import('../views/Targets/index.vue')
                },
                {
                    path: 'new',
                    name: 'targetCreate',
                    component: () => import('../views/TargetEdit/index.vue')
                },
                {
                    path: ':id',
                    name: 'targetEdit',
                    component: () => import('../views/TargetEdit/index.vue')
                },
            ]
        },
        
        {
            path: '/aas',
            name: 'aas',
            component: () => import('../views/AAs/index.vue')
        },
        
        {
            path: '/users',
            name: 'users',
            component: () => import('../views/Users/index.vue')
        }

    ]
})