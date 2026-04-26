import { computed } from "vue";

import { useAnalyticsRequests } from "../api/useAnaliticsRequests";

import { lastWeekDate, todayDate } from "@/shared/utils/dayDate";

export const useAnalyticsFeature = () => {

  const { analyticsSummary, dailyActivity, tasksByPriority,  popularTags } = useAnalyticsRequests();

  const { data: analyticsSummaryData, loading: analyticsSummaryLoading } = analyticsSummary({
    immediate: true,
  });

  const { data: dailyActivityData, loading: dailyActivityLoading } = dailyActivity({
    immediate: true,
    params: {
      startDate: lastWeekDate,
      endDate: todayDate,
    },
  });

  const { data: tagPopularityData, loading: tagPopularityLoading } = popularTags({
    immediate: true,
  });

  const { data: tasksPriorityData, loading: tasksPriorityLoading } = tasksByPriority({
    immediate: true,
  });

  const isLoading = computed(
    () =>
    analyticsSummaryLoading.value ||
    dailyActivityLoading.value ||
    tagPopularityLoading.value ||
    tasksPriorityLoading.value,
  );

  return {
    analyticsSummaryData,
    dailyActivityData,
    tagPopularityData,
    tasksPriorityData,
    isLoading,
  };
};
