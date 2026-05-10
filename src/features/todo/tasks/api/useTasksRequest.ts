import {
  useApiDelete,
  useApiGet,
  UseApiOptions,
  useApiPatch,
  useApiPost,
} from "@ametie/vue-muza-use";
import {
  MaybeRefOrGetter,
  toValue,
} from "vue";


import {
  RequestBodyTaskData,
  TasksResponse,
} from "../../types";

import { analyticsCacheKeys, dashboardCacheKeys } from "@/shared/variables/cacheKey";

export const useTasksRequest = () => {
  const getAllTasks = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse>) => {
    return useApiGet(() => `tasks/lists/${toValue(listId)}`, {
      ...options,
    });
  };

  const updateTask = (
    taskId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse, RequestBodyTaskData>,
  ) => {
    return useApiPatch(() => `/tasks/${toValue(taskId)}`, {
      invalidateCache: [...Object.values(dashboardCacheKeys), ...Object.values(analyticsCacheKeys)],
      ...options,
    });
  };

  const createNewTask = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse, RequestBodyTaskData>,
  ) => {
    return useApiPost(() => `/tasks/lists/${toValue(listId)}`, {
      ...options,
    });
  };

  const deleteTask = (
    taskId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse>,
  ) => {
    return useApiDelete(() => `/tasks/${toValue(taskId)}`, {
      ...options,
    });
  };

  const completeTask = (
    taskId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse>,
  ) => {
    return useApiPatch(() => `/tasks/${toValue(taskId)}/complete`, {
      ...options,
    });
  };

  return { getAllTasks, updateTask, createNewTask, deleteTask, completeTask };
};
