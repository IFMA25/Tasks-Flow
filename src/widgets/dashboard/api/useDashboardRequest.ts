import {
  useApiGet,
  UseApiOptions,
} from "@ametie/vue-muza-use";

import { DashboardData } from "../types";

export const useDashboardRequests = () => {

  const upcomingDeadlines = (
    options?: UseApiOptions<DashboardData>,
  ) => {
    return useApiGet<DashboardData>(() => `/tasks/deadlines`, options);
  };

  return { upcomingDeadlines };
};
