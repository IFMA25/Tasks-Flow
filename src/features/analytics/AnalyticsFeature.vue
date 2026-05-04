<script setup>
import StatusOverview from "./components/StatusOverview.vue";
import TagsPopularity from "./components/TagsPopularity.vue";
import TaskByPriority from "./components/TaskByPriority.vue";
import TaskCompletion from "./components/TaskCompletion.vue";
</script>

<template>
  <div class="flex flex-col gap-4">
    <StatusOverview />
    <TaskCompletion />
    <div class="flex gap-4">
      <TagsPopularity
        class="w-3/5"
      />
      <TaskByPriority
        class="w-2/5"
      />
    </div>
  </div>
</template>
