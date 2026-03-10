<script setup lang="ts">
import { watchEffect } from 'vue';

import VButton from '@/shared/ui/common/VButton.vue';

import { useTasksStore } from './store/useTasksStore';

const props = defineProps<{
  listId: string;
}>();

const tasksStore = useTasksStore();

watchEffect(() => {
  tasksStore.fetchTasksForList(props.listId);
});

</script>

<template>
  <Teleport
    to="#header-actions"
    defer
  >
    <VButton
      icon="icon-plus"
      variant="primary"
      :text="$t('tasks.createTasksBtn')"
      @click="openCreateModal()"
    />
  </Teleport>
  <div>
    Tasks
    {{ tasks.tasksData }}
  </div>
</template>
