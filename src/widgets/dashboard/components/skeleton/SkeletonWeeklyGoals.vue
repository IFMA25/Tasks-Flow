<script setup lang="ts">
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
</script>

<template>
  <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <li
      v-for="n in 3"
      :key="n"
      class="task-item border-surface border bg-bgBase rounded-2xl p-4"
    >
      <div class="flex justify-end mb-2">
        <VSkeleton
          width="w-6"
          height="h-6"
          rounded="full"
        />
      </div>
      <VSkeleton
        width="w-3/4"
        height="h-5"
        class="mb-3"
      />
      <div class="flex items-center gap-4 mb-2">
        <VSkeleton
          width="w-24"
          height="h-4"
        />
        <VSkeleton
          width="w-28"
          height="h-4"
        />
      </div>
      <div class="flex gap-2">
        <VSkeleton
          width="w-16"
          height="h-6"
          rounded="full"
        />
        <VSkeleton
          width="w-14"
          height="h-6"
          rounded="full"
        />
        <VSkeleton
          width="w-20"
          height="h-6"
          rounded="full"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped>
.task-item {
  display: flex;
  flex-direction: column;
}
</style>
