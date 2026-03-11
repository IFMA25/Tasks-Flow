<script setup lang="ts">
import {
  computed,
  ref,
} from "vue";
import { useI18n } from "vue-i18n";

import { TaskData } from "../../types";
import { useTaskForm } from "../composable/useTaskForm";

import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VInput from "@/shared/ui/common/VInput.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import VSelect from "@/shared/ui/common/VSelect.vue";


const { t } = useI18n();

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

const currentListId = ref("");
const selectedTask = ref<TaskData | null>(null);
const taskName = ref("");
const tags = ref("");
const priority = ref(priorityOptions.value[0]);
const deadline = ref(deadlineOptions.value[0]);

const formData = {
  taskName,
  tags: computed(() =>
    tags.value.split(",").map(tag => tag.trim()).filter(Boolean),
  ),
  priority: computed(() => priority.value.key),
  dueDate: computed(() => deadline.value.key),
};

const resetForm = () => {
  taskName.value = "";
  tags.value = "";
  priority.value = priorityOptions.value[0];
  deadline.value = deadlineOptions.value[0];
};

const open = (listId: string, task?: TaskData) => {
  currentListId.value = listId;
  selectedTask.value = task || null;
  console.log(listId);

  // // Предзаполняем форму, если это редактирование
  // taskName.value = task?.title || "";
  // tags.value = task?.tags;
  // priority.value = task?.priority || priorityOptions.value[0].key;
  // dueDate.value = task?.deadline || deadlineOptions.value[0].key;

  openModal();
};

defineExpose({ open });

const taskForm = useTaskForm(currentListId, selectedTask, formData);

const onSubmit = async () => {
  const success = await taskForm.handleSubmit();
  if (success) {
    resetForm();
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
      :placeholder="$t('tasks.createTaskModal.placeholderTaskName')"
      class="text-sm text-secondary font-medium leading-[1.2] mb-4"
    />
    <VSelect
      id="priority"
      v-model="priority"
      :label-text="$t('tasks.createTaskModal.labelPriority')"
      :options="priorityOptions"
      label="label"
      track-by="key"
      :close-on-select="true"
      class="min-w-[13rem]"
    />
    <VSelect
      id="due"
      v-model="deadline"
      :label-text="$t('tasks.createTaskModal.labelDeadline')"
      :options="deadlineOptions"
      label="label"
      track-by="key"
      :close-on-select="true"
      class="min-w-[13rem]"
    />
    <VInput
      v-model="tags"
      :label="$t('tasks.createTaskModal.labelTags')"
      :placeholder="$t('tasks.createTaskModal.placeholderTags')"
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
        load-color="text-disabled"
        @click="onSubmit"
      />
    </template>
  </VModal>
</template>
