import { watchIgnorable } from "@vueuse/core";
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { useListsStore } from "../store/useListsStore";

import { SortOption } from "@/shared/types";
import { listsTabs } from "@/shared/variables/tabListsPage";


const currentLimit = 20;
const currentLimitUsers = 100;
const defaultSort = "recentlyCreated";
const defaultFilters = { search: "", sort: defaultSort };

export const useListsFeature = () => {

  const filters = reactive({ ...defaultFilters });

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const listsStore = useListsStore();

  const sortOptions = computed<SortOption[]>(() => [{ key: "recentlyCreated", label: t("filters.recentlyCreated"), params: { sort: "createdAt", order: "asc" } }, { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } }]);

  const resetFilters = () => {
    Object.assign(filters, defaultFilters);
  };

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

  const { ignoreUpdates } = watchIgnorable(
    [activeTab, filters],
    () => {
      listsStore.fetchLists({ params: params.value });
    },
    { immediate: true, deep: true },
  );

  return {
    activeTab,
    userLists,
    params,
    filters,
    sortOptions,
    listsStore,
    ignoreUpdates,
    resetFilters,
  };
};

