<script setup lang="ts">
import {
  computed,
  ref,
  watchEffect,
} from "vue";
import { useRoute } from "vue-router";

import { TaskData } from "../types";
import TaskFormModal from "./components/TaskFormModal.vue";
import TasksList from "./components/TasksList.vue";
import { useTasksFeature } from "./composable/useTasksFeature";

import { ActionKey } from "@/shared/types";
import VButton from "@/shared/ui/common/VButton.vue";

const route = useRoute();
const { tasksStore } = useTasksFeature();

const listId = computed(() => String(route.params.listId));
const backLink = computed(() => ({
  path: "/lists",
  query: { tab: route.query.tab || "myLists" },
}));

const formModalRef = ref<InstanceType<typeof TaskFormModal> | null>(null);
// const deleteModalRef = ref<InstanceType<typeof DeleteListModal> | null>(null);

function handleAction(task: TaskData, key: ActionKey) {
  if (key === "edit") formModalRef.value?.open(listId.value, task);
  // if (key === 'delete') deletingTask.value = task; // для модалки удаления
}

const openCreateModal = () => {
  formModalRef.value?.open(listId.value);
};

watchEffect(() => {
  tasksStore.fetchTasksForList(listId.value);
});

</script>

<template>
  <TaskFormModal ref="formModalRef" />
  <Teleport to="#header-content">
    <VButton
      :to="backLink"
      icon="chevron-left"
      variant="navItem"
      :text="$t('lists.lists')"
    />
  </Teleport>
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
  <TasksList
    :tasks="tasksStore.tasksData?.data || []"
    @action="handleAction"
  />
</template>
