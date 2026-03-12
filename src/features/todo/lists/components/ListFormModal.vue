<script setup lang="ts">
import { ref } from "vue";

import { ListData } from "../../types";
import { useListForm } from "../composable/useListForm";

import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VColorRadio from "@/shared/ui/common/VColorRadio.vue";
import VInput from "@/shared/ui/common/VInput.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import { colorsList } from "@/shared/variables/colorMap";

const { open: openModal, close } = useModal("listFormModal");

const selectedList = ref<ListData | null>(null);
const name = ref("");
const selectedColor = ref(colorsList[0]);

const open = (list?: ListData) => {
  selectedList.value = list || null;
  name.value = list?.title || "";
  selectedColor.value = list?.hexColor || colorsList[0];

  openModal();
};

const listsForm = useListForm(selectedList, { name, color: selectedColor });

const onSubmit = async () => {
  const success = await listsForm.handleSubmit();
  if (success) {
    close();
  }
};

defineExpose({ open });
</script>

<template>
  <VModal
    id="listFormModal"
    :title="selectedList?.title
      ? $t('lists.listFormModal.title')
      : $t('lists.createListModal.title')"
    max-width="md"
    @close="close()"
  >
    <VInput
      v-model="name"
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
        v-model="selectedColor"
        :color="color"
      />
    </div>
    <template #footer>
      <VButton
        type="text"
        :text="$t('lists.cancel')"
        variant="outline"
        @click="close()"
      />
      <VButton
        :text="$t('lists.listFormModal.saveBtn')"
        variant="outline"
        :disabled="listsForm.isSubmitDisabled.value"
        :loading="listsForm.isLoading.value"
        load-color="text-disabled"
        @click="onSubmit"
      />
    </template>
  </VModal>
</template>
