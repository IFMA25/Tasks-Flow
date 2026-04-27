<script setup lang="ts">
import { format, parseISO } from "date-fns";
import * as echarts from "echarts";
import { onBeforeUnmount, ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

import { useAnalyticsRequests } from "../api/useAnaliticsRequests";
import { chartColors } from "../variable";
import EmptyStateAnalitics from "./EmptyStateAnalitics.vue";

import VButtonGroup from "@/shared/ui/common/VButtonGroup.vue";
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";
import { lastMonthDate, lastWeekDate, todayDate } from "@/shared/utils/dayDate";



const { t } = useI18n();

const countMaxSeries = 5;

const periodItems = computed(() => [
  { value: "week", label: t("analytics.week") },
  { value: "month", label: t("analytics.month") },
]);

const period = ref<string>(periodItems.value[0].value);
const chartRef = ref<HTMLDivElement | null>(null);

let chart: echarts.ECharts | null = null;

const { dailyActivity } = useAnalyticsRequests();

const { data, loading } = dailyActivity({
  immediate: true,
  params: () => ({
    startDate: period.value === "week" ? lastWeekDate() : lastMonthDate(),
    endDate: todayDate(),
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

const updateChart = () => {
  if (!chart) return;

  const option: echarts.EChartsOption = {
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
  };

  chart.setOption(option, true);
};

const handleResize = () => {
  if (!chart) {
    return;
  }

  chart.resize();
};

watch(
  [() => chartRef.value, () => data.value, () => legendLabels.value],
  ([el, dataValue]) => {
    if (!el) return;
    if (!dataValue || !dataValue.length) return;

    if (!chart) {
      chart = echarts.init(el);
      window.addEventListener("resize", handleResize);
    }

    updateChart();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  chart?.dispose();
  chart = null;
});
</script>

<template>
  <VTitle
    :text="$t('analytics.taskCompletion')"
    class="capitalize"
  />
  <div class="relative h-[19rem] bg-bgCards border border-surface rounded-2xl p-3 overflow-hidden">
    <VButtonGroup
      v-model="period"
      :group-items="periodItems"
      label="Time period"
      variant="charts"
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
    <div
      ref="chartRef"
      class="w-full h-[calc(100%-1rem)]"
    />
  </div>
</template>
