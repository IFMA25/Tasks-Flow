import {
  useApiGet,
  UseApiOptions,
} from "@ametie/vue-muza-use";

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

  return { getTasksWithDeadlines, getWeeklyGoal };
};
