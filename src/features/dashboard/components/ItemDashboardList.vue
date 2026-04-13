<script setup lang="ts">
import { DashboardTask } from "@/features/dashboard/types";
import { colorsPriority } from "@/shared/variables/colorMap";


const { task } = defineProps<{
    task: DashboardTask
}>();

const statusMap = {
  todo: "Pending",
  done: "Completed",
};

</script>

<template>
  <li
    class="grid pt-2 pb-4 border-t border-default gap-y-2 items-center
           [grid-template-areas:'title_status'_'meta_meta'_'tags_tags']
           [grid-template-columns:1fr_auto]
           "
  >
    <p class="[grid-area:title] leading-[1.3]">
      {{ task.title }}
    </p>

    <p class="[grid-area:status] text-secondary text-xs leading-[1.1] justify-self-end capitalize">
      {{ statusMap[task.status] }}
    </p>

    <div class="[grid-area:meta] flex items-center gap-4 text-xs leading-[1.3]">
      <p class="capitalize text-secondary">
        {{ task.listId.title }}
      </p>
      <p
        class="flex items-center gap-1 before:content-[''] before:block before:w-1 before:h-1"
        :class="colorsPriority[task.priority]"
      >
        <span class="capitalize">{{ task.priority }}</span> priority
      </p>
    </div>

    <ul
      v-if="task.tags.length"
      class="[grid-area:tags] flex gap-2"
    >
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
