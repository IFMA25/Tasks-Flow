import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useListsRequests } from "../api/useListsRequest";

import { useProfileStore } from "@/shared/stores/useProfileStore";

export const useListsStore = defineStore("lists", () => {

  const selectedListId = ref<string>("");

  const { getAllLists, getListById } = useListsRequests();
  const profileStore = useProfileStore();

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

  const getSelectedListData = async (listId: string) => {
    selectedListId.value = listId;
    await fetchSelectedList();
  };

  const isLoading = computed(
    () => listsLoading.value || selectedListLoading.value,
  );

  const userOwnerLists = computed(() => {
    return dataLists.value?.data.filter((item) => item.owner.id === profileStore.profileData?.id);
  });

  return {
    dataLists,
    selectedList,
    isLoading,
    userOwnerLists,
    fetchLists,
    getSelectedListData,
  };
});
