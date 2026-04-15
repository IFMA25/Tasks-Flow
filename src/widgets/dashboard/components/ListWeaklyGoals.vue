<script setup lang="ts">
import { ref, useTemplateRef } from "vue";

import ItemDashboardList from "./ItemDashboardList.vue";
import { DashboardData } from "../types";
import WeeklyGoalsModal from "./WeeklyGoalsModal.vue";

import { useListsStore } from "@/features/todo/lists/store/useListsStore";
import VButton from "@/shared/ui/common/VButton.vue";

const modalMode = ref<"edit" | "add">("add");

const { data } = defineProps<{
    data: DashboardData | null;
}>();

const listStore = useListsStore();
const weeklyGoalsModalRef = useTemplateRef<InstanceType<typeof WeeklyGoalsModal>>("weeklyGoalsModal");

const handleOpenModal = async (mode: "edit" | "add") => {
  modalMode.value = mode;
  const res = await listStore.fetchLists();
  console.log(res);
  weeklyGoalsModalRef.value?.open();
};

</script>

<template>
  <div>
    <WeeklyGoalsModal
      ref="weeklyGoalsModal"
      :mode="modalMode"
    />

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
          @click="handleOpenModal('edit')"
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
          @click="handleOpenModal('add')"
        />
      </div>
    </div>
  </div>
</template>
