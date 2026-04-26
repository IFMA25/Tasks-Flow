<script setup lang="ts">
import * as echarts from "echarts";
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { PopularTagsResponse } from "../types";
import { chartColors } from "../variable";

import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";

const countMaxSeries = 10;

const { data, loading } = defineProps<{
  data: PopularTagsResponse[] | null;
  loading: boolean;
}>();

const tagChartRef = ref<HTMLDivElement | null>(null);
let chart: echarts.ECharts | null = null;

const categories = computed(() => data?.map(item => item.tag));

const values = computed(() => data?.map(item => item.count));

const buildOption = (): echarts.EChartsOption => ({
  grid: {
    left: "3%",
    right: "3%",
    top: "8%",
    bottom: "8%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    min: 0,
    max: "dataMax",
    axisLine: { show: true, lineStyle: { color: chartColors.axisLine } },
    axisTick: { show: false },
    splitLine: {
      lineStyle: { color: chartColors.splitLine },
    },
    axisLabel: {
      color: chartColors.axisLabel,
    },
  },
  yAxis: {
    type: "category",
    data: categories.value,
    inverse: true,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: chartColors.axisLabel,
    },
  },
  series: [
    {
      type: "bar",
      data: values.value,
      barWidth: "60%",
      label: {
        show: true,
        position: "insideRight",
        color: "#ffffff",
      },
      itemStyle: {
        color: chartColors.series1,
        borderRadius: 8,
      },
      animationDuration: 600,
      animationEasing: "cubicOut",
    },
  ],
  animationDuration: 600,
  animationEasing: "cubicOut",
});

const handleResize = () => {
  chart?.resize();
};

watch(
  [() => tagChartRef.value, () => values.value],
  ([el, val]) => {
    if (!el) return;
    if (!val || !val.length) return;

    if (!chart) {
      chart = echarts.init(el);
      window.addEventListener("resize", handleResize);
    }

    chart.setOption(buildOption(), true);
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
  <div class="flex flex-col gap-4">
    <VTitle
      :text="$t('analytics.tagsPopularity')"
      class="capitalize"
    />
    <div class="h-[20rem] bg-bgCards border border-surface rounded-2xl">
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center gap-3 p-4"
      >
        <VSkeleton
          v-for="value in countMaxSeries"
          :key="value"
          width="w-full"
          height="h-[1rem]"
          rounded="md"
        />
      </div>
      <div
        v-else
        ref="tagChartRef"
        class="w-full h-full"
      />
    </div>
  </div>
</template>
