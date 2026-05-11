<script setup lang="ts">
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
</script>

<template>
  <div
    class="relative rounded-xl border border-borders
    p-6 flex flex-col gap-4 bg-bgBase h-40"
  >
    <div class="flex gap-2 items-center">
      <VSkeleton
        width="w-36"
        height="h-5"
        rounded="md"
      />
    </div>
    <div class="flex flex-col gap-2 border-b border-default pb-2">
      <VSkeleton
        width="w-48"
        height="h-3"
        rounded="md"
      />
      <VSkeleton
        width="w-28"
        height="h-4"
        rounded="md"
      />
    </div>
    <VSkeleton
      width="w-full"
      height="h-10"
      rounded="md"
    />
  </div>
</template>
