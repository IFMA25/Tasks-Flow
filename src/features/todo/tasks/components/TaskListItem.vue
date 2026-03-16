<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { TaskData } from "../../types";
import { formatDueDate } from "../utils";

import { Action } from "@/shared/types";
import VActionsDropdown from "@/shared/ui/VActionsDropdown.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";


const { t } = useI18n();

const colorsPriority = {
  low: "text-success before:bg-success",
  medium: "text-warning before:bg-warning",
  high: "text-danger before:bg-danger",
};

const actions = computed<Action[]>(() => [
  { key: "edit", label: t("tasks.editTask") },
  { key: "delete", label: t("tasks.deleteTask.title") },
]);

const { task } = defineProps<{
  task: TaskData;
}>();

const emit = defineEmits(["action", "statusChange"]);

const priorityStyle = computed(() => colorsPriority[task.priority]);
</script>

<template>
  <div
    class="grid grid-cols-[24px_minmax(200px,2fr)_100px_120px_minmax(150px,1fr)_32px]
           gap-4 items-center border-b border-default pt-6"
  >
    <div class="flex items-center justify-center">
      <VCheckbox
        width="w-5"
        height="h-5"
        variant="default"
        :model-value="task.status === 'done'"
        @update:model-value="(value) => emit('statusChange', task, value)"
      />
    </div>
    <p
      class="font-medium text-primary"
    >
      {{ task.title }}
    </p>
    <div
      class="text-sm flex items-center gap-1.5
      capitalize before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full"
      :class="priorityStyle"
    >
      {{ task.priority }}
    </div>
    <div
      class="text-sm leading-[1.3]"
      :class="{'text-danger font-medium': task.deadline === 'Overdue'}"
    >
      {{ formatDueDate(task.dueDate) }}
    </div>
    <div
      class="flex items-center flex-wrap gap-1.5
      text-sm font-medium text-secondary leading-[1.3] "
    >
      <span
        v-for="(tag, index) in task.tags"
        :key="tag"
      >
        {{ tag }}
        <span
          v-if="index !== task.tags.length - 1"
        >•</span>
      </span>
    </div>
    <div
      v-if="task.status !== 'done'"
      class="flex justify-end"
    >
      <VActionsDropdown
        :actions="actions"
        @action="(key) => emit('action', task, key)"
      />
    </div>
  </div>
</template>
