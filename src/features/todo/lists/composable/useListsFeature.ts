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

import { UserListGroup } from "../../types";
import { useListsStore } from "../store/useListsStore";

import { useSelectedOption } from "@/shared/composables/useSelectedOption";
import { Actions, SortOption } from "@/shared/types";
import { listsTabs } from "@/shared/variables/tabListsPage";

const currentLimit = 20;
const currentLimitUsers = 100;

export const useListsFeature = () => {

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const listsStore = useListsStore();

  const actions = computed<Actions[]>(() => [
    { key: "edit", label: t("lists.editList") }, 
    { key: "delete", label: t("deleteModal.title", { entityName: t("lists.list") }) }
  ]);

  const sortOptions = computed<SortOption[]>(() => [
    { key: "recentlyCreated", label: t("filters.recentlyCreated"), params: { sort: "createdAt", order: "asc" } }, 
    { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } }
  ]);

  const tabs = computed(() => [
    { value: "myLists", label: t("lists.myLists") }, 
    { value: "usersLists", label: t("lists.usersLists") }
  ]);

  const modelSearch = ref<string>("");
  const activeSortKey = ref<string>(sortOptions.value[0].key);

  const selectedSort = useSelectedOption<SortOption>(
    sortOptions,
    activeSortKey,
    (value) => {
      activeSortKey.value = String(value);
    }
  );

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

  const getFetchParams = computed(() => ({
    limit: activeTab.value === listsTabs.myLists ? currentLimit : currentLimitUsers,
    q: modelSearch.value || undefined,
    sort: selectedSort.value.params.sort,
    order: selectedSort.value.params.order,
    isOwn: activeTab.value === listsTabs.myLists ? true : undefined,
  }));

  const userLists = computed(() => {
    const data = listsStore.dataLists?.data;
    if (!data) return [];

    const grouped = new Map<string, UserListGroup>();

    for (const list of data) {
      const ownerId = list.owner.id;
      const group = grouped.get(ownerId);
      if (!group) {
        grouped.set(ownerId, { owner: list.owner, lists: [list] });
      } else {
        group.lists.push(list);
      }
    }
    return Array.from(grouped.values());
  });

  const updateLists = () => {
    listsStore.fetchLists({ params: getFetchParams });
  };
  
  const onSearchInput = useDebounceFn(() => {
    updateLists();
  }, 800);

  watch([() => route.query.tab, activeSortKey], updateLists, { immediate: true });

  return {
    listsStore,
    actions,
    sortOptions,
    tabs,
    modelSearch,
    selectedSort,
    activeTab,
    userLists,
    updateLists,
    onSearchInput,
  };
};
