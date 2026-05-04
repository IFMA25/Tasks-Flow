import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { TaskData } from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";

import { Actions, SortOption, PriorityOption } from "@/shared/types";

const selectedTask = ref<TaskData | null>(null);

export const useTasksListFeature = (listId: string) => {
  const { t } = useI18n();
  const tasksStore = useTasksStore();
  const { getAllTasks, createNewTask, updateTask, deleteTask } = useTasksRequest();

  const sortOptions = computed<SortOption[]>(() => [
    { key: "recentlyAdded", label: t("filters.recentlyAdded"), params: { sort: "createdAt", order: "desc" } },
    { key: "oldestFirst",   label: t("filters.oldestFirst"),   params: { sort: "createdAt", order: "asc"  } },
    { key: "nameAsc",       label: t("filters.nameAsc"),       params: { sort: "title",     order: "asc"  } },
    { key: "nameDesc",      label: t("filters.nameDesc"),      params: { sort: "title",     order: "desc" } },
  ]);

  const priorityOptions = computed<PriorityOption[]>(() => [
    { key: "all",    label: t("filters.allPriorities"), params: { priority: undefined } },
    { key: "low",    label: t("filters.low"),           params: { priority: "low"     } },
    { key: "medium", label: t("filters.medium"),        params: { priority: "medium"  } },
    { key: "high",   label: t("filters.high"),          params: { priority: "high"    } },
  ]);

  const rowActions = computed<Actions[]>(() => [{ key: "edit",   label: t("tasks.editTask") }, { key: "delete", label: t("deleteModal.title", { entityName: t("tasks.task") }) }]);

  const activeSortKey = ref(sortOptions.value[0].key);
  const activePriorityKey = ref(priorityOptions.value[0].key);

  const fetchParams = computed(() => {
    const sort = sortOptions.value.find((o) => o.key === activeSortKey.value)!;
    const priority = priorityOptions.value.find((o) => o.key === activePriorityKey.value)!;
    return {
      sort: sort.params.sort,
      order: sort.params.order,
      priority: priority.params.priority,
    };
  });

  const {
    execute: fetchTasks,
    data: tasksData,
    loading: fetchTaskLoading,
  } = getAllTasks(
    () => listId,
    {
      params: fetchParams,
      immediate: true,
    },
  );

  const { execute: createNewTaskExecute, loading: createNewTaskLoading } =
    createNewTask(() => listId, {
      lazy: true,
      onSuccess: async () => {
        await fetchTasks();
      },
    });

  const { execute: updateSelectedTaskExecute, loading: updateTaskLoading } =
    updateTask(() => selectedTask.value?.id, {
      lazy: true,
      onSuccess: async () => {
        await fetchTasks();
      },
    });

  const { execute: deleteTaskExecute, loading: deleteTaskLoading } =
    deleteTask(() => selectedTask.value?.id, {
      lazy: true,
      onSuccess: async () => {
        await fetchTasks();
      },
    });

  const handleStatusChange = async (task: TaskData, value: boolean) => {
    await tasksStore.completeTaskById(task.id, value, async () => {
      await fetchTasks();
    });
  };

  const isLoading = computed(
    () =>
      fetchTaskLoading.value ||
      createNewTaskLoading.value ||
      updateTaskLoading.value ||
      deleteTaskLoading.value,
  );

  const setSelectedTask = (task: TaskData | null) => {
    selectedTask.value = task;
  };

  return {
    tasksData,
    isLoading,
    sortOptions,
    priorityOptions,
    activeSortKey,
    activePriorityKey,
    rowActions,
    fetchTasks,
    handleStatusChange,
    createNewTaskExecute,
    updateSelectedTaskExecute,
    deleteTaskExecute,
    setSelectedTask,
  };
};
