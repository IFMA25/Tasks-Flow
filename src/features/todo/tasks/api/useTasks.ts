import {
  useApiGet,
  UseApiOptions,
} from "@ametie/vue-muza-use";
import { MaybeRefOrGetter, toValue } from "vue";

import { TaskData } from "../../types";

export const useTasks = () => {
  const getAllTasks = (listId: MaybeRefOrGetter<string>, options?: UseApiOptions<TaskData>) => {
    return useApiGet<TaskData>(() => `tasks/lists/${toValue(listId)}`, {
      ...options,
    });
  };

  return { getAllTasks };
};
