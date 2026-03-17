import { defineStore } from 'pinia';

import { useListsRequests } from '../api/useListsRequest';

export const useListsStore = defineStore("lists", () => {

  const { getAllLists } = useListsRequests();

  const {
    execute: fetchLists,
    loading: isLoading,
    data: dataLists,
  } = getAllLists({
    onSuccess: () => {
      console.log(dataLists.value)
    }
  });

  return { dataLists, fetchLists, isLoading };
});
