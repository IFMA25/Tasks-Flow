<script setup lang="ts">
import { computed } from "vue";

import { ListData } from "../../types";

import { colorsList } from "@/shared/variables/colorMap";
import VButton from "@/shared/ui/common/VButton.vue";
import VColorRadio from "@/shared/ui/common/VColorRadio.vue";
import VInput from "@/shared/ui/common/VInput.vue";
import VModal from "@/shared/ui/modal/VModal.vue";


const { selectedListData, loading } = defineProps<{
  loading: boolean;
  selectedListData?: ListData | null;
}>();

const editListName = defineModel<string>("name");
const editListColor = defineModel<string>("color");

const emit = defineEmits(["saveChanges", "close"]);

const isDataChanged = computed(() => {
  if (!selectedListData){
    return editListName.value !== "";
  };

  const isNameChanged = editListName.value !== selectedListData.title;
  const isColorChanged = editListColor.value !== (selectedListData.hexColor || colorsList[0]);
  return isNameChanged || isColorChanged;
});

</script>

<template>
  <VModal
    id="listFormModal"
    :title="selectedListData ? $t('lists.listFormModal.title') : $t('lists.createListModal.title')"
    max-width="md"
    @close="emit('close')"
  >
    <template #default>
      <VInput
        v-model="editListName"
        :label="$t('lists.listFormModal.labelName')"
        :placeholder="$t('lists.createListModal.placeholder')"
        class="text-sm text-secondary font-medium leading-[1.2] mb-4"
      />
      <p class="text-sm text-secondary font-medium leading-[1.2] mb-2">
        {{ $t('lists.listFormModal.labelColor') }}
      </p>
      <div class="flex gap-4">
        <VColorRadio
          v-for="color in colorsList"
          :key="color"
          v-model="editListColor"
          :color="color"
        />
      </div>
    </template>
    <template #footer>
      <VButton
        type="text"
        :text="$t('lists.cancel')"
        variant="outline"
        @click="emit('close')"
      />
      <VButton
        :text="$t('lists.listFormModal.saveBtn')"
        variant="outline"
        :disabled="!isDataChanged"
        :loading="loading"
        load-color="text-disabled"
        @click="emit('saveChanges')"
      />
    </template>
  </VModal>
</template>
