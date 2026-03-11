<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import { useModal } from '@/shared/composables/useModal';
import VButton from '@/shared/ui/common/VButton.vue';
import VInput from '@/shared/ui/common/VInput.vue';
import VModal from '@/shared/ui/common/VModal.vue';
import VSelect from '@/shared/ui/common/VSelect.vue';

import { TaskData } from '../../types';
import { useTaskForm } from '../composable/useTaskForm';

const {listId} = defineProps<{
  listId: string;
}>();

const priorityOptions = computed(() => [ 
  { key: "low", label: t("tasks.createTaskModal.select.low") },
  { key: "medium", label: t("tasks.createTaskModal.select.medium") },
  { key: "high", label: t("tasks.createTaskModal.select.high") },
]);

const deadlineOptions = computed(() => [
  { key: "noDate", label: t("tasks.createTaskModal.select.noDeadline") },
  { key: "today", label: t("tasks.createTaskModal.select.today") },
  { key: "tomorrow", label: t("tasks.createTaskModal.select.tomorrow") },
  { key: "thisWeek", label: t("tasks.createTaskModal.select.thisWeek") },
  { key: "nextWeek", label: t("tasks.createTaskModal.select.nextWeek") },
]);


const { open: openModal, close } = useModal("taskFormModal");

const { t } = useI18n();

const taskName = ref("");
const tags = ref("");
const priority = ref<string>(priorityOptions[0].key);
const deadline = ref<string>(deadlineOptions[0].key);

  const formData = {

  }

const open = (task?: TaskData) => {
  taskName.value = task?.title || "";
  tags.value = task?.tags?.join(", ") || "";
  priority.value = task?.priority || priorityOptions[0].key;
  deadline.value = task?.deadline || deadlineOptions[0].key;
  

  openModal();
};

defineExpose({ open });

const listsForm = useTaskForm(listId, formData);

const onSubmit = async () => {
  const success = await listsForm.handleSubmit();
  if (success) {
    close();
  }
};
</script>

<template>
  <VModal
    id="taskFormModal"
    :title="t('tasks.createTaskModal.title')"
    max-width="md"
    @close="close()"
  >
    <VInput
      v-model="taskName"
      :label="$t('tasks.createTaskModal.labelName')"
      :placeholder="$t('tasks.taskFormModal.placeholderTaskName')"
      class="text-sm text-secondary font-medium leading-[1.2] mb-4"
    />
    <VSelect
      id="priority"
      :labelText="$t('tasks.createTaskModal.labelPriority')"
      :options="priorityOptions"

    />
    <VSelect
      id="due"
      :labelText="$t('tasks.createTaskModal.labelDeadline')"
      :options="deadlineOptions"
    />
     <VInput
      v-model="tags"
      :label="$t('tasks.createTaskModal.labelTags')"
      :placeholder="$t('tasks.taskFormModal.placeholderTags')"
      class="text-sm text-secondary font-medium leading-[1.2] mb-4"
    />
    <template #footer>
      <VButton
        type="text"
        :text="$t('lists.cancel')"
        variant="outline"
        @click="close()"
      />
      <VButton
        :text="$t('tasks.createTaskModal.createBtn')"
        variant="outline"
        :disabled="listsForm.isSubmitDisabled.value"
        :loading="listsForm.isLoading.value"
        load-color="text-disabled"
        @click="onSubmit"
      />
    </template>
  </VModal>
</template>
