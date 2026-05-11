<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useAnalyticsRequests } from "../api/useAnaliticsRequests";
import { chartColors } from "../variable";
import EmptyStateAnalitics from "./EmptyStateAnalitics.vue";

import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";

const pieColors = [chartColors.series1, chartColors.series2, chartColors.series3];

const priorityKeyMap: Record<string, string> = {
  low: "tasks.priority.low",
  medium: "tasks.priority.medium",
  high: "tasks.priority.high",
};

const { t } = useI18n();
const { tasksByPriority } = useAnalyticsRequests();

const { data, loading } = tasksByPriority({
    immediate: true,
  });

const pieData = computed(() =>
  (data.value || []).map(item => ({
    name: t(priorityKeyMap[item.priority] ?? item.priority),
    value: item.count,
  })),
);

const option = computed<EChartsOption>(() => ({
  color: pieColors,
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    textStyle: {
      color: chartColors.axisLabel,
    },
  },
  series: [
    {
      name: t("analytics.tasksByPriority"),
      type: "pie",
      radius: "60%",
      center: ["60%", "50%"],
      data: pieData.value,
      label: {
        color: chartColors.axisLabel,
      },
      labelLine: {
        smooth: true,
      },
      itemStyle: {
        borderRadius: 6,
        borderColor: "transparent",
        borderWidth: 2,
      },
      emphasis: {
        scale: true,
        scaleSize: 8,
        itemStyle: {
          shadowBlur: 12,
          shadowOffsetX: 0,
          shadowColor: "rgba(15, 23, 42, 0.25)",
        },
      },
      animationDuration: 600,
      animationEasing: "cubicOut",
    },
  ],
}));

</script>

<template>
  <div class="flex flex-col gap-4">
    <VTitle
      :text="$t('analytics.tasksByPriority')"
      class="capitalize"
    />
    <div
      class="flex flex-col items-center justify-center gap-4 h-[19rem]
      bg-bgCards border border-borders rounded-2xl"
    >
      <VSkeleton
        v-if="loading"
        width="w-[15rem]"
        height="h-[15rem]"
        rounded="full"
      />
      <EmptyStateAnalitics v-else-if="!loading && !data?.length" />
      <VChart
        v-else
        class="w-full h-full"
        :option="option"
        autoresize
      />
    </div>
  </div>
</template>
