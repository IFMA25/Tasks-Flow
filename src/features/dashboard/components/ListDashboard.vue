<script setup lang="ts">
import { useRouter } from "vue-router";

import { DashboardData } from "../types";
import ItemDashboardList from "./ItemDashboardList.vue";

import { RouteNames } from "@/shared/types/routeNames";
import VButton from "@/shared/ui/common/VButton.vue";


const { titleList, data } = defineProps<{
    data: DashboardData | null;
    titleList: string;
    subtitleList: string;
}>();

const router = useRouter();
</script>

<template>
  <ul class="w-[50%] rounded-2xl border-2 border-surface p-8">
    <div class="flex justify-between items-center mb-1">
      <h3 class="text-[2rem] leading-[1.2] font-semibold">
        {{ titleList }}
      </h3>

      <VButton
        :text="$t('viewAll')"
        variant="nav"
        @click="router.push({name: RouteNames.lists})"
      />
    </div>
    <p class="text-sm text-secondary leading-[1.3] mb-4">
      {{ subtitleList }}
    </p>
    <ItemDashboardList
      v-for="task in data?.data"
      :key="task.id"
      :task="task"
    />
  </ul>
</template>
