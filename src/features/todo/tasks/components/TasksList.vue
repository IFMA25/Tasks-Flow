<script setup lang="ts">
import TasksListToolbar from "./TasksListToolbar.vue";
import TasksTable from "./TasksTable.vue";
import { useTasksListFeature } from "../composable/useTasksListFeature";

import VCollapsContainer from "@/shared/ui/VCollapsContainer.vue";

const heads = [
  { key: "status",   label: "" },
  { key: "title",    label: "" },
  { key: "priority", label: "" },
  { key: "dueDate",  label: "" },
  { key: "tags",     label: "" },
  { key: "actions",  label: "" },
];

const { listId } = defineProps<{ listId: string }>();
const emit = defineEmits(["action"]);

const {
  pendingTasks,
  completedTasks,
  isLoading,
  rowActions,
  handleStatusChange,
  sortOptions,
  priorityOptions,
  activeSortKey,
  activePriorityKey,
} = useTasksListFeature(listId);
</script>

<template>
  <div class="relative flex flex-col gap-8 w-full max-w-5xl mx-auto p-4">
    <TasksListToolbar
      v-if="pendingTasks.length || completedTasks.length"
      v-model:sort="activeSortKey"
      v-model:priority="activePriorityKey"
      :sort-options="sortOptions"
      :priority-options="priorityOptions"
    />
    <VCollapsContainer
      :title="$t('tasks.pending')"
      :count="pendingTasks.length"
    >
      <TasksTable
        :rows="pendingTasks"
        :heads="heads"
        :loading="isLoading"
        :show-empty-state="!pendingTasks.length && !completedTasks.length"
        :show-actions="true"
        :row-actions="rowActions"
        @status-change="handleStatusChange"
        @action="(row, key) => emit('action', row, key)"
      />
    </VCollapsContainer>

    <VCollapsContainer
      v-if="completedTasks.length"
      :title="$t('tasks.completed')"
      :count="completedTasks.length"
    >
      <TasksTable
        :rows="completedTasks"
        :heads="heads"
        :show-empty-state="false"
        @status-change="handleStatusChange"
      />
    </VCollapsContainer>
  </div>
</template>
