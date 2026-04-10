import { useListsStore } from "@/features/todo/lists/store/useListsStore";
import { useDashboardRequests } from "../api/useDashboardRequest";
import { todayDate, tomorrowDate, weekDate } from "../utils/dayDate";

export function useDashboardFeature() {
  const { upcomingDeadlines } = useDashboardRequests();
  const listStore = useListsStore();

  const {
    execute: fetchTodayTasks, 
    loading: fetchTodayTasksLoading, 
    data: fetchTodayTasksData
  } = upcomingDeadlines({ params: {limit: 20, startDate: todayDate, endDate: tomorrowDate}});

  const {
    execute: fetchUpcomingDeadlines, 
    loading: fetchUpcomingDeadlinesLoading, 
    data: fetchUpcomingDeadlinesData
  } = upcomingDeadlines({ params: {limit: 20, startDate: tomorrowDate, endDate: weekDate}});


  

  return {
    listStore,
    fetchTodayTasks,
    fetchUpcomingDeadlines,
    fetchTodayTasksLoading,
    fetchUpcomingDeadlinesLoading,
    fetchTodayTasksData,
    fetchUpcomingDeadlinesData,
  };
}