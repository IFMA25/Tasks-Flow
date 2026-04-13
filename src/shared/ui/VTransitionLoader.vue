<script setup lang="ts">
import VLoader from "./common/VLoader.vue";

defineProps<{
  isLoading: boolean
  variant?: "fullscreen" | "overlay"
  loaderType?: "spinner" | "dots"
}>();
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoading"
      :class="[
        'flex items-center justify-center backdrop-blur-md bg-base/75',
        variant === 'fullscreen' && 'fixed inset-0 z-[9999]',
        variant === 'overlay' && 'absolute inset-0 z-10 rounded-inherit',
      ]"
    >
      <VLoader
        size="h-[100px]"
        :type="loaderType"
      />
    </div>
  </Transition>
</template>
