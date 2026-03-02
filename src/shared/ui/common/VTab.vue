<script setup lang="ts">

export type TabValue = string;

export interface TabItem {
  value: TabValue;
  label: string;
  disabled?: boolean;
}

const { tabItems, modelValue } = defineProps<{
  tabItems: TabItem[];
  modelValue: TabValue;
}>();

const emit = defineEmits(["update:modelValue"]);

const handleTabClick = (tab: TabItem) => {
  if (tab.disabled || modelValue === tab.value) return;

  emit("update:modelValue", tab.value);
};
</script>

<template>
  <div class="w-full">
    <div
      class="flex gap-2"
      role="tablist"
    >
      <button
        v-for="tab in tabItems"
        :key="tab.value"
        role="tab"
        :aria-selected="modelValue === tab.value"
        :disabled="tab.disabled"
        class="flex items-center py-3 px-4 text-sm font-medium leading-[1.2]
          transition-colors duration-200 focus:outline-none border-2 rounded-xl"
        :class="[
          modelValue === tab.value
            ? 'border-hover'
            : 'text-secondary hover:text-primary border-subtle',
          tab.disabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
        ]"
        @click="handleTabClick(tab)"
      >
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>
