<script setup lang="ts">
import { format } from "date-fns";
import { useI18n } from "vue-i18n";

import type { TaskData } from "../../types";
import TasksTableSkeleton from "./skeleton/TasksTableSkeleton.vue";
import { useTasksStore } from "../store/useTasksStore";
import { getDeadlineStatusFromIso } from "../utils/dateFormater";

import type { ActionKey, Actions } from "@/shared/types";
import VActionsDropdown from "@/shared/ui/VActionsDropdown.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VTable, { TableColumn } from "@/shared/ui/table/VTable.vue";
import { colorsPriority } from "@/shared/variables/colorMap";

defineProps<{
  rows: TaskData[];
  heads: TableColumn<TaskData>[];
  loading?: boolean;
  showEmptyState?: boolean;
  showActions?: boolean;
  rowActions?: Actions[];
}>();

const tasksStore = useTasksStore();

const emit = defineEmits<{
  statusChange: [task: TaskData, value: boolean];
  action: [task: TaskData, key: ActionKey];
}>();

const { t } = useI18n();

const displayDeadline = (deadline: string) => {
  const statusKey = getDeadlineStatusFromIso(deadline);
  if (!statusKey) return t("tasks.createTaskModal.select.noDeadline");
  if (statusKey === "later") return format(new Date(deadline), "dd MMM yyyy");
  return t(`tasks.createTaskModal.select.${statusKey}`);
};
</script>

<template>
  <TasksTableSkeleton v-if="loading" />
  <VTable
    v-else
    :rows="rows"
    :heads="heads"
    :show-empty-state="showEmptyState"
    class="h-[35dvh] bg-bgSecondary"
  >
    <template #cell-status="{ row }">
      <VCheckbox
        :model-value="row.status === 'done'"
        box-class="group-hover:border-primaryBg"
        :disabled="tasksStore.completingTaskId === row.id"
        @update:model-value="(val) => emit('statusChange', row, val)"
      />
    </template>
    <template #cell-title="{ row }">
      <span class="font-medium text-primary">{{ row.title }}</span>
    </template>
    <template #cell-priority="{ row }">
      <div
        class="text-sm flex items-center gap-1.5 capitalize
                     before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full"
        :class="colorsPriority[row.priority]"
      >
        {{ t(`tasks.createTaskModal.select.${row.priority}`) }}
      </div>
    </template>
    <template #cell-deadline="{ row }">
      <div
        class="text-sm leading-[1.3]"
        :class="{ 'text-danger font-medium': getDeadlineStatusFromIso(row.deadline) === 'overdue' }"
      >
        {{ displayDeadline(row.deadline) }}
      </div>
    </template>
    <template #cell-tags="{ row }">
      <div
        class="flex items-center flex-wrap gap-1.5
        text-sm font-medium text-secondary leading-[1.3]"
      >
        <span
          v-for="(tag, index) in row.tags"
          :key="tag"
        >
          {{ tag }}
          <span v-if="index !== row.tags.length - 1">•</span>
        </span>
      </div>
    </template>
    <template
      v-if="showActions"
      #cell-actions="{ row }"
    >
      <div
        v-if="row.status !== 'done'"
        class="flex justify-end"
      >
        <VActionsDropdown
          :actions="rowActions"
          @action="(key: ActionKey) => emit('action', row, key)"
        />
      </div>
    </template>
  </VTable>
</template>
