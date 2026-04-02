import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

import { SortOption } from "@/shared/types";

const defaultSort = "recentlyCreated";
const defaultFilters = { search: "", sort: defaultSort };

const filters = reactive({ ...defaultFilters });

export const useListsFilters = () => {
  const { t } = useI18n();

  const sortOptions = computed<SortOption[]>(() => [{ key: "recentlyCreated", label: t("filters.recentlyCreated"), params: { sort: "createdAt", order: "asc" } }, { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } }]);

  const resetFilters = () => {
    Object.assign(filters, defaultFilters);
  };

  return {
    filters,
    sortOptions,
    resetFilters,
  };
};
