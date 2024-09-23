import { createRouter, createWebHistory } from "vue-router";
export const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home/index.vue"),
    },
    {
      path: "/missions",
      children: [
        {
          path: "",
          name: "missions",
          component: () => import("../views/Missions/index.vue"),
        },
        {
          path: "new",
          name: "missionCreate",
          component: () => import("../views/MissionEditor/index.vue"),
        },
        {
          path: ":id",
          name: "missionEdit",
          component: () => import("../views/MissionEditor/index.vue"),
        },
      ],
    },
    {
      path: "/maps",
      children: [
        {
          path: "",
          name: "maps",
          component: () => import("../views/Maps/index.vue"),
        },
        {
          path: ":id",
          name: "mapEdit",
          component: () => import("../views/MapEditor/index.vue"),
        },
        {
          path: "new",
          name: "mapCreate",
          component: () => import("../views/MapEditor/index.vue"),
        }
      ]
    },
    {
      path: "/targets",
      name: "targets",
      component: () => import("../views/Targets/index.vue"),
    },

    {
      path: "/aas",
      name: "aas",
      component: () => import("../views/AAs/index.vue"),
    },

    {
      path: "/users",
      name: "users",
      component: () => import("../views/Users/index.vue"),
    },
  ],
});
