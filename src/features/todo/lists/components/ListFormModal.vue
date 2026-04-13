<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { FormDataList, ListData } from "../../types";
import { useListsRequests } from "../api/useListsRequest";
import { useListsFeature } from "../composable/useListsFeature";

import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VColorRadio from "@/shared/ui/common/VColorRadio.vue";
import VInput from "@/shared/ui/common/VInput.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import { colorsList } from "@/shared/variables/colorMap";

const formData = reactive<FormDataList>({
  title: "",
  hexColor: colorsList[0],
});

const selectedList = ref<ListData | null>(null);

const submitData = () => ({
  title: formData.title,
  hexColor: formData.hexColor,
});

const { t } = useI18n();
const { open, close } = useModal("listFormModal");
const { createNewList, updateList } = useListsRequests();
const { params, listsStore, ignoreUpdates, resetFilters } = useListsFeature();

const initForm = (listEdit: ListData | null) => {
  selectedList.value = listEdit;
  formData.title = listEdit?.title || "";
  formData.hexColor = listEdit?.hexColor || colorsList[0];
};

const { execute: createNewListExecute, loading: createListLoading } = createNewList({
  data: submitData,
  onSuccess: () => {
    ignoreUpdates(() => {
      console.log('ignore')
      resetFilters();
    });
    listsStore.fetchLists({ params: params.value });
    toast.success(t("lists.msgCreateSuccess"));
  },
});

const { execute: updateSelectedListExecute, loading: updateListLoading } = updateList(
  () => selectedList.value?.id, {
    data: submitData,
    onSuccess: () => {
      listsStore.fetchLists({ params: params.value });
      toast.success(t("lists.msgUpdateSuccess"));
    },
  });

const isDataChanged = computed(() => {
  if (!selectedList.value) return true;

  return formData.title !== selectedList.value.title ||
           formData.hexColor !== (selectedList.value.hexColor || colorsList[0]);
});

const isSubmitDisabled = computed(() => !formData.title || !isDataChanged.value);

const isLoading = computed(() => createListLoading.value || updateListLoading.value);

const handleSubmit = async () => {
  if (selectedList.value?.id) {
    await updateSelectedListExecute();
  } else {
    await createNewListExecute();
  }
  close();
};

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
      class="text-sm text-secondary font-medium leading-[1.2]"
      @submit.prevent="handleSubmit"
    >
      <VInput
        v-model="formData.title"
        :label="$t('lists.listFormModal.labelName')"
        :placeholder="$t('lists.createListModal.placeholder')"
        class="mb-4"
      />
      <p class="mb-2">
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
