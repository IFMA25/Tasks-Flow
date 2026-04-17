import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { TaskData } from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";

import { Actions, SortOption, PriorityOption } from "@/shared/types";

export const useTasksListFeature = (listId: string) => {
  const { t } = useI18n();
  const tasksStore = useTasksStore();

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

  const rowActions = computed<Actions[]>(() => [{ key: "edit",   label: t("tasks.editTask") }, { key: "delete", label: t("deleteModal.title", { entityName: t("tasks.task") }) }]);

 const handleStatusChange = async (task: TaskData, value: boolean) => {
  await tasksStore.completeTaskById(task.id, value, () => {
    tasksStore.fetchTasksForList(listId, fetchParams.value)
  })
}

const isLoading = computed(
  () => tasksStore.completeTaskLoading || tasksStore.fetchTaskLoading
)

  watch(fetchParams, () => {
    tasksStore.fetchTasksForList(listId, fetchParams.value);
  }, { immediate: true });

  return {
    isLoading,
    rowActions,
    handleStatusChange,
    sortOptions,
    priorityOptions,
    activeSortKey,
    activePriorityKey,
  };
};
