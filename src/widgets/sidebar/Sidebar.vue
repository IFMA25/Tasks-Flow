<script setup lang="ts">
import { ref } from "vue";

import SidebarFooter from "./components/SidebarFooter.vue";
import SidebarHeader from "./components/SidebarHeader.vue";
import SidebarNavItem from "./components/SidebarNavItem.vue";
import type { NavItem } from "./types/index";

interface Props {
  navItems: NavItem[];
}

defineProps<Props>();

const isOpen = ref(true);

const toggle = () => { isOpen.value = !isOpen.value; };
</script>

<template>
  <aside
    class="bg-sidebarOverlay border-2 border-transparent rounded-r-2xl transition-all duration-300 overflow-hidden"
    :class="isOpen ? 'w-64' : 'w-20'"
  >
    <div
      class="sidebar relative flex flex-col h-full border-2
    border-transparent rounded-r-2xl p-6"
    >
      <div class="flex justify-end mb-6">
        <SidebarHeader
          :is-open="isOpen"
          @toggle="toggle"
        />
      </div>
      <nav class="flex-1">
        <ul
          class="flex flex-col gap-4"
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
  background: linear-gradient(180deg, rgb(16, 22, 45) 0%, rgb(32, 43, 65) 100%);
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
