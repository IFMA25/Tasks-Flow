import { defineStore } from "pinia";
import { ref } from "vue";

import { useTasksRequest } from "../api/useTasksRequest";

export const useTasksStore = defineStore("tasks", () => {
  const selectedTaskId = ref<string | null>(null);
  const { completeTask } = useTasksRequest();

  const {
    execute: completeTaskExecute,
    loading: completeTaskLoading,
  } = completeTask(() => selectedTaskId.value);

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
    completeTaskLoading,
    completeTaskById,
  };
});
