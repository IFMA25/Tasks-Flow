<script setup lang="ts">
import { computed } from "vue";
import VIcon from "./VIcon.vue";

const modelValue = defineModel<boolean>({
  default: false,
});

const props = defineProps<{
  width: string
  height: string
  variant: string
  validation?: {
    error: boolean
    message: string
  }
  label?: string
  icon?: string
  iconSize?: string
  disabled?: boolean
  boxClass?: string | string[] 
}>();

const variantClass: Record<string, Record<string, string>> = {
  checked: {
    default: "border-primaryBg bg-primaryBg text-white",
  },
  notChecked: {
    default: "border-default",
  },
};

const checkboxClass = computed(() => {
  const sizeClass = `${props.width} ${props.height}`;
  
  const stateClass = modelValue.value
    ? variantClass.checked[props.variant] || variantClass.checked.default
    : variantClass.notChecked[props.variant] || variantClass.notChecked.default;

  const errorClass = props.validation?.error ? "border-danger" : "";
  const disabledClass = props.disabled ? "border-subtle bg-subtle" : "";

  return [sizeClass, stateClass, errorClass, disabledClass, props.boxClass];
});
</script>

<template>
  <label
    class="relative flex gap-3 select-none"
    :class="props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <div
      class="relative flex items-center justify-center border-2 rounded transition-colors duration-200 text-base"
      :class="checkboxClass"
    >
      <VIcon
        v-if="modelValue"
        type="check"
      />
    </div>
    <input
      v-model="modelValue"
      :disabled="props.disabled"
      type="checkbox"
      class="absolute opacity-0 pointer-events-none"
    >
    <slot name="label">
      <p
        v-if="props.label"
        class="inline-block leading-[1.3]"
      >
        {{ props.label }}
      </p>
      <p
        v-if="props.validation?.error"
        class="text-sm absolute top-[100%] left-0 text-danger font-medium"
      >
        {{ props.validation.message }}
      </p>
    </slot>
  </label>
</template>