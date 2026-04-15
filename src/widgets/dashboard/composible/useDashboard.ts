import { ref } from "vue";

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
    params: { limit: limit.value, startDate: tomorrowDate, endDate: weekDate },
  });

  const {
    execute: fetchWeeklyGoalsTasks,
    loading: weeklyGoalsTasksLoading,
    data: weeklyGoalsTasksData,
  } = getWeeklyGoal();


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
  };
}
