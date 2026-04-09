<script setup lang="ts">
import { ref, computed, useSlots } from "vue";

import VIcon from "./VIcon.vue";
import VSkeleton from "./VSkeleton.vue";

import { ValidationState } from "@/features/auth/types";

const props = withDefaults(defineProps<{
  type?: string;
  variant?: string;
  label?: string;
  placeholder?: string;
  supportText?: string;
  supportTextVariant?: "error" | "muted";
  validation?: ValidationState;
  iconLeft?: string;
  iconRight?: string;
  readonly?: boolean;
  loading?:boolean;
}>(), {
  type: "text",
  variant: "main",
  label: "",
  supportText: "",
  supportTextVariant: "muted",
  placeholder: "",
  validation: undefined,
  iconLeft: "",
  iconRight: "",
  readonly: false,
  loading: false,
});

const model = defineModel<string>();
const emit = defineEmits(["blur"]);

const visible = ref(false);

const handleToggle = () => {
  visible.value = !visible.value;
};

const slots = useSlots();

const inputStyles = {
  main: "bg-base rounded-lg border-2 border-default focus:border-2 focus:border-borderFocus focus:outline-none focus:bg-secondaryBg placeholder:text-muted text-primary leading-[1.3] hover:border-hover",
  error: "bg-base rounded-lg border-2 border-danger placeholder:text-muted text-primary leading-[1.3]",
  search: "max-w-[20rem] border-2 border-default rounded-lg placeholder-disabled focus:border-borderFocus focus:outline-none",
  readonly: "bg-base rounded-lg border-2 border-subtle placeholder:text-subtle text-primary leading-[1.3] cursor-default",
};

const hasError = computed(() => props.validation?.$error ?? false);

const errorMessage = computed(() => {
  return props.validation?.$errors?.[0]?.$message ?? "";
});


const inputClass = computed(() => {
  const hasLeft = !!slots["icon-left"] || props.iconLeft;
  const hasRight = !!slots["icon-right"] || props.iconRight || props.type === "password";
  const paddingClass = [
    hasLeft ? "pl-11" : "",
    hasRight ? "pr-11" : "",
  ].join(" ");

  const stylesClass = hasError.value ?
    inputStyles.error
    : inputStyles[props.variant];

  const disabledClass = props.readonly ? inputStyles.readonly : inputStyles[props.variant];
  return `${paddingClass} ${stylesClass} ${disabledClass}`;

});
</script>

<template>
  <label
    class="block "
    v-bind="$attrs"
  >
    <p
      v-if="props.label"
      class="leading-[1.2] font-medium mb-1.5"
      :class="hasError ? 'text-danger' : ''"
    >{{ props.label }}</p>
    <div class="relative">
      <div
        v-if="props.iconLeft"
        class="absolute left-4 top-1/2 -translate-y-1/2 flex justify-center items-center"
      >
        <VIcon
          v-if="!$slots['icon-left']"
          :type="props.iconLeft"
          class="w-4 h-4 text-muted"
        />
        <slot
          v-else-if="$slots['icon-left']"
          name="icon-left"
        />
      </div>
      <VSkeleton
        v-if="props.loading"
        height="h-12"
        width="w-full"
      />
      <input
        v-else
        v-model.trim="model"
        :type="props.type === 'password'
          ? (visible ? 'text' : 'password')
          : props.type"
        class="w-full bg-secondaryBg outline-none
        focus:outline-none  transition-all duration-300 px-4 py-3"
        :class="inputClass"
        :placeholder="props.placeholder"
        name="input"
        :readonly="props.readonly"
        @blur="emit('blur')"
      >
      <button
        v-if="props.type === 'password'"
        type="button"
        class="absolute leading-none top-1/2 -translate-y-1/2 right-4
        bg-transparent text-muted hover:text-secondary
        transition-colors duration-200"
        @click="handleToggle"
      >
        <VIcon
          :type="visible ? 'icon-eye' : 'icon-eye-off'"
        />
      </button>
      <div
        class="absolute top-1/2 -translate-y-1/2 right-4 text-muted
      hover:text-secondary transition-colors duration-200"
      >
        <VIcon
          v-if="props.iconRight && props.type !== 'password' && !$slots['icon-right']"
          :type="props.iconRight"
        />
        <slot
          v-else-if="$slots['icon-right']"
          name="icon-right"
        />
      </div>
    </div>
    <p
      v-if="hasError || props.supportText"
      class="text-sm mt-1"
      :class="hasError || props.supportTextVariant === 'error' ? 'text-danger' : 'text-mutedText'"
    >
      {{ hasError ? errorMessage : props.supportText }}
    </p>
  </label>
</template>
