<script setup lang="ts">
import { computed } from "vue";

import { useThemeStore } from "../store/useThemeStore";

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
    <div class="w-[20px] h-[20px] rounded-full bg-switchBg" />
  </VSwitch>
</template>
