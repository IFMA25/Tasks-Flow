<script setup lang="ts">
import { onMounted } from "vue";

import ListDashboard from "./components/ListDashboard.vue";
import { useDashboard } from "./composible/useDashboard";


const {
  fetchTodayTasks,
  fetchUpcomingDeadlines,
  fetchTodayTasksData,
  fetchUpcomingDeadlinesData,
  listStore,
  completedTasks,
} = useDashboard();

onMounted(async () => {
  fetchTodayTasks();
  fetchUpcomingDeadlines();
  await listStore.fetchLists();
});
</script>

<template>
  <div class="flex gap-6">
    <ListDashboard
      :data="fetchTodayTasksData"
      :title-list="$t('dashboard.todayTasks')"
      :subtitle-list="$t('dashboard.completedTasks',
                         {
                           completedTasks: completedTasks,
                           totalTasks: fetchTodayTasksData?.total
                         }
      )"
    />
    <ListDashboard
      :data="fetchUpcomingDeadlinesData"
      :title-list="$t('dashboard.upcomingDeadlines')"
      :subtitle-list="$t('dashboard.tasksAttention')"
    />
  </div>
</template>
