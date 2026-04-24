<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useAnalyticsRequests } from "../api/useAnaliticsRequests";

import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";


const { t } = useI18n();
const { analyticsSummary } = useAnalyticsRequests();

const { data: analyticsSummaryData, loading: analyticsSummaryLoading } = analyticsSummary({
    immediate: true,
    onSuccess: () => {
        console.log(analyticsSummaryData.value);
    },
});

const analiticsCards = computed(() => ([
    {
        title: t("analytics.completed"),
        data: analyticsSummaryData.value?.tasks.completed,
        color: "text-positive",
    },
    {
        title: t("analytics.active"),
        data: analyticsSummaryData.value?.tasks.todo,
        color: "text-muted",
    },
    {
        title: t("analytics.overdue"),
        data: analyticsSummaryData.value?.tasks.archived,
        color: "text-negative",
    },
]));
</script>

<template>
  <VTitle
    :text="$t('analytics.statusOverview')"
    class="capitalize"
  />
  <div class="flex gap-4">
    <div
      v-for="card in analiticsCards"
      :key="card.title"
      class="w-[300px] flex flex-col items-start gap-4
             border border-surface rounded-2xl bg-base p-8"
    >
      <p class="text-sm leading-[1.2] font-medium text-secondary">
        {{ card.title }}
      </p>
      <VSkeleton
        v-if="analyticsSummaryLoading"
        width="w-[50px]"
        height="h-[36px]"
      />
      <p
        v-else
        class="text-3xl leading-[1.2] font-semibold "
        :class="card.color"
      >
        {{ card.data }}
      </p>
    </div>
  </div>
</template>
