import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";

import authRoutes from "./auth";
import { guards } from "./guards";

import { RouteNames } from "@/shared/types/routeNames";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: RouteNames.home,
    component: () => import("@/pages/Home/index.vue"),
    meta: {
      permission: "read:dashboard",
      showHeader: false,
      titleMenu: "home",
      iconMenu: "home",
    },
  },
  {
    path: "/lists",
    name: RouteNames.lists,
    component: () => import("@/pages/Lists/index.vue"),
    meta: {
      titleHeader: (route: RouteLocationNormalized) =>
        route.query.tab === "usersLists" ? "lists.titleOverview" : "lists.title",
      permission: "read:list",
      titleMenu: "lists",
      iconMenu: "lists",
    },
  },
  {
    path: "/lists/:id",
    name: RouteNames.tasks,
    component: () => import("@/pages/Tasks/index.vue"),
    meta: {
      permission: "read:list",
      showInMenu: false,
    },
  },
  {
    path: "/analytics",
    name: RouteNames.analytics,
    component: () => import("@/pages/Analytics/index.vue"),
    meta: {
      permission: "read:analytics",
      titleMenu: "analytics",
      iconMenu: "chart",
    },
  },
  {
    path: "/profile",
    name: RouteNames.profile,
    component: () => import("@/pages/Profile/index.vue"),
    meta: {
      titleMenu: "profile",
      iconMenu: "profile",
      showHeader: false,
    },
  },
  {
    path: "/users",
    name: RouteNames.users,
    component: () => import("@/pages/Users/index.vue"),
    meta: {
      role: "admin",
      permission: "read:users",
      showHeader: false,
      titleMenu: "admin panel",
      iconMenu: "tools",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: RouteNames.notFound,
    component: () => import("@/pages/NotFound/index.vue"),
    meta: {
      title: "404 - Page not found",
      showHeader: false,
      showInMenu: false,
    },
  },
  ...authRoutes,
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(guards);

export default router;
