import { tokenManager } from "@ametie/vue-muza-use";
import { RouteLocationNormalized } from "vue-router";

import { RouteNames } from "@/shared/types/routeNames";
import { useProfileStore } from "@/shared/stores/useProfileStore";

export const guards = async (to: RouteLocationNormalized) => {
  const token = !!tokenManager.getAccessToken();

  if (!token && to.meta.layout !== "auth") {
    return { name: "auth" };
  }

  if (token) {
    if (to.name === "auth") {
      return { name: "home" };
    }

    const profileStore = useProfileStore();

    if (!profileStore.profileData) {
      await profileStore.execute();
    }

    const routePermission = to.meta.permission;

    if (routePermission) {
      const isAllowed = profileStore.hasAccess(routePermission);

      if (!isAllowed) {
        console.warn(`[Guard] Access denied. Required: ${routePermission}`);
        return { name: RouteNames.notFound };
      }
    }
  }
};
