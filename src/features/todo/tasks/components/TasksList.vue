<script setup lang="ts">
import { computed, ref } from "vue";

import TaskListItem from "./TaskListItem.vue";
import { TaskData } from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";

import VTransitionLoader from "@/shared/ui/VTransitionLoader.vue";
import VButton from "@/shared/ui/common/VButton.vue";

const tasksStore = useTasksStore();
const { completeTask } = useTasksRequest();

const { tasks } = defineProps<{
  tasks: TaskData[];
}>();

const selectedTask = ref<TaskData | null>(null);
const isCompletedOpen = ref(true);

const emit = defineEmits(["action"]);

const pendingTasks = computed(() => tasks.filter(t => t.status === "todo"));
const completedTasks = computed(() => tasks.filter(t => t.status === "done"));

const { execute: completeTaskExecute,
  loading: completeTaskLoading }
  = completeTask(() => selectedTask.value?.id, {
    onSuccess: () => {
      tasksStore.fetchTasksForList(tasksStore.currentListId);
    },
  });

async function handleStatusChange(task: TaskData, value: boolean) {
  selectedTask.value = task;
  await completeTaskExecute({
    data: { completed: value },
  });
}

const isLoading = computed(() => completeTaskLoading.value || tasksStore.fetchTaskLoading);
</script>

<template>
  <div class="relative flex flex-col gap-8 w-full max-w-5xl mx-auto p-4">
    <VTransitionLoader :is-loading="isLoading" />
    <div v-if="pendingTasks.length">
      <h3>
        {{ $t('tasks.pending') }} ({{ pendingTasks.length }})
      </h3>
      <ul class="flex flex-col gap-2">
        <li
          v-for="task in pendingTasks"
          :key="task.id"
        >
          <TaskListItem
            :task="task"
            @action="(task, key) => emit('action', task, key)"
            @status-change="handleStatusChange"
          />
        </li>
      </ul>
    </div>
    <div v-if="completedTasks.length">
      <h2 class="flex items-center gap-2 cursor-pointer">
        {{ $t('tasks.completed') }} ({{ completedTasks.length }})
        <VButton
          variant="cardTitle"
          icon="chevron-down"
          class="transition-transform duration-300"
          :class="{ 'rotate-180': isCompletedOpen }"
          @click="isCompletedOpen = !isCompletedOpen"
        />
      </h2>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition-all duration-300 ease-in"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <ul
          v-if="isCompletedOpen"
          class="flex flex-col gap-2 px-4"
        >
          <li
            v-for="task in completedTasks"
            :key="task.id"
          >
            <TaskListItem
              :task="task"
              @status-change="handleStatusChange"
            />
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>
