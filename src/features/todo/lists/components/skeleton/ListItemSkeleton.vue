<script setup lang="ts">
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
</script>

<template>
  <div
    class="relative h-[8.4rem] rounded-xl border
    border-surface shadow p-6 flex flex-col gap-4 bg-bgCards"
  >
    <div class="flex gap-2 items-center">
      <VSkeleton
        width="w-2.5"
        height="h-2.5"
        rounded="full"
      />
      <VSkeleton
        width="w-40"
        height="h-6"
        rounded="md"
      />
    </div>
    <div class="flex gap-4">
      <VSkeleton
        width="w-24"
        height="h-5"
        rounded="md"
      />
      <VSkeleton
        width="w-20"
        height="h-5"
        rounded="md"
      />
    </div>
  </div>
</template>
