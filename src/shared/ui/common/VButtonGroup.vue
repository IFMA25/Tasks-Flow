<script setup lang="ts">
import { computed } from "vue";


interface ButtonGroupItem {
  value: string | number;
  label: string;
  disabled?: boolean;
}


const {
  groupItems,
  label,
  variant = "main",
} = defineProps<{
  groupItems: ButtonGroupItem[],
  label: string,
  variant?: string
}>();


const variantStyles = computed(() => ({
  main: "border-hover py-3 px-4 text-sm",
  charts: "py-1 px-3 text-xs",
}));


const modelValue = defineModel<string | number>({ required: true });


const handleTabClick = (btn: ButtonGroupItem) => {
  if (btn.disabled || modelValue.value === btn.value) return;
  modelValue.value = btn.value;
};
</script>


<template>
  <div class="w-full">
    <div
      class="flex gap-2"
      role="group"
      :aria-label="label"
    >
      <button
        v-for="btn in groupItems"
        :key="btn.value"
        role="tab"
        :aria-selected="modelValue === btn.value"
        :disabled="btn.disabled"
        class="flex items-center font-medium leading-[1.2]
          transition-colors duration-200 focus:outline-none border-2 rounded-xl"
        :class="[
          variantStyles[variant],
          modelValue === btn.value
            ? ['border-hover', { 'bg-surface': variant === 'charts' }]
            : 'text-secondary hover:text-primary border-subtle',
          btn.disabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
        ]"
        @click="handleTabClick(btn)"
      >
        <span>{{ btn.label }}</span>
      </button>
    </div>
  </div>
</template>
