import { defineStore } from "pinia";
import { ref } from "vue";

import { useTasksRequest } from "../api/useTasksRequest";

export const useTasksStore = defineStore("tasks", () => {
  const selectedTaskId = ref<string | null>(null);
  const completingTaskId = ref<string | null>(null);
  const { completeTask } = useTasksRequest();

  const {
    execute: completeTaskExecute,
    loading: completeTaskLoading,
  } = completeTask(() => selectedTaskId.value, {
    lazy: true,
  });

  const completeTaskById = async (
  taskId: string,
  completed: boolean,
  onSuccess?: () => void,
) => {
  selectedTaskId.value = taskId;
  completingTaskId.value = taskId;
  try {
    await completeTaskExecute({ data: { completed } });
    onSuccess?.();
  } finally {
    completingTaskId.value = null;
  }
};

  return {
    completeTaskLoading,
    completingTaskId,
    completeTaskById,
  };
});
