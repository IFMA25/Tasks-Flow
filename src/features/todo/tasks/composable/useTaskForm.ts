import {
  computed,
  Ref,
} from "vue";

import {
  RequestBodyTaskData,
  TaskData,
} from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";
import { mapDueDateToISO } from "../utils";

export const useTaskForm = (
  listId: Ref<string>,
  selectedTask: Ref<TaskData | null>,
  formData: {
    taskName: Ref<string>;
    tags: Ref<string[]>;
    priority: Ref<string>;
    dueDate: Ref<string>;
  },
) => {

  const { createNewTask } = useTasksRequest();

  const tasksStore = useTasksStore();

  const submitData = computed<RequestBodyTaskData>(() => ({
    title: formData.taskName.value.trim(),
    tags: formData.tags.value ? formData.tags.value : [],
    priority: formData.priority.value || "medium",
    dueDate: mapDueDateToISO(formData.dueDate.value),
  // description: "",
  // longDescription: "",
  // status: "todo",
  // deadline: "",
  // isStarred: false,
  // isWeeklyGoal: false,
  // order: 1
  }));

  const { execute: createNewTaskExecute } = createNewTask(() => listId.value, {
    data: submitData,
    onSuccess: () => {
      tasksStore.fetchTasksForList(listId.value);
    },
  });

  // const { execute: updateSelectedTaskExecute, loading: updateTaskLoading } = updateTask(
  //   () => selectedTask.value?.id, {
  //     data: submitData,
  //     onSuccess: () => {
  //       formData.name.value = "";
  //       formData.color.value = colorsList[0];
  //       listsStore.fetchFilteredLists();
  //     },
  //   });

  // const isValid = computed(() => !!formData.name.value);

  // const isDataChanged = computed(() => {
  //   if (!selectedList.value) {
  //     return true;
  //   }

  //   const isNameChanged = formData.name.value !== selectedList.value.title;
  //   const isColorChanged = formData.color.value !== (selectedList.value.hexColor || colorsList[0]);
  //   return isNameChanged || isColorChanged;
  // });

  // const isSubmitDisabled = computed(() => !(isValid.value && isDataChanged.value));

  const handleSubmit = async () => {
    // if (isSubmitDisabled.value) return;

    try {
      if (selectedTask.value?.id) {
        // await updateSelectedTaskExecute();
      } else {
        await createNewTaskExecute();
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  // const isLoading = computed(() => createTaskLoading.value || updateTaskLoading.value);

  return {
    handleSubmit,
    // isSubmitDisabled,
    // isLoading,
  };
};
