<script setup lang="ts">
import { useModal } from '@/shared/composables/useModal';
import VButton from '@/shared/ui/common/VButton.vue';
import VModal from '@/shared/ui/common/VModal.vue';

const { id, entityName, itemName, loading } = defineProps<{
  id: string;
  entityName: string;
  itemName: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  confirm: []
}>();

const { open, close } = useModal(id);

const handleConfirm = () => {
  emit('confirm');
};

defineExpose({ open, close });
</script>

<template>
  <VModal
    :id="id"
    :title="$t('deleteModal.title', { entityName: entityName })"
    max-width="md"
  >
    <div class="flex flex-col items-center gap-2 mb-2">
      <p class="font-semibold">{{ $t('deleteModal.contentTitle', { entityName: entityName }) }}</p>
      <p v-if="itemName" class="font-bold text-intro">"{{ itemName }}"</p>
      <p class="text-xs text-secondary">{{ $t('deleteModal.contentSubtitle') }}</p>
    </div>

    <template #footer>
      <VButton
        :text="$t('cancel')"
        variant="outline"
        :disabled="loading"
        @click="close"
      />
      <VButton
        :text="$t('deleteModal.title', { entityName: entityName })"
        variant="danger"
        :loading="loading"
        @click="handleConfirm"
      />
    </template>
  </VModal>
</template>
