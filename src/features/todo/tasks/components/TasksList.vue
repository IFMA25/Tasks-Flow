<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import TasksTable from "./TasksTable.vue";
import type { TaskData } from "../../types";

import type { ActionKey, Actions } from "@/shared/types";
import VCollapseContainer from "@/shared/ui/VCollapseContainer.vue";

const props = defineProps<{
  tasksData: TaskData[];
  isLoading: boolean;
  rowActions: Actions[];
}>();

const emit = defineEmits<{
  "status-change": [task: TaskData, value: boolean];
  action: [task: TaskData, key: ActionKey];
}>();

const route = useRoute();

const baseHeads = [
  { key: "status", label: "" },
  { key: "title", label: "", columnStyles: "w-[30%]" },
  { key: "priority", label: "", columnStyles: "w-[15%]" },
  { key: "deadline", label: "", columnStyles: "w-[15%]" },
  { key: "tags", label: "" },
  { key: "actions", label: "" },
];

const hiddenUserListColumns = ["status", "actions"];

const isUserList = computed(() => route.query.tab === "usersLists");

const heads = computed(() => {
  if (isUserList.value) {
    return baseHeads.filter(head => !hiddenUserListColumns.includes(head.key));
  }
  return baseHeads;
});

const pendingTasks = computed(() =>
  props.tasksData?.filter(t => t.status === "todo") ?? [],
);

const completedTasks = computed(() =>
  props.tasksData?.filter(t => t.status === "done") ?? [],
);
</script>

<template>
  <div class="relative flex flex-col gap-8 w-full h-full max-w-5xl mx-auto p-4">
    <VCollapseContainer
      :title="$t('tasks.pending')"
      :count="pendingTasks.length"
      :loading="isLoading"
    >
      <TasksTable
        :rows="pendingTasks"
        :heads="heads"
        :loading="isLoading"
        :show-empty-state="!pendingTasks.length && !completedTasks.length && !isLoading"
        :show-actions="true"
        :row-actions="rowActions"
        @status-change="(task, value) => emit('status-change', task, value)"
        @action="(row, key) => emit('action', row, key)"
      />
    </VCollapseContainer>

    <VCollapseContainer
      v-if="completedTasks.length || isLoading"
      :title="$t('tasks.completed')"
      :count="completedTasks.length"
      :loading="isLoading"
    >
      <TasksTable
        :rows="completedTasks"
        :heads="heads"
        :loading="isLoading"
        :show-empty-state="false"
        :show-actions="false"
        @status-change="(task, value) => emit('status-change', task, value)"
      />
    </VCollapseContainer>
  </div>
</template>
