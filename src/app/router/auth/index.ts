import { RouteRecordRaw } from "vue-router";

import { RouteNames } from "@/shared/types/routeNames";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: RouteNames.auth,
    component: () => import("@/pages/Auth.vue"),
    meta: {
      title: "Authentication",
      layout: "auth",
      showInMenu: false,
    },
  },
];

export default authRoutes;
