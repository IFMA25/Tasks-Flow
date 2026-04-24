import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
} from "vue-router";

import authRoutes from "./auth";
import { guards } from "./guards";

import { RouteNames } from "@/shared/types/routeNames";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: RouteNames.home,
    component: () => import("@/pages/Dashboard.vue"),
    meta: {
      permission: "read:dashboard",
      titleMenu: "dashboard",
      titleHeader: ({ userName }) => ({
        translateKey: "dashboard.title",
        paramsStore: { userName: userName ?? "" },
      }),
      iconMenu: "home",
    },
  },
  {
    path: "/lists",
    name: RouteNames.lists,
    component: () => import("@/pages/Lists.vue"),
    meta: {
      titleHeader: ({ route }) => ({
        translateKey:
          route.query.tab === "usersLists"
            ? "lists.titleOverview"
            : "lists.title",
      }),
      permission: "read:list",
      titleMenu: "lists",
      iconMenu: "lists",
    },
  },
  {
    path: "/lists/:listId",
    name: RouteNames.tasks,
    component: () => import("@/pages/Tasks.vue"),
    meta: {
      permission: "read:list",
      showInMenu: false,
    },
  },
  {
    path: "/analytics",
    name: RouteNames.analytics,
    component: () => import("@/pages/Analytics.vue"),
    meta: {
      permission: "read:analytics",
      titleMenu: "analytics",
      iconMenu: "chart",
    },
  },
  {
    path: "/profile",
    name: RouteNames.profile,
    component: () => import("@/pages/Profile.vue"),
    meta: {
      titleMenu: "profile",
      iconMenu: "profile",
      showHeader: false,
    },
  },
  {
    path: "/users",
    name: RouteNames.users,
    component: () => import("@/pages/Users.vue"),
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
    component: () => import("@/pages/NotFound.vue"),
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
