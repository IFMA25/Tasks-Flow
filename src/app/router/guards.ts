import { tokenManager } from "@ametie/vue-muza-use";
import { RouteLocationNormalized } from "vue-router";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import { RouteNames } from "@/shared/types/routeNames";

export const guards = async (
  to: RouteLocationNormalized,
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
  }

  if (hasToken) {
    const metaPermission = to.meta.permission;

    let hasAccessRoute = true;

    if (Array.isArray(metaPermission)) {
      hasAccessRoute = metaPermission.some((p) => profileStore.hasAccess(p));
    } else if (typeof metaPermission === "string") {
      hasAccessRoute = profileStore.hasAccess(metaPermission);
    }

    if (!hasAccessRoute) {
      console.warn("[Guard] Access denied.", metaPermission);
      return { name: RouteNames.notFound };
    }

    const requiredRole = to.meta.role;
    if (requiredRole && profileStore.profileData?.role !== requiredRole) {
      return { name: RouteNames.home };
    }
  }
};
