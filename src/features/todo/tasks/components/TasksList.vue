<script setup lang="ts">
import TasksListToolbar from "./TasksListToolbar.vue";
import TasksTable from "./TasksTable.vue";
import { useTasksListFeature } from "../composable/useTasksListFeature";

import VCollapseContainer from "@/shared/ui/VCollapseContainer.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const baseHeads = [
  { key: "status",   label: "" },
  { key: "title",    label: "", columnStyles: 'w-[30%]' },
  { key: "priority", label: "" , columnStyles: 'w-[15%]'},
  { key: "dueDate",  label: "", columnStyles: 'w-[15%]' },
  { key: "tags",     label: "" },
  { key: "actions",  label: "" },
];

const hiddenUserListColumns = ['status', 'actions'];

const { listId } = defineProps<{ listId: string }>();
const emit = defineEmits(["action"]);

const route = useRoute();
const isUserList = route.query.tab === 'usersLists';

const heads = computed(() => {
  
  if (isUserList) {
    return baseHeads.filter(head => !hiddenUserListColumns.includes(head.key));
  }
  
  return baseHeads;
});

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
  <div class="relative flex flex-col gap-8 w-full h-full max-w-5xl mx-auto p-4">
    <TasksListToolbar
      v-if="pendingTasks.length || completedTasks.length"
      v-model:sort="activeSortKey"
      v-model:priority="activePriorityKey"
      :sort-options="sortOptions"
      :priority-options="priorityOptions"
    />
    <VCollapseContainer
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
    </VCollapseContainer>

    <VCollapseContainer
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
    </VCollapseContainer>
  </div>
</template>
