<script setup lang="ts">
import { computed } from "vue";

import TaskListItem from "./TaskListItem.vue";
import { TaskData } from "../../types";


const { tasks } = defineProps<{
  tasks: TaskData[];
}>();

const pendingTasks = computed(() => tasks.filter(t => t.status !== "completed"));
const completedTasks = computed(() => tasks.filter(t => t.status === "completed"));
</script>

<template>
  <div class="flex flex-col gap-8 w-full max-w-5xl mx-auto p-4">
    <div v-if="pendingTasks.length">
      <h2 class="text-sm font-medium text-gray-500 mb-4">
        Pending ({{ pendingTasks.length }})
      </h2>

      <ul class="flex flex-col border-t border-gray-100">
        <li
          v-for="task in pendingTasks"
          :key="task.id"
        >
          <TaskListItem :task="task" />
        </li>
      </ul>
    </div>

    <div v-if="completedTasks.length">
      <h2 class="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2 cursor-pointer">
        Completed ({{ completedTasks.length }})
      </h2>

      <ul class="flex flex-col border-t border-gray-100">
        <li
          v-for="task in completedTasks"
          :key="task.id"
        >
          <TaskListItem :task="task" />
        </li>
      </ul>
    </div>
  </div>
</template>
