<script setup lang="ts">
import { VueDatePicker } from "@vuepic/vue-datepicker";
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
import { parseTags } from "@/shared/utils";

const { t } = useI18n();

const priorityOptions = computed(() => [
  { key: "low", label: t("tasks.createTaskModal.select.low") },
  { key: "medium", label: t("tasks.createTaskModal.select.medium") },
  { key: "high", label: t("tasks.createTaskModal.select.high") },
]);

const { open: openModal, close } = useModal("taskFormModal");

const currentListId = ref("");
const selectedTask = ref<TaskData | null>(null);
const taskName = ref("");
const tags = ref("");
const priority = ref(priorityOptions.value[0]);
const deadline = ref(null);

const parsedTags = computed(() => parseTags(tags.value).slice(0, 3));

const formData = {
  taskName,
  tags,
  priority: computed(() => priority.value.key),
  dueDate: computed(() => deadline.value.key),
};

const taskForm = useTaskForm(currentListId, selectedTask, formData);

const resetForm = () => {
  selectedTask.value = null;
  taskName.value = "";
  tags.value = "";
  priority.value = priorityOptions.value[0];
  deadline.value = null;
  taskForm.resetValidation();
};

const open = (listId: string, task?: TaskData) => {
  currentListId.value = listId;
  selectedTask.value = task || null;

  taskName.value = task?.title || "";
  tags.value = task?.tags?.join(", ") || "";
  priority.value = priorityOptions.value
    .find(p => p.key === task?.priority) || priorityOptions.value[0];
  deadline.value = task?.dueDate || null;

  taskForm.resetValidation();

  openModal();
};

const onSubmit = async () => {
  const success = await taskForm.handleSubmit();
  if (success) {
    resetForm();
    close();
  }
};

defineExpose({ open });
</script>

<template>
  <VModal
    id="taskFormModal"
    :title="selectedTask ? t('tasks.editTask') : t('tasks.createTaskModal.title')"
    max-width="md"
    @close="close()"
  >
    <div class="flex flex-col gap-4 text-primary">
      <VInput
        v-model="taskName"
        :label="$t('tasks.createTaskModal.labelName')"
        :placeholder="$t('tasks.createTaskModal.placeholderTaskName')"
        class="leading-[1.2]"
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
      <div class="flex gap-2 items-center">
        <label class="text-primary font-medium">
          {{ $t('tasks.createTaskModal.labelDeadline') }}
        </label>
        <VueDatePicker
          v-model="deadline"
          :placeholder="$t('tasks.createTaskModal.placeholderDeadline')"
          centered
        />
      </div>
      <VInput
        v-model="tags"
        :label="$t('tasks.createTaskModal.labelTags')"
        :placeholder="$t('tasks.createTaskModal.placeholderTags')"
        :validation="taskForm.v$.value.tags"
        class="leading-[1.2]"
        @update:model-value="taskForm.v$.value.tags.$touch()"
      />
      <div
        v-if="parsedTags.length"
        class="flex flex-wrap gap-1.5"
      >
        <span
          v-for="tag in parsedTags"
          :key="tag"
          class="px-2 py-0.5 text-xs rounded-full bg-default text-primary"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
    <template #footer>
      <VButton
        type="text"
        :text="$t('cancel')"
        variant="outline"
        @click="close()"
      />
      <VButton
        :text="selectedTask ? t('saveBtnText') : t('tasks.createTaskModal.createBtn')"
        variant="outline"
        load-color="text-disabled"
        :disabled="taskForm.isSubmitDisabled.value"
        @click="onSubmit"
      />
    </template>
  </VModal>
</template>
