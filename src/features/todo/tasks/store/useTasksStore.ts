import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useTasksRequest } from "../api/useTasksRequest";

export const useTasksStore = defineStore("tasks", () => {

  const currentListId = ref<string | null>(null);
  const selectedTaskId = ref<string | null>(null);

  const { getAllTasks, completeTask } = useTasksRequest();

  const {
    execute,
    data: tasksData,
    loading: fetchTaskLoading,
  } = getAllTasks(() => currentListId.value);

  const { execute: completeTaskExecute, loading: completeTaskLoading } = completeTask(
    () => selectedTaskId.value
  );

  const fetchTasksForList = async (listId: string, params = {}) => {
    currentListId.value = listId;
    tasksData.value = null;
    await execute({ params });
  };

   const pendingTasks = computed(() =>
    tasksData.value?.data.filter(t => t.status === "todo") ?? []
  );

  const completedTasks = computed(() =>
    tasksData.value?.data.filter(t => t.status === "done") ?? []
  );

  const completeTaskById = async (
    taskId: string,
    completed: boolean,
    onSuccess?: () => void,
  ) => {
    selectedTaskId.value = taskId;
    await completeTaskExecute({ data: { completed } });
    onSuccess?.();
  };

  return {  
    tasksData,
    fetchTaskLoading,
    completeTaskLoading,
    pendingTasks,
    completedTasks,
    fetchTasksForList,
    completeTaskById 
  };
});
