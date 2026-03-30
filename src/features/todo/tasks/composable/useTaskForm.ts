import { formatISO, parseISO } from "date-fns";
import { computed, Ref } from "vue";
import { useI18n } from "vue-i18n";

import { RequestBodyTaskData, TaskData, TaskFormState } from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";

export const useTaskForm = (
  listId: Ref<string>,
  selectedTask: Ref<TaskData | null>,
  formData: TaskFormState,
) => {
  const { t } = useI18n();
  const { createNewTask, updateTask } = useTasksRequest();
  const tasksStore = useTasksStore();

  const priorityOptions = computed(() => [
    { key: "low", label: t("tasks.createTaskModal.select.low") },
    { key: "medium", label: t("tasks.createTaskModal.select.medium") },
    { key: "high", label: t("tasks.createTaskModal.select.high") },
  ]);

  const initForm = (taskEdit: TaskData | null) => {
    selectedTask.value = taskEdit;
    Object.assign(formData, {
      taskName: taskEdit?.title ?? "",
      priority: taskEdit?.priority ?? priorityOptions.value[0].key,
      dueDate: taskEdit?.dueDate ? parseISO(taskEdit.dueDate) : null,
    });
  };

  const submitData = computed<RequestBodyTaskData>(() => ({
    title: formData.taskName,
    tags: formData.tags,
    priority: formData.priority,
    dueDate: formData.dueDate ? formatISO(formData.dueDate) : null,
  }));

  const { execute: createNewTaskExecute, loading: createNewTaskLoading } =
    createNewTask(() => listId.value, {
      data: submitData,
      onSuccess: () => tasksStore.fetchTasksForList(listId.value),
    });

  const { execute: updateSelectedTaskExecute, loading: updateTaskLoading } =
    updateTask(() => selectedTask.value?.id, {
      data: submitData,
      onSuccess: () => tasksStore.fetchTasksForList(listId.value),
    });

  const isDataChanged = computed(() => {
    if (!selectedTask.value) return true;
    const isNameChanged = formData.taskName !== selectedTask.value.title;
    const isTagsChanged =
      JSON.stringify([...formData.tags].sort()) !==
      JSON.stringify([...(selectedTask.value.tags ?? [])].sort());
    const isPriorityChanged = formData.priority !== (selectedTask.value.priority ?? "low");
    const initialDateISO = selectedTask.value.dueDate || null;
    const currentDateISO = formData.dueDate ? formatISO(formData.dueDate) : null;
    const isDeadlineChanged = currentDateISO !== initialDateISO;
    return isNameChanged || isTagsChanged || isPriorityChanged || isDeadlineChanged;
  });

  const isSubmitDisabled = computed(
    () => !formData.taskName.trim() || !isDataChanged.value,
  );

  const handleSubmit = async (close: () => void) => {
    if (!formData.taskName) return;
    if (selectedTask.value?.id) {
      await updateSelectedTaskExecute();
    } else {
      await createNewTaskExecute();
    }
    close();
  };

  const isLoading = computed(() => updateTaskLoading.value || createNewTaskLoading.value);

  return {
    isDataChanged,
    isSubmitDisabled,
    isLoading,
    priorityOptions,
    initForm,
    handleSubmit,
  };
};
