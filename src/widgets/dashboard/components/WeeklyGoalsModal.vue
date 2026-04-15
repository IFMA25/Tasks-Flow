<script setup lang="ts">
import { useListsStore } from "@/features/todo/lists/store/useListsStore";
import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import VAccordion from "@/shared/ui/common/accordion/VAccordion.vue";
import VAccordionItem from "@/shared/ui/common/accordion/VAccordionItem.vue";

const { mode = "add" } = defineProps<{
  mode?: "edit" | "add"
}>();

const { open, close } = useModal("weeklyGoalsModal");
const listStore = useListsStore();

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
      />
    </template>
  </VModal>
</template>
