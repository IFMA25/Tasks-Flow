import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useListsRequests } from "../api/useListsRequest";

export interface ListsQueryParams {
  limit?: number;
  q?: string;
  sort?: string;
  order?: string;
  isOwn?: boolean;
}

export const useListsStore = defineStore("lists", () => {
  const { getAllLists } = useListsRequests();

  const currentParams = ref<ListsQueryParams>({ limit: 20 });

  const {
    data: response,
    loading: isLoading,
    execute,
  } = getAllLists({
    params: () => currentParams.value,
  });

  const listsData = computed(() => response.value?.data || []);

  const fetchFilteredLists = async (newParams: Partial<typeof currentParams.value> = {}) => {
    currentParams.value = { ...currentParams.value, ...newParams };
    await execute();
  };

  return { listsData, fetchFilteredLists, isLoading };
});
