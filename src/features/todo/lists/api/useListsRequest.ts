import {
  useApiDelete,
  useApiGet,
  UseApiOptions,
  useApiPatch,
  useApiPost,
} from "@ametie/vue-muza-use";
import { MaybeRefOrGetter, toValue } from "vue";

import { ListData, ListsResponse, RequestBodyListData } from "../../types";

export const useListsRequests = () => {
  const getAllLists = (options?: UseApiOptions<ListsResponse>) => {
    return useApiGet("/lists", {
      ...options,
    });
  };

  const updateList = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<ListData, RequestBodyListData>,
  ) => {
    return useApiPatch<ListData, RequestBodyListData>(() => `/lists/${toValue(listId)}`, options);
  };

  const getListById = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<ListData>,
  ) => {
    return useApiGet<ListData>(() => `/lists/${toValue(listId)}`, options);
  };

  const createNewList = (
    options?: UseApiOptions<ListData, RequestBodyListData>,
  ) => {
    return useApiPost<ListData, RequestBodyListData>("/lists", options);
  };

  const deleteList = (
    listId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<ListData>,
  ) => {
    return useApiDelete<ListData>(() => `/lists/${toValue(listId)}`, options);
  };

  return { getAllLists, updateList, createNewList, deleteList, getListById };
};
