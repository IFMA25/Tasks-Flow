<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

import ListDeadlineTasks from "./components/ListDeadlineTasks.vue";
import ListWeaklyGoals from "./components/ListWeaklyGoals.vue";
import WeeklyGoalsModal from "./components/WeeklyGoalsModal.vue";
import { useDashboardStore } from "./store/useDashboardStore";

import { useListsStore } from "@/features/todo/lists/store/useListsStore";

const modalMode = ref<"edit" | "add">("add");

const weeklyGoalsModalRef = useTemplateRef<InstanceType<typeof WeeklyGoalsModal>>("weeklyGoalsModal");

const { t } = useI18n();
const listStore = useListsStore();
const dashboardStore = useDashboardStore();

const listsDeadlineTasks = computed(() => ([
  {
    data: dashboardStore.todayData,
    loading: dashboardStore.updateDashboardLoading,
    titleList: t("dashboard.todayTasks"),
    subtitleList: dashboardStore.todayData?.data.length
      ? t("dashboard.completedTasks", { totalTasks: dashboardStore.todayData?.total })
      : t("dashboard.noTasks"),
    emptyText: t("dashboard.createNewTasks"),
    gridArea: "todayDeadlines",
  },
  {
    data: dashboardStore.upcomingData,
    loading: dashboardStore.updateDashboardLoading,
    titleList: t("dashboard.upcomingDeadlines"),
    subtitleList: dashboardStore.upcomingData?.data.length
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
</script>

<template>
  <WeeklyGoalsModal
    ref="weeklyGoalsModal"
    :mode="modalMode"
    :weekly-goals-data="dashboardStore.weeklyGoalsData"
  />
  <div
    class="grid gap-6 [grid-template-areas:'todayDeadlines_upcomingDeadlines'_'goals_goals']
           [grid-template-columns:2fr_50%]"
  >
    <ListDeadlineTasks
      v-for="value in listsDeadlineTasks"
      :key="value.gridArea"
      :data="value.data"
      :title-list="value.titleList"
      :subtitle-list="value.subtitleList"
      :empty-text="value.emptyText"
      :loading="value.loading"
      :class="`[grid-area:${value.gridArea}]`"
    />
    <ListWeaklyGoals
      class="[grid-area:goals]"
      @open-modal="handleOpenModal"
    />
  </div>
</template>
