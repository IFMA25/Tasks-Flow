import { computed, Ref } from "vue";

import { ListData } from "../../types";
import { useListsRequests } from "../api/useListsRequest";
import { useListsStore } from "../store/useListsStore";

import { colorsList } from "@/shared/variables/colorMap";


export const useListForm = (
  selectedList: Ref<ListData | null>,
  formData: { name: Ref<string>; color: Ref<string> },
) => {

  const submitData = () => ({
    title: formData.name.value,
    hexColor: formData.color.value,
  });

  const { createNewList, updateList } = useListsRequests();
  const listsStore = useListsStore();

  const { execute: createNewListExecute, loading: createListLoading } = createNewList({
    data: submitData,
    onSuccess: () => {
      formData.name.value = "";
      formData.color.value = colorsList[0];
      listsStore.fetchLists();
    },
  });

  const { execute: updateSelectedListExecute, loading: updateListLoading } = updateList(
    () => selectedList.value?.id, {
      data: submitData,
      onSuccess: () => {
        formData.name.value = "";
        formData.color.value = colorsList[0];
        listsStore.fetchLists();
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
      if (selectedList.value?.id) {
        await updateSelectedListExecute();
      } else {
        await createNewListExecute();
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const isLoading = computed(() => createListLoading.value || updateListLoading.value);

  return {
    handleSubmit,
    isSubmitDisabled,
    isLoading,
  };
};
