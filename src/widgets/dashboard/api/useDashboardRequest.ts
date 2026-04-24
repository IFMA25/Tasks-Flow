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

  const batchDashboard = (
    requests: MaybeRefOrGetter<(string | BatchRequestConfig)[]>,
    options?: UseApiBatchOptions<DashboardData>,
  ) => {
    return useApiBatch<DashboardData>(requests, {
      settled: true,
      // cache: "dashboard", - кеш на батче нельзя, оставить просто батч или делать отдельными запросами и кешировать? но кеш будет с swr? есть ли смысл?
      ...options,
    });
  };

  const updateWeeklyGoals = (
    options?: UseApiOptions<DashboardData>,
  ) => {
    return useApiGet<DashboardData>(() => `/tasks/weekly-goals`, {
      ...options,
    });
  };

  return { batchDashboard, updateWeeklyGoals };
};
