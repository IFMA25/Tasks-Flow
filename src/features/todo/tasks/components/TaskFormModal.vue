<script setup lang="ts">
import { VueDatePicker } from "@vuepic/vue-datepicker";
import {
  computed,
  ref,
  reactive,
} from "vue";

import { TaskData } from "../../types";
import { useTaskForm } from "../composable/useTaskForm";

import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VInput from "@/shared/ui/common/VInput.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import VSelect from "@/shared/ui/common/VSelect.vue";

const { open: openModal, close: closeModal } = useModal("taskFormModal");

const currentListId = ref("");
const selectedTask = ref<TaskData | null>(null);
const tagInput = ref("");

const formFields = reactive({
  taskName: "",
  tags: [] as string[],
  priority: "",
  dueDate: null,
});

const taskForm = useTaskForm(currentListId, selectedTask, formFields);
const isTagLimitReached = computed(() => formFields.tags.length >= 5);

const open = (listId: string, task?: TaskData) => {
  currentListId.value = listId;
  taskForm.initForm(task ?? null);
  formFields.tags = task?.tags ?? [];
  tagInput.value = "";
  openModal();
};

const close = () => {
  selectedTask.value = null;
  taskForm.initForm(null);
  formFields.tags = [];
  tagInput.value = "";
  closeModal();
};

const onSubmit = async () => {
  const success = await taskForm.handleSubmit();
  if (success) {
    close();
  }
};

const handleTagKeydown = (e: KeyboardEvent) => {
  if (![" ", ",", ";"].includes(e.key)) return;
  e.preventDefault();
  if (isTagLimitReached.value) return;
  const val = tagInput.value.trim();
  if (val && !formFields.tags.includes(val)) {
    formFields.tags.push(val);
  }
  tagInput.value = "";
};

const removeTag = (tag: string) => {
  formFields.tags = formFields.tags.filter(t => t !== tag);
};

defineExpose({ open });
</script>

<template>
  <VModal
    id="taskFormModal"
    :title="selectedTask ? $t('tasks.editTask') : $t('tasks.createTaskModal.title')"
    max-width="md"
    @close="close()"
  >
    <div class="flex flex-col gap-4 text-primary">
      <VInput
        v-model="formFields.taskName"
        :label="`${$t('tasks.createTaskModal.labelName')} *`"
        :placeholder="$t('tasks.createTaskModal.placeholderTaskName')"
        class="leading-[1.2]"
      />
      <VSelect
        id="priority"
        v-model="formFields.priority"
        :label-text="$t('tasks.createTaskModal.labelPriority')"
        :options="taskForm.priorityOptions.value"
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
          v-model="formFields.dueDate"
          :placeholder="$t('tasks.createTaskModal.placeholderDeadline')"
          centered
          auto-apply
          :time-config="{ enableTimePicker: false }"
          :formats="{ input: 'dd.MM.yyyy' }"
        >
          <template #clock-icon />
        </VueDatePicker>
      </div>
      <VInput
        v-model="tagInput"
        :label="$t('tasks.createTaskModal.labelTags')"
        :placeholder="$t('tasks.createTaskModal.placeholderTags')"
        :readonly="isTagLimitReached"
        :support-text="isTagLimitReached 
          ? $t('validation.maxTags', { max: 5 }) 
          : `${formFields.tags.length}/5`"
        :support-text-variant="isTagLimitReached ? 'error' : 'muted'"
        @keydown="handleTagKeydown"
      />
      <div
        v-if="formFields.tags.length"
        class="flex flex-wrap gap-1.5"
      >
        <span
          v-for="tag in formFields.tags"
          :key="tag"
          class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-default text-primary"
        >
          #{{ tag }}
          <VButton
            type="button"
            icon="cross-filled"
            class="ml-1 hover:text-danger transition-colors leading-none"
            @click="removeTag(tag)"
          >
          </VButton>
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
        :text="selectedTask ? $t('saveBtnText') : $t('tasks.createTaskModal.createBtn')"
        variant="outline"
        load-color="text-disabled"
        :disabled="taskForm.isSubmitDisabled.value || taskForm.isLoading.value"
        @click="onSubmit"
      />
    </template>
  </VModal>
</template>
