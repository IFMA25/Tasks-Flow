<script setup lang="ts">
const modelValue = defineModel<string>();

defineProps<{
  color: string;
}>();
</script>

<template>
  <label class="relative flex items-center justify-center cursor-pointer p-1">
    <input
      v-model="modelValue"
      type="radio"
      :value="color"
      class="absolute opacity-0 pointer-events-none"
    >
    <div
      class="w-6 h-6 rounded-full transition-all duration-200"
      :class="{
        'ring-2 ring-offset-2': modelValue === color
      }"
      :style="{
        backgroundColor: color,
        '--tw-ring-color': color
      }"
    />
  </label>
</template>
