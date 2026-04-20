import { clearAllCache, tokenManager } from "@ametie/vue-muza-use";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useProfileRequest } from "../composables/api/useProfileRequest";
import { User } from "../types";

import { RouteNames } from "@/shared/types/routeNames";


export const useProfileStore = defineStore("profile", () => {
  const profileData = ref<User | null>(null);
  const initialized = ref(false);
  const error = ref<unknown | null>(null);

  const router = useRouter();

  const { execute: fetchProfileRequest, loading, data } = useProfileRequest({
    onSuccess: () => {
      profileData.value = data.value;
      error.value = null;
      initialized.value = true;
    },
     onError: (apiError) => {
      error.value = apiError;
      initialized.value = true;
      handleLogout();
    },
  });

   const fetchProfile = async () => {
    if (initialized.value) return;
    await fetchProfileRequest();
  };

  const hasAccess = (routePermission: string) => {
    if (!profileData.value?.permissions) return false;
    return profileData.value.permissions.some(
      (p: string) => p?.toLowerCase() === routePermission?.toLowerCase());
  };

  const handleLogout = () => {
    profileData.value = null;
    initialized.value = false;
    error.value = null;

    tokenManager.clearTokens();
    router.push({ name: RouteNames.auth, query: { mode: "signin" } });
    clearAllCache();
  };

  return {
    profileData,
    loading,
    initialized,
    error,
    fetchProfile,
    handleLogout,
    hasAccess,
  };
});
