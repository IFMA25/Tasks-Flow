<script setup lang="ts">
import VLoader from "./common/VLoader.vue";

const { isLoading } = defineProps<{
  isLoading: boolean;
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
      class="absolute inset-0 z-20 backdrop-blur-sm"
    >
      <div class="absolute top-[10rem] left-1/2 -translate-x-1/2">
        <VLoader
          color="primaryDark"
          size="h-[100px]"
        />
      </div>
    </div>
  </Transition>
</template>
