<script setup lang="ts">
import { onMounted } from "vue";

import { useDashboardRequests } from "./api/useDashboardRequest";
import ListDashboard from "./components/ListDashboard.vue";

const { upcomingDeadlines } = useDashboardRequests();

const { execute, data } = upcomingDeadlines({
    onSuccess: () => {
        console.log(data.value);
    },
});

onMounted(() => {
    execute();
});
</script>

<template>
  <div class="flex gap-6">
    <ListDashboard
      :data="data"
      :title-list="$t('dashboard.todayTasks')"
      :subtitle-list="$t('dashboard.completedTasks')"
    />
    <ListDashboard
      :data="data"
      :title-list="$t('dashboard.upcomingDeadlines')"
      :subtitle-list="$t('dashboard.tasksAttention')"
    />
  </div>
</template>
