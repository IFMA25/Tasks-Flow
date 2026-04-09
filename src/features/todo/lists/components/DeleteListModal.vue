<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { ListData } from "../../types";
import { useListsRequests } from "../api/useListsRequest";
import { useListsFeature } from "../composable/useListsFeature";

import { useModal } from "@/shared/composables/useModal";
import VConfirmDeleteModal from "@/shared/ui/VConfirmDeleteModal.vue";

const { t } = useI18n();
const { open, close } = useModal("listDeleteModal");
const { deleteList } = useListsRequests();
const { params, listsStore } = useListsFeature();

const selectedList = ref<ListData | null>(null);

const openModal = (list: ListData) => {
  selectedList.value = list;
  open();
};

const { execute, loading } = deleteList(
  () => selectedList.value?.id,
  {
    onSuccess: () => {
      listsStore.fetchLists({ params: params.value });
      close();
      toast.warning(t("lists.msgDeleteSuccess"));
    },
  },
);

defineExpose({ openModal });
</script>

<template>
  <VConfirmDeleteModal
    id="listDeleteModal"
    entity-name="list"
    :item-name="selectedList?.title || ''"
    :loading="loading"
    @confirm="execute()"
  />
</template>
