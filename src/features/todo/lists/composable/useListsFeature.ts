import { watchDebounced } from "@vueuse/core";
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

  const { modelSearch, selectedSort, sortOptions } = useListsFilters();

  const activeTab = computed({
    get: () => {
      const tab = route.query.tab;
      return typeof tab === "string" ? tab : listsTabs.myLists;
    },
    set: (value) => {
      if (value !== activeTab.value) {
        modelSearch.value = "";
      }
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

  const currentSort = computed(
  () => sortOptions.value.find((o) => o.key === selectedSort.value) ?? sortOptions.value[0],
);

  const fetchMyLists = () => {
    listsStore.fetchLists({
      params: {
        limit: currentLimit,
        q: modelSearch.value || undefined,
        sort: currentSort.value.params.sort,
        order: currentSort.value.params.order,
        isOwn: true,
      },
    });
  };

  const fetchUsersLists = () => {
    listsStore.fetchLists({
      params: {
        limit: currentLimitUsers,
        sort: currentSort.value.params.sort,
        order: currentSort.value.params.order,
      },
    });
  };

  const refetchLists = () => {
    listsStore.resetListsData();
    if (activeTab.value === listsTabs.myLists) {
      fetchMyLists();
    } else {
      fetchUsersLists();
    }
  };

  watchDebounced(
  modelSearch,
  () => {
    if (activeTab.value !== listsTabs.myLists) return;
    listsStore.resetListsData();
    fetchMyLists();
  },
  { debounce: 400 },
);

  watch(
  [activeTab, selectedSort],
  () => {
    listsStore.resetListsData();
    if (activeTab.value === listsTabs.myLists) {
      fetchMyLists();
    } else {
      fetchUsersLists();
    }
  },
  { immediate: true },
);

  return {
    listsStore,
    modelSearch,
    activeTab,
    userLists,
    selectedSort,
    sortOptions,
    refetchLists,
  };
};
