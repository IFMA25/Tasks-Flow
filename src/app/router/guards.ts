import { tokenManager } from "@ametie/vue-muza-use";
import { RouteLocationNormalized } from "vue-router";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import { RouteNames } from "@/shared/types/routeNames";

export const guards = async (
  to: RouteLocationNormalized,
  // from: RouteLocationNormalized,
) => {
  const hasToken = !!tokenManager.getAccessToken();
  const profileStore = useProfileStore();

  const isAuthRoute = to.name === RouteNames.auth;

  if (!hasToken && !isAuthRoute) {
    return { name: RouteNames.auth, query: { mode: "signin" } };
  }

  if (hasToken && isAuthRoute) {
    return { name: RouteNames.home };
  }

  if (hasToken && !profileStore.initialized) {
    await profileStore.fetchProfile();

    if (!tokenManager.getAccessToken()) {
      return { name: RouteNames.auth, query: { mode: "signin" } };
    }

    const routePermission = to.meta.permission;
    if (routePermission && !profileStore.hasAccess(routePermission)) {
      console.warn(`[Guard] Access denied. Required: ${routePermission}`);
      return { name: RouteNames.notFound };
    }

    const requiredRole = to.meta.role;
    if (requiredRole && profileStore.profileData?.role !== requiredRole) {
      return { name: RouteNames.home };
    }
  }
};
