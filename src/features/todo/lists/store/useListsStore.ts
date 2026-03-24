import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useListsRequests } from "../api/useListsRequest";

export const useListsStore = defineStore("lists", () => {
  const { getAllLists, getListById } = useListsRequests();

  const {
    execute: fetchLists,
    loading: listsLoading,
    data: dataLists,
  } = getAllLists();

  const selectedListId = ref<string>("");

  const {
    execute: fetchSelectedList,
    loading: selectedListLoading,
    data: selectedList,
  } = getListById(selectedListId);

  const getSelectedListData = async (listId: string) => {
    selectedListId.value = listId;
    await fetchSelectedList();
  };

  const isLoading = computed(
    () => listsLoading.value || selectedListLoading.value,
  );

  return {
    dataLists,
    fetchLists,
    selectedList,
    getSelectedListData,
    isLoading,
  };
});
