<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { PriorityOption, SortOption } from "@/shared/types";
import VSelect from "@/shared/ui/common/VSelect.vue";

const { priorityOptions, sortOptions } = defineProps<{
  priorityOptions: PriorityOption[];
  sortOptions: SortOption[];
}>();

const { t } = useI18n();

const priority = defineModel<string>("priority");
const sort = defineModel<string>("sort");
</script>

<template>
  <div class="flex items-center gap-5">
    <VSelect
      id="priority-select"
      v-model="priority"
      :label-text="t('filters.priority')"
      :options="priorityOptions"
      label="label"
      track-by="key"
      :close-on-select="true"
      class="min-w-[13rem]"
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
