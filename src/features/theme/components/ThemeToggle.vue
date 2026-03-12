<script setup lang="ts">
import { computed } from "vue";

import { useThemeStore } from "../store/useThemeStore";

import VIcon from "@/shared/ui/common/VIcon.vue";
import VSwitch from "@/shared/ui/common/VSwitch.vue";

const themeStore = useThemeStore();

const themeValue = computed({
  get: () => themeStore.isDark,
  set: (value: boolean) => themeStore.setTheme(value ? "dark" : "light"),
});

</script>

<template>
  <VSwitch
    v-model="themeValue"
    class="theme-toggle"
    variant="themeSwitch"
  >
    <div class="h-full flex justify-between items-center text-themeSwitch px-2">
      <VIcon
        size="w-3.5 h-3.5"
        type="sun"
        class="drop-shadow-glow"
      />
      <VIcon
        size="w-3 h-3"
        type="moon"
        class="drop-shadow-glow"
      />
    </div>
    <template #thumb-icon>
      <div
        class="relative w-full h-full flex items-center
      justify-center text-white drop-shadow-glow-white"
      >
        <VIcon
          type="moon"
          size="w-3 h-3"
          class="absolute transition-all duration-300"
          :class="themeValue ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'"
        />
        <VIcon
          type="sun"
          size="w-3.5 h-3.5"
          class="absolute transition-all duration-300"
          :class="themeValue ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'"
        />
      </div>
    </template>
  </VSwitch>
</template>
