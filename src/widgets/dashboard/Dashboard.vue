<script setup lang="ts">
import { computed, onMounted , ref, useTemplateRef, watch } from "vue";

import ListDeadlineTasks from "./components/ListDeadlineTasks.vue";
import ListWeaklyGoals from "./components/ListWeaklyGoals.vue";
import WeeklyGoalsModal from "./components/WeeklyGoalsModal.vue";
import { useDashboard } from "./composible/useDashboard";

import { useListsStore } from "@/features/todo/lists/store/useListsStore";
import { TaskData } from "@/features/todo/types";
import { useTasksStore } from "@/features/todo/tasks/store/useTasksStore";

const modalMode = ref<"edit" | "add">("add");

const listStore = useListsStore();
const tasksStore = useTasksStore();
const weeklyGoalsModalRef = useTemplateRef<InstanceType<typeof WeeklyGoalsModal>>("weeklyGoalsModal");


const handleOpenModal = async (mode: "edit" | "add") => {
  modalMode.value = mode;
  await listStore.fetchLists();
  
  weeklyGoalsModalRef.value?.openModal();
};

const handleStatusChange = async (task: TaskData, value: boolean) => {
  await tasksStore.completeTaskById(task.id, value, () => {
    fetchWeeklyGoalsTasks()
  })
}

const {
  fetchTodayTasks,
  fetchUpcomingDeadlinesTasks,
  fetchTodayTasksData,
  upcomingDeadlinesTasksData,
  weeklyGoalsTasksData,
  fetchWeeklyGoalsTasks,
} = useDashboard();

onMounted(async () => {
  fetchTodayTasks();
  fetchUpcomingDeadlinesTasks();
  await fetchWeeklyGoalsTasks();
});

</script>

<template>
  <WeeklyGoalsModal
    ref="weeklyGoalsModal"
    :mode="modalMode"
    :weekly-goals-data="weeklyGoalsTasksData"
    @save="fetchWeeklyGoalsTasks"
  />
  <div
    class="grid gap-6 [grid-template-areas:'todayDeadlines_upcomingDeadlines'_'goals_goals']
           [grid-template-columns:2fr_50%]"
  >
    <ListDeadlineTasks
      :data="fetchTodayTasksData"
      :title-list="$t('dashboard.todayTasks')"
      :subtitle-list="fetchTodayTasksData?.data.length
        ? $t('dashboard.completedTasks' , {totalTasks: fetchTodayTasksData?.total})
        : $t('dashboard.noTasks')"
      :empty-text="$t('dashboard.createNewTasks')"
      class="[grid-area:todayDeadlines]"
    />
    <ListDeadlineTasks
      :data="upcomingDeadlinesTasksData"
      :title-list="$t('dashboard.upcomingDeadlines')"
      :subtitle-list="upcomingDeadlinesTasksData?.data.length
        ? $t('dashboard.tasksAttention')
        : $t('dashboard.noDeadlines')"
      :empty-text="$t('dashboard.tasksWithDeadlines')"
      class="[grid-area:upcomingDeadlines]"
    />
    <ListWeaklyGoals
      :goals="true"
      :data="weeklyGoalsTasksData"
      :title-list="$t('dashboard.weeklyGoalsTitle')"
      :subtitle-list="weeklyGoalsTasksData?.data.length
        ? $t('dashboard.weeklyGoalsSubtitle')
        : $t('dashboard.noGoals')"
      :empty-text="$t('dashboard.addGoals')"
      class="[grid-area:goals]"
      @open-modal="handleOpenModal"
    />
  </div>
</template>
