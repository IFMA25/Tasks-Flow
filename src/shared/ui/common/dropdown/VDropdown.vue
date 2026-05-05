<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from "vue";

import VDropdownContent from "./VDropdownContent.vue";

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const rect = ref<DOMRect | null>(null);

const close = () => { isOpen.value = false; };

const updatePosition = () => {
  if (!dropdownRef.value) return;
  rect.value = dropdownRef.value.getBoundingClientRect();
};

const toggle = () => {
  if (!isOpen.value) {
    updatePosition();
    isOpen.value = true;
  } else {
    isOpen.value = false;
  }
};

const handleOutsideInteraction = (event: Event) => {
  if (!isOpen.value) return;
  if (
    dropdownRef.value &&
    event.target instanceof Node &&
    !dropdownRef.value.contains(event.target)
  ) {
    close();
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isOpen.value) close();
};

const handleWindowResize = () => {
  if (!isOpen.value) return;
  updatePosition();
};

const handleWindowScroll = () => {
  if (!isOpen.value) return;
  close();
};

const hasRect = computed(() => !!rect.value);

watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener("click", handleOutsideInteraction);
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("scroll", handleWindowScroll, true);
  } else {
    document.removeEventListener("click", handleOutsideInteraction);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", handleWindowResize);
    window.removeEventListener("scroll", handleWindowScroll, true);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideInteraction);
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", handleWindowResize);
  window.removeEventListener("scroll", handleWindowScroll, true);
});
</script>

<template>
  <div
    ref="dropdownRef"
    class="inline-block"
  >
    <slot
      name="trigger"
      :toggle="toggle"
      :is-open="isOpen"
    />

    <VDropdownContent
      v-if="hasRect"
      :is-open="isOpen"
      :rect="rect"
      v-bind="$attrs"
      @close="close"
    >
      <slot />
    </VDropdownContent>
  </div>
</template>
