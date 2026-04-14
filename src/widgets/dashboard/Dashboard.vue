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
      :subtitle-list="fetchTodayTasksData?.data.length ? $t('dashboard.completedTasks' ,
                                                            {
                                                              totalTasks: fetchTodayTasksData?.total
                                                            }
      ) : $t('dashboard.noTasks')"
      :empty-text="$t('dashboard.createNewTasks')"
    />
    <ListDashboard
      :data="fetchUpcomingDeadlinesData"
      :title-list="$t('dashboard.upcomingDeadlines')"
      :subtitle-list="fetchUpcomingDeadlinesData?.data.length
        ? $t('dashboard.tasksAttention')
        : $t('dashboard.noDeadlines')"
      :empty-text="$t('dashboard.tasksWithDeadlines')"
    />
  </div>
</template>
