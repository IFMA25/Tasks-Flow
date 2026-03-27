<script setup lang="ts">
import { computed } from "vue";
import {
  useRoute,
  useRouter,
} from "vue-router";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import VToaster from "@/shared/ui/toaster/VToaster.vue";
import Header from "@/widgets/Header.vue";
import Sidebar from "@/widgets/sidebar/Sidebar.vue";

const profileStore = useProfileStore();
const router = useRouter();
const route = useRoute();

const navItems = computed(() => {
  return router.getRoutes()
    .filter(route => {
      const isVisibleInMenu = route.meta.showInMenu !== false;
      const hasPermission = route.meta.permission
        ? profileStore.hasAccess(route.meta.permission)
        : true;
      return isVisibleInMenu && hasPermission;
    })
    .map(route => ({
      icon: route.meta.iconMenu,
      text: route.meta.titleMenu,
      to: route.path,
    }));
});

const showHeader = computed(() => route.meta.showHeader !== false);
</script>

<template>
  <div class="flex w-full h-screen overflow-hidden">
    <Sidebar :nav-items="navItems" />
    <VToaster />
    <div class="flex flex-col flex-1 min-w-0 px-12 py-6">
      <Header
        v-if="showHeader"
        class="flex-shrink-0 mb-6"
      />
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
