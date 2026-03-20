<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { SortOption } from "@/shared/types";
import VInput from "@/shared/ui/common/VInput.vue";
import VSelect from "@/shared/ui/common/VSelect.vue";
import { listsTabs } from "@/shared/variables/tabListsPage";

const { t } = useI18n();
defineProps<{
  sortOptions: SortOption[];
  activeTab: string;
}>();

const search = defineModel<string>("search");
const sort = defineModel<SortOption>("sort");
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <VInput
      v-if="activeTab === listsTabs.myLists"
      v-model="search"
      :placeholder="t('lists.searchPlaceholder')"
      type="search"
      variant="search"
      icon-left="icon-search"
    />
    <VSelect
      id="sort-select"
      v-model="sort"
      :label-text="t('filters.sort')"
      :options="sortOptions"
      label="label"
      track-by="key"
      :close-on-select="true"
      class="min-w-[13rem]"
    />
  </div>
</template>
