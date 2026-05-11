<script setup lang="ts">
import { ref } from "vue";

import VSkeleton from "./common/VSkeleton.vue";

import VButton from "@/shared/ui/common/VButton.vue";

defineProps<{
  title: string;
  count?: number;
  loading?: boolean;
}>();

const isOpen = ref(true);
</script>

<template>
  <div class="overflow-y-auto border-2 border-borders rounded-xl">
    <h3
      v-if="count || loading"
      class="sticky top-0 left-0 flex items-center gap-2 cursor-pointer p-4 bg-bgCards z-10"
    >
      <template v-if="loading">
        <VSkeleton
          width="w-24"
          height="h-5"
          rounded="md"
        />
        <VSkeleton
          width="w-8"
          height="h-5"
          rounded="md"
        />
      </template>
      <template v-else>
        {{ title }}<span>({{ count }})</span>
        <VButton
          variant="cardTitle"
          icon="chevron-down"
          class="transition-transform duration-300 ease"
          :class="{ 'rotate-180': isOpen }"
          @click="isOpen = !isOpen"
        />
      </template>
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
