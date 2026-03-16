import {
  computed,
  ref,
} from "vue";
import { useI18n } from "vue-i18n";

import { useTasksStore } from "../store/useTasksStore";

import { useSelectedOption } from "@/shared/composables/useSelectedOption";
import { SortOption } from "@/shared/types";

// const currentLimit = ref<number>(20);
// const currentLimitUsers = ref<number>(99);

export const useTasksFeature = () => {
  const { t } = useI18n();
  const tasksStore = useTasksStore();

  const sortOptions = computed<SortOption[]>(() => [{ key: "recentlyAdded", label: t("filters.recentlyAdded"), params: { sort: "createdAt", order: "asc" } }, { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } }]);

  // const filteredPriority = computed(() => [
  //   { value: "all", label: t("filters.all") },
  //   { value: "high", label: t("filters.high") },
  //   { value: "medium", label: t("filters.medium") },
  //   { value: "low", label: t("filters.low") },
  // ]);

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
  return {
    tasksStore,
    sortOptions,
    modelSearch,
    selectedSort,

  };
};
