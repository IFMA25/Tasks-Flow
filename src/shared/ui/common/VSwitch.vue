<script setup lang="ts">
import { computed , useId } from "vue";

import VIcon from "./VIcon.vue";

const modelValue = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    variant: string;
    label?: string;
    icon?: string;
    id?: string;
    disabled?: boolean;
  }>(),
  {
    variant: "",
    label: "",
    icon: "",
    id: "",
    disabled: false,
  },
);

const inputId = useId();

const variantStyles = computed(() => {
  const isChecked = modelValue.value;
  const defaultBaseThumb = "w-5 h-5 shadow-sm";
  const defaultBaseSwitch = "w-11 h-6 border transition-colors";

  let defaultThumbColor = isChecked ? "bg-elevated" : "bg-toggle";
  let defaultSwitchColor = isChecked
    ? "bg-primaryText border-primaryBg"
    : "bg-default border-toggle";

  if (props.disabled) {
    defaultThumbColor = "bg-subtle";
    defaultSwitchColor = "bg-elevated border-subtle";
  }

  const themeBaseThumb = "w-7 h-7 bg-thumb";
  const themeBaseSwitch = "w-[3.75rem] h-9 bg-switch bg-cover bg-center border-2 border-themeSwitch";

  return {
    default: {
      thumb: `${defaultBaseThumb} ${defaultThumbColor}`,
      switch: `${defaultBaseSwitch} ${defaultSwitchColor}`,
    },
    themeSwitch: {
      thumb: themeBaseThumb,
      switch: themeBaseSwitch,
    },
  };
});

const currentStyle = computed(() => variantStyles.value[props.variant]);

const thumbPositionClass = computed(() => {
  const position = modelValue.value
    ? "left-[calc(100%-2px)] -translate-x-full"
    : "left-[2px]";

  return `${currentStyle.value.thumb} ${position}`;
});
</script>

<template>
  <label
    :for="inputId"
    class="flex items-center justify-between gap-3 cursor-pointer w-full"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
  >
    <slot name="label">
      <span
        v-if="props.label"
        class="select-none"
        :class="{ 'text-gray-400': disabled }"
      >
        {{ props.label }}
      </span>
    </slot>
    <div
      class="relative rounded-full transition-all duration-300"
      :class="currentStyle.switch"
    >
      <slot />
      <div
        class="absolute top-1/2 -translate-y-1/2 rounded-full transition-all
        duration-300 flex items-center justify-center"
        :class="thumbPositionClass"
      >
        <slot name="thumb-icon">
          <VIcon
            v-if="icon"
            :type="props.icon"
            size="w-5 h-5"
          />
        </slot>
      </div>
    </div>
    <input
      :id="inputId"
      v-model="modelValue"
      type="checkbox"
      class="hidden"
      :disabled="disabled"
    >
  </label>
</template>

