<script setup lang="ts">
import { DashboardTask } from "@/features/dashboard/types";


const { task } = defineProps<{
    task: DashboardTask
}>();

</script>

<template>
  <li class="pt-2 pb-4 border-b border-t border-default">
    <div class="flex justify-between items-center mb-2">
      <p class="leading-[1.3]">
        {{ task.title }}
      </p>
      <p class="text-secondary text-xs leading-[1.1]">
        {{ task.status }}
      </p>
    </div>
    <div class="flex items-center gap-4">
      <p class="text-secondary text-xs leading-[1.1] capitalize">
        {{ task.listId.title }}
      </p>
      <p class="text-secondary text-xs leading-[1.1]">
        <span class="capitalize">{{ task.priority }}</span> priority
      </p>
    </div>
    <ul class="flex gap-2">
      <li
        v-for="tag in task.tags"
        :key="tag"
        class="rounded-2xl bg-default text-secondary text-xs leading-[1.1] capitalize px-3 py-1.5"
      >
        {{ tag }}
      </li>
    </ul>
  </li>
</template>
