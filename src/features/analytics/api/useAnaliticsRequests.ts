import { UseApiOptions, useApiGet } from "@ametie/vue-muza-use";

import { AnalyticsSummaryResponse, DailyActivityResponse, PopularTagsResponse, TasksByPriorityResponse } from "../types";

import { analyticsCacheKeys } from "@/shared/variables/cacheKey";

export const useAnalyticsRequests = () => {
  const analyticsSummary = (options?: UseApiOptions<AnalyticsSummaryResponse>) => {
    return useApiGet<AnalyticsSummaryResponse>("/analytics/summary", {
      cache: analyticsCacheKeys.summary,
      ...options,
    });
  };

  const popularTags = (options?: UseApiOptions<PopularTagsResponse[]>) => {
    return useApiGet<PopularTagsResponse[]>("/analytics/popular-tags", {
      cache: analyticsCacheKeys.popularTags,
      ...options,
    });
  };

  const tasksByPriority = (options?: UseApiOptions<TasksByPriorityResponse[]>) => {
    return useApiGet<TasksByPriorityResponse[]>("/analytics/tasks-by-priority", {
      cache: analyticsCacheKeys.tasksByPriority,
      ...options,
    });
  };

  const dailyActivity = (options?: UseApiOptions<DailyActivityResponse[]>) => {
    return useApiGet<DailyActivityResponse[]>("/analytics/daily-activity", {
      cache: analyticsCacheKeys.dailyActivity,
      ...options,
    });
  };

  return { analyticsSummary, popularTags, tasksByPriority, dailyActivity };
};
