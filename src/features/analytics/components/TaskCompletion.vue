<script setup lang="ts">
import { format, parseISO } from "date-fns";
import * as echarts from "echarts";
import { onBeforeUnmount, ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

import type { DailyActivityResponse } from "../types";
import { chartColors } from "../variable";

import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";

const countMaxSeries = 5;

const { t } = useI18n();
const chartRef = ref<HTMLDivElement | null>(null);
let chart: echarts.ECharts | null = null;

const { data, loading } = defineProps<{
  data: DailyActivityResponse[] | null;
  loading: boolean;
}>();

const dates = computed(() =>
  (data ?? []).map((item: DailyActivityResponse) => item.date),
);

const createdSeries = computed(() =>
  (data ?? []).map((item: DailyActivityResponse) => item.created),
);

const completedSeries = computed(() =>
  (data ?? []).map((item: DailyActivityResponse) => item.completed),
);

const yMax = computed(() => {
  const all = [...createdSeries.value, ...completedSeries.value];

  if (!all.length) return countMaxSeries;

  const max = Math.max(...all);

  return max + 1;
});

const legendLabels = computed(() => [
  t("analytics.created"),
  t("analytics.completed"),
]);

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
  chart?.resize();
};

watch(
  [() => chartRef.value, () => data, () => legendLabels.value],
  ([el, data]) => {
    if (!el) return;
    if (!data || !data.length) return;

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
  <div class="h-[19rem] bg-bgCards border border-surface rounded-2xl">
    <div
      v-if="loading"
      class="flex flex-col gap-4"
    >
      <VSkeleton
        v-for="value in countMaxSeries"
        :key="value"
        width="w-full"
        height="h-[2.5rem]"
        rounded="md"
      />
    </div>
    <div
      v-else
      ref="chartRef"
      class="w-full h-full"
    />
  </div>
</template>
