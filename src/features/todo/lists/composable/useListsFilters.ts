import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { SortOption } from "@/shared/types";

const modelSearch = ref<string>("");
const selectedSort = ref<string>("recentlyCreated");

export const useListsFilters = () => {
  const { t } = useI18n();

  const sortOptions = computed<SortOption[]>(() => [{ key: "recentlyCreated", label: t("filters.recentlyCreated"), params: { sort: "createdAt", order: "asc"  } }, { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } }]);

  const resetFilters = () => {
    modelSearch.value = "";
    selectedSort.value = "recentlyCreated";
  };

  return {
    modelSearch,
    selectedSort,
    sortOptions,
    resetFilters,
  };
};
