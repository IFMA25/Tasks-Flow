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

export const useTasksRequest = () => {
  const getAllTasks = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse>) => {
    return useApiGet(() => `tasks/lists/${toValue(listId)}`, {
      ...options,
    });
  };

  const updateTask = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse, RequestBodyTaskData>,
  ) => {
    return useApiPatch(() => `/tasks/lists/${toValue(listId)}`, options);
  };

  const createNewTask = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse, RequestBodyTaskData>,
  ) => {
    return useApiPost(() => `/tasks/lists/${toValue(listId)}`, options);
  };

  const deleteTask = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse>,
  ) => {
    return useApiDelete(() => `/tasks/${toValue(listId)}`, options);
  };


  return { getAllTasks, updateTask, createNewTask, deleteTask };
};
