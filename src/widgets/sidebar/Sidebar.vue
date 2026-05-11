<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { ref, watch } from "vue";

import SidebarFooter from "./components/SidebarFooter.vue";
import SidebarHeader from "./components/SidebarHeader.vue";
import SidebarNavItem from "./components/SidebarNavItem.vue";
import type { NavItem } from "./types/index";

import { useProfileStore } from "@/shared/stores/useProfileStore";

interface Props {
  navItems: NavItem[];
}

defineProps<Props>();

const isDesktop = useMediaQuery("(min-width: 1024px)");
const profileStore = useProfileStore();

const isOpen = ref(isDesktop.value);

const toggle = () => { isOpen.value = !isOpen.value; };

watch(isDesktop, (newValue) => {
  isOpen.value = newValue;
});
</script>

<template>
  <aside
    class="bg-sidebarOverlay border-2 border-transparent
      rounded-r-2xl transition-all duration-300 overflow-hidden"
    :class="isOpen ? 'w-64' : 'w-20'"
  >
    <div
      class="sidebar relative flex flex-col h-full rounded-r-2xl p-6"
    >
      <div class="flex justify-end pb-6 border-b border-borders">
        <SidebarHeader
          :is-open="isOpen"
          @toggle="toggle"
        />
      </div>
      <div
        class="flex flex-col items-center gap-2 pb-6 pt-6 border-b border-borders"
        :class="isOpen ? 'block' : 'hidden'"
      >
        <div
          class="w-12 h-12 rounded-full bg-btn-gradient flex
        items-center justify-center text-white font-bold"
        >
          {{ profileStore.profileData?.name?.split(' ')[0][0]
            + profileStore.profileData?.name?.split(' ')[1][0] }}
        </div>
        <p class="text-sm font-semibold text-base">
          {{ profileStore.profileData?.name }}
        </p>
        <p class="text-sm font-semibold text-primaryText">
          {{ profileStore.profileData?.role }}
        </p>
      </div>
      <nav class="flex-1 pt-6">
        <ul
          class="flex flex-col gap-3"
        >
          <SidebarNavItem
            v-for="item in navItems"
            :key="item.to"
            :item="item"
            :collapsed="!isOpen"
          />
        </ul>
      </nav>
      <div
        class="mt-auto py-2.5 transition-all duration-300"
        :class="isOpen ?'px-4' : 'px-0'"
      >
        <SidebarFooter
          :collapsed="!isOpen"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #111118 0%, #181824 100%);
}

.sidebar::before,
.sidebar::after {
  content: "";
  @apply absolute inset-0 pointer-events-none bg-no-repeat;
  background-size: 100% 100%;
}

.sidebar::before {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.015) 51.81%, rgba(0, 0, 0, 0) 68.99%),
    linear-gradient(180deg, rgba(0, 0, 0, 0) 85.25%, rgba(74, 118, 255, 0.0875) 100%);
}

.sidebar::after {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.025) 0%, rgba(0, 0, 0, 0) 6.88%),
    linear-gradient(180deg, rgba(0, 0, 0, 0) 86.96%, rgba(74, 118, 255, 0.0525) 100%);
}
</style>
