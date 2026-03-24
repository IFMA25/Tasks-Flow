import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  computed,
  Ref,
} from "vue";
import { useI18n } from "vue-i18n";

import {
  RequestBodyTaskData,
  TaskData,
} from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";

import { createValidationRules, parseStringToArray } from "@/shared/utils";


interface FormData {
  taskName: Ref<string>;
  tags: Ref<string>;
  priority: Ref<string>;
  dueDate: Ref<string>;
}

export const useTaskForm = (
  listId: Ref<string>,
  selectedTask: Ref<TaskData | null>,
  formData: FormData,
) => {

  const { t } = useI18n();
  const rules = createValidationRules(t);

  const v$ = useVuelidate(
    {
      taskName: { required },
      tags: { maxTags: rules.maxTags(5) },
    },
    { taskName: formData.taskName, tags: formData.tags },
  );

  const { createNewTask, updateTask } = useTasksRequest();
  const tasksStore = useTasksStore();

  const submitData = computed<RequestBodyTaskData>(() => ({
    title: formData.taskName.value,
    tags: parseStringToArray(formData.tags?.value),
    priority: formData.priority.value,
    dueDate: formData.dueDate.value,
  }));

  const {
    execute: createNewTaskExecute,
    loading: createNewTaskLoading,
  }
    = createNewTask(() => listId.value, {
      data: submitData,
      onSuccess: () => {
        tasksStore.fetchTasksForList(listId.value);
      },
    });

  const { execute: updateSelectedTaskExecute, loading: updateTaskLoading } = updateTask(
    () => selectedTask.value?.id, {
      data: submitData,
      onSuccess: () => {
        tasksStore.fetchTasksForList(listId.value);
      },
    });

  const isDataChanged = computed(() => {
    if (!selectedTask.value) return true;

    const isNameChanged = formData.taskName.value !== selectedTask.value.title;
    const isTagsChanged = formData.tags.value !== (selectedTask.value.tags?.join(", ") || "");
    const isPriorityChanged = formData.priority.value !== (selectedTask.value.priority ?? "low");
    const isDeadlineChanged = formData.dueDate.value !== (selectedTask.value.deadline ?? "noDate");

    return isNameChanged || isTagsChanged || isPriorityChanged || isDeadlineChanged;
  });

  const isSubmitDisabled = computed(() => !isDataChanged.value || v$.value.$invalid);

  const handleSubmit = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return false;

    try {
      if (selectedTask.value?.id) {
        await updateSelectedTaskExecute();
      } else {
        await createNewTaskExecute();
      }
      return true;
    } catch {
      return false;
    }
  };

  const resetValidation = () => v$.value.$reset();

  const isLoading = computed(() => updateTaskLoading.value || createNewTaskLoading.value);

  return {
    v$,
    handleSubmit,
    isDataChanged,
    isSubmitDisabled,
    resetValidation,
    isLoading,
  };
};

