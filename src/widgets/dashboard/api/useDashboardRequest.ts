import {
  BatchRequestConfig,
  useApiBatch,
  UseApiBatchOptions,
  useApiGet,
  UseApiOptions,
} from "@ametie/vue-muza-use";
import { MaybeRefOrGetter } from "vue";

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

  const batchDashboard = (
    requests: MaybeRefOrGetter<(string | BatchRequestConfig)[]>,
    options?: UseApiBatchOptions<DashboardData>,
  ) => {
    return useApiBatch<DashboardData>(requests, {
      settled: true,
      ...options,
    });
  };

  return { getTasksWithDeadlines, getWeeklyGoal, batchDashboard };
};
