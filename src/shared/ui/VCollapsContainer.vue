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
  <div>
    <h3
      v-if="count"
      class="flex items-center gap-2 cursor-pointer mb-2"
    >
      {{ title }}<span>({{ count }})</span>
      <VButton
        variant="cardTitle"
        icon="chevron-down"
        class="transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        @click="isOpen = !isOpen"
      />
    </h3>
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-all duration-300 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isOpen">
        <slot />
      </div>
    </Transition>
  </div>
</template>
