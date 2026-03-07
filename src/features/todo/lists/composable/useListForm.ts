import { Ref } from "vue";

import { ListData } from "../../types";
import { useListsRequests } from "../api/useListsRequest";


export const useListForm = (
  selectedList: Ref<ListData | null>,
  formData: { name: Ref<string>; color: Ref<string> },
  onSuccess: () => void,
) => {
  const submitData = () => ({
    title: formData.name.value,
    hexColor: formData.color.value,
  });

  const { createNewList, updateList } = useListsRequests();

  const { execute: createNewListExecute, loading: createListLoading } = createNewList({
    data: submitData,
    onSuccess,
  });

  const { execute: updateSelectedListExecute, loading: updateListLoading } = updateList(
    () => selectedList.value?.id,
    { data: submitData, onSuccess },
  );

  const handleSubmit = () => {
    if (selectedList.value?.id) {
      updateSelectedListExecute();
    } else {
      createNewListExecute();
    }
  };

  return {
    handleSubmit,
    createListLoading,
    updateListLoading,
  };
};
