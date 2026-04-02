import { computed, watch } from "vue";
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

  const { filters, sortOptions } = useListsFilters();

  const activeTab = computed({
    get: () => {
      const tab = route.query.tab;
      return typeof tab === "string" ? tab : listsTabs.myLists;
    },
    set: (value) => {
      router.replace({ query: { ...route.query, tab: value } });
    },
  });

  const userLists = computed(() => {
    const data = listsStore.dataLists?.data;
    if (!data?.length) return [];

    const grouped = Object.groupBy(data, (list) => list.owner.id);
    return Object.values(grouped).map((lists) => ({
      owner: lists![0].owner,
      lists: lists!,
    }));
  });

  const params = computed(() => {
    const sort = sortOptions.value.find((o) => o.key === filters.sort);
    return {
      limit: activeTab.value === listsTabs.myLists ? currentLimit : currentLimitUsers,
      q: activeTab.value === listsTabs.myLists ? filters.search : undefined,
      sort: sort?.params.sort,
      order: sort?.params.order,
      isOwn: activeTab.value === listsTabs.myLists ? true : undefined,
    };
  });

  watch(
    [activeTab, filters],
    () => listsStore.fetchLists({ params: params.value }),
    { immediate: true },
  );

  return {
    activeTab,
    userLists,
    params,
    filters,
    sortOptions,
    listsStore,
  };
};
