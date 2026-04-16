import {
  useApiGet,
  UseApiOptions,
  useApiPatch,
} from "@ametie/vue-muza-use";
import { MaybeRefOrGetter, toValue } from "vue";

import { DashboardData } from "../types";

export const useDashboardRequests = () => {

  const getTasksWithDeadlines = (
    options?: UseApiOptions<DashboardData>,
  ) => {
    return useApiGet<DashboardData>(() => `/tasks/deadlines`, options);
  };

  const getWeeklyGoal = (
    options?: UseApiOptions<DashboardData>,
  ) => {
    return useApiGet<DashboardData>(() => `/tasks/weekly-goals`, options);
  };

  const updateWeeklyGoal = (
    taskId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<DashboardData>,
  ) => {
    return useApiPatch<DashboardData>(() => `/tasks/${toValue(taskId)}/toggle-weekly-goal`, options);
  };

  return { getTasksWithDeadlines, getWeeklyGoal, updateWeeklyGoal };
};
