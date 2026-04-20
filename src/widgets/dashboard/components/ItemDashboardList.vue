<script setup lang="ts">
import { DashboardTask } from "../types";

import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import { colorsPriority } from "@/shared/variables/colorMap";

const { task, goals } = defineProps<{
  task: DashboardTask;
  goals?: boolean;
}>();

const emit = defineEmits<{
  statusChange: [task: DashboardTask, value: boolean];
}>();

const statusMap = {
  todo: "Pending",
  done: "Completed",
};
</script>

<template>
  <li
    class="task-item border-surface gap-y-2 items-center pt-2 pb-4"
    :class="goals
      ? 'task-item--goals border bgBase rounded-2xl p-4'
      : 'task-item--default border-t'"
  >
    <p class="[grid-area:title] leading-[1.3]">
      {{ task.title }}
    </p>

    <VCheckbox
      v-if="goals"
      variant="round"
      class="[grid-area:checkbox]"
      :model-value="task.status === 'done'"
      @update:model-value="(value: boolean) => emit('statusChange', task, value)"
    />
    <p
      v-else
      class="[grid-area:status] text-secondary text-xs leading-[1.1] justify-self-end capitalize"
    >
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
      class="[grid-area:tags] flex gap-2 flex-wrap"
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

<style scoped>
.task-item {
  display: grid;
  grid-template-columns: 1fr auto;
}

.task-item--goals {
  grid-template-areas:
    "_  checkbox"
    "title     title"
    "meta      meta"
    "tags      tags";
}

.task-item--default {
  grid-template-areas:
    "title  status"
    "meta   meta"
    "tags   tags";
}
</style>
