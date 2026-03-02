import {
  useApiDelete,
  useApiGet,
  UseApiOptions,
  useApiPatch,
  useApiPost,
} from "@ametie/vue-muza-use";
import { MaybeRefOrGetter, toValue } from "vue";

import { ListData, ListsResponse, RequestBodyListData } from "../types";

export const useListsDataRequest = (options?: UseApiOptions<ListsResponse>) => {
  return useApiGet("/lists", {
    ...options,
  });
};

export const useUpdateList = (
  listId: MaybeRefOrGetter<string>,
  options?: UseApiOptions<ListData, RequestBodyListData>,
) => {
  return useApiPatch<ListData, RequestBodyListData>(() => `/lists/${toValue(listId)}`, options);
};


export const useCreateNewList = (
  options?: UseApiOptions<ListData, RequestBodyListData>,
) => {
  return useApiPost<ListData, RequestBodyListData>("/lists", options);
};

export const useDeleteList = (
  listId: MaybeRefOrGetter<string>,
  options?: UseApiOptions<ListData>,
) => {
  return useApiDelete<ListData>(() => `/lists/${toValue(listId)}`, options);
};
