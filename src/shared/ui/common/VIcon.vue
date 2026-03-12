<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";

const props = withDefaults(defineProps<{
  type: string;
  size?: string;
}>(), {
  size: "w-5 h-5",
});

const icons = import.meta.glob("@/shared/assets/icons/*.svg");

const icon = computed(() => {
  const path = `/src/shared/assets/icons/${props.type}.svg`;

  if (!icons[path]) {
    console.warn(`Icon ${props.type} not found`);
    return null;
  }

  return defineAsyncComponent(icons[path] as () => Promise<any>);
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
