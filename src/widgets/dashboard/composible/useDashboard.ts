import { computed, ref } from "vue";

import { useDashboardRequests } from "../api/useDashboardRequest";
import { todayDate, tomorrowDate, weekDate } from "../utils/dayDate";

export function useDashboard() {
  const limit = ref(20);
  const { getTasksWithDeadlines, getWeeklyGoal } = useDashboardRequests();

  const {
    execute: fetchTodayTasks,
    loading: fetchTodayTasksLoading,
    data: fetchTodayTasksData,
  } = getTasksWithDeadlines({
    immediate: true,
    params: {
      limit: limit.value,
      startDate: todayDate,
      endDate: tomorrowDate,
    },
  });

  const {
    execute: fetchUpcomingDeadlinesTasks,
    loading: upcomingDeadlinesTasksLoading,
    data: upcomingDeadlinesTasksData,
  } = getTasksWithDeadlines({
    immediate: true,
    params: { limit: limit.value, startDate: tomorrowDate, endDate: weekDate },
  });

  const {
    execute: fetchWeeklyGoalsTasks,
    loading: weeklyGoalsTasksLoading,
    data: weeklyGoalsTasksData,
  } = getWeeklyGoal(
    {
      immediate: true,
    },
  );

  const isLoading = computed(() => {
    return (
      fetchTodayTasksLoading.value ||
      upcomingDeadlinesTasksLoading.value ||
      weeklyGoalsTasksLoading.value
    );
  });

  return {
    fetchTodayTasks,
    fetchUpcomingDeadlinesTasks,
    fetchWeeklyGoalsTasks,
    fetchTodayTasksLoading,
    upcomingDeadlinesTasksLoading,
    fetchTodayTasksData,
    upcomingDeadlinesTasksData,
    weeklyGoalsTasksLoading,
    weeklyGoalsTasksData,
    isLoading,
  };
}
