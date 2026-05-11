<script setup lang="ts">
import { invalidateCache } from "@ametie/vue-muza-use";
import type { EChartsOption } from "echarts";
import { computed, watch } from "vue";

import { useAnalyticsRequests } from "../api/useAnaliticsRequests";
import { chartColors, tagsAnalitics } from "../variable";
import EmptyStateAnalitics from "./EmptyStateAnalitics.vue";

import VButtonGroup from "@/shared/ui/common/VButtonGroup.vue";
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";
import { analyticsCacheKeys } from "@/shared/variables/cacheKey";

const countMaxSeries = 10;

const topCountItems = Object.entries(tagsAnalitics).map(
  ([key, label]) => ({
    value: Number(key),
    label,
  }),
);

const { topTag } = defineProps<{ topTag: number }>();
const emit = defineEmits<{ changeTopTag: [value: number] }>();


const { popularTags } = useAnalyticsRequests();

const { execute, data, loading } = popularTags({
  immediate: true,
  params: () => ({ limit: topTag }),
});

const categories = computed(() => data.value?.map(item => item.tag) ?? []);
const values = computed(() => data.value?.map(item => item.count) ?? []);

const option = computed<EChartsOption>(() => ({
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
}));

  const onCountTagChange = (value: number) => {
      emit("changeTopTag", value);
    };

  watch(() => topTag, () => {
    invalidateCache(analyticsCacheKeys.popularTags);
    execute();
  });
</script>

<template>
  <div class="flex flex-col gap-4">
    <VTitle
      :text="$t('analytics.tagsPopularity')"
      class="capitalize"
    />
    <div class="h-[19rem] bg-bgCards border border-borders rounded-2xl p-2 overflow-hidden">
      <VButtonGroup
        :group-items="topCountItems"
        :model-value="topTag"
        label="Top tags"
        variant="charts"
        @update:model-value="onCountTagChange"
      />
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center gap-2 p-4"
      >
        <VSkeleton
          v-for="value in countMaxSeries"
          :key="value"
          width="w-full"
          height="h-[1rem]"
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
  </div>
</template>
