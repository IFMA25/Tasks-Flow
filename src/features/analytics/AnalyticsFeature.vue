<script setup>
import StatusOverview from "./components/StatusOverview.vue";
import TagsPopularity from "./components/TagsPopularity.vue";
import TaskByPriority from "./components/TaskByPriority.vue";
import TaskCompletion from "./components/TaskCompletion.vue";
import { useAnalyticsFeature } from "./composible/useAnalyticsFeature";

const {
  analyticsSummaryData,
  dailyActivityData,
  tagPopularityData,
  tasksPriorityData,
  isLoading,
} = useAnalyticsFeature();
</script>

<template>
  <div class="flex flex-col gap-4">
    <StatusOverview
      :data="analyticsSummaryData"
      :loading="isLoading"
    />
    <TaskCompletion
      :data="dailyActivityData"
      :loading="isLoading"
    />
    <div class="flex gap-4">
      <TagsPopularity
        class="w-3/5"
        :data="tagPopularityData"
        :loading="isLoading"
      />
      <TaskByPriority
        class="w-2/5"
        :data="tasksPriorityData"
        :loading="isLoading"
      />
    </div>
  </div>
</template>
