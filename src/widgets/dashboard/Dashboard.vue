<script setup lang="ts">
import { onMounted } from "vue";

import ListDeadlineTasks from "./components/ListDeadlineTasks.vue";
import ListWeaklyGoals from "./components/ListWeaklyGoals.vue";
import { useDashboard } from "./composible/useDashboard";


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
  fetchWeeklyGoalsTasks;
});
</script>

<template>
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
    />
  </div>
</template>
