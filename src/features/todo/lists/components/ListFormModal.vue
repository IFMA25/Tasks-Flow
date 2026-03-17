<script setup lang="ts">
import { computed } from 'vue';

import VButton from '@/shared/ui/common/VButton.vue';
import VColorRadio from '@/shared/ui/common/VColorRadio.vue';
import VInput from '@/shared/ui/common/VInput.vue';
import VModal from '@/shared/ui/common/VModal.vue';
import { colorsList } from '@/shared/variables/colorMap';

import { useListForm } from '../composable/useListForm';

const {handleClose, selectedList, name, color, isLoading, isSubmitDisabled, handleSubmit} = useListForm();
// const test = computed(() => {
//   console.log("Computed", selectedList)
//   return selectedList
// })
</script>

<template>
  <VModal
    id="listFormModal"
    :title="selectedList
      ? $t('lists.listFormModal.title')
      : $t('lists.createListModal.title')"
    max-width="md"
    @close="handleClose"
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
        v-for="colorItem in colorsList"
        :key="colorItem"
        v-model="color"
        :color="colorItem"
      />
    </div>
    <template #footer>
      <VButton
        type="text"
        :text="$t('lists.cancel')"
        variant="outline"
        @click="handleClose"
      />
      {{ selectedList }}
      <VButton
        :text="selectedList ? $t('saveBtnText') : $t('lists.createListModal.createBtn')"
        variant="outline"
        :disabled="isSubmitDisabled"
        :loading="isLoading"
        load-color="text-disabled"
        @click="handleSubmit"
      />
    </template>
  </VModal>
</template>
