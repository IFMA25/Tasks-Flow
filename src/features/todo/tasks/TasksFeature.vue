<script setup lang="ts">
import { invalidateCache } from "@ametie/vue-muza-use";
import {
  computed,
  useTemplateRef,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";

import { RequestBodyTaskData, TaskData } from "../types";
import DeleteTaskModal from "./components/DeleteTaskModal.vue";
import TaskFormModal from "./components/TaskFormModal.vue";
import TasksList from "./components/TasksList.vue";
import TasksListToolbar from "./components/TasksListToolbar.vue";
import { useTasksListFeature } from "./composable/useTasksListFeature";
import { useTasksStore } from "./store/useTasksStore";
import { useListsStore } from "../lists/store/useListsStore";

import router from "@/app/router";
import { ActionKey } from "@/shared/types";
import { RouteNames } from "@/shared/types/routeNames";
import VButton from "@/shared/ui/common/VButton.vue";
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import { analyticsCacheKeys, dashboardCacheKeys } from "@/shared/variables/cacheKey";
import { listsTabs } from "@/shared/variables/tabListsPage";

const tabPermissions = {
  usersLists: "tasks.readAll",
  myLists: "tasks.read",
};

const formModalRef = useTemplateRef<InstanceType<typeof TaskFormModal>>("formModalRef");
const deleteModalRef = useTemplateRef<InstanceType<typeof DeleteTaskModal>>("deleteModalRef");

const { t } = useI18n();
const route = useRoute();
const listStore = useListsStore();
const tasksStore = useTasksStore();

const listId = computed(() => String(route.params.listId));
const isUsersListsTab = computed(() => route.query.tab === "usersLists");

const {
  isLoading,
  rowActions,
  sortOptions,
  priorityOptions,
  activeSortKey,
  activePriorityKey,
  tasksData,
  fetchTasks,
  hasPermission,
  createNewTaskExecute,
  updateSelectedTaskExecute,
  deleteTaskExecute,
  setSelectedTask,
} = useTasksListFeature(listId);

const currentTab = computed(
  () => (route.query.tab as string) || listsTabs.myLists,
);

const canViewThisList = computed(() => {
  const permission = tabPermissions[currentTab.value];
  if (!permission) return false;
  return hasPermission(permission);
});

const backLink = computed(() => ({
  path: "/lists",
  query: { tab: route.query.tab || listsTabs.myLists },
}));

const openFormModal = (task?: TaskData) => {
  setSelectedTask(task ?? null);
  formModalRef.value?.open(listId.value, task);
};

const handleAction = (task: TaskData, key: ActionKey) => {
  if (key === "edit") openFormModal(task);
  if (key === "delete") {
    setSelectedTask(task);
    deleteModalRef.value?.openModal(task);
  }
};

const handleFormSubmit = async (action: "create" | "edit", data: RequestBodyTaskData) => {
  if (action === "create") {
    await createNewTaskExecute({ data });
    toast.success(t("tasks.msgCreateSuccess"));
  } else {
    await updateSelectedTaskExecute({ data });
    toast.success(t("tasks.msgUpdateSuccess"));
  }
  invalidateCache([...Object.values(dashboardCacheKeys), ...Object.values(analyticsCacheKeys)]);
};

watch(
  canViewThisList,
  (newValue) => {
    if (newValue === false) {
      router.replace({ name: RouteNames.notFound });
    }
  },
);
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
        class="hidden sm:block text-fluid-h3 font-emibold text-primary"
      >
        {{ tasksData?.listInfo?.title }}
      </h2>
    </div>
  </Teleport>
  <Teleport
    to="#header-actions"
    defer
  >
    <VButton
      v-if="!isUsersListsTab && hasPermission('create:task')"
      icon="icon-plus"
      variant="primary"
      :text="$t('tasks.createTasksBtn')"
      @click="openFormModal()"
    />
  </Teleport>
  <TaskFormModal
    ref="formModalRef"
    @submit="handleFormSubmit"
  />

  <DeleteTaskModal
    ref="deleteModalRef"
    @confirm-delete="deleteTaskExecute()"
  />

  <TasksListToolbar
    v-if="(tasksData?.data?.length ?? 0) || isLoading"
    v-model:sort="activeSortKey"
    v-model:priority="activePriorityKey"
    :sort-options="sortOptions"
    :priority-options="priorityOptions"
  />

  <TasksList
    :tasks-data="tasksData?.data ?? []"
    :row-actions="rowActions"
    :is-loading="isLoading"
    @status-change="(task, value) => tasksStore.handleStatusChange(task, value, fetchTasks)"
    @action="handleAction"
  />
</template>
