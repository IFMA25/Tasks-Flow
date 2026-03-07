import { Ref } from "vue";

import { ListData } from "../../types";
import { useListsRequests } from "../api/useListsRequest";

export const useDeleteList = (
  selectedList: Ref<ListData | null>,
  onSuccess: () => void,
) => {
  const { deleteList } = useListsRequests();

  const { execute: deleteListExecute, loading: deleteListLoading } = deleteList(
    () => selectedList.value?.id,
    { onSuccess },
  );

  return {
    deleteListExecute,
    deleteListLoading,
  };
};
