<script setup lang="ts">
import { tokenManager } from "@ametie/vue-muza-use";
import { computed } from "vue";
import { useRoute } from "vue-router";

import AuthLayout from "@/app/layouts/AuthLayout.vue";
import DefaultLayout from "@/app/layouts/DefaultLayout.vue";
import { useThemeStore } from "@/features/theme/store/useThemeStore";
import "vue-sonner/style.css";
import { useLanguageStore } from "@/features/translation/store/useLanguageStore";
import { useProfileStore } from "@/shared/stores/useProfileStore";
import VTransitionLoader from "@/shared/ui/VTransitionLoader.vue";

const profileStore = useProfileStore();
const themeStore = useThemeStore();
const languageStore = useLanguageStore();
const route = useRoute();

themeStore.initTheme();
languageStore.initLanguage();

const layouts = {
  auth: AuthLayout,
  default: DefaultLayout,
};

const routeLayout = computed(() => {
  const metaLayout = route.meta.layout;
  if(typeof metaLayout === "string"){
    return layouts[metaLayout];
  }
  return layouts.default;
});

const isAppLoading = computed(() => {
  const hasToken = !!tokenManager.getAccessToken();
  return hasToken && (!profileStore.profileData || profileStore.loading);
});
</script>

<template>
  <div class="bg-bgBase text-primary h-screen">
    <VTransitionLoader
      v-if="isAppLoading"
      :is-loading="isAppLoading"
      variant="fullscreen"
      loader-type="dots"
    />
    <component
      :is="routeLayout"
      v-else
    />
  </div>
</template>
