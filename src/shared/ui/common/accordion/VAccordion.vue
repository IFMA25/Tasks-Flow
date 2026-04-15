<script setup lang="ts">
import { ref } from "vue";

const { multiple = false, defaultOpen = [] } = defineProps<{
  multiple?: boolean;
  defaultOpen?: string[];
}>();

const openItems = ref<string[]>(defaultOpen);

const isOpen = (id: string) => openItems.value.includes(id);

const toggle = (id: string) => {
  if (multiple) {
    openItems.value = isOpen(id)
      ? openItems.value.filter(i => i !== id)
      : [...openItems.value, id];
  } else {
    openItems.value = isOpen(id) ? [] : [id];
  }
};

</script>

<template>
  <div>
    <slot
      :toggle="toggle"
      :open-items="openItems"
    />
  </div>
</template>
