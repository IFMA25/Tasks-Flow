<script setup lang="ts">
import { computed, ref } from "vue";

import { formatDueDate } from "../utils";

import VTable from "@/shared/ui/table/VTable.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VActionsDropdown from "@/shared/ui/VActionsDropdown.vue";
import VButton from "@/shared/ui/common/VButton.vue";
import TasksListToolbar from "./TasksListToolbar.vue";
import { useTasksListFeature } from "../composable/useTasksListFeature";

const {listId} = defineProps<{
  listId: string;
}>();

const emit = defineEmits(["action"]);

const {
  pendingTasks,
  completedTasks,
  isLoading,
  rowActions,
  sortOptions,
  priorityOptions,
  selectedSort,
  selectedPriority,
  handleStatusChange
} = useTasksListFeature(listId);

const isCompletedOpen = ref(true);

const heads = computed(() => [
  { key: "status",   label: "" },
  { key: "title",    label: "" },
  { key: "priority", label: "" },
  { key: "dueDate",  label: "" },
  { key: "tags",     label: "" },
  { key: "actions",  label: "" },
]);

const colorsPriority: Record<string, string> = {
  low:    "text-success before:bg-success",
  medium: "text-warning before:bg-warning",
  high:   "text-danger before:bg-danger",
};

</script>

<template>
  <div class="relative flex flex-col gap-8 w-full max-w-5xl mx-auto p-4">
    <div>
      <h3 class="mb-2" v-if="pendingTasks.length">
        {{ $t("tasks.pending") }} ({{ pendingTasks.length }})
      </h3>
      <VTable
        :rows="pendingTasks"
        :heads="heads"
        :loading="isLoading"
        :show-empty-state="!pendingTasks.length && !completedTasks.length"
      >
        <template #toolbar>
          <TasksListToolbar
            v-if="pendingTasks.length || completedTasks.length"
            v-model:priority="selectedPriority"
            v-model:sort="selectedSort"
            :options="{
              priorityOptions,
              sortOptions,
            }"
          />
        </template>
        <template #cell-status="{ row }">
          <VCheckbox
            width="w-5"
            height="h-5"
            variant="default"
            :model-value="row.status === 'done'"
            @update:model-value="(value) => handleStatusChange(row, value)"
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
            {{ row.priority }}
          </div>
        </template>
        <template #cell-dueDate="{ row }">
          <div
            class="text-sm leading-[1.3]"
            :class="{ 'text-danger font-medium': row.deadline === 'Overdue' }"
          >
            {{ formatDueDate(row.dueDate) }}
          </div>
        </template>
        <template #cell-tags="{ row }">
          <div class="flex items-center flex-wrap gap-1.5 text-sm font-medium text-secondary leading-[1.3]">
            <span v-for="(tag, index) in row.tags" :key="tag">
              {{ tag }}
              <span v-if="index !== row.tags.length - 1">•</span>
            </span>
          </div>
        </template>
        <template #cell-actions="{ row }">
          <div v-if="row.status !== 'done'" class="flex justify-end">
            <VActionsDropdown
              :actions="rowActions"
              @action="(key) => emit('action', row, key)"
            />
          </div>
        </template>
      </VTable>
    </div>

    <div>
      <h3 class="flex items-center gap-2 cursor-pointer mb-2" v-if="completedTasks.length">
        {{ $t("tasks.completed") }} ({{ completedTasks.length }})
        <VButton
          variant="cardTitle"
          icon="chevron-down"
          class="transition-transform duration-300"
          :class="{ 'rotate-180': isCompletedOpen }"
          @click="isCompletedOpen = !isCompletedOpen"
        />
      </h3>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition-all duration-300 ease-in"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <VTable
          v-if="isCompletedOpen && completedTasks.length"
          :rows="completedTasks"
          :heads="heads"
          :show-empty-state="false"
          class="px-4"
        >
          <template #cell-status="{ row }">
            <VCheckbox
              width="w-5"
              height="h-5"
              variant="default"
              :model-value="row.status === 'done'"
              @update:model-value="(value) => handleStatusChange(row, value)"
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
              {{ row.priority }}
            </div>
          </template>
          <template #cell-dueDate="{ row }">
            <div
              class="text-sm leading-[1.3]"
              :class="{ 'text-danger font-medium': row.deadline === 'Overdue' }"
            >
              {{ formatDueDate(row.dueDate) }}
            </div>
          </template>
          <template #cell-tags="{ row }">
            <div class="flex items-center flex-wrap gap-1.5 text-sm font-medium text-secondary leading-[1.3]">
              <span v-for="(tag, index) in row.tags" :key="tag">
                {{ tag }}
                <span v-if="index !== row.tags.length - 1">•</span>
              </span>
            </div>
          </template>
        </VTable>
      </Transition>
    </div>
  </div>
</template>
