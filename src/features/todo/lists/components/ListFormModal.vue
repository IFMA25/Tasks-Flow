<script setup lang="ts">
import { reactive, ref } from "vue";

import { FormDataList, ListData, ListsParams } from "../../types";
import { useListForm } from "../composable/useListForm";

import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VColorRadio from "@/shared/ui/common/VColorRadio.vue";
import VInput from "@/shared/ui/common/VInput.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import { colorsList } from "@/shared/variables/colorMap";

const { getParams } = defineProps<{ getParams: () => ListsParams | null }>();

const selectedList = ref<ListData | null>(null);
const formData = reactive<FormDataList>({
  title: "",
  hexColor: colorsList[0],
});

const { open, close } = useModal("listFormModal");
const {
  handleSubmit,
  isLoading,
  isSubmitDisabled,
  initForm,
} = useListForm(formData, selectedList, getParams);

const openModal = (list?: ListData) => {
  initForm(list ?? null);
  open();
};

defineExpose({ openModal });
</script>

<template>
  <VModal
    id="listFormModal"
    :title="selectedList
      ? $t('lists.listFormModal.title')
      : $t('lists.createListModal.title')"
    max-width="md"
  >
    <form
      id="listForm"
      @submit.prevent="handleSubmit(close)"
    >
      <VInput
        v-model="formData.title"
        :label="$t('lists.listFormModal.labelName')"
        :placeholder="$t('lists.createListModal.placeholder')"
        class="text-sm text-secondary font-medium leading-[1.2] mb-4"
      />
      <p class="text-sm text-secondary font-medium leading-[1.2] mb-2">
        {{ $t('lists.listFormModal.labelColor') }}
      </p>
      <div class="flex gap-4">
        <VColorRadio
          v-for="colorItem in colorsList"
          :key="colorItem"
          v-model="formData.hexColor"
          :color="colorItem"
        />
      </div>
    </form>
    <template #footer>
      <VButton
        type="text"
        :text="$t('cancel')"
        variant="outline"
        @click="close"
      />
      <VButton
        :text="selectedList ? $t('saveBtnText') : $t('lists.createListModal.createBtn')"
        type="submit"
        form="listForm"
        variant="outline"
        :disabled="isSubmitDisabled"
        :loading="isLoading"
        load-color="text-disabled"
      />
    </template>
  </VModal>
</template>
