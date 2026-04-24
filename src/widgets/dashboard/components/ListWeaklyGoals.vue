<script setup lang="ts">
import ItemDashboardList from "./ItemDashboardList.vue";
import { DashboardTask } from "../types";
import SkeletonWeeklyGoals from "./skeleton/SkeletonWeeklyGoals.vue";
import { useDashboardStore } from "../store/useDashboardStore";

import { useTasksStore } from "@/features/todo/tasks/store/useTasksStore";
import VButton from "@/shared/ui/common/VButton.vue";

defineEmits<{
  openModal: [mode: "edit" | "add"];
}>();

const tasksStore = useTasksStore();
const dashboardStore = useDashboardStore();

const handleStatusChange = async (task: DashboardTask, value: boolean) => {
  await tasksStore.completeTaskById(task.id, value, () => {
    dashboardStore.updateDashboardExecute();
  });
};

</script>

<template>
  <div
    class="max-h-[28rem] min-h-[13.75rem]
    overflow-x-hidden overflow-y-auto rounded-2xl border-2 border-surface py-4 px-6"
  >
    <div class="flex justify-between items-center mb-1">
      <h3 class="text-[2rem] leading-[1.2] font-semibold mb-2">
        {{ $t('dashboard.weeklyGoalsTitle') }}
      </h3>

      <VButton
        v-if="dashboardStore.weeklyGoalsData?.data.length"
        :text="$t('edit')"
        variant="dashboardNav"
        @click="$emit('openModal', 'edit')"
      />
    </div>
    <p class="text-sm text-secondary leading-[1.3] mb-4">
      {{ $t('dashboard.weeklyGoalsSubtitle') }}
    </p>
    <SkeletonWeeklyGoals
      v-if="dashboardStore.updateDashboardLoading || dashboardStore.updateWeeklyGoalsLoading"
    />
    <ul
      v-else-if="dashboardStore.weeklyGoalsData?.data.length"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <ItemDashboardList
        v-for="task in dashboardStore.weeklyGoalsData?.data"
        :key="task.id"
        :goals="true"
        :loading="tasksStore.completingTaskId === task.id"
        :task="task"
        @status-change="handleStatusChange"
      />
    </ul>
    <div
      v-else
      class="flex flex-col items-center"
    >
      <p class="text-[1.25rem] text-muted leading-[1.3] mb-4">
        {{ $t('dashboard.noGoals') }}
      </p>
      <VButton
        :text="$t('dashboard.createNewGoals')"
        variant="dashboardNav"
        icon="plus"
        @click="$emit('openModal', 'add')"
      />
    </div>
  </div>
</template>
