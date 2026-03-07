<script setup lang="ts">

type TabValue = string;
interface TabItem {
  value: TabValue;
  label: string;
  disabled?: boolean;
}

const { tabItems } = defineProps<{ tabItems: TabItem[] }>();

const modelValue = defineModel<TabValue>({ required: true });

const handleTabClick = (tab: TabItem) => {
  if (tab.disabled || modelValue.value === tab.value) return;
  modelValue.value = tab.value;
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
