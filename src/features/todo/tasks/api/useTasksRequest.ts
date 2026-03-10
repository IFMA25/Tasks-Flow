import {
  MaybeRefOrGetter,
  toValue,
} from 'vue';

import {
  useApiDelete,
  useApiGet,
  UseApiOptions,
  useApiPatch,
  useApiPost,
} from '@ametie/vue-muza-use';

import {
  RequestBodyTaskData,
  TasksResponse,
} from '../../types';

export const useTasksRequest = () => {
  const getAllTasks = (listId: MaybeRefOrGetter<string>, options?: UseApiOptions<TasksResponse>) => {
    return useApiGet(() => `tasks/lists/${toValue(listId)}`, {
      ...options,
    });
  };

  const updateTask = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse, RequestBodyTaskData>,
  ) => {
    return useApiPatch(() => `/lists/${toValue(listId)}`, options);
  };

  const createNewTask = (
    options?: UseApiOptions<TasksResponse, RequestBodyTaskData>,
  ) => {
    return useApiPost("/tasks", options);
  };

  const deleteTask = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<TasksResponse>,
  ) => {
    return useApiDelete(() => `/tasks/${toValue(listId)}`, options);
  };


  return { getAllTasks, updateTask, createNewTask, deleteTask };
};
