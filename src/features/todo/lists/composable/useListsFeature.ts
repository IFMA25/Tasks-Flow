import { watchIgnorable } from "@vueuse/core";
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { useListsStore } from "../store/useListsStore";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import { SortOption, TaskActionConfig } from "@/shared/types";
import { listsTabs } from "@/shared/variables/tabListsPage";
import { usePermissionsRules } from "@/shared/composables/usePermissionsRules";

const currentLimit = 20;
const currentLimitUsers = 100;
const defaultSort = "recentlyCreated";
const defaultFilters = { search: "", sort: defaultSort };
const filters = reactive({ ...defaultFilters });

export const useListsFeature = () => {

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const listsStore = useListsStore();
  const profileStore = useProfileStore();

  const actionsConfig: TaskActionConfig[]= [
    {
      key: "edit", 
      label: t("lists.editList"),
      permission:"update:list",
    },
     {
        key: "delete",
        label: t("deleteModal.title", { entityName: t("lists.list") }),
        permission:"delete:list",
      },
  ];

  const { rowActions, hasPermission } = usePermissionsRules(actionsConfig)

  const canReadOwn = hasPermission("read:list");
  const canReadAll = hasPermission("read:all-lists");


  const sortOptions = computed<SortOption[]>(() => [{ key: "recentlyCreated", label: t("filters.recentlyCreated"), params: { sort: "createdAt", order: "asc" } }, { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } }]);

  const resetFilters = () => {
    Object.assign(filters, defaultFilters);
  };

  const activeTab = computed<string>({
    get: () => {
      const tabFromQuery = route.query.tab;
      const tab = typeof tabFromQuery === "string" ? tabFromQuery : undefined;

      if (canReadOwn && canReadAll) {
        return tab === listsTabs.usersLists ? listsTabs.usersLists : listsTabs.myLists;
      }
      if (canReadOwn) return listsTabs.myLists;
      if (canReadAll) return listsTabs.usersLists;
      return listsTabs.myLists;
    },
    set: (value) => {
      if (!(canReadOwn && canReadAll)) return;

      if (value === listsTabs.myLists) {
        router.replace({ query: { ...route.query, tab: undefined } });
      } else {
        router.replace({ query: { ...route.query, tab: listsTabs.usersLists } });
      }
    },
  });

  const initTabQuery = () => {
    if (canReadOwn && canReadAll) {
      return;
    }

    if (canReadOwn && !canReadAll) {
      if (route.query.tab) {
        router.replace({ query: { ...route.query, tab: undefined } });
      }
      return;
    }

    if (!canReadOwn && canReadAll) {
      if (route.query.tab !== listsTabs.usersLists) {
        router.replace({ query: { ...route.query, tab: listsTabs.usersLists } });
      }
    }
  };

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

  const handleRequest = (type: "create" | "update") => {
    if (type === "create") {
      ignoreUpdates(() => {
        resetFilters();
      });
    }
    listsStore.fetchLists({ params: params.value });
  };

  const { ignoreUpdates } = watchIgnorable(
    [activeTab, filters],
    () => {
      listsStore.fetchLists({ params: params.value });
    },
    { immediate: true, deep: true },
  );

  watch(
    [canReadOwn, canReadAll],
    () => initTabQuery(),
    { immediate: true },
  );

  return {
    activeTab,
    userLists,
    params,
    filters,
    sortOptions,
    listsStore,
    rowActions,
    hasPermission,
    ignoreUpdates,
    resetFilters,
    handleRequest,
  };
};

