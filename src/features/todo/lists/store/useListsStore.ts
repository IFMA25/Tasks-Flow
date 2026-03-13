import { defineStore } from 'pinia';

import { useListsRequests } from '../api/useListsRequest';

export const useListsStore = defineStore("lists", () => {

  const { getAllLists } = useListsRequests();

  const {
    execute: fetchLists,
    loading: isLoading,
    data: dataLists,
  } = getAllLists();

  return { dataLists, fetchLists, isLoading };
});
