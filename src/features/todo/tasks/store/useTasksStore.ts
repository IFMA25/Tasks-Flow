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

  const fetchTasksForList = async (listId: string) => {
    currentListId.value = listId;
    await execute();
  };

  return { currentListId, tasksData, fetchTaskLoading, fetchTasksForList };

});
