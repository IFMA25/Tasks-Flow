<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { PriorityOption, SortOption } from "@/shared/types";
import VSelect from "@/shared/ui/common/VSelect.vue";

const { options } = defineProps<{
  options: {
    priorityOptions: PriorityOption[];
    sortOptions: SortOption[];
  }
}>();

const { t } = useI18n();

const priority = defineModel<PriorityOption>("priority");
const sort = defineModel<SortOption>("sort");
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <VSelect
      id="priority-select"
      v-model="priority"
      :label-text="t('filters.priority')"
      :options="options.priorityOptions"
      label="label"
      track-by="key"
      :close-on-select="true"
      class="min-w-[13rem]"
    />
    <VSelect
      id="sort-select"
      v-model="sort"
      :label-text="t('filters.sort')"
      :options="options.sortOptions"
      label="label"
      track-by="key"
      :close-on-select="true"
      class="min-w-[13rem]"
    />
  </div>
</template>
