<script setup lang="ts">
import {
  ref,
  watchEffect,
} from 'vue';

import VButton from '@/shared/ui/common/VButton.vue';

import TaskFormModal from './components/TaskFormModal.vue';
import { useTasksStore } from './store/useTasksStore';

const props = defineProps<{
  listId: string;
}>();

const tasksStore = useTasksStore();

const formModalRef = ref<InstanceType<typeof TaskFormModal> | null>(null);

const openCreateModal = () => {
  formModalRef.value?.open();
};

watchEffect(() => {
  tasksStore.fetchTasksForList(props.listId);
});

</script>

<template>
  <TaskFormModal ref="formModalRef" />
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
    {{ tasksStore.tasksData }}
  </div>
</template>
