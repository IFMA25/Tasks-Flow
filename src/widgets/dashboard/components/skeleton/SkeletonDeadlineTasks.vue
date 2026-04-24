<script setup lang="ts">
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
</script>

<template>
  <ul class="space-y-3">
    <li
      v-for="n in 3"
      :key="n"
      class="task-item border-surface border-t pt-2 pb-4"
    >
      <VSkeleton
        width="w-3/4"
        height="h-5"
        class="mb-2"
      />
      <VSkeleton
        width="w-32"
        height="h-4"
        class="mb-2"
      />
      <VSkeleton
        width="w-48"
        height="h-4"
      />
    </li>
  </ul>
</template>
