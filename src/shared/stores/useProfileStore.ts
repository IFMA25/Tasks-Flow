import { tokenManager } from "@ametie/vue-muza-use";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useProfileRequest } from "../composables/api/useProfileRequest";
import { User } from "../types";

import { RouteNames } from "@/shared/types/routeNames";


export const useProfileStore = defineStore("profile", () => {
  const profileData = ref<User | null>(null);

  const router = useRouter();

  const { execute: fetchProfile, loading, data } = useProfileRequest({
    onSuccess: () => {
      profileData.value = data.value;
    },
  });

  const hasAccess = (routePermission: string) => {
    if (!profileData.value?.permissions) return false;
    return profileData.value.permissions.some(
      (p: string) => p?.toLowerCase() === routePermission?.toLowerCase());
  };

  const handleLogout = () => {
    profileData.value = null;
    tokenManager.clearTokens();
    router.push({ name: RouteNames.auth, query: { mode: "signin" } });
  };

  return {
    profileData,
    loading,
    fetchProfile,
    handleLogout,
    hasAccess,
  };
});
