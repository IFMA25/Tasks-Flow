<script setup lang="ts">
import { invalidateCache } from "@ametie/vue-muza-use";
import { computed, ref, watch } from "vue";

import { useDashboardRequests } from "../api/useDashboardRequest";
import { DashboardData } from "../types";

import { useListsStore } from "@/features/todo/lists/store/useListsStore";
import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VAccordion from "@/shared/ui/common/accordion/VAccordion.vue";
import VAccordionItem from "@/shared/ui/common/accordion/VAccordionItem.vue";
import { dashboardCacheKeys } from "@/shared/variables/cacheKey";

const maxGoals = 3;

const { mode = "add", weeklyGoalsData  } = defineProps<{
  mode?: "edit" | "add";
  weeklyGoalsData: DashboardData | null;
}>();

const emit = defineEmits<{
  updateWeeklyGoals: [];
}>();

const selectedIds = ref<string[]>([]);
const openListIds = ref<string[]>([]);

const listStore = useListsStore();
const { open, close } = useModal("weeklyGoalsModal");
const { batchDashboard } = useDashboardRequests();

const tasksToAdd = computed(() =>
  selectedIds.value.filter(id => !originalSelectedIds.value.includes(id)),
);
const tasksToRemove = computed(() =>
  originalSelectedIds.value.filter(id => !selectedIds.value.includes(id)),
);

const originalSelectedIds = computed(() => {
  return weeklyGoalsData?.data.map(task => task.id) ?? [];
});

const tasksToUpdate = computed(() => {
    return [...tasksToAdd.value, ...tasksToRemove.value];
});

const isDisabled = computed(() => {
  if(mode === "add"){
    return selectedIds.value.length === 0 || selectedIds.value.length > maxGoals;
  };
  return selectedIds.value.length > maxGoals;
});

const { execute: batchUpdateWeeklyGoalsExecute, loading: batchLoading } = batchDashboard(
    () =>
      tasksToUpdate.value.map(id => ({
        url: `/tasks/${id}/toggle-weekly-goal`,
        method: "PATCH",
      })),
    {
      immediate: false,
      onFinish: () => {
        close();
        emit("updateWeeklyGoals");
      },
    },
  );

const handleSelectTask = (taskId: string, checked: boolean) => {
  if (checked) {
    selectedIds.value.push(taskId);
  } else {
    selectedIds.value = selectedIds.value.filter(id => id !== taskId);
  }
};

const handleSave = () => {
  if(!tasksToUpdate.value.length) return close();
  invalidateCache([...Object.values(dashboardCacheKeys)]);
  batchUpdateWeeklyGoalsExecute();
};

const listsWithTasks = computed(() => {
  return (listStore.dataLists?.data ?? []).filter(list => list.tasks?.length);
});

const computeOpenListIds = () => {
  openListIds.value = listsWithTasks.value
    .filter(list =>
      list.tasks?.some(task => selectedIds.value.includes(task.id)),
    )
    .map(list => list.id);
};

const openModal = () => {
  selectedIds.value = [...originalSelectedIds.value];
  computeOpenListIds();
  open();
};

watch(
  [() => listStore.dataLists?.data, selectedIds],
  () => computeOpenListIds(),
  { deep: true },
);

defineExpose({ openModal });
</script>

<template>
  <VModal
    id="weeklyGoalsModal"
  >
    <template #header>
      <div class="flex flex-col gap-2 w-full">
        <div class="flex items-center justify-between">
          <h3
            class="modal-title"
          >
            {{ mode === 'edit'
              ? $t('dashboard.weeklyGoalsModalTitleEdit')
              : $t('dashboard.weeklyGoalsModalTitleAdd')
            }}
          </h3>
          <p class="text-muted text-sm">
            {{ selectedIds.length }}/{{ maxGoals }} {{ $t('selected') }}
          </p>
        </div>
        <p
          class="text-sm text-muted leading-[1.1] mt-2"
        >
          {{ $t('dashboard.weeklyGoalsModalSubtitle') }}
        </p>
      </div>
    </template>
    <div v-if="listStore.isLoading">
      <div
        v-for="i in 6"
        :key="i"
        class="border-b border-default last:border-b-0 mb-2 px-4 py-3"
      >
        <VSkeleton
          width="w-full"
          height="h-[20px]"
        />
      </div>
    </div>
    <div v-else>
      <VAccordion
        v-slot="{ toggle, openItems }"
        v-model:open="openListIds"
        multiple
      >
        <VAccordionItem
          v-for="list in listsWithTasks"
          :id="list.id"
          :key="list.id"
          :toggle="toggle"
          :open-items="openItems"
        >
          <template #title>
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: list.hexColor }"
              />
              <span class="font-medium text-sm">{{ list.title }}</span>
            </div>
          </template>
          <VCheckbox
            v-for="task in list.tasks"
            :key="task.id"
            variant="default"
            :label="task.title"
            class="mb-2"
            :model-value="selectedIds.includes(task.id)"
            :disabled="selectedIds.length >= maxGoals && !selectedIds.includes(task.id)"
            @update:model-value="(value) => handleSelectTask(task.id, value)"
          />
        </VAccordionItem>
      </VAccordion>
    </div>
    <template #footer>
      <VButton
        :text="$t('cancel')"
        variant="outline"
        @click="close"
      />
      <VButton
        :text="$t('saveBtnText')"
        variant="primary"
        :loading="batchLoading"
        :disabled="isDisabled"
        @click="handleSave"
      />
    </template>
  </VModal>
</template>
