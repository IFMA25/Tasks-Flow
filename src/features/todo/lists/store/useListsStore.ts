import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useListsRequests } from "../api/useListsRequest";

export const useListsStore = defineStore("lists", () => {

  const selectedListId = ref<string>("");
  const fetchParams = ref<Record<string, unknown>>({});

  const { getAllLists, getListById } = useListsRequests();

  const {
    execute: fetchLists,
    loading: listsLoading,
    data: dataLists,
  } = getAllLists();

  const {
    execute: fetchSelectedList,
    loading: selectedListLoading,
    data: selectedList,
  } = getListById(selectedListId);

  const updateLists = (params?: Record<string, unknown>) => {
    if (params) fetchParams.value = params;
    return fetchLists({ params: fetchParams.value });
  };

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
    updateLists,
    selectedList,
    getSelectedListData,
    isLoading,
  };
});
