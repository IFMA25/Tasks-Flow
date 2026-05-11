<script setup>
import StatusOverview from "./components/StatusOverview.vue";
import TagsPopularity from "./components/TagsPopularity.vue";
import TaskByPriority from "./components/TaskByPriority.vue";
import TaskCompletion from "./components/TaskCompletion.vue";
import { useAnalytics } from "./composables/useAnalytics";

const { period, topTag } = useAnalytics();
</script>

<template>
  <div class="flex flex-col gap-4">
    <StatusOverview />
    <TaskCompletion
      :period="period"
      @change-period="(value) => (period = value)"
    />
    <div class="flex flex-col lg:flex-row gap-4">
      <TagsPopularity
        :top-tag="topTag"
        class="w-full lg:w-3/5"
        @change-top-tag="(value) => (topTag = value)"
      />
      <TaskByPriority
        class="w-full lg:w-2/5"
      />
    </div>
  </div>
</template>
