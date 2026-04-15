<script setup lang="ts">
import { useRouter } from "vue-router";

import { DashboardData } from "../types";
import ItemDashboardList from "./ItemDashboardList.vue";

import { RouteNames } from "@/shared/types/routeNames";
import VButton from "@/shared/ui/common/VButton.vue";


const { titleList, data, subtitleList, emptyText } = defineProps<{
    data: DashboardData | null;
    titleList: string;
    subtitleList: string;
    emptyText: string;
}>();

const router = useRouter();
</script>

<template>
  <div
    class="max-h-[28rem] min-h-[13.75rem]
    overflow-x-hidden overflow-y-auto rounded-2xl border-2 border-surface py-4 px-6"
  >
    <div class="flex justify-between items-center mb-1">
      <h3 class="text-[2rem] leading-[1.2] font-semibold mb-2">
        {{ titleList }}
      </h3>

      <VButton
        v-if="data?.data.length"
        :text="$t('viewAll')"
        variant="dashboardNav"
        @click="router.push({name: RouteNames.lists})"
      />
    </div>
    <p class="text-sm text-secondary leading-[1.3] mb-4">
      {{ subtitleList }}
    </p>
    <ul v-if="data?.data.length">
      <ItemDashboardList
        v-for="task in data?.data"
        :key="task.id"
        :task="task"
      />
    </ul>
    <div
      v-else
      class="flex flex-col items-center"
    >
      <p class="text-[1.25rem] text-muted leading-[1.3] mb-4">
        {{ emptyText }}
      </p>
      <VButton
        :text="$t('dashboard.createFirstList')"
        variant="dashboardNav"
        icon="plus"
        @click="router.push({name: RouteNames.lists})"
      />
    </div>
  </div>
</template>
