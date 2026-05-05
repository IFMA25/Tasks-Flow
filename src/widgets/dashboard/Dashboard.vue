<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

import { useDashboardRequests } from "./api/useDashboardRequest";
import ListDeadlineTasks from "./components/ListDeadlineTasks.vue";
import ListWeaklyGoals from "./components/ListWeaklyGoals.vue";
import WeeklyGoalsModal from "./components/WeeklyGoalsModal.vue";
import { DashboardData } from "./types";

import { useListsStore } from "@/features/todo/lists/store/useListsStore";
import { getTodayDate, getTomorrowDate, getWeekDate } from "@/shared/utils/dayDate";

const limit = 5;

const modalMode = ref<"edit" | "add">("add");
const weeklyGoalsData = ref<DashboardData | null>(null);
const weeklyGoalsModalRef = useTemplateRef<InstanceType<typeof WeeklyGoalsModal>>("weeklyGoalsModal");

const { t } = useI18n();
const listStore = useListsStore();
const { getTasksWithDeadlines, getWeeklyGoal } = useDashboardRequests();

const {
  execute: tasksWithDeadlinesExecute,
  loading: todayLoading,
  data: todayData,
} = getTasksWithDeadlines({
  cache: "todayData",
  invalidateCache: ["todayData"],
  immediate: true,
  params: () => ({
    limit,
    startDate: getTodayDate(),
    endDate: getTomorrowDate(),
  }),
});

const {
  execute: updateUpcomingTasksExecute,
  loading: upcomingLoading,
  data: upcomingData,
} = getTasksWithDeadlines({
  cache: "upcomingData",
  invalidateCache: ["upcomingData"],
  immediate: true,
  params: () => ({
    limit,
    startDate: getTomorrowDate(),
    endDate: getWeekDate(),
  }),
});

const {
  execute: weeklyGoalsExecute,
  loading: weeklyGoalsLoading,
  data: responseWeeklyGoalsData,
} = getWeeklyGoal({
  cache: "weeklyGoalsData",
  invalidateCache: ["weeklyGoalsData"],
  immediate: true,
  onSuccess: () => {
    weeklyGoalsData.value = responseWeeklyGoalsData?.value;
  },
});

const listsDeadlineTasks = computed(() => ([
  {
    data: todayData,
    loading: todayLoading,
    titleList: t("dashboard.todayTasks"),
    subtitleList: todayData.value?.data.length
      ? t("dashboard.completedTasks", { totalTasks: todayData.value?.total })
      : t("dashboard.noTasks"),
    emptyText: t("dashboard.createNewTasks"),
    gridArea: "todayDeadlines",
  },
  {
    data: upcomingData,
    loading: upcomingLoading,
    titleList: t("dashboard.upcomingDeadlines"),
    subtitleList: upcomingData.value?.data.length
      ? t("dashboard.tasksAttention")
      : t("dashboard.noDeadlines"),
    emptyText: t("dashboard.tasksWithDeadlines"),
    gridArea: "upcomingDeadlines",
  },
]));

const handleOpenModal = async (mode: "edit" | "add") => {
  modalMode.value = mode;
  weeklyGoalsModalRef.value?.openModal();

  if (!listStore.dataLists?.data.length) {
    await listStore.fetchLists({ params: { isOwn: true } });
  }
};

const handleUpdateDashboard = async () => {
  await Promise.all([
    weeklyGoalsExecute(),
    tasksWithDeadlinesExecute(),
    updateUpcomingTasksExecute(),
  ]);
};
</script>

<template>
  <WeeklyGoalsModal
    ref="weeklyGoalsModal"
    :mode="modalMode"
    :weekly-goals-data="weeklyGoalsData"
    @update-weekly-goals="weeklyGoalsExecute"
  />
  <div
    class="grid gap-6 [grid-template-areas:'todayDeadlines_upcomingDeadlines'_'goals_goals']
           [grid-template-columns:2fr_50%]"
  >
    <ListDeadlineTasks
      v-for="value in listsDeadlineTasks"
      :key="value.gridArea"
      :data="value.data?.value"
      :title-list="value.titleList"
      :subtitle-list="value.subtitleList"
      :empty-text="value.emptyText"
      :loading="value.loading?.value"
      :class="`[grid-area:${value.gridArea}]`"
    />
    <ListWeaklyGoals
      :data="weeklyGoalsData"
      :loading="weeklyGoalsLoading"
      class="[grid-area:goals]"
      @open-modal="handleOpenModal"
      @update-dashboard="handleUpdateDashboard"
    />
  </div>
</template>
