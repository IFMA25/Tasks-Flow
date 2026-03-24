import { computed, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { TaskData } from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";

import { useSelectedOption } from "@/shared/composables/useSelectedOption";
import { Actions, PriorityOption, SortOption } from "@/shared/types";

export const useTasksListFeature = (listId: string) => {
  const { t } = useI18n();
  const tasksStore = useTasksStore();
  const { completeTask } = useTasksRequest();

  const rowActions = computed<Actions[]>(() => [{ key: "edit",   label: t("tasks.editTask") }, { key: "delete", label: t("deleteModal.title", { entityName: t("tasks.task") }) }]);

  const sortOptions = computed<SortOption[]>(() => [
    { key: "recentlyAdded", label: t("filters.recentlyAdded"), params: { sort: "createdAt", order: "desc" } },
    { key: "oldestFirst",   label: t("filters.oldestFirst"),   params: { sort: "createdAt", order: "asc" } },
    { key: "nameAsc",       label: t("filters.nameAsc"),       params: { sort: "title", order: "asc" } },
    { key: "nameDesc",      label: t("filters.nameDesc"),      params: { sort: "title", order: "desc" } },
  ]);

  const priorityOptions = computed<PriorityOption[]>(() => [
    { key: "all",    label: t("filters.allPriorities"),    params: { priority: undefined } },
    { key: "low",    label: t("filters.low"),    params: { priority: "low" } },
    { key: "medium", label: t("filters.medium"), params: { priority: "medium" } },
    { key: "high",   label: t("filters.high"),   params: { priority: "high" } },
  ]);

  const pendingTasks = computed(() =>
    tasksStore.tasksData?.data.filter((t) => t.status === "todo") ?? [],
  );
  const completedTasks = computed(() =>
    tasksStore.tasksData?.data.filter((t) => t.status === "done") ?? [],
  );

  const isLoading = computed(
    () => completeTaskLoading.value || tasksStore.fetchTaskLoading,
  );

  const selectedTask = ref<TaskData | null>(null);
  const activeSortKey = ref<string>(sortOptions.value[0].key);
  const activePriorityKey = ref<string>(priorityOptions.value[0].key);

  const selectedSort = useSelectedOption<SortOption>(
    sortOptions,
    activeSortKey,
    (value) => { activeSortKey.value = String(value); },
  );

  const selectedPriority = useSelectedOption<PriorityOption>(
    priorityOptions,
    activePriorityKey,
    (value) => { activePriorityKey.value = String(value); },
  );

  const fetchParams = computed(() => ({
    sort: selectedSort.value.params.sort,
    order: selectedSort.value.params.order,
    priority: selectedPriority.value.params.priority,
  }));
  const { execute: completeTaskExecute, loading: completeTaskLoading } =
    completeTask(() => selectedTask.value?.id, {
      onSuccess: () => tasksStore.fetchTasksForList(listId),
    });

  const handleStatusChange = async (task: TaskData, value: boolean) => {
    selectedTask.value = task;
    await completeTaskExecute({ data: { completed: value } });
  };

  watch(fetchParams, () => {
    tasksStore.fetchTasksForList(listId, fetchParams.value);
  }, { immediate: true });

  return {
    pendingTasks,
    completedTasks,
    isLoading,
    rowActions,
    sortOptions,
    priorityOptions,
    selectedSort,
    selectedPriority,
    handleStatusChange,
  };
};
