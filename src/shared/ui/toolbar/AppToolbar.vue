<script setup lang="ts">
import { useI18n } from "vue-i18n";

import {
  RoleOption,
  SortOption,
} from "@/shared/types";
import VInput from "@/shared/ui/common/VInput.vue";
import VSelect from "@/shared/ui/common/VSelect.vue";

const { t } = useI18n();
const { placeholderSearch } = defineProps<{
  placeholderSearch: string;
  roleOptions?: RoleOption[];
  sortOptions?: SortOption[];
}>();

const search = defineModel<string>("search");
const role = defineModel<RoleOption>("role");
const sort = defineModel<SortOption>("sort");
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <VInput
      v-model="search"
      :placeholder="placeholderSearch"
      type="search"
      variant="search"
      icon-left="icon-search"
    />
    <VSelect
      v-if="roleOptions"
      id="role-select"
      v-model="role"
      :label-text="t('filters.role')"
      :options="roleOptions"
      label="label"
      track-by="value"
      :close-on-select="true"
      class="min-w-[9.6rem]"
    />
    <VSelect
      v-if="sortOptions"
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
