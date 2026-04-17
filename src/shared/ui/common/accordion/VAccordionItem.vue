<script setup lang="ts">
import { computed } from "vue";

import VIcon from "../VIcon.vue";

const {
  id,
  openItems,
  toggle,
  icon = "chevron-down",
  iconSize = "w-4 h-4",
  title,
  disabled = false,
} = defineProps<{
  id: string
  openItems: string[]
  toggle: (id: string) => void
  icon?: string
  iconSize?: string
  title: string
  disabled?: boolean
}>();

const isOpen = computed(() =>
  openItems.includes(id),
);

const onToggle = () => {
  if (!disabled) {
    toggle(id);
  }
};

const onEnter = (el: Element) => {
  if(el instanceof HTMLElement){
    el.style.height = "0";
    el.offsetHeight;
    el.style.height = el.scrollHeight + "px";
  }

};

const onAfterEnter = (el: Element) => {
  if(el instanceof HTMLElement){
    el.style.height = "auto";
  }
};

const onLeave = (el: Element) => {
  if(el instanceof HTMLElement){
    el.style.height = el.scrollHeight + "px";
    void el.offsetHeight;
    el.style.height = "0";
  }
};
</script>

<template>
  <div
    role="listitem"
    class="border-b border-default last:border-b-0"
    :class="{ 'cursor-not-allowed opacity-60': disabled }"
  >
    <button
      type="button"
      class="flex w-full items-center justify-between px-4 py-3
      cursor-pointer transition-all duration-300
      hover:text-primaryBg"
      :aria-expanded="isOpen"
      :aria-controls="`accordion-content-${id}`"
      :disabled="disabled"
      @click="onToggle"
    >
      <div class="flex items-center gap-2 font-semibold">
        <VIcon
          :type="icon"
          :size="iconSize"
          class="transition-transform duration-300"
          :class="isOpen ? 'rotate-[270deg]' : 'rotate-0'"
          aria-hidden="true"
        />
        <span class="font-medium text-sm">{{ title }}</span>
      </div>
    </button>

    <Transition
      name="accordion"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div
        v-show="isOpen"
        :id="`accordion-content-${id}`"
        role="region"
        class="accordion-content"
      >
        <div class="px-4 pb-4 pt-1 text-sm text-gray-700">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.accordion-content {
  overflow: hidden;
  transition: height 0.3s ease;
}
</style>
