<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useAnalyticsRequests } from "../api/useAnaliticsRequests";

import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";

const { t } = useI18n();
const { analyticsSummary } = useAnalyticsRequests();

const { data, loading } = analyticsSummary({
    immediate: true,
  });

const analiticsCards = computed(() => ([
    {
        title: t("analytics.completed"),
        data: data.value?.tasks.completed,
        color: "text-positive",
    },
    {
        title: t("analytics.active"),
        data: data.value?.tasks.todo,
        color: "text-muted",
    },
    {
        title: t("analytics.overdue"),
        data: data.value?.tasks.archived,
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
             border border-surface rounded-2xl bg-bgCards p-8"
    >
      <p class="text-sm leading-[1.2] font-medium text-secondary">
        {{ card.title }}
      </p>
      <VSkeleton
        v-if="loading"
        width="w-[50px]"
        height="h-[36px]"
      />
      <p
        v-else
        class="text-3xl leading-[1.2] font-semibold "
        :class="data?.tasks?.total > 0 ? card.color : 'text-disabled'"
      >
        {{ card.data || 0 }}
      </p>
    </div>
  </div>
</template>
