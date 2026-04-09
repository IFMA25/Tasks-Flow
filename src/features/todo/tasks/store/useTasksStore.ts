import { defineStore } from "pinia";
import { ref } from "vue";

import { useTasksRequest } from "../api/useTasksRequest";

export const useTasksStore = defineStore("tasks", () => {

  const currentListId = ref<string | null>(null);

  const { getAllTasks } = useTasksRequest();

  const {
    execute,
    data: tasksData,
    loading: fetchTaskLoading,
  } = getAllTasks(() => currentListId.value);

  const fetchTasksForList = async (listId: string, params = {}) => {
    currentListId.value = listId;
    tasksData.value = null;
    await execute({ params });
  };

  return {  tasksData, fetchTaskLoading, fetchTasksForList };
});
