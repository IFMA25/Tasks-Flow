<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useTasks } from "./api/useTasks";

const route = useRoute();
const listId = computed(() => String(route.params.listId));

const { getAllTasks } = useTasks();
const { data } = getAllTasks(() => listId.value, {
  immediate: true,
  onSuccess: () => {
    console.log("tasks", data.value);
  },
});

</script>

<template>
  <div>
    Tasks
    {{ data }}
  </div>
</template>
