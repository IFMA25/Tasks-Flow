<script setup lang="ts">
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="n in 5"
      :key="n"
      class="grid gap-2 border-b border-default px-6 py-4"
      style="grid-template-columns: 2.5rem 30% 15% 15% 1fr 2.5rem"
    >
      <VSkeleton
        width="w-5"
        height="h-5"
        rounded="full"
      />
      <VSkeleton
        width="w-full"
        height="h-4"
        rounded="md"
      />
      <VSkeleton
        width="w-16"
        height="h-4"
        rounded="md"
      />
      <VSkeleton
        width="w-20"
        height="h-4"
        rounded="md"
      />
      <VSkeleton
        width="w-full"
        height="h-4"
        rounded="md"
      />
      <VSkeleton
        width="w-4"
        height="h-4"
        rounded="md"
      />
    </div>
  </div>
</template>
