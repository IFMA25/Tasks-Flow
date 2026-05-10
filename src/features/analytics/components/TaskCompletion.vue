<script setup lang="ts">
import { invalidateCache } from "@ametie/vue-muza-use";
import { format, parseISO } from "date-fns";
import type { EChartsOption } from "echarts";
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useAnalyticsRequests } from "../api/useAnaliticsRequests";
import { chartColors, periodAnalitics } from "../variable";
import EmptyStateAnalitics from "./EmptyStateAnalitics.vue";

import VButtonGroup from "@/shared/ui/common/VButtonGroup.vue";
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";
import { getLastMonthDate, getLastWeekDate, getTodayDate  } from "@/shared/utils/dayDate";
import { analyticsCacheKeys } from "@/shared/variables/cacheKey";

const countMaxSeries = 5;

const { period } = defineProps<{ period: string }>();
const emit = defineEmits<{ changePeriod: [value: string] }>();

const { t } = useI18n();
const { dailyActivity } = useAnalyticsRequests();

const periodItems = computed(() =>
  periodAnalitics.map((value) => ({
    value,
    label: t(`analytics.${value}`),
  })),
);

const { execute, data, loading } = dailyActivity({
  immediate: true,
  params: () => ({
    startDate: period === periodAnalitics[0] ? getLastWeekDate() : getLastMonthDate(),
    endDate: getTodayDate(),
  }),
});

const legendLabels = computed(() => [
  t("analytics.created"),
  t("analytics.completed"),
]);

const dates = computed(() =>
  (data.value ?? []).map((item) => item.date),
);

const createdSeries = computed(() =>
  (data.value ?? []).map((item) => item.created),
);

const completedSeries = computed(() =>
  (data.value ?? []).map((item) => item.completed),
);

const yMax = computed(() => {
  const all = [...createdSeries.value, ...completedSeries.value];

  if (!all.length) return countMaxSeries;

  const max = Math.max(...all);

  return max + 1;
});

const option = computed<EChartsOption>(() => ({
    grid: {
      left: "3%",
      right: "3%",
      top: 40,
      bottom: 30,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: legendLabels.value,
      top: 0,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dates.value,
      axisLine: { lineStyle: { color: chartColors.axisLine } },
      axisLabel: { color: chartColors.axisLabel,
        formatter: (value: string) => format(parseISO(value), "dd.MM") },

    },
    yAxis: {
      type: "value",
      min: 0,
      max: yMax.value,
      splitNumber: 5,
      axisLine: { show: false },
      axisLabel: { color: chartColors.axisLabel },
      splitLine: { lineStyle: { color: chartColors.splitLine } },
    },
    series: [
      {
        name: t("analytics.created"),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        itemStyle: { color: chartColors.series1 },
        lineStyle: { color: chartColors.series1, width: 2 },
        data: createdSeries.value,
      },
      {
        name: t("analytics.completed"),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        itemStyle: { color: chartColors.series2 },
        lineStyle: { color: chartColors.series2, width: 2 },
        data: completedSeries.value,
      },
    ],
  }));

  const onPeriodChange = (value: string) => {
    emit("changePeriod", value);
  };

  watch(() => period, () => {
    invalidateCache(analyticsCacheKeys.dailyActivity);
    execute();
  });
</script>

<template>
  <VTitle
    :text="$t('analytics.taskCompletion')"
    class="capitalize"
  />
  <div class="relative h-[19rem] bg-bgCards border border-surface rounded-2xl p-3 overflow-hidden">
    <VButtonGroup
      :group-items="periodItems"
      :model-value="period"
      label="Time period"
      variant="charts"
      @update:model-value="onPeriodChange"
    />
    <div
      v-if="loading"
      class="flex flex-col gap-4 mt-4"
    >
      <VSkeleton
        v-for="value in countMaxSeries"
        :key="value"
        width="w-full"
        height="h-[2rem]"
        rounded="md"
      />
    </div>
    <EmptyStateAnalitics v-else-if="!loading && !data?.length" />
    <VChart
      v-else
      class="w-full h-full"
      :option="option"
      autoresize
    />
  </div>
</template>
