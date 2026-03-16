import { useDebounceFn } from "@vueuse/core";
import {
  computed,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import {
  useRoute,
  useRouter,
} from "vue-router";

import { ListData } from "../../types";
import { useListsStore } from "../store/useListsStore";

import { useSelectedOption } from "@/shared/composables/useSelectedOption";
import { SortOption } from "@/shared/types";


const currentLimit = ref<number>(20);
const currentLimitUsers = ref<number>(99);

export const useListsFeature = () => {
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const listsStore = useListsStore();

  const actions = computed(() => [{ key: "edit", label: t("lists.editList") }, { key: "delete", label: t("lists.deleteList.title") }]);

  const sortOptions = computed<SortOption[]>(() => [{ key: "recentlyCreated", label: t("filters.recentlyCreated"), params: { sort: "createdAt", order: "asc" } }, { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } }]);

  const tabs = computed(() => [{ value: "myLists", label: t("lists.myLists") }, { value: "usersLists", label: t("lists.usersLists") }]);

  const modelSearch = ref<string>("");
  const activeSortKey = ref<string>(sortOptions.value[0].key);

  const selectedSort = useSelectedOption<SortOption>(
    sortOptions,
    activeSortKey,
    (value) => {
      activeSortKey.value = String(value);
    },
    "key",
  );

  const activeTab = computed({
    get: () => {
      const tab = route.query.tab;
      return typeof tab === "string" ? tab : "myLists";
    },
    set: (value) => {
      modelSearch.value = "";
      router.replace({ query: { ...route.query, tab: value } });
    },
  });

  const getFetchParams = computed(() => ({
    limit: activeTab.value === "myLists" ? currentLimit.value : currentLimitUsers.value,
    q: modelSearch.value || undefined,
    sort: selectedSort.value.params.sort,
    order: selectedSort.value.params.order,
    isOwn: activeTab.value === "myLists" ? true : undefined,
  }));

  const updateLists = () => {
    listsStore.fetchLists({ params: getFetchParams });
  };

  const userLists = computed(() => {
    const data = listsStore.dataLists?.data;
    if (!data) return [];

    const grouped = new Map<string, { owner: ListData["owner"]; lists: ListData[] }>();

    for (const list of data) {
      const ownerId = list.owner.id;
      let group = grouped.get(ownerId);
      if (!group) {
        group = { owner: list.owner, lists: [] };
        grouped.set(ownerId, group);
      }
      group.lists.push(list);
    }
    return Array.from(grouped.values());
  });

  const onSearchInput = useDebounceFn(() => {
    updateLists();
  }, 800);

  watch(
    [() => route.query.tab, activeSortKey],
    () => {
      updateLists();
    },
    { immediate: true },
  );

  return {
    listsStore,
    actions,
    sortOptions,
    tabs,
    modelSearch,
    selectedSort,
    activeTab,
    userLists,
    onSearchInput,
  };
};
