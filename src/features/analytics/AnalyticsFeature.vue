<script setup>
import StatusOverview from "./components/StatusOverview.vue";
import TaskCompletion from "./components/TaskCompletion.vue";
</script>

<template>
  <div class="flex flex-col gap-8">
    <StatusOverview />
    <TaskCompletion />
  </div>
</template>
