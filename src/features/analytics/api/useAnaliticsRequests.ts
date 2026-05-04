import { UseApiOptions, useApiGet } from "@ametie/vue-muza-use";

import { AnalyticsSummaryResponse, DailyActivityResponse, PopularTagsResponse, TasksByPriorityResponse } from "../types";

export const useAnalyticsRequests = () => {
  const analyticsSummary = (options?: UseApiOptions<AnalyticsSummaryResponse>) => {
    return useApiGet<AnalyticsSummaryResponse>("/analytics/summary", {
      cache: "analyticsSummary",
      ...options,
    });
  };

  const popularTags = (options?: UseApiOptions<PopularTagsResponse[]>) => {
    return useApiGet<PopularTagsResponse[]>("/analytics/popular-tags", {
      ...options,
    });
  };

  const tasksByPriority = (options?: UseApiOptions<TasksByPriorityResponse[]>) => {
    return useApiGet<TasksByPriorityResponse[]>("/analytics/tasks-by-priority", {
      cache: "tasksByPriority",
      ...options,
    });
  };

  const dailyActivity = (options?: UseApiOptions<DailyActivityResponse[]>) => {
    return useApiGet<DailyActivityResponse[]>("/analytics/daily-activity", {
      ...options,
    });
  };

  return { analyticsSummary, popularTags, tasksByPriority, dailyActivity };
};
