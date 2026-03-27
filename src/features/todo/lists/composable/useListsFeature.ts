import { watchDebounced } from "@vueuse/core";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useListsFilters } from "./useListsFilters";
import { useListsStore } from "../store/useListsStore";

import { listsTabs } from "@/shared/variables/tabListsPage";

const currentLimit = 20;
const currentLimitUsers = 100;

export const useListsFeature = () => {
  const route = useRoute();
  const router = useRouter();
  const listsStore = useListsStore();

  const { modelSearch, selectedSort, sortOptions, resetFilters } = useListsFilters();

  const activeTab = computed({
    get: () => {
      const tab = route.query.tab;
      return typeof tab === "string" ? tab : listsTabs.myLists;
    },
    set: (value) => {
      modelSearch.value = "";
      router.replace({ query: { ...route.query, tab: value } });
    },
  });

  const userLists = computed(() => {
    const data = listsStore.dataLists?.data;
    if (!data) return [];

    const grouped = Object.groupBy(data, (list: UserList) => list.owner.id);
    return Object.values(grouped).map((lists) => ({
      owner: lists![0].owner,
      lists: lists!,
    }));
  });

  const fetchParams = computed(() => {
    const sort = sortOptions.value.find((o) => o.key === selectedSort.value)!;
    return {
      limit: activeTab.value === listsTabs.myLists ? currentLimit : currentLimitUsers,
      q: modelSearch.value || undefined,
      sort: sort.params.sort,
      order: sort.params.order,
      isOwn: activeTab.value === listsTabs.myLists ? true : undefined,
    };
  });

  watchDebounced(
    fetchParams,
    (params) => listsStore.updateLists(params),
    { debounce: 300, immediate: true },
  );

  return {
    listsStore,
    modelSearch,
    activeTab,
    userLists,
    selectedSort,
    sortOptions,
    resetFilters,
  };
};
