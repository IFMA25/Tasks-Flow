<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { SortOption } from "@/shared/types";
import VInput from "@/shared/ui/common/VInput.vue";
import VSelect from "@/shared/ui/common/VSelect.vue";


const { t } = useI18n();
defineProps<{
  activeTab: string;
  sortOptions?: SortOption[];
}>();

const search = defineModel<string>("search");
const sort = defineModel<SortOption>("sort");
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <VInput
      v-model="search"
      :placeholder="$t('search.placeholder')"
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
