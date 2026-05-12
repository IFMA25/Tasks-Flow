<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { calculatePosition } from "@/shared/utils/calculatePosition";

const emit = defineEmits<{ (e: "close"): void }>();

const dropdownEl = ref<HTMLElement | null>(null);
const dropdownWidth = ref(0);
const dropdownHeight = ref(0);

const { isOpen, rect } = defineProps<{
  isOpen: boolean;
  rect: DOMRect | null;
}>();

const positionStyle = computed(() => {
  if (!rect || !dropdownWidth.value || !dropdownHeight.value) return {};

  const { top, left } = calculatePosition({
    rect,
    dropdownWidth: dropdownWidth.value,
    dropdownHeight: dropdownHeight.value,
    margin: 8,
  });

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

watch(
  () => dropdownEl.value,
  (el) => {
    if (!el || !isOpen || !rect) return;

    requestAnimationFrame(() => {
      const box = el.getBoundingClientRect();
      dropdownWidth.value = box.width;
      dropdownHeight.value = box.height;
    });
  },
  { immediate: true },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="dropdown">
      <div
        v-if="isOpen && rect"
        ref="dropdownEl"
        class="fixed text-nowrap min-w-40 border border-default bg-bgCards
            shadow-dropdown rounded text-primary text-base
            translate-all duration-50 z-[1000]"
        :style="positionStyle"
        v-bind="$attrs"
        @click="emit('close')"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
