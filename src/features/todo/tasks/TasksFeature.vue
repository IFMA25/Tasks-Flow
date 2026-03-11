<script setup lang="ts">
import {
  computed,
  ref,
  watchEffect,
} from "vue";
import { useRoute } from "vue-router";

import TaskFormModal from "./components/TaskFormModal.vue";
import TasksList from "./components/TasksList.vue";
import { useTasksStore } from "./store/useTasksStore";

import VButton from "@/shared/ui/common/VButton.vue";
import VLoader from "@/shared/ui/common/VLoader.vue";


const route = useRoute();
const tasksStore = useTasksStore();

const listId = computed(() => route.params.listId as string);

const formModalRef = ref<InstanceType<typeof TaskFormModal> | null>(null);

const openCreateModal = () => {
  formModalRef.value?.open(listId.value);
};

watchEffect(() => {
  tasksStore.fetchTasksForList(listId.value);
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
  <div class="relative">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="tasksStore.fetchTaskLoading"
        class="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm"
      >
        <VLoader
          color="primaryDark"
          size="h-[100px]"
        />
      </div>
    </Transition>
    <TasksList :tasks="tasksStore.tasksData?.data || []" />
  </div>
</template>
