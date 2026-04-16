<script setup lang="ts">
import { computed, ref } from "vue";

import { useDashboardRequests } from "../api/useDashboardRequest";

import { useListsStore } from "@/features/todo/lists/store/useListsStore";
import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import VAccordion from "@/shared/ui/common/accordion/VAccordion.vue";
import VAccordionItem from "@/shared/ui/common/accordion/VAccordionItem.vue";

const maxGoals = 3;

const { mode = "add" } = defineProps<{
  mode?: "edit" | "add"
}>();

const emit = defineEmits(["save"]);

const selectedIds = ref<string[]>([]);
const isLoading = ref(false);

const { open, close } = useModal("weeklyGoalsModal");
const listStore = useListsStore();
const { updateWeeklyGoal } = useDashboardRequests();

const isDisabled = computed(() => {
  return selectedIds.value.length === maxGoals;
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
    try {
      await Promise.all(
        selectedIds.value.map(id => {
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

defineExpose({ open });
</script>

<template>
  <VModal
    id="weeklyGoalsModal"
    :title="mode === 'edit'
      ? $t('dashboard.weeklyGoalsModalTitleEdit')
      : $t('dashboard.weeklyGoalsModalTitleAdd')"
    :subtitle="$t('dashboard.weeklyGoalsModalSubtitle')"
  >
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
