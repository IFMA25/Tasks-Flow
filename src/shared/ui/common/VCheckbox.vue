<script setup lang="ts">
import { computed } from "vue";

import VIcon from "./VIcon.vue";

const modelValue = defineModel<boolean>({ default: false });

const {
  variant = "default",
  validation,
  label,
  disabled = false,
  boxClass,
} = defineProps<{
  variant?: "default" | "round";
  validation?: { error: boolean; message: string };
  label?: string;
  disabled?: boolean;
  boxClass?: string | string[];
}>();

const variantMap: Record<string, string> = {
  default: "rounded",
  round: "rounded-full",
};

const stateClass = computed(() => {
  if (disabled) return "border-subtle bg-subtle";
  if (validation?.error) return "border-danger";
  if (modelValue.value) return "border-primaryBg bg-primaryBg text-white";
  return "border-default hover:border-hover";
});

const checkboxClass = computed(() => [
  variantMap[variant],
  stateClass.value,
  boxClass,
]);
</script>

<template>
  <label
    class="relative flex items-center gap-2 leading-[1.3]"
    :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <div
      class="relative flex items-center justify-center
             w-5 h-5 border-2 transition-colors duration-200 text-base"
      :class="checkboxClass"
    >
      <VIcon
        v-if="modelValue"
        type="check"
      />
    </div>

    <input
      v-model="modelValue"
      :disabled="disabled"
      type="checkbox"
      class="absolute opacity-0 pointer-events-none"
    >

    <slot name="label">
      <p
        v-if="label"
        class="inline-block"
      >
        {{ label }}
      </p>
    </slot>

    <p
      v-if="validation?.error"
      class="text-sm absolute top-[100%] left-0 text-danger font-medium"
    >
      {{ validation.message }}
    </p>
  </label>
</template>
