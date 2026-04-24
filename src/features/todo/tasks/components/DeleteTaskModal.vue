<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import type { TaskData } from "../../types";

import { useModal } from "@/shared/composables/useModal";
import VConfirmDeleteModal from "@/shared/ui/VConfirmDeleteModal.vue";

const emit = defineEmits<{
  "confirm-delete": [];
}>();

const { t } = useI18n();
const { open, close } = useModal("taskDeleteModal");

const selectedTask = ref<TaskData | null>(null);

const itemName = computed(() => selectedTask.value?.title || "");

const openModal = (task: TaskData) => {
  selectedTask.value = task;
  open();
};

const handleConfirm = () => {
  emit("confirm-delete");
  close();
};

defineExpose({ openModal });
</script>

<template>
  <VConfirmDeleteModal
    id="taskDeleteModal"
    entity-name="task"
    :title="t('deleteModal.title')"
    :item-name="itemName"
    :loading="false"
    @confirm="handleConfirm"
  />
</template>
