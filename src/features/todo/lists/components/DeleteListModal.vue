<script setup lang="ts">
import { ref } from 'vue';

import { useModal } from '@/shared/composables/useModal';
import VButton from '@/shared/ui/common/VButton.vue';
import VModal from '@/shared/ui/common/VModal.vue';

import { ListData } from '../../types';
import { useListsRequests } from '../api/useListsRequest';
import { useListsFeature } from '../composable/useListsFeature';

const { open: openModal, close } = useModal("listDeleteModal");
const {updateLists} = useListsFeature();
const { deleteList } = useListsRequests();

const selectedList = ref<ListData | null>(null);

const open = (list: ListData) => {
  selectedList.value = list;
  openModal();
};

const { execute, loading } = deleteList(
  () => selectedList.value?.id,
  {
    onSuccess: () => {
      updateLists();
      close();
    },
  },
);

defineExpose({ open });
</script>

<template>
  <VModal
    id="listDeleteModal"
    :title="$t('lists.deleteList.title')"
    max-width="md"
  >
    <div class="flex flex-col gap-2 items-center mb-2">
      <p class="font-semibold">
        {{ $t('lists.deleteList.contentTitle') }}
      </p>
      <p class="font-bold text-intro">
        "{{ selectedList?.title }}"
      </p>
      <p class="text-xs">
        {{ $t('lists.deleteList.contentSubtitle') }}
      </p>
    </div>
    <template #footer>
      <VButton
        type="text"
        :text="$t('lists.cancel')"
        variant="outline"
        @click="close()"
      />
      <VButton
        :text="$t('lists.deleteList.title')"
        variant="danger"
        :loading="loading"
        load-color="text-disabled"
        @click="execute()"
      />
    </template>
  </VModal>
</template>
