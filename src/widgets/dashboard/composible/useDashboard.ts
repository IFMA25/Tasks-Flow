import { computed, ref } from "vue";

import { useDashboardRequests } from "../api/useDashboardRequest";
import { todayDate, tomorrowDate, weekDate } from "../utils/dayDate";

import { useListsStore } from "@/features/todo/lists/store/useListsStore";


export function useDashboard() {
  const limit = ref(20);
  const { upcomingDeadlines } = useDashboardRequests();
  const listStore = useListsStore();

  console.log(todayDate);
  console.log(tomorrowDate);
  console.log(weekDate);

  const {
    execute: fetchTodayTasks,
    loading: fetchTodayTasksLoading,
    data: fetchTodayTasksData,
  } = upcomingDeadlines({
    params: {
      limit: limit.value,
      startDate: todayDate,
      endDate: tomorrowDate,
    },
  });

  const {
    execute: fetchUpcomingDeadlines,
    loading: fetchUpcomingDeadlinesLoading,
    data: fetchUpcomingDeadlinesData,
  } = upcomingDeadlines({
 params: { limit: limit.value, startDate: tomorrowDate, endDate: weekDate },
    // onSuccess: () => {
    //   console.log(fetchUpcomingDeadlinesData.value);
    // },
},
  );

  const completedTasks = computed(() => {
    return fetchTodayTasksData.value?.data.filter((task) => task.status === "done").length;
  });


  return {
    listStore,
    completedTasks,
    fetchTodayTasks,
    fetchUpcomingDeadlines,
    fetchTodayTasksLoading,
    fetchUpcomingDeadlinesLoading,
    fetchTodayTasksData,
    fetchUpcomingDeadlinesData,
  };
}
