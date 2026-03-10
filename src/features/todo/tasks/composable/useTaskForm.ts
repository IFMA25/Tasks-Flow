import {
  computed,
  Ref,
} from 'vue';

import { colorsList } from '@/shared/variables/colorMap';

import { TaskData } from '../../types';
import { useTasksRequest } from '../api/useTasksRequest';
import { useTasksStore } from '../store/useTasksStore';

export const useListForm = (
  selectedTask: Ref<TaskData| null>,
  formData: { taskName: Ref<string>; tags: Ref<string> },
) => {

  const submitData = () => ({
    title: formData.taskName.value,
    tags: formData.tags.value.split(',').map(tag => tag.trim()).filter(Boolean),
    dueDate: "",
    priority: "low",
  });

  const { createNewTask, updateTask } = useTasksRequest();
  const tasksStore = useTasksStore();

  const { execute: createNewTaskExecute, loading: createTaskLoading } = createNewTask({
    data: submitData,
    onSuccess: () => {
      formData.taskName.value = "";
      formData.tags.value = "";
      tasksStore.fetchTasksForList(props.listId);
    },
  });

  const { execute: updateSelectedTaskExecute, loading: updateTaskLoading } = updateTask(
    () => selectedTask.value?.id, {
      data: submitData,
      onSuccess: () => {
        formData.name.value = "";
        formData.color.value = colorsList[0];
        listsStore.fetchFilteredLists();
      },
    });

  const isValid = computed(() => !!formData.name.value);

  const isDataChanged = computed(() => {
    if (!selectedList.value) {
      return true;
    }

    const isNameChanged = formData.name.value !== selectedList.value.title;
    const isColorChanged = formData.color.value !== (selectedList.value.hexColor || colorsList[0]);
    return isNameChanged || isColorChanged;
  });

  const isSubmitDisabled = computed(() => !(isValid.value && isDataChanged.value));

  const handleSubmit = async () => {
    if (isSubmitDisabled.value) return;

    try {
      if (selectedTask.value?.id) {
        await updateSelectedTaskExecute();
      } else {
        await createNewTaskExecute();
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const isLoading = computed(() => createTaskLoading.value || updateTaskLoading.value);

  return {
    handleSubmit,
    isSubmitDisabled,
    isLoading,
  };
};
