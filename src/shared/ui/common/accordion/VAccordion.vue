<script setup lang="ts">
import { computed } from "vue";

const { multiple = false, open = [] } = defineProps<{
  multiple?: boolean;
  open?: string[];
}>();

const emit = defineEmits<{
  "update:open": [value: string[]];
}>();

const openItems = computed({
  get: () => open ?? [],
  set: (value: string[]) => emit("update:open", value),
});

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
  <slot
    :toggle="toggle"
    :open-items="openItems"
  />
</template>
