<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { RoleOption } from "@/shared/types";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VSelect from "@/shared/ui/common/VSelect.vue";
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";

const {
  roleOptions,
  allSelected=false,
} = defineProps<{
  roleOptions: RoleOption[];
  allSelected: boolean;
  loading?: boolean;
  disabled?: boolean;
}>();

const { t } = useI18n();

const role = defineModel<RoleOption | null>("role");

const emit = defineEmits<{
  "update:allSelected": [value: boolean];
}>();

const labelCheckbox = computed(() =>
  allSelected ? t("userInfo.clear") : t("userInfo.selectAll"),
);
</script>

<template>
  <div class="flex justify-between items-center ">
    <VSkeleton
      v-if="loading"
      height="h-10"
      width="w-32"
    />
    <VSelect
      v-else
      id="role-select"
      v-model="role"
      label-text="Role"
      :options="roleOptions"
      label="label"
      track-by="value"
      :close-on-select="true"
      class="min-w-[9.6rem]"
      :disabled="disabled"
    />
    <template v-if="loading">
      <div class="flex items-center gap-3 min-w-[20%]">
        <VSkeleton
          height="h-5"
          width="w-5"
          rounded="sm"
        />
        <VSkeleton
          height="h-5"
          width="w-40"
        />
      </div>
    </template>
    <div
      v-else
      class="w-[35%]"
    >
      <VCheckbox
        width="w-5"
        height="h-5"
        variant="default"
        :label="labelCheckbox"
        :disabled="disabled"
        :model-value="allSelected"
        @update:model-value="(value) => emit('update:allSelected', value)"
      />
    </div>
  </div>
</template>
