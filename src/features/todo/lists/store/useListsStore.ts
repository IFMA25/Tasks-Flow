import { defineStore } from "pinia";
import { ref } from "vue";


import { useListsRequests } from "../api/useListsRequest";

export interface ListsParams {
  limit?: number;
  q?: string;
  sort?: string;
  order?: string;
  isOwn?: boolean;
}

export const useListsStore = defineStore("lists", () => {
  const listsData = ref([]);

  const { getAllLists } = useListsRequests();

  const currentParams = ref<ListsParams>({ limit: 20 });

  const {
    data,
    loading: isLoading,
    execute,
  } = getAllLists({
    params: () => currentParams.value,
    onSuccess: () => {
      listsData.value = data.value?.data || [];
    },
  });

  const fetchFilteredLists = async (newParams: Partial<typeof currentParams.value> = {}) => {
    currentParams.value = { ...currentParams.value, ...newParams };
    await execute();
  };

  return { listsData, fetchFilteredLists, isLoading };
});
