import { defineStore } from "pinia";
import { ref } from "vue";

import { useDashboardRequests } from "../api/useDashboardRequest";
import { DashboardData } from "../types";

import { todayDate, tomorrowDate, weekDate } from "@/shared/utils/dayDate";

export const useDashboardStore = defineStore("dashboard", () => {
  const limit = ref(20);
  const todayData = ref<DashboardData | null>(null);
  const upcomingData = ref<DashboardData | null>(null);
  const weeklyGoalsData = ref<DashboardData | null>(null);

  const {
    batchDashboard,
    updateWeeklyGoals,
  } = useDashboardRequests();

  const {
    execute: updateDashboardExecute,
    loading: updateDashboardLoading,
  } = batchDashboard(
    () => [
      `/tasks/deadlines?limit=${limit.value}&startDate=${todayDate}&endDate=${tomorrowDate}`,
      `/tasks/deadlines?limit=${limit.value}&startDate=${tomorrowDate}&endDate=${weekDate}`,
      `/tasks/weekly-goals`,
    ],
    {
      immediate: true,
      settled: true,
      onFinish: (results) => {
        todayData.value = results[0]?.data ?? todayData.value;
        upcomingData.value = results[1]?.data ?? upcomingData.value;
        weeklyGoalsData.value = results[2]?.data ?? weeklyGoalsData.value;
      },
    },
  );

  const {
    execute: updateWeeklyGoalsExecute,
     loading: updateWeeklyGoalsLoading,
     data: updateWeeklyGoalsData,
} = updateWeeklyGoals({
  lazy: true,
  onSuccess: () => {
    weeklyGoalsData.value = updateWeeklyGoalsData.value;
  },
});

  return {
    todayData,
    upcomingData,
    weeklyGoalsData,
    updateDashboardLoading,
    updateWeeklyGoalsLoading,
    updateWeeklyGoalsData,
    updateDashboardExecute,
    updateWeeklyGoalsExecute,
  };
});
