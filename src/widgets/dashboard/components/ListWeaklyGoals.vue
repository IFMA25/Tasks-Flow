<script setup lang="ts">
import ItemDashboardList from "./ItemDashboardList.vue";
import { DashboardData } from "../types";

import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VModal from "@/shared/ui/common/VModal.vue";

const { data } = defineProps<{
    data: DashboardData | null;
}>();

const { open: openModal, close: closeModal } = useModal("weeklyGoalsModal");
// const listStore = useListsStore();
</script>

<template>
  <div>
    <VModal
      id="weeklyGoalsModal"
      :title="$t('dashboard.weeklyGoalsModalTitle')"
      :subtitle="$t('dashboard.weeklyGoalsModalSubtitle')"
    >
      <template #footer>
        <VButton
          :text="$t('cancel')"
          variant="outline"

          @click="closeModal"
        />
        <VButton
          :text="$t('saveBtnText')"
          variant="primary"
        />
      </template>
    </VModal>
    <div
      class="max-h-[28rem] min-h-[13.75rem]
    overflow-x-hidden overflow-y-auto rounded-2xl border-2 border-surface py-4 px-6"
    >
      <div class="flex justify-between items-center mb-1">
        <h3 class="text-[2rem] leading-[1.2] font-semibold mb-2">
          {{ $t('dashboard.weeklyGoalsTitle') }}
        </h3>

        <VButton
          v-if="data?.data.length"
          :text="$t('edit')"
          variant="dashboardNav"
          @click="openModal"
        />
      </div>
      <p class="text-sm text-secondary leading-[1.3] mb-4">
        {{ $t('dashboard.weeklyGoalsSubtitle') }}
      </p>
      <ul
        v-if="data?.data.length"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <ItemDashboardList
          v-for="task in data?.data"
          :key="task.id"
          :goals="true"
          :task="task"
        />
      </ul>
      <div
        v-else
        class="flex flex-col items-center"
      >
        <p class="text-[1.25rem] text-muted leading-[1.3] mb-4">
          {{ $t('dashboard.noGoals') }}
        </p>
        <VButton
          :text="$t('dashboard.createNewGoals')"
          variant="dashboardNav"
          icon="plus"
          @click="openModal"
        />
      </div>
    </div>
  </div>
</template>
