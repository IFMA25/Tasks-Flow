<script setup lang="ts">
import { format, parseISO } from "date-fns";
import * as echarts from "echarts";
import { onMounted, onBeforeUnmount, ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

import { useAnalyticsRequests } from "../api/useAnaliticsRequests";
import type { DailyActivityResponse } from "../types";

import VTitle from "@/shared/ui/common/VTitle.vue";
import { todayDate, lastWeekDate } from "@/shared/utils/dayDate";


const { t } = useI18n();
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const { dailyActivity } = useAnalyticsRequests();

const chartColors = {
  axisLine: "#323855",
  axisLabel: "#323855",
  splitLine: "#CBD5E1",
  series1: "#3B82F6",
  series2: "#10B981",
} as const;

const {
  data: dailyActivityData,
  // loading: dailyActivityLoading,
} = dailyActivity({
  immediate: true,
  params: {
    startDate: lastWeekDate,
    endDate: todayDate,
  },
});

const dates = computed(() =>
  (dailyActivityData.value ?? []).map((item: DailyActivityResponse) => item.date),
);

const createdSeries = computed(() =>
  (dailyActivityData.value ?? []).map((item: DailyActivityResponse) => item.created),
);

const completedSeries = computed(() =>
  (dailyActivityData.value ?? []).map((item: DailyActivityResponse) => item.completed),
);

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const yMax = computed(() => {
  const all = [...createdSeries.value, ...completedSeries.value];

  if (!all.length) return 5;

  const max = Math.max(...all);

  return max + 1;
});

const updateChart = () => {
  if (!chartInstance) return;

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
      data: [t("analytics.created"), t("analytics.completed")],
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

  chartInstance.setOption(option, true);
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

watch(dailyActivityData, updateChart);

const handleResize = () => {
  chartInstance?.resize();
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance?.dispose();
  chartInstance = null;
});
</script>

<template>
  <VTitle
    :text="$t('analytics.taskCompletion')"
    class="mb-4 capitalize"
  />
  <div
    ref="chartRef"
    class="w-full h-[400px] bg-base border border-surface rounded-2xl"
  />
</template>
