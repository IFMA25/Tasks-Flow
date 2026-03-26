<script setup lang="ts">
import { format } from "date-fns";
import { useI18n } from "vue-i18n";

import type { TaskData } from "../../types";
import { getDueDateStatusFromIso } from "../utils/dateFormater";

import type { Actions } from "@/shared/types";
import VActionsDropdown from "@/shared/ui/VActionsDropdown.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VTable from "@/shared/ui/table/VTable.vue";

defineProps<{
  rows: TaskData[];
  heads: { key: string; label: string }[];
  loading?: boolean;
  showEmptyState?: boolean;
  showActions?: boolean;
  rowActions?: Actions[];
}>();

const emit = defineEmits<{
  statusChange: [task: TaskData, value: boolean];
  action: [task: TaskData, key: string];
}>();

const { t } = useI18n();

const colorsPriority: Record<string, string> = {
  low:    "text-success before:bg-success",
  medium: "text-warning before:bg-warning",
  high:   "text-danger before:bg-danger",
};

const displayDueDate = (dueDate: string) => {
  const statusKey = getDueDateStatusFromIso(dueDate);
  if (!statusKey) return t("tasks.createTaskModal.select.noDeadline");
  if (statusKey === "later") return format(new Date(dueDate), "dd MMM yyyy");
  return t(`tasks.createTaskModal.select.${statusKey}`);
};
</script>

<template>
  <VTable
    :rows="rows"
    :heads="heads"
    :show-empty-state="showEmptyState"
    class="px-4"
  >
    <template #cell-status="{ row }">
      <VCheckbox
        width="w-5"
        height="h-5"
        variant="default"
        :model-value="row.status === 'done'"
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
    <template #cell-dueDate="{ row }">
      <div
        class="text-sm leading-[1.3]"
        :class="{ 'text-danger font-medium': getDueDateStatusFromIso(row.dueDate) === 'overdue' }"
      >
        {{ displayDueDate(row.dueDate) }}
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
          @action="(key) => emit('action', row, key)"
        />
      </div>
    </template>
  </VTable>
</template>
