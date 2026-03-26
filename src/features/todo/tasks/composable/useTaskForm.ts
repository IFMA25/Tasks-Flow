import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { formatISO, parseISO } from "date-fns";
import {
  computed,
  Ref,
} from "vue";
import { useI18n } from "vue-i18n";

import {
  RequestBodyTaskData,
  TaskData,
  TaskFormState,
} from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";

import { createValidationRules, parseStringToArray } from "@/shared/utils";

export const useTaskForm = (
  listId: Ref<string>,
  selectedTask: Ref<TaskData | null>,
  formData: TaskFormState,
) => {

  const priorityOptions = computed(() => [
    { key: "low", label: t("tasks.createTaskModal.select.low") },
    { key: "medium", label: t("tasks.createTaskModal.select.medium") },
    { key: "high", label: t("tasks.createTaskModal.select.high") },
  ]);

  const { t } = useI18n();
  const rules = createValidationRules(t);

  const v$ = useVuelidate(
    {
      taskName: { required },
      tags: { maxTags: rules.maxTags(5) },
    },
    formData,
  );

  const { createNewTask, updateTask } = useTasksRequest();
  const tasksStore = useTasksStore();

  const initForm = (taskEdit: TaskData | null) => {
    selectedTask.value = taskEdit;

    Object.assign(formData, {
      taskName: taskEdit?.title ?? "",
      tags: taskEdit?.tags?.join(", ") ?? "",
      priority: taskEdit?.priority ?? priorityOptions.value[0].key,
      dueDate: taskEdit?.dueDate ? parseISO(taskEdit.dueDate) : null,
    });

    v$.value.$reset();
  };

  const submitData = computed<RequestBodyTaskData>(() => ({
    title: formData.taskName,
    tags: parseStringToArray(formData.tags),
    priority: formData.priority,
    dueDate: formData.dueDate ? formatISO(formData.dueDate) : null,
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

    const isNameChanged = formData.taskName !== selectedTask.value.title;
    const isTagsChanged = formData.tags !== (selectedTask.value.tags?.join(", ") || "");
    const isPriorityChanged = formData.priority !== (selectedTask.value.priority ?? "low");

    const initialDateISO = selectedTask.value.dueDate || null;
    const currentDateISO = formData.dueDate ? formatISO(formData.dueDate) : null;
    const isDeadlineChanged = currentDateISO !== initialDateISO;

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
    isDataChanged,
    isSubmitDisabled,
    isLoading,
    priorityOptions,
    initForm,
    handleSubmit,
    resetValidation,
  };
};

