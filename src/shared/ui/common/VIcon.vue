<script setup lang="ts">
import type { Component } from "vue";
import {
  computed,
  defineAsyncComponent,
} from "vue";

const { type, size="w-5 h-5" } = defineProps<{
  type: string;
  size?: string;
}>();

const icons = import.meta.glob<{ default: Component }>("@/shared/assets/icons/*.svg");

const icon = computed(() => {
  const path = `/src/shared/assets/icons/${type}.svg`;

  if (!icons[path]) {
    console.warn(`Icon ${type} not found`);
    return null;
  }

  return defineAsyncComponent(icons[path]);
});
</script>

<template>
  <component
    :is="icon"
    v-if="icon"
    :class="['shrink-0', size]"
    aria-hidden="true"
  />
</template>
