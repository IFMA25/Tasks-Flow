<script setup lang="ts">
import { ref } from "vue";

import VButton from "@/shared/ui/common/VButton.vue";

defineProps<{
  title: string;
  count?: number;
}>();

const isOpen = ref(true);
</script>

<template>
  <div class="max-h-[20rem] overflow-y-auto border-2 border-default rounded-xl">
    <h3
      v-if="count"
      class="sticky top-0 left-0 flex items-center gap-2 cursor-pointer p-4 bg-bgBase z-10"
    >
      {{ title }}<span>({{ count }})</span>
      <VButton
        variant="cardTitle"
        icon="chevron-down"
        class="transition-transform duration-300 ease"
        :class="{ 'rotate-180': isOpen }"
        @click="isOpen = !isOpen"
      />
    </h3>
    <Transition
      enter-active-class="transition-all duration-300 ease overflow-hidden"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[600px]"
      leave-active-class="transition-all duration-300 ease overflow-hidden"
      leave-from-class="opacity-100 max-h-[600px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isOpen">
        <slot />
      </div>
    </Transition>
  </div>
</template>
