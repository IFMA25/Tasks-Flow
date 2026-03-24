<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from "vue";
import { useRoute } from "vue-router";

import { TaskData } from "../types";
import DeleteTaskModal from "./components/DeleteTaskModal.vue";
import TaskFormModal from "./components/TaskFormModal.vue";
import TasksList from "./components/TasksList.vue";
import { useListsStore } from "../lists/store/useListsStore";

import { ActionKey } from "@/shared/types";
import VButton from "@/shared/ui/common/VButton.vue";
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import { listsTabs } from "@/shared/variables/tabListsPage";

const formModalRef = ref<InstanceType<typeof TaskFormModal> | null>(null);
const deleteModalRef = ref<InstanceType<typeof DeleteTaskModal> | null>(null);

const route = useRoute();
const listStore = useListsStore();

const listId = computed(() => String(route.params.listId));
const backLink = computed(() => ({
  path: "/lists",
  query: { tab: route.query.tab || listsTabs.myLists },
}));

const openFormModal = (task?: TaskData) => {
  formModalRef.value?.open(listId.value, task);
};

function handleAction(task: TaskData, key: ActionKey) {
  if (key === "edit") openFormModal(task);
  if (key === "delete") deleteModalRef.value?.openModal(listId.value, task);
}

onMounted(() => {
  listStore.getSelectedListData(listId.value);
});
</script>

<template>
  <Teleport
    to="#header-content"
    defer
  >
    <div class="flex items-center gap-10">
      <VButton
        :to="backLink"
        icon="chevron-left"
        variant="navItem"
      />
      <VSkeleton
        v-if="listStore.isLoading"
        width="w-32"
        height="h-10"
      />
      <h2
        v-else
        class="text-3xl font-bold text-primary"
      >
        {{ listStore.selectedList?.title }}
      </h2>
    </div>
  </Teleport>
  <Teleport
    to="#header-actions"
    defer
  >
    <VButton
      icon="icon-plus"
      variant="primary"
      :text="$t('tasks.createTasksBtn')"
      @click="openFormModal()"
    />
  </Teleport>
  <TaskFormModal ref="formModalRef" />
  <DeleteTaskModal ref="deleteModalRef" />
  <TasksList
    ref="tasksListRef"
    :list-id="listId"
    @action="handleAction"
  />
</template>
