<script setup lang="ts">
import { Category, Permission } from "../types";

import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import VSwitch from "@/shared/ui/common/VSwitch.vue";

const {
  categories,
  allPermissions,
  modelValue,
} = defineProps<{
  categories: Category[];
  allPermissions: Permission[] | null;
  modelValue: Record<string, boolean>;
  loading?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const permissionsForCategory  =
  (category: Category) =>
    allPermissions?.filter(p => category.value.includes(p.category));
</script>

<template>
  <div class="grid grid-cols-[max-content_max-content] gap-y-8 gap-x-32 ">
    <template v-if="loading">
      <div
        v-for="i in 4"
        :key="i"
        class="flex flex-col gap-4 w-[19.5rem]"
      >
        <VSkeleton
          height="h-6"
          width="w-2/3"
          rounded="md"
        />
        <div class="flex flex-col gap-4">
          <div
            v-for="j in (i === 4 ? 2 : 5)"
            :key="j"
            class="flex items-center justify-between"
          >
            <VSkeleton
              height="h-5"
              width="w-48"
            />
            <VSkeleton
              height="h-6"
              width="w-11"
              rounded="full"
            />
          </div>
        </div>
      </div>
    </template>
    <div
      v-for="category in categories"
      v-else
      :key="category.key"
      class="flex flex-col gap-4 w-[19.5rem]"
    >
      <h3 class="text-lg font-bold leading-tight">
        {{ category.label }}
      </h3>
      <VSwitch
        v-for="permission in permissionsForCategory(category)"
        :id="`permission-${permission.key}`"
        :key="permission.key"
        :model-value="modelValue[permission.value]"
        variant="default"
        :label="permission.description"
        :disabled="disabled"
        @update:model-value="(value) => {
          emit('update:modelValue', { ...modelValue, [permission.value]: value })
        }"
      />
    </div>
  </div>
</template>
