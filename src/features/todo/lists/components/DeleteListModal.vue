<script setup lang="ts">
import { ListData } from "../../types";

import VButton from "@/shared/ui/common/VButton.vue";
import VModal from "@/shared/ui/modal/VModal.vue";

const emit = defineEmits(["confirmDelete", "close"]);

const { selectedListData, loading } = defineProps<{
  loading: boolean;
  selectedListData: ListData | null;
}>();
</script>

<template>
  <VModal
    id="listDeleteModal"
    :title="$t('lists.deleteList.title')"
    max-width="md"
    @close="emit('close')"
  >
    <template #default>
      <div class="flex flex-col gap-2 items-center mb-2">
        <p class="font-semibold">
          {{ $t('lists.deleteList.contentTitle') }}
        </p>
        <p class="font-bold text-intro">
          "{{ selectedListData?.title }}"
        </p>
        <p class="text-xs">
          {{ $t('lists.deleteList.contentSubtitle') }}
        </p>
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
        :text="$t('lists.deleteList.title')"
        variant="danger"
        :loading="loading"
        load-color="text-disabled"
        @click="emit('confirmDelete')"
      />
    </template>
  </VModal>
</template>
