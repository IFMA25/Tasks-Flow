<script setup lang="ts">
import { computed, ref } from "vue";

import { useDashboardRequests } from "../api/useDashboardRequest";
import { DashboardData } from "../types";

import { useListsStore } from "@/features/todo/lists/store/useListsStore";
import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import VAccordion from "@/shared/ui/common/accordion/VAccordion.vue";
import VAccordionItem from "@/shared/ui/common/accordion/VAccordionItem.vue";

const maxGoals = 3;

const { mode = "add", weeklyGoalsData  } = defineProps<{
  mode?: "edit" | "add";
  weeklyGoalsData: DashboardData | null;
}>();

const emit = defineEmits(["save"]);

const selectedIds = ref<string[]>([]);
const isLoading = ref(false);


const { open, close } = useModal("weeklyGoalsModal");
const listStore = useListsStore();
const { updateWeeklyGoal } = useDashboardRequests();

const isDisabled = computed(() => {
  if(mode === "add"){
    return selectedIds.value.length === 0 || selectedIds.value.length > maxGoals;
  };
  return selectedIds.value.length > maxGoals;
});

const originalSelectedIds = computed(() => {
  return weeklyGoalsData?.data.map(t => t.id) ?? [];
});

const handleSelectTask = (taskId: string, checked: boolean) => {
  if (checked) {
    selectedIds.value.push(taskId);
  } else {
    selectedIds.value = selectedIds.value.filter(id => id !== taskId);
  }
};

const handleSave = async () => {
    isLoading.value = true;
    const tasksToAdd = selectedIds.value.filter(id => !originalSelectedIds.value.includes(id));
    const tasksToRemove = originalSelectedIds.value.filter(id => !selectedIds.value.includes(id));

    const tasksToUpdate = [...tasksToAdd, ...tasksToRemove];

    if(!tasksToUpdate.length) {
      close();
      return;
    }

    try {
      await Promise.all(
        tasksToUpdate.map(id => {
          const { execute: fetchWeeklyGoal } = updateWeeklyGoal(id);
          return fetchWeeklyGoal();
        }),
      );
      emit("save");
      close();
    } finally {
      isLoading.value = false;
    }
};

const openModal = () => {
  selectedIds.value = [...originalSelectedIds.value];
  open();
};

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
          class="text-sm leading-[1.1] mt-2"
          :class="selectedIds.length > maxGoals ? 'text-danger' : 'text-secondary'"
        >
          {{ selectedIds.length > maxGoals
            ? $t('dashboard.weeklyGoalsModalSubtitleError')
            : $t('dashboard.weeklyGoalsModalSubtitle')
          }}
        </p>
      </div>
    </template>
    <VAccordion
      v-slot="{ toggle, openItems }"
      multiple
    >
      <VAccordionItem
        v-for="list in listStore.userOwnerLists"
        :id="list.id"
        :key="list.id"
        :title="list.title"
        :toggle="toggle"
        :open-items="openItems"
      >
        <VCheckbox
          v-for="task in list.tasks"
          :key="task.id"
          variant="default"
          :label="task.title"
          class="mb-2"
          :model-value="selectedIds.includes(task.id)"
          @update:model-value="(value) => handleSelectTask(task.id, value)"
        />
      </VAccordionItem>
    </VAccordion>
    <template #footer>
      <VButton
        :text="$t('cancel')"
        variant="outline"

        @click="close"
      />
      <VButton
        :text="$t('saveBtnText')"
        variant="primary"
        :loading="isLoading"
        :disabled="isDisabled"
        @click="handleSave"
      />
    </template>
  </VModal>
</template>
