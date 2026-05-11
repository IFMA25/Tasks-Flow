<script setup lang="ts" generic="T extends Option">
import { computed } from "vue";
import Multiselect from "vue-multiselect";

import { Option } from "@/shared/types";
import VIcon from "@/shared/ui/common/VIcon.vue";

interface Props {
  id:string;
  options: T[];
  labelText?: string;
  multiple?: boolean;
  closeOnSelect?: boolean;
  openDirection?: "top" | "bottom";
  placeholder?: string;
  showLabels?: boolean;
  allowEmpty?: boolean;
  multiselectProps?: Record<string, unknown>;
  searchable?: boolean;
  label?: string;
  trackBy?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const {
  id = "select",
  labelText="",
  options = [],
  multiple = false,
  closeOnSelect: closeOnSelectProp,
  openDirection = "bottom",
  placeholder = "",
  showLabels = false,
  allowEmpty = false,
  multiselectProps = {},
  searchable = false,
  label,
  trackBy="key",
  disabled = false,
  size = "md",
} = defineProps<Props>();

const model = defineModel<string | string[] | null>();

const getKey = (option: T): string => String(option[trackBy ?? "key"]);

const internalModel = computed({
  get: () => {
    if (model.value == null) return multiple ? [] : null;

    if (multiple) {
      const values = Array.isArray(model.value) ? model.value : [model.value];
      return options.filter(option => values.includes(getKey(option)));
    }

    return options.find(option => getKey(option) === model.value) ?? null;
  },
  set: (value: T | T[] | null) => {
    if (value == null) {
      model.value = multiple ? [] : null;
      return;
    }

    if (Array.isArray(value)) {
      model.value = value.map(getKey);
    } else {
      model.value = getKey(value);
    }
  },
});

const closeOnSelectComputed = computed(() =>
  closeOnSelectProp ?? !multiple,
);
</script>

<template>
  <div class="flex gap-2 items-center text-[1rem] leading-6 text-primary">
    <label
      v-if="labelText"
      :for="id"
      class="whitespace-nowrap"
    >{{ labelText }}</label>
    <Multiselect
      :id="id"
      v-model="internalModel"
      v-bind="multiselectProps"
      :options="options"
      :multiple="multiple"
      :close-on-select="closeOnSelectComputed"
      :open-direction="openDirection"
      :placeholder="placeholder"
      :show-labels="showLabels"
      :allow-empty="allowEmpty"
      :searchable="searchable"
      aria-label="pick a value"
      :label="label"
      :track-by="trackBy"
      :disabled="disabled"
      :class="`multiselect--size-${size}`"
    >
      <template #caret="{ toggle }">
        <button
          type="button"
          class="multiselect__select"
          @mousedown.prevent.stop="toggle"
        >
          <VIcon
            type="icon-chevron-up"
            class="h-5 w-5 text-secondary rotate-180"
          />
        </button>
      </template>
    </Multiselect>
  </div>
</template>

<style scoped>
:deep(.multiselect) {
  @apply text-primary ;
  width: fit-content;
}

:deep(.multiselect__input) {
  @apply mb-0 p-0;
}

:deep(.multiselect__tags) {
  @apply min-h-8 border-borders rounded-lg leading-6
    focus:outline-none transition-colors duration-300
  ease-in-out text-primary bg-bgCards;
}

:deep(.multiselect__tags:focus-within) {
  @apply border-borderFocus rounded-lg;
}

:deep(.multiselect--size-sm .multiselect__tags) {
  @apply py-1.5 pl-[0.5rem] pr-[2.2rem];
}

:deep(.multiselect--size-md .multiselect__tags) {
  @apply py-3 pl-[0.625rem] pr-[2.4rem];
}


:deep(.multiselect__single),
:deep(.multiselect__placeholder) {
  @apply m-0 p-0 bg-transparent placeholder-disabled align-middle;
}

:deep(.multiselect__content-wrapper) {
  @apply min-w-full w-auto mt-[4px] rounded-lg border-borders bg-bgCards shadow-lg;
  border-top-style: solid;
  border-top-width: 2px;
}

:deep(.multiselect__select) {
  @apply h-full top-0 flex items-center justify-center;
}

:deep(.multiselect__select::before) {
  display: none;
}

:deep(.multiselect__element) {
  @apply w-full
}
:deep(.multiselect__option) {
  @apply w-full
}

:deep(.multiselect__option--highlight) {
  @apply bg-default text-primary;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  @apply  bg-transparent text-primaryText;
}

:deep(.multiselect__option--selected) {
  @apply  text-primaryText bg-bgCards;
}

:deep(.multiselect--active:not(.multiselect--above) .multiselect__tags) {
  @apply rounded-lg;
}

:deep(.multiselect--disabled) {
  @apply border-subtle text-disabled;
  pointer-events: none;
}

:deep(.multiselect--disabled .multiselect__select) {
  @apply bg-transparent;
}
</style>
