<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { AnalyticsSummaryResponse } from "../types";

import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";

const { t } = useI18n();

const { data, loading } = defineProps<{
  data: AnalyticsSummaryResponse | null;
  loading: boolean;
}>();

const analiticsCards = computed(() => ([
    {
        title: t("analytics.completed"),
        data: data?.tasks.completed,
        color: "text-positive",
    },
    {
        title: t("analytics.active"),
        data: data?.tasks.todo,
        color: "text-muted",
    },
    {
        title: t("analytics.overdue"),
        data: data?.tasks.archived,
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
        :class="card.color"
      >
        {{ card.data }}
      </p>
    </div>
  </div>
</template>
