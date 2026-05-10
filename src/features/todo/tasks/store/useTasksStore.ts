import { defineStore } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { useTasksRequest } from "../api/useTasksRequest";


export const useTasksStore = defineStore("tasks", () => {
  const selectedTaskId = ref<string | null>(null);
  const completingTaskId = ref<string | null>(null);
  const optimisticStatuses = ref<Record<string, boolean | undefined>>({});

  const { t } = useI18n();
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
  ) => {
    selectedTaskId.value = taskId;
    completingTaskId.value = taskId;

    try {
      await completeTaskExecute({ data: { completed } });
    } finally {
      completingTaskId.value = null;
    }
  };

  const handleStatusChange = async <T extends { id: string }>(
    task: T, value: boolean, callBack: () => void) => {
    const completed = value;
    optimisticStatuses.value[task.id] = completed;

    try {
      await completeTaskById(task.id, completed);
      callBack();
    } catch (e) {
      toast.error(t("tasks.msgUpdateError"));
      callBack();
    } finally {
      delete optimisticStatuses.value[task.id];
    }
  };

  return {
    completeTaskLoading,
    completingTaskId,
    optimisticStatuses,
    completeTaskById,
    handleStatusChange,
  };
});
