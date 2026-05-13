<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { ref, watch } from "vue";

import SidebarFooter from "./components/SidebarFooter.vue";
import SidebarHeader from "./components/SidebarHeader.vue";
import SidebarNavItem from "./components/SidebarNavItem.vue";
import type { NavItem } from "./types/index";


interface Props {
  navItems: NavItem[];
}

defineProps<Props>();

const isDesktop = useMediaQuery("(min-width: 1024px)");

const isOpen = ref(isDesktop.value);

const toggle = () => { isOpen.value = !isOpen.value; };

watch(isDesktop, (newValue) => {
  isOpen.value = newValue;
});
</script>

<template>
  <aside
    class="sidebar bg-sidebarBg relative flex flex-col
      h-full rounded-r-2xl p-6 border-r border-borders"
    :class="isOpen ? 'w-64' : 'w-20'"
  >
    <div class="flex justify-end pb-6 border-b border-borders">
      <SidebarHeader
        :is-open="isOpen"
        @toggle="toggle"
      />
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
  </aside>
</template>

<style scoped>
.sidebar::before{
  content: "";
  @apply absolute inset-0 pointer-events-none bg-no-repeat;
  background-size: 100% 100%;
}

.sidebar::before {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.015) 51.81%, rgba(0, 0, 0, 0) 68.99%),
    linear-gradient(180deg, rgba(0, 0, 0, 0) 85.25%, rgba(74, 118, 255, 0.0875) 100%);
}
</style>
