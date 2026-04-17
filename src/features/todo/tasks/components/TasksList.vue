<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import TasksListToolbar from "./TasksListToolbar.vue";
import TasksTable from "./TasksTable.vue";
import { useTasksListFeature } from "../composable/useTasksListFeature";

import VCollapseContainer from "@/shared/ui/VCollapseContainer.vue";
import { useTasksStore } from "../store/useTasksStore";

const baseHeads = [
  { key: "status",   label: "" },
  { key: "title",    label: "", columnStyles: "w-[30%]" },
  { key: "priority", label: "" , columnStyles: "w-[15%]" },
  { key: "deadline",  label: "", columnStyles: "w-[15%]" },
  { key: "tags",     label: "" },
  { key: "actions",  label: "" },
];

const hiddenUserListColumns = ["status", "actions"];

const { listId } = defineProps<{ listId: string }>();
const emit = defineEmits(["action"]);

const route = useRoute();
const {
  isLoading,
  rowActions,
  handleStatusChange,
  sortOptions,
  priorityOptions,
  activeSortKey,
  activePriorityKey,
} = useTasksListFeature(listId);

const tasksStore = useTasksStore();

const isUserList = route.query.tab === "usersLists";

const heads = computed(() => {

  if (isUserList) {
    return baseHeads.filter(head => !hiddenUserListColumns.includes(head.key));
  }

  return baseHeads;
});


</script>

<template>
  <div class="relative flex flex-col gap-8 w-full h-full max-w-5xl mx-auto p-4">
    <TasksListToolbar
      v-if="tasksStore.pendingTasks.length || tasksStore.completedTasks.length || isLoading"
      v-model:sort="activeSortKey"
      v-model:priority="activePriorityKey"
      :sort-options="sortOptions"
      :priority-options="priorityOptions"
    />
    <VCollapseContainer
      :title="$t('tasks.pending')"
      :count="tasksStore.pendingTasks.length"
      :loading="isLoading"
    >
      <TasksTable
        :rows="tasksStore.pendingTasks"
        :heads="heads"
        :loading="isLoading"
        :show-empty-state="!tasksStore.pendingTasks.length && !tasksStore.completedTasks.length && !isLoading"
        :show-actions="true"
        :row-actions="rowActions"
        @status-change="handleStatusChange"
        @action="(row, key) => emit('action', row, key)"
      />
    </VCollapseContainer>

    <VCollapseContainer
      v-if="tasksStore.completedTasks.length || isLoading"
      :title="$t('tasks.completed')"
      :count="tasksStore.completedTasks.length"
      :loading="isLoading"
    >
      <TasksTable
        :rows="tasksStore.completedTasks"
        :heads="heads"
        :loading="isLoading"
        :show-empty-state="false"
        @status-change="handleStatusChange"
      />
    </VCollapseContainer>
  </div>
</template>
